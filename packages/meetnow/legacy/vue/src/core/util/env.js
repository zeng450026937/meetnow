import { isNative } from '../../shared/util';

export const hasProto = '__proto__' in {};
export const nativeWatch = ({}).watch;

export const hasSymbol = typeof Symbol !== 'undefined' && isNative(Symbol)
  && typeof Reflect !== 'undefined' && isNative(Reflect.ownKeys);
