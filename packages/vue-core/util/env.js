/* eslint-disable n-undef */

// can we use __proto__?
const hasProto = '__proto__' in {};

// Browser environment sniffing
const inBrowser = typeof window !== 'undefined';
const UA = inBrowser && window.navigator.userAgent.toLowerCase();
const isIE = UA && /msie|trident/.test(UA);
const isIE9 = UA && UA.indexOf('msie 9.0') > 0;
const isEdge = UA && UA.indexOf('edge/') > 0;
const isAndroid = (UA && UA.indexOf('android') > 0);
const isIOS = (UA && /iphone|ipad|ipod|ios/.test(UA));
const isChrome = UA && /chrome\/\d+/.test(UA) && !isEdge;

// Firefox has a "watch" function on Object.prototype...
const nativeWatch = ({}).watch;

function isNative(Ctor) {
  return typeof Ctor === 'function' && /native code/.test(Ctor.toString());
}

const hasSymbol = typeof Symbol !== 'undefined' && isNative(Symbol) 
               && typeof Reflect !== 'undefined' && isNative(Reflect.ownKeys);

let _Set;
/* istanbul ignore if */ // $flow-disable-line

if (typeof Set !== 'undefined' && isNative(Set)) {
  // use native Set when available.
  _Set = Set;
}
else {
  // a non-standard Set polyfill that only works with primitive keys.
  _Set = class Set {
    constructor() {
      this.set = Object.create(null);
    }

    has(key) {
      return this.set[key] === true;
    }

    add(key) {
      this.set[key] = true;
    }

    clear() {
      this.set = Object.create(null);
    }
  };
}

export {
  hasProto,
  inBrowser,
  UA,
  isIE,
  isIE9,
  isEdge,
  isAndroid,
  isIOS,
  isChrome,
  isNative,
  nativeWatch,
  hasSymbol,
  _Set,
};
