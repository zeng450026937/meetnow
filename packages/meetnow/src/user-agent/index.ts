import debug from 'debug';
import { AxiosResponse } from 'axios';
import { Api, createApi } from '../api';
import { RequestResult } from '../api/request';
import { createWorker, Worker } from '../utils/worker';
import { createConference } from '../conference';

const log = debug('MN:UA');

export interface ConnectOptions {
  number: string;
  password?: string;
  displayName?: string;
}

export interface UAConfigs {
  language?: string;
}

export function urlToNumber(url: string) {
  const parts = url.split('@');
  const number = parts[0];
  const enterprise = parts[1].split('.')[0];
  return `${ number }.${ enterprise }`;
}

export function createUA(config?: UAConfigs) {
  let api: Api;
  let worker: Worker;
  let token: string | undefined;
  let partyId: string | undefined;
  let url: string | undefined;

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
    log('auth()');

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

  function stop() {
    log('stop()');

    if (worker) {
      worker.stop();
    }

    // clear token will break all api request
    token = undefined;
  }

  async function fetch(number: string) {
    log('fetch()');

    let response: AxiosResponse<RequestResult>;
    let data: RequestResult;
    let info;
    let partyId: string;
    let url: string;

    // get conference url
    response = await api
      .request('getURL')
      .data({ 'long-number': number })
      .send();

    ({ data } = response);
    /* eslint-disable-next-line prefer-const */
    ({ 'party-id': partyId, url } = data.data);

    // get conference info
    try {
      response = await api
        .request('getBasicInfo')
        .data({ 'conference-url': (url as string) })
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

  // currently, we don't support connect multiple conference for authenticate reason
  async function connect(options: ConnectOptions) {
    log('connect()');

    // create user api
    if (!api) {
      api = createUserApi();
    }

    // creat auth() worker
    if (!worker) {
      worker = createWorker({
        interval : 5 * 60 * 1000,
        work     : async () => {
          await auth();
        },
      });
    }

    const { number } = options;

    // get conference url
    const response = await api
      .request('getURL')
      .data({ 'long-number': number })
      .send();

    const { data } = response;
    /* eslint-disable-next-line prefer-const */
    ({ 'party-id': partyId, url } = data.data);

    await worker.start();

    const conference = createConference({ api: createUserApi() });

    // hack join method
    const { join } = conference;
    conference.join = (additional) => {
      return join({
        url,
        ...options,
        ...additional,
      });
    };

    // stop auth worker as we can only connect one conference
    conference.once('disconnected', stop);

    return conference;
  }

  return {
    stop,

    fetch,
    connect,
  };
}

export type UA = ReturnType<typeof createUA>;
