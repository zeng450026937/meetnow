import { isArray } from '../utils';

export function createEvents() {
  let instance;
  const events = {};

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

  return instance = {
    on(event: string | string[], fn: Function) {
      on(event, fn);
      return instance;
    },
    off(event: string | string[], fn?: Function) {
      off(event, fn);
      return instance;
    },
    once(event: string | string[], fn: Function) {
      once(event, fn);
      return instance;
    },
  };
}
