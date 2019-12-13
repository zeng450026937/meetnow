import Vue from '../../vue/index';

const Controller = Vue.extend({
  data() {
    return {

    };
  },
  computed : {
    conference() { return this.$parent.conference; },
    sharer() { return this.conference && this.conference.sharer; },
    mediaChannel() { return this.$parent.mediaChannel; },
    shareChannel() { return this.$parent.shareChannel; },
    uaStatus() { return this.$root.ua.status; },
  },
  methods : {
    // startSharing() { // 主动发送辅流
    //   const isReceiving = this.sharer && !this.sharer.isSelf;
    //
    //   return isReceiving
    //     ? this.shareChannel.occupySharing()
    //     : this.shareChannel.sendSharing()
    //       .catch((error) => error && error.message);
    // },
    // stopSharing() {
    //   return this.sharer && !this.sharer.isSelf
    //     ? this.shareChannel.switchSharing(false)
    //     : this.shareChannel.stopSharing();
    // },

    modifyMemberMedia(options = {}) { // 更新单个成员的媒体状态
      return this.$api.modifyUserMedia(options);
    },
    modifyMemberRole(options = {}) {
      return this.$api.modifyUserRole(options);
    },
    modifyOnHoldStatus(options = {}) {
      // 会议大厅全体成员 或者 单个 成员的会议大厅操作
      // type  操作方式 allow: 允许 reject: 拒绝

      const { type, member } = options;

      if (!member && type === 'grant') return this.$api.grantLobbyAll();
      if (!member && type === 'reject') return this.$api.rejectLobbyAll();

      const params = { 'user-entity': member.entity };

      if (type === 'grant') return this.$api.grantLobbyUser(params);
      if (type === 'reject') return this.$api.kickFromConf(params);
    },

    modifyAllHandUpStatus(options = {}) {
      // type  操作方式 allow: 允许 reject: 拒绝 only reject now
      const { type } = options;

      if (type === 'reject') return this.$api.rejectHandUpAll();
    },
    modifyAllMemberMedia(options = {}) { // mute or unmute
      const { type } = options;

      if (type === 'mute') return this.$api.muteAll();
      if (type === 'unmute') return this.$api.unmuteAll();
    },

    inviteMember(options = {}) {
      const { protocol, number } = options;
      const protocols = {
        SIP         : 'sip-url',
        'H.323'     : 'h323-url',
        RTMP        : 'rtmp-url',
        'SFB(Lync)' : 'sip-url',
      };
      const params = { [protocols[protocol]]: number };

      return this.$api.inviteUser(params);
    },

    lockConf(options = {}) {
      return this.$api.lockConf(options);
    },

    setUserOnHold(member = {}) {
      return this.$api.setUserOnHold({ 'user-entity': member.entity });
    },

    kickFromConf(member = {}) {
      return this.$api.kickFromConf({ 'user-entity': member.entity });
    },

    getMemberStat(memberList = []) {
      if (!Array.isArray(memberList)) memberList = [memberList];
      const userEntityList = memberList.map((member) => member.entity);

      return this.$api.getConfStats({ userEntityList });
    },
  },
});

export default Controller;
