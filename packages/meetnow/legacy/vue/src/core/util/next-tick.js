import { noop, isNative } from '../../shared/util';
import { handleError } from './error';

export let isUsingMicroTask = false;

const callbacks = [];

let pending = false;

function flushCallbacks() {
  pending = false;
  const copies = callbacks.slice(0);

  callbacks.length = 0;
  copies.forEach((copy) => copy && copy());
}

let timerFunc;

if (isNative(Promise)) {
  const p = Promise.resolve();

  timerFunc = () => {
    p.then(flushCallbacks);
    setTimeout(noop);
  };
  isUsingMicroTask = true;
}
else if (isNative(setImmediate)) {
  timerFunc = () => setImmediate(flushCallbacks);
}
else {
  timerFunc = () => setTimeout(flushCallbacks, 0);
}

export function nextTick(cb, ctx) {
  let _resolve;

  callbacks.push(() => {
    if (cb) {
      try { cb.call(ctx); }
      catch (e) { handleError(e, ctx, 'nextTick'); }
    }
    else if (_resolve) {
      _resolve(ctx);
    }
  });
  if (!pending) {
    pending = true;
    timerFunc();
  }
  if (!cb && typeof Promise !== 'undefined') {
    return new Promise((resolve) => _resolve = resolve);
  }
}
