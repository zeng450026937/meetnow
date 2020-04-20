import debug, { Debugger } from 'debug';
import { isArray } from '../utils';

const log = debug('MN:Events');

export interface Events {
  on: (event: string | string[], fn: Function) => Events;
  off: (event: string | string[], fn?: Function) => Events;
  once: (event: string | string[], fn: Function) => Events;
  emit: (event: string, ...args: any[]) => Events;
}

export function createEvents(scopedlog: Debugger = log): Events {
  let instance: any;
  const events = {} as Record<string, Function[] | null>;

  function on(event: string | string[], fn: Function): Events {
    if (isArray(event)) {
      event.forEach((ev) => on(ev, fn));
      return instance;
    }
    (events[event] || (events[event] = [])).push(fn);
    return instance;
  }

  function off(event: string | string[], fn?: Function): Events {
    if (isArray(event)) {
      event.forEach((e) => off(e, fn));
      return instance;
    }

    const callbacks = events[event];

    if (!callbacks) {
      return instance;
    }

    if (!fn) {
      events[event] = null;
      return instance;
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
    return instance;
  }

  function once(event: string | string[], fn: Function): Events {
    function wrapper(this: any, ...args: any[]) {
      off(event, wrapper);
      fn.apply(this, args);
    }
    wrapper.fn = fn;
    on(event, wrapper);
    return instance;
  }

  function toArray(list: any[], start?: number) {
    start = start || 0;
    let i = list.length - start;
    const ret = new Array(i);

    while (i--) {
      ret[i] = list[i + start];
    }

    return ret;
  }

  function emit(event: string, ...args: any[]): Events {
    scopedlog(`emit() "${ event }"`);

    let callbacks = events[event];

    if (!callbacks) return instance;

    callbacks = callbacks.length > 1 ? toArray(callbacks) : callbacks;

    for (const callback of callbacks) {
      try {
        callback(...args);
      } catch (error) {
        scopedlog(`invoke "${ event }" callback failed: %o`, error);
      }
    }
    return instance;
  }

  return instance = {
    on,
    off,
    once,
    emit,
  };
}
