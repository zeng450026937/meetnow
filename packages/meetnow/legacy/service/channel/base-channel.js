import Vue from '../../vue/index';
import Analysis from '../../utils/browser-analysis';
import adjustSdp from '../../utils/sdp/modify';
import EVENTS from '../../constants/events';

const BaseChannel = Vue.extend({
  data() {
    return {
      pc                  : null,
      type                : '',
      status              : '',
      remoteStream        : null,
      localDesc           : null,
      remoteDesc          : null,
      offerToReceiveVideo : true,
      offerToReceiveAudio : true,

      // private attr
      gatherCandidateTimeout          : null,
      gatherCandidateFinished         : false, // timeout or complete
      gatherCandidateCompleteCallback : null,
    };
  },
  computed : {
    constraints() {
      return {
        offerToReceiveVideo : this.offerToReceiveVideo,
        offerToReceiveAudio : this.offerToReceiveAudio,
      };
    },
    configuration() {
      return {
        sdpSemantics : 'plan-b', // '' unified-plan plan-b
        iceServers   : [{ urls: 'stun:stun.l.google.com:19302' }],
      };
    },
    localStream() {
      return this.media && this.media.stream;
    },
  },
  methods : {

    createOffer() { // 创建 Offer
      this.$log.info('createOffer()');

      this.gatherCandidateFinished = false;

      return this.pc.createOffer(this.constraints)
        .then(this.setLocalDesc)
        .catch(this.onCreateOfferError);
    },
    renegotiate() { // 重协商
      if (!this.gatherCandidateFinished) return Promise.reject();

      return this.createOffer().then(this.afterRenegotiatePrepared);
    },

    createConnection() {
      this.$log.info('createConnection()');
      if (this.pc) return Promise.resolve();

      const noConfig = Analysis.isChrome && Analysis.chromeVersion < 56;
      const noTrackMethod = Analysis.isChrome && Analysis.chromeVersion < 64;

      this.pc = new RTCPeerConnection(noConfig ? undefined : this.configuration);

      // add event listener
      this.pc.onicecandidate = this.onIcecandidate;
      this.pc.onicegatheringstatechange = this.onIceGatheringStateChange;
      this.pc.oniceconnectionstatechange = this.onIceConnectionStateChange;

      if (!noTrackMethod) {
        this.pc.ontrack = this.setTrack;
        if (this.localStream) {
          this.localStream.getTracks().forEach((track) => this.pc.addTrack(track, this.localStream));
        }
      }
      else {
        this.pc.onaddstream = this.onAddStream;
        if (this.localStream) this.pc.addStream(this.localStream);
      }

      return Promise.resolve();
    },
    updateConnection() {
      console.warn('updateConnection()');
      if (!this.pc) return;
      if (this.pc.getLocalStreams().length === 0 && this.localStream) {
        this.addLocalStream(this.localStream);

        return this.renegotiate().then(() => this.afterConnectionUpdated());
      }

      return this.resetLocalStream(this.localStream).then(() => this.afterConnectionUpdated());
    },

    closeConnection() {
      this.$log.info('closeConnection()');

      if (this.pc) {
        this.pc.removeEventListener('track', this.setTrack);
        this.pc.removeEventListener('addstream', this.onAddStream);
        this.pc.removeEventListener('icegatheringstatechange', this.onIceGatheringStateChange);
        this.pc.removeEventListener('iceconnectionstatechange', this.onIceConnectionStateChange);
        this.pc.close();
      }

      this.localDesc = null;
      this.remoteDesc = null;

      this.gatherCandidateFinished = false;
      this.gatherCandidateCompleteCallback = null;
      if (this.gatherCandidateTimeout) {
        clearTimeout(this.gatherCandidateTimeout);
        this.gatherCandidateTimeout = null;
      }

      this.remoteStream = null;
      this.pc = null;

      if (this.localStream) this.media.releaseStream();
    },
    renewConnection() {
      this.$log.info('renewConnection()');
      this.closeConnection();
      this.createConnection();
    },

    // Stream
    resetLocalStream(stream, forceRenegotiation = false) {
      console.warn('resetLocalStream()', stream);

      if (!this.pc) return;
      const audioTrack = stream ? stream.getAudioTracks()[0] : null;
      const videoTrack = stream ? stream.getVideoTracks()[0] : null;
      const promiseQueue = [];

      let needRenegotiation = false;

      const senders = this.pc.getSenders();

      if (Array.isArray(senders)) {
        let peerHasAudio = false;

        let peerHasVideo = false;

        senders.forEach((sender) => {
          if (!sender.track) return;
          peerHasAudio = sender.track.kind === 'audio' ? true : peerHasAudio;
          peerHasVideo = sender.track.kind === 'video' ? true : peerHasVideo;
        });

        needRenegotiation = !!audioTrack !== peerHasAudio || !!videoTrack !== peerHasVideo || forceRenegotiation;
        this.$log.debug('需要重协商: ', needRenegotiation);

        if (needRenegotiation && Analysis.isChrome) {
          this.removeLocalStream();
          this.addLocalStream(stream);
          promiseQueue.push(this.renegotiate());
        }
        else {
          promiseQueue.push(needRenegotiation
            ? this.handlerUnableRenegotiate(stream)
            : this.replaceLocalStream(stream));
        }
      }

      return Promise.all(promiseQueue);
    },
    removeLocalStream() { // 并不会将localStream移除
      console.warn('removeLocalStream()');
      if (!this.pc) return;

      const noTrackMethod = Analysis.isChrome && Analysis.chromeVersion < 64;

      if (!noTrackMethod) {
        this.pc.getSenders().forEach((sender) => {
          if (sender.track) sender.track.stop();
          this.pc.removeTrack(sender);
        });
      }
      else {
        this.pc.getLocalStreams().forEach((stream) => {
          stream.getTracks().forEach((track) => track.stop());
          this.pc.removeStream(stream);
        });
      }
    },

    addLocalStream(stream) {
      console.warn('addLocalStream()');
      if (!this.pc || !stream) return;

      if (this.pc.addTrack) stream.getTracks().forEach((track) => this.pc.addTrack(track, stream));
      else if (this.pc.addStream) this.pc.addStream(stream);
    },
    replaceLocalStream(stream) {
      console.warn('replaceLocalStream()', stream);
      if (!this.pc) return;

      const senders = this.pc.getSenders();
      const promiseQueue = [];

      const replaceSSRCs = (currentDescription, newDescription) => {
        let ssrcs = currentDescription.match(/a=ssrc-group:FID (\d+) (\d+)\r\n/);

        let newssrcs = newDescription.match(/a=ssrc-group:FID (\d+) (\d+)\r\n/);

        if (!ssrcs) { // Firefox offers wont have FID yet
          ssrcs = currentDescription.match(/a=ssrc:(\d+) cname:(.*)\r\n/g)[1]
            .match(/a=ssrc:(\d+)/);
          newssrcs = newDescription.match(/a=ssrc:(\d+) cname:(.*)\r\n/g)[1]
            .match(/a=ssrc:(\d+)/);
        }
        for (let i = 1; i < ssrcs.length; i++) {
          newDescription = newDescription.replace(new RegExp(newssrcs[i], 'g'), ssrcs[i]);
        }

        return newDescription;
      };
      const shimReplaceTrack = (sender) => {
        sender.replaceTrack = (newTrack) => new Promise(
          (resolve, reject) => {
            this.pc.removeTrack(sender);
            this.pc.addTrack(newTrack, stream);

            // return this.pc.createOffer()
            //   .then((offer) => {
            //     offer.type = this.pc.localDescription.type;
            //     offer.sdp = replaceSSRCs(this.pc.localDescription.sdp, offer.sdp);
            //
            //     return this.pc.setLocalDescription(offer);
            //   })
            //   .then(() => this.pc.setRemoteDescription(this.remoteDesc))
            // TODO Work ?
            return this.createOffer().then(resolve).catch(reject);
          },
        );
      };

      const audioTrack = stream ? stream.getAudioTracks()[0] : null;
      const videoTrack = stream ? stream.getVideoTracks()[0] : null;

      if (Array.isArray(senders)) {
        senders.forEach((sender) => {
          if (!sender.track) return;
          if (!sender.replaceTrack) {
            shimReplaceTrack(sender);
          }
          if (audioTrack && sender.track.kind === 'audio') {
            promiseQueue.push(sender.replaceTrack(audioTrack).catch((e) => {
              this.$log.error('Replace audio track error: %o', e);
            }));
          }
          if (videoTrack && sender.track.kind === 'video') {
            promiseQueue.push(sender.replaceTrack(videoTrack).catch((e) => {
              this.$log.error('Replace video track error: %o', e);
            }));
          }
        });
      }

      return Promise.all(promiseQueue);
    },

    // SDP
    async setLocalDesc(desc) { // 设置local description
      this.$log.info('setLocalDesc()');

      desc = await this.pc.setLocalDescription(desc).then(() => {
        this.$log.info('setLocalDesc()', this.pc.iceGatheringState);
        if (this.pc.iceGatheringState === 'complete') {
          this.gatherCandidateFinished = true;

          return this.pc.localDescription;
        }

        return new Promise((resolve) => this.gatherCandidateCompleteCallback = resolve);
      });

      return this.localDesc = this.adjustSdp(Object.assign(desc, { originator: 'local' }));
    },

    adjustSdp(data) { // 调整 SDP
      const constraints = this.media.constraints.video;

      return adjustSdp(data, {
        type             : this.type,
        isEducation      : false,
        iceTimeOut       : this.gatherCandidateCompleteCallback,
        videoConstraints : constraints,
      });
    },

    // Event
    setTrack(event) { // 远程流被添加
      this.$log.info('setTrack()');
      if (this.remoteStream !== event.streams[0]
        && event.track.readyState !== 'ended') {
        this.remoteStream = event.streams[0];
      }
    },

    onAddStream(event) { // 远程流被添加
      this.$log.info('addStream()');
      if (this.remoteStream !== event.stream
        && event.stream.active !== false) {
        this.remoteStream = event.stream;
      }
    },

    onIceGatheringStateChange() {
      this.$log.info('onIceGatheringStateChange()', this.pc.iceGatheringState, this.pc.iceConnectionState);

      this.gatherCandidateFinished = this.pc.iceGatheringState === 'complete';

      if (!this.gatherCandidateFinished && !this.gatherCandidateTimeout) {
        this.gatherCandidateTimeout = setTimeout(() => {
          this.$log.info('ICE gathering timeout, prepared to send...');
          this.gatherCandidateFinished = true;
        }, 3000);
      }
    },
    onIcecandidate(candidate) {
      this.$log.info(candidate);
      this.onIceGatheringStateChange();
    },

    onIceConnectionStateChange() {
      const state = this.pc.iceConnectionState;

      this.$log.info('onIceConnectionStateChange()', state);

      if (state === 'disconnected') this.closeConnection();
      this.$emit(EVENTS.CHANNEL_STATE_CHANGED, { ctx: this, state });
    },

    // Error Handler
    onCreateOfferError(error) {
      this.$log.debug(error);
    },

    // Hook
    afterRenegotiatePrepared(data) { return Promise.resolve(data); },
    afterConnectionUpdated(data) { return Promise.resolve(data); },
    handlerUnableRenegotiate(stream) {
      return this.replaceLocalStream(stream);
    },
  },
  watch : {
    gatherCandidateFinished(finished) {
      this.$log.info('gatherCandidateFinished()', finished);
      if (!finished) return;
      if (this.gatherCandidateCompleteCallback) {
        this.$log.info('gathering candidate complete, prepared to send sdp');
        this.gatherCandidateCompleteCallback({ type: 'offer', sdp: this.pc.localDescription.sdp });
        this.gatherCandidateCompleteCallback = null;
      }
      if (this.gatherCandidateTimeout) {
        clearTimeout(this.gatherCandidateTimeout);
        this.gatherCandidateTimeout = null;
      }
    },
  },
});

export default BaseChannel;
