const prefix = '/conference-ctrl/api/v1/ctrl/';
const userPrefix = '/user-manager/api/v1/';

const EXTERNAL_API = {
  GET_VIRTUAL_JWT : `${ userPrefix }external/virtualJwt/party`,
  GET_SYS_CONFIG  : `${ userPrefix }external/config/system`,
};

const MEDIA_API = {
  JOIN_MEDIA                 : `${ prefix }join-audio-video`, // 媒体加入
  SWITCH_APPLICATION_SHARING : `${ prefix }applicationsharing-switch`,
  JOIN_APPLICATION_SHARING   : `${ prefix }join-applicationsharing-v2`,
  BYE_APPLICATION_SHARING    : `${ prefix }bye-applicationsharing`,
  RENEG_APPLICATION_SHARING  : `${ prefix }applicationsharing-reneg`,
  RENEGOTIATE                : `${ prefix }av-reneg`,
};

const UA_API = {
  GET_URL       : `${ prefix }get-url-by-long-num`,
  GET_USER_INFO : `${ userPrefix }current/user/info`,
  JOIN_FOCUS    : `${ prefix }join-focus`, // 进入会控
  LEAVE         : `${ prefix }quit-conference`, // 离开会议
  END           : `${ prefix }end-conference`, // 结束会议
};

const IM_API = {
  SEND_IM_INFO    : `${ prefix }im-info`, // 发送IM消息
  GET_ALL_IM_INFO : `${ prefix }get-all-im-info`, // 获取IM历史记录消息
};

const CONF_API = {
  POLLING           : `${ prefix }polling`,
  KEEP_ALIVE        : `${ prefix }user-keepalive`,
  FULL_CONF_INFO    : `${ prefix }get-conference-info`,
  SHORT_CONF_INFO   : `${ prefix }get-short-info`,
  OFFLINE_CONF_INFO : `${ prefix }get-short-info-offline`,
  CONF_STATS        : `${ prefix }get-call-stats`,
};

const CTRL_API = {
  MUTE_ALL           : `${ prefix }mute-all`,
  UNMUTE_ALL         : `${ prefix }unmute-all`,
  GRANT_LOBBY_USER   : `${ prefix }grant-lobby-user`,
  GRANT_LOBBY_ALL    : `${ prefix }grant-lobby-all`,
  REJECT_LOBBY_ALL   : `${ prefix }del-lobby-all`,
  REJECT_HAND_UP_ALL : `${ prefix }reject-all-hand-up`,
  DELETE_USER        : `${ prefix }delete-user`,
  MODIFY_USER_MEDIA  : `${ prefix }modify-user-media`,
  MODIFY_USER_ROLE   : `${ prefix }modify-user-role`,
  WAIT_LOBBY_USER    : `${ prefix }wait-lobby-user`,
  INVITE_USER        : `${ prefix }invite-user`,
  LOCK_CONF          : `${ prefix }lock-conference`,
};

const APIS = {
  ...MEDIA_API,
  ...UA_API,
  ...EXTERNAL_API,
  ...IM_API,
  ...CONF_API,
  ...CTRL_API,
};
const API_NAMES = Object.keys(APIS);
const API_NAME = (api) => API_NAMES.find((name) => APIS[name] === api);
const API_SET = {
  MEDIA_API,
  UA_API,
  EXTERNAL_API,
  IM_API,
  CONF_API,
  CTRL_API,
};

export { API_NAME };

export {
  MEDIA_API,
  UA_API,
  EXTERNAL_API,
  IM_API,
  CONF_API,
  CTRL_API,
};
export default API_SET;
