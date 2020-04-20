import debug from 'debug';
import { isFunction } from '.';

const log = debug('MN:Worker');

export interface WorkerConfig {
  work: (times: number) => Promise<any> | any;
  cancel?: () => any;
  interval?: number | (() => number);
}

export interface Worker {
  config: WorkerConfig;
  readonly running: boolean;
  start: (immediate?: boolean) => Promise<void>;
  stop: () => void;
}

export function createWorker(config: WorkerConfig): Worker {
  let running: boolean = false;
  let working: boolean = false;
  let interval: number = 0;
  let times: number = 0;
  let timeout: number | undefined;

  const {
    interval: nextInterval = interval,
    work,
    cancel,
  } = config;

  async function job(immediate: boolean = true) {
    if (work && immediate) {
      working = true;
      await work(times++);
      working = false;
    }

    if (!running) return;

    interval = isFunction(nextInterval) ? nextInterval() : nextInterval;

    // schedule next
    timeout = setTimeout(job, interval);
  }

  async function start(immediate: boolean = true) {
    log('start()');

    if (running) return;

    running = true;

    await job(immediate);
  }

  function stop() {
    log('stop()');

    if (!running) return;

    if (timeout) {
      clearTimeout(timeout);
      timeout = undefined;
    }
    if (working) {
      cancel && cancel();
    }

    running = false;
  }

  return {
    config,

    get running() {
      return running;
    },

    start,
    stop,
  };
}
