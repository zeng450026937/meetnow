import {
  AxiosRequestConfig,
  AxiosResponse,
} from 'axios';
import createError from 'axios/lib/core/createError';
import {
  createRequestDelegate,
  platform,
  PLATFORM,
  RequestOptions,
  RequestResponse,
} from './request-delegate';


export function createRequest(config: AxiosRequestConfig) {
  let timer: number | undefined;
  let timeout: number | undefined;

  let onabort: (error: any) => void | undefined;
  let onerror: (error: any) => void | undefined;
  let ontimeout: (error: any) => void | undefined;
  let onsuccess: (response: AxiosResponse) => void | undefined;

  const delegate = createRequestDelegate();

  return {
    send(options: RequestOptions) {
      delegate.send({
        ...options,
        success : (response: RequestResponse) => {
          // normalize data
          const headers = response.header || response.headers;
          const status = response.statusCode || response.status || 200;
          const statusText = status === 200 ? 'OK' : status === 400 ? 'Bad Request' : '';

          onsuccess && onsuccess({
            data    : response.data,
            status,
            statusText,
            headers,
            config,
            request : options,
          });
        },
        fail : (data: any) => {
          let isAbort = false;
          let isTimeout = false;
          // error or timeout
          switch (platform) {
            case PLATFORM.kWechat:
              if (data.errMsg.indexOf('request:fail abort') !== -1) {
                isAbort = true;
              } else if (data.errMsg.indexOf('timeout') !== -1) {
                isTimeout = true;
              }
              break;
            case PLATFORM.kAlipay:
              // https://docs.alipay.com/mini/api/network
              if ([14, 19].includes(data.error)) {
                isAbort = true;
              } else if ([13].includes(data.error)) {
                isTimeout = true;
              }
              break;
            default:
              break;
          }

          const error = isAbort
            ? createError('Request aborted', config, 'ECONNABORTED', '')
            : isTimeout
              ? createError('Request Timeout', config, 'ECONNABORTED', '')
              : createError('Network Error', config, null, '');

          if (isAbort) {
            onabort && onabort(error);
          }
          if (isTimeout) {
            ontimeout && ontimeout(error);
          }
          onerror && onerror(error);
        },
        complete : () => {
          if (timer) {
            clearTimeout(timer);
            timer = undefined;
          }
        },
      });

      if (timeout) {
        timer = setTimeout(() => {
          ontimeout && ontimeout(
            createError(`timeout of ${ config.timeout || 0 }ms exceeded`, config, 'ECONNABORTED', ''),
          );
          timer = undefined;
        }, timeout);
      }
    },
    abort() {
      delegate.abort();
    },

    set timeout(val: number | undefined) {
      timeout = val;
    },

    set onabort(val: typeof onabort) {
      onabort = val;
    },
    set onerror(val: typeof onerror) {
      onerror = val;
    },
    set ontimeout(val: typeof ontimeout) {
      ontimeout = val;
    },
    set onsuccess(val: typeof onsuccess) {
      onsuccess = val;
    },
  };
}
