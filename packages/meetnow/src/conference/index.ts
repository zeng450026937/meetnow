import debug from 'debug';
import { AxiosResponse } from 'axios';
import { getBrowser, isMiniProgram } from '../browser';
import { Api } from '../api';
import { Request, RequestResult } from '../api/request';
import { createContext } from './context';
import { createEvents } from '../events';
import { createKeepAlive, KeepAlive } from './keepalive';
import { createPolling, Polling } from './polling';
import { ConferenceInformation } from './conference-info';
import { createInformation, Information, User } from './information';
import { ConnectOptions, createMediaChannel, MediaChannel } from '../channel/media-channel';
import { ChatChannel, createChatChannel } from '../channel/chat-channel';
import { CONFIG } from '../config';
import { ApiError } from '../api/api-error';

const log = debug('MN:Conference');

const miniprogram = isMiniProgram();
const browser = getBrowser();

export enum STATUS {
  kNull = 0,
  kConnecting = 1,
  kConnected = 2,
  kDisconnecting = 3,
  kDisconnected = 4,
}

export interface JoinOptions {
  url?: string;
  number: string;
  password?: string;
  displayName?: string;
}

export interface ConferenceConfigs {
  api: Api;
}

export function createConference(config: ConferenceConfigs) {
  const { api } = config;
  const events = createEvents(log);

  let keepalive: KeepAlive | undefined;
  let polling: Polling | undefined;
  let information: Information | undefined;
  let interceptor: number | undefined;

  let conference: any;
  let mediaChannel: MediaChannel | undefined;
  let shareChannel: MediaChannel | undefined;
  let chatChannel: ChatChannel | undefined;
  let user: User | undefined; // current user

  let status: STATUS = STATUS.kNull;
  let uuid: string | undefined;
  let userId: string | undefined; // as conference entity
  let url: string | undefined;

  let request: Request | undefined; // request chain

  let trtc: object;


  function getCurrentUser() {
    if (!user) {
      // try to get current user
      user = information!.users.getCurrent();

      if (user) {
        events.emit('user', user);

        /* eslint-disable-next-line no-use-before-define */
        user.on('holdChanged', maybeChat);
      }
    }

    return user;
  }

  function throwIfStatus(condition: STATUS, message?: string) {
    if (status !== condition) return;
    throw new Error(message || 'Invalid State');
  }
  function throwIfNotStatus(condition: STATUS, message?: string) {
    if (status === condition) return;
    throw new Error(message || 'Invalid State');
  }

  function onConnecting() {
    log('conference connecting');

    status = STATUS.kConnecting;
    events.emit('connecting');
  }
  function onConnected() {
    log('conference connected');

    /* eslint-disable-next-line no-use-before-define */
    setup();

    status = STATUS.kConnected;
    events.emit('connected');
  }
  function onDisconnecting() {
    log('conference disconnecting');

    status = STATUS.kDisconnecting;
    events.emit('disconnecting');
  }
  function onDisconnected(data?: any) {
    log('conference disconnected');

    /* eslint-disable-next-line no-use-before-define */
    cleanup();

    status = STATUS.kDisconnected;
    events.emit('disconnected', data);
  }
  function onAccepted() {
    log('conference accepted');

    events.emit('accepted');
  }

  async function maybeChat() {
    if (!chatChannel) return;
    if (chatChannel.ready) return;

    await chatChannel.connect().catch(() => {});
  }

  async function join(options: Partial<JoinOptions> = {}) {
    log('join()');

    throwIfNotStatus(STATUS.kNull);

    if (!options.url && !options.number) {
      throw new TypeError('Invalid Number');
    }

    status = STATUS.kConnecting;
    onConnecting();

    let response: AxiosResponse<RequestResult> | undefined;
    let data: RequestResult | undefined;

    const hasMedia = true;

    if (!options.url && options.number) {
      request = api
        .request('getURL')
        .data({ 'long-number': options.number });

      response = await request.send();

      ({ data } = response);
      // extract url
      ({ url: options.url } = data.data);
    }

    const useragent = CONFIG.get('useragent', `Yealink ${ miniprogram ? 'WECHAT' : 'WEB-APP' } ${ __VERSION__ }`);
    const clientinfo = CONFIG.get('clientinfo', `${ miniprogram ? 'Apollo_WeChat' : 'Apollo_WebRTC' } ${ __VERSION__ }`);

    // join focus
    const apiName = miniprogram ? 'joinWechat' : 'joinFocus';

    request = api
      .request(apiName)
      .data({
      // 'conference-uuid'     : null,
      // 'conference-user-id'  : null,
        'conference-url'      : options.url!,
        'conference-pwd'      : options.password,
        'user-agent'          : useragent,
        'client-url'          : options.url!.replace(/\w+@/g, miniprogram ? 'wechat@' : 'webrtc@'),
        'client-display-text' : options.displayName || `${ browser }`,
        'client-type'         : 'http',
        'client-info'         : clientinfo,
        'pure-ctrl-channel'   : !hasMedia,
        // if join with media
        'is-webrtc'           : !miniprogram && hasMedia,
        'is-wechat'           : miniprogram,
        'video-session-info'  : miniprogram && {
          bitrate        : 600 * 1024,
          'video-width'  : 640,
          'video-height' : 480,
          'frame-rate'   : 15,
        } as any,
      });

    try {
      response = await request.send();
    } catch (error) {
      events.emit('failed', error);
      throw error;
    }

    ({ data } = response);

    ({
      'conference-user-id': userId,
      'conference-uuid': uuid,
    } = data.data);

    trtc = miniprogram ? data.data : {};

    onAccepted();

    if (!userId || !uuid) {
      log('internal error');
      throw new Error('Internal Error');
    }

    // save url
    ({ url } = options);

    // setup request interceptor for ctrl api
    interceptor = api
      .interceptors
      .request
      .use((config) => {
        if (/conference-ctrl/.test(config.url!) && config.method === 'post') {
          config.data = {
            'conference-user-id' : userId,
            'conference-uuid'    : uuid,
            ...config.data,
          };
        }
        return config;
      });


    // get full info
    request = api
      .request('getFullInfo');

    try {
      response = await request.send();
    } catch (error) {
      events.emit('failed', error);
      throw error;
    }

    ({ data } = response);

    const info = data.data as ConferenceInformation;
    // create context

    const context = createContext(conference);
    // create information

    information = createInformation(info, context);

    onConnected();

    return conference as Conference;
  }

  async function leave() {
    throwIfStatus(STATUS.kDisconnecting);
    throwIfStatus(STATUS.kDisconnected);

    switch (status) {
      case STATUS.kNull:
        // nothing to do
        break;
      case STATUS.kConnecting:
      case STATUS.kConnected:
        if (status === STATUS.kConnected) {
          onDisconnecting();

          await api
            .request('leave')
            .send();

          onDisconnected();
        } else if (request) {
          request.cancel();

          onDisconnected();
        }
        break;
      case STATUS.kDisconnecting:
      case STATUS.kDisconnected:
      default:
        break;
    }

    return conference as Conference;
  }

  async function end() {
    throwIfNotStatus(STATUS.kConnected);

    await leave();

    await api
      .request('end')
      .data({ 'conference-url': url! })
      .send();

    return conference as Conference;
  }

  function setup() {
    getCurrentUser();

    const { state, users } = information!;

    state.on('sharingUserEntityChanged', (val: string) => {
      events.emit('sharinguser', users.getUser(val));
    });
    state.on('speechUserEntityChanged', (val: string) => {
      events.emit('speechuser', users.getUser(val));
    });

    users.on('user:added', (...args: any[]) => events.emit('user:added', ...args));
    users.on('user:updated', (...args: any[]) => events.emit('user:updated', ...args));
    users.on('user:deleted', (...args: any[]) => events.emit('user:deleted', ...args));

    // create keepalive worker
    keepalive = createKeepAlive({ api });

    // create polling worker
    polling = createPolling({
      api,

      onInformation : (data: ConferenceInformation) => {
        log('receive information: %o', data);

        information!.update(data);

        events.emit('information', information);

        getCurrentUser();
      },

      onMessage : (data: any) => {
        log('receive message: %o', data);

        chatChannel!.incoming(data);
      },

      onRenegotiate : (data: any) => {
        log('receive renegotiate: %o', data);

        mediaChannel!.renegotiate();
      },

      onQuit : (data: any) => {
        log('receive quit: %o', data);

        if (status === STATUS.kDisconnecting || status === STATUS.kDisconnected) return;
        // bizCode = 901314 ended by presenter
        // bizCode = 901320 kicked by presenter
        onDisconnected(data);
      },

      onError : (data: ApiError) => {
        log('polling error, about to leave...');

        events.emit('error', data);

        // there are some problems with polling
        // leave conference
        //
        onDisconnected(data);
      },
    });

    // start keepalive & polling
    keepalive.start();
    polling.start();

    // create channels
    mediaChannel = createMediaChannel({ api, type: 'main' });
    shareChannel = createMediaChannel({ api, type: 'slides' });
    chatChannel = createChatChannel({ api });

    chatChannel.on('message', (...args: any[]) => events.emit('message', ...args));
    chatChannel.on('ready', (...args: any[]) => events.emit('chatready', ...args));

    maybeChat();
  }

  function cleanup() {
    if (keepalive) {
      keepalive.stop();
    }
    if (polling) {
      polling.stop();
    }
    if (interceptor) {
      api.interceptors.request.eject(interceptor);
    }
    if (mediaChannel) {
      mediaChannel.terminate();
    }
    if (shareChannel) {
      shareChannel.terminate();
    }
    if (chatChannel) {
      chatChannel.terminate();
    }

    request = undefined;
  }

  async function share(options?: ConnectOptions) {
    throwIfNotStatus(STATUS.kConnected);

    if (!shareChannel!.isInProgress() && !shareChannel!.isEstablished()) {
      await shareChannel!.connect(options);
    }
    await api
      .request('switchShare')
      .data({ share: true })
      .send();
  }

  async function setSharing(enable: boolean = true) {
    throwIfNotStatus(STATUS.kConnected);

    await api
      .request('switchShare')
      .data({ share: enable })
      .send();
  }

  async function sendMessage(msg: string, target?: string[]) {
    throwIfNotStatus(STATUS.kConnected);

    if (!chatChannel || !chatChannel.ready) throw new Error('Not Ready');

    await chatChannel.sendMessage(msg, target);
  }

  return conference = {
    ...events,

    get api() {
      return api;
    },

    get url() {
      return url;
    },
    get uuid() {
      return uuid;
    },
    // in conference info
    // user entity is string type
    // while we may receive number type
    // change to string type
    get userId() {
      return `${ userId }`;
    },
    get user() {
      return user;
    },

    get information() {
      return information;
    },

    get description() {
      return information && information.description;
    },
    get state() {
      return information && information.state;
    },
    get view() {
      return information && information.view;
    },
    get users() {
      return information && information.users;
    },
    get rtmp() {
      return information && information.rtmp;
    },
    get record() {
      return information && information.record;
    },

    get mediaChannel() {
      return mediaChannel;
    },
    get shareChannel() {
      return shareChannel;
    },
    get chatChannel() {
      return chatChannel;
    },

    get trtc() {
      return trtc;
    },

    join,
    leave,
    end,

    share,
    setSharing,

    sendMessage,
  };
}

export type Conference = ReturnType<typeof createConference>;
