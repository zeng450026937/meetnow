import { camelize } from '../../vue/src/shared/util';
// 过滤字段 conference: 0,education: 1,seminar:2
const profileMap = {
  conference : 0,
  education  : 1,
  seminar    : 2,
};

const requiredFields = [
  'subject',
  'start-time',
  'conference-number',
  'interactive-broadcast-enabled',
  'presenter-pin',
  'attendee-pin',
  'admission-policy',
  'attendee-by-pass',
  'conference-type',
  'conference-long-no',
];

class Conference {
  constructor(options = {}) {
    if (!options || typeof options !== 'object') throw new Error('options error!');
    this.version = options.version || 0;

    this.appSharer = null;

    this.analyzeDescription(options['conference-description'], true);
    this.analyzeState(options['conference-state']);
    this.analyzeView(options['conference-view']);
  }

  analyzeDescription(description, isInit = false) { // 会议的描述信息
    if (isInit) description = description || {};
    if (!description) return;
    requiredFields.forEach((field) => {
      if (description[field] !== undefined || isInit) {
        this[camelize(field)] = description[field];
      }
    });
    this.profile = profileMap[description.profile];

    const conferenceType = description['conference-type'];
    const isRecurrence = description['is-recurrence'];

    if (conferenceType != null) {
      this.isVmr = conferenceType === 'vmr';
      this.isAppointment = conferenceType === 'recurrence'; // 是否预约会议
    }

    if (isRecurrence != null) {
      this.isRecurrence = isRecurrence; // 是否周期会议
    }
  }

  analyzeState(state) {
    if (!state) return;
    const speechUserEntity = state['speech-user-entity'];

    if (this.speechUser) this.speechUser.isSpeech = false;
    if (speechUserEntity && this.users) {
      this.speechUser = this.users.find((user) => user.entity === speechUserEntity) || {};
      this.speechUser.isSpeech = true;
      this.speechActive = state.active;
      this.speechLocked = state.locked;
    }
    const appSharer = state.applicationsharer;

    if (appSharer && appSharer.user) {
      const shareEntity = appSharer.user.entity;

      if ((shareEntity !== this.shareEntity) && this.users) {
        this.appSharer = this.users.find((user) => user.entity === shareEntity) || null;
        if (this.appSharer) this.appSharer.isSharer = true;
      }
      this.shareEntity = shareEntity;
    }
    else {
      if (this.appSharer) {
        this.appSharer.isSharer = false;
        this.appSharer = null;
      }
      this.shareEntity = -1;
    }
  }

  attachMembers(users = []) {
    this.users = users;
    this.appSharer = users.find((user) => user.entity === this.shareEntity) || null;
  }

  analyzeView(view) {
    const entityView = (view && view['entity-view']) || [];

    if (entityView.length <= 0 && !this.view) return this.view = {};
    if (!view) return;

    if (view.state === 'full') { // 如果是全量，则取音视频通道的数据
      const audioVideoView = entityView.find((entity) => entity.purpose === 'audio-video');

      if (audioVideoView) {
        const entityState = audioVideoView['entity-state'];

        if (entityState) {
          this.view = {
            entity               : audioVideoView.entity,
            freeLayout           : entityState['video-layout'],
            focusVideoUserEntity : entityState['focus-video-user-entity'],
            speakMode            : entityState['speak-mode'],
          };
        }
      }
    }
    else { // 如果是增量，则匹配寻找entity进行更新（目前只需更新audio-video通道的数据）
      const updatedView = entityView.find((entity) => entity.entity === this.view.entity);

      if (updatedView) {
        const entityState = updatedView['entity-state'];

        if (entityState) {
          this.view = {
            entity               : this.view.entity,
            freeLayout           : entityState['video-layout'] || this.view.freeLayout,
            focusVideoUserEntity : entityState['focus-video-user-entity'] || this.view.focusVideoUserEntity,
            speakMode            : entityState['speak-mode'] || this.view.speakMode,
          };
        }
      }
    }
  }

  get isLocked() {
    return this.admissionPolicy !== 'anonymous';
  }

  updatePartial(details) {
    if (!details) return;

    const description = details['conference-description'] || details;
    const state = details['conference-state'];
    const view = details['conference-view'];


    this.version = details.version || this.version;

    this.analyzeDescription(description || details);
    this.analyzeState(state);
    this.analyzeView(view);
  }
}

export default Conference;
