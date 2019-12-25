import debug from 'debug';
import { isArray } from '../utils';

const log = debug('Events');

export function createEvents() {
  let instance;
  const events = {} as Record<string, Function[]>;

  function on(event: string | string[], fn: Function) {
    if (isArray(event)) {
      event.forEach((ev) => on(ev, fn));
      return;
    }
    (events[event] || (events[event] = [])).push(fn);
  }

  function off(event: string | string[], fn?: Function) {
    if (isArray(event)) {
      event.forEach((e) => off(e, fn));
      return;
    }

    const callbacks = events[event];

    if (!callbacks) return;

    if (!fn) {
      events[event] = null;
      return;
    }

    let callback;
    let index = callbacks.length;

    while (index--) {
      callback = callbacks[index];
      if (callback === fn || callback.fn === fn) {
        callbacks.splice(index, 1);
        break;
      }
    }
  }

  function once(event: string | string[], fn: Function) {
    function on(...args: any[]) {
      off(event, on);
      fn.apply(this, args);
    }
    on.fn = fn;
    on(event, on);
  }

  function emit(event: string, ...args: any[]) {
    log(`emit() "${ event }"`);

    const callbacks = events[event];

    if (!callbacks) return;

    for (const callback of callbacks) {
      try {
        callback(...args);
      } catch (error) {
        error;
      }
    }
  }

  return instance = {
    on(event: string | string[], fn: Function) {
      on(event, fn);
      return instance as Events;
    },
    off(event: string | string[], fn?: Function) {
      off(event, fn);
      return instance as Events;
    },
    once(event: string | string[], fn: Function) {
      once(event, fn);
      return instance as Events;
    },
    emit(event: string, ...args: any[]) {
      emit(event, ...args);
      return instance as Events;
    },
  };
}

export type Events = ReturnType<typeof createEvents>;
