import { AxiosResponse } from 'axios';
import { Api } from '../api';
import { createKeepAlive, KeepAlive } from './keepalive';
import { createPolling, Polling } from './polling';
import { createInformation, Information } from './information';
import { ConferenceInformation } from './conference-info';
import { RequestResult } from '../api/request';
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
  let keepalive: KeepAlive;
  let polling: Polling;
  let interceptor: number;
  let information: Information;
  let conference;

  let connected: boolean = false;
  let uuid: string | undefined;
  let userId: string | undefined;

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

    // create information
    information = createInformation(info);

    // step 3
    // get pull im messages
    response = await api
      .request('pullMessage')
      .send();


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

        keepalive.stop();
        polling.stop();

        information = null;

        api.interceptors.request.eject(interceptor);

        events.emit('close', data);
      },

      onError : (data: any) => {
        console.log('onError', data);

        // TBD
        // should we leave?

        events.emit('error', data);
      },
    });

    keepalive.start();
    polling.start();

    connected = true;
  }

  async function leave() {
    if (!connected) {
      console.warn('already closed');
      return;
    }
    events.emit('disconnecting');

    await api
      .request('leave')
      .send();
  }

  return conference = {
    ...events,

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
  };
}

export type Conference = ReturnType<typeof createConference>;
