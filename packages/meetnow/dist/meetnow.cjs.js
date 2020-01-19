'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var debug = _interopDefault(require('debug'));
var axios = _interopDefault(require('axios'));

var bind = function bind(fn, thisArg) {
  return function wrap() {
    var args = new Array(arguments.length);
    for (var i = 0; i < args.length; i++) {
      args[i] = arguments[i];
    }
    return fn.apply(thisArg, args);
  };
};

/*!
 * Determine if an object is a Buffer
 *
 * @author   Feross Aboukhadijeh <https://feross.org>
 * @license  MIT
 */

var isBuffer = function isBuffer (obj) {
  return obj != null && obj.constructor != null &&
    typeof obj.constructor.isBuffer === 'function' && obj.constructor.isBuffer(obj)
};

/*global toString:true*/

// utils is a library of generic helper functions non-specific to axios

var toString = Object.prototype.toString;

/**
 * Determine if a value is an Array
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is an Array, otherwise false
 */
function isArray(val) {
  return toString.call(val) === '[object Array]';
}

/**
 * Determine if a value is an ArrayBuffer
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is an ArrayBuffer, otherwise false
 */
function isArrayBuffer(val) {
  return toString.call(val) === '[object ArrayBuffer]';
}

/**
 * Determine if a value is a FormData
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is an FormData, otherwise false
 */
function isFormData(val) {
  return (typeof FormData !== 'undefined') && (val instanceof FormData);
}

/**
 * Determine if a value is a view on an ArrayBuffer
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a view on an ArrayBuffer, otherwise false
 */
function isArrayBufferView(val) {
  var result;
  if ((typeof ArrayBuffer !== 'undefined') && (ArrayBuffer.isView)) {
    result = ArrayBuffer.isView(val);
  } else {
    result = (val) && (val.buffer) && (val.buffer instanceof ArrayBuffer);
  }
  return result;
}

/**
 * Determine if a value is a String
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a String, otherwise false
 */
function isString(val) {
  return typeof val === 'string';
}

/**
 * Determine if a value is a Number
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a Number, otherwise false
 */
function isNumber(val) {
  return typeof val === 'number';
}

/**
 * Determine if a value is undefined
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if the value is undefined, otherwise false
 */
function isUndefined(val) {
  return typeof val === 'undefined';
}

/**
 * Determine if a value is an Object
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is an Object, otherwise false
 */
function isObject(val) {
  return val !== null && typeof val === 'object';
}

/**
 * Determine if a value is a Date
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a Date, otherwise false
 */
function isDate(val) {
  return toString.call(val) === '[object Date]';
}

/**
 * Determine if a value is a File
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a File, otherwise false
 */
function isFile(val) {
  return toString.call(val) === '[object File]';
}

/**
 * Determine if a value is a Blob
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a Blob, otherwise false
 */
function isBlob(val) {
  return toString.call(val) === '[object Blob]';
}

/**
 * Determine if a value is a Function
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a Function, otherwise false
 */
function isFunction(val) {
  return toString.call(val) === '[object Function]';
}

/**
 * Determine if a value is a Stream
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a Stream, otherwise false
 */
function isStream(val) {
  return isObject(val) && isFunction(val.pipe);
}

/**
 * Determine if a value is a URLSearchParams object
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a URLSearchParams object, otherwise false
 */
function isURLSearchParams(val) {
  return typeof URLSearchParams !== 'undefined' && val instanceof URLSearchParams;
}

/**
 * Trim excess whitespace off the beginning and end of a string
 *
 * @param {String} str The String to trim
 * @returns {String} The String freed of excess whitespace
 */
function trim(str) {
  return str.replace(/^\s*/, '').replace(/\s*$/, '');
}

/**
 * Determine if we're running in a standard browser environment
 *
 * This allows axios to run in a web worker, and react-native.
 * Both environments support XMLHttpRequest, but not fully standard globals.
 *
 * web workers:
 *  typeof window -> undefined
 *  typeof document -> undefined
 *
 * react-native:
 *  navigator.product -> 'ReactNative'
 * nativescript
 *  navigator.product -> 'NativeScript' or 'NS'
 */
function isStandardBrowserEnv() {
  if (typeof navigator !== 'undefined' && (navigator.product === 'ReactNative' ||
                                           navigator.product === 'NativeScript' ||
                                           navigator.product === 'NS')) {
    return false;
  }
  return (
    typeof window !== 'undefined' &&
    typeof document !== 'undefined'
  );
}

/**
 * Iterate over an Array or an Object invoking a function for each item.
 *
 * If `obj` is an Array callback will be called passing
 * the value, index, and complete array for each item.
 *
 * If 'obj' is an Object callback will be called passing
 * the value, key, and complete object for each property.
 *
 * @param {Object|Array} obj The object to iterate
 * @param {Function} fn The callback to invoke for each item
 */
function forEach(obj, fn) {
  // Don't bother if no value provided
  if (obj === null || typeof obj === 'undefined') {
    return;
  }

  // Force an array if not already something iterable
  if (typeof obj !== 'object') {
    /*eslint no-param-reassign:0*/
    obj = [obj];
  }

  if (isArray(obj)) {
    // Iterate over array values
    for (var i = 0, l = obj.length; i < l; i++) {
      fn.call(null, obj[i], i, obj);
    }
  } else {
    // Iterate over object keys
    for (var key in obj) {
      if (Object.prototype.hasOwnProperty.call(obj, key)) {
        fn.call(null, obj[key], key, obj);
      }
    }
  }
}

/**
 * Accepts varargs expecting each argument to be an object, then
 * immutably merges the properties of each object and returns result.
 *
 * When multiple objects contain the same key the later object in
 * the arguments list will take precedence.
 *
 * Example:
 *
 * ```js
 * var result = merge({foo: 123}, {foo: 456});
 * console.log(result.foo); // outputs 456
 * ```
 *
 * @param {Object} obj1 Object to merge
 * @returns {Object} Result of all merge properties
 */
function merge(/* obj1, obj2, obj3, ... */) {
  var result = {};
  function assignValue(val, key) {
    if (typeof result[key] === 'object' && typeof val === 'object') {
      result[key] = merge(result[key], val);
    } else {
      result[key] = val;
    }
  }

  for (var i = 0, l = arguments.length; i < l; i++) {
    forEach(arguments[i], assignValue);
  }
  return result;
}

/**
 * Function equal to merge with the difference being that no reference
 * to original objects is kept.
 *
 * @see merge
 * @param {Object} obj1 Object to merge
 * @returns {Object} Result of all merge properties
 */
function deepMerge(/* obj1, obj2, obj3, ... */) {
  var result = {};
  function assignValue(val, key) {
    if (typeof result[key] === 'object' && typeof val === 'object') {
      result[key] = deepMerge(result[key], val);
    } else if (typeof val === 'object') {
      result[key] = deepMerge({}, val);
    } else {
      result[key] = val;
    }
  }

  for (var i = 0, l = arguments.length; i < l; i++) {
    forEach(arguments[i], assignValue);
  }
  return result;
}

/**
 * Extends object a by mutably adding to it the properties of object b.
 *
 * @param {Object} a The object to be extended
 * @param {Object} b The object to copy properties from
 * @param {Object} thisArg The object to bind function to
 * @return {Object} The resulting value of object a
 */
function extend(a, b, thisArg) {
  forEach(b, function assignValue(val, key) {
    if (thisArg && typeof val === 'function') {
      a[key] = bind(val, thisArg);
    } else {
      a[key] = val;
    }
  });
  return a;
}

var utils = {
  isArray: isArray,
  isArrayBuffer: isArrayBuffer,
  isBuffer: isBuffer,
  isFormData: isFormData,
  isArrayBufferView: isArrayBufferView,
  isString: isString,
  isNumber: isNumber,
  isObject: isObject,
  isUndefined: isUndefined,
  isDate: isDate,
  isFile: isFile,
  isBlob: isBlob,
  isFunction: isFunction,
  isStream: isStream,
  isURLSearchParams: isURLSearchParams,
  isStandardBrowserEnv: isStandardBrowserEnv,
  forEach: forEach,
  merge: merge,
  deepMerge: deepMerge,
  extend: extend,
  trim: trim
};

/**
 * Update an Error with the specified config, error code, and response.
 *
 * @param {Error} error The error to update.
 * @param {Object} config The config.
 * @param {string} [code] The error code (for example, 'ECONNABORTED').
 * @param {Object} [request] The request.
 * @param {Object} [response] The response.
 * @returns {Error} The error.
 */
var enhanceError = function enhanceError(error, config, code, request, response) {
  error.config = config;
  if (code) {
    error.code = code;
  }

  error.request = request;
  error.response = response;
  error.isAxiosError = true;

  error.toJSON = function() {
    return {
      // Standard
      message: this.message,
      name: this.name,
      // Microsoft
      description: this.description,
      number: this.number,
      // Mozilla
      fileName: this.fileName,
      lineNumber: this.lineNumber,
      columnNumber: this.columnNumber,
      stack: this.stack,
      // Axios
      config: this.config,
      code: this.code
    };
  };
  return error;
};

/**
 * Create an Error with the specified message, config, error code, request and response.
 *
 * @param {string} message The error message.
 * @param {Object} config The config.
 * @param {string} [code] The error code (for example, 'ECONNABORTED').
 * @param {Object} [request] The request.
 * @param {Object} [response] The response.
 * @returns {Error} The created error.
 */
var createError = function createError(message, config, code, request, response) {
  var error = new Error(message);
  return enhanceError(error, config, code, request, response);
};

/**
 * Resolve or reject a Promise based on response status.
 *
 * @param {Function} resolve A function that resolves the promise.
 * @param {Function} reject A function that rejects the promise.
 * @param {object} response The response.
 */
var settle = function settle(resolve, reject, response) {
  var validateStatus = response.config.validateStatus;
  if (!validateStatus || validateStatus(response.status)) {
    resolve(response);
  } else {
    reject(createError(
      'Request failed with status code ' + response.status,
      response.config,
      null,
      response.request,
      response
    ));
  }
};

function encode(val) {
  return encodeURIComponent(val).
    replace(/%40/gi, '@').
    replace(/%3A/gi, ':').
    replace(/%24/g, '$').
    replace(/%2C/gi, ',').
    replace(/%20/g, '+').
    replace(/%5B/gi, '[').
    replace(/%5D/gi, ']');
}

/**
 * Build a URL by appending params to the end
 *
 * @param {string} url The base of the url (e.g., http://www.google.com)
 * @param {object} [params] The params to be appended
 * @returns {string} The formatted url
 */
var buildURL = function buildURL(url, params, paramsSerializer) {
  /*eslint no-param-reassign:0*/
  if (!params) {
    return url;
  }

  var serializedParams;
  if (paramsSerializer) {
    serializedParams = paramsSerializer(params);
  } else if (utils.isURLSearchParams(params)) {
    serializedParams = params.toString();
  } else {
    var parts = [];

    utils.forEach(params, function serialize(val, key) {
      if (val === null || typeof val === 'undefined') {
        return;
      }

      if (utils.isArray(val)) {
        key = key + '[]';
      } else {
        val = [val];
      }

      utils.forEach(val, function parseValue(v) {
        if (utils.isDate(v)) {
          v = v.toISOString();
        } else if (utils.isObject(v)) {
          v = JSON.stringify(v);
        }
        parts.push(encode(key) + '=' + encode(v));
      });
    });

    serializedParams = parts.join('&');
  }

  if (serializedParams) {
    var hashmarkIndex = url.indexOf('#');
    if (hashmarkIndex !== -1) {
      url = url.slice(0, hashmarkIndex);
    }

    url += (url.indexOf('?') === -1 ? '?' : '&') + serializedParams;
  }

  return url;
};

const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=';
// btoa
function btoa(input) {
    const str = String(input);
    // initialize result and counter
    let block;
    let charCode;
    let idx = 0;
    let map = chars;
    let output = '';
    /* eslint-disable no-cond-assign, no-bitwise, no-mixed-operators */
    for (; 
    // if the next str index does not exist:
    //   change the mapping table to "="
    //   check if d has no fractional digits
    str.charAt(idx | 0) || (map = '=', idx % 1); 
    // "8 - idx % 1 * 8" generates the sequence 2, 4, 6, 8
    output += map.charAt(63 & block >> 8 - idx % 1 * 8)) {
        charCode = str.charCodeAt(idx += 3 / 4);
        if (charCode > 0xFF) {
            throw new Error('"btoa" failed: The string to be encoded contains characters outside of the Latin1 range.');
        }
        block = block << 8 | charCode;
    }
    return output;
}

var PLATFORM;
(function (PLATFORM) {
    PLATFORM[PLATFORM["kUnknown"] = 0] = "kUnknown";
    PLATFORM[PLATFORM["kWechat"] = 1] = "kWechat";
    PLATFORM[PLATFORM["kAlipay"] = 2] = "kAlipay";
    PLATFORM[PLATFORM["kBaidu"] = 3] = "kBaidu";
})(PLATFORM || (PLATFORM = {}));
function getPlatform() {
    switch (true) {
        case typeof wx === 'object':
            return PLATFORM.kWechat;
        case typeof swan === 'object':
            return PLATFORM.kBaidu;
        case typeof my === 'object':
            return PLATFORM.kAlipay;
        default:
            return PLATFORM.kUnknown;
    }
}
const platform = getPlatform();
const delegate = platform === PLATFORM.kWechat
    ? wx.request.bind(wx)
    : platform === PLATFORM.kAlipay
        ? (my.request || my.httpRequest).bind(my)
        : platform === PLATFORM.kBaidu
            ? swan.request.bind(swan)
            : undefined;
function createRequestDelegate() {
    let task;
    return {
        send(options) {
            if (!delegate)
                return;
            task = delegate(options);
        },
        abort() {
            task && task.abort();
        },
    };
}

function createRequest(config) {
    let timer;
    let timeout;
    let onabort;
    let onerror;
    let ontimeout;
    let onsuccess;
    const delegate = createRequestDelegate();
    return {
        send(options) {
            delegate.send({
                ...options,
                success: (response) => {
                    // normalize data
                    const headers = response.header || response.headers;
                    const status = response.statusCode || response.status || 200;
                    const statusText = status === 200 ? 'OK' : status === 400 ? 'Bad Request' : '';
                    onsuccess && onsuccess({
                        data: response.data,
                        status,
                        statusText,
                        headers,
                        config,
                        request: options,
                    });
                },
                fail: (data) => {
                    let isAbort = false;
                    let isTimeout = false;
                    // error or timeout
                    switch (platform) {
                        case PLATFORM.kWechat:
                            if (data.errMsg.indexOf('request:fail abort') !== -1) {
                                isAbort = true;
                            }
                            else if (data.errMsg.indexOf('timeout') !== -1) {
                                isTimeout = true;
                            }
                            break;
                        case PLATFORM.kAlipay:
                            // https://docs.alipay.com/mini/api/network
                            if ([14, 19].includes(data.error)) {
                                isAbort = true;
                            }
                            else if ([13].includes(data.error)) {
                                isTimeout = true;
                            }
                            break;
                    }
                    const error = isAbort
                        ? createError('Request aborted', config, 'ECONNABORTED', '')
                        : isTimeout
                            ? createError('Request Timeout', config, 'ECONNABORTED', '')
                            : createError('Network Error', config, null, '');
                    if (isAbort) {
                        onabort && onabort(error);
                    }
                    if (isTimeout) {
                        ontimeout && ontimeout(error);
                    }
                    onerror && onerror(error);
                },
                complete: () => {
                    if (timer) {
                        clearTimeout(timer);
                        timer = undefined;
                    }
                },
            });
            if (timeout) {
                timer = setTimeout(() => {
                    ontimeout && ontimeout(createError(`timeout of ${config.timeout || 0}ms exceeded`, config, 'ECONNABORTED', ''));
                    timer = undefined;
                }, timeout);
            }
        },
        abort() {
            delegate.abort();
        },
        set timeout(val) {
            timeout = val;
        },
        set onabort(val) {
            onabort = val;
        },
        set onerror(val) {
            onerror = val;
        },
        set ontimeout(val) {
            ontimeout = val;
        },
        set onsuccess(val) {
            onsuccess = val;
        },
    };
}

const isString$1 = (val) => typeof val === 'string';
function mpAdapter(config) {
    /* eslint-disable-next-line prefer-arrow-callback */
    return new Promise(function dispatchMpRequest(resolve, reject) {
        const { url, data, headers, method, params, paramsSerializer, responseType, timeout, cancelToken, } = config;
        // HTTP basic authentication
        if (config.auth) {
            const [username, password] = [config.auth.username || '', config.auth.password || ''];
            headers.Authorization = `Basic ${btoa(`${username}:${password}`)}`;
        }
        // Add headers to the request
        utils.forEach(headers, (val, key) => {
            const header = key.toLowerCase();
            if ((typeof data === 'undefined' && header === 'content-type') || header === 'referer') {
                delete headers[key];
            }
        });
        let request = createRequest(config);
        const options = {
            url: buildURL(url, params, paramsSerializer),
            header: headers,
            method: method && method.toUpperCase(),
            data: isString$1(data) ? JSON.parse(data) : data,
            responseType,
        };
        if (cancelToken) {
            // Handle cancellation
            cancelToken.promise.then((cancel) => {
                if (!request)
                    return;
                request.abort();
                reject(cancel);
                request = null;
            });
        }
        request.timeout = timeout;
        request.onsuccess = function handleLoad(response) {
            settle(resolve, reject, response);
            request = null;
        };
        request.onabort = function handleAbort(error) {
            if (!request)
                return;
            reject(error);
            request = null;
        };
        request.onerror = function handleError(error) {
            if (!request)
                return;
            reject(error);
            request = null;
        };
        request.ontimeout = function handleTimeout(error) {
            reject(error);
            request = null;
        };
        request.send(options);
    });
}

const commonVersionIdentifier = /version\/(\d+(\.?_?\d+)+)/i;
function getFirstMatch(regexp, ua) {
    const match = ua.match(regexp);
    return (match && match.length > 0 && match[1]) || '';
}
function getSecondMatch(regexp, ua) {
    const match = ua.match(regexp);
    return (match && match.length > 1 && match[2]) || '';
}
function browser(name, version) {
    return {
        name,
        version,
        firefox: name === 'firefox',
        chrome: name === 'chrome' || name === 'chromium',
        wechet: name === 'wechat',
        toString() {
            return `${name.toUpperCase()} ${version}`;
        },
    };
}
const browsersList = [
    {
        test: [/micromessenger/i],
        describe(ua) {
            return browser('wechat', getFirstMatch(/(?:micromessenger)[\s/](\d+(\.?_?\d+)+)/i, ua) || getFirstMatch(commonVersionIdentifier, ua));
        },
    },
    {
        test: [/\sedg\//i],
        describe(ua) {
            return browser('edge', getFirstMatch(/\sedg\/(\d+(\.?_?\d+)+)/i, ua));
        },
    },
    {
        test: [/edg([ea]|ios)/i],
        describe(ua) {
            return browser('edge', getSecondMatch(/edg([ea]|ios)\/(\d+(\.?_?\d+)+)/i, ua));
        },
    },
    {
        test: [/firefox|iceweasel|fxios/i],
        describe(ua) {
            return browser('firefox', getFirstMatch(/(?:firefox|iceweasel|fxios)[\s/](\d+(\.?_?\d+)+)/i, ua));
        },
    },
    {
        test: [/chromium/i],
        describe(ua) {
            return browser('chromium', getFirstMatch(/(?:chromium)[\s/](\d+(\.?_?\d+)+)/i, ua) || getFirstMatch(commonVersionIdentifier, ua));
        },
    },
    {
        test: [/chrome|crios|crmo/i],
        describe(ua) {
            return browser('chrome', getFirstMatch(/(?:chrome|crios|crmo)\/(\d+(\.?_?\d+)+)/i, ua));
        },
    },
    {
        test: [/safari|applewebkit/i],
        describe(ua) {
            return browser('safari', getFirstMatch(commonVersionIdentifier, ua));
        },
    },
    /* Something else */
    {
        test: [/.*/i],
        describe(ua) {
            /* Here we try to make sure that there are explicit details about the device
             * in order to decide what regexp exactly we want to apply
             * (as there is a specific decision based on that conclusion)
             */
            const regexpWithoutDeviceSpec = /^(.*)\/(.*) /;
            const regexpWithDeviceSpec = /^(.*)\/(.*)[ \t]\((.*)/;
            const hasDeviceSpec = ua.search('\\(') !== -1;
            const regexp = hasDeviceSpec ? regexpWithDeviceSpec : regexpWithoutDeviceSpec;
            return browser(getFirstMatch(regexp, ua), getSecondMatch(regexp, ua));
        },
    },
];

const parsed = {};
function isMiniProgram() {
    // return /miniprogram/i.test(navigator.userAgent)
    // || (window && window.__wxjs_environment === 'miniprogram');
    if (global && global.wx)
        return true;
    return !window && !navigator && !global;
}
function parseBrowser(ua) {
    if (!parsed.browser) {
        // ua = ua || navigator.userAgent;
        if (isMiniProgram()) {
            ua = 'miniProgram';
        }
        else {
            ua = ua || navigator.userAgent;
        }
        const descriptor = browsersList.find((browser) => {
            return browser.test.some(condition => condition.test(ua));
        });
        if (descriptor) {
            parsed.browser = descriptor.describe(ua);
        }
    }
    return parsed.browser;
}
function getBrowser() {
    return parseBrowser();
}
const BROWSER = parseBrowser();

const startsWith = (input, search) => {
    return input.substr(0, search.length) === search;
};
const MEETNOW_PREFIX = 'meetnow:';
const MEETNOW_SESSION_KEY = 'meetnow-persist-config';
class Config {
    constructor() {
        this.m = new Map();
    }
    reset(configObj) {
        this.m = new Map(Object.entries(configObj));
    }
    get(key, fallback) {
        const value = this.m.get(key);
        return (value !== undefined) ? value : fallback;
    }
    getBoolean(key, fallback = false) {
        const val = this.m.get(key);
        if (val === undefined) {
            return fallback;
        }
        if (typeof val === 'string') {
            return val === 'true';
        }
        return !!val;
    }
    getNumber(key, fallback) {
        const val = parseFloat(this.m.get(key));
        return Number.isNaN(val) ? (fallback !== undefined ? fallback : NaN) : val;
    }
    set(key, value) {
        this.m.set(key, value);
    }
}
const CONFIG = new Config();
const configFromSession = (win) => {
    try {
        const configStr = win.sessionStorage.getItem(MEETNOW_SESSION_KEY);
        return configStr !== null ? JSON.parse(configStr) : {};
    }
    catch (e) {
        return {};
    }
};
const saveConfig = (win, c) => {
    try {
        win.sessionStorage.setItem(MEETNOW_SESSION_KEY, JSON.stringify(c));
    }
    catch (e) {
        /* eslint-disable-next-line */
        return;
    }
};
const configFromURL = (win) => {
    const configObj = {};
    try {
        win.location.search.slice(1)
            .split('&')
            .map(entry => entry.split('='))
            .map(([key, value]) => [decodeURIComponent(key), decodeURIComponent(value)])
            .filter(([key]) => startsWith(key, MEETNOW_PREFIX))
            .map(([key, value]) => [key.slice(MEETNOW_PREFIX.length), value])
            .forEach(([key, value]) => {
            configObj[key] = value;
        });
    }
    catch (e) {
        return configObj;
    }
    return configObj;
};

function setupConfig(config) {
    const win = isMiniProgram() ? wx : window;
    const MeetNow = win.MeetNow = win.MeetNow || { config };
    // create the Ionic.config from raw config object (if it exists)
    // and convert Ionic.config into a ConfigApi that has a get() fn
    const configObj = {
        ...configFromSession(win),
        persistent: false,
        ...MeetNow.config,
        ...configFromURL(win),
    };
    CONFIG.reset(configObj);
    if (CONFIG.getBoolean('persistent')) {
        saveConfig(win, configObj);
    }
    // first see if the mode was set as an attribute on <html>
    // which could have been set by the user, or by pre-rendering
    // otherwise get the mode via config settings, and fallback to md
    MeetNow.config = CONFIG;
    if (CONFIG.getBoolean('testing')) {
        CONFIG.set('debug', 'MN:*');
    }
}

const RequestMethod = {
    GET: 'get',
    POST: 'post',
};

const baseURL = {
    ctrl: '/conference-ctrl/api/v1/ctrl/',
    usermgr: '/user-manager/api/v1/',
};
const configs = {
    // user manager
    getVirtualJWT: {
        method: RequestMethod.GET,
        url: `${baseURL.usermgr}external/virtualJwt/party`,
    },
    // info
    getURL: {
        method: RequestMethod.POST,
        url: `${baseURL.ctrl}get-url-by-long-num`,
    },
    getFullInfo: {
        method: RequestMethod.POST,
        url: `${baseURL.ctrl}get-conference-info`,
    },
    getBasicInfo: {
        method: RequestMethod.POST,
        url: `${baseURL.ctrl}get-short-info`,
    },
    getBasicInfoOffline: {
        method: RequestMethod.POST,
        url: `${baseURL.ctrl}get-short-info-offline`,
    },
    getStats: {
        method: RequestMethod.POST,
        url: `${baseURL.ctrl}get-call-stats`,
    },
    // lifecycle
    polling: {
        method: RequestMethod.POST,
        url: `${baseURL.ctrl}polling`,
    },
    keepalive: {
        method: RequestMethod.POST,
        url: `${baseURL.ctrl}user-keepalive`,
    },
    // focus
    joinFocus: {
        method: RequestMethod.POST,
        url: `${baseURL.ctrl}join-focus`,
    },
    joinWechat: {
        method: RequestMethod.POST,
        url: `${baseURL.ctrl}join-wechat`,
    },
    // media
    joinMedia: {
        method: RequestMethod.POST,
        url: `${baseURL.ctrl}join-audio-video`,
    },
    renegMedia: {
        method: RequestMethod.POST,
        url: `${baseURL.ctrl}av-reneg`,
    },
    // share
    joinShare: {
        method: RequestMethod.POST,
        url: `${baseURL.ctrl}join-applicationsharing-v2`,
    },
    leaveShare: {
        method: RequestMethod.POST,
        url: `${baseURL.ctrl}bye-applicationsharing`,
    },
    switchShare: {
        method: RequestMethod.POST,
        url: `${baseURL.ctrl}applicationsharing-switch`,
    },
    renegShare: {
        method: RequestMethod.POST,
        url: `${baseURL.ctrl}applicationsharing-reneg`,
    },
    // im
    pushMessage: {
        method: RequestMethod.POST,
        url: `${baseURL.ctrl}im-info`,
    },
    pullMessage: {
        method: RequestMethod.POST,
        url: `${baseURL.ctrl}get-all-im-info`,
    },
    // ctrl
    muteAll: {
        method: RequestMethod.POST,
        url: `${baseURL.ctrl}mute-all`,
    },
    unmuteAll: {
        method: RequestMethod.POST,
        url: `${baseURL.ctrl}unmute-all`,
    },
    acceptLobbyUser: {
        method: RequestMethod.POST,
        url: `${baseURL.ctrl}grant-lobby-user`,
    },
    acceptLobbyUserAll: {
        method: RequestMethod.POST,
        url: `${baseURL.ctrl}grant-lobby-all`,
    },
    rejectLobbyUserAll: {
        method: RequestMethod.POST,
        url: `${baseURL.ctrl}del-lobby-all`,
    },
    waitLobbyUser: {
        method: RequestMethod.POST,
        url: `${baseURL.ctrl}wait-lobby-user`,
    },
    waitLobbyUserAll: {
        method: RequestMethod.POST,
        url: `${baseURL.ctrl}wait-lobby-all`,
    },
    rejectHandupAll: {
        method: RequestMethod.POST,
        url: `${baseURL.ctrl}reject-all-hand-up`,
    },
    deleteUser: {
        method: RequestMethod.POST,
        url: `${baseURL.ctrl}delete-user`,
    },
    setUserMedia: {
        method: RequestMethod.POST,
        url: `${baseURL.ctrl}modify-user-media`,
    },
    setUserRole: {
        method: RequestMethod.POST,
        url: `${baseURL.ctrl}modify-user-role`,
    },
    setUserDisplayText: {
        method: RequestMethod.POST,
        url: `${baseURL.ctrl}edit-user-display-text`,
    },
    holdUser: {
        method: RequestMethod.POST,
        url: `${baseURL.ctrl}wait-lobby-user`,
    },
    inviteUser: {
        method: RequestMethod.POST,
        url: `${baseURL.ctrl}invite-user`,
    },
    setFocusVideo: {
        method: RequestMethod.POST,
        url: `${baseURL.ctrl}set-focus-video`,
    },
    setSpeakMode: {
        method: RequestMethod.POST,
        url: `${baseURL.ctrl}set-speak-mode`,
    },
    setFreeLayout: {
        method: RequestMethod.POST,
        url: `${baseURL.ctrl}set-free-layout`,
    },
    setCustomizeLayout: {
        method: RequestMethod.POST,
        url: `${baseURL.ctrl}set-customize-layout`,
    },
    setGlobalLayout: {
        method: RequestMethod.POST,
        url: `${baseURL.ctrl}set-global-layout`,
    },
    setFecc: {
        method: RequestMethod.POST,
        url: `${baseURL.ctrl}set-fecc`,
    },
    setTitle: {
        method: RequestMethod.POST,
        url: `${baseURL.ctrl}set-title`,
    },
    sendTitle: {
        method: RequestMethod.POST,
        url: `${baseURL.ctrl}send-title`,
    },
    setRecord: {
        method: RequestMethod.POST,
        url: `${baseURL.ctrl}record-operate`,
    },
    setRTMP: {
        method: RequestMethod.POST,
        url: `${baseURL.ctrl}rtmp-operate`,
    },
    setLock: {
        method: RequestMethod.POST,
        url: `${baseURL.ctrl}lock-conference`,
    },
    leave: {
        method: RequestMethod.POST,
        url: `${baseURL.ctrl}quit-conference`,
    },
    end: {
        method: RequestMethod.POST,
        url: `${baseURL.ctrl}end-conference`,
    },
};
const CONFIGS = configs;

const DEFAULT_ERROR = {
    msg: 'Unknown Error',
    errorCode: -1,
};
class ApiError extends Error {
    constructor(bizCode, error = DEFAULT_ERROR) {
        super();
        this.name = 'ApiError';
        this.message = error.msg;
        this.errCode = error.errorCode;
        this.bizCode = bizCode;
    }
}
// TODO
// api error type checker

const log = debug('MN:Api:Request');
const { isCancel } = axios;
function createRequest$1(config, delegate = axios) {
    let source;
    let request;
    function header(header) {
        config.headers = header;
        return request;
    }
    function params(params) {
        config.params = params;
        return request;
    }
    function data(data) {
        config.data = data;
        return request;
    }
    function send() {
        log('send()');
        source = axios.CancelToken.source();
        config.cancelToken = source.token;
        return delegate(config);
    }
    function cancel(reason = 'canceled') {
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

const log$1 = debug('MN:Api');
// long polling timeout within 30 seconds
const DEFAULT_TIMEOUT = 35 * 1000;
function createApi(config = {}) {
    log$1('createApi()');
    const delegate = axios.create({
        baseURL: '/',
        timeout: DEFAULT_TIMEOUT,
        ...config,
    });
    delegate.interceptors.response.use((response) => {
        const { ret, bizCode, error, data, } = response.data;
        if (ret < 0)
            throw new ApiError(bizCode, error);
        // should not go here
        // server impl error
        if (ret === 0 && error)
            throw new ApiError(bizCode, error);
        log$1('request success: %o', data);
        // TBD
        // replace response data with actual data. eg. response.data = data;
        // TODO
        // normalize error
        return response;
    }, (error) => {
        log$1('request error: %o', error);
        throw error;
    });
    function request(apiName) {
        log$1(`request() "${apiName}"`);
        return createRequest$1({ ...CONFIGS[apiName] }, delegate);
    }
    return {
        get interceptors() {
            return delegate.interceptors;
        },
        request,
    };
}

const isDef = (value) => {
    return value !== undefined && value !== null;
};
const { isArray: isArray$1 } = Array;
const isFunction$1 = (val) => typeof val === 'function';
const isObject$1 = (val) => val !== null && typeof val === 'object';
const { hasOwnProperty } = Object.prototype;
const hasOwn = (val, key) => hasOwnProperty.call(val, key);
const camelizeRE = /-(\w)/g;
const camelize = (str) => {
    return str.replace(camelizeRE, (_, c) => (c ? c.toUpperCase() : ''));
};
// compare whether a value has changed, accounting for NaN.
const hasChanged = (value, oldValue) => {
    /* eslint-disable-next-line no-self-compare */
    return value !== oldValue && (value === value || oldValue === oldValue);
};

const log$2 = debug('MN:Worker');
function createWorker(config) {
    let running = false;
    let working = false;
    let interval = 0;
    let times = 0;
    let timeout;
    const { interval: nextInterval = interval, work, cancel, } = config;
    async function job(immediate = true) {
        if (work && immediate) {
            working = true;
            await work(times++);
            working = false;
        }
        if (!running)
            return;
        interval = isFunction$1(nextInterval) ? nextInterval() : nextInterval;
        // schedule next
        timeout = setTimeout(job, interval);
    }
    async function start(immediate = true) {
        log$2('start()');
        if (running)
            return;
        running = true;
        await job(immediate);
    }
    function stop() {
        log$2('stop()');
        if (!running)
            return;
        if (timeout) {
            clearTimeout(timeout);
            timeout = undefined;
        }
        if (working) {
            cancel && cancel();
        }
        running = false;
    }
    return {
        config,
        get running() {
            return running;
        },
        start,
        stop,
    };
}

function createContext(delegate) {
    return new Proxy({}, {
        get(target, key) {
            return key in target ? target[key] : Reflect.get(delegate, key);
        },
    });
}
// export function createMessageSender(delegate: any) {
//   return new Proxy({}, {
//     get(target: object, key: string) {
//       return Reflect.get(delegate, hyphenate(key));
//     },
//   }) as Context;
// }

const log$3 = debug('MN:Events');
function createEvents(scopedlog = log$3) {
    let instance;
    const events = {};
    function on(event, fn) {
        if (isArray$1(event)) {
            event.forEach((ev) => on(ev, fn));
            return;
        }
        (events[event] || (events[event] = [])).push(fn);
    }
    function off(event, fn) {
        if (isArray$1(event)) {
            event.forEach((e) => off(e, fn));
            return;
        }
        const callbacks = events[event];
        if (!callbacks)
            return;
        if (!fn) {
            events[event] = null;
            return;
        }
        let callback;
        let index = callbacks.length;
        while (index--) {
            callback = callbacks[index];
            if (callback === fn || callback.fn === fn) {
                callbacks.splice(index, 1);
                break;
            }
        }
    }
    function once(event, fn) {
        function wrapper(...args) {
            off(event, wrapper);
            fn.apply(this, args);
        }
        wrapper.fn = fn;
        on(event, wrapper);
    }
    function toArray(list, start) {
        start = start || 0;
        let i = list.length - start;
        const ret = new Array(i);
        while (i--) {
            ret[i] = list[i + start];
        }
        return ret;
    }
    function emit(event, ...args) {
        scopedlog(`emit() "${event}"`);
        let callbacks = events[event];
        if (!callbacks)
            return;
        callbacks = callbacks.length > 1 ? toArray(callbacks) : callbacks;
        for (const callback of callbacks) {
            try {
                callback(...args);
            }
            catch (error) {
                scopedlog(`invoke "${event}" callback failed: %o`, error);
            }
        }
    }
    return instance = {
        on(event, fn) {
            on(event, fn);
            return instance;
        },
        off(event, fn) {
            off(event, fn);
            return instance;
        },
        once(event, fn) {
            once(event, fn);
            return instance;
        },
        emit(event, ...args) {
            emit(event, ...args);
            return instance;
        },
    };
}

const log$4 = debug('MN:Keepalive');
const DEFAULT_INTERVAL = 30 * 1000;
const MIN_INTERVAL = 2;
const MAX_INTERVAL = 30;
const MAX_ATTEMPTS = 15;
function computeNextTimeout(attempts) {
    log$4(`computeNextTimeout() attempts: ${attempts}`);
    /* eslint-disable-next-line no-restricted-properties */
    let k = Math.floor((Math.random() * Math.pow(2, attempts)) + 1);
    if (k < MIN_INTERVAL) {
        k = MIN_INTERVAL;
    }
    if (k > MAX_INTERVAL) {
        k = MAX_INTERVAL;
    }
    return k * 1000;
}
function createKeepAlive(config) {
    const { api } = config;
    let request;
    let canceled = false;
    let interval = config.interval || DEFAULT_INTERVAL;
    let attempts = 0;
    async function keepalive() {
        log$4('keepalive()');
        let response;
        let error;
        try {
            canceled = false;
            request = api.request('keepalive');
            response = await request.send();
        }
        catch (e) {
            error = e;
            canceled = isCancel(e);
            if (canceled)
                return;
            // if request failed by network or server error,
            // increase next request timeout
            attempts++;
            interval = computeNextTimeout(attempts);
            log$4('keepalive error: %o', error);
            config.onError && config.onError(error, attempts);
        }
        if (attempts > MAX_ATTEMPTS) {
            config.onError && config.onError(new Error('Max Attempts'), attempts);
        }
        if (error)
            return;
        const { bizCode, data = {
            interval,
        }, } = response.data;
        const { interval: expectedInterval, } = data;
        // TODO
        // check bizCode
        interval = Math.min(expectedInterval * 1000, interval);
    }
    const worker = createWorker({
        work: () => keepalive(),
        interval: () => interval,
        cancel: () => request.cancel(),
    });
    return {
        ...worker,
        keepalive,
    };
}

const log$5 = debug('MN:Polling');
const DEFAULT_INTERVAL$1 = 100;
const MIN_INTERVAL$1 = 2;
const MAX_INTERVAL$1 = 30;
const MAX_ATTEMPTS$1 = 15;
function computeNextTimeout$1(attempts) {
    log$5(`computeNextTimeout() attempts: ${attempts}`);
    /* eslint-disable-next-line no-restricted-properties */
    let k = Math.floor((Math.random() * Math.pow(2, attempts)) + 1);
    if (k < MIN_INTERVAL$1) {
        k = MIN_INTERVAL$1;
    }
    if (k > MAX_INTERVAL$1) {
        k = MAX_INTERVAL$1;
    }
    return k * 1000;
}
function createPolling(config) {
    const { api } = config;
    let request;
    let interval = DEFAULT_INTERVAL$1;
    let attempts = 0;
    let version = 0;
    function analyze(data) {
        if (!data)
            return;
        const { version: newVersion, category, body } = data;
        if (!isDef(newVersion) || newVersion <= version) {
            log$5(`illegal version: ${newVersion}, current version: ${version}.`);
            return;
        }
        switch (category) {
            case 'conference-info':
                config.onInformation && config.onInformation(body);
                break;
            case 'im-record':
                config.onMessage && config.onMessage(body);
                break;
            case 'port-change':
                config.onRenegotiate && config.onRenegotiate(body);
                break;
            case 'quit-conference':
                config.onQuit && config.onQuit(body);
                break;
            default:
                log$5(`unsupported category: ${category}`);
                break;
        }
        version = newVersion;
    }
    async function poll() {
        log$5('poll()');
        let response;
        let error;
        let canceled = false;
        let timeouted = false;
        try {
            request = api.request('polling').data({ version });
            response = await request.send();
        }
        catch (e) {
            error = e;
            canceled = isCancel(e);
            if (canceled)
                return;
            // polling timeout
            timeouted = !!error && [900408, 901323].includes(error.bizCode);
            if (timeouted)
                return;
            // if request failed by network or server error,
            // increase next polling timeout
            attempts++;
            interval = computeNextTimeout$1(attempts);
            log$5('polling error: %o', error);
            config.onError && config.onError(error, attempts);
        }
        if (attempts > MAX_ATTEMPTS$1) {
            config.onError && config.onError(new Error('Max Attempts'), attempts);
        }
        if (error)
            return;
        const { bizCode, data } = response.data;
        // TODO
        // check bizCode
        try {
            analyze(data);
        }
        catch (error) {
            log$5('process data failed. %o', error);
        }
        attempts = 0;
    }
    const worker = createWorker({
        work: () => poll(),
        interval: () => interval,
        cancel: () => request.cancel(),
    });
    return {
        ...worker,
        poll,
        analyze,
    };
}

const log$6 = debug('MN:Reactive');
function createReactive(data = {}, events) {
    events = events || createEvents(log$6);
    return new Proxy(data, {
        set(target, prop, value, receiver) {
            const oldValue = target[prop];
            const hadKey = hasOwn(target, prop);
            const result = Reflect.set(target, prop, value, receiver);
            if (!hadKey) {
                events.emit(`${camelize(prop)}Added`, value);
            }
            if (hasChanged(value, oldValue)) {
                events.emit(`${camelize(prop)}Changed`, value, oldValue);
            }
            return result;
        },
    });
}

const log$7 = debug('MN:Information:Description');
function createDescription(data, context) {
    const { api } = context;
    const events = createEvents(log$7);
    /* eslint-disable-next-line no-use-before-define */
    const reactive = createReactive(watch({}), events);
    let description;
    function watch(target) {
        /* eslint-disable no-use-before-define */
        target.locked = isLocked();
        /* eslint-enable no-use-before-define */
        return target;
    }
    function update(diff) {
        // fire status change events
        watch(reactive);
        events.emit('updated', description);
    }
    function getLock() {
        return {
            admissionPolicy: data['admission-policy'],
            attendeeByPass: data['attendee-by-pass'],
        };
    }
    async function setLock(options) {
        log$7('setLock()');
        const { admissionPolicy, attendeeByPass = true } = options;
        await api
            .request('setLock')
            .data({
            'admission-policy': admissionPolicy,
            'attendee-lobby-bypass': attendeeByPass,
        })
            .send();
    }
    async function lock(attendeeByPass = false, presenterOnly = true) {
        log$7('lock()');
        await setLock({
            admissionPolicy: presenterOnly ? 'closedAuthenticated' : 'openAuthenticated',
            attendeeByPass,
        });
    }
    async function unlock() {
        log$7('unlock()');
        await setLock({
            admissionPolicy: 'anonymous',
        });
    }
    function isLocked() {
        return getLock().admissionPolicy !== 'anonymous';
    }
    return description = {
        ...events,
        get data() {
            return data;
        },
        get subject() {
            return data.subject;
        },
        get(key) {
            return data[key];
        },
        update,
        getLock,
        setLock,
        lock,
        unlock,
        isLocked,
    };
}

const log$8 = debug('MN:Information:State');
function createState(data, context) {
    const events = createEvents(log$8);
    /* eslint-disable-next-line no-use-before-define */
    const reactive = createReactive(watch({}), events);
    let description;
    function watch(target) {
        const { active, locked, } = data;
        /* eslint-disable no-use-before-define */
        target.active = active;
        target.locked = locked;
        target.sharingUserEntity = getSharingUserEntity();
        target.speechUserEntity = getSpeechUserEntity();
        /* eslint-enable no-use-before-define */
        return target;
    }
    function update(diff) {
        // fire status change events
        watch(reactive);
        events.emit('updated', description);
    }
    function getSharingUserEntity() {
        const { applicationsharer } = data;
        return applicationsharer.user && applicationsharer.user.entity;
    }
    function getSpeechUserEntity() {
        const { 'speech-user-entity': speechUserEntity } = data;
        return speechUserEntity;
    }
    return description = {
        ...events,
        get data() {
            return data;
        },
        get(key) {
            return data[key];
        },
        update,
        getSharingUserEntity,
        getSpeechUserEntity,
    };
}

const log$9 = debug('MN:Information:Layout');
function createLayoutCtrl(api) {
    async function setLayout(options) {
        log$9('setLayout()');
        await api
            .request('setFreeLayout')
            .data(options)
            .send();
    }
    async function setCustomizeLayout(options) {
        log$9('setCustomizeLayout()');
        options.viewer = options.viewer || 'attendee';
        await api
            .request('setCustomizeLayout')
            .data(options)
            .send();
    }
    async function setPresenterLayout(options) {
        log$9('setPresenterLayout()');
        options.viewer = 'presenter';
        await setCustomizeLayout(options);
    }
    async function setAttendeeLayout(options) {
        log$9('setAttendeeLayout()');
        options.viewer = 'attendee';
        await setCustomizeLayout(options);
    }
    async function setCastViewerLayout(options) {
        log$9('setCastViewerLayout()');
        options.viewer = 'castviewer';
        await setCustomizeLayout(options);
    }
    async function setOSD(options = { name: true, icon: true }) {
        log$9('setOSD()');
        const { name, icon } = options;
        await api
            .request('setGlobalLayout')
            .data({
            'hide-osd-site-icon': icon,
            'hide-osd-site-name': name,
        })
            .send();
    }
    async function setSpeakMode(mode) {
        log$9('setSpeakMode()');
        await api
            .request('setSpeakMode')
            .data({ 'speak-mode': mode })
            .send();
    }
    return {
        setLayout,
        setCustomizeLayout,
        setPresenterLayout,
        setAttendeeLayout,
        setCastViewerLayout,
        setOSD,
        setSpeakMode,
    };
}

const log$a = debug('MN:Information:Danmaku');
const DANMAKU_CONFIGS = {
    position: 'top',
    type: 'static',
    displayTime: 30,
    repeatCount: 2,
    repeatInterval: 5,
    rollDirection: 'R2L',
};
function createDanmakuCtrl(api) {
    let lastConfig = DANMAKU_CONFIGS;
    async function setDanmaku(config) {
        log$a('setDanmaku()');
        const finalConfig = {
            ...lastConfig,
            config,
        };
        const { type, position, displayTime, repeatCount, repeatInterval, rollDirection, } = finalConfig;
        await api
            .request('setTitle')
            .data({
            type,
            position,
            'display-time': displayTime,
            'repeat-count': repeatCount,
            'repeat-interval': repeatInterval,
            'roll-direction': rollDirection,
        })
            .send();
        lastConfig = finalConfig;
    }
    async function sendDanmaku(msg, options) {
        log$a('sendDanmaku()');
        const { attendee = true, castviewer = true, presenter = true, } = options || {};
        await api
            .request('sendTitle')
            .data({
            'display-text': msg,
            'all-attendee': attendee,
            'all-castviewer': castviewer,
            'all-presenter': presenter,
        });
    }
    return {
        setDanmaku,
        sendDanmaku,
    };
}

const log$b = debug('MN:Information:View');
function createView(data, context) {
    const { api } = context;
    const events = createEvents(log$b);
    /* eslint-disable-next-line no-use-before-define */
    const reactive = createReactive(watch({}), events);
    const layout = createLayoutCtrl(api);
    const danmaku = createDanmakuCtrl(api);
    let view;
    function watch(target) {
        /* eslint-disable no-use-before-define */
        target.focusUserEntity = getFocusUserEntity();
        /* eslint-enable no-use-before-define */
        return target;
    }
    function update(diff) {
        // fire status change events
        watch(reactive);
        events.emit('updated', view);
    }
    function getVideoView() {
        return data['entity-view'].find((view) => view.entity === 'audio-video');
    }
    function getLayout() {
        return getVideoView()['entity-state'];
    }
    function getFocusUserEntity() {
        return getLayout()['focus-video-user-entity'];
    }
    function getDanmaku() {
        return getVideoView().title;
    }
    return view = {
        ...events,
        get data() {
            return data;
        },
        get(key) {
            return data[key];
        },
        ...layout,
        ...danmaku,
        update,
        getVideoView,
        getLayout,
        getFocusUserEntity,
        getDanmaku,
    };
}

const log$c = debug('MN:Information:Camera');
var ActionTypes;
(function (ActionTypes) {
    ActionTypes["LEFT"] = "PanLeft";
    ActionTypes["RIGHT"] = "PanRight";
    ActionTypes["DOWN"] = "TiltDown";
    ActionTypes["UP"] = "TiltUp";
    ActionTypes["ZOOMOUT"] = "ZoomOut";
    ActionTypes["ZOOMIN"] = "ZoomIn";
    ActionTypes["FOCUSOUT"] = "FocusOut";
    ActionTypes["FOCUSIN"] = "FocusIn";
})(ActionTypes || (ActionTypes = {}));
function createCameraCtrl(api, entity) {
    async function action(type) {
        log$c('action()');
        await api
            .request('setFecc')
            .data({
            'user-entity': entity,
            action: type,
        })
            .send();
    }
    function left() {
        log$c('left()');
        return action(ActionTypes.LEFT);
    }
    function right() {
        log$c('right()');
        return action(ActionTypes.RIGHT);
    }
    function down() {
        log$c('down()');
        return action(ActionTypes.DOWN);
    }
    function up() {
        log$c('up()');
        return action(ActionTypes.UP);
    }
    function zoomout() {
        log$c('zoomout()');
        return action(ActionTypes.ZOOMOUT);
    }
    function zoomin() {
        log$c('zoomin()');
        return action(ActionTypes.ZOOMIN);
    }
    function focusout() {
        log$c('focusout()');
        return action(ActionTypes.FOCUSOUT);
    }
    function focusin() {
        log$c('focusin()');
        return action(ActionTypes.FOCUSIN);
    }
    return {
        action,
        left,
        right,
        down,
        up,
        zoomout,
        zoomin,
        focusout,
        focusin,
    };
}

const log$d = debug('MN:Information:User');
function createUser(data, context) {
    const { api, userId } = context;
    const events = createEvents(log$d);
    /* eslint-disable-next-line no-use-before-define */
    const reactive = createReactive(watch({}), events);
    /* eslint-disable-next-line no-use-before-define */
    const entity = getEntity();
    const camera = createCameraCtrl(api, entity);
    let user;
    function watch(target) {
        /* eslint-disable no-use-before-define */
        target.displayText = data['display-text'];
        target.role = getRole();
        target.hold = isOnHold();
        target.handup = isHandup();
        target.audio = !isAudioBlocked();
        target.video = !isVideoBlocked();
        target.media = hasMedia();
        target.sharing = isSharing();
        /* eslint-enable no-use-before-define */
        return target;
    }
    function update(diff) {
        if (diff && (diff.state === 'full' || !data)) {
            data = diff;
        }
        // fire status change events
        watch(reactive);
        events.emit('updated', user);
    }
    function getEntity() {
        return data.entity;
    }
    function getUID() {
        return data['subject-id'];
    }
    function getDisplayText() {
        return data['display-text'];
    }
    function getRole() {
        return data.roles && data.roles.role;
    }
    function isCurrent() {
        return entity === userId;
    }
    function isAttendee() {
        return getRole() === 'attendee';
    }
    function isPresenter() {
        return getRole() === 'presenter';
    }
    function isCastviewer() {
        return getRole() === 'castviewer';
    }
    function isOrganizer() {
        return getRole() === 'organizer';
    }
    function getEndpoint(type) {
        return data.endpoint.find((ep) => ep['session-type'] === type);
    }
    function isOnHold() {
        const endpoint = getEndpoint('audio-video');
        return endpoint && endpoint.status === 'on-hold';
    }
    function hasFocus() {
        return !!getEndpoint('focus');
    }
    function hasMedia() {
        return !!getEndpoint('audio-video');
    }
    function hasSharing() {
        return !!getEndpoint('applicationsharing');
    }
    function hasFECC() {
        return !!getEndpoint('fecc');
    }
    function getMedia(label) {
        const mediaList = data.endpoint.reduce((previous, current) => {
            return previous.concat(current.media || []);
        }, []);
        return mediaList.find((m) => m.label === label);
    }
    function getMediaFilter(label) {
        const media = getMedia(label);
        const { 'media-ingress-filter': ingress = { type: 'block' }, 'media-egress-filter': egress = { type: 'block' }, } = media || {};
        return {
            ingress: ingress.type,
            egress: egress.type,
        };
    }
    function getAudioFilter() {
        return getMediaFilter('main-audio');
    }
    function getVideoFilter() {
        return getMediaFilter('main-video');
    }
    function isAudioBlocked() {
        const { ingress } = getAudioFilter();
        return ingress === 'block';
    }
    function isVideoBlocked() {
        const { ingress } = getVideoFilter();
        return ingress === 'block';
    }
    function isHandup() {
        const { ingress } = getAudioFilter();
        return ingress === 'unblocking';
    }
    function isSharing() {
        const media = getMedia('applicationsharing');
        return media && media.status === 'sendonly';
    }
    function isSIP() {
        return data.protocol.toLowerCase() === 'sip';
    }
    function isHTTP() {
        return data.protocol.toLowerCase() === 'http';
    }
    function isRTMP() {
        return data.protocol.toLowerCase() === 'rtmp';
    }
    // user ctrl
    async function setFilter(options) {
        log$d('setFilter()');
        const { label, enable } = options;
        const endpoint = user.getEndpoint('audio-video');
        const media = user.getMedia(label);
        await api
            .request('setUserMedia')
            .data({
            'user-entity': entity,
            'endpoint-entity': endpoint.entity,
            'media-id': media.id,
            'media-ingress-filter': enable ? 'unblock' : 'block',
        })
            .send();
    }
    async function setAudioFilter(enable) {
        log$d('setAudioFilter()');
        await setFilter({ label: 'main-audio', enable });
    }
    async function setVideoFilter(enable) {
        log$d('setVideoFilter()');
        await setFilter({ label: 'main-video', enable });
    }
    async function setDisplayText(displayText) {
        log$d('setDisplayText()');
        await api
            .request('setUserDisplayText')
            .data({
            'user-entity': entity,
            'display-text': displayText,
        })
            .send();
    }
    async function setRole(role) {
        log$d('setRole()');
        await api
            .request('setUserRole')
            .data({
            'user-entity': entity,
            role,
        })
            .send();
    }
    async function setFocus(enable = true) {
        log$d('setFocus()');
        await api
            .request('setFocusVideo')
            .data({
            'user-entity': enable ? entity : '',
        })
            .send();
    }
    async function getStats() {
        log$d('getStats()');
        await api
            .request('getStats')
            .data({ 'user-entity-list': [entity] })
            .send();
    }
    async function kick() {
        log$d('kick()');
        await api
            .request('deleteUser')
            .data({ 'user-entity': entity })
            .send();
    }
    async function hold() {
        log$d('hold()');
        await api
            .request('waitLobbyUser')
            .data({ 'user-entity': entity })
            .send();
    }
    async function unhold() {
        log$d('unhold()');
        await api
            .request('acceptLobbyUser')
            .data({ 'user-entity': entity })
            .send();
    }
    async function allow() {
        log$d('allow()');
        await api
            .request('acceptLobbyUser')
            .data({ 'user-entity': entity })
            .send();
    }
    async function accept() {
        log$d('accept()');
        await setAudioFilter(true);
    }
    async function reject() {
        log$d('reject()');
        await setAudioFilter(false);
    }
    async function sendMessage(msg) {
        log$d('sendMessage()');
        const { chatChannel } = context;
        if (chatChannel && chatChannel.ready) {
            await chatChannel.sendMessage(msg, [entity]);
        }
    }
    return user = {
        ...events,
        get data() {
            return data;
        },
        get(key) {
            return data[key];
        },
        update,
        getEntity,
        getUID,
        getDisplayText,
        getRole,
        isCurrent,
        isAttendee,
        isPresenter,
        isCastviewer,
        isOrganizer,
        getEndpoint,
        isOnHold,
        hasFocus,
        hasMedia,
        hasSharing,
        hasFECC,
        getMedia,
        getAudioFilter,
        getVideoFilter,
        isAudioBlocked,
        isVideoBlocked,
        isHandup,
        isSharing,
        isSIP,
        isHTTP,
        isRTMP,
        // user ctrl
        setFilter,
        setAudioFilter,
        setVideoFilter,
        setDisplayText,
        setRole,
        setFocus,
        getStats,
        kick,
        hold,
        unhold,
        allow,
        accept,
        reject,
        sendMessage,
        // camera ctrl
        camera,
    };
}

const log$e = debug('MN:Information:Lobby');
function createLobbyCtrl(api) {
    async function remove(entity) {
        log$e('remove()');
        const apiName = entity ? 'deleteUser' : 'rejectLobbyUserAll';
        await api
            .request(apiName)
            .data({ 'user-entity': entity })
            .send();
    }
    async function unhold(entity) {
        log$e('unhold()');
        const apiName = entity ? 'acceptLobbyUser' : 'acceptLobbyUserAll';
        await api
            .request(apiName)
            .data({ 'user-entity': entity })
            .send();
    }
    async function allow(entity) {
        log$e('allow()');
        await unhold(entity);
    }
    async function hold(entity) {
        log$e('hold()');
        const apiName = entity ? 'waitLobbyUser' : 'waitLobbyUserAll';
        await api
            .request(apiName)
            .data({ 'user-entity': entity })
            .send();
    }
    return {
        remove,
        unhold,
        hold,
        allow,
    };
}

const log$f = debug('MN:Information:Users');
function createUsers(data, context) {
    const { api } = context;
    const events = createEvents(log$f);
    const userMap = new Map();
    let userList;
    let users;
    /* eslint-disable-next-line no-use-before-define */
    const reactive = createReactive(watch({}), events);
    const lobby = createLobbyCtrl(api);
    function watch(target) {
        /* eslint-disable no-use-before-define */
        // update user list
        userList = data.user.map((userdata) => {
            const { entity } = userdata;
            let user = userMap.get(entity);
            if (!user) {
                user = createUser(userdata, context);
                userMap.set(entity, user);
            }
            return user;
        });
        /* eslint-enable no-use-before-define */
        return target;
    }
    function update(diff) {
        const added = [];
        const updated = [];
        const deleted = [];
        if (diff) {
            const { user } = diff;
            /* eslint-disable no-use-before-define */
            user.forEach((userdata) => {
                const { entity, state } = userdata;
                hasUser(entity)
                    ? state === 'deleted'
                        ? deleted.push(userdata)
                        : updated.push(userdata)
                    : added.push(userdata);
            });
            /* eslint-enable no-use-before-define */
        }
        // fire status change events
        watch(reactive);
        added.forEach((userdata) => {
            const { entity } = userdata;
            const user = userMap.get(entity);
            log$f('added user:\n\n %s(%s) \n', user.getDisplayText(), user.getEntity());
            users.emit('user:added', user);
        });
        updated.forEach((userdata) => {
            const { entity } = userdata;
            const user = userMap.get(entity);
            // user data is not proxied, so update it here
            // if user data is 'full', it will replace the old one
            user.update(userdata);
            log$f('updated user:\n\n %s(%s)  \n', user.getDisplayText(), user.getEntity());
            users.emit('user:updated', user);
        });
        deleted.forEach((userdata) => {
            const { entity } = userdata;
            const user = userMap.get(entity);
            log$f('deleted user:\n\n %s(%s)  \n', user.getDisplayText(), user.getEntity());
            users.emit('user:deleted', user);
            userMap.delete(entity);
        });
        // updated event must come after watch()
        // as user can access userlit via updated event
        events.emit('updated', users);
    }
    function getUserList(filter) {
        return filter ? userList.filter(filter) : userList;
    }
    function getUser(entity) {
        return userMap.get(entity);
    }
    function hasUser(entity) {
        return userMap.has(entity);
    }
    function getCurrent() {
        return userList.find((user) => user.isCurrent());
    }
    function getAttendee() {
        return userList.filter((user) => user.isAttendee() && !user.isOnHold());
    }
    function getPresenter() {
        return userList.filter((user) => user.isPresenter());
    }
    function getCastviewer() {
        return userList.filter((user) => user.isCastviewer());
    }
    function getOrganizer() {
        return userList.filter((user) => user.isOrganizer());
    }
    function getOnhold() {
        return userList.filter((user) => user.isOnHold());
    }
    function getHandup() {
        return userList.filter((user) => user.isHandup());
    }
    function getSharing() {
        return userList.filter((user) => user.isSharing());
    }
    function getAudioBlocked() {
        return userList.filter((user) => user.isAudioBlocked());
    }
    function getVideoBlocked() {
        return userList.filter((user) => user.isVideoBlocked());
    }
    function getSIP() {
        return userList.filter((user) => user.isSIP());
    }
    function getHTTP() {
        return userList.filter((user) => user.isHTTP());
    }
    function getRTMP() {
        return userList.filter((user) => user.isRTMP());
    }
    async function invite(option) {
        log$f('invite');
        await api
            .request('inviteUser')
            .data({
            uid: option.uid,
            'sip-url': option.sipURL,
            'h323-url': option.h323URL,
        });
    }
    async function kick(entity) {
        log$f('kick');
        await api
            .request('deleteUser')
            .data({ 'user-entity': entity })
            .send();
    }
    async function mute() {
        log$f('mute');
        await api
            .request('muteAll')
            .send();
    }
    async function unmute() {
        log$f('unmute');
        await api
            .request('unmuteAll')
            .send();
    }
    return users = {
        ...events,
        get data() {
            return data;
        },
        get(key) {
            return data[key];
        },
        ...lobby,
        update,
        getUserList,
        getUser,
        hasUser,
        getCurrent,
        getAttendee,
        getPresenter,
        getCastviewer,
        getOrganizer,
        getOnhold,
        getHandup,
        getSharing,
        getAudioBlocked,
        getVideoBlocked,
        getSIP,
        getHTTP,
        getRTMP,
        invite,
        kick,
        mute,
        unmute,
    };
}

const log$g = debug('MN:Information:RTMP');
var RTMPOperationTypes;
(function (RTMPOperationTypes) {
    RTMPOperationTypes["START"] = "start";
    RTMPOperationTypes["STOP"] = "stop";
    RTMPOperationTypes["PAUSE"] = "pause";
    RTMPOperationTypes["RESUME"] = "resume";
})(RTMPOperationTypes || (RTMPOperationTypes = {}));
function createRTMPCtrl(api) {
    async function operation(type) {
        log$g('operation');
        await api
            .request('setRTMP')
            .data({ operate: type })
            .send();
    }
    function start() {
        log$g('start');
        return operation(RTMPOperationTypes.START);
    }
    function stop() {
        log$g('stop');
        return operation(RTMPOperationTypes.STOP);
    }
    function pause() {
        log$g('pause');
        return operation(RTMPOperationTypes.PAUSE);
    }
    function resume() {
        log$g('resume');
        return operation(RTMPOperationTypes.RESUME);
    }
    return {
        operation,
        start,
        stop,
        pause,
        resume,
    };
}

const log$h = debug('MN:Information:RTMP');
function createRTMP(data, context) {
    const { api } = context;
    const events = createEvents(log$h);
    /* eslint-disable-next-line no-use-before-define */
    const reactive = createReactive(watch({}), events);
    const ctrl = createRTMPCtrl(api);
    let rtmp;
    function watch(target) {
        /* eslint-disable no-use-before-define */
        target.enable = getEnable();
        target.status = getStatus();
        /* eslint-enable no-use-before-define */
        return target;
    }
    function update(diff) {
        // fire status change events
        watch(reactive);
        events.emit('updated', rtmp);
    }
    function getUser(entity) {
        return entity
            ? data.users.find((userdata) => userdata.entity === entity)
            : data.users.find((userdata) => userdata.default) || data.users[0];
    }
    function getEnable() {
        return data['rtmp-enable'];
    }
    function getStatus(entity) {
        const userdata = getUser(entity);
        return userdata && userdata['rtmp-status'];
    }
    function getReason(entity) {
        const userdata = getUser(entity);
        return userdata && userdata.reason;
    }
    function getDetail(entity) {
        const userdata = getUser(entity);
        if (!userdata)
            return undefined;
        const { 'rtmp-status': status, 'rtmp-last-start-time': lastStartTime, 'rtmp-last-stop-duration': lastStopDuration, reason, } = userdata;
        return {
            reason,
            status,
            lastStartTime,
            lastStopDuration,
        };
    }
    return rtmp = {
        ...events,
        get data() {
            return data;
        },
        get(key) {
            return data[key];
        },
        update,
        getEnable,
        getStatus,
        getReason,
        getDetail,
        // rtmp ctrl
        ...ctrl,
    };
}

const log$i = debug('MN:Information:Record');
var RecordOperationTypes;
(function (RecordOperationTypes) {
    RecordOperationTypes["START"] = "start";
    RecordOperationTypes["STOP"] = "stop";
    RecordOperationTypes["PAUSE"] = "pause";
    RecordOperationTypes["RESUME"] = "resume";
})(RecordOperationTypes || (RecordOperationTypes = {}));
function createRecordCtrl(api) {
    async function operation(type) {
        await api
            .request('setRecord')
            .data({ operate: type })
            .send();
    }
    function start() {
        log$i('start()');
        return operation(RecordOperationTypes.START);
    }
    function stop() {
        log$i('stop()');
        return operation(RecordOperationTypes.STOP);
    }
    function pause() {
        log$i('pause()');
        return operation(RecordOperationTypes.PAUSE);
    }
    function resume() {
        log$i('resume()');
        return operation(RecordOperationTypes.RESUME);
    }
    return {
        operation,
        start,
        stop,
        pause,
        resume,
    };
}

const log$j = debug('MN:Information:Record');
function createRecord(data, context) {
    const { api } = context;
    const events = createEvents(log$j);
    /* eslint-disable-next-line no-use-before-define */
    const reactive = createReactive(watch({}), events);
    const ctrl = createRecordCtrl(api);
    let record;
    function watch(target) {
        /* eslint-disable no-use-before-define */
        target.status = getStatus();
        /* eslint-enable no-use-before-define */
        return target;
    }
    function update(diff) {
        // fire status change events
        watch(reactive);
        events.emit('updated', record);
    }
    function getUser() {
        return data.user;
    }
    function getStatus() {
        return getUser()['record-status'];
    }
    function getReason() {
        return getUser().reason;
    }
    function getDetail() {
        const userdata = getUser();
        const { 'record-status': status, 'record-last-start-time': lastStartTime, 'record-last-stop-duration': lastStopDuration, reason, } = userdata;
        return {
            reason,
            status,
            lastStartTime,
            lastStopDuration,
        };
    }
    return record = {
        ...events,
        get data() {
            return data;
        },
        get(key) {
            return data[key];
        },
        update,
        getStatus,
        getReason,
        getDetail,
        // record ctrl
        ...ctrl,
    };
}

const log$k = debug('MN:Information:Item');
function isItem(item) {
    return isDef(item) && isObject$1(item) && !isArray$1(item);
}
function isPartialableItem(item) {
    return isItem(item) && hasOwn(item, 'state');
}
function mergeItemList(rhys, items) {
    log$k('mergelist()');
    for (const item of items) {
        if (!isPartialableItem(item)) {
            log$k('we don not know how to process a non-partialable item in a list, because it is undocumented');
            log$k('treat it as full state item');
        }
        const { id, entity, state = 'full' } = item;
        const key = entity || id;
        if (!key) {
            log$k('missing item identity(entity or id).');
            continue;
        }
        const index = rhys
            .findIndex((it) => it.entity === key || it.id === key);
        log$k('item identity: %o', key);
        // not find
        if (index === -1) {
            if (state === 'deleted') {
                log$k('can not delete item not exist.');
                continue;
            }
            log$k('item added');
            rhys.push(item);
            continue;
        }
        // finded
        // this is weird as we don't know whether the item list is partial or not
        if (state === 'full') {
            rhys.splice(index, 1, item);
            continue;
        }
        // wanna delete
        if (state === 'deleted') {
            log$k('item deleted');
            rhys.splice(index, 1);
            continue;
        }
        // wanna update
        /* eslint-disable-next-line no-use-before-define */
        mergeItem(rhys[index], item);
    }
    return rhys;
}
function mergeItem(rhys, item) {
    log$k('merge()');
    if (rhys === item) {
        return rhys;
    }
    if (!isPartialableItem(item)) {
        return item;
    }
    const { state } = item;
    if (state === 'full') {
        return item;
    }
    if (state === 'deleted') {
        return null;
    }
    if (state !== 'partial') {
        log$k(`Error: unknown item state. ${state}`);
        log$k('use merge policy as "partial"');
    }
    for (const key in item) {
        if (hasOwn(item, key)) {
            const value = item[key];
            const current = rhys[key];
            log$k('item key: %s value: %o -> %o', key, current, value);
            rhys[key] = isArray$1(value)
                ? mergeItemList(current, value)
                : isItem(value)
                    ? mergeItem(current, value)
                    : value;
        }
    }
    return rhys;
}

const log$l = debug('MN:Information');
function createInformation(data, context) {
    const events = createEvents(log$l);
    const { api } = context;
    function createdata(datakey) {
        return new Proxy({}, {
            get(target, key) {
                const delegate = data[datakey];
                return delegate && Reflect.get(delegate, key);
            },
        });
    }
    // create information parts
    const description = createDescription(createdata('conference-description'), context);
    const state = createState(createdata('conference-state'));
    const view = createView(createdata('conference-view'), context);
    const users = createUsers(createdata('users'), context);
    const rtmp = createRTMP(createdata('rtmp-state'), context);
    const record = createRecord(createdata('record-users'), context);
    let information;
    function update(val) {
        log$l('update()');
        const { version } = data;
        const { version: newVersion, state: newState } = val;
        if (!newVersion) {
            log$l('receive information without version.');
            return;
        }
        if (newVersion <= version) {
            log$l('receive information with invalid version.');
            return;
        }
        if (newVersion - version > 1) {
            log$l('information version jumped.');
            api
                .request('getFullInfo')
                .send()
                .then((response) => update(response.data.data))
                .catch((error) => log$l('get full information failed: %o', error));
            return;
        }
        if (newState === 'deleted') {
            log$l('can not delete root information.');
            return;
        }
        if (newState === 'full') {
            // hack item state
            // as we want to keep 'data' reference to the same object
            // otherwise we need to re-create all information parts
            Object.assign(data, val);
        }
        else {
            mergeItem(data, val);
        }
        // update & prepare all parts
        [
            {
                key: 'conference-description',
                part: description,
            },
            {
                key: 'conference-state',
                part: state,
            },
            {
                key: 'conference-view',
                part: view,
            },
            {
                key: 'users',
                part: users,
            },
            {
                key: 'rtmp-state',
                part: rtmp,
            },
            {
                key: 'record-users',
                part: record,
            },
        ].forEach((parts) => {
            const { key, part } = parts;
            if (hasOwn(val, key)) {
                part.update(val[key]);
            }
        });
        events.emit('updated', information);
    }
    return information = {
        ...events,
        get data() {
            return data;
        },
        get version() {
            return data && data.version;
        },
        get(key) {
            return data[key];
        },
        get description() {
            return description;
        },
        get state() {
            return state;
        },
        get view() {
            return view;
        },
        get users() {
            return users;
        },
        get rtmp() {
            return rtmp;
        },
        get record() {
            return record;
        },
        update,
    };
}

/* eslint-disable no-useless-escape */
/* eslint-disable max-len */
const grammar = {
    v: [{
            name: 'version',
            reg: /^(\d*)$/,
        }],
    o: [{
            // NB: sessionId will be a String in most cases because it is huge
            name: 'origin',
            reg: /^(\S*) (\d*) (\d*) (\S*) IP(\d) (\S*)/,
            names: ['username', 'sessionId', 'sessionVersion', 'netType', 'ipVer', 'address'],
            format: '%s %s %d %s IP%d %s',
        }],
    // default parsing of these only (though some of these feel outdated)
    s: [{ name: 'name' }],
    i: [{ name: 'description' }],
    u: [{ name: 'uri' }],
    e: [{ name: 'email' }],
    p: [{ name: 'phone' }],
    z: [{ name: 'timezones' }],
    r: [{ name: 'repeats' }],
    // k: [{}], // outdated thing ignored
    t: [{
            name: 'timing',
            reg: /^(\d*) (\d*)/,
            names: ['start', 'stop'],
            format: '%d %d',
        }],
    c: [{
            name: 'connection',
            reg: /^IN IP(\d) (\S*)/,
            names: ['version', 'ip'],
            format: 'IN IP%d %s',
        }],
    b: [{
            push: 'bandwidth',
            reg: /^(TIAS|AS|CT|RR|RS):(\d*)/,
            names: ['type', 'limit'],
            format: '%s:%s',
        }],
    m: [{
            // NB: special - pushes to session
            // TODO: rtp/fmtp should be filtered by the payloads found here?
            reg: /^(\w*) (\d*) ([\w\/]*)(?: (.*))?/,
            names: ['type', 'port', 'protocol', 'payloads'],
            format: '%s %d %s %s',
        }],
    a: [
        {
            push: 'rtp',
            reg: /^rtpmap:(\d*) ([\w\-\.]*)(?:\s*\/(\d*)(?:\s*\/(\S*))?)?/,
            names: ['payload', 'codec', 'rate', 'encoding'],
            format(o) {
                return (o.encoding)
                    ? 'rtpmap:%d %s/%s/%s'
                    : o.rate
                        ? 'rtpmap:%d %s/%s'
                        : 'rtpmap:%d %s';
            },
        },
        {
            // a=fmtp:111 minptime=10; useinbandfec=1
            push: 'fmtp',
            reg: /^fmtp:(\d*) ([\S| ]*)/,
            names: ['payload', 'config'],
            format: 'fmtp:%d %s',
        },
        {
            name: 'control',
            reg: /^control:(.*)/,
            format: 'control:%s',
        },
        {
            name: 'rtcp',
            reg: /^rtcp:(\d*)(?: (\S*) IP(\d) (\S*))?/,
            names: ['port', 'netType', 'ipVer', 'address'],
            format(o) {
                return (o.address != null)
                    ? 'rtcp:%d %s IP%d %s'
                    : 'rtcp:%d';
            },
        },
        {
            push: 'rtcpFbTrrInt',
            reg: /^rtcp-fb:(\*|\d*) trr-int (\d*)/,
            names: ['payload', 'value'],
            format: 'rtcp-fb:%d trr-int %d',
        },
        {
            push: 'rtcpFb',
            reg: /^rtcp-fb:(\*|\d*) ([\w-_]*)(?: ([\w-_]*))?/,
            names: ['payload', 'type', 'subtype'],
            format(o) {
                return (o.subtype != null)
                    ? 'rtcp-fb:%s %s %s'
                    : 'rtcp-fb:%s %s';
            },
        },
        {
            // a=extmap:1/recvonly URI-gps-string
            push: 'ext',
            reg: /^extmap:(\d+)(?:\/(\w+))? (\S*)(?: (\S*))?/,
            names: ['value', 'direction', 'uri', 'config'],
            format(o) {
                return `extmap:%d${o.direction ? '/%s' : '%v'} %s${o.config ? ' %s' : ''}`;
            },
        },
        {
            push: 'crypto',
            reg: /^crypto:(\d*) ([\w_]*) (\S*)(?: (\S*))?/,
            names: ['id', 'suite', 'config', 'sessionConfig'],
            format(o) {
                return (o.sessionConfig != null)
                    ? 'crypto:%d %s %s %s'
                    : 'crypto:%d %s %s';
            },
        },
        {
            name: 'setup',
            reg: /^setup:(\w*)/,
            format: 'setup:%s',
        },
        {
            name: 'mid',
            reg: /^mid:([^\s]*)/,
            format: 'mid:%s',
        },
        {
            name: 'msid',
            reg: /^msid:(.*)/,
            format: 'msid:%s',
        },
        {
            name: 'ptime',
            reg: /^ptime:(\d*)/,
            format: 'ptime:%d',
        },
        {
            name: 'maxptime',
            reg: /^maxptime:(\d*)/,
            format: 'maxptime:%d',
        },
        {
            name: 'direction',
            reg: /^(sendrecv|recvonly|sendonly|inactive)/,
        },
        {
            name: 'icelite',
            reg: /^(ice-lite)/,
        },
        {
            name: 'iceUfrag',
            reg: /^ice-ufrag:(\S*)/,
            format: 'ice-ufrag:%s',
        },
        {
            name: 'icePwd',
            reg: /^ice-pwd:(\S*)/,
            format: 'ice-pwd:%s',
        },
        {
            name: 'fingerprint',
            reg: /^fingerprint:(\S*) (\S*)/,
            names: ['type', 'hash'],
            format: 'fingerprint:%s %s',
        },
        {
            // a=candidate:1162875081 1 udp 2113937151 192.168.34.75 60017 typ host generation 0 network-id 3 network-cost 10
            // a=candidate:3289912957 2 udp 1845501695 193.84.77.194 60017 typ srflx raddr 192.168.34.75 rport 60017 generation 0 network-id 3 network-cost 10
            // a=candidate:229815620 1 tcp 1518280447 192.168.150.19 60017 typ host tcptype active generation 0 network-id 3 network-cost 10
            // a=candidate:3289912957 2 tcp 1845501695 193.84.77.194 60017 typ srflx raddr 192.168.34.75 rport 60017 tcptype passive generation 0 network-id 3 network-cost 10
            push: 'candidates',
            reg: /^candidate:(\S*) (\d*) (\S*) (\d*) (\S*) (\d*) typ (\S*)(?: raddr (\S*) rport (\d*))?(?: tcptype (\S*))?(?: generation (\d*))?(?: network-id (\d*))?(?: network-cost (\d*))?/,
            names: ['foundation', 'component', 'transport', 'priority', 'ip', 'port', 'type', 'raddr', 'rport', 'tcptype', 'generation', 'network-id', 'network-cost'],
            format(o) {
                let str = 'candidate:%s %d %s %d %s %d typ %s';
                str += (o.raddr != null) ? ' raddr %s rport %d' : '%v%v';
                // NB: candidate has three optional chunks, so %void middles one if it's missing
                str += (o.tcptype != null) ? ' tcptype %s' : '%v';
                if (o.generation != null) {
                    str += ' generation %d';
                }
                str += (o['network-id'] != null) ? ' network-id %d' : '%v';
                str += (o['network-cost'] != null) ? ' network-cost %d' : '%v';
                return str;
            },
        },
        {
            name: 'endOfCandidates',
            reg: /^(end-of-candidates)/,
        },
        {
            name: 'remoteCandidates',
            reg: /^remote-candidates:(.*)/,
            format: 'remote-candidates:%s',
        },
        {
            name: 'iceOptions',
            reg: /^ice-options:(\S*)/,
            format: 'ice-options:%s',
        },
        {
            push: 'ssrcs',
            reg: /^ssrc:(\d*) ([\w_-]*)(?::(.*))?/,
            names: ['id', 'attribute', 'value'],
            format(o) {
                let str = 'ssrc:%d';
                if (o.attribute != null) {
                    str += ' %s';
                    if (o.value != null) {
                        str += ':%s';
                    }
                }
                return str;
            },
        },
        {
            // a=ssrc-group:FEC-FR 3004364195 1080772241
            push: 'ssrcGroups',
            // token-char = %x21 / %x23-27 / %x2A-2B / %x2D-2E / %x30-39 / %x41-5A / %x5E-7E
            reg: /^ssrc-group:([\x21\x23\x24\x25\x26\x27\x2A\x2B\x2D\x2E\w]*) (.*)/,
            names: ['semantics', 'ssrcs'],
            format: 'ssrc-group:%s %s',
        },
        {
            name: 'msidSemantic',
            reg: /^msid-semantic:\s?(\w*) (\S*)/,
            names: ['semantic', 'token'],
            format: 'msid-semantic: %s %s',
        },
        {
            push: 'groups',
            reg: /^group:(\w*) (.*)/,
            names: ['type', 'mids'],
            format: 'group:%s %s',
        },
        {
            name: 'rtcpMux',
            reg: /^(rtcp-mux)/,
        },
        {
            name: 'rtcpRsize',
            reg: /^(rtcp-rsize)/,
        },
        {
            name: 'sctpmap',
            reg: /^sctpmap:([\w_\/]*) (\S*)(?: (\S*))?/,
            names: ['sctpmapNumber', 'app', 'maxMessageSize'],
            format(o) {
                return (o.maxMessageSize != null)
                    ? 'sctpmap:%s %s %s'
                    : 'sctpmap:%s %s';
            },
        },
        {
            name: 'xGoogleFlag',
            reg: /^x-google-flag:([^\s]*)/,
            format: 'x-google-flag:%s',
        },
        {
            name: 'content',
            reg: /^content:([^\s]*)/,
            format: 'content:%s',
        },
        {
            name: 'label',
            reg: /^label:([\d]*)/,
            format: 'label:%d',
        },
        {
            push: 'rids',
            reg: /^rid:([\d\w]+) (\w+)(?: ([\S| ]*))?/,
            names: ['id', 'direction', 'params'],
            format(o) {
                return (o.params) ? 'rid:%s %s %s' : 'rid:%s %s';
            },
        },
        {
            // a=imageattr:* send [x=800,y=640] recv *
            // a=imageattr:100 recv [x=320,y=240]
            push: 'imageattrs',
            reg: new RegExp(
            // a=imageattr:97
            '^imageattr:(\\d+|\\*)'
                // send [x=800,y=640,sar=1.1,q=0.6] [x=480,y=320]
                + '[\\s\\t]+(send|recv)[\\s\\t]+(\\*|\\[\\S+\\](?:[\\s\\t]+\\[\\S+\\])*)'
                // recv [x=330,y=250]
                + '(?:[\\s\\t]+(recv|send)[\\s\\t]+(\\*|\\[\\S+\\](?:[\\s\\t]+\\[\\S+\\])*))?'),
            names: ['pt', 'dir1', 'attrs1', 'dir2', 'attrs2'],
            format(o) {
                return `imageattr:%s %s %s${o.dir2 ? ' %s %s' : ''}`;
            },
        },
        {
            // a=simulcast:recv 1;4,5 send 6;7
            name: 'simulcast',
            reg: new RegExp(
            // a=simulcast:
            '^simulcast:'
                // send 1,2,3;~4,~5
                + '(send|recv) ([a-zA-Z0-9\\-_~;,]+)'
                // space + recv 6;~7,~8
                + '(?:\\s?(send|recv) ([a-zA-Z0-9\\-_~;,]+))?'
                // end
                + '$'),
            names: ['dir1', 'list1', 'dir2', 'list2'],
            format(o) {
                return `simulcast:%s %s${o.dir2 ? ' %s %s' : ''}`;
            },
        },
        {
            //  https://tools.ietf.org/html/draft-ietf-mmusic-sdp-simulcast-03
            // a=simulcast: recv pt=97;98 send pt=97
            // a=simulcast: send rid=5;6;7 paused=6,7
            name: 'simulcast_03',
            reg: /^simulcast:[\s\t]+([\S+\s\t]+)$/,
            names: ['value'],
            format: 'simulcast: %s',
        },
        {
            // a=framerate:25
            // a=framerate:29.97
            name: 'framerate',
            reg: /^framerate:(\d+(?:$|\.\d+))/,
            format: 'framerate:%s',
        },
        {
            // a=source-filter: incl IN IP4 239.5.2.31 10.1.15.5
            name: 'sourceFilter',
            reg: /^source-filter: *(excl|incl) (\S*) (IP4|IP6|\*) (\S*) (.*)/,
            names: ['filterMode', 'netType', 'addressTypes', 'destAddress', 'srcList'],
            format: 'source-filter: %s %s %s %s %s',
        },
        {
            push: 'invalid',
            names: ['value'],
        },
    ],
};
// set sensible defaults to avoid polluting the grammar with boring details
Object.keys(grammar).forEach((key) => {
    const objs = grammar[key];
    objs.forEach((obj) => {
        if (!obj.reg) {
            obj.reg = /(.*)/;
        }
        if (!obj.format) {
            obj.format = '%s';
        }
    });
});

/* eslint-disable no-useless-escape */
function toIntIfInt(v) {
    return String(Number(v)) === v ? Number(v) : v;
}
function attachProperties(match, location, names, rawName) {
    if (rawName && !names) {
        location[rawName] = toIntIfInt(match[1]);
    }
    else {
        for (let i = 0; i < names.length; i += 1) {
            if (match[i + 1] != null) {
                location[names[i]] = toIntIfInt(match[i + 1]);
            }
        }
    }
}
function parseReg(obj, location, content) {
    const needsBlank = obj.name && obj.names;
    if (obj.push && !location[obj.push]) {
        location[obj.push] = [];
    }
    else if (needsBlank && !location[obj.name]) {
        location[obj.name] = {};
    }
    const keyLocation = obj.push
        ? {} // blank object that will be pushed
        : needsBlank ? location[obj.name] : location; // otherwise, named location or root
    attachProperties(content.match(obj.reg), keyLocation, obj.names, obj.name);
    if (obj.push) {
        location[obj.push].push(keyLocation);
    }
}
const validLine = RegExp.prototype.test.bind(/^([a-z])=(.*)/);
function parse(sdp) {
    const media = [];
    const session = { media };
    let location = session; // points at where properties go under (one of the above)
    // parse lines we understand
    sdp.split(/(\r\n|\r|\n)/).filter(validLine)
        .forEach((l) => {
        const type = l[0];
        const content = l.slice(2);
        if (type === 'm') {
            media.push({ rtp: [], fmtp: [] });
            location = media[media.length - 1]; // point at latest media line
        }
        for (let j = 0; j < (grammar[type] || []).length; j += 1) {
            const obj = grammar[type][j];
            if (obj.reg.test(content)) {
                parseReg(obj, location, content);
                return;
            }
        }
    });
    session.media = media; // link it up
    return session;
}
function paramReducer(acc, expr) {
    const s = expr.split(/=(.+)/, 2);
    if (s.length === 2) {
        acc[s[0]] = toIntIfInt(s[1]);
    }
    return acc;
}
function parseParams(str) {
    return str.split(/\;\s?/).reduce(paramReducer, {});
}
// For backward compatibility - alias will be removed in 3.0.0
const parseFmtpConfig = parseParams;
function parsePayloads(str) {
    return str.split(' ').map(Number);
}
function parseRemoteCandidates(str) {
    const candidates = [];
    const parts = str.split(' ').map(toIntIfInt);
    for (let i = 0; i < parts.length; i += 3) {
        candidates.push({
            component: parts[i],
            ip: parts[i + 1],
            port: parts[i + 2],
        });
    }
    return candidates;
}
function parseImageAttributes(str) {
    return str.split(' ').map((item) => {
        return item.substring(1, item.length - 1).split(',')
            .reduce(paramReducer, {});
    });
}
function parseSimulcastStreamList(str) {
    return str.split(';').map((stream) => {
        return stream.split(',').map((format) => {
            let scid;
            let paused = false;
            if (format[0] !== '~') {
                scid = toIntIfInt(format);
            }
            else {
                scid = toIntIfInt(format.substring(1, format.length));
                paused = true;
            }
            return {
                scid,
                paused,
            };
        });
    });
}

// customized util.format - discards excess arguments and can void middle ones
const formatRegExp = /%[sdv%]/g;
const format = function (formatStr, ...args) {
    let i = 0;
    const len = args.length;
    return formatStr.replace(formatRegExp, (x) => {
        if (i >= len) {
            return x; // missing argument
        }
        const arg = args[i];
        i += 1;
        switch (x) {
            case '%%':
                return '%';
            case '%s':
                return String(arg);
            case '%d':
                return Number(arg);
            case '%v':
                return '';
            default:
                return arg;
        }
    });
    // NB: we discard excess arguments - they are typically undefined from makeLine
};
const makeLine = function (type, obj, location) {
    const str = obj.format instanceof Function
        ? (obj.format(obj.push ? location : location[obj.name]))
        : obj.format;
    const formatStr = `${type}=${str}`;
    const args = [];
    if (obj.names) {
        for (let i = 0; i < obj.names.length; i += 1) {
            const n = obj.names[i];
            if (obj.name) {
                args.push(location[obj.name][n]);
            }
            else { // for mLine and push attributes
                args.push(location[obj.names[i]]);
            }
        }
    }
    else {
        args.push(location[obj.name]);
    }
    return format(formatStr, ...args);
};
// RFC specified order
// TODO: extend this with all the rest
const defaultOuterOrder = [
    'v', 'o', 's', 'i',
    'u', 'e', 'p', 'c',
    'b', 't', 'r', 'z', 'a',
];
const defaultInnerOrder = ['i', 'c', 'b', 'a'];
function write(session, opts) {
    opts = opts || {};
    // ensure certain properties exist
    if (session.version == null) {
        session.version = 0; // 'v=0' must be there (only defined version atm)
    }
    if (session.name == null) {
        session.name = ' '; // 's= ' must be there if no meaningful name set
    }
    session.media.forEach((mLine) => {
        if (mLine.payloads == null) {
            mLine.payloads = '';
        }
    });
    const outerOrder = opts.outerOrder || defaultOuterOrder;
    const innerOrder = opts.innerOrder || defaultInnerOrder;
    const sdp = [];
    // loop through outerOrder for matching properties on session
    outerOrder.forEach((type) => {
        grammar[type].forEach((obj) => {
            if (obj.name in session && session[obj.name] != null) {
                sdp.push(makeLine(type, obj, session));
            }
            else if (obj.push in session && session[obj.push] != null) {
                session[obj.push].forEach((el) => {
                    sdp.push(makeLine(type, obj, el));
                });
            }
        });
    });
    // then for each media line, follow the innerOrder
    session.media.forEach((mLine) => {
        sdp.push(makeLine('m', grammar.m[0], mLine));
        innerOrder.forEach((type) => {
            grammar[type].forEach((obj) => {
                if (obj.name in mLine && mLine[obj.name] != null) {
                    sdp.push(makeLine(type, obj, mLine));
                }
                else if (obj.push in mLine && mLine[obj.push] != null) {
                    mLine[obj.push].forEach((el) => {
                        sdp.push(makeLine(type, obj, el));
                    });
                }
            });
        });
    });
    return `${sdp.join('\r\n')}\r\n`;
}

function closeMediaStream(stream) {
    if (!stream)
        return;
    // Latest spec states that MediaStream has no stop() method and instead must
    // call stop() on every MediaStreamTrack.
    try {
        if (stream.getTracks) {
            stream.getTracks().forEach(track => track.stop());
        }
        else {
            stream.getAudioTracks().forEach(track => track.stop());
            stream.getVideoTracks().forEach(track => track.stop());
        }
    }
    catch (error) {
        // Deprecated by the spec, but still in use.
        // NOTE: In Temasys IE plugin stream.stop is a callable 'object'.
        if (typeof stream.stop === 'function' || typeof stream.stop === 'object') {
            stream.stop();
        }
    }
}

function setup(stream) {
    stream.close = stream.stop = function close() {
        closeMediaStream(this);
    };
    stream.pause = function pause() {
        this.getTracks().forEach(track => track.enabled = false);
    };
    stream.play = function play() {
        this.getTracks().forEach(track => track.enabled = true);
    };
    stream.muteAudio = function muteAudio(mute = true) {
        this.getAudioTracks().forEach(track => track.enabled = !mute);
    };
    stream.muteVideo = function muteVideo(mute = true) {
        this.getVideoTracks().forEach(track => track.enabled = !mute);
    };
    return stream;
}

async function getUserMedia(constraints) {
    let stream;
    if (navigator.mediaDevices.getUserMedia) {
        stream = await navigator.mediaDevices.getUserMedia(constraints);
    }
    else if (navigator.getUserMedia) {
        // support chrome 52
        stream = await new Promise((resolve, reject) => {
            navigator.getUserMedia(constraints, resolve, reject);
        });
    }
    else {
        throw new Error('Not Supported');
    }
    return setup(stream);
}

const MAX_ARCHIVE_SIZE = 10;
function createRTCStats() {
    let quality = -1;
    let inbound = {};
    let outbound = {};
    let archives = [];
    const maxArchiveSize = MAX_ARCHIVE_SIZE;
    let rtcstats;
    function clear() {
        quality = -1;
        inbound = {};
        outbound = {};
        archives = [];
    }
    function update(report) {
        const latestInbound = {};
        const latestOutbound = {};
        let isLegacyStats = false;
        report.forEach((stats) => {
            if (typeof stats.stat === 'function') {
                isLegacyStats = true;
            }
            switch (stats.type) {
                case 'codec':
                    break;
                case 'inbound-rtp':
                    if (!stats.isRemote || stats.isRemote === false) {
                        /* eslint-disable-next-line no-use-before-define */
                        latestInbound[stats.mediaType] = parseRTPStats(report, stats);
                    }
                    break;
                case 'outbound-rtp':
                    if (!stats.isRemote || stats.isRemote === false) {
                        /* eslint-disable-next-line no-use-before-define */
                        latestOutbound[stats.mediaType] = parseRTPStats(report, stats);
                    }
                    break;
                // case 'remote-inbound-rtp':
                //   break;
                // case 'remote-outbound-rtp':
                //   break;
                // case 'csrc':
                //   break;
                // case 'peer-connection':
                //   break;
                // case 'data-channel':
                //   break;
                // case 'stream':
                //   break;
                // case 'track':
                //   break;
                // case 'sender':
                //   break;
                // case 'receiver':
                //   break;
                // case 'transport':
                //   break;
                // case 'candidate-pair':
                //   break;
                // case 'local-candidate':
                //   break;
                // case 'remote-candidate':
                //   break;
                // case 'certificate':
                //   break;
                case 'ssrc':
                    /* eslint-disable-next-line no-use-before-define */
                    parseSSRCStats(report, stats, isLegacyStats);
                    if (/recv/g.test(stats.id)) {
                        latestInbound[stats.mediaType] = stats;
                    }
                    if (/send/g.test(stats.id)) {
                        latestOutbound[stats.mediaType] = stats;
                    }
                    break;
            }
        });
        /* eslint-disable-next-line no-use-before-define */
        updateRTPStats(latestInbound.audio, 'inbound');
        /* eslint-disable-next-line no-use-before-define */
        updateRTPStats(latestInbound.video, 'inbound');
        /* eslint-disable-next-line no-use-before-define */
        updateRTPStats(latestOutbound.audio, 'outbound');
        /* eslint-disable-next-line no-use-before-define */
        updateRTPStats(latestOutbound.video, 'outbound');
        let totalPacketsLostRate = 0;
        let totalChannel = 0;
        if (inbound.audio) {
            totalChannel++;
            totalPacketsLostRate += inbound.audio.packetsLostRate || 0;
        }
        if (inbound.video) {
            totalChannel++;
            totalPacketsLostRate += inbound.video.packetsLostRate || 0;
        }
        if (totalChannel) {
            const average = totalPacketsLostRate / totalChannel;
            quality = average >= 12 ? 0
                : average >= 5 ? 1
                    : average >= 3 ? 2
                        : average >= 2 ? 3
                            : 4;
        }
        /* eslint-disable-next-line no-use-before-define */
        archive();
    }
    function parseRTPStats(report, stats) {
        const codec = report.get(stats.codecId);
        const track = report.get(stats.trackId);
        const transport = report.get(stats.transportId);
        const remote = report.get(stats.remoteId);
        if (codec) {
            codec.name = codec.mimeType.split('/')[1];
        }
        if (!stats.codecId || !stats.trackId || !stats.transportId) ;
        if (transport) {
            const localCertificate = report.get(transport.localCertificateId);
            const remoteCertificate = report.get(transport.remoteCertificateId);
            const selectedCandidatePair = report.get(transport.selectedCandidatePairId);
            transport.localCertificate = localCertificate;
            transport.remoteCertificate = remoteCertificate;
            transport.selectedCandidatePair = selectedCandidatePair;
        }
        if (remote) {
            stats.packetsLost = remote.packetsLost || stats.packetsLost;
        }
        stats.codec = codec;
        stats.track = track;
        stats.transport = transport;
        return stats;
    }
    function parseSSRCStats(report, stats, isLegacyStats = false) {
        if (isLegacyStats) {
            stats.mediaType = stats.stat('mediaType');
            stats.googCodecName = stats.stat('googCodecName');
            stats.codecImplementationName = stats.stat('codecImplementationName');
            stats.googFrameHeightReceived = stats.stat('googFrameHeightReceived');
            stats.googFrameHeightSent = stats.stat('googFrameHeightSent');
            stats.googFrameWidthReceived = stats.stat('googFrameWidthReceived');
            stats.googFrameWidthSent = stats.stat('googFrameWidthSent');
            stats.googFrameRateReceived = stats.stat('googFrameRateReceived');
            stats.googFrameRateSent = stats.stat('googFrameRateSent');
            stats.packetsLost = stats.stat('packetsLost');
            stats.packetsSent = stats.stat('packetsSent');
            stats.packetsReceived = stats.stat('packetsReceived');
            stats.bytesSent = stats.stat('bytesSent');
            stats.bytesReceived = stats.stat('bytesReceived');
        }
        const codec = {
            name: stats.googCodecName,
            implementationName: stats.codecImplementationName,
        };
        const track = {
            frameHeight: stats.googFrameHeightReceived || stats.googFrameHeightSent,
            frameWidth: stats.googFrameWidthReceived || stats.googFrameWidthSent,
            frameRate: stats.googFrameRateReceived || stats.googFrameRateSent,
        };
        stats.codec = codec;
        stats.track = track;
        return stats;
    }
    function updateRTPStats(stats, direction) {
        if (!stats) {
            return;
        }
        const prestats = rtcstats[direction][stats.mediaType];
        const diff = (x = {}, y = {}, key) => {
            if (typeof x[key] !== 'undefined' && typeof y[key] !== 'undefined') {
                return Math.abs(x[key] - y[key]);
            }
            return 0;
        };
        const safe = (x) => {
            if (!Number.isFinite(x)) {
                return 0;
            }
            if (Number.isNaN(x)) {
                return 0;
            }
            return x;
        };
        if (prestats) {
            if (prestats.trackId ? Boolean(stats.trackId) : true) {
                const timeDiff = diff(stats, prestats, 'timestamp');
                let valueDiff;
                // calc packetsLostRate
                if (direction === 'outbound' && !stats.packetsLostRate) {
                    /* eslint-disable-next-line no-use-before-define */
                    const archived = getArchive()[direction][stats.mediaType];
                    const lostDiff = diff(stats, archived, 'packetsLost');
                    const sentDiff = diff(stats, archived, 'packetsSent');
                    const totalPackets = lostDiff + sentDiff;
                    stats.packetsLostRate = totalPackets === 0 ? 0 : safe(lostDiff / totalPackets);
                    stats.packetsLostRate *= 100;
                }
                if (direction === 'inbound' && !stats.packetsLostRate) {
                    /* eslint-disable-next-line no-use-before-define */
                    const archived = getArchive()[direction][stats.mediaType];
                    const lostDiff = diff(stats, archived, 'packetsLost');
                    const receivedDiff = diff(stats, archived, 'packetsReceived');
                    const totalPackets = lostDiff + receivedDiff;
                    stats.packetsLostRate = totalPackets === 0 ? 0 : safe(lostDiff / totalPackets);
                    stats.packetsLostRate *= 100;
                }
                // calc outgoingBitrate
                if (direction === 'outbound' && !stats.outgoingBitrate) {
                    valueDiff = diff(stats, prestats, 'bytesSent');
                    stats.outgoingBitrate = safe(valueDiff * 8 / timeDiff);
                }
                // calc incomingBitrate
                if (direction === 'inbound' && !stats.incomingBitrate) {
                    valueDiff = diff(stats, prestats, 'bytesReceived');
                    stats.incomingBitrate = safe(valueDiff * 8 / timeDiff);
                }
                // calc transport outgoingBitrate
                if (stats.transport && prestats.transport && !stats.transport.outgoingBitrate) {
                    valueDiff = diff(stats.transport, prestats.transport, 'bytesSent');
                    stats.transport.outgoingBitrate = safe(valueDiff * 8 / timeDiff);
                }
                // calc transport incomingBitrate
                if (stats.transport && prestats.transport && !stats.transport.incomingBitrate) {
                    valueDiff = diff(stats.transport, prestats.transport, 'bytesReceived');
                    stats.transport.incomingBitrate = safe(valueDiff * 8 / timeDiff);
                }
                // calc frameRate
                if (stats.mediaType === 'video' && stats.track && prestats.track && !stats.track.frameRate) {
                    if (direction === 'inbound') {
                        valueDiff = diff(stats.track, prestats.track, 'framesReceived');
                    }
                    if (direction === 'outbound') {
                        valueDiff = diff(stats.track, prestats.track, 'framesSent');
                    }
                    stats.track.frameRate = valueDiff ? safe(valueDiff / timeDiff * 1000) : 0;
                }
                rtcstats[direction][stats.mediaType] = stats;
            }
        }
        else {
            rtcstats[direction][stats.mediaType] = stats;
        }
    }
    function archive() {
        if (archives.length === maxArchiveSize) {
            archives.shift();
        }
        archives.push({
            quality,
            inbound,
            outbound,
        });
    }
    function getArchive(index = 0) {
        const { length } = archives;
        index = Math.max(index, 0);
        index = Math.min(index, length - 1);
        return archives[index];
    }
    return rtcstats = {
        get quality() {
            return quality;
        },
        get inbound() {
            return inbound;
        },
        get outbound() {
            return outbound;
        },
        update,
        clear,
    };
}

const log$m = debug('MN:Channel');
const browser$1 = getBrowser();
var STATUS;
(function (STATUS) {
    STATUS[STATUS["kNull"] = 0] = "kNull";
    STATUS[STATUS["kProgress"] = 1] = "kProgress";
    STATUS[STATUS["kOffered"] = 2] = "kOffered";
    STATUS[STATUS["kAnswered"] = 3] = "kAnswered";
    STATUS[STATUS["kAccepted"] = 4] = "kAccepted";
    STATUS[STATUS["kCanceled"] = 5] = "kCanceled";
    STATUS[STATUS["kTerminated"] = 6] = "kTerminated";
})(STATUS || (STATUS = {}));
/**
 * Local variables.
 */
const holdMediaTypes = ['audio', 'video'];
function createChannel(config) {
    const { invite, confirm, cancel, bye, } = config;
    const events = createEvents(log$m);
    // The RTCPeerConnection instance (public attribute).
    let connection;
    let status = STATUS.kNull;
    let canceled = false;
    const rtcStats = createRTCStats();
    // Default rtcOfferConstraints(passed in connect()).
    let rtcConstraints;
    let rtcOfferConstraints;
    // Local MediaStream.
    let localMediaStream;
    let localMediaStreamLocallyGenerated = false;
    // Flag to indicate PeerConnection ready for new actions.
    let rtcReady = false;
    // Mute/Hold state.
    let audioMuted = false;
    let videoMuted = false;
    let localHold = false;
    // there is no in dialog sdp offer, so remote hold is alway false
    const remoteHold = false;
    function throwIfStatus(condition, message) {
        if (status !== condition)
            return;
        throw new Error(message || 'Invalid State');
    }
    function throwIfNotStatus(condition, message) {
        if (status === condition)
            return;
        throw new Error(message || 'Invalid State');
    }
    function throwIfTerminated() {
        const message = 'Terminated';
        if (canceled)
            throw new Error(message);
        throwIfStatus(STATUS.kTerminated, message);
    }
    function isInProgress() {
        switch (status) {
            case STATUS.kProgress:
            case STATUS.kOffered:
            case STATUS.kAnswered:
                return true;
            default:
                return false;
        }
    }
    function isEstablished() {
        return status === STATUS.kAccepted;
    }
    function isEnded() {
        switch (status) {
            case STATUS.kCanceled:
            case STATUS.kTerminated:
                return true;
            default:
                return false;
        }
    }
    function getMute() {
        return {
            audio: audioMuted,
            video: videoMuted,
        };
    }
    function getHold() {
        return {
            local: localHold,
            remote: remoteHold,
        };
    }
    function createRTCConnection(rtcConstraints) {
        log$m('createRTCConnection()');
        /* tslint:disable */
        connection = new RTCPeerConnection(rtcConstraints);
        connection.addEventListener('iceconnectionstatechange', () => {
            if (!connection)
                return;
            const { iceConnectionState: state, } = connection;
            if (state === 'failed') {
                events.emit('peerconnection:connectionfailed');
                /* eslint-disable-next-line no-use-before-define */
                terminate('RTP Timeout');
            }
        });
        events.emit('peerconnection', connection);
    }
    async function createLocalDescription(type, constraints) {
        log$m('createLocalDescription()');
        rtcReady = false;
        let desc;
        if (type === 'offer') {
            try {
                desc = await connection.createOffer(constraints);
            }
            catch (error) {
                log$m('createOffer failed: %o', error);
                events.emit('peerconnection:createofferfailed', error);
                throw error;
            }
        }
        else if (type === 'answer') {
            try {
                desc = await connection.createAnswer(constraints);
            }
            catch (error) {
                log$m('createAnswer failed: %o', error);
                events.emit('peerconnection:createanswerfailed', error);
                throw error;
            }
        }
        else {
            throw new TypeError('Invalid Type');
        }
        try {
            await connection.setLocalDescription(desc);
        }
        catch (error) {
            log$m('setLocalDescription failed: %o', error);
            rtcReady = true;
            events.emit('peerconnection:setlocaldescriptionfailed', error);
            throw error;
        }
        await new Promise((resolve) => {
            // When remote fingerprint is changed, setRemoteDescription will not restart ice immediately,
            // and iceGatheringState stay complete for a while.
            // We will get a local sdp without ip candidates, if resolve right away.
            // if (type === 'offer' && connection.iceGatheringState === 'complete')
            // Resolve right away if 'pc.iceGatheringState' is 'complete'.
            if (connection.iceGatheringState === 'complete') {
                resolve();
                return;
            }
            let finished = false;
            let listener;
            const ready = () => {
                connection.removeEventListener('icecandidate', listener);
                finished = true;
                resolve();
            };
            connection.addEventListener('icecandidate', listener = (event) => {
                const { candidate } = event;
                if (candidate) {
                    events.emit('icecandidate', {
                        candidate,
                        ready,
                    });
                }
                else if (!finished) {
                    ready();
                }
            });
        });
        rtcReady = true;
        const { sdp } = connection.localDescription;
        desc = {
            originator: 'local',
            type,
            sdp,
        };
        events.emit('sdp', desc);
        return desc.sdp;
    }
    async function connect(options = {}) {
        log$m('connect()');
        throwIfNotStatus(STATUS.kNull);
        if (!window.RTCPeerConnection) {
            throw new Error('WebRTC not supported');
        }
        status = STATUS.kProgress;
        /* eslint-disable-next-line no-use-before-define */
        onProgress('local');
        events.emit('connecting');
        ({
            rtcConstraints = {
                sdpSemantics: 'plan-b',
                iceServers: [{ urls: 'stun:stun.l.google.com:19302' }],
            },
            rtcOfferConstraints = {
                offerToReceiveAudio: true,
                offerToReceiveVideo: true,
            },
        } = options);
        const { mediaStream, mediaConstraints = {
            audio: true,
            video: true,
        }, } = options;
        createRTCConnection(rtcConstraints);
        if (mediaStream) {
            localMediaStream = mediaStream;
            localMediaStreamLocallyGenerated = false;
        }
        else if (mediaConstraints.audio || mediaConstraints.video) {
            localMediaStream = await getUserMedia(mediaConstraints)
                .catch((error) => {
                /* eslint-disable-next-line no-use-before-define */
                onFailed('local', 'User Denied Media Access');
                log$m('getusermedia failed: %o', error);
                throw error;
            });
            localMediaStreamLocallyGenerated = true;
        }
        throwIfTerminated();
        if (localMediaStream) {
            localMediaStream.getTracks().forEach((track) => {
                connection.addTrack(track, localMediaStream);
            });
        }
        const localSDP = await createLocalDescription('offer', rtcOfferConstraints)
            .catch((error) => {
            /* eslint-disable-next-line no-use-before-define */
            onFailed('local', 'WebRTC Error');
            log$m('createOff|setLocalDescription failed: %o', error);
            throw error;
        });
        throwIfTerminated();
        status = STATUS.kOffered;
        let answer;
        try {
            answer = await invite({ sdp: localSDP });
        }
        catch (error) {
            /* eslint-disable-next-line no-use-before-define */
            onFailed('local', 'Request Error');
            log$m('invite failed: %o', error);
            throw error;
        }
        throwIfTerminated();
        status = STATUS.kAnswered;
        const { sdp: remoteSDP, } = answer;
        const desc = {
            originator: 'remote',
            type: 'answer',
            sdp: remoteSDP,
        };
        events.emit('sdp', desc);
        if (connection.signalingState === 'stable') {
            try {
                const offer = await connection.createOffer();
                await connection.setLocalDescription(offer);
            }
            catch (error) {
                /* eslint-disable-next-line no-use-before-define */
                onFailed('local', 'WebRTC Error');
                log$m('createOff|setLocalDescription failed: %o', error);
                await bye();
                throw error;
            }
        }
        try {
            await connection.setRemoteDescription({
                type: 'answer',
                sdp: desc.sdp,
            });
        }
        catch (error) {
            /* eslint-disable-next-line no-use-before-define */
            onFailed('local', 'Bad Media Description');
            events.emit('peerconnection:setremotedescriptionfailed', error);
            log$m('setRemoteDescription failed: %o', error);
            await bye();
            throw error;
        }
        try {
            await confirm();
        }
        catch (error) {
            /* eslint-disable-next-line no-use-before-define */
            onFailed('local', 'Request Error');
            log$m('confirm failed: %o', error);
            throw error;
        }
        status = STATUS.kAccepted;
        /* eslint-disable-next-line no-use-before-define */
        onAccepted('local');
        events.emit('connected');
    }
    async function terminate(reason) {
        log$m('terminate()');
        switch (status) {
            case STATUS.kNull:
            case STATUS.kTerminated:
                // nothing to do
                break;
            case STATUS.kProgress:
            case STATUS.kOffered:
                log$m('canceling channel');
                if (status === STATUS.kOffered) {
                    await cancel(reason);
                }
                else {
                    canceled = true;
                }
                status = STATUS.kCanceled;
                /* eslint-disable-next-line no-use-before-define */
                onFailed('local', 'Canceled');
                break;
            case STATUS.kAnswered:
            case STATUS.kAccepted:
                await bye(reason);
                /* eslint-disable-next-line no-use-before-define */
                onEnded('local', 'Terminated');
                break;
        }
    }
    function close() {
        log$m('close()');
        if (status === STATUS.kTerminated)
            return;
        if (connection) {
            try {
                connection.close();
                connection = undefined;
            }
            catch (error) {
                log$m('error closing RTCPeerConnection %o', error);
            }
        }
        if (localMediaStream && localMediaStreamLocallyGenerated) {
            closeMediaStream(localMediaStream);
        }
        localMediaStream = undefined;
        localMediaStreamLocallyGenerated = false;
        rtcStats.clear();
        status = STATUS.kTerminated;
    }
    function toggleMuteAudio(mute) {
        connection.getSenders().forEach((sender) => {
            if (sender.track && sender.track.kind === 'audio') {
                sender.track.enabled = !mute;
            }
        });
    }
    function toggleMuteVideo(mute) {
        connection.getSenders().forEach((sender) => {
            if (sender.track && sender.track.kind === 'video') {
                sender.track.enabled = !mute;
            }
        });
    }
    function setLocalMediaStatus() {
        let enableAudio = true;
        let enableVideo = true;
        if (localHold || (remoteHold )) {
            enableAudio = false;
            enableVideo = false;
        }
        if (audioMuted) {
            enableAudio = false;
        }
        if (videoMuted) {
            enableVideo = false;
        }
        toggleMuteAudio(!enableAudio);
        toggleMuteVideo(!enableVideo);
    }
    function onProgress(originator, message) {
        log$m('channel progress');
        events.emit('progress', {
            originator,
            message,
        });
    }
    function onAccepted(originator, message) {
        log$m('channel accepted');
        events.emit('accepted', {
            originator,
            message,
        });
    }
    function onEnded(originator, message) {
        log$m('channel ended');
        close();
        events.emit('ended', {
            originator,
            message,
        });
    }
    function onFailed(originator, message) {
        log$m('channel failed');
        close();
        events.emit('failed', {
            originator,
            message,
        });
    }
    function onMute() {
        setLocalMediaStatus();
        events.emit('mute', {
            audio: audioMuted,
            video: videoMuted,
        });
    }
    function onUnMute() {
        setLocalMediaStatus();
        events.emit('unmute', {
            audio: !audioMuted,
            video: !videoMuted,
        });
    }
    function onHold(originator) {
        setLocalMediaStatus();
        events.emit('hold', {
            originator,
            localHold,
            remoteHold,
        });
    }
    function onUnHold(originator) {
        setLocalMediaStatus();
        events.emit('unhold', {
            originator,
            localHold,
            remoteHold,
        });
    }
    function mute(options = { audio: true, video: false }) {
        log$m('mute()');
        let changed = false;
        if (audioMuted === false && options.audio) {
            changed = true;
            audioMuted = true;
        }
        if (videoMuted === false && options.video) {
            changed = true;
            videoMuted = true;
        }
        if (changed) {
            onMute();
        }
    }
    function unmute(options = { audio: true, video: true }) {
        log$m('unmute()');
        let changed = false;
        if (audioMuted === true && options.audio) {
            changed = true;
            audioMuted = false;
        }
        if (videoMuted === true && options.video) {
            changed = true;
            videoMuted = false;
        }
        if (changed) {
            onUnMute();
        }
    }
    async function hold() {
        log$m('unhold()');
        if (localHold) {
            log$m('Already hold');
            return;
        }
        localHold = true;
        onHold('local');
        /* eslint-disable-next-line no-use-before-define */
        await renegotiate();
    }
    async function unhold() {
        log$m('unhold()');
        if (!localHold) {
            log$m('Already unhold');
            return;
        }
        localHold = false;
        onUnHold('local');
        /* eslint-disable-next-line no-use-before-define */
        await renegotiate();
    }
    async function renegotiate(options = {}) {
        log$m('renegotiate()');
        if (!rtcReady) {
            log$m('RTC not ready');
            return;
        }
        const localSDP = await createLocalDescription('offer', rtcOfferConstraints);
        /* eslint-disable-next-line no-use-before-define */
        const answer = await invite({ sdp: mangleOffer(localSDP) });
        const desc = {
            originator: 'remote',
            type: 'answer',
            sdp: answer.sdp,
        };
        events.emit('sdp', desc);
        try {
            connection.setRemoteDescription({
                type: 'answer',
                sdp: desc.sdp,
            });
        }
        catch (error) {
            events.emit('peerconnection:setremotedescriptionfailed', error);
            throw error;
        }
    }
    function mangleOffer(offer) {
        log$m('mangleOffer()');
        // nothing to do
        if (!localHold && !remoteHold)
            return offer;
        const sdp = parse(offer);
        // Local hold.
        if (localHold && !remoteHold) {
            for (const m of sdp.media) {
                if (holdMediaTypes.indexOf(m.type) === -1) {
                    continue;
                }
                if (!m.direction) {
                    m.direction = 'sendonly';
                }
                else if (m.direction === 'sendrecv') {
                    m.direction = 'sendonly';
                }
                else if (m.direction === 'recvonly') {
                    m.direction = 'inactive';
                }
            }
            // Local and remote hold.
        }
        else if (localHold && remoteHold) {
            for (const m of sdp.media) {
                if (holdMediaTypes.indexOf(m.type) === -1) {
                    continue;
                }
                m.direction = 'inactive';
            }
            // Remote hold.
        }
        return write(sdp);
    }
    function getRemoteStream() {
        log$m('getRemoteStream()');
        let stream;
        if (connection.getReceivers) {
            stream = new window.MediaStream();
            connection
                .getReceivers()
                .forEach((receiver) => {
                const { track } = receiver;
                if (track) {
                    stream.addTrack(track);
                }
            });
        }
        else if (connection.getRemoteStreams) {
            stream = connection.getRemoteStreams()[0];
        }
        return stream;
    }
    function addLocalStream(stream) {
        log$m('addLocalStream()');
        if (!stream)
            return;
        if (connection.addTrack) {
            stream
                .getTracks()
                .forEach((track) => {
                connection.addTrack(track, stream);
            });
        }
        else if (connection.addStream) {
            connection.addStream(stream);
        }
    }
    function removeLocalStream() {
        log$m('removeLocalStream()');
        if (connection.getSenders && connection.removeTrack) {
            connection.getSenders().forEach((sender) => {
                if (sender.track) {
                    sender.track.stop();
                }
                connection.removeTrack(sender);
            });
        }
        else if (connection.getLocalStreams && connection.removeStream) {
            connection
                .getLocalStreams()
                .forEach((stream) => {
                stream
                    .getTracks()
                    .forEach((track) => {
                    track.stop();
                });
                connection.removeStream(stream);
            });
        }
    }
    function getLocalStream() {
        log$m('getLocalStream()');
        let stream;
        if (connection.getSenders) {
            stream = new window.MediaStream();
            connection
                .getSenders()
                .forEach((sender) => {
                const { track } = sender;
                if (track) {
                    stream.addTrack(track);
                }
            });
        }
        else if (connection.getLocalStreams) {
            stream = connection.getLocalStreams()[0];
        }
        return stream;
    }
    function setLocalStream(stream) {
        removeLocalStream();
        addLocalStream(stream);
    }
    async function replaceLocalStream(stream, renegotiation = false) {
        log$m('replaceLocalStream()');
        const audioTrack = stream ? stream.getAudioTracks()[0] : null;
        const videoTrack = stream ? stream.getVideoTracks()[0] : null;
        const queue = [];
        let renegotiationNeeded = false;
        let peerHasAudio = false;
        let peerHasVideo = false;
        if (connection.getSenders) {
            connection.getSenders().forEach((sender) => {
                if (!sender.track)
                    return;
                peerHasAudio = sender.track.kind === 'audio' || peerHasAudio;
                peerHasVideo = sender.track.kind === 'video' || peerHasVideo;
            });
            renegotiationNeeded = (Boolean(audioTrack) !== peerHasAudio)
                || (Boolean(videoTrack) !== peerHasVideo)
                || renegotiation;
            if (renegotiationNeeded) {
                removeLocalStream();
                addLocalStream(stream);
                queue.push(renegotiate());
            }
            else {
                connection.getSenders().forEach((sender) => {
                    if (!sender.track)
                        return;
                    if (!sender.replaceTrack
                        && !(sender.prototype && sender.prototype.replaceTrack)) {
                        /* eslint-disable-next-line no-use-before-define */
                        shimReplaceTrack(sender);
                    }
                    if (audioTrack && sender.track.kind === 'audio') {
                        queue.push(sender.replaceTrack(audioTrack)
                            .catch((e) => {
                            log$m('replace audio track error: %o', e);
                        }));
                    }
                    if (videoTrack && sender.track.kind === 'video') {
                        queue.push(sender.replaceTrack(videoTrack)
                            .catch((e) => {
                            log$m('replace video track error: %o', e);
                        }));
                    }
                });
            }
        }
        function shimReplaceTrack(sender) {
            sender.replaceTrack = async function replaceTrack(newTrack) {
                connection.removeTrack(sender);
                connection.addTrack(newTrack, stream);
                const offer = await connection.createOffer();
                offer.type = connection.localDescription.type;
                /* eslint-disable-next-line no-use-before-define */
                offer.sdp = replaceSSRCs(connection.localDescription.sdp, offer.sdp);
                await connection.setLocalDescription(offer);
                await connection.setRemoteDescription(connection.remoteDescription);
            };
        }
        await Promise.all(queue);
    }
    function replaceSSRCs(currentDescription, newDescription) {
        let ssrcs = currentDescription.match(/a=ssrc-group:FID (\d+) (\d+)\r\n/);
        let newssrcs = newDescription.match(/a=ssrc-group:FID (\d+) (\d+)\r\n/);
        if (!ssrcs) { // Firefox offers wont have FID yet
            ssrcs = currentDescription.match(/a=ssrc:(\d+) cname:(.*)\r\n/g)[1]
                .match(/a=ssrc:(\d+)/);
            newssrcs = newDescription.match(/a=ssrc:(\d+) cname:(.*)\r\n/g)[1]
                .match(/a=ssrc:(\d+)/);
        }
        for (let i = 1; i < ssrcs.length; i++) {
            newDescription = newDescription.replace(new RegExp(newssrcs[i], 'g'), ssrcs[i]);
        }
        return newDescription;
    }
    async function adjustBandWidth(options) {
        log$m('adjustBandWidth()');
        const { audio, video } = options;
        const queue = [];
        if ('RTCRtpSender' in window
            && 'setParameters' in window.RTCRtpSender.prototype) {
            connection.getSenders().forEach((sender) => {
                if (sender.track)
                    return;
                const parameters = sender.getParameters();
                if (typeof audio !== 'undefined' && sender.track.kind === 'audio') {
                    if (audio === 0) {
                        delete parameters.encodings[0].maxBitrate;
                    }
                    else {
                        parameters.encodings[0].maxBitrate = audio * 1024;
                    }
                    queue.push(sender.setParameters(parameters)
                        .catch((e) => {
                        log$m('apply audio parameters error: %o', e);
                    }));
                }
                if (typeof video !== 'undefined' && sender.track.kind === 'video') {
                    if (video === 0) {
                        delete parameters.encodings[0].maxBitrate;
                    }
                    else {
                        parameters.encodings[0].maxBitrate = video * 1024;
                    }
                    queue.push(sender.setParameters(parameters)
                        .catch((e) => {
                        log$m('apply video parameters error: %o', e);
                    }));
                }
            });
        }
        else {
            // Fallback to the SDP munging with local renegotiation way of limiting
            // the bandwidth.
            queue.push(connection.createOffer()
                .then((offer) => connection.setLocalDescription(offer))
                .then(() => {
                const sdp = parse(connection.remoteDescription.sdp);
                for (const m of sdp.media) {
                    if (typeof audio !== 'undefined' && m.type === 'audio') {
                        if (audio === 0) {
                            m.bandwidth = [];
                        }
                        else {
                            m.bandwidth = [
                                {
                                    type: 'TIAS',
                                    limit: Math.ceil(audio * 1024),
                                },
                            ];
                        }
                    }
                    if (typeof video !== 'undefined' && m.type === 'video') {
                        if (video === 0) {
                            m.bandwidth = [];
                        }
                        else {
                            m.bandwidth = [
                                {
                                    type: 'TIAS',
                                    limit: Math.ceil(video * 1024),
                                },
                            ];
                        }
                    }
                }
                const desc = {
                    type: connection.remoteDescription.type,
                    sdp: write(sdp),
                };
                return connection.setRemoteDescription(desc);
            })
                .catch((e) => {
                log$m('applying bandwidth restriction to setRemoteDescription error: %o', e);
            }));
        }
        await Promise.all(queue);
    }
    async function applyConstraints(options) {
        log$m('applyConstraints()');
        const { audio, video } = options;
        const queue = [];
        if (connection.getSenders && window.MediaStreamTrack.prototype.applyConstraints) {
            connection.getSenders().forEach((sender) => {
                if (audio && sender.track && sender.track.kind === 'audio') {
                    queue.push(sender.track.applyConstraints(audio)
                        .catch((e) => {
                        log$m('apply audio constraints error: %o', e);
                    }));
                }
                if (video && sender.track && sender.track.kind === 'video') {
                    queue.push(sender.track.applyConstraints(video)
                        .catch((e) => {
                        log$m('apply video constraints error: %o', e);
                    }));
                }
            });
        }
        await Promise.all(queue);
    }
    async function getStats() {
        log$m('getStats()');
        if (connection.signalingState === 'stable') {
            let stats;
            // use legacy getStats()
            // the new getStats() won't report 'packetsLost' in 'outbound-rtp'
            if (browser$1.chrome) {
                stats = await new Promise((resolve) => {
                    connection.getStats((stats) => {
                        resolve(stats.result());
                    });
                });
            }
            else {
                stats = await connection.getStats();
            }
            rtcStats.update(stats);
        }
        else {
            log$m('update rtc stats failed since connection is unstable.');
        }
        return rtcStats;
    }
    return {
        ...events,
        get status() {
            return status;
        },
        get connection() {
            return connection;
        },
        isInProgress,
        isEstablished,
        isEnded,
        getMute,
        getHold,
        connect,
        terminate,
        renegotiate,
        mute,
        unmute,
        hold,
        unhold,
        getRemoteStream,
        addLocalStream,
        removeLocalStream,
        getLocalStream,
        setLocalStream,
        replaceLocalStream,
        adjustBandWidth,
        applyConstraints,
        getStats,
    };
}

const log$n = debug('MN:SDP');
const browser$2 = getBrowser();
function createModifier() {
    let content = 'main';
    let width = 1920;
    let height = 1080;
    let frameRate = 30;
    let highFrameRate = false;
    let prefer;
    let unsupport;
    let modifier;
    function build() {
        return (data) => {
            const { originator, type } = data;
            const sdp = parse(data.sdp);
            const maxWidth = width;
            const maxHeight = height;
            const maxFrameRate = frameRate;
            const maxFrameSize = Math.ceil(maxWidth * maxHeight / 255);
            const maxMbps = Math.ceil(maxFrameRate * maxFrameSize);
            let bandwidth = maxHeight >= 1080
                ? 2048
                : maxHeight >= 720
                    ? 1280
                    : maxHeight >= 360
                        ? 512
                        : 512;
            bandwidth = Math.ceil(bandwidth * maxFrameRate / 30); // calc frameRate ratio
            // process sdp
            for (const m of sdp.media) {
                /*
                m.candidates = m.candidates.filter((c) =>
                {
                  return c.component === 1;
                });
                */
                if (m.type === 'video') {
                    m.content = content;
                    m.bandwidth = [
                        {
                            type: 'TIAS',
                            limit: Math.ceil(bandwidth * 1024),
                        },
                    ];
                    const vp8Payloads = new Set();
                    const h264Payloads = new Set();
                    const vp8Config = [`max-fr=${maxFrameRate}`, `max-fs=${maxFrameSize}`];
                    const h264Config = [`max-mbps=${maxMbps}`, `max-fs=${maxFrameSize}`];
                    // find codec payload
                    for (const r of m.rtp) {
                        const codec = r.codec.toUpperCase();
                        let fmtp;
                        switch (codec) {
                            case 'VP8':
                            case 'VP9':
                                vp8Payloads.add(Number(r.payload));
                                fmtp = m.fmtp.find((f) => (f.payload === r.payload));
                                if (fmtp) {
                                    fmtp.config = fmtp.config.split(';')
                                        .filter((p) => { return !(/^max-fr/.test(p) || /^max-fs/.test(p)); })
                                        .concat(vp8Config)
                                        .join(';');
                                }
                                else {
                                    m.fmtp.push({
                                        payload: r.payload,
                                        config: vp8Config.join(';'),
                                    });
                                }
                                break;
                            case 'H264':
                                h264Payloads.add(Number(r.payload));
                                fmtp = m.fmtp.find((f) => (f.payload === r.payload));
                                if (fmtp) {
                                    if (highFrameRate
                                        && fmtp.config.indexOf('profile-level-id=42e01f') !== -1
                                        && originator === 'local'
                                        && type === 'offer') {
                                        fmtp.config = fmtp.config.split(';')
                                            .filter((p) => { return !(/^max-mbps/.test(p) || /^max-fs/.test(p) || /^profile-level-id/.test(p)); })
                                            .concat(['profile-level-id=64001f'])
                                            .concat(h264Config)
                                            .join(';');
                                    }
                                    else if (highFrameRate
                                        && fmtp.config.indexOf('profile-level-id=64001f') !== -1
                                        && originator === 'remote'
                                        && type === 'answer') {
                                        fmtp.config = fmtp.config.split(';')
                                            .filter((p) => { return !(/^max-mbps/.test(p) || /^max-fs/.test(p) || /^profile-level-id/.test(p)); })
                                            .concat(['profile-level-id=42e01f'])
                                            .concat(h264Config)
                                            .join(';');
                                    }
                                    else {
                                        fmtp.config = fmtp.config.split(';')
                                            .filter((p) => { return !(/^max-mbps/.test(p) || /^max-fs/.test(p)); })
                                            .concat(h264Config)
                                            .join(';');
                                    }
                                }
                                else {
                                    m.fmtp.push({
                                        payload: r.payload,
                                        config: h264Config.join(';'),
                                    });
                                }
                                break;
                        }
                    }
                    for (const f of m.fmtp) {
                        const aptConfig = f.config
                            .split(';')
                            .find((p) => { return /^apt=/.test(p); });
                        if (!aptConfig) {
                            continue;
                        }
                        const apt = aptConfig.split('=')[1];
                        if (vp8Payloads.has(Number(apt))) {
                            vp8Payloads.add(Number(f.payload));
                        }
                        else if (h264Payloads.has(Number(apt))) {
                            h264Payloads.add(Number(f.payload));
                        }
                    }
                    let preferCodec = prefer === 'vp8'
                        ? vp8Payloads
                        : prefer === 'h264'
                            ? h264Payloads
                            : new Set();
                    const unsupportCodec = unsupport === 'vp8'
                        ? vp8Payloads
                        : unsupport === 'h264'
                            ? h264Payloads
                            : new Set();
                    // firefox do not support multiple h264 codec/decode insts
                    // when content sharing or using multiple tab, codec/decode might be error.
                    // and chrome ver58 has a really low resolution in h264 codec when content sharing.
                    // use VP8/VP9 first
                    if (browser$2.firefox
                        || (browser$2.chrome && parseInt(browser$2.version, 10) < 63 && content === 'slides')) {
                        preferCodec = vp8Payloads;
                    }
                    if (!preferCodec.size || !unsupportCodec.size) {
                        let payloads = String(m.payloads).split(' ');
                        payloads = payloads.filter((p) => { return !preferCodec.has(Number(p)); });
                        payloads = payloads.filter((p) => { return !unsupportCodec.has(Number(p)); });
                        payloads = Array.from(preferCodec)
                            .sort((x, y) => (x - y))
                            .concat(payloads);
                        m.rtp = m.rtp.filter((r) => !unsupportCodec.has(Number(r.payload)));
                        m.fmtp = m.fmtp.filter((r) => !unsupportCodec.has(Number(r.payload)));
                        const rtps = [];
                        const fmtps = [];
                        payloads.forEach((p) => {
                            const rtp = m.rtp.find((r) => r.payload === Number(p));
                            const fmtp = m.fmtp.find((f) => f.payload === Number(p));
                            if (rtp)
                                rtps.push(rtp);
                            if (fmtp)
                                fmtps.push(fmtp);
                        });
                        m.rtp = rtps;
                        m.fmtp = fmtps;
                        m.payloads = payloads.join(' ');
                    }
                }
                if (m.type === 'audio') {
                    m.bandwidth = [
                        {
                            type: 'TIAS',
                            limit: Math.ceil(128 * 1024),
                        },
                    ];
                }
            }
            // filter out unsupported application media
            sdp.media = sdp.media.filter((m) => m.type !== 'application' || /TLS/.test(m.protocol));
            if (originator === 'remote') {
                sdp.media.forEach((m) => {
                    const payloads = String(m.payloads).split(' ');
                    if (m.rtcpFb) {
                        const rtcpFb = [];
                        m.rtcpFb.forEach((fb) => {
                            if (fb.payload === '*' || payloads.includes(`${fb.payload}`)) {
                                rtcpFb.push(fb);
                            }
                        });
                        m.rtcpFb = rtcpFb;
                    }
                    if (m.fmtp) {
                        const fmtp = [];
                        m.fmtp.forEach((fm) => {
                            if (fm.payload === '*' || payloads.includes(`${fm.payload}`)) {
                                fmtp.push(fm);
                            }
                        });
                        m.fmtp = fmtp;
                    }
                    if (m.rtp) {
                        const rtp = [];
                        m.rtp.forEach((r) => {
                            if (r.payload === '*' || payloads.includes(`${r.payload}`)) {
                                rtp.push(r);
                            }
                        });
                        m.rtp = rtp;
                    }
                });
                if (type === 'offer' && browser$2.firefox) {
                    sdp.media.forEach((m) => {
                        if (m.mid === undefined) {
                            m.mid = m.type === 'audio'
                                ? 0
                                : m.type === 'video'
                                    ? 1
                                    : m.mid;
                        }
                    });
                }
            }
            data.sdp = write(sdp);
            log$n(`${originator} sdp: \n\n %s \n`, data.sdp);
        };
    }
    return modifier = {
        content(val) {
            content = val;
            return modifier;
        },
        width(val) {
            width = val;
            return modifier;
        },
        height(val) {
            height = val;
            return modifier;
        },
        frameRate(val) {
            frameRate = val;
            return modifier;
        },
        highFrameRate(val) {
            highFrameRate = val;
            return modifier;
        },
        prefer(val) {
            prefer = val;
            return modifier;
        },
        unsupport(val) {
            unsupport = val;
            return modifier;
        },
        build,
    };
}

const log$o = debug('MN:MediaChannel');
function createMediaChannel(config) {
    const { api, type = 'main' } = config;
    let mediaVersion;
    let callId;
    let request;
    let icetimmeout;
    let localstream;
    let remotestream;
    const channel = createChannel({
        invite: async (offer) => {
            log$o('invite()');
            let { sdp } = offer;
            const apiName = mediaVersion
                ? type === 'main'
                    ? 'renegMedia'
                    : 'renegShare'
                : type === 'main'
                    ? 'joinMedia'
                    : 'joinShare';
            request = api
                .request(apiName)
                .data({
                sdp,
                'media-version': mediaVersion,
            });
            const response = await request.send();
            ({
                sdp,
                'media-version': mediaVersion,
                'mcu-callid': callId,
            } = response.data.data);
            log$o('MCU call-id: %s', callId);
            return { sdp };
        },
        confirm: () => {
            log$o('confirm()');
            request = undefined;
            localstream = channel.getLocalStream();
            channel.emit('localstream', localstream);
            // send confirm
        },
        cancel: () => {
            log$o('cancel()');
            request && request.cancel();
        },
        bye: () => {
            log$o('bye()');
            request = undefined;
        },
    });
    channel.on('sdp', createModifier()
        .content(type)
        .prefer('h264')
        .build());
    channel.on('peerconnection', (pc) => {
        pc.addEventListener('connectionstatechange', () => {
            log$o('peerconnection:connectionstatechange : %s', pc.connectionState);
        });
        pc.addEventListener('iceconnectionstatechange', () => {
            log$o('peerconnection:iceconnectionstatechange : %s', pc.iceConnectionState);
        });
        pc.addEventListener('icegatheringstatechange', () => {
            log$o('peerconnection:icegatheringstatechange : %s', pc.iceGatheringState);
        });
        pc.addEventListener('negotiationneeded', () => {
            log$o('peerconnection:negotiationneeded');
        });
        pc.addEventListener('track', (event) => {
            log$o('peerconnection:track: %o', event);
            remotestream = event.streams[0];
            channel.emit('remotestream', remotestream);
        });
        // for old browser(firefox)
        pc.addEventListener('addstream', (event) => {
            log$o('peerconnection:addstream: %o', event);
            remotestream = event.stream;
            channel.emit('remotestream', remotestream);
        });
        pc.addEventListener('removestream', (event) => {
            log$o('peerconnection:removestream: %o', event);
            remotestream = channel.getRemoteStream();
            channel.emit('removestream', remotestream);
        });
    });
    channel.on('icecandidate', (data) => {
        const { candidate, ready } = data;
        if (icetimmeout) {
            clearTimeout(icetimmeout);
            icetimmeout = undefined;
        }
        if (candidate) {
            icetimmeout = setTimeout(() => {
                log$o('ICE gathering timeout in 3 seconds');
                ready();
            }, 3000);
        }
    });
    return {
        ...channel,
        get status() {
            return channel.status;
        },
        get connection() {
            return channel.connection;
        },
        get version() {
            return mediaVersion;
        },
        get callId() {
            return callId;
        },
    };
}

var MessageStatus;
(function (MessageStatus) {
    MessageStatus[MessageStatus["kNull"] = 0] = "kNull";
    MessageStatus[MessageStatus["kSending"] = 1] = "kSending";
    MessageStatus[MessageStatus["kSuccess"] = 2] = "kSuccess";
    MessageStatus[MessageStatus["kFailed"] = 3] = "kFailed";
})(MessageStatus || (MessageStatus = {}));
const log$p = debug('MN:Message');
function createMessage(config) {
    const { api, onSucceeded, onFailed } = config;
    let status = MessageStatus.kNull;
    let direction = 'outgoing';
    let content;
    let timestamp;
    let version;
    /* eslint-disable-next-line prefer-destructuring */
    let sender = config.sender;
    let receiver;
    let isPrivate = false;
    let message;
    let request;
    async function send(message, target) {
        log$p('send()');
        if (direction === 'incoming')
            throw new Error('Invalid Status');
        status = MessageStatus.kSending;
        request = api
            .request('pushMessage')
            .data({
            'im-context': message,
            'user-entity-list': target,
        });
        let response;
        try {
            response = await request.send();
        }
        catch (error) {
            status = MessageStatus.kFailed;
            onFailed && onFailed(message);
            throw error;
        }
        const { data } = response;
        content = message;
        receiver = target;
        ({
            'im-version': version,
            'im-timestamp': timestamp,
        } = data.data);
        status = MessageStatus.kSuccess;
        onSucceeded && onSucceeded(message);
    }
    async function retry() {
        log$p('retry()');
        if (!content)
            throw new Error('Invalid Message');
        await send(content, receiver);
    }
    function cancel() {
        log$p('cancel()');
        if (request) {
            request.cancel();
            request = undefined;
        }
    }
    function incoming(data) {
        direction = 'incoming';
        content = data['im-context'];
        timestamp = data['im-timestamp'];
        version = data['im-version'];
        isPrivate = data['is-private'];
        sender = {
            entity: data['sender-entity'],
            subjectId: data['sender-subject-id'],
            displayText: data['sender-display-text'],
        };
        return message;
    }
    return message = {
        get status() {
            return status;
        },
        get direction() {
            return direction;
        },
        get content() {
            return content;
        },
        get timestamp() {
            return timestamp;
        },
        get version() {
            return version;
        },
        get sender() {
            return sender;
        },
        get receiver() {
            return receiver;
        },
        get private() {
            return (receiver && receiver.length > 0) || isPrivate;
        },
        send,
        retry,
        cancel,
        incoming,
    };
}

const log$q = debug('MN:ChatChannel');
function createChatChannel(config) {
    const { api, sender } = config;
    const events = createEvents(log$q);
    let messages = [];
    let request;
    let ready = false;
    async function connect(count = 2000) {
        log$q('connect()');
        if (ready)
            return;
        request = api.request('pullMessage').data({ count });
        const response = await request.send();
        const { data } = response.data;
        messages = data.imInfos
            .map((msg) => {
            return createMessage({ api }).incoming(msg);
        });
        ready = true;
        events.emit('ready');
        events.emit('connected');
    }
    async function terminate() {
        log$q('terminate()');
        messages = [];
        ready = false;
        if (request) {
            request.cancel();
            request = undefined;
        }
        events.emit('disconnected');
    }
    async function sendMessage(msg, target) {
        log$q('sendMessage()');
        const message = createMessage({ api, sender });
        events.emit('message', {
            originator: 'local',
            message,
        });
        await message.send(msg, target);
        messages.push(message);
        return message;
    }
    function incoming(data) {
        log$q('incoming()');
        const message = createMessage({ api }).incoming(data);
        events.emit('message', {
            originator: 'remote',
            message,
        });
        messages.push(message);
        return message;
    }
    return {
        ...events,
        get ready() {
            return ready;
        },
        connect,
        terminate,
        sendMessage,
        incoming,
    };
}

const log$r = debug('MN:Conference');
const miniprogram = isMiniProgram();
const browser$3 = getBrowser();
(function (STATUS) {
    STATUS[STATUS["kNull"] = 0] = "kNull";
    STATUS[STATUS["kConnecting"] = 1] = "kConnecting";
    STATUS[STATUS["kConnected"] = 2] = "kConnected";
    STATUS[STATUS["kDisconnecting"] = 3] = "kDisconnecting";
    STATUS[STATUS["kDisconnected"] = 4] = "kDisconnected";
})(exports.STATUS || (exports.STATUS = {}));
function createConference(config) {
    const { api } = config;
    const events = createEvents(log$r);
    let keepalive;
    let polling;
    let information;
    let interceptor;
    let conference;
    let mediaChannel;
    let shareChannel;
    let chatChannel;
    let user; // current user
    let status = exports.STATUS.kNull;
    let uuid;
    let userId; // as conference entity
    let url;
    let request; // request chain
    let trtc;
    function getCurrentUser() {
        if (!user) {
            // try to get current user
            user = information.users.getCurrent();
            if (user) {
                events.emit('user', user);
                /* eslint-disable-next-line no-use-before-define */
                user.on('holdChanged', maybeChat);
            }
        }
        return user;
    }
    function throwIfStatus(condition, message) {
        if (status !== condition)
            return;
        throw new Error(message || 'Invalid State');
    }
    function throwIfNotStatus(condition, message) {
        if (status === condition)
            return;
        throw new Error(message || 'Invalid State');
    }
    function onConnecting() {
        log$r('conference connecting');
        status = exports.STATUS.kConnecting;
        events.emit('connecting');
    }
    function onConnected() {
        log$r('conference connected');
        /* eslint-disable-next-line no-use-before-define */
        setup();
        status = exports.STATUS.kConnected;
        events.emit('connected');
    }
    function onDisconnecting() {
        log$r('conference disconnecting');
        status = exports.STATUS.kDisconnecting;
        events.emit('disconnecting');
    }
    function onDisconnected(data) {
        log$r('conference disconnected');
        /* eslint-disable-next-line no-use-before-define */
        cleanup();
        status = exports.STATUS.kDisconnected;
        events.emit('disconnected', data);
    }
    async function maybeChat() {
        if (!chatChannel)
            return;
        if (chatChannel.ready)
            return;
        await chatChannel.connect().catch(() => { });
    }
    async function join(options = {}) {
        log$r('join()');
        throwIfNotStatus(exports.STATUS.kNull);
        if (!options.url && !options.number) {
            throw new TypeError('Invalid Number');
        }
        status = exports.STATUS.kConnecting;
        onConnecting();
        let response;
        let data;
        const hasMedia = true;
        if (!options.url && options.number) {
            request = api
                .request('getURL')
                .data({ 'long-number': options.number });
            response = await request.send();
            ({ data } = response);
            // extract url
            ({ url: options.url } = data.data);
        }
        const useragent = CONFIG.get('useragent', `Yealink ${miniprogram ? 'WECHAT' : 'WEB-APP'} ${"1.0.0-alpha"}`);
        const clientinfo = CONFIG.get('clientinfo', `${miniprogram ? 'Apollo_WeChat' : 'Apollo_WebRTC'} ${"1.0.0-alpha"}`);
        // join focus
        const apiName = miniprogram ? 'joinWechat' : 'joinFocus';
        request = api
            .request(apiName)
            .data({
            // 'conference-uuid'     : null,
            // 'conference-user-id'  : null,
            'conference-url': options.url,
            'conference-pwd': options.password,
            'user-agent': useragent,
            'client-url': options.url.replace(/\w+@/g, miniprogram ? 'wechat@' : 'webrtc@'),
            'client-display-text': options.displayName || `${browser$3}`,
            'client-type': 'http',
            'client-info': clientinfo,
            'pure-ctrl-channel': !hasMedia,
            // if join with media
            'is-webrtc': !miniprogram && hasMedia,
            'is-wechat': miniprogram,
            'video-session-info': miniprogram && {
                bitrate: 600 * 1024,
                'video-width': 640,
                'video-height': 480,
                'frame-rate': 15,
            },
        });
        try {
            response = await request.send();
        }
        catch (error) {
            events.emit('failed', error);
            throw error;
        }
        ({ data } = response);
        ({
            'conference-user-id': userId,
            'conference-uuid': uuid,
        } = data.data);
        trtc = miniprogram ? data.data : {};
        if (!userId || !uuid) {
            log$r('internal error');
            throw new Error('Internal Error');
        }
        // save url
        ({ url } = options);
        // setup request interceptor for ctrl api
        interceptor = api
            .interceptors
            .request
            .use((config) => {
            if (/conference-ctrl/.test(config.url) && config.method === 'post') {
                config.data = {
                    'conference-user-id': userId,
                    'conference-uuid': uuid,
                    ...config.data,
                };
            }
            return config;
        });
        // get full info
        request = api
            .request('getFullInfo');
        try {
            response = await request.send();
        }
        catch (error) {
            events.emit('failed', error);
            throw error;
        }
        ({ data } = response);
        const info = data.data;
        // create context
        const context = createContext(conference);
        // create information
        information = createInformation(info, context);
        onConnected();
        return conference;
    }
    async function leave() {
        throwIfStatus(exports.STATUS.kDisconnecting);
        throwIfStatus(exports.STATUS.kDisconnected);
        switch (status) {
            case exports.STATUS.kNull:
                // nothing to do
                break;
            case exports.STATUS.kConnecting:
            case exports.STATUS.kConnected:
                if (status === exports.STATUS.kConnected) {
                    onDisconnecting();
                    await api
                        .request('leave')
                        .send();
                    onDisconnected();
                }
                else if (request) {
                    request.cancel();
                    onDisconnected();
                }
                break;
            case exports.STATUS.kDisconnecting:
            case exports.STATUS.kDisconnected:
        }
        return conference;
    }
    async function end() {
        throwIfNotStatus(exports.STATUS.kConnected);
        await leave();
        await api
            .request('end')
            .data({ 'conference-url': url })
            .send();
        return conference;
    }
    function setup() {
        getCurrentUser();
        const { state, users } = information;
        state.on('sharingUserEntityChanged', (val) => {
            events.emit('sharinguser', users.getUser(val));
        });
        state.on('speechUserEntityChanged', (val) => {
            events.emit('speechuser', users.getUser(val));
        });
        users.on('user:added', (...args) => events.emit('user:added', ...args));
        users.on('user:updated', (...args) => events.emit('user:updated', ...args));
        users.on('user:deleted', (...args) => events.emit('user:deleted', ...args));
        // create keepalive worker
        keepalive = createKeepAlive({ api });
        // create polling worker
        polling = createPolling({
            api,
            onInformation: (data) => {
                log$r('receive information: %o', data);
                information.update(data);
                events.emit('information', information);
                getCurrentUser();
            },
            onMessage: (data) => {
                log$r('receive message: %o', data);
                chatChannel.incoming(data);
            },
            onRenegotiate: (data) => {
                log$r('receive renegotiate: %o', data);
                mediaChannel.renegotiate();
            },
            onQuit: (data) => {
                log$r('receive quit: %o', data);
                if (status === exports.STATUS.kDisconnecting || status === exports.STATUS.kDisconnected)
                    return;
                // bizCode = 901314 ended by presenter
                // bizCode = 901320 kicked by presenter
                onDisconnected(data);
            },
            onError: (data) => {
                log$r('polling error, about to leave...');
                events.emit('error', data);
                // there are some problems with polling
                // leave conference
                //
                onDisconnected(data);
            },
        });
        // start keepalive & polling
        keepalive.start();
        polling.start();
        // create channels
        mediaChannel = createMediaChannel({ api, type: 'main' });
        shareChannel = createMediaChannel({ api, type: 'slides' });
        chatChannel = createChatChannel({ api });
        chatChannel.on('message', (...args) => events.emit('message', ...args));
        chatChannel.on('ready', (...args) => events.emit('chatready', ...args));
        maybeChat();
    }
    function cleanup() {
        if (keepalive) {
            keepalive.stop();
        }
        if (polling) {
            polling.stop();
        }
        if (interceptor) {
            api.interceptors.request.eject(interceptor);
        }
        if (mediaChannel) {
            mediaChannel.terminate();
        }
        if (shareChannel) {
            shareChannel.terminate();
        }
        if (chatChannel) {
            chatChannel.terminate();
        }
        request = undefined;
    }
    async function share(options) {
        throwIfNotStatus(exports.STATUS.kConnected);
        if (!shareChannel.isInProgress() && !shareChannel.isEstablished()) {
            await shareChannel.connect(options);
        }
        await api
            .request('switchShare')
            .data({ share: true })
            .send();
    }
    async function sendMessage(msg, target) {
        throwIfNotStatus(exports.STATUS.kConnected);
        if (!chatChannel || !chatChannel.ready)
            throw new Error('Not Ready');
        await chatChannel.sendMessage(msg, target);
    }
    return conference = {
        ...events,
        get api() {
            return api;
        },
        get url() {
            return url;
        },
        get uuid() {
            return uuid;
        },
        // in conference info
        // user entity is string type
        // while we may receive number type
        // change to string type
        get userId() {
            return `${userId}`;
        },
        get user() {
            return user;
        },
        get information() {
            return information;
        },
        get description() {
            return information && information.description;
        },
        get state() {
            return information && information.state;
        },
        get view() {
            return information && information.view;
        },
        get users() {
            return information && information.users;
        },
        get rtmp() {
            return information && information.rtmp;
        },
        get record() {
            return information && information.record;
        },
        get mediaChannel() {
            return mediaChannel;
        },
        get shareChannel() {
            return shareChannel;
        },
        get chatChannel() {
            return chatChannel;
        },
        get trtc() {
            return trtc;
        },
        join,
        leave,
        end,
        share,
        sendMessage,
    };
}

const log$s = debug('MN:UA');
function urlToNumber(url) {
    const parts = url.split('@');
    const number = parts[0];
    const enterprise = parts[1].split('.')[0];
    return `${number}.${enterprise}`;
}
function createUA(config) {
    let api;
    let worker;
    let token;
    let partyId;
    let url;
    function createUserApi(auth = true) {
        const api = createApi({
            baseURL: CONFIG.get('baseurl',  '/webapp/' ),
        });
        api.interceptors.request.use((config) => {
            if (auth && token) {
                config.headers = config.headers || {};
                config.headers.token = token;
            }
            return config;
        });
        return api;
    }
    async function auth() {
        log$s('auth()');
        if (!partyId) {
            throw new Error('Authorization Error');
        }
        const response = await api
            .request('getVirtualJWT')
            .params({ id: partyId })
            .send();
        ({ token } = response.data.data);
        if (!token) {
            throw new Error('Authorization Error');
        }
    }
    function stop() {
        log$s('stop()');
        if (worker) {
            worker.stop();
        }
        // clear token will break all api request
        token = undefined;
    }
    async function fetch(number) {
        log$s('fetch()');
        let response;
        let data;
        let info;
        let partyId;
        let url;
        // get conference url
        response = await api
            .request('getURL')
            .data({ 'long-number': number })
            .send();
        ({ data } = response);
        /* eslint-disable-next-line prefer-const */
        ({ 'party-id': partyId, url } = data.data);
        // get conference info
        try {
            response = await api
                .request('getBasicInfo')
                .data({ 'conference-url': url })
                .send();
            ({ data } = response);
            info = data.data;
        }
        catch (error) {
            log$s('Conference not started.');
            try {
                response = await api
                    .request('getBasicInfoOffline')
                    .data({ 'long-number': number })
                    .send();
                ({ data } = response);
                info = data.data;
            }
            catch (error) {
                log$s('Conference not exist.');
            }
        }
        if (!info) {
            throw new Error('Not Exist');
        }
        return {
            partyId,
            number,
            url,
            info,
        };
    }
    // currently, we don't support connect multiple conference for authenticate reason
    async function connect(options) {
        log$s('connect()');
        // create user api
        if (!api) {
            api = createUserApi(false);
        }
        // creat auth() worker
        if (!worker) {
            worker = createWorker({
                interval: 5 * 60 * 1000,
                work: async () => {
                    await auth();
                },
            });
        }
        if (!options.number) {
            throw new TypeError('Invalid Number');
        }
        const { number } = options;
        // get conference url
        const response = await api
            .request('getURL')
            .data({ 'long-number': number })
            .send();
        const { data } = response;
        /* eslint-disable-next-line prefer-const */
        ({ 'party-id': partyId, url } = data.data);
        await worker.start();
        const conference = createConference({ api: createUserApi() });
        // hack join method
        const { join } = conference;
        conference.join = (additional) => {
            return join({
                url,
                ...options,
                ...additional,
            });
        };
        // stop auth worker as we can only connect one conference
        conference.once('disconnected', stop);
        return conference;
    }
    return {
        stop,
        fetch,
        connect,
    };
}

function createMedia() {
    return {};
}

const log$t = debug('MN');
const version = "1.0.0-alpha";
// global setup
function setup$1(config) {
    setupConfig(config);
    if (isMiniProgram()) {
        axios.defaults.adapter = mpAdapter;
    }
    debug.enable(CONFIG.get('debug', 'MN*,-MN:Api*,-MN:Information:Item,-MN:Worker'));
    log$t('setup() [version]: %s', version);
}
async function connect(options) {
    const ua = createUA();
    const conference = await ua.connect(options);
    return conference;
}
var index = {
    version,
    createUA,
    setup: setup$1,
    connect,
};

exports.debug = debug;
exports.axios = axios;
exports.adapter = mpAdapter;
exports.createConference = createConference;
exports.createEvents = createEvents;
exports.createMedia = createMedia;
exports.createReactive = createReactive;
exports.createUA = createUA;
exports.default = index;
exports.paramReducer = paramReducer;
exports.parse = parse;
exports.parseFmtpConfig = parseFmtpConfig;
exports.parseImageAttributes = parseImageAttributes;
exports.parseParams = parseParams;
exports.parsePayloads = parsePayloads;
exports.parseReg = parseReg;
exports.parseRemoteCandidates = parseRemoteCandidates;
exports.parseSimulcastStreamList = parseSimulcastStreamList;
exports.urlToNumber = urlToNumber;
exports.write = write;
