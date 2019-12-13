import { isPlainObject } from '../vue/src/shared/util';

// config type : Boolean or { XXX: Boolean }
export const isClosed = (config) => {
  if (isPlainObject(config)) {
    return config[Object.keys(config)[0]] === false;
  }

  return !config;
};

const defaultConfig = {
  name     : 'WebRTC_SDK',
  logger   : true, // true must
  request  : true, // true must
  services : [
    'Media',
    'External',
    {
      Target      : 'Conference',
      key         : 'conference',
      subServices : [
        'MediaChannel',
        'ShareChannel',
        'Controller',
        'Member',
        'Chat',
      ],
    },
  ],
  handlers : [ // only add handler supported
    'EventHandler',
    'PollingHandler',
    'ExceptionHandler',
    'TimerHandler',
  ],
};

export default defaultConfig;
