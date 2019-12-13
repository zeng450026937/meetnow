import Vue from '../../vue/index';
import ERRORS from '../../constants/errors';
import Message from './message';
import { EVENTS } from '../../handler/event-dispatcher';

const Chat = Vue.extend({
  tag : 'Chat',
  data() {
    return {
      // whether chat connection connected
      connected   : false,
      messageList : [],
    };
  },
  computed : {
    current() {
      return this.$parent.currentMember;
    },
  },
  methods : {
    createConnection() {
      return this.getAllMessage()
        .then(() => this.connected = true)
        .catch(() => Promise.reject(ERRORS.CONNECT_ERROR));
    },
    // The Message that you should provide
    // message text and targets
    // no targets means public
    sendMessage(imInfo = {}) {
      imInfo.fromLocal = true;

      const message = new Message(imInfo);
      const params = {
        content        : imInfo.content,
        userEntityList : imInfo.targets || [],
      };

      this.messageList.push(message);

      return this.$api.sendIMInfo(params)
        .then((ret) => (message.status = ret === -1 ? 'failed' : 'finished'))
        .catch(() => message.status = 'failed');
    },
    // Method has Two Function: get all message and creat chat connection
    // invoked in two condition:
    // 1. First Join
    // 2. Join as Waiting, and granted meeting permission later
    getAllMessage() {
      const params = {
        count       : 2000,
        entity      : this.current.entity,
        displayText : this.current.displayText,
      };

      return this.$api.getAllIMInfo(params)
        .then(({ data = { imInfos: [] } }) => {
          if (!Array.isArray(data.imInfos)) return;

          this.messageList = data.imInfos.map((im) => new Message(im));
        });
    },
    // New Message Coming
    onNewMessage(message) {
      this.$log.info('onNewMessage()', message);
      this.messageList.push(new Message(message));
    },
    reset() {
      this.connected = false;
      this.messageList = [];
    },
  },
  afterContextInit() {
    this.$on(EVENTS.NEW_MESSAGE, this.onNewMessage);
    this.$on(EVENTS.CONF_INFO_INITIALIZED, this.createConnection);
  },
});

export default Chat;
