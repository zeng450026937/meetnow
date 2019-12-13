/* eslint-disable no-console */

import config from '../config';
import { noop } from './util';

let warn = noop;

if (process.env.NODE_ENV !== 'production') {
  const hasConsole = typeof console !== 'undefined';

  warn = (msg) => {
    if (hasConsole && (!config.silent)) {
      console.error(`[Vue warn]: ${msg}`);
    }
  };
}

export {
  warn,
};
