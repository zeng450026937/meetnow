import Vue from '../../vue/index';
import BaseChannel from './base-channel';
import { isSuccess } from '../../utils/index';
import ERRORS from '../../constants/errors';

const ShareChannel = Vue.extend({
  name    : 'ShareChannel',
  extends : BaseChannel,
  data() {
    return {
      type                : 'slides',
      mediaVersion        : 1,
      offerToReceiveVideo : true,
      offerToReceiveAudio : false,
    };
  },
  computed : {
    media() {
      return this.$root.media.screenMedia;
    },
  },
  methods : {
    // Create sharing channel when join conference
    async joinSharing() {
      this.offerToReceiveVideo = true;
      this.createConnection();

      return this.createOffer().then(() => this.connectServer());
    },

    async reJoinSharing() {
      return this.closeSharing().then(() => this.joinSharing());
    },

    exitSharing() {
      return this.closeSharing();
    },

    // just stop sharing , not connection
    async stopSharing() {
      if (this.localStream) this.media.releaseStream();

      await this.switchSharing(false);
      this.offerToReceiveVideo = true;

      return this.updateConnection();
    },

    // close sharing including connection
    closeSharing() {
      if (this.localStream) this.media.releaseStream();

      this.closeConnection();

      return this.switchSharing(false)
        .then(() => this.byeSharing());
    },
    async recvSharing() {
      return this.stopSharing();
    },
    // user should promise that not receiving sharing
    async sendSharing() {
      await this.media.acquireStream();

      const canShare = await this.switchSharing();

      if (!canShare) {
        this.media.releaseStream();

        return Promise.reject(ERRORS.CANNOT_SHARE);
      }

      this.offerToReceiveVideo = false;

      // TODO TEMP SOLUTION
      if (!this.pc) await this.joinSharing();

      return this.updateConnection()
        .then(() => this.remoteStream = null);
    },

    async connectServer() { // joinApplicationSharing
      this.$log.info('connectServer()');
      this.$log.log('local sdp: ', this.localDesc.sdp);

      const result = await this.$api.joinApplicationSharing({
        sdp : this.localDesc.sdp,
      });

      if (!result
        || result.ret === -1
        || !isSuccess(result.bizCode)) return Promise.reject(ERRORS.CONNECT_ERROR);

      if (result.data['media-version']) this.mediaVersion = result.data['media-version'];

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
      this.$log.log('local sdp: ', this.localDesc.sdp);
      const result = await this.$api.renegApplicationSharing({
        sdp          : this.localDesc.sdp,
        mediaVersion : this.mediaVersion,
      });

      if (!result || result.ret === -1) {
        return Promise.reject(ERRORS.RENEG_ERROR);
      }
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

    async handlerUnableRenegotiate() {
      return this.reJoinSharing();
    },

    async switchSharing(toShare = true) {
      this.$log.info('switchSharing()', toShare);

      const result = await this.$api.switchApplicationSharing({ share: toShare })
        .catch((error) => error);

      if (!toShare) return;

      if (!result || result.ret === -1 || !result.data) return false;

      return result.data['share-state'] === 'recv'; // 服务器是否可以接受
    },

    byeSharing() {
      return this.$api.byeApplicationSharing();
    },
  },
});

export default ShareChannel;
