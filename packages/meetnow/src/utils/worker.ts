import { isFunction } from '.';

export interface WorkerConfig {
  work: (times: number) => Promise<void> | void;
  cancel?: () => void;
  interval?: number | (() => number);
}

export function createWorker(config: WorkerConfig) {
  let stoped: boolean = true;
  let running: boolean = false;
  let interval: number = 0;
  let times: number = 0;
  let timeout;

  const {
    interval: nextInterval,
    work,
    cancel,
  } = config;

  async function start(immediate: boolean = true) {
    stoped = false;
    interval = isFunction(nextInterval) ? nextInterval() : nextInterval;

    if (work && immediate) {
      running = true;
      await work(times++);
      running = false;
    }

    if (stoped) return;

    // schedule next
    timeout = setTimeout(start, interval);
  }

  function stop() {
    if (timeout) {
      clearTimeout(timeout);
      timeout = null;
    }
    if (running) {
      cancel && cancel();
    }
    stoped = true;
  }

  return {
    start,
    stop,
  };
}

export type Worker = ReturnType<typeof createWorker>;
