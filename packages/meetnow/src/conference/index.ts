import debug from 'debug';
import { AxiosResponse } from 'axios';
import { Api } from '../api';
import { RequestResult } from '../api/request';
import { createContext } from './context';
import { createEvents } from '../events';
import { createKeepAlive, KeepAlive } from './keepalive';
import { createPolling, Polling } from './polling';
import { ConferenceInformation } from './conference-info';
import { createInformation, Information } from './information';
import { createMediaChannel } from '../channel/media-channel';
import { CONFIG } from '../config';
import { isMiniProgram } from '../browser';
import { ApiError } from '../api/api-error';

const log = debug('Meetnow:Conference');
const miniprogram = isMiniProgram();

export enum Status {
  kNull = 0,
  kConnecting = 1,
  kConnected = 2,
  kDisconnecting = 3,
  kDisconnected = 4,
}

export interface JoinOptions {
  url: string;
  number: string;
  password: string;
  displayName: string;
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
  let conference;
  let user; // current user

  let connected: boolean = false;
  let uuid: string | undefined;
  let userId: string | undefined; // as conference entity
  let url: string | undefined;

  function getCurrentUser() {
    if (!user) {
      // try to get current user
      user = information.users.getCurrent();

      if (user) {
        events.emit('user', user);
      }
    }

    return user;
  }

  async function join(options?: Partial<JoinOptions>) {
    log('join()');

    if (connected) {
      log('already connected');
      return;
    }

    events.emit('connecting');

    let response: AxiosResponse<RequestResult>;
    let data: RequestResult;

    const hasMedia = true;

    if (!options.url && !options.number) {
      throw new TypeError('URL or Number is required');
    }

    if (!options.url && options.number) {
      response = await api
        .request('getURL')
        .data({ 'long-number': options.number })
        .send();

      ({ data } = response);
      // extract url
      ({ url: options.url } = data.data);
    }

    // step 1
    // join focus
    const apiName = miniprogram ? 'joinWechat' : 'joinFocus';

    response = await api
      .request(apiName)
      .data({
        // 'conference-uuid'     : null,
        // 'conference-user-id'  : null,
        'conference-url'      : options.url,
        'conference-pwd'      : options.password,
        'user-agent'          : CONFIG.get('useragent', 'Yealink Meeting WebRTC'),
        'client-url'          : options.url.replace(/\w+@/g, 'webrtc@'),
        'client-display-text' : options.displayName || 'Yealink Meeting',
        'client-type'         : 'http',
        'client-info'         : CONFIG.get('clientinfo', 'Apollo_WebRTC'),
        'pure-ctrl-channel'   : !hasMedia,
        // if join with media
        'is-webrtc'           : !miniprogram && hasMedia,
        'is-wechat'           : miniprogram,
        'video-session-info'  : miniprogram && {
          bitrate        : 600 * 1024,
          'video-width'  : 640,
          'video-height' : 480,
          'frame-rate'   : 15,
        },
      })
      .send();

    ({ data } = response);

    ({
      'conference-user-id': userId,
      'conference-uuid': uuid,
    } = data.data);

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
        if (/conference-ctrl/.test(config.url) && config.method === 'post') {
          config.data = {
            'conference-user-id' : userId,
            'conference-uuid'    : uuid,
            ...config.data,
          };
        }
        return config;
      });


    // step 2
    // get full info
    response = await api
      .request('getFullInfo')
      .send();

    ({ data } = response);


    const info = data.data as ConferenceInformation;

    // create context
    const context = createContext(conference);
    // create information
    information = createInformation(info, context);

    getCurrentUser();

    // step 3
    // get pull im messages
    // fail if we don't have permission yet, eg. in lobby
    try {
      response = await api
        .request('pullMessage')
        .send();
    } catch (error) {
      log('connect message failed: %o', error);
    }


    connected = true;

    events.emit('connected');


    // step 4
    // create keepalive worker
    keepalive = createKeepAlive({ api });


    // step 5
    // create polling worker
    polling = createPolling({
      api,

      onInformation : (data: ConferenceInformation) => {
        log('receive information: %o', data);

        information.update(data);

        events.emit('information', information);

        getCurrentUser();
      },

      onMessage : (data: any) => {
        log('receive message: %o', data);

        events.emit('message', data);
      },

      onRenegotiate : (data: any) => {
        log('receive renegotiate: %o', data);

        events.emit('renegotiate', data);
      },

      onQuit : (data: any) => {
        log('receive quit: %o', data);

        // bizCode = 901314 ended by presenter
        // bizCode = 901320 kicked by presenter

        /* eslint-disable-next-line no-use-before-define */
        cleanup();

        connected = false;

        events.emit('disconnect', data);
      },

      onError : (data: ApiError) => {
        log('polling error, about to leave... %o', data);

        events.emit('error', data);

        // there are some problems with polling
        // leave conference
        //
        /* eslint-disable-next-line no-use-before-define */
        cleanup();

        connected = false;

        events.emit('disconnect', data);
      },
    });

    // start keepalive & polling
    keepalive.start();
    polling.start();

    // test
    const mediaChannel = createMediaChannel({ api });
    await mediaChannel.connect();
  }

  async function leave() {
    if (!connected) {
      log('already disconnected');
      return;
    }

    events.emit('disconnecting');

    await api
      .request('leave')
      .send();
  }

  async function end() {
    if (!connected) {
      log('already disconnected');
      return;
    }
    await api
      .request('end')
      .data({ 'conference-url': url })
      .send();
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

    join,
    leave,
    end,
  };
}

export type Conference = ReturnType<typeof createConference>;
