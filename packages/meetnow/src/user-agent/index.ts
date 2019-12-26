import debug from 'debug';
import { AxiosResponse } from 'axios';
import { Api, createApi } from '../api';
import { RequestResult } from '../api/request';
import { createWorker, Worker } from '../utils/worker';
import { createConference } from '../conference';

const log = debug('Meetnow:UA');

debug.enable('Meetnow*');

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

export function urlToNumber(url: string) {
  const parts = url.split('@');
  const number = parts[0];
  const enterprise = parts[1].split('.')[0];
  return `${ number }.${ enterprise }`;
}

export function createUA(config?: UAConfigs) {
  const { username, password } = config || {};
  const anonymous: boolean = !username && !password;
  let api: Api;
  let worker: Worker;
  let token: string | undefined;
  let partyId: string | undefined;
  let ua;

  /* eslint-disable-next-line no-use-before-define */
  setup();

  function setup() {
    /* eslint-disable no-use-before-define */

    // create user api
    api = createUserApi();

    // creat auth() worker
    worker = createWorker({
      interval : 5 * 60 * 1000,
      work     : async () => {
        await auth();
      },
    });

    /* eslint-enable no-use-before-define */
  }

  function createUserApi() {
    const api = createApi({ baseURL: '/webapp/' });

    api.interceptors.request.use((config) => {
      if (token) {
        config.headers = config.headers || {};
        config.headers.token = token;
      }
      return config;
    });

    return api;
  }

  async function auth() {
    if (anonymous) {
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
  }

  function start() {
    log('start()');

    if (!worker) {
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

    partyId = null;
    token = null;
  }

  async function fetch(number: string, url?: string) {
    log('fetch()');

    let response: AxiosResponse<RequestResult>;
    let data: RequestResult;
    let info;
    let partyId: string;

    if (!url) {
      // get conference url
      response = await api
        .request('getURL')
        .data({ 'long-number': number })
        .send();

      ({ data } = response);
      /* eslint-disable-next-line prefer-const */
      ({ 'party-id': partyId, url } = data.data);
    }

    // get conference info
    try {
      response = await api
        .request('getBasicInfo')
        .data({ 'conference-url': url })
        .send();

      ({ data } = response);

      info = data.data;
    } catch (error) {
      log('Conference not started.');

      try {
        response = await api
          .request('getBasicInfoOffline')
          .data({ 'long-number': number })
          .send();

        ({ data } = response);

        info = data.data;
      } catch (error) {
        log('Conference not exist.');
      }
    }

    if (!info) {
      throw new Error('Not Exist');
    }

    return {
      partyId,
      number,
      url,
      info,
    };
  }

  async function connect(options: ConnectOptions) {
    const { number } = options;

    // get conference url
    const response = await api
      .request('getURL')
      .data({ 'long-number': number })
      .send();

    const { data } = response;
    let url;
    /* eslint-disable-next-line prefer-const */
    ({ 'party-id': partyId, url } = data.data);

    if (anonymous) {
      await auth();
      worker.start(false);
    }

    return createConference({
      api : createUserApi(),
      url,
      ...options,
    });
  }

  return ua = {
    auth,
    stop,

    fetch,
    connect,
  };
}

export type UA = ReturnType<typeof createUA>;
