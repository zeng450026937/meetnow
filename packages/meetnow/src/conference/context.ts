import { Api } from '../api';
// import { hyphenate } from '../utils';

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

export function createContext(delegate: any): Context {
  return new Proxy({}, {
    get(target: object, key: string | symbol) {
      return key in target ? (target as any)[key] : Reflect.get(delegate, key);
    },
  }) as Context;
}

// export function createMessageSender(delegate: any) {
//   return new Proxy({}, {
//     get(target: object, key: string) {
//       return Reflect.get(delegate, hyphenate(key));
//     },
//   }) as Context;
// }
