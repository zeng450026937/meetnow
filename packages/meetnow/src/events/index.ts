import debug, { Debugger } from 'debug';
import { isArray } from '../utils';

const log = debug('MN:Events');

export function createEvents(scopedlog: Debugger = log) {
  let instance: any;
  const events = {} as Record<string, Function[] | null>;

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
      if (callback === fn || (callback as any).fn === fn) {
        callbacks.splice(index, 1);
        break;
      }
    }
  }

  function once(event: string | string[], fn: Function) {
    function wrapper(this: any, ...args: any[]) {
      off(event, wrapper);
      fn.apply(this, args);
    }
    wrapper.fn = fn;
    on(event, wrapper);
  }

  function emit(event: string, ...args: any[]) {
    scopedlog(`emit() "${ event }"`);

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
