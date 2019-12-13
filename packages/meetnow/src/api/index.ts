import axios from 'axios';
import { ConferenceApis, CONFIGS } from './api-configs';
import { createRequest, Request } from './request';

// long polling timeout within 30 seconds
const DEFAULT_TIMEOUT = 30 * 1000;

export interface ApiConfigs {
  baseURL?: string;
}

export function createApi(config: ApiConfigs = {}) {
  const { baseURL = '/' } = config;

  const delegate = axios.create({
    baseURL,
    timeout : DEFAULT_TIMEOUT,
  });
  let token: string | undefined;

  function request(apiName: ConferenceApis) {
    const config = { ...CONFIGS[apiName] };
    if (token) {
      config.headers = Object(config.headers);
      config.headers.token = token;
    }
    return createRequest(config, delegate);
  }

  return {
    get token() {
      return token;
    },
    set token(val: string) {
      token = val;
    },
    request,
  };
}

export type Api = ReturnType<typeof createApi>;
