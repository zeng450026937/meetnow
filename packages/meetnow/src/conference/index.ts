import { AxiosRequestConfig, AxiosResponse } from 'axios';
import { Api } from '../api';
import { createKeepAlive, KeepAlive } from './keepalive';
import { createPolling, Polling } from './polling';
import { createInformationUpdater, Information, InformationUpdater } from './information';
import { RequestResult } from '../api/request';

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
  let keepalive: KeepAlive;
  let polling: Polling;
  let conference;
  let info: Information;
  let updater: InformationUpdater;
  let interceptor: number;

  let uuid: string | undefined;
  let userId: string | undefined;

  // Sequence of join conference
  //
  // 1. connect focus channel
  // 2. connect media channel
  // 3. connect share channel
  // 4. create keepalive worker
  // 5. create polling worker
  // 6. fetch conference info
  async function join(options: JoinOptions) {
    let response: AxiosResponse<RequestResult>;
    let data: RequestResult;

    response = await api
      .request('joinFocus')
      .data({
      //   'conference-uuid'     : null,
      //   'conference-user-id'  : null,
        'conference-url'      : options.url,
        'conference-pwd'      : options.password,
        'user-agent'          : 'Yealink Meeting WebRTC',
        'client-url'          : options.url.replace(/\w+@/g, 'webrtc@'),
        'client-display-text' : options.url,
        'client-type'         : 'HTTP',
        'pure-ctrl-channel'   : true,
        'is-webrtc'           : true,
      })
      .send();

    ({ data } = response);

    // TODO
    // check bizCode

    ({
      'conference-user-id': userId,
      'conference-uuid': uuid,
    } = data.data);

    if (!userId || !uuid) {
      console.error('internal error');
      debugger;
    }

    api.interceptors.request.use((config) => {
      if (/conference-ctrl/.test(config.url) && config.method === 'post') {
        config.data = config.data || {};
        config.data['conference-user-id'] = userId;
        config.data['conference-uuid'] = uuid;
      }
      return config;
    });

    response = await api
      .request('getFullInfo')
      .send();

    ({ data } = response);

    updater = createInformationUpdater(data.data as Information);

    keepalive = createKeepAlive({ api });
    polling = createPolling({
      api,
      version      : updater.version,
      onInfomation : () => {
        console.log('onInfomation');
      },
    });

    keepalive.start();
    polling.start();
  }

  function leave() {
    keepalive.stop();
    polling.stop();

    updater = null;

    api.interceptors.request.eject(interceptor);
  }

  return conference = {
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
