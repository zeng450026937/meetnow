import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';
import debug from 'debug';
import {
  ApiDataMap, ApiHeaderMap, ApiNames, ApiParamsMap, CONFIGS,
} from './api-configs';
import { ApiError } from './api-error';
import { createRequest, RequestResult } from './request';

const log = debug('MN:Api');

// long polling timeout within 30 seconds
const DEFAULT_TIMEOUT = 35 * 1000;

export function createApi(config: AxiosRequestConfig = {}) {
  log('createApi()');

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
      // should not go here
      // server impl error
      if (ret === 0 && error) throw new ApiError(bizCode, error);

      log('request success: %o', data);

      // TBD
      // replace response data with actual data. eg. response.data = data;

      // TODO
      // normalize error
      return response;
    },
    (error) => {
      log('request error: %o', error);
      throw error;
    },
  );

  function request<T extends ApiNames = ApiNames>(apiName: T) {
    log(`request() "${ apiName }"`);

    return createRequest<ApiDataMap[T], ApiParamsMap[T], ApiHeaderMap[T]>(
      { ...CONFIGS[apiName] },
      delegate,
    );
  }

  return {
    get interceptors() {
      return delegate.interceptors;
    },
    request,
    delegate,
  };
}

export type Api = ReturnType<typeof createApi>;
