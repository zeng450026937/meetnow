import { camelize, capitalize } from '../../vue/src/shared/util';

const requiredFields = [
  'entity',
  'display-text',
  'roles',
  'endpoint',
  'request-uri',
  'lobby-timestamp',
  'user-agent',
  'protocol',
  'support-fecc',
  'group-id',
  'group-name',
  'display-number',
];

class Participant {
  constructor(options = {}) {
    if (!options || typeof options !== 'object') throw new Error('options error!');

    if (!options.preInfo) this.network = 4;// 不存在的用户，设置初始默认网路为极佳

    this.isSpeech = false;
    this.isSelf = options.isSelf;
    this.isSharer = options.isSharer; // update value in conference
    this.video = options.video || {};
    this.audio = options.audio || {};

    requiredFields.forEach((field) => {
      // endpoint 端点 携带用户的媒体信息
      if (field === 'endpoint') this.analyzeEndPoint(options[field], options.preInfo);
      else if (field === 'roles') this.analyzeRoles(options[field]);
      else this[camelize(field)] = options[field];
    });
    if (this.displayText) {
      const displayText = /^(.*)\(.*\)$/.test(this.displayText) ? RegExp.$1 : this.displayText;

      this.nickName = displayText.substr(-2, 2);
    }
  }

  analyzeEndPoint(endpoints = [], preInfo) { // 分析用户所携带的媒体信息
    this.mediaIngressInfo = [];
    if (!this.endpoint) this.endpoint = {};

    endpoints.forEach((endpoint) => {
      if (endpoint['session-type'] === 'audio-video' || (preInfo && endpoint.entity === preInfo.endpointAvEntity)) {
        this.hasJoin = true;
        this.endpointAvEntity = endpoint.entity;

        if (Array.isArray(endpoint.media)) {
          endpoint.media.forEach((media) => {
            this.mediaIngressInfo.push({
              ...media['media-ingress-filter'],
              media : media.type,
            });

            const mediaIngressFilter = media['media-ingress-filter'] && media['media-ingress-filter'].type;
            const mediaEgressFilter = media['media-egress-filter'] && media['media-egress-filter'].type;
            const applyForSpeech = media['apply-for-speech'] && media['apply-for-speech'];

            const mediaInfo = { id: media.id };

            if (mediaIngressFilter) {
              mediaInfo.mediaIngressFilter = mediaIngressFilter;
              const statuses = ['block', 'unblock', 'unblocking']; // for updatePartial

              // ingressBlock ingressUnblock ingressUnblocking
              statuses.forEach((status) => mediaInfo[`ingress${ capitalize(status) }`] = mediaIngressFilter === status);
            }
            if (mediaEgressFilter) {
              mediaInfo.mediaEgressFilter = mediaEgressFilter;
              const statuses = ['block', 'unblock', 'unblocking'];

              // egressBlock egressUnblock egressUnblocking
              statuses.forEach((status) => mediaInfo[`egress${ capitalize(status) }`] = mediaEgressFilter === status);
            }
            if (applyForSpeech) {
              mediaInfo.applyForSpeech = applyForSpeech;
            }

            this[media.type] = mediaInfo;
          });
        }

        if (endpoint.status) {
          this.endpoint = {
            status                      : endpoint.status,
            [camelize(endpoint.status)] : true, // onHold
          };
        }
        this.joinDate = endpoint['joining-info'] && endpoint['joining-info'].when;
      }
      // // 是否是分享辅流
      // this.applicationSharing = endpoint['session-type'] === 'applicationsharing';
    });
  }

  analyzeRoles(roles) {
    if ((!roles || !roles.role) && !this.roles) return this.roles = {};
    if (!roles) return;

    this.roles = roles;
    const roleList = ['organizer', 'presenter', 'attendee', 'castviewer']; // for updatePartial
    // isOrganizer isPresenter isAttendee isCastviewer

    roleList.forEach((role) => this.roles[`is${ capitalize(role) }`] = roles.role === role);
  }

  updatePartial(participant) {
    Object.keys(participant).forEach((key) => {
      if (participant[key] !== undefined) {
        if (key === 'video') Object.assign(this.video, participant.video);
        else if (key === 'audio') Object.assign(this.audio, participant.audio);
        else if (key === 'endpoint') {
          if (participant.endpoint.status) this.endpoint = participant.endpoint;
        } // TODO
        else if (key === 'roles') Object.assign(this.roles, participant.roles);
        else this[key] = participant[key];
      }
    });
  }
}

export default Participant;
