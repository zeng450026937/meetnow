const padTime = (number) => String(number).padStart(2, '0');

class Message {
  constructor(options = {}) {
    if (options.fromLocal) { // means get from server rather send from me
      this.initLocalIM(options);
    }
    else {
      this.initRemoteIM(options);
    }
  }

  get date() {
    return `${ padTime(this.rawDate.getHours()) }:${ padTime(this.rawDate.getMinutes()) }`;
  }

  initRemoteIM(imInfo) {
    this.sender = imInfo['sender-display-text'];
    this.senderEntity = imInfo['sender-entity'];
    this.senderSubjectId = imInfo['sender-subject-id'];

    this.isPrivete = imInfo['is-private'];

    this.content = imInfo['im-context'];
    this.version = imInfo['im-version'];

    this.rawDate = new Date(imInfo['im-timestamp']);
  }

  initLocalIM(imInfo) {
    this.content = imInfo.content;
    this.isPrivete = !!imInfo.targets;
    if (imInfo.targets) this.targetEntity = imInfo.targets[0];

    this.rawDate = new Date();
    // status designed for send im status
    // sending  : sending started
    // finished : send successfully
    // failed   : error occurred when sending
    this.status = 'sending';
  }
}

export default Message;
