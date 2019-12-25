import axios, {
  AxiosInstance, AxiosPromise, AxiosRequestConfig, CancelTokenSource,
} from 'axios';
import debug from 'debug';

const log = debug('Request');

export const { isCancel } = axios;

export interface RequestResult {
  ret: number;
  bizCode: number;
  data: { [K: string]: any };
  error?: { msg: string; errorCode: number };
  statusCode?: number;
}

export class Request<
  RequestData = any,
  RequestParams = any,
  RequestHeader = any,
> {
  config: AxiosRequestConfig;
  header: (header: RequestHeader) => Request<RequestData, RequestParams, RequestHeader>;
  params: (params: RequestParams) => Request<RequestData, RequestParams, RequestHeader>;
  data: (data: RequestData) => Request<RequestData, RequestParams, RequestHeader>;
  send: () => AxiosPromise<RequestResult>;
  cancel: () => void;
}

export function createRequest<
  RequestData = any,
  RequestParams = any,
  RequestHeader = any,
>(config: AxiosRequestConfig, delegate?: AxiosInstance): Request<RequestData, RequestParams, RequestHeader>;

export function createRequest<
  RequestData = any,
  RequestParams = any,
  RequestHeader = any,
>(config: AxiosRequestConfig, delegate: AxiosInstance = axios) {
  let source: CancelTokenSource | undefined;
  let request;

  function header(header: RequestHeader) {
    config.headers = header;
    return request;
  }
  function params(params: RequestParams) {
    config.params = params;
    return request;
  }
  function data(data: RequestData) {
    config.data = data;
    return request;
  }
  function send(): AxiosPromise<RequestResult> {
    log('send()');

    source = axios.CancelToken.source();
    config.cancelToken = source.token;
    return delegate(config);
  }
  function cancel(reason: string = 'canceled') {
    log('cancel()');

    return source.cancel(reason);
  }

  return request = {
    config,
    header,
    params,
    data,
    send,
    cancel,
  };
}

// export type Request<T, B, D> = ReturnType<typeof createRequest<T, B, D>>;
