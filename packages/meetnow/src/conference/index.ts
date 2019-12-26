import debug from 'debug';
import { AxiosResponse } from 'axios';
import { Api } from '../api';
import { RequestResult } from '../api/request';
import { createKeepAlive, KeepAlive } from './keepalive';
import { createPolling, Polling } from './polling';
import { ConferenceInformation } from './conference-info';
import { createInformation, Information } from './information';
import { createContext } from './context';
import { createEvents } from '../events';
import { createMediaChannel } from '../channel/media-channel';

const log = debug('Meetnow:Conference');

export interface JoinOptions {
  url: string;
  number: string;
  password: string;
  displayName: string;
}

export interface ConferenceConfigs extends Partial<JoinOptions> {
  api: Api;
}

export function createConference(config: ConferenceConfigs) {
  const { api } = config;
  let {
    url,
    password,
  } = config;
  const events = createEvents(log);
  let keepalive: KeepAlive | undefined;
  let polling: Polling | undefined;
  let information: Information | undefined;
  let interceptor: number | undefined;
  let conference;

  let connected: boolean = false;
  let uuid: string | undefined;
  let userId: string | undefined; // as conference entity

  // Sequence of join conference
  //
  // 1. connect focus channel
  // 2. connect media channel
  // 3. connect share channel
  // 4. fetch conference info
  // 5. create keepalive worker
  // 6. create polling worker
  async function join(options?: Partial<JoinOptions>) {
    log('join()');

    if (connected) {
      log('already connected');
      return;
    }

    options = {
      ...config,
      ...options,
    };

    events.emit('connecting');

    let response: AxiosResponse<RequestResult>;
    let data: RequestResult;

    const hasMedia = true;

    if (!options.url && !options.number) {
      throw new TypeError('Invalid url or number.');
    }

    if (!options.url && options.number) {
      response = await api
        .request('getURL')
        .data({ 'long-number': options.number })
        .send();

      ({ data } = response);

      // extract url
      ({ url } = data.data);
    }

    // step 1
    // join focus
    response = await api
      .request('joinFocus')
      .data({
        // 'conference-uuid'     : null,
        // 'conference-user-id'  : null,
        'conference-url'      : options.url,
        'conference-pwd'      : options.password,
        'user-agent'          : 'Yealink Meeting WebRTC',
        'client-url'          : options.url.replace(/\w+@/g, 'webrtc@'),
        'client-display-text' : options.displayName || 'Yealink Meeting',
        'client-type'         : 'http',
        'client-info'         : 'Apollo_WebRTC',
        'pure-ctrl-channel'   : !hasMedia,
        // if join with media
        'is-webrtc'           : hasMedia,
        'is-wechat'           : false,
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

    ({ url, password } = options);

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

    // step 3
    // get pull im messages
    response = await api
      .request('pullMessage')
      .send();


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

        connected = false;

        /* eslint-disable-next-line no-use-before-define */
        cleanup();

        events.emit('disconnect', data);
      },

      onError : (data: any) => {
        log('polling error, about to leave... %o', data);

        events.emit('error', data);

        // there are some problems with polling
        // leave conference
        //
        /* eslint-disable-next-line no-use-before-define */
        leave();
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
    get useId() {
      return userId;
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
