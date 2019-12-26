import debug from 'debug';
import { CONFIG, setupConfig } from './config';
import { createUA } from './user-agent';

export { debug };
export * from './user-agent';
export * from './conference';
export * from './channel';
export * from './media';
export * from './events';
export * from './reactive';
export * from './sdp-transform';

const version = process.env.VUE_APP_VERSION;

export interface ConnectOptions {
  authorization?: {
    username: string;
    password: string;
  };
  displayName?: string;
  conference: {
    number: string;
    password?: string;
  };
}

// global setup
function setup() {
  setupConfig();

  debug.enable(
    CONFIG.get(
      'debug',
      'Meetnow:*,-Meetnow:Api*,-Meetnow:Information:Item,-Meetnow:Worker',
    ),
  );
}

function connect(options: ConnectOptions) {
  const ua = createUA();
}

export default {
  version,

  createUA,

  setup,
  connect,
};
