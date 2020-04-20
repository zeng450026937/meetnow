import debug from 'debug';
import { AxiosResponse } from 'axios';
import { Api } from '../api';
import { RequestResult } from '../api/request';
import { Authentication, createTempAuth, createUserApi } from '../auth';
import { Conference, createConference, JoinOptions } from '../conference';

const log = debug('MN:UA');

export interface ConnectOptions extends JoinOptions {}

export interface UAConfigs {
  language?: string;
  auth?: Authentication;
}

export function urlToNumber(url: string) {
  const parts = url.split('@');
  const number = parts[0];
  const enterprise = parts[1].split('.')[0];
  return `${ number }.${ enterprise }`;
}

export interface UA {
  fetch: (number: string) => Promise<{
    number: string;
    partyId: string;
    url: string;
    info: object;
  }>;

  connect: (ConnectOptions) => Promise<Conference>;
}

export function createUA(config: UAConfigs = {}): UA {
  let { auth } = config;
  let api: Api | undefined;

  if (auth) {
    ({ api } = auth);
  }


  // fetch conference basic info
  async function fetch(number: string) {
    log('fetch()');

    let response: AxiosResponse<RequestResult>;
    let data: RequestResult;
    let info;
    let partyId: string;
    let url: string;

    if (!api) {
      api = createUserApi();
    }

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
      number, // long-number
      url,
      info,
    };
  }

  async function connect(options: ConnectOptions) {
    log('connect()');

    let partyId: string | undefined;
    let url: string | undefined;

    // create user api
    if (!api) {
      api = createUserApi();
    }

    if (!options.number) {
      throw new TypeError('Invalid Number');
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

    if (!partyId) {
      throw new TypeError('Invalid Number');
    }

    let isTempAuthLocallyGenerated = false;
    // temp auth
    if (!auth || !auth.token) {
      auth = await createTempAuth(partyId);
      ({ api } = auth);
      isTempAuthLocallyGenerated = true;
    }

    // create stand alone user api for conference.
    // auth is required
    const conference = createConference({ api });

    // hack join method
    const { join } = conference;
    conference.join = (additional) => {
      return join({
        url,
        ...options,
        ...additional,
      });
    };

    if (isTempAuthLocallyGenerated) {
      conference.once('disconnected', auth.invalid);
    }

    return conference;
  }

  return {
    fetch,
    connect,
  };
}
