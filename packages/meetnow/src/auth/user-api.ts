import { Api, createApi } from '../api';
import { CONFIG } from '../config';
import { isFunction } from '../utils';

export function createUserApi(
  token?: string | (() => string | undefined),
): Api {
  const api = createApi({
    baseURL : CONFIG.get(
      'baseurl',
      __TEST__ ? '/webapp/' : 'https://meetings.ylyun.com/webapp/',
    ),
    timeout : CONFIG.get('timeout', 0),
  });

  api.interceptors.request.use((config) => {
    if (token) {
      config.headers = config.headers || {};
      config.headers.token = isFunction(token) ? token() : token;
    }
    return config;
  });

  return api;
}
