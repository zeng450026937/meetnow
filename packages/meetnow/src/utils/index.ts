export const debounce = (func: (...args: any[]) => void, wait = 0) => {
  let timer: any;
  return function (this: any, ...args: any[]): any {
    clearTimeout(timer);
    timer = setTimeout(() => func.call(this, ...args), wait, ...args);
  };
};

export const isDef = (value: any): boolean => {
  return value !== undefined && value !== null;
};
export const isEmpty = (val: unknown): val is any => {
  return (val === undefined
    || val === null
    || val === ''
    || (Array.isArray(val) && val.length === 0)
    || (typeof (val) === 'number' && Number.isNaN(val)));
};

export const NOOP = () => {};
export const NO = () => false;

export const { isArray } = Array;
export const isFunction = (val: unknown): val is Function => typeof val === 'function';
export const isString = (val: unknown): val is string => typeof val === 'string';
export const isSymbol = (val: unknown): val is symbol => typeof val === 'symbol';
export const isObject = (val: unknown): val is Record<any, any> => val !== null && typeof val === 'object';

export function isPromise<T = any>(val: unknown): val is Promise<T> {
  return isObject(val) && isFunction(val.then) && isFunction(val.catch);
}

const { hasOwnProperty } = Object.prototype;
export const hasOwn = (
  val: object,
  key: string | symbol,
): key is keyof typeof val => hasOwnProperty.call(val, key);

export const objectToString = Object.prototype.toString;
export const toTypeString = (value: unknown): string => objectToString.call(value);

export const isPlainObject = (val: unknown): val is object => toTypeString(val) === '[object Object]';

const camelizeRE = /-(\w)/g;
export const camelize = (str: string): string => {
  return str.replace(camelizeRE, (_, c) => (c ? c.toUpperCase() : ''));
};

const hyphenateRE = /\B([A-Z])/g;
export const hyphenate = (str: string): string => {
  return str.replace(hyphenateRE, '-$1').toLowerCase();
};

export const capitalize = (str: string): string => {
  return str.charAt(0).toUpperCase() + str.slice(1);
};

// compare whether a value has changed, accounting for NaN.
export const hasChanged = (value: any, oldValue: any): boolean => {
  /* eslint-disable-next-line no-self-compare */
  return value !== oldValue && (value === value || oldValue === oldValue);
};
