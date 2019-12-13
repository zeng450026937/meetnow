import Vue from '../../vue/index';
import UserInfo from './UserInfo';
import { EVENTS } from '../../handler/event-dispatcher';

// 用与管理登录状态
const UA = Vue.extend({
  name : 'UA',
  tag  : 'UA', // 用于打印Logger
  data() {
    return {
      userInfo : null,
      server   : '',
      // 登录状态 unregistered registering registered leaved ended
      status   : 'unregistered',
    };
  },
  created() {
    this.userInfo = new UserInfo();
  },
  computed : {
    isRegistered() {
      return this.status === 'registered';
    },
  },
  methods : {
    // 对外暴露的方法
    join(joinInfo) {
      this.status = 'registering';
      if (joinInfo) this.userInfo.setUserInfo(joinInfo);

      return this.setServer()
        .then(() => this.joinFocus())
        .then(() => this.joinMedia())
        .then(() => this.status = 'registered')
        .catch((error) => {
          this.$log.info(error);
          this.status = 'unregistered';
        });
    },
    reJoin() {
      this.status = 'registering';

      return this.$api.getVirtualJWT()
        .then(() => this.joinFocus())
        .then(() => this.joinMedia())
        .then(() => this.status = 'registered')
        .catch(() => this.status = 'unregistered');
    },
    leave(force) {
      if (!this.isRegistered) return;

      return force
        ? this.status = 'leaved'
        : this.$api.leave().then(() => this.status = 'leaved');
    },
    end(force) {
      if (!this.isRegistered) return;

      return force
        ? this.status = 'ended'
        : this.$api.end().then(() => this.status = 'ended');
    },
    // 内部使用的方法
    joinFocus() {
      this.$log.info('joinFocus()');

      const params = {
        number      : this.userInfo.number,
        password    : this.userInfo.password,
        displayText : this.userInfo.displayText,
        server      : this.server,
      };

      return this.$api.joinFocus(params).then(({ data }) => {
        this.userInfo.setUserId(data['conference-user-id']);
        this.$emit(EVENTS.JOIN_FOCUS_SUCCEED, data);
      });
    },
    joinMedia() {
      this.$log.info('joinMedia()');

      return this.$root.conference.joinMedia();
    },
    setServer() {
      const params = { longNumber: this.userInfo.longNumber };

      return this.$api.getUrl(params).then(({ url }) => this.server = url.split(/@/)[1]);
    },
    //
    reset(canReJoin = false) {
      if (!canReJoin) {
        this.userInfo = new UserInfo();
        this.status = 'unregistered';
        this.server = '';
      }
    },
  },
  watch : {
    status(val, oldVal) {
      if (val === 'registering') this.$emit(EVENTS.JOIN_CONF_STARTED);
      if (val === 'registered') this.$emit(EVENTS.JOIN_CONF_SUCCEED);
      if (oldVal === 'registered') this.$emit(EVENTS.EXIT_CONF_SUCCEED);
      if (val === 'unregistered' && oldVal === 'registering') this.$emit(EVENTS.JOIN_CONF_FAILED);
    },
  },
  beforeDestroy() {
    if (this.status === 'registered') this.leave();
  },
  afterContextInit(context) {
    this.$on(EVENTS.KICKED, () => this.leave(true));
    this.$on(EVENTS.CONF_ENDED, () => this.leave(true));
    this.$on(EVENTS.NETWORK_ERROR, () => this.isRegistered && (this.status = 'leaved'));
  },
});

export default UA;
