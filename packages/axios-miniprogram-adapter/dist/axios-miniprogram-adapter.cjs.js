'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

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

const isObject$1 = (val) => val !== null && typeof val === 'object';
var PLATFORM;
(function (PLATFORM) {
    PLATFORM[PLATFORM["kUnknown"] = 0] = "kUnknown";
    PLATFORM[PLATFORM["kWechat"] = 1] = "kWechat";
    PLATFORM[PLATFORM["kAlipay"] = 2] = "kAlipay";
    PLATFORM[PLATFORM["kBaidu"] = 3] = "kBaidu";
})(PLATFORM || (PLATFORM = {}));
const platform = isObject$1(global.wx)
    ? PLATFORM.kWechat
    : isObject$1(global.my)
        ? PLATFORM.kAlipay
        : isObject$1(global.swan)
            ? PLATFORM.kBaidu
            : PLATFORM.kUnknown;
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
            headers,
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

exports.default = mpAdapter;
exports.isString = isString$1;
