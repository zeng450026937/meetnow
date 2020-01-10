<template>
  <div class="member-item">
    <div class="item__info">
      <div class="info__avatar">
        <span
          class="member__icon member__share-icon"
          v-show="sharing"
        >
          <icon-font
            type="iconmember_list_share_screen"
            size="12"
          ></icon-font>
        </span>
        <span
          class="member__icon member__mute-icon"
          v-show="false"
        >
          <icon-font
            type="iconmember_list_close_tone"
            size="12"
          ></icon-font>
        </span>
      </div>
      <div class="info__text">
        <span class="display-text">
          {{item.getDisplayText()}} {{ item.isCurrent() ? '(自己)' : '' }}
        </span>
        <span class="display-number">
          {{item.data['display-number']}}
        </span>
      </div>
    </div>
    <div
      class="item__control"
      v-show="displayControl"
    >
      <span
        class="control-button"
        :class="{'control-button--disabled': disabled}"
        v-if="displayMedia"
        @click="setMediaFilter('video')"
      >
        <icon-font
          :type="videoIcon.icon"
          size="16"
          :style="{color: videoIcon.color}"
        ></icon-font>
      </span>
      <span
        class="control-button"
        v-else
        @click="handleSuccessBtn"
      >
        <icon-font
          type="icontips_success"
          size="16"
          :style="{color: '#44b549'}"
        ></icon-font>
      </span>

      <span
        class="control-button"
        :class="{'control-button--disabled': disabled}"
        v-if="displayMedia"
        @click="setMediaFilter('audio')"
      >
        <icon-font
          :type="audioIcon.icon"
          size="16"
          :style="{color: audioIcon.color}"
        ></icon-font>
      </span>
      <span
        class="control-button"
        v-else
        @click="handleFailBtn"
      >
        <icon-font
          type="icontips_fail"
          size="16"
          :style="{color: '#333'}"
        ></icon-font>
      </span>
    </div>
  </div>
</template>

<script>
export default {
  name : 'MemberItem',

  components : {

  },

  props : {
    item : {
      type    : Object,
      default : () => { },
    },

    hasPermission : {
      type    : Boolean,
      default : false,
    },

    speakMode : {
      type    : String,
      default : 'free',
    },

    memberType : {
      type    : String,
      default : 'member', // member onHold handUp
    },
  },

  data() {
    return {
      video     : true,
      audio     : true,
      media     : true,
      sharing   : false,
      isOnHold  : false,
      isHandUp  : false,
      isCurrent : false,
    };
  },

  computed : {
    videoIcon() {
      const icon = this.video ? {
        icon  : 'iconvideo_on',
        color : '',
      } : {
        icon  : 'iconvideo_off',
        color : '#FF5050',
      };
      return icon;
    },
    audioIcon() {
      const {
        speakMode, hasPermission, audio, isCurrent, isHandUp,
      } = this;
      let icon;

      if (speakMode === 'hand-up') {
        icon = hasPermission
          ? isCurrent
            ? audio ? { icon: 'iconunmute', color: '' } : { icon: 'iconmute', color: '#FF5050' }
            : isHandUp
              ? { icon: 'iconmember_list_raise_hands1', color: '#10C29B' }
              : audio ? { icon: 'iconunmute', color: '' } : { icon: 'iconmute', color: '#FF5050' }
          : isCurrent
            ? isHandUp
              ? { icon: 'icontalk_cancel_raise_hands', color: '#FF5050' }
              : audio ? { icon: 'iconunmute', color: '' } : { icon: 'icontalk_raise_hands', color: '#10C29B' }
            : isHandUp
              ? { icon: 'icontalk_raise_hands', color: '#10C29B' }
              : audio ? { icon: 'iconunmute', color: '' } : { icon: 'iconmute', color: '#FF5050' };
      } else {
        icon = audio
          ? { icon: 'iconunmute', color: '' }
          : { icon: 'iconmute', color: '#FF5050' };
      }

      return icon;
    },

    disabled() {
      return !this.hasPermission && !this.item.isCurrent();
    },

    displayControl() {
      return this.hasPermission || this.memberType === 'member';
    },

    displayMedia() {
      return !this.hasPermission || this.memberType === 'member';
    },
  },

  created() {
    const user = this.item;
    this.initStatus(user);
    this.initBindEvent(user);
  },

  mounted() {
    const user = this.item;
  },

  beforeDestroy() {
    const user = this.item;
    this.offUserEvent(user);
  },

  methods : {
    initStatus(user) {
      this.video = !user.isVideoBlocked();
      this.audio = !user.isAudioBlocked();
      this.media = user.hasMedia();
      this.isCurrent = user.isCurrent();
      this.sharing = user.isSharing();
      this.isOnHold = user.isOnHold();
      this.isHandUp = user.isHandup();
    },

    displayTextChanged() {
      console.debug(this.item.getDisplayText(), ' -> displayTextChanged');
    },

    roleChanged() {
      this.$emit('updateList');
      console.debug(this.item.getDisplayText(), ' -> roleChanged');
    },

    holdChanged(data) {
      this.$emit('updateList');
      console.debug(this.item.getDisplayText(), ' -> holdChanged', data);
      this.isOnHold = data;
    },

    handupChanged(data) {
      this.$emit('updateList');
      console.debug(this.item.getDisplayText(), ' -> handupChanged', data);

      this.isHandUp = data;
    },

    audioChanged(data) {
      console.debug(this.item.getDisplayText(), ' -> audioChanged', data);
      this.audio = data;
    },

    videoChanged(data) {
      console.debug(this.item.getDisplayText(), ' -> videoChanged', data);
      this.video = data;
    },

    mediaChanged(data) {
      console.debug(this.item.getDisplayText(), ' -> mediaChanged', data);
      this.media = data;
    },

    sharingChanged(data) {
      console.debug(this.item.getDisplayText(), ' -> sharingChanged', data);
      this.sharing = data;
    },

    // on Events
    initBindEvent(user) {
      console.debug(user.getDisplayText(), ' -> initBindEvent()');

      user.on('displayTextChanged', this.displayTextChanged);
      user.on('roleChanged', this.roleChanged);
      user.on('holdChanged', this.holdChanged);
      user.on('handupChanged', this.handupChanged);
      user.on('audioChanged', this.audioChanged);
      user.on('videoChanged', this.videoChanged);
      user.on('mediaChanged', this.mediaChanged);
      user.on('sharingChanged', this.sharingChanged);
    },

    // off Events
    offUserEvent(user) {
      console.debug(user.getDisplayText(), ' -> offUserEvent()');

      user.off('displayTextChanged', this.displayTextChanged);
      user.off('roleChanged', this.roleChanged);
      user.off('holdChanged', this.holdChanged);
      user.off('handupChanged', this.handupChanged);
      user.off('audioChanged', this.audioChanged);
      user.off('videoChanged', this.videoChanged);
      user.off('mediaChanged', this.mediaChanged);
      user.off('sharingChanged', this.sharingChanged);
    },

    setMediaFilter(type) {
      if (this.disabled) return;

      const {
        video, audio, hasPermission, speakMode, isHandUp,
      } = this;

      if (type === 'video') this.item.setVideoFilter(!video);
      else if (type === 'audio') {
        if (speakMode === 'hand-up' && hasPermission && isHandUp) {
          this.item.setAudioFilter(true);
          return;
        }
        this.item.setAudioFilter(!audio);
      }
    },

    handleSuccessBtn() {
      const { memberType } = this;

      if (memberType === 'handUp') {
        this.item.setAudioFilter(true);
      } else if (memberType === 'onHold') {
        this.item.allow();
      }
    },
    handleFailBtn() {
      const { memberType } = this;

      if (memberType === 'handUp') {
        this.item.setAudioFilter(false);
      } else if (memberType === 'onHold') {
        this.item.kick();
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.member-item {
  width: 100%;
  height: 48px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 20px;
  margin-top: 18px;

  .item__info {
    display: flex;
    justify-content: flex-start;

    .info__avatar {
      width: 36px;
      height: 36px;
      border-radius: 50%;

      background-color: #cfe5e0;

      margin-right: 20px;
      display: flex;
      flex-direction: column;
      align-items: flex-end;
      justify-content: space-between;
    }

    .info__avatar .member__icon {
      width: 16px;
      height: 16px;
      border: 1px solid #10c29b;
      border-radius: 50%;
      color: #10c29b !important;
      background-color: #fff;
      display: flex;
      justify-content: center;
      align-items: center;
    }

    .info__text {
      display: flex;
      flex-direction: column;
    }

    .info__text .display-text {
      font-size: 14px;
      color: #333;
    }
    .info__text .display-number {
      font-size: 10px;
      color: #999;
    }
  }
  .item__control {
    .control-button {
      margin-left: 16px;
      cursor: pointer;
      color: #666;
    }
    .control-button--disabled {
      cursor: not-allowed;
      .icon {
        color: #ababab !important;
      }
    }
  }
}
</style>
