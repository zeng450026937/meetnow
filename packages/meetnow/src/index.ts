import debug from 'debug';
import axios from 'axios';
import adapter from './adapter';
import { isMiniProgram } from './browser';
import { CONFIG, setupConfig } from './config';
import { ConnectOptions, createUA } from './user-agent';

export { debug, axios };
export * from './user-agent';
export * from './conference';
export * from './channel';
export * from './media';
export * from './events';
export * from './reactive';
export * from './sdp-transform';

const log = debug('MN');

const version = process.env.VUE_APP_VERSION;

// global setup
function setup() {
  setupConfig();

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
  version,

  createUA,

  setup,
  connect,
};
