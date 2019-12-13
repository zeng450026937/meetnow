
const EVENTS = {
  // conference
  JOIN_FOCUS_SUCCEED     : Symbol('JOIN_FOCUS_SUCCEED'),
  JOIN_MEDIA_SUCCEED     : Symbol('JOIN_MEDIA_SUCCEED'),
  JOIN_SHARE_SUCCEED     : Symbol('JOIN_SHARE_SUCCEED'),
  JOIN_CONF_STARTED      : Symbol('JOIN_CONF_STARTED'),
  JOIN_CONF_SUCCEED      : Symbol('JOIN_CONF_SUCCEED'),
  JOIN_CONF_FAILED       : Symbol('JOIN_CONF_FAILED'),
  EXIT_CONF_SUCCEED      : Symbol('EXIT_CONF_SUCCEED'),
  RENEG_NEEDED           : Symbol('RENEG_NEEDED'),
  CHANNEL_STATE_CHANGED  : Symbol('CHANNEL_STATE_CHANGED'),
  // Conference info updated
  CONF_INFO_INITIALIZED  : Symbol('CONF_INFO_INITIALIZED'),
  FULL_CONF_INFO_UPDATED : Symbol('FULL_CONF_INFO_UPDATED'),
  PART_CONF_INFO_UPDATED : Symbol('PART_CONF_INFO_UPDATED'),
  CONF_STATS_UPDATED     : Symbol('CONF_STATS_UPDATED'),
  // server operation
  CONF_ENDED             : Symbol('CONF_ENDED'),
  KICKED                 : Symbol('KICKED'),
  // exception
  NETWORK_ERROR          : Symbol('NETWORK_ERROR'),
  ALL_REQUEST_CANCELED   : Symbol('ALL_REQUEST_CANCELED'),
  // chat
  NEW_MESSAGE            : Symbol('NEW_MESSAGE'),
  // member
  MEMBER_EXIT_CONF       : Symbol('MEMBER_EXIT_CONF'),
  MEMBER_JOIN_CONF       : Symbol('MEMBER_JOIN_CONF'),
  MEDIA_CHANGED          : Symbol('MEDIA_CHANGED'),
  ROLE_CHANGED           : Symbol('ROLE_CHANGED'),
  MEMBER_UPDATED         : Symbol('MEMBER_UPDATED'),
  // error
  API_ERROR              : Symbol('API_ERROR'),
  // request
  REQUEST_STARTED        : Symbol('REQUEST_STARTED'),
  REQUEST_FINISHED       : Symbol('REQUEST_STARTED'),
};

window.EVENTS = EVENTS;
export default EVENTS;
