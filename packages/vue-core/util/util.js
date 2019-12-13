/* eslint-disable prefer-rest-params */
/* eslint-disable guard-for-in */
/* eslint-disable no-confusing-arrow */
/* eslint-disable no-unused-vars */

// these helpers produces better vm code in JS engines due to their
// explicitness and function inlining
function isUndef(v) {
  return v === undefined || v === null;
}

/**
 * Check if value is primitive
 */
function isPrimitive(value) {
  return (
    typeof value === 'string'
    || typeof value === 'number'
    || typeof value === 'symbol'
    || typeof value === 'boolean'
  );
}

/**
 * Quick object check - this is primarily used to tell
 * Objects from primitive values when we know the value
 * is a JSON-compliant type.
 */
function isObject(obj) {
  return obj !== null && typeof obj === 'object';
}

/**
 * Get the raw type string of a value e.g. [object Object]
 */
const _toString = Object.prototype.toString;

function toRawType(value) {
  return _toString.call(value).slice(8, -1);
}

/**
 * Strict object type check. Only returns true
 * for plain JavaScript objects.
 */
function isPlainObject(obj) {
  return _toString.call(obj) === '[object Object]';
}

/**
 * Check if val is a valid array index.
 */
function isValidArrayIndex(val) {
  const n = parseFloat(String(val));
  
  return n >= 0 && Math.floor(n) === n && Number.isFinite(val);
}

/**
 * Remove an item from an array
 */
function remove(arr, item) {
  if (arr.length) {
    const index = arr.indexOf(item);

    if (index > -1) {
      return arr.splice(index, 1);
    }
  }
}

/**
 * Check whether the object has the property.
 */
const hasOwnProperty = Object.prototype.hasOwnProperty;

function hasOwn(obj, key) {
  return hasOwnProperty.call(obj, key);
}

/**
 * Create a cached version of a pure function.
 */
function cached(fn) {
  const cache = Object.create(null);

  
  return (function cachedFn(str) {
    const hit = cache[str];

    
    return hit || (cache[str] = fn(str));
  });
}

/**
 * Camelize a hyphen-delimited string.
 */
const camelizeRE = /-(\w)/g;

const camelize = cached((str) => str.replace(camelizeRE, (_, c) => c ? c.toUpperCase() : ''));

/**
 * Capitalize a string.
 */
const capitalize = cached((str) => str.charAt(0).toUpperCase() + str.slice(1));

/**
 * Hyphenate a camelCase string.
 */
const hyphenateRE = /\B([A-Z])/g;

const hyphenate = cached((str) => str.replace(hyphenateRE, '-$1').toLowerCase());

/**
 * Simple bind polyfill for environments that do not support it... e.g.
 * PhantomJS 1.x. Technically we don't need this anymore since native bind is
 * now more performant in most browsers, but removing it would be breaking for
 * code that was able to run in PhantomJS 1.x, so this must be kept for
 * backwards compatibility.
 */

/* istanbul ignore next */
function polyfillBind(fn, ctx) {
  function boundFn(a) {
    const l = arguments.length;

    
    return l
      ? l > 1
        ? fn.apply(ctx, arguments)
        : fn.call(ctx, a)
      : fn.call(ctx);
  }

  boundFn._length = fn.length;
  
  return boundFn;
}

function nativeBind(fn, ctx) {
  return fn.bind(ctx);
}

const bind = Function.prototype.bind
  ? nativeBind
  : polyfillBind;

/**
 * Convert an Array-like object to a real Array.
 */
function toArray(list, start) {
  start = start || 0;
  let i = list.length - start;
  const ret = new Array(i);

  while (i--) {
    ret[i] = list[i + start];
  }
  
  return ret;
}

/**
 * Mix properties into target object.
 */
function extend(to, _from) {
  for (const key in _from) {
    to[key] = _from[key];
  }
  
  return to;
}

/**
 * Perform no operation.
 * Stubbing args to make Flow happy without leaving useless transpiled code
 * with ...rest (https://flow.org/blog/2017/05/07/Strict-Function-Call-Arity/)
 */
function noop(a, b, c) {}

export {
  isUndef,
  isPrimitive,
  isObject,
  toRawType,
  isPlainObject,
  isValidArrayIndex,
  remove,
  hasOwn,
  cached,
  camelize,
  capitalize,
  hyphenate,
  bind,
  toArray,
  extend,
  noop,
};
