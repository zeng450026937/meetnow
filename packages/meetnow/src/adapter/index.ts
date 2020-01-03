import { AxiosPromise, AxiosRequestConfig } from 'axios';
import utils from 'axios/lib/utils';
import settle from 'axios/lib/core/settle';
import buildURL from 'axios/lib/helpers/buildURL';
import btoa from './btoa';
import { createRequest } from './request';

export const isString = (val: unknown): val is string => typeof val === 'string';

export default function mpAdapter(config: AxiosRequestConfig): AxiosPromise {
  /* eslint-disable-next-line prefer-arrow-callback */
  return new Promise(function dispatchMpRequest(resolve, reject) {
    const {
      url,
      data,
      headers,
      method,
      params,
      paramsSerializer,
      responseType,
      timeout,
      cancelToken,
    } = config;

    // HTTP basic authentication
    if (config.auth) {
      const [username, password] = [config.auth.username || '', config.auth.password || ''];
      headers.Authorization = `Basic ${ btoa(`${ username }:${ password }`) }`;
    }

    // Add headers to the request
    utils.forEach(headers, (val: any, key: string) => {
      const header = key.toLowerCase();
      if ((typeof data === 'undefined' && header === 'content-type') || header === 'referer') {
        delete headers[key];
      }
    });

    let request: ReturnType<typeof createRequest> | null = createRequest(config);

    const options = {
      url    : buildURL(url, params, paramsSerializer),
      headers,
      method : method && method.toUpperCase(),
      data   : isString(data) ? JSON.parse(data) : data,
      responseType,
    };

    if (cancelToken) {
      // Handle cancellation
      cancelToken.promise.then((cancel) => {
        if (!request) return;
        request.abort();
        reject(cancel);
        request = null;
      });
    }

    request.timeout = timeout;

    request.onsuccess = function handleLoad(response) {
      settle(resolve, reject, response);
      request = null;
    };

    request.onabort = function handleAbort(error) {
      if (!request) return;
      reject(error);
      request = null;
    };

    request.onerror = function handleError(error) {
      if (!request) return;
      reject(error);
      request = null;
    };

    request.ontimeout = function handleTimeout(error) {
      reject(error);
      request = null;
    };

    request.send(options);
  });
}
