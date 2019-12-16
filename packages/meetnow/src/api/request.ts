import axios, {
  AxiosInstance, AxiosPromise, AxiosRequestConfig, CancelTokenSource,
} from 'axios';

export const { isCancel } = axios;

export interface RequestResult {
  ret: number;
  bizCode: number;
  data: { [K: string]: any };
  error?: { msg: string; errorCode: number };
  statusCode?: number;
}

export function createRequest(config: AxiosRequestConfig, delegate: AxiosInstance = axios) {
  let source: CancelTokenSource | undefined;
  let request;

  function header(header: any): Request {
    config.headers = header;
    return request;
  }
  function params(params: any): Request {
    config.params = params;
    return request;
  }
  function data(data: any): Request {
    config.data = data;
    return request;
  }
  function send(): AxiosPromise<RequestResult> {
    source = axios.CancelToken.source();
    config.cancelToken = source.token;
    return delegate(config);
  }
  function cancel(reason: string = 'canceled') {
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

export type Request = ReturnType<typeof createRequest>;
