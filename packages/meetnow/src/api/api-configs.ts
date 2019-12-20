import { AxiosRequestConfig, Method } from 'axios';
import { RequestMethod } from './request-method';

export const baseURL = {
  ctrl    : '/conference-ctrl/api/v1/ctrl/',
  usermgr : '/user-manager/api/v1/',
};

export interface ApiConfigs {
  [apiName: string]: ApiConfig;
}

export interface ApiConfig extends AxiosRequestConfig {
  method?: Method | any;
  responseType?: ResponseType | any;
}

interface CtrlApiData {
  'conference-uuid'?: string;
  'conference-user-id'?: number;
  [key: string]: any;
}

export interface ApiHeaderMap {
  [apiName: string]: any;
  'getVirtualJWT': { id: string }
}

export interface ApiParamsMap {
  [apiName: string]: any;
}

export interface ApiDataMap {
  [apiName: string]: any;
  'polling': CtrlApiData & { 'version': number };
  'keepalive': CtrlApiData;
  'rejectLobbyUserAll': CtrlApiData;
  'acceptLobbyUserAll': CtrlApiData;
  'acceptLobbyUser': CtrlApiData & { 'user-entity': string };
  'waitLobbyUserAll': CtrlApiData;
  'waitLobbyUser': CtrlApiData & { 'user-entity': string };
  'holdUser': CtrlApiData & { 'user-entity': string };
  'holdUserAll': CtrlApiData;
  'muteAll': CtrlApiData;
  'unmuteAll': CtrlApiData;
  'rejectHandupAll': CtrlApiData;
  'deleteUser': CtrlApiData & { 'user-entity': string };
  'setFocusVideo': CtrlApiData & { 'user-entity': string };
  'setSpeakMode': CtrlApiData & { 'speak-mode': 'free' | 'hand-up' };
  'setFreeLayout': CtrlApiData & {
    'video-layout': 'Equality' | 'SpeechExcitation' | 'Exclusive';
    'speech-excitation-video-big-view'?: number;
    'speech-excitation-video-max-view'?: number;
    'equality-video-max-view'?: number;
    'ext-video-as-focus': number;
    'speech-excitation-video-round-enabled'?: boolean;
    'speech-excitation-video-round-number'?: number;
    'speech-excitation-video-round-interval'?: number;
    'equality-video-round-enabled'?: boolean;
    'equality-video-round-number'?: number;
    'equality-video-round-interval'?: number;
  };
  'setCustomizeLayout': CtrlApiData & {
    'enable'?: boolean;
    'viewer': 'presenter' | 'attendee' | 'castviewer';
    'video-layout': 'Equality' | 'SpeechExcitation' | 'Exclusive';
    'speech-excitation-video-big-view'?: number;
    'speech-excitation-video-max-view'?: number;
    'equality-video-max-view'?: number;
    'ext-video-as-focus'?: number;
    'speech-excitation-video-round-enabled': boolean;
    'speech-excitation-video-round-number': number;
    'speech-excitation-video-round-interval': number;
    'equality-video-round-enabled'?: boolean;
    'equality-video-round-number'?: number;
    'equality-video-round-interval'?: number;
    'applied-to-attendee': boolean;
    'applied-to-cast-viewer': boolean;
    'selected-user-entity'?: string[];
    'pos'?: number;
    'entity'?: string;
  };
  'setGlobalLayout': CtrlApiData & {
    'hide-osd-site-name': boolean;
    'hide-osd-site-icon': boolean;
  };
  'setFecc': CtrlApiData & {
    'user-entity': string;
    'action': string;
  };
  'setTitle': CtrlApiData & {
    'position': string;
    'type': string;
    'display-time': number;
    'repeat-count': number;
    'repeat-interval': number;
    'roll-direction': string;
  };
  'sendTitle': CtrlApiData & {
    'display-text': string;
    'all-presenter': boolean;
    'all-attendee': boolean;
    'all-castviewer': boolean;
  };
  'setRecord': CtrlApiData & { 'operate': string };
  'setRTMP': CtrlApiData & { 'operate': string };
  'getFullInfo': CtrlApiData;
  'getBasicInfo': CtrlApiData;
  'getURL': { 'long-number': string };
  'pushMessage': CtrlApiData & {
    'user-entity-list'?: string[];
    'im-context': string;
  };
  'pullMessage': CtrlApiData & {
    'count'?: number;
  };
  'joinFocus': {
    'conference-url': string;
    'conference-pwd': string;
    'user-agent'?: string;
    'client-url'?: string;
    'client-display-text'?: string;
    'client-type': string;
    'client-info'?: string;
    'pure-ctrl-channel': boolean;
    'is-webrtc'?: boolean;
  };
  'joinMedia': CtrlApiData & {
    'sdp': string;
  };
  'renegMedia': CtrlApiData & {
    'sdp': string;
  };
  'joinShare': CtrlApiData & {
    'sdp': string;
  };
  'switchShare': CtrlApiData & {};
  'leaveShare': CtrlApiData & {};
  'renegShare': CtrlApiData & {
    'sdp': string;
    'media-version': number;
  };
  'inviteUser': CtrlApiData & {
    'uid'?: string[];
    'sip-url'?: string;
    'h323-url'?: string;
  };
  'setUserMedia': CtrlApiData & {
    'user-entity': string;
    'endpoint-entity': string;
    'media-id': number;
    'media-ingress-filter'?: 'block' | 'unblocking' | 'unblock';
    'media-egress-filter'?: 'block' | 'unblocking' | 'unblock';
  };
  'setUserRole': CtrlApiData & {
    'user-entity': string;
    'role': 'attendee' | 'presenter';
  };
  'setUserDisplayText': CtrlApiData & {
    'user-entity': string;
    'display-text': string;
  };
  'getStats': CtrlApiData & {
    'user-entity-list': string[];
  };
  'setLock': CtrlApiData & {
    'admission-policy': 'openAuthenticated' | 'anonymous' | 'closedAuthenticated';
    'attendee-lobby-bypass': boolean;
   };
  'leave': CtrlApiData & {
    'reason-code': number;
    'reason-text': string;
    'bizCode': number;
   };
  'end': { 'conference-url': string };
}

export const configs = {
  // user manager

  getUserInfo : {
    method : RequestMethod.GET,
    url    : `${ baseURL.usermgr }current/user/info`,
  },

  getVirtualJWT : {
    method : RequestMethod.GET,
    url    : `${ baseURL.usermgr }external/virtualJwt/party`,
  },

  getSystemConfig : {
    method : RequestMethod.GET,
    url    : `${ baseURL.usermgr }external/config/system`,
  },

  // info
  getURL : {
    method : RequestMethod.POST,
    url    : `${ baseURL.ctrl }get-url-by-long-num`,
  },

  getFullInfo : {
    method : RequestMethod.POST,
    url    : `${ baseURL.ctrl }get-conference-info`,
  },

  getBasicInfo : {
    method : RequestMethod.POST,
    url    : `${ baseURL.ctrl }get-short-info`,
  },

  getBasicInfoOffline : {
    method : RequestMethod.POST,
    url    : `${ baseURL.ctrl }get-short-info-offline`,
  },

  getStats : {
    method : RequestMethod.POST,
    url    : `${ baseURL.ctrl }get-call-stats`,
  },

  // lifecycle

  polling : {
    method : RequestMethod.POST,
    url    : `${ baseURL.ctrl }polling`,
  },

  keepalive : {
    method : RequestMethod.POST,
    url    : `${ baseURL.ctrl }user-keepalive`,
  },

  // focus

  joinFocus : {
    method : RequestMethod.POST,
    url    : `${ baseURL.ctrl }join-focus`,
  },

  // media

  joinMedia : {
    method : RequestMethod.POST,
    url    : `${ baseURL.ctrl }join-audio-video`,
  },

  renegMedia : {
    method : RequestMethod.POST,
    url    : `${ baseURL.ctrl }av-reneg`,
  },

  // share

  joinShare : {
    method : RequestMethod.POST,
    url    : `${ baseURL.ctrl }join-applicationsharing-v2`,
  },

  leaveShare : {
    method : RequestMethod.POST,
    url    : `${ baseURL.ctrl }bye-applicationsharing`,
  },

  switchShare : {
    method : RequestMethod.POST,
    url    : `${ baseURL.ctrl }applicationsharing-switch`,
  },

  renegShare : {
    method : RequestMethod.POST,
    url    : `${ baseURL.ctrl }applicationsharing-reneg`,
  },

  // im

  pushMessage : {
    method : RequestMethod.POST,
    url    : `${ baseURL.ctrl }im-info`,
  },

  pullMessage : {
    method : RequestMethod.POST,
    url    : `${ baseURL.ctrl }get-all-im-info`,
  },

  // ctrl

  muteAll : {
    method : RequestMethod.POST,
    url    : `${ baseURL.ctrl }mute-all`,
  },

  unmuteAll : {
    method : RequestMethod.POST,
    url    : `${ baseURL.ctrl }unmute-all`,
  },

  acceptLobbyUser : {
    method : RequestMethod.POST,
    url    : `${ baseURL.ctrl }grant-lobby-user`,
  },

  acceptLobbyUserAll : {
    method : RequestMethod.POST,
    url    : `${ baseURL.ctrl }grant-lobby-all`,
  },

  rejectLobbyUserAll : {
    method : RequestMethod.POST,
    url    : `${ baseURL.ctrl }del-lobby-all`,
  },

  waitLobbyUser : {
    method : RequestMethod.POST,
    url    : `${ baseURL.ctrl }wait-lobby-user`,
  },

  waitLobbyUserAll : {
    method : RequestMethod.POST,
    url    : `${ baseURL.ctrl }wait-lobby-all`,
  },

  rejectHandupAll : {
    method : RequestMethod.POST,
    url    : `${ baseURL.ctrl }reject-all-hand-up`,
  },

  deleteUser : {
    method : RequestMethod.POST,
    url    : `${ baseURL.ctrl }delete-user`,
  },

  setUserMedia : {
    method : RequestMethod.POST,
    url    : `${ baseURL.ctrl }modify-user-media`,
  },

  setUserRole : {
    method : RequestMethod.POST,
    url    : `${ baseURL.ctrl }modify-user-role`,
  },

  setUserDisplayText : {
    method : RequestMethod.POST,
    url    : `${ baseURL.ctrl }edit-user-display-text`,
  },

  holdUser : {
    method : RequestMethod.POST,
    url    : `${ baseURL.ctrl }wait-lobby-user`,
  },

  inviteUser : {
    method : RequestMethod.POST,
    url    : `${ baseURL.ctrl }invite-user`,
  },

  setFocusVideo : {
    method : RequestMethod.POST,
    url    : `${ baseURL.ctrl }set-focus-video`,
  },

  setSpeakMode : {
    method : RequestMethod.POST,
    url    : `${ baseURL.ctrl }set-speak-mode`,
  },

  setFreeLayout : {
    method : RequestMethod.POST,
    url    : `${ baseURL.ctrl }set-free-layout`,
  },

  setCustomizeLayout : {
    method : RequestMethod.POST,
    url    : `${ baseURL.ctrl }set-customize-layout`,
  },

  setGlobalLayout : {
    method : RequestMethod.POST,
    url    : `${ baseURL.ctrl }set-global-layout`,
  },

  setFecc : {
    method : RequestMethod.POST,
    url    : `${ baseURL.ctrl }set-fecc`,
  },

  setTitle : {
    method : RequestMethod.POST,
    url    : `${ baseURL.ctrl }set-title`,
  },

  sendTitle : {
    method : RequestMethod.POST,
    url    : `${ baseURL.ctrl }send-title`,
  },

  setRecord : {
    method : RequestMethod.POST,
    url    : `${ baseURL.ctrl }record-operate`,
  },

  setRTMP : {
    method : RequestMethod.POST,
    url    : `${ baseURL.ctrl }rtmp-operate`,
  },

  setLock : {
    method : RequestMethod.POST,
    url    : `${ baseURL.ctrl }lock-conference`,
  },

  leave : {
    method : RequestMethod.POST,
    url    : `${ baseURL.ctrl }quit-conference`,
  },

  end : {
    method : RequestMethod.POST,
    url    : `${ baseURL.ctrl }end-conference`,
  },

};

export const CONFIGS: ApiConfigs = configs;
export type ApiNames = keyof typeof configs;
