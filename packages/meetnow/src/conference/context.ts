import { Api } from '../api';

// conference context is passed to all submodule(users, lobby, ...)
export interface Context {
  api: Api;
  // conference url
  url?: string;
  // coference uuid
  uuid?: string;
  // conference userId
  userId?: string;

  [key: string]: any;
}

export function createContext(delegate) {
  return new Proxy({}, {
    get(target: object, key: string | symbol) {
      return key in target ? target[key] : Reflect.get(delegate, key);
    },
  }) as Context;
}
