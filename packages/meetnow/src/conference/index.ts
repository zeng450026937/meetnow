import { AxiosResponse } from 'axios';
import { Api } from '../api';
import { createKeepAlive, KeepAlive } from './keepalive';
import { createPolling, Polling } from './polling';
import { createInformationUpdater, Information, InformationUpdater } from './information';
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
  let updater: InformationUpdater;
  let interceptor: number;
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

    let response: AxiosResponse<RequestResult>;
    let data: RequestResult;

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
        'clinet-info'         : 'Apollo_WebRTC',
        'pure-ctrl-channel'   : false,
        'is-webrtc'           : true,
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
          config.data = config.data || {};
          config.data['conference-user-id'] = userId;
          config.data['conference-uuid'] = uuid;
        }
        return config;
      });


    // step 2
    // get full info
    response = await api
      .request('getFullInfo')
      .send();

    ({ data } = response);


    // create information updater
    updater = createInformationUpdater(data.data as Information);


    // step 3
    // get pull im messages
    response = await api
      .request('pullMessage')
      .send();

    events.emit('connected', data);


    // step 4
    // create keepalive worker
    keepalive = createKeepAlive({ api });


    // step 5
    // create polling worker
    polling = createPolling({
      api,

      onInfomation : (data: Information) => {
        console.log('onInfomation', data);

        updater.update(data);

        events.emit('information', updater.data);

        if (data['conference-descriotion']) {
          events.emit('descriotionChanged');
        }
        if (data['conference-state']) {
          events.emit('stateChanged');
        }
        if (data['conference-view']) {
          events.emit('viewChanged');
        }
        if (data['record-users']) {
          events.emit('recordUsersChanged');
        }
        if (data['rtmp-users']) {
          events.emit('rtmpUsersChanged');
        }
        if (data.users) {
          events.emit('usersChanged');
        }
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

        updater = null;

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
    join,
    leave,
  };
}

export type Conference = ReturnType<typeof createConference>;
