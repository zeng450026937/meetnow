export interface RequestResponse {
  data: string | object | ArrayBuffer;
  statusCode?: number;
  status?: number;
  header?: object;
  headers?: object;
}

export interface RequestOptions {
  url: string;
  data?: string | object | ArrayBuffer;
  header?: object;
  method?: string; // GET
  dataType?: string; // json
  responseType?: string; // text
  success?: (response: RequestResponse) => void;
  fail?: (error: any) => void;
  complete?: () => void;
}

export interface RequestTask {
  abort(): void;
  onHeadersReceived(callback: Function): void;
  offHeadersReceived(callback: Function): void;
}


interface MiniPrograme {
  request(options: RequestOptions): RequestTask;
  httpRequest?(options: RequestOptions): RequestTask;
}

declare const global: any;
declare const wx: MiniPrograme;
declare const swan: MiniPrograme;
declare const my: MiniPrograme;

export const isObject = (val: unknown): val is Record<any, any> => val !== null && typeof val === 'object';

export enum PLATFORM {
  kUnknown,
  kWechat,
  kAlipay,
  kBaidu,
}

export const platform: PLATFORM = isObject(global.wx)
  ? PLATFORM.kWechat
  : isObject(global.my)
    ? PLATFORM.kAlipay
    : isObject(global.swan)
      ? PLATFORM.kBaidu
      : PLATFORM.kUnknown;

export const delegate = platform === PLATFORM.kWechat
  ? wx.request.bind(wx)
  : platform === PLATFORM.kAlipay
    ? (my.request || my.httpRequest).bind(my)
    : platform === PLATFORM.kBaidu
      ? swan.request.bind(swan)
      : undefined;

export function createRequestDelegate() {
  let task: RequestTask | undefined;

  return {
    send(options: RequestOptions) {
      if (!delegate) return;
      task = delegate(options);
    },
    abort() {
      task && task.abort();
    },
  };
}
