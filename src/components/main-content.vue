<template>
  <div class="main">
    <div class="main-left">
      <div class="video__view">
        <video
          class="video-content"
          :class="{'video-content--disconnected': !connected && !mediaConnected}"
          ref="video"
          autoplay
          playsinline
          muted
          loop="loop"
          :style="{ objectFit }"
        ></video>
      </div>
      <main-form
        v-show="!connected && !mediaConnected"
        @joinConf="joinConf"
      ></main-form>
      <div
        class="remote-video__view"
        v-show="connected && sharing"
        @click="setRemoteStream"
      >
        <video
          class="video-content"
          ref="remoteVideo"
          autoplay
          playsinline
          loop="loop"
        ></video>
      </div>
      <div
        class="local-video__view"
        v-show="connected"
      >
        <video
          class="video-content"
          :class="{'video-content--disconnected': !connected}"
          ref="localVideo"
          autoplay
          playsinline
          muted
          loop="loop"
        ></video>
        <img
          class="video-close-img"
          :class="{'video-close-img--acitve': !localStream}"
          v-show="!localStream"
          src="../assets/camera_mute.jpg"
          draggable="false"
        >
      </div>

    </div>
    <div
      class="main-right"
      v-if="connected && mediaConnected"
    >
      <member
        :users="users"
        :hasPermission="hasPermission"
        :speakMode="speakMode"
        @onQuitClick="onQuitClick"
      ></member>
    </div>
    <loading :loading="loading"></loading>
  </div>
</template>

<script>
import MainForm from './main-form.vue';
import Member from './member.vue';
import Loading from './loading.vue';

export default {
  name : '',

  components : {
    MainForm,
    Member,
    Loading,
  },

  props : {
    ua : {
      type    : Object,
      default : () => { },
    },
  },

  data() {
    return {
      confStatus    : 'disconnected', // connecting connected disconnecting disconnected
      mediaStatus   : 'ended', // ended connected
      user          : null,
      users         : null,
      hasPermission : false,
      sharing       : false,

      presenterList  : [],
      attendeeList   : [],
      castviewerList : [],
      handupList     : [],
      onholdList     : [],
      speakMode      : 'free',

      localStream : true,
      mute        : false,
    };
  },

  computed : {
    loading() {
      const loading = this.disconnected ? false : this.connecting || !this.mediaConnected;
      return loading;
    },
    connecting() {
      return this.confStatus === 'connecting';
    },
    disconnected() {
      return this.confStatus === 'disconnected';
    },
    connected() {
      return this.confStatus === 'connected';
    },

    mediaConnected() {
      return this.mediaStatus === 'connected';
    },

    objectFit() {
      return this.connected ? 'contain' : 'cover';
    },
  },

  created() {

  },

  mounted() {
    this.initLocalStream();
  },

  methods : {
    initLocalStream() {
      const constraints = {
        audio : true,
        video : true,
      };

      navigator
        .mediaDevices
        .getUserMedia(constraints)
        .then((mediaStream) => {
          const { video } = this.$refs;

          video.srcObject = mediaStream;
          video.onloadedmetadata = function (e) {
            video.play();
          };
        })
        .catch((error) => {
          console.error(error);
        });
    },

    initRemoteStream(conf) {
      const { video } = this.$refs;
      const mediaStream = conf.mediaChannel.getRemoteStream();

      video.srcObject = mediaStream;
    },

    initShareStream(conf) {
      console.warn('shareChannel.getRemoteStream()', conf.shareChannel.getRemoteStream());

      const { video, remoteVideo } = this.$refs;
      const mediaStream = conf.mediaChannel.getRemoteStream();
      const shareStream = conf.shareChannel.getRemoteStream();


      video.srcObject = shareStream;
      remoteVideo.srcObject = mediaStream;
    },


    setRemoteStream() {

    },

    async joinConf(data) {
      // const conf = await this.ua.connect({ number: '666666.66666' });
      const {
        number,
        password,
        displayName,
      } = data;
      if (!this.ua) return;
      this.conf = null;

      const conf = await this.ua.connect({
        number,
        password,
        displayName,
      });

      this.initBindEvent(conf);

      await conf.join();

      if (conf.mediaChannel) await conf.mediaChannel.connect();
      if (conf.shareChannel) await conf.shareChannel.connect({ mediaConstraints: {} });

      this.conf = conf;
      window.conf = conf;
    },

    onQuitClick() {
      if (!this.conf) return;

      if (this.hasPermission) this.conf.end();
      else this.conf.leave();
    },

    initBindEvent(conf) {
      conf.on('connecting', () => {
        this.confStatus = 'connecting';
        console.warn('connecting');
      });
      conf.on('disconnecting', () => {
        this.confStatus = 'disconnecting';
        console.warn('disconnecting');
      });

      conf.on('disconnected', () => {
        this.confStatus = 'disconnected';
        console.warn('disconnected');
        this.conf = null;
        this.initLocalStream();
      });

      conf.on('error', () => {
        console.warn('error');
      });

      conf.on('connected', () => {
        this.confStatus = 'connected';
        if (conf.view) {
          this.speakMode = conf.view.getLayout()['speak-mode'] || 'free';
        }
        console.warn('connected');

        // users
        conf.users.on('updated', (data) => {
          console.warn('updated', data);
          if (!this.use && conf.user) {
            this.user = conf.user;
            this.hasPermission = this.user.isOrganizer() || this.user.isPresenter();
          }
          this.users = conf.users;
        });
        conf.users.on('user:added', () => {
          console.warn('user:added');
          this.users = conf.users;
        });
        conf.users.on('user:updated', () => {
          console.warn('user:updated');
        });
        conf.users.on('user:deleted', () => {
          console.warn('user:deleted');
          this.users = conf.users;
        });

        // view
        conf.view.on('updated', (data) => {
          console.warn('view -> updated', data);
          this.speakMode = data.getLayout()['speak-mode'] || 'free';
        });
        conf.view.on('focusUserEntityChanged', (data) => {
          console.warn('view -> focusUserEntityChanged', data);
        });


        // mediaChannel
        conf.mediaChannel.on('connected', () => {
          this.mediaStatus = 'connected';
          console.warn('mediaChannel - connected');
        });
        conf.mediaChannel.on('ended', () => {
          this.mediaStatus = 'ended';
          console.warn('mediaChannel - ended');
        });
        conf.mediaChannel.on('localstream', (stream) => {
          console.warn('localstream');
          const { localVideo } = this.$refs;

          localVideo.srcObject = stream;
          localVideo.onloadedmetadata = function (e) {
            localVideo.play();
          };
        });
        conf.mediaChannel.on('remotestream', () => {
          console.warn('remotestream');

          this.initRemoteStream(conf);
        });

        // shareChannel
        conf.shareChannel.on('connected', () => {
          console.warn('shareChannel - connected');
        });
        conf.shareChannel.on('ended', () => {
          console.warn('shareChannel - ended');
        });
        conf.shareChannel.on('localstream', () => {
          console.warn('shareChannel - localstream');
        });
        conf.shareChannel.on('remotestream', () => {
          console.warn('shareChannel - remotestream', conf.state.getSharingUserEntity());

          if (conf.state.getSharingUserEntity() !== null) {
            this.sharing = true;
            this.initShareStream(conf);
          }
        });

        conf.chatChannel.on('ready', () => {
          console.warn('chatChannel - ready');
        });
        conf.chatChannel.on('connected', () => {
          console.warn('chatChannel - connected');
        });
        conf.chatChannel.on('disconnected', () => {
          console.warn('chatChannel - disconnected');
        });
        conf.chatChannel.on('message', (data) => {
          console.warn('chatChannel - message', data);
        });
      });

      // currentUser
      conf.on('user', (data) => {
        console.warn('user', data);

        this.users = conf.users;

        this.localStream = !data.isVideoBlocked();
        this.mute = data.isAudioBlocked();

        // const video = this.data.checkboxOptions[0].checked;
        // const audio = this.data.checkboxOptions[1].checked;

        setTimeout(() => {
          // conf.setVideoFilter(false);
          console.log('getEndpoint', conf.user.getEndpoint());
          // console.log(conf.user.setVideoFilter(false));
        }, 1000);
        // if (video === false) {
        // data.setVideoFilter(false);
        // }
        // if (audio === false && !conf.user.isAudioBlocked()) {
        // data.setAudioFilter(false);
        // }

        console.log('localStream', this.localStream, 'mute', this.mute);


        conf.user.on('updated', (data) => {
          console.warn('updated', data);
        });
        conf.user.on('displayTextChanged', () => {
          console.warn('displayTextChanged');
        });
        conf.user.on('roleChanged', () => {
          console.warn('roleChanged');
          this.hasPermission = this.user.isOrganizer() || this.user.isPresenter();
        });
        conf.user.on('holdChanged', () => {
          console.warn('holdChanged');
        });
        conf.user.on('handupChanged', (data) => {
          console.warn('handupChanged', data);
        });
        conf.user.on('audioChanged', () => {
          console.warn('audioChanged');
          this.mute = !data;
        });
        conf.user.on('videoChanged', (data) => {
          console.warn('videoChanged');
          this.localStream = data;
        });
        conf.user.on('mediaChanged', (data) => {
          console.warn('mediaChanged', data);
        });
        conf.user.on('sharingChanged', (data) => {
          console.warn('sharingChanged', data);
        });
      });

      conf.on('sharinguser', (data) => {
        console.warn('sharinguser', data);

        this.sharing = !!data;
        if (this.sharing) {
          this.initShareStream(conf);
        } else {
          this.initRemoteStream(conf);
        }
      });

      conf.on('speechuser', () => {
        console.warn('speechuser');
      });

      conf.on('added', () => {
        console.warn('added');
      });

      conf.on('updated', () => {
        console.warn('updated');
      });

      conf.on('deleted', () => {
        console.warn('deleted');
      });

      conf.on('information', () => {
        console.warn('information');
      });

      conf.on('message', () => {
        console.warn('message');
      });
    },
  },

  watch : {

  },
};
</script>

<style lang="scss" scoped>
.main {
  position: relative;
  display: flex;

  align-items: center;
  justify-content: flex-end;

  width: 100%;
  height: 100%;

  .main-left {
    height: 100%;
    position: relative;
    flex-grow: 1;
  }

  .main-right {
    flex-shrink: 0;
    width: 360px;
    height: 100%;
    border-left: 1px solid #ebebeb;
  }

  .video__view {
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    z-index: -1;

    .video-content {
      width: 100%;
      height: 100%;
    }
  }

  .video-content--disconnected {
    filter: blur(15px);
  }

  .remote-video__view,
  .local-video__view {
    width: 352px;
    height: 198px;
    position: absolute;
    right: 0;
    bottom: 10px;
    z-index: 2;
    background-color: #000;
    user-select: none;

    .video-content {
      width: 100%;
      height: 100%;
      object-fit: contain;
    }
    .video-close-img {
      width: 100%;
      height: 100%;
      position: absolute;
      top: 0;
      right: 0;
      bottom: 0;
      left: 0;
    }
  }

  .remote-video__view {
    left: 0;
  }
}
</style>
