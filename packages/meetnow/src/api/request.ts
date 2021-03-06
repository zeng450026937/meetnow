import axios, {
  AxiosInstance, AxiosPromise, AxiosRequestConfig, CancelTokenSource,
} from 'axios';
import debug from 'debug';

const log = debug('MN:Api:Request');

export const { isCancel } = axios;

export interface RequestResult<T = any> {
  ret: number;
  bizCode: number;
  data: T;
  error?: { msg: string; errorCode: number };
  statusCode?: number;
}

export interface Request<
  RequestData = any,
  RequestParams = any,
  RequestHeader = any,
  RequestResultData = any,
> {
  config: AxiosRequestConfig;
  header: (header: RequestHeader) => Request<RequestData, RequestParams, RequestHeader>;
  params: (params: RequestParams) => Request<RequestData, RequestParams, RequestHeader>;
  data: (data: RequestData) => Request<RequestData, RequestParams, RequestHeader>;
  send: () => AxiosPromise<RequestResult<RequestResultData>>;
  cancel: () => void;
}

export function createRequest<
  RequestData = any,
  RequestParams = any,
  RequestHeader = any,
  RequestResultData = any,
>(
  config: AxiosRequestConfig,
  delegate?: AxiosInstance,
): Request<RequestData, RequestParams, RequestHeader, RequestResultData>;

export function createRequest<
  RequestData = any,
  RequestParams = any,
  RequestHeader = any,
  RequestResultData = any,
>(config: AxiosRequestConfig, delegate: AxiosInstance = axios) {
  let source: CancelTokenSource | undefined;
  let request: Request;

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
  function send(): AxiosPromise<RequestResult<RequestResultData>> {
    log('send()');

    source = axios.CancelToken.source();
    config.cancelToken = source.token;
    return delegate(config);
  }
  function cancel(reason: string = 'canceled') {
    log('cancel()');

    return source && source.cancel(reason);
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
