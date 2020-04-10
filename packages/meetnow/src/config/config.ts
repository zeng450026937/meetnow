export interface MeetnowConfig {
  baseurl?: string;
  useragent?: string;
  clientinfo?: string;
  debug?: string;
  persistent?: boolean;
  testing?: boolean;
  timeout?: number
}

const startsWith = (input: string, search: string): boolean => {
  return input.substr(0, search.length) === search;
};

const MEETNOW_PREFIX = 'meetnow:';
const MEETNOW_SESSION_KEY = 'meetnow-persist-config';

export class Config {
  private m = new Map<keyof MeetnowConfig, any>();

  reset(configObj: MeetnowConfig) {
    this.m = new Map<keyof MeetnowConfig, any>(Object.entries(configObj) as any);
  }

  get(key: keyof MeetnowConfig, fallback?: any): any {
    const value = this.m.get(key);
    return (value !== undefined) ? value : fallback;
  }

  getBoolean(key: keyof MeetnowConfig, fallback = false): boolean {
    const val = this.m.get(key);
    if (val === undefined) {
      return fallback;
    }
    if (typeof val === 'string') {
      return val === 'true';
    }
    return !!val;
  }

  getNumber(key: keyof MeetnowConfig, fallback?: number): number {
    const val = parseFloat(this.m.get(key));
    return Number.isNaN(val) ? (fallback !== undefined ? fallback : NaN) : val;
  }

  set(key: keyof MeetnowConfig, value: any) {
    this.m.set(key, value);
  }
}

export const CONFIG = new Config();

export const configFromSession = (win: Window): any => {
  try {
    const configStr = win.sessionStorage.getItem(MEETNOW_SESSION_KEY);
    return configStr !== null ? JSON.parse(configStr) : {};
  } catch (e) {
    return {};
  }
};

export const saveConfig = (win: Window, c: any) => {
  try {
    win.sessionStorage.setItem(MEETNOW_SESSION_KEY, JSON.stringify(c));
  } catch (e) {
    /* eslint-disable-next-line */
    return;
  }
};

export const configFromURL = (win: Window) => {
  const configObj: any = {};
  try {
    win.location.search.slice(1)
      .split('&')
      .map(entry => entry.split('='))
      .map(([key, value]) => [decodeURIComponent(key), decodeURIComponent(value)])
      .filter(([key]) => startsWith(key, MEETNOW_PREFIX))
      .map(([key, value]) => [key.slice(MEETNOW_PREFIX.length), value])
      .forEach(([key, value]) => {
        configObj[key] = value;
      });
  } catch (e) {
    return configObj;
  }
  return configObj;
};
