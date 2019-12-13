import { debounce } from '../../vue/src/shared/util';
import Vue from '../../vue/index';
import BaseChannel from './base-channel';
import { isSuccess } from '../../utils/index';
import ERRORS from '../../constants/errors';

const MediaChannel = Vue.extend({
  name    : 'MediaChannel',
  extends : BaseChannel,
  data() {
    return {
      type                : 'main',
      mcuCallId           : '',
      videoMuted          : false,
      audioMuted          : false,
      offerToReceiveVideo : true,
      offerToReceiveAudio : true,
      mediaVersion        : 1,
    };
  },
  computed : {
    media() {
      return this.$root.media.deviceMedia;
    },
  },
  methods : {
    joinMedia() {
      this.$log.info('joinMedia()');

      return this.media.acquireStream()
        .then(this.createConnection)
        .then(this.createOffer)
        .then(this.connectServer)
        .catch((error) => Promise.reject(error));
    },
    reJoinMedia() {
      return this.exitMedia().then(() => this.joinMedia());
    },

    exitMedia() {
      this.$log.info('exitMedia()');

      return Promise.resolve().then(() => this.closeConnection());
    },

    toggleVideo(params) {
      if (!(this.localStream && params.device)) return;
      const videoTrack = this.localStream.getVideoTracks()[0];

      this.videoMuted = params.mute != null ? params.mute : videoTrack.enabled;
      this.localStream.muteVideo(this.videoMuted);
    },

    toggleAudio(params) {
      if (!(this.localStream && params.device)) return;
      const audioTrack = this.localStream.getAudioTracks()[0];

      this.audioMuted = params.mute != null ? params.mute : audioTrack.enabled;
      this.localStream.muteAudio(this.audioMuted);
    },

    // Inner
    async connectServer() {
      this.$log.info('connectServer()');
      this.$log.log('Local SDP: ', this.localDesc.sdp);

      const { userInfo, server } = this.$root.ua;
      const { number, password, displayText } = userInfo;

      const params = {
        number,
        password,
        displayText,
        server,
        sdp : this.localDesc.sdp,
      };

      const result = await this.$api.joinMedia(params)
        .catch(() => Promise.reject(ERRORS.CONNECT_ERROR));

      if (!result
        || result.ret === -1
        || !isSuccess(result.bizCode)) return Promise.reject(ERRORS.CONNECT_ERROR);

      if (result.data['media-version']) this.mediaVersion = result.data['media-version'];
      this.mcuCallId = result.data['mcu-callid'];
      this.$log.info('mcuCallId: ', this.mcuCallId);

      const raw = {
        sdp        : result.data.sdp,
        originator : 'remote',
        type       : 'answer',
      };

      this.remoteDesc = this.adjustSdp(raw);

      this.$log.log('Remote SDP: ', this.remoteDesc.sdp);

      return this.pc.setRemoteDescription(this.remoteDesc);
    },

    async afterRenegotiatePrepared() {
      this.$log.info('afterRenegotiatePrepared()');
      this.$log.log('Local SDP: ', this.localDesc.sdp);

      const params = {
        sdp          : this.localDesc.sdp,
        mediaVersion : this.mediaVersion,
      };
      const result = await this.$api.renegotiate(params)
        .catch(() => Promise.reject(ERRORS.RENEG_ERROR));

      if (!result || result.ret === -1) return Promise.reject(ERRORS.RENEG_ERROR);

      if (!isSuccess(result.bizCode)) {
        return Promise.reject(
          result.bizCode === 901326
            ? ERRORS.RENEG_ERROR : ERRORS.VERSION_ERROR,
        );
      }

      const raw = {
        sdp        : result.data.sdp,
        originator : 'remote',
        type       : 'answer',
      };

      this.remoteDesc = this.adjustSdp(raw);

      this.$log.log('Remote SDP: ', this.remoteDesc.sdp);

      return this.pc.setRemoteDescription(this.remoteDesc);
    },
  },
  watch : {
    localStream() {
      if (this.pc) debounce(this.updateConnection, 500)();
    },
  },
});

export default MediaChannel;
