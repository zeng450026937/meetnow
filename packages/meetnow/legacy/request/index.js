/* eslint-disable lines-between-class-members */
import axios from 'axios';
import Logger from '../log/index';
import API_SET,
{
  MEDIA_API, UA_API, EXTERNAL_API, IM_API, CONF_API, CTRL_API, API_NAME,
} from './standard-api';
import { isSuccess } from '../utils';
import EVENTS from '../constants/events';

const logger = Logger.genLogger('API');

class Request {
  constructor(options = {}) {
    this.context = options.ctx;
    this.token = '';
    this.confInfo = {};
    this.version = 0;
    this.service = axios.create({
      baseURL : '/webapp',
      timeout : 1000 * 60 * 30,
    });
    this.service.defaults.headers['Content-Type'] = 'application/json';
    this.service.interceptors.request.use(this.beforeRequest.bind(this), this.onRequestError.bind(this));
    this.service.interceptors.response.use(this.afterResponse.bind(this), this.onResponseError.bind(this));

    if (options.REQUEST) {
      const { API = {}, METHOD = {} } = options.REQUEST;

      Object.keys(API).forEach((module) => Object.assign(API_SET[module], API[module]));
      Object.keys(METHOD).forEach((key) => this[key] = METHOD[key].bind(this));
    }
    this.renewCancelToken();
  }

  get appVersion() {
    return window.appVersion;
  }

  renewCancelToken() {
    this.cancelTokenSource = axios.CancelToken.source();
  }

  setConfInfo(confInfo = {}) {
    this.confInfo = { // fix confInfo may exist other info
      'conference-user-id' : confInfo['conference-user-id'],
      'conference-uuid'    : confInfo['conference-uuid'],
    };
  }

  reset() {
    this.token = '';
    this.version = 0;
    this.confInfo = {};
    this.cancelRequest();
  }

  cancelRequest() {
    this.cancelTokenSource.cancel('All Request Canceled');
    this.renewCancelToken();
  }

  updateToken(payload = {}) {
    return this.getVirtualJWT(payload);
  }

  updateVersion(version) {
    if (version) this.version = version;
  }

  // UA接口
  getUrl(payload = {}) {
    const params = {
      'long-number' : payload.longNumber,
    };

    return this.post(UA_API.GET_URL, params).then(async ({ data }) => {
      const partyId = data['party-id'];

      if (partyId) {
        await this.getVirtualJWT({ partyId });
        this.partyId = partyId;
      }

      return data;
    });
  }
  joinFocus(payload = {}) {
    const params = {
      'conference-url'      : `${ payload.number }@${ payload.server }`,
      'client-url'          : `${ payload.client || 'webrtc' }@${ payload.server }`,
      'conference-pwd'      : payload.password,
      'client-display-text' : payload.displayText,
      'client-type'         : payload.clientType || 'http',
      'user-agent'          : payload.userAgent || `Yealink WEB-APP ${ this.appVersion }`,
      'client-info'         : payload.clientInfo || `Apollo_WebRTC ${ this.appVersion }`,
      'is-webrtc'           : payload.isWebRTC == null ? true : payload.isWebRTC,
      'pure-ctrl-channel'   : payload.pureCtrl == null ? false : payload.pureCtrl,
    };

    logger.info(UA_API.JOIN_FOCUS, params);

    return this.post(UA_API.JOIN_FOCUS, params);
  }
  leave(options) { return this.post(UA_API.LEAVE, options); }
  end(options) { return this.post(UA_API.END, options); }

  // 外部接口
  getVirtualJWT(payload = {}) {
    return this.get(EXTERNAL_API.GET_VIRTUAL_JWT, { id: payload.partyId || this.partyId })
      .then(({ data }) => this.token = data.token);
  }
  getSystemConfig() {
    return this.get(EXTERNAL_API.GET_SYS_CONFIG).then(({ data }) => data);
  }

  // IM 接口
  sendIMInfo(options = {}) {
    const { userEntityList, content } = options;

    return this.post(IM_API.SEND_IM_INFO, {
      'user-entity-list' : userEntityList,
      'im-context'       : content,
    });
  }
  getAllIMInfo(options = {}) {
    return this.post(IM_API.GET_ALL_IM_INFO, options);
  }

  // 媒体相关
  joinMedia(payload = {}) {
    const params = {
      'conference-url'      : `${ payload.number }@${ payload.server }`,
      'client-url'          : `${ payload.client || 'webrtc' }@${ payload.server }`,
      'conference-pwd'      : payload.password,
      'client-display-text' : payload.displayText,
      'user-agent'          : payload.userAgent || 'WebRTC',
      'is-webrtc'           : payload.isWebRTC == null ? true : payload.isWebRTC,
      sdp                   : payload.sdp,
    };

    logger.info(MEDIA_API.JOIN_MEDIA, params);

    return this.post(MEDIA_API.JOIN_MEDIA, params).then((res) => {
      console.warn(res);

      return res;
    });
  }
  joinApplicationSharing(payload = {}) {
    const params = {
      sdp : payload.sdp,
    };

    logger.info(MEDIA_API.JOIN_APPLICATION_SHARING, params);

    return this.post(MEDIA_API.JOIN_APPLICATION_SHARING, params).then((res) => {
      console.warn(res);

      return res;
    });
  }
  switchApplicationSharing(payload = {}) {
    const params = {
      share : payload.share,
    };

    logger.info(MEDIA_API.SWITCH_APPLICATION_SHARING, params);

    return this.post(MEDIA_API.SWITCH_APPLICATION_SHARING, params);
  }
  byeApplicationSharing(payload = {}) {
    logger.info(MEDIA_API.BYE_APPLICATION_SHARING);

    return this.post(MEDIA_API.BYE_APPLICATION_SHARING).then((res) => {
      console.warn(res);

      return res;
    });
  }
  renegApplicationSharing(payload = {}) {
    const params = {
      'media-version' : payload.mediaVersion,
      sdp             : payload.sdp,
    };

    logger.info(MEDIA_API.RENEG_APPLICATION_SHARING, params);

    return this.post(MEDIA_API.RENEG_APPLICATION_SHARING, params).then((res) => {
      console.warn(res);

      return res;
    });
  }
  renegotiate(payload = {}) {
    const params = {
      'media-version' : payload.mediaVersion,
      sdp             : payload.sdp,
    };

    return this.post(MEDIA_API.RENEGOTIATE, params);
  }

  // Polling
  polling(options = {}) {
    return this.post(CONF_API.POLLING, options);
  }
  keepalive(options = {}) {
    return this.post(CONF_API.KEEP_ALIVE, options);
  }

  // Conference 接口
  getFullConfInfo(options = {}) {
    return this.post(CONF_API.FULL_CONF_INFO, options);
  }
  getShortConfInfo(options = {}) {
    return this.post(CONF_API.SHORT_CONF_INFO, { 'conference-url': options.confUrl });
  }
  getOfflineConfInfo(options = {}) {
    return this.post(CONF_API.OFFLINE_CONF_INFO, { 'long-number': options.longNumber });
  }
  getConfStats(options = {}) {
    return this.post(CONF_API.CONF_STATS, {
      'user-entity-list' : options.userEntityList,
    }).then(({ data }) => data && data['call-stats']);
  }

  // Controller 接口
  muteAll(options) { return this.post(CTRL_API.MUTE_ALL, options); }
  unmuteAll(options) { return this.post(CTRL_API.UNMUTE_ALL, options); }
  grantLobbyUser(options) { return this.post(CTRL_API.GRANT_LOBBY_USER, options); }
  grantLobbyAll(options) { return this.post(CTRL_API.GRANT_LOBBY_ALL, options); }
  rejectLobbyAll(options = {}) { return this.post(CTRL_API.REJECT_LOBBY_ALL, options); }
  rejectHandUpAll(options = {}) { return this.post(CTRL_API.REJECT_HAND_UP_ALL, options); }
  deleteUser(options) { return this.post(CTRL_API.DELETE_USER, options); }
  kickFromConf(options) { return this.post(CTRL_API.DELETE_USER, options); }
  modifyUserMedia(options = {}) {
    const {
      member, mediaType = 'audio', mediaStatus, mediaFilter = 'ingress',
    } = options;
    const params = {
      'user-entity'     : member.entity,
      'endpoint-entity' : member.endpointAvEntity, // 端点entity，媒体的端点
      'media-id'        : member[mediaType].id,
    };

    // 是否开启该媒体功能 block与unblock才是有效参数，block关闭媒体流，unblock开启媒体流
    if (mediaFilter === 'egress') {
      params['media-egress-filter'] = mediaStatus || (member[mediaType].egressBlock ? 'unblock' : 'block');
    }
    else {
      params['media-ingress-filter'] = mediaStatus || (member[mediaType].ingressBlock ? 'unblock' : 'block');
    }

    return this.post(CTRL_API.MODIFY_USER_MEDIA, params);
  }
  modifyUserRole(options = {}) {
    const { role, userEntity } = options;

    return this.post(CTRL_API.MODIFY_USER_ROLE, { role, 'user-entity': userEntity });
  }
  setUserOnHold(options) { return this.post(CTRL_API.WAIT_LOBBY_USER, options); }
  inviteUser(options) { return this.post(CTRL_API.INVITE_USER, options); }
  lockConf(options) {
    const { admissionPolicy, attendeeLobbyBypass } = options;
    const params = {
      'admission-policy' : admissionPolicy,
    };

    if (attendeeLobbyBypass != null) params['attendee-by-pass'] = attendeeLobbyBypass;

    return this.post(CTRL_API.LOCK_CONF, params);
  }

  get(uri, data) { return this.doRequest({ uri, data, method: 'get' }); }
  post(uri, data) { return this.doRequest({ uri, data, method: 'post' }); }
  put(uri, data) { return this.doRequest({ uri, data, method: 'put' }); }
  patch(uri, data) { return this.doRequest({ uri, data, method: 'patch' }); }
  delete(uri, data) { return this.doRequest({ uri, data, method: 'delete' }); }

  async doRequest(options = {}) {
    const { uri, data = {}, method = 'get' } = options;
    const config = {
      cancelToken : this.cancelTokenSource.token,
      headers     : {
        API_NAME : API_NAME(uri),
      },
    };

    Object.assign(data, this.confInfo);

    if (data.version == null) data.version = this.version;
    if (this.token) config.headers.token = this.token;

    let result = {};

    if (method === 'get') {
      config.params = data;

      result = await this.service[method](uri, config);
    }
    else {
      result = await this.service[method](uri, data, config);
    }

    const hasError = !result || (!isSuccess(result.bizCode) && !result.data);

    return hasError ? await Promise.reject(result) : result;
  }

  beforeRequest(request) {
    logger.info('beforeRequest: ', request);
    this.context.emit(EVENTS.REQUEST_STARTED, request);

    return request;
  }

  afterResponse(response) {
    const { data } = response;

    logger.info('afterResponse: ', response);

    // API error handler
    if (!isSuccess(data.bizCode)) {
      this.context.exceptionHandler.handlerApiException(response, this);
    }
    this.context.emit(EVENTS.REQUEST_FINISHED, response);

    return data;
  }

  onRequestError(error) {
    console.warn('onRequestError', error, error.message, error.name, axios.isCancel(error));
  }
  onResponseError(error) {
    switch (error.message) {
      case 'Request failed with status code 500':
      case 'Network Error':
        this.context.emit(EVENTS.NETWORK_ERROR);
        this.cancelRequest();
        break;
      case 'All Request Canceled': this.context.emit(EVENTS.ALL_REQUEST_CANCELED); break;
      default: break;
    }
    console.warn('onResponseError', error, error.message, error.name, axios.isCancel(error));
  }
}

export default Request;
