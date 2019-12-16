import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';
import { ConferenceApis, CONFIGS } from './api-configs';
import { ApiError } from './api-error';
import { createRequest, RequestResult } from './request';

// long polling timeout within 30 seconds
const DEFAULT_TIMEOUT = 30 * 1000;

export function createApi(config: AxiosRequestConfig = {}) {
  const delegate = axios.create({
    baseURL : '/',
    timeout : DEFAULT_TIMEOUT,
    ...config,
  });

  delegate.interceptors.response.use(
    (response: AxiosResponse<RequestResult>) => {
      const {
        ret,
        bizCode,
        error,
        data,
      } = response.data;

      if (ret < 0) throw new ApiError(bizCode, error);
      // TBD
      // replace response data with actual data. eg. response.data = data;

      // TODO
      // normalize error
      return response;
    },
    (error) => {
      console.warn(`
        api error.
        ${ error }
      `);
    },
  );

  function request(apiName: ConferenceApis) {
    return createRequest({ ...CONFIGS[apiName] }, delegate);
  }

  return {
    get interceptors() {
      return delegate.interceptors;
    },
    request,
  };
}

export type Api = ReturnType<typeof createApi>;
