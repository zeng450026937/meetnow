import { AxiosResponse } from 'axios';
import debug from 'debug';
import { Api } from '../api';
import { isCancel, Request, RequestResult } from '../api/request';
import { createWorker } from '../utils/worker';
import { ApiError } from '../api/api-error';
import { isDef } from '../utils';

const log = debug('Meetnow:Polling');

export const DEFAULT_INTERVAL = 100;
export const MIN_INTERVAL = 2;
export const MAX_INTERVAL = 30;

export interface PollingConfigs {
  api: Api;
  onInformation?: (...args: any[]) => void;
  onMessage?: (...args: any[]) => void;
  onRenegotiate?: (...args: any[]) => void;
  onQuit?: (...args: any[]) => void;
  onError?: (...args: any[]) => void;
}

function computeTimeout(upperBound: number) {
  const lowerBound = upperBound * 0.8;
  return 1000 * ((Math.random() * (upperBound - lowerBound)) + lowerBound);
}

function computeNextTimeout(attempts: number) {
  log(`computeNextTimeout() attempts: ${ attempts }`);

  /* eslint-disable-next-line no-restricted-properties */
  let k = Math.floor((Math.random() * Math.pow(2, attempts)) + 1);

  if (k < MIN_INTERVAL) {
    k = MIN_INTERVAL;
  }
  if (k > MAX_INTERVAL) {
    k = MAX_INTERVAL;
  }

  return k * 1000;
}

export function createPolling(config: PollingConfigs) {
  const { api } = config;
  let request: Request;
  let interval: number = DEFAULT_INTERVAL;
  let attempts: number = 0;

  let version: number = 0;

  function analyze(data: any) {
    if (!data) return;

    const { version: newVersion, category, body } = data;

    if (!isDef(newVersion) || newVersion <= version) {
      log(`illegal version: ${ newVersion }, current version: ${ version }.`);
      return;
    }

    switch (category) {
      case 'conference-info':
        config.onInformation && config.onInformation(body);
        break;

      case 'im-record':
        config.onMessage && config.onMessage(body);
        break;

      case 'port-change':
        config.onRenegotiate && config.onRenegotiate(body);
        break;

      case 'quit-conference':
        config.onQuit && config.onQuit(body);
        break;

      default:
        log(`unsupported category: ${ category }`);
        break;
    }

    version = newVersion;
  }

  async function poll() {
    log('poll()');

    let response: AxiosResponse<RequestResult>;
    let error: ApiError;
    let canceled: boolean = false;
    let timeouted: boolean = false;

    try {
      request = api.request('polling').data({ version });
      response = await request.send();
    } catch (e) {
      error = e;
      canceled = isCancel(e);

      if (canceled) return;

      // polling timeout
      timeouted = [900408, 901323].includes(error.bizCode);

      if (timeouted) return;

      // if request failed by network or server error,
      // increase next polling timeout
      attempts++;
      interval = computeNextTimeout(attempts);

      log('polling error: %o', error);
      config.onError && config.onError(error, attempts);
    }

    if (error || !response) return;

    const { bizCode, data } = response.data;

    // TODO
    // check bizCode

    try {
      analyze(data);
    } catch (error) {
      log('failed to process data.');
    }

    attempts = 0;
  }

  const worker = createWorker({
    work     : () => poll(),
    interval : () => interval,
    cancel   : () => request.cancel(),
  });

  return {
    ...worker,
    poll,
    analyze,
  };
}

export type Polling = ReturnType<typeof createPolling>;
