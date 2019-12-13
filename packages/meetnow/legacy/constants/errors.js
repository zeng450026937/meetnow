const ERRORS = {
  CANNOT_SHARE  : Symbol('CANNOT_SHARE'), // 不能分享辅流
  RENEG_ERROR   : Symbol('RENEG_ERROR'), // 协商出错
  CONNECT_ERROR : Symbol('CONNECT_ERROR'), // 连接服务器出错
  NO_STREAM     : Symbol('NO_STREAM'), // 没有本地流
  VERSION_ERROR : Symbol('VERSION_ERROR'), // 版本错误
  //
  MEDIA_UN_INIT : Symbol('MEDIA_UN_INIT'),
  NETWORK_ERROR : Symbol('NETWORK_ERROR'),
  UNKNOWN_ERROR : Symbol('UNKNOWN_ERROR'),
  //
  API_ERROR     : Symbol('API_ERROR'),
  //
  NO_CONF       : Symbol('NO_CONF'),
};

export default ERRORS;
