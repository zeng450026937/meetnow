export const emptyObject = Object.freeze({});

export const isUndef = (v) => v === undefined || v === null;
export const isDef = !isUndef;

export const isTrue = (v) => v === true;
export const isFalse = !isTrue;

//
export const isPrimitive = (v) => (['string', 'number', 'symbol', 'boolean'].includes(typeof v));
export const isObject = (v) => (v !== null && typeof v === 'object');
export const isFunction = (v) => (typeof v === 'function');

// get the raw type
const _toString = Object.prototype.toString;

export const toRawType = (v) => _toString.call(v).slice(8, -1);
export const isPlainObject = (v) => _toString.call(v) === '[object Object]';
export const isRegExp = (v) => _toString.call(v) === '[object RegExp]';

// check if val is valid array index
export const isValidArrayIndex = (v) => {
  const n = Number.parseFloat(String(v));

  return n >= 0 && Math.floor(n) === n && Number.isFinite(v);
};

export const isPromise = (v) => (isDef(v) && typeof v.then === 'function' && typeof v.catch === 'function');

// convert a val to string
export const toString = (v) => (v == null
  ? ''
  : Array.isArray(v) || (isPrimitive(v) && v.toString === _toString)
    ? JSON.stringify(v, null, 2)
    : String(v));

export const toNumber = (v) => {
  const n = parseFloat(v);

  return Number.isNaN(n) ? v : n;
};

// make a map and return a func for checking whether key contained
export const makeMap = (str, expectLowerCase = false) => {
  const map = Object.create(null);
  const list = str.split(',');

  list.forEach((val) => map[val] = true);

  return expectLowerCase
    ? (v) => map[v.toLowerCase()]
    : (v) => map[v];
};

// remove array's item
export const removeArrItem = (arr = [], item) => {
  if (!arr.length) return;

  const index = arr.indexOf(item);

  return index > -1 && arr.splice(index, 1);
};
export const remove = removeArrItem;

// check whether the object has the prop
const hasOwnProp = Object.prototype.hasOwnProperty;

export const hasOwn = (o, p) => hasOwnProp.call(o, p);

// create a cached version of a pure func, only a str params
export const cached = (fn) => {
  const cache = Object.create(null);

  return (function cachedFn(str) {
    const hit = cache[str];

    return hit || (cache[str] = fn(str));
  });
};

// Camelize a string
const camelizeREG = /-(\w)/g;

export const camelize = cached((str) => str.replace(camelizeREG, (_, w) => (w ? w.toUpperCase() : '')));

// Capitalize a String
export const capitalize = cached((str) => str.charAt(0).toUpperCase() + str.slice(1));
export const unCapitalize = cached((str) => str.charAt(0).toLowerCase() + str.slice(1));

// Hyphenate a string
const hyphenateREG = /\B([A-Z])/g;

export const hyphenate = cached((str) => str.replace(hyphenateREG, '-$1').toLowerCase());

// Bind
function polyfillBind(fn, ctx) {
  function boundFn(...args) {
    return args.length > 0 ? fn.apply(ctx, args) : fn.call(ctx);
  }

  boundFn._length = fn.length;

  return boundFn;
}

function nativeBind(fn, ctx) {
  return fn.bind(ctx);
}

export const bind = Function.prototype.bind ? nativeBind : polyfillBind;

export const toArray = (list, start) => {
  start = start || 0;
  let i = list.length - start;
  const ret = new Array(i);

  while (i--) ret[i] = list[i + start];

  return ret;
};
// mix obj props
export const extend = (target, source) => {
  Object.keys(source).forEach((k) => target[k] = source[k]);

  return target;
};

export const cloneDeep = (source = {}) => JSON.parse(JSON.stringify(source));

export const debounce = (action, wait) => {
  let last;

  return () => {
    const ctx = this;

    clearTimeout(last);

    last = setTimeout(() => action.apply(ctx), wait);
  };
};
// Merge Object array into a signal object
export const mergeObjArr = (arr = []) => {
  const target = {};

  arr.forEach((v) => extend(target, v || {}));

  return target;
};

// no operation
export const noop = (a, b, c) => {};

// always false
export const no = (a, b, c) => false;

// ensure a fn called only once
export const once = (fn) => {
  let called = false;

  return function (...params) {
    if (called) return;

    called = true;
    fn.apply(this, params);
  };
};

export const isNative = (Ctor) => typeof Ctor === 'function' && /native code/.test(Ctor.toString());
