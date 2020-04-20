import debug from 'debug';
import axios from 'axios';
import adapter from './adapter';
import { polyfill } from './utils/object-spread';

import { isMiniProgram } from './browser';
import {
  CONFIG,
  MeetnowConfig,
  setupConfig,
} from './config';
import {
  AuthType,
  bootstrap,
  createUserApi,
  fetchControlUrl,
} from './auth';
import {
  ConnectOptions,
  createUA,
} from './user-agent';
import { Conference } from './conference';

export {
  debug,
  axios,
  adapter,
};

if (!__FEATURE_ES5__) {
  polyfill();
}

const log = debug('MN');

export const version = __VERSION__;

// global setup
export function setup(config?: MeetnowConfig): void {
  setupConfig(config);

  if (isMiniProgram()) {
    axios.defaults.adapter = adapter;
  }

  debug.enable(
    CONFIG.get(
      'debug',
      'MN*,-MN:Api*,-MN:Information:Item,-MN:Worker',
    ),
  );

  log('setup() [version]: %s', version);
}

export {
  AuthType,
  bootstrap,
  createUserApi,
  createUA,
  fetchControlUrl,
};

export async function connect(options: ConnectOptions): Promise<Conference> {
  const ua = createUA();
  const conference = await ua.connect(options);
  return conference;
}
