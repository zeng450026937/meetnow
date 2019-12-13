import Vue from '../../vue/index';
import Conference from './conference';
import { EVENTS } from '../../handler/event-dispatcher';

const Conf = Vue.extend({
  data() {
    return {
      // Attribute
      stat          : {},
      conference    : null,
      // state
      confInfoInit  : false,
      confStartTime : null,
      // Child Module
      chat          : null,
      share         : null,
      member        : null,
      controller    : null,
      mediaChannel  : null,
      shareChannel  : null,
    };
  },

  computed : {
    appSharer() { return this.conference && this.conference.appSharer; },
    currentMember() { return this.member && this.member.current; },
    uaStatus() { return this.$root.ua.status; },
  },

  methods : {
    async joinMedia() {
      if (this.mediaChannel) await this.mediaChannel.joinMedia();
      if (this.shareChannel) await this.shareChannel.joinSharing();
    },

    setConfInfo(info) {
      if (this.conference instanceof Conference) {
        this.conference.updatePartial(info);
      }
      else {
        this.conference = new Conference(info);
      }

      if (info.users && this.member) {
        const userList = this.member.initMembers(info.users);

        this.conference.attachMembers(userList);
        this.member.updateCurrent();
      }
    },

    getFullConfInfo() {
      return this.$api.getFullConfInfo()
        .then(({ data }) => this.setConfInfo(data));
    },
    updateStat(entities) {
      const params = {
        userEntityList : entities || [this.currentMember.entity],
      };

      return this.$api.getConfStats(params).then((result) => {
        if (Array.isArray(result)) this.stat = result[0];
      });
    },

    checkConfInfo() {
    },

    reset(notPartial = false) {
      if (notPartial) {
        if (this.member) this.member.reset();
        if (this.chat) this.chat.reset();
        if (this.mediaChannel) this.mediaChannel.closeConnection();
        if (this.shareChannel) this.shareChannel.closeConnection();
      }
      this.confInfoInit = false;
      this.conference = null;
    },
  },

  afterContextInit(context) {
    this.$on(EVENTS.FULL_CONF_INFO_UPDATED, this.getFullConfInfo);
    this.$on(EVENTS.PART_CONF_INFO_UPDATED, this.setConfInfo);
    this.$on(EVENTS.CONF_STATS_UPDATED, this.updateStat);
    this.$on(EVENTS.JOIN_CONF_SUCCEED, () => {
      this.getFullConfInfo()
        .then(() => this.$emit(EVENTS.CONF_INFO_INITIALIZED))
        .then(() => this.confInfoInit = true)
        .then(() => this.confStartTime = Date.now());
    });
    this.$on(EVENTS.EXIT_CONF_SUCCEED, () => this.reset(true));
    // 需要重协商
    this.$on(EVENTS.RENEG_NEEDED, () => {
      if (this.mediaChannel) this.mediaChannel.reJoinMedia();
      if (this.shareChannel) this.shareChannel.reJoinSharing();
    });
  },
});

export default Conf;
