
export interface Partialable {
  'state': 'full' | 'partial' | 'deleted';
  [key: string]: any;
}

export type SessionType = 'focus' | 'audio-video' | 'applicationsharing' | 'fecc';
export type VideoLayoutType = 'Equality' | 'SpeechExcitation' | 'Exclusive';

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

export interface ConferenceDescription extends Partialable {
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
  'enable-svc': boolean;
  'enterprise-id': string;
  'enterprise-number': string;
  'conference-long-no': string;
  'conference-type': 'vmr' | string;
  'is-recurrence': boolean;
  'book-start-time': string;
  'book-expiry-time': string;
  'presenter-pin': string;
  'attendee-pin': string;
  'maximum-user-count': string;
  'admission-policy': 'anonymous' | 'closedAuthenticated' | 'openAuthenticated';
  'lobby-capable': boolean;
  'attendee-by-pass': boolean;
  'interactive-broadcast-enabled': boolean;
  'video-enabled': boolean;
  'ipcall-enabled': boolean;
  'webrtc-enabled': boolean;
}

// Conference State

export interface ApplicationSharer extends Partialable {
  'user': ConferenceUser;
}

export interface ConferenceState extends Partialable {
  'active': boolean;
  'locked': boolean;
  'applicationsharer': ApplicationSharer;
  'speech-user-entity'?: string;
}

// Conference View

export interface ConferenceLayout {
  'enable': boolean;
  'broadcast-id': number;
  'video-layout': 'Equality' | 'SpeechExcitation' | 'Exclusive';
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
  'video-layout': 'Equality' | 'SpeechExcitation' | 'Exclusive';
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

export interface ConferenceView extends Partialable {
  'entity-view': EntityView[];
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
  'label': 'main-audio' | 'main-video' | 'applicationsharing';
  'status': 'sendrecv' | 'sendonly' | 'recvonly';
  'media-ingress-filter': MediaFilter;
  'media-egress-filter': MediaFilter;
}

export interface UserEndpoint extends Partialable {
  'entity': string;
  'session-type': 'focus' | 'audio-video' | 'applicationsharing' | 'fecc';
  'status': 'pending' | 'dialing-out' | 'dialing-in' | 'alerting' | 'connected' | 'disconnected' | 'disconnecting' | 'calling' | 'on-hold' | 'muted-via-focus';
  'joining-method': 'dialed-in' | 'dialed-out';
  'joining-info': JoinInfo;
  'media'?: UserMedia[];
}

export interface ConferenceUser extends Partialable {
  'entity': string;
  'answer-time-unix': number;
  'display-text': string;
  'display-number': string;
  'display-text-pinyin-for-search': string;
  'group-id'?: string;
  'group-name'?: string;
  'group-name-pinyin-for-search'?: string;
  'subject-id': string;
  'protocol': string | 'HTTP' | 'SIP';
  'request-uri': string;
  'user-agent': string;
  'roles': UserRole;
  'endpoint': UserEndpoint[]
  'support-fecc': boolean;
  'ip'?: string;
  'reason'?: StateReason;
}

export interface ConferenceUsers extends Partialable {
  'broadcast-user-count'?: number;
  'user': ConferenceUser[];
}

// Conference Record Users

export interface StateReason {
  'reason-code': number;
  'reason-text'?: string;
  'bizCode': number;
}

export interface ConferenceRecordUser extends Partialable {
  'entity': string;
  'default': boolean;
  'reason': StateReason;
  'record-status': 'stop' | 'stopping' | 'pause' | 'pausing' | 'start' | 'starting' | 'resuming';
  'record-last-stop-duration': number;
  'record-last-start-time': number;
}

export interface ConferenceRecordUsers extends Partialable {
  'user': ConferenceRecordUser;
}

// Conference RTMP Users

export interface ConferenceRTMPUser extends Partialable {
  'entity': string;
  'default': boolean;
  'reason': StateReason;
  'rtmp-status': 'stop' | 'stopping' | 'pause' | 'pausing' | 'start' | 'starting' | 'resuming';
  'rtmp-last-stop-duration': number;
  'rtmp-last-start-time': number;
}

export interface ConferenceRTMPUsers extends Partialable {
  'rtmp-enable': boolean;
  'users': ConferenceRTMPUser[];
}

// Conference Information

export interface ConferenceInformation extends Partialable {
  'conference-description'?: ConferenceDescription;
  'conference-state'?: ConferenceState;
  'conference-view'?: ConferenceView;
  'entity': string;
  'plan-id': string;
  'record-id': string;
  'record-users'?: ConferenceRecordUsers;
  'rtmp-state'?: ConferenceRTMPUsers;
  'users'?: ConferenceUsers;
  'version': number;
}
