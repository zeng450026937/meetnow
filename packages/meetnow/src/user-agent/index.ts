import { Api, ApiConfigs, createApi } from '../api';
import { createWorker, Worker } from '../utils/worker';
import { createConference } from '../conference';

export interface ConnectOptions {
  number: string;
  password?: string;
  displayName?: string;
}

export interface UAConfigs extends ApiConfigs {}

export function createUA() {
  let api: Api;
  let worker: Worker;
  let ua;

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

    const { data } = response;

    // TODO
    // check bizCode

    const { token } = data.data;

    if (!token) {
      console.error('internal error');
      debugger;
    }

    api.token = token;
  }

  function setup(): UA {
    api = createApi({ baseURL: 'https://meetings.ylyun.com/webapp/' });

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
