import debug from 'debug';
import { Api, createApi } from '../api';
import { createWorker, Worker } from '../utils/worker';
import { createConference } from '../conference';

const log = debug('UA');

export interface ConnectOptions {
  number: string;
  password?: string;
  displayName?: string;
}

export interface UAConfigs {
  username?: string;
  password?: string;
  language?: string;
}

export function createUA(config?: UAConfigs) {
  const { username, password } = config || {};
  const anonymous: boolean = !!username && !!password;
  const api = createApi({ baseURL: '/webapp/' });
  let worker: Worker | undefined;
  let token: string | undefined;
  let partyId: string | undefined;
  let ua;

  // setup token for all api request
  api.interceptors.request.use((config) => {
    if (token) {
      config.headers = config.headers || {};
      config.headers.token = token;
    }
    return config;
  });

  async function auth() {
    if (!partyId) {
      throw new Error('Authorization Error');
    }

    const response = await api
      .request('getVirtualJWT')
      .params({ id: partyId })
      .send();

    ({ token } = response.data.data);

    if (!token) {
      throw new Error('Authorization Error');
    }
  }

  function start() {
    log('start()');

    if (!worker) {
      // creat auth() worker
      worker = createWorker({
        interval : 5 * 60 * 1000,
        work     : async () => {
          await auth();
        },
      });
    }

    worker.start(false);
  }

  function stop() {
    log('stop()');

    if (worker) {
      worker.stop();
    }
  }

  async function connect(options: ConnectOptions) {
    const {
      number,
      password,
      displayName,
    } = options;

    const response = await api
      .request('getURL')
      .data({ 'long-number': number })
      .send();

    const { data } = response.data;
    let url;
    ({ 'party-id': partyId, url } = data);

    await auth();

    worker.start(false);

    const conference = createConference({ api });

    conference.join({ ...options, url });

    return conference;
  }

  return ua = {
    start,
    stop,

    connect,
  };
}

export type UA = ReturnType<typeof createUA>;
