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
  'holdUser': CtrlApiData & { 'user-entity': string };
  'holdUserAll': CtrlApiData;
  'muteAll': CtrlApiData;
  'unmuteAll': CtrlApiData;
  'rejectHandupAll': CtrlApiData;
  'deleteUser': CtrlApiData & { 'user-entity': string };
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
    'user-agent'?: string;
    'client-url'?: string;
    'client-display-text'?: string;
    'client-type': string;
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
  'invite': CtrlApiData & {
    'uid'?: string[];
    'sip-url'?: string;
    'h323-url'?: string;
  };
  'modifyUserMedia': CtrlApiData & {
    'user-entity': string;
    'endpoint-entity': string;
    'media-id': number;
    'media-ingress-filter'?: 'block' | 'unblocking' | 'unblock';
    'media-egress-filter'?: 'block' | 'unblocking' | 'unblock';
  };
  'modifyUserRole': CtrlApiData & {
    'user-entity': string;
    'role': 'attendee' | 'presenter';
  };
  'getStats': CtrlApiData & {
    'user-entity-list': string[];
  };
  'lock': CtrlApiData & {
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

  rejectHandupAll : {
    method : RequestMethod.POST,
    url    : `${ baseURL.ctrl }reject-all-hand-up`,
  },

  deleteUser : {
    method : RequestMethod.POST,
    url    : `${ baseURL.ctrl }delete-user`,
  },

  modifyUserMedia : {
    method : RequestMethod.POST,
    url    : `${ baseURL.ctrl }modify-user-media`,
  },

  modifyUserRole : {
    method : RequestMethod.POST,
    url    : `${ baseURL.ctrl }modify-user-role`,
  },

  holdUser : {
    method : RequestMethod.POST,
    url    : `${ baseURL.ctrl }wait-lobby-user`,
  },

  inviteUser : {
    method : RequestMethod.POST,
    url    : `${ baseURL.ctrl }invite-user`,
  },

  lock : {
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
