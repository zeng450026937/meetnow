import {
  CONFIG,
  configFromSession,
  configFromURL,
  MeetnowConfig,
  saveConfig,
} from './config';
import { isMiniProgram } from '../browser';
// export config
export * from './config';

declare const wx: Window & typeof globalThis;

export function setupConfig(config?: MeetnowConfig) {
  const win = isMiniProgram() ? wx : window;
  const MeetNow = (win as any).MeetNow = (win as any).MeetNow || {};

  // create the Meetnow.config from raw config object (if it exists)
  // and convert Meetnow.config into a ConfigApi that has a get() fn
  const configObj = {
    ...configFromSession(win),
    persistent : false,
    ...(config || MeetNow.config),
    ...configFromURL(win),
  };

  CONFIG.reset(configObj);

  if (CONFIG.getBoolean('persistent')) {
    saveConfig(win, configObj);
  }

  MeetNow.config = CONFIG;

  if (CONFIG.getBoolean('testing')) {
    CONFIG.set('debug', 'MN:*');
  }
}
