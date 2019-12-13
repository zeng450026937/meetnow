import { mergeItem } from './merge';

export interface Partialable {
  'state': 'full' | 'partial' | 'deleted';
  [key: string]: any;
}

// Conference Description

export interface ConfereceUri {
  'entity': 'focus' | 'audio-video' | 'applicationsharing';
  'uri': string;
  'display-text': string;
  'purpose': string;
}

export interface ConfereceUris {
  'entry': ConfereceUri[];
}

export interface Organizer {
  'display-text': string;
  'subject-id': string;
}

export interface Description extends Partialable {
  'subject': string;
  'start-time': string;
  'start-time-unix': number;
  'profile': 'conference' | string;
  'record-id': string;
  'conf-uris': ConfereceUris;
  'conf-info-url': string;
  'organizer': Organizer;
  'conference-id': string;
  'conference-number': string;
  'enterprise-number': string;
  'conference-long-no': string;
  'conference-type': 'vmr' | string;
  'is-recurrence': boolean;
  'book-start-time': string;
  'book-expiry-time': string;
  'presenter-pin': string;
  'attendee-pin': string;
  'maximum-user-count': string;
  'admission-policy': 'anonymouse' | 'closedAuthenticated' | 'openAuthenticated';
  'lobby-capable': boolean;
  'attendee-by-pass': boolean;
  'interactive-broadcast-enabled': boolean;
  'enterprise-id': string;
  'video-enabled': boolean;
  'ipcall-enabled': boolean;
  'webrtc-enabled': boolean;
}

// Conference State

export interface ApplicationSharer extends Partialable {
  'user': any
}

export interface State extends Partialable {
  'active': boolean;
  'locked': boolean;
  'applicationsharer': ApplicationSharer;
}

// Conference View

export interface ConferenceLayout {
  'enable': boolean;
  'broadcast-id': number;
  'video-layout': 'SpeechExcitation';
  'speech-excitation-video-big-view': number;
  'speech-excitation-video-max-view': number;
  'speech-excitation-video-round-enabled': boolean;
  'speech-excitation-video-round-number': number;
  'speech-excitation-video-round-interval': number;
  'equality-video-max-view': number;
  'equality-video-round-enabled': boolean;
  'equality-video-round-number': number;
  'equality-video-round-interval': number;
  'applied-to-attendee': boolean;
  'applied-to-cast-viewer': boolean;
  'selected-user-entity': string[];
  'appoint-users': string[];
}

export interface EntityState extends Partialable {
  'speak-mode': 'free' | 'hand-up';
  'focus-video-user-entity': string;
  'ext-video-as-focus': boolean;
  'video-layout': 'SpeechExcitation';
  'MediaFiltersRules'?: any;
  'speech-excitation-video-big-view': number;
  'speech-excitation-video-max-view': number;
  'speech-excitation-video-round-enabled': boolean;
  'speech-excitation-video-round-number': number;
  'speech-excitation-video-round-interval': number;
  'video-speech-ex-enabled': boolean;
  'video-speech-ex-sensitivity': number;
  'equality-video-max-view': number;
  'equality-video-round-enabled': boolean;
  'equality-video-round-number': number;
  'equality-video-round-interval': number;
  'custom-presenter-layout': ConferenceLayout;
  'custom-attendee-layout': ConferenceLayout;
  'custom-cast-viewer-layout': ConferenceLayout;
  'video-big-round': boolean;
  'video-data-mix-enabled': boolean;
  'hide-osd-site-name': boolean;
  'hide-osd-site-icon': boolean;
  'audio-as-mixed-screen-enable': boolean;
}

export interface EntityViewTitle extends Partialable {
  'position': 'top' | 'bottom';
  'type': 'static' | 'dynamic';
  'display-time': number;
  'repeat-count': number;
  'repeat-interval': number;
  'roll-direction': 'R2L' | 'L2R';
}

export interface EntityView extends Partialable, ConfereceUri {
  'entity-state'?: EntityState;
  'title'?: EntityViewTitle;
}

export interface View extends Partialable {
  'entity-view': EntityView[]
}

// Conference Users

export interface UserRole {
  'role': 'attendee' | 'presenter' | 'castviewer' | 'organizer';
}

export interface JoinInfo {
  'when': string;
}

export interface MediaFilter {
  'type': 'unblock' | 'block' | 'unblocking';
  'blockby': 'server' | string;
}

export interface UserMedia {
  'id': number;
  'type': 'audio' | 'video';
  'label': 'main-audio' | 'main-video';
  'status': 'sendrecv' | 'sendonly' | 'recvonly';
  'media-ingress-filter': MediaFilter;
  'media-egress-filter': MediaFilter;
}

export interface UserEndpoint extends Partialable {
  'entity': string;
  'session-type': 'focus' | 'audio-video' | 'applicationsharing';
  'status': 'connected' | 'disconnected' | 'connecting' | 'calling';
  'joining-method': 'dialed-in' | 'dialed-out';
  'joining-info': JoinInfo;
  'media'?: UserMedia[];
}

export interface ConferenceUser extends Partialable {
  'entity': string,
  'answer-time-unix': number,
  'display-text': string,
  'display-number': string,
  'display-text-pinyin-for-search': string,
  'group-id'?: string,
  'group-name'?: string,
  'group-name-pinyin-for-search'?: string,
  'subject-id': string,
  'protocol': string | 'HTTP' | 'SIP',
  'request-uri': string,
  'user-agent': string,
  'roles': UserRole,
  'endpoint': UserEndpoint[]
  'support-fecc': boolean;
  'ip'?: string;
}

export interface Users extends Partialable {
  'user': ConferenceUser[]
}

// Conference Record Users

export interface StateReason {
  'reason-code': number;
  'bizCode': number;
}

export interface ConferenceRecordUser extends Partialable {
  'record-status': 'stop' | 'recording' | 'start';
  'reason': StateReason;
  'record-last-stop-duration': number;
  'record-last-start-time': number;
}

export interface RecordUsers extends Partialable {
  'user': ConferenceRecordUser[];
}

// Conference RTMP Users

export interface ConferenceRTMPUser extends Partialable {
  'entity': string;
  'default': boolean,
  'rtmp-status': 'stop' | 'recording' | 'start';
  'rtmp-last-stop-duration': number;
  'rtmp-last-start-time': number;
  'reason': StateReason;
}

export interface RTMPUsers extends Partialable {
  'rtmp-enable': boolean;
  'user': ConferenceRecordUser[];
}

// Conference Information

export interface Information extends Partialable {
  'conference-descriotion': Description;
  'conference-state': State;
  'conference-view': View;
  'entity': string;
  'plan-id': string;
  'record-id': string;
  'record-users': RecordUsers;
  'rtmp-state': RTMPUsers;
  'uses': Users;
  'version': number;
}

export function createInformation(data: Information) {
  function update(val: Information) {
    const { version } = data;
    const { version: newVersion } = val;

    if (!newVersion) {
      console.warn('internal error');
      debugger;
      return false;
    }
    if (newVersion <= version) return true;
    if (newVersion - version > 1) return false;

    mergeItem(data, val);

    return true;
  }

  return {
    update,
  };
}
