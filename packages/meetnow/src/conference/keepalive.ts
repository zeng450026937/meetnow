import { createRequest, isCancel } from '../api/request';
import { createWorker } from '../utils/worker';

export const DEFAULT_INTERVAL = 30 * 1000;
export const MIN_INTERVAL = 2;
export const MAX_INTERVAL = 30;

export interface KeepAliveConfigs {
  api: any;
  interval?: number;
}

function computeTimeout(upperBound: number) {
  const lowerBound = upperBound * 0.8;
  return 1000 * ((Math.random() * (upperBound - lowerBound)) + lowerBound);
}

function computeNextTimeout(attempts: number) {
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

export function createKeepAlive(config: KeepAliveConfigs) {
  let request: ReturnType<typeof createRequest> | undefined;
  let canceled: boolean = false;
  let interval: number = DEFAULT_INTERVAL;
  let attempts: number = 0;

  async function keepalive() {
    let response;
    let error;

    try {
      canceled = false;
      response = await request.send();
    } catch (e) {
      error = e;
      canceled = isCancel(e);
      // if request failed by network or server error,
      // increase next request timeout
      if (!canceled) {
        attempts++;
        interval = computeNextTimeout(attempts);
      }
    }

    if (error || canceled) return;

    const {
      bizCode,
      data = {
        interval,
      },
    } = response;

    // TODO
    // check bizCode

    const {
      interval: expectedInterval,
    } = data;

    interval = Math.min(expectedInterval, interval);
  }

  const worker = createWorker({
    work     : () => keepalive(),
    interval : () => interval,
    cancel   : () => request.cancel(),
  });

  return {
    ...worker,
    keepalive,
  };
}

export type KeepAlive = ReturnType<typeof createKeepAlive>;
