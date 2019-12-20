import { Api, createApi } from '../api';
import { createWorker, Worker } from '../utils/worker';
import { createConference } from '../conference';

export interface ConnectOptions {
  number: string;
  password?: string;
  displayName?: string;
}

export interface UAConfigs {}

export function createUA() {
  let api: Api;
  let worker: Worker;
  let ua;

  const anonymous: boolean = true;
  let token: string | undefined;
  let partyId: string | undefined;
  let url: string | undefined;

  async function auth() {
    if (!partyId) {
      console.error('internal error');
      debugger;
    }

    const response = await api
      .request('getVirtualJWT')
      .params({ id: partyId })
      .send();

    ({ token } = response.data.data);

    if (!token) {
      console.error('internal error');
      debugger;
    }
  }

  function setup(): UA {
    // create api
    api = createApi({ baseURL: '/webapp/' });

    // setup token for all api request
    api.interceptors.request.use((config) => {
      if (token) {
        config.headers = config.headers || {};
        config.headers.token = token;
      }
      return config;
    });

    // creat auth() worker
    worker = createWorker({
      interval : 5 * 60 * 1000,
      work     : () => auth(),
    });

    return ua;
  }

  async function connect(options: ConnectOptions) {
    const {
      number,
      password,
      displayName = 'Yealink Meeting',
    } = options;

    const response = await api
      .request('getURL')
      .data({ 'long-number': number })
      .send();

    const { data } = response;

    // TODO
    // check bizCode

    ({ 'party-id': partyId, url } = data.data);

    await auth();

    worker.start();

    const conference = createConference({ api });

    conference.join({ ...options, url });

    return conference;
  }

  return ua = {
    setup,
    connect,
  };
}

export type UA = ReturnType<typeof createUA>;
