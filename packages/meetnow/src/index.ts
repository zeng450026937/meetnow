// object spread poly-fill
// needed for wechat platform
import './utils/object-spread';

import debug from 'debug';
import axios from 'axios';
import adapter from './adapter';
import { isMiniProgram } from './browser';
import { CONFIG, MeetnowConfig, setupConfig } from './config';
import { ConnectOptions, createUA } from './user-agent';
import { bootstrap } from './auth';

export { debug, axios, adapter };
export * from './user-agent';
export * from './conference';
export * from './media';
export * from './events';
export * from './reactive';
export * from './sdp-transform';
export { bootstrap };

const log = debug('MN');

const version = __VERSION__;

// global setup
function setup(config?: MeetnowConfig) {
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

async function connect(options: ConnectOptions) {
  const ua = createUA();
  const conference = await ua.connect(options);
  return conference;
}

export default {
  setup,
  connect,

  bootstrap,
  createUA,

  version,
};
