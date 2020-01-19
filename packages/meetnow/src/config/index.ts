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
  const MeetNow = (win as any).MeetNow = (win as any).MeetNow || { config };

  // create the Ionic.config from raw config object (if it exists)
  // and convert Ionic.config into a ConfigApi that has a get() fn
  const configObj = {
    ...configFromSession(win),
    persistent : false,
    ...MeetNow.config,
    ...configFromURL(win),
  };

  CONFIG.reset(configObj);

  if (CONFIG.getBoolean('persistent')) {
    saveConfig(win, configObj);
  }

  // first see if the mode was set as an attribute on <html>
  // which could have been set by the user, or by pre-rendering
  // otherwise get the mode via config settings, and fallback to md
  MeetNow.config = CONFIG;

  if (CONFIG.getBoolean('testing')) {
    CONFIG.set('debug', 'MN:*');
  }
}
