import { AxiosResponse } from 'axios';
import { Api } from '../api';
import { RequestResult } from '../api/request';
import { createKeepAlive, KeepAlive } from './keepalive';
import { createPolling, Polling } from './polling';
import { ConferenceInformation } from './conference-info';
import { createInformation, Information } from './information';
import { createContext } from './context';
import { createEvents } from '../events';

export interface JoinOptions {
  number: string;
  password?: string;
  displayName?: string;
  url: string;
}

export interface ConferenceConfigs {
  api: Api;
}

export function createConference(config: ConferenceConfigs) {
  const { api } = config;
  const events = createEvents();
  let keepalive: KeepAlive | undefined;
  let polling: Polling | undefined;
  let interceptor: number | undefined;
  let information: Information | undefined;
  let conference;

  let connected: boolean = false;
  let url: string | undefined;
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
  async function join(options: JoinOptions) {
    if (connected) {
      console.warn('already connected');
      return;
    }
    events.emit('connecting');

    let response: AxiosResponse<RequestResult>;
    let data: RequestResult;

    const hasMedia = true;

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
      })
      .send();

    ({ data } = response);

    ({ url } = options);
    ({
      'conference-user-id': userId,
      'conference-uuid': uuid,
    } = data.data);

    if (!userId || !uuid) {
      console.error('internal error');
      debugger;
    }

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

      onInfomation : (data: ConferenceInformation) => {
        console.log('onInfomation', data);

        information.update(data);

        events.emit('information', information);
      },

      onMessage : (data: any) => {
        console.log('onMessage', data);

        events.emit('message', data);
      },

      onRenegotiate : (data: any) => {
        console.log('onRenegotiate', data);

        events.emit('renegotiate', data);
      },

      onQuit : (data: any) => {
        console.log('onQuit', data);

        connected = false;

        /* eslint-disable-next-line no-use-before-define */
        cleanup();

        events.emit('disconnect', data);
      },

      onError : (data: any) => {
        console.log('onError', data);

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
  }

  async function leave() {
    if (!connected) {
      console.warn('already disconnected');
      return;
    }

    events.emit('disconnecting');

    await api
      .request('leave')
      .send();
  }

  async function end() {
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

    get descriotion() {
      return information && information.descriotion;
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

    join,
    leave,
    end,
  };
}

export type Conference = ReturnType<typeof createConference>;
