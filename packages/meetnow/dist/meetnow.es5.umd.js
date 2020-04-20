(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else if(typeof exports === 'object')
		exports["MeetNow"] = factory();
	else
		root["MeetNow"] = factory();
})((typeof self !== 'undefined' ? self : this), function() {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "fae3");
/******/ })
/************************************************************************/
/******/ ({

/***/ "00d8":
/***/ (function(module, exports) {

(function() {
  var base64map
      = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/',

  crypt = {
    // Bit-wise rotation left
    rotl: function(n, b) {
      return (n << b) | (n >>> (32 - b));
    },

    // Bit-wise rotation right
    rotr: function(n, b) {
      return (n << (32 - b)) | (n >>> b);
    },

    // Swap big-endian to little-endian and vice versa
    endian: function(n) {
      // If number given, swap endian
      if (n.constructor == Number) {
        return crypt.rotl(n, 8) & 0x00FF00FF | crypt.rotl(n, 24) & 0xFF00FF00;
      }

      // Else, assume array and swap all items
      for (var i = 0; i < n.length; i++)
        n[i] = crypt.endian(n[i]);
      return n;
    },

    // Generate an array of any length of random bytes
    randomBytes: function(n) {
      for (var bytes = []; n > 0; n--)
        bytes.push(Math.floor(Math.random() * 256));
      return bytes;
    },

    // Convert a byte array to big-endian 32-bit words
    bytesToWords: function(bytes) {
      for (var words = [], i = 0, b = 0; i < bytes.length; i++, b += 8)
        words[b >>> 5] |= bytes[i] << (24 - b % 32);
      return words;
    },

    // Convert big-endian 32-bit words to a byte array
    wordsToBytes: function(words) {
      for (var bytes = [], b = 0; b < words.length * 32; b += 8)
        bytes.push((words[b >>> 5] >>> (24 - b % 32)) & 0xFF);
      return bytes;
    },

    // Convert a byte array to a hex string
    bytesToHex: function(bytes) {
      for (var hex = [], i = 0; i < bytes.length; i++) {
        hex.push((bytes[i] >>> 4).toString(16));
        hex.push((bytes[i] & 0xF).toString(16));
      }
      return hex.join('');
    },

    // Convert a hex string to a byte array
    hexToBytes: function(hex) {
      for (var bytes = [], c = 0; c < hex.length; c += 2)
        bytes.push(parseInt(hex.substr(c, 2), 16));
      return bytes;
    },

    // Convert a byte array to a base-64 string
    bytesToBase64: function(bytes) {
      for (var base64 = [], i = 0; i < bytes.length; i += 3) {
        var triplet = (bytes[i] << 16) | (bytes[i + 1] << 8) | bytes[i + 2];
        for (var j = 0; j < 4; j++)
          if (i * 8 + j * 6 <= bytes.length * 8)
            base64.push(base64map.charAt((triplet >>> 6 * (3 - j)) & 0x3F));
          else
            base64.push('=');
      }
      return base64.join('');
    },

    // Convert a base-64 string to a byte array
    base64ToBytes: function(base64) {
      // Remove non-base-64 characters
      base64 = base64.replace(/[^A-Z0-9+\/]/ig, '');

      for (var bytes = [], i = 0, imod4 = 0; i < base64.length;
          imod4 = ++i % 4) {
        if (imod4 == 0) continue;
        bytes.push(((base64map.indexOf(base64.charAt(i - 1))
            & (Math.pow(2, -2 * imod4 + 8) - 1)) << (imod4 * 2))
            | (base64map.indexOf(base64.charAt(i)) >>> (6 - imod4 * 2)));
      }
      return bytes;
    }
  };

  module.exports = crypt;
})();


/***/ }),

/***/ "044b":
/***/ (function(module, exports) {

/*!
 * Determine if an object is a Buffer
 *
 * @author   Feross Aboukhadijeh <https://feross.org>
 * @license  MIT
 */

// The _isBuffer check is for Safari 5-7 support, because it's missing
// Object.prototype.constructor. Remove this eventually
module.exports = function (obj) {
  return obj != null && (isBuffer(obj) || isSlowBuffer(obj) || !!obj._isBuffer)
}

function isBuffer (obj) {
  return !!obj.constructor && typeof obj.constructor.isBuffer === 'function' && obj.constructor.isBuffer(obj)
}

// For Node v0.10 support. Remove this eventually.
function isSlowBuffer (obj) {
  return typeof obj.readFloatLE === 'function' && typeof obj.slice === 'function' && isBuffer(obj.slice(0, 0))
}


/***/ }),

/***/ "04c9":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* unused harmony export debounce */
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "e", function() { return isDef; });
/* unused harmony export isEmpty */
/* unused harmony export NOOP */
/* unused harmony export NO */
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "d", function() { return isArray; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "f", function() { return isFunction; });
/* unused harmony export isString */
/* unused harmony export isSymbol */
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "g", function() { return isObject; });
/* unused harmony export isPromise */
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "c", function() { return hasOwn; });
/* unused harmony export objectToString */
/* unused harmony export toTypeString */
/* unused harmony export isPlainObject */
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return camelize; });
/* unused harmony export hyphenate */
/* unused harmony export capitalize */
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "b", function() { return hasChanged; });
/* harmony import */ var core_js_modules_es_array_concat__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("99af");
/* harmony import */ var core_js_modules_es_array_concat__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(core_js_modules_es_array_concat__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var core_js_modules_es_array_slice__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("fb6a");
/* harmony import */ var core_js_modules_es_array_slice__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(core_js_modules_es_array_slice__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var core_js_modules_es_number_constructor__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__("a9e3");
/* harmony import */ var core_js_modules_es_number_constructor__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(core_js_modules_es_number_constructor__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var core_js_modules_es_number_is_nan__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__("9129");
/* harmony import */ var core_js_modules_es_number_is_nan__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(core_js_modules_es_number_is_nan__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var core_js_modules_es_object_to_string__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__("d3b7");
/* harmony import */ var core_js_modules_es_object_to_string__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(core_js_modules_es_object_to_string__WEBPACK_IMPORTED_MODULE_4__);
/* harmony import */ var core_js_modules_es_regexp_exec__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__("ac1f");
/* harmony import */ var core_js_modules_es_regexp_exec__WEBPACK_IMPORTED_MODULE_5___default = /*#__PURE__*/__webpack_require__.n(core_js_modules_es_regexp_exec__WEBPACK_IMPORTED_MODULE_5__);
/* harmony import */ var core_js_modules_es_regexp_to_string__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__("25f0");
/* harmony import */ var core_js_modules_es_regexp_to_string__WEBPACK_IMPORTED_MODULE_6___default = /*#__PURE__*/__webpack_require__.n(core_js_modules_es_regexp_to_string__WEBPACK_IMPORTED_MODULE_6__);
/* harmony import */ var core_js_modules_es_string_replace__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__("5319");
/* harmony import */ var core_js_modules_es_string_replace__WEBPACK_IMPORTED_MODULE_7___default = /*#__PURE__*/__webpack_require__.n(core_js_modules_es_string_replace__WEBPACK_IMPORTED_MODULE_7__);
/* harmony import */ var D_workspace_meetnow_node_modules_babel_runtime_helpers_esm_typeof__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__("53ca");









var debounce = function debounce(func) {
  var wait = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
  var timer;
  return function () {
    var _this = this;

    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    clearTimeout(timer);
    timer = setTimeout.apply(void 0, [function () {
      return func.call.apply(func, [_this].concat(args));
    }, wait].concat(args));
  };
};
var isDef = function isDef(value) {
  return value !== undefined && value !== null;
};
var isEmpty = function isEmpty(val) {
  return val === undefined || val === null || val === '' || Array.isArray(val) && val.length === 0 || typeof val === 'number' && Number.isNaN(val);
};
var NOOP = function NOOP() {};
var NO = function NO() {
  return false;
};
var isArray = Array.isArray;

var isFunction = function isFunction(val) {
  return typeof val === 'function';
};
var isString = function isString(val) {
  return typeof val === 'string';
};
var isSymbol = function isSymbol(val) {
  return Object(D_workspace_meetnow_node_modules_babel_runtime_helpers_esm_typeof__WEBPACK_IMPORTED_MODULE_8__[/* default */ "a"])(val) === 'symbol';
};
var isObject = function isObject(val) {
  return Object(D_workspace_meetnow_node_modules_babel_runtime_helpers_esm_typeof__WEBPACK_IMPORTED_MODULE_8__[/* default */ "a"])(val) === 'object' && val !== null;
};
function isPromise(val) {
  return isObject(val) && isFunction(val.then) && isFunction(val.catch);
}
var hasOwnProperty = Object.prototype.hasOwnProperty;
var hasOwn = function hasOwn(val, key) {
  return hasOwnProperty.call(val, key);
};
var objectToString = Object.prototype.toString;
var toTypeString = function toTypeString(value) {
  return objectToString.call(value);
};
var isPlainObject = function isPlainObject(val) {
  return toTypeString(val) === '[object Object]';
};
var camelizeRE = /-(\w)/g;
var camelize = function camelize(str) {
  return str.replace(camelizeRE, function (_, c) {
    return c ? c.toUpperCase() : '';
  });
};
var hyphenateRE = /\B([A-Z])/g;
var hyphenate = function hyphenate(str) {
  return str.replace(hyphenateRE, '-$1').toLowerCase();
};
var capitalize = function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}; // compare whether a value has changed, accounting for NaN.

var hasChanged = function hasChanged(value, oldValue) {
  /* eslint-disable-next-line no-self-compare */
  return value !== oldValue && (value === value || oldValue === oldValue);
};

/***/ }),

/***/ "0538":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var aFunction = __webpack_require__("1c0b");
var isObject = __webpack_require__("861d");

var slice = [].slice;
var factories = {};

var construct = function (C, argsLength, args) {
  if (!(argsLength in factories)) {
    for (var list = [], i = 0; i < argsLength; i++) list[i] = 'a[' + i + ']';
    // eslint-disable-next-line no-new-func
    factories[argsLength] = Function('C,a', 'return new C(' + list.join(',') + ')');
  } return factories[argsLength](C, args);
};

// `Function.prototype.bind` method implementation
// https://tc39.github.io/ecma262/#sec-function.prototype.bind
module.exports = Function.bind || function bind(that /* , ...args */) {
  var fn = aFunction(this);
  var partArgs = slice.call(arguments, 1);
  var boundFunction = function bound(/* args... */) {
    var args = partArgs.concat(slice.call(arguments));
    return this instanceof boundFunction ? construct(fn, args.length, args) : fn.apply(that, args);
  };
  if (isObject(fn.prototype)) boundFunction.prototype = fn.prototype;
  return boundFunction;
};


/***/ }),

/***/ "057f":
/***/ (function(module, exports, __webpack_require__) {

var toIndexedObject = __webpack_require__("fc6a");
var nativeGetOwnPropertyNames = __webpack_require__("241c").f;

var toString = {}.toString;

var windowNames = typeof window == 'object' && window && Object.getOwnPropertyNames
  ? Object.getOwnPropertyNames(window) : [];

var getWindowNames = function (it) {
  try {
    return nativeGetOwnPropertyNames(it);
  } catch (error) {
    return windowNames.slice();
  }
};

// fallback for IE11 buggy Object.getOwnPropertyNames with iframe and window
module.exports.f = function getOwnPropertyNames(it) {
  return windowNames && toString.call(it) == '[object Window]'
    ? getWindowNames(it)
    : nativeGetOwnPropertyNames(toIndexedObject(it));
};


/***/ }),

/***/ "06cf":
/***/ (function(module, exports, __webpack_require__) {

var DESCRIPTORS = __webpack_require__("83ab");
var propertyIsEnumerableModule = __webpack_require__("d1e7");
var createPropertyDescriptor = __webpack_require__("5c6c");
var toIndexedObject = __webpack_require__("fc6a");
var toPrimitive = __webpack_require__("c04e");
var has = __webpack_require__("5135");
var IE8_DOM_DEFINE = __webpack_require__("0cfb");

var nativeGetOwnPropertyDescriptor = Object.getOwnPropertyDescriptor;

// `Object.getOwnPropertyDescriptor` method
// https://tc39.github.io/ecma262/#sec-object.getownpropertydescriptor
exports.f = DESCRIPTORS ? nativeGetOwnPropertyDescriptor : function getOwnPropertyDescriptor(O, P) {
  O = toIndexedObject(O);
  P = toPrimitive(P, true);
  if (IE8_DOM_DEFINE) try {
    return nativeGetOwnPropertyDescriptor(O, P);
  } catch (error) { /* empty */ }
  if (has(O, P)) return createPropertyDescriptor(!propertyIsEnumerableModule.f.call(O, P), O[P]);
};


/***/ }),

/***/ "0a06":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var utils = __webpack_require__("c532");
var buildURL = __webpack_require__("30b5");
var InterceptorManager = __webpack_require__("f6b4");
var dispatchRequest = __webpack_require__("5270");
var mergeConfig = __webpack_require__("4a7b");

/**
 * Create a new instance of Axios
 *
 * @param {Object} instanceConfig The default config for the instance
 */
function Axios(instanceConfig) {
  this.defaults = instanceConfig;
  this.interceptors = {
    request: new InterceptorManager(),
    response: new InterceptorManager()
  };
}

/**
 * Dispatch a request
 *
 * @param {Object} config The config specific for this request (merged with this.defaults)
 */
Axios.prototype.request = function request(config) {
  /*eslint no-param-reassign:0*/
  // Allow for axios('example/url'[, config]) a la fetch API
  if (typeof config === 'string') {
    config = arguments[1] || {};
    config.url = arguments[0];
  } else {
    config = config || {};
  }

  config = mergeConfig(this.defaults, config);
  config.method = config.method ? config.method.toLowerCase() : 'get';

  // Hook up interceptors middleware
  var chain = [dispatchRequest, undefined];
  var promise = Promise.resolve(config);

  this.interceptors.request.forEach(function unshiftRequestInterceptors(interceptor) {
    chain.unshift(interceptor.fulfilled, interceptor.rejected);
  });

  this.interceptors.response.forEach(function pushResponseInterceptors(interceptor) {
    chain.push(interceptor.fulfilled, interceptor.rejected);
  });

  while (chain.length) {
    promise = promise.then(chain.shift(), chain.shift());
  }

  return promise;
};

Axios.prototype.getUri = function getUri(config) {
  config = mergeConfig(this.defaults, config);
  return buildURL(config.url, config.params, config.paramsSerializer).replace(/^\?/, '');
};

// Provide aliases for supported request methods
utils.forEach(['delete', 'get', 'head', 'options'], function forEachMethodNoData(method) {
  /*eslint func-names:0*/
  Axios.prototype[method] = function(url, config) {
    return this.request(utils.merge(config || {}, {
      method: method,
      url: url
    }));
  };
});

utils.forEach(['post', 'put', 'patch'], function forEachMethodWithData(method) {
  /*eslint func-names:0*/
  Axios.prototype[method] = function(url, data, config) {
    return this.request(utils.merge(config || {}, {
      method: method,
      url: url,
      data: data
    }));
  };
});

module.exports = Axios;


/***/ }),

/***/ "0cfb":
/***/ (function(module, exports, __webpack_require__) {

var DESCRIPTORS = __webpack_require__("83ab");
var fails = __webpack_require__("d039");
var createElement = __webpack_require__("cc12");

// Thank's IE8 for his funny defineProperty
module.exports = !DESCRIPTORS && !fails(function () {
  return Object.defineProperty(createElement('div'), 'a', {
    get: function () { return 7; }
  }).a != 7;
});


/***/ }),

/***/ "0df6":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


/**
 * Syntactic sugar for invoking a function and expanding an array for arguments.
 *
 * Common use case would be to use `Function.prototype.apply`.
 *
 *  ```js
 *  function f(x, y, z) {}
 *  var args = [1, 2, 3];
 *  f.apply(null, args);
 *  ```
 *
 * With `spread` this example can be re-written.
 *
 *  ```js
 *  spread(function(x, y, z) {})([1, 2, 3]);
 *  ```
 *
 * @param {Function} callback
 * @returns {Function}
 */
module.exports = function spread(callback) {
  return function wrap(arr) {
    return callback.apply(null, arr);
  };
};


/***/ }),

/***/ "1235":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "AuthType", function() { return AuthType; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "bootstrap", function() { return bootstrap; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "fetchControlUrl", function() { return fetchControlUrl; });
/* harmony import */ var core_js_modules_es_symbol__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("a4d3");
/* harmony import */ var core_js_modules_es_symbol__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(core_js_modules_es_symbol__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var core_js_modules_es_array_concat__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("99af");
/* harmony import */ var core_js_modules_es_array_concat__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(core_js_modules_es_array_concat__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var core_js_modules_es_array_filter__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__("4de4");
/* harmony import */ var core_js_modules_es_array_filter__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(core_js_modules_es_array_filter__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var core_js_modules_es_array_join__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__("a15b");
/* harmony import */ var core_js_modules_es_array_join__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(core_js_modules_es_array_join__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var core_js_modules_es_array_map__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__("d81d");
/* harmony import */ var core_js_modules_es_array_map__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(core_js_modules_es_array_map__WEBPACK_IMPORTED_MODULE_4__);
/* harmony import */ var core_js_modules_es_object_get_own_property_descriptor__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__("e439");
/* harmony import */ var core_js_modules_es_object_get_own_property_descriptor__WEBPACK_IMPORTED_MODULE_5___default = /*#__PURE__*/__webpack_require__.n(core_js_modules_es_object_get_own_property_descriptor__WEBPACK_IMPORTED_MODULE_5__);
/* harmony import */ var core_js_modules_es_object_get_own_property_descriptors__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__("dbb4");
/* harmony import */ var core_js_modules_es_object_get_own_property_descriptors__WEBPACK_IMPORTED_MODULE_6___default = /*#__PURE__*/__webpack_require__.n(core_js_modules_es_object_get_own_property_descriptors__WEBPACK_IMPORTED_MODULE_6__);
/* harmony import */ var core_js_modules_es_object_keys__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__("b64b");
/* harmony import */ var core_js_modules_es_object_keys__WEBPACK_IMPORTED_MODULE_7___default = /*#__PURE__*/__webpack_require__.n(core_js_modules_es_object_keys__WEBPACK_IMPORTED_MODULE_7__);
/* harmony import */ var core_js_modules_es_regexp_exec__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__("ac1f");
/* harmony import */ var core_js_modules_es_regexp_exec__WEBPACK_IMPORTED_MODULE_8___default = /*#__PURE__*/__webpack_require__.n(core_js_modules_es_regexp_exec__WEBPACK_IMPORTED_MODULE_8__);
/* harmony import */ var core_js_modules_es_string_replace__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__("5319");
/* harmony import */ var core_js_modules_es_string_replace__WEBPACK_IMPORTED_MODULE_9___default = /*#__PURE__*/__webpack_require__.n(core_js_modules_es_string_replace__WEBPACK_IMPORTED_MODULE_9__);
/* harmony import */ var core_js_modules_es_string_split__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__("1276");
/* harmony import */ var core_js_modules_es_string_split__WEBPACK_IMPORTED_MODULE_10___default = /*#__PURE__*/__webpack_require__.n(core_js_modules_es_string_split__WEBPACK_IMPORTED_MODULE_10__);
/* harmony import */ var core_js_modules_web_dom_collections_for_each__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__("159b");
/* harmony import */ var core_js_modules_web_dom_collections_for_each__WEBPACK_IMPORTED_MODULE_11___default = /*#__PURE__*/__webpack_require__.n(core_js_modules_web_dom_collections_for_each__WEBPACK_IMPORTED_MODULE_11__);
/* harmony import */ var D_workspace_meetnow_node_modules_babel_runtime_helpers_esm_defineProperty__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__("ade3");
/* harmony import */ var regenerator_runtime_runtime__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__("96cf");
/* harmony import */ var regenerator_runtime_runtime__WEBPACK_IMPORTED_MODULE_13___default = /*#__PURE__*/__webpack_require__.n(regenerator_runtime_runtime__WEBPACK_IMPORTED_MODULE_13__);
/* harmony import */ var D_workspace_meetnow_node_modules_babel_runtime_helpers_esm_asyncToGenerator__WEBPACK_IMPORTED_MODULE_14__ = __webpack_require__("1da1");
/* harmony import */ var md5__WEBPACK_IMPORTED_MODULE_15__ = __webpack_require__("6821");
/* harmony import */ var md5__WEBPACK_IMPORTED_MODULE_15___default = /*#__PURE__*/__webpack_require__.n(md5__WEBPACK_IMPORTED_MODULE_15__);
/* harmony import */ var _adapter_btoa__WEBPACK_IMPORTED_MODULE_16__ = __webpack_require__("3174");
/* harmony import */ var _user_api__WEBPACK_IMPORTED_MODULE_17__ = __webpack_require__("f6b8");
/* harmony import */ var _digest_auth__WEBPACK_IMPORTED_MODULE_18__ = __webpack_require__("ea02");
















function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { Object(D_workspace_meetnow_node_modules_babel_runtime_helpers_esm_defineProperty__WEBPACK_IMPORTED_MODULE_12__[/* default */ "a"])(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }









var AuthType;

(function (AuthType) {
  AuthType["email"] = "0";
  AuthType["mobile"] = "1";
  AuthType["verifycode"] = "9";
})(AuthType || (AuthType = {}));

function bootstrap(_x) {
  return _bootstrap.apply(this, arguments);
}

function _bootstrap() {
  _bootstrap = Object(D_workspace_meetnow_node_modules_babel_runtime_helpers_esm_asyncToGenerator__WEBPACK_IMPORTED_MODULE_14__[/* default */ "a"])(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee2(auth) {
    var api, response, _response$data$data, account, tokens, identities;

    return regeneratorRuntime.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            api = Object(_user_api__WEBPACK_IMPORTED_MODULE_17__[/* createUserApi */ "a"])();
            _context2.next = 3;
            return api.request('login').data({
              principle: auth.principle,
              credential: md5__WEBPACK_IMPORTED_MODULE_15___default()(auth.credential),
              number: auth.enterprise,
              mobileCode: auth.areacode,
              accountType: auth.authtype
            }).send();

          case 3:
            response = _context2.sent;
            _response$data$data = response.data.data, account = _response$data$data.account, tokens = _response$data$data.tokens;
            identities = tokens.map(function (token) {
              var identityToken = token.token;
              var identityAuth;
              return _objectSpread({}, token, {
                get account() {
                  return account;
                },

                get auth() {
                  return identityAuth;
                },

                confirm: function () {
                  var _confirm = Object(D_workspace_meetnow_node_modules_babel_runtime_helpers_esm_asyncToGenerator__WEBPACK_IMPORTED_MODULE_14__[/* default */ "a"])(
                  /*#__PURE__*/
                  regeneratorRuntime.mark(function _callee() {
                    return regeneratorRuntime.wrap(function _callee$(_context) {
                      while (1) {
                        switch (_context.prev = _context.next) {
                          case 0:
                            if (identityAuth) {
                              _context.next = 4;
                              break;
                            }

                            _context.next = 3;
                            return Object(_digest_auth__WEBPACK_IMPORTED_MODULE_18__[/* createDigestAuth */ "a"])(identityToken);

                          case 3:
                            identityAuth = _context.sent;

                          case 4:
                            return _context.abrupt("return", identityAuth);

                          case 5:
                          case "end":
                            return _context.stop();
                        }
                      }
                    }, _callee);
                  }));

                  function confirm() {
                    return _confirm.apply(this, arguments);
                  }

                  return confirm;
                }()
              });
            });
            return _context2.abrupt("return", {
              account: account,
              identities: identities
            });

          case 7:
          case "end":
            return _context2.stop();
        }
      }
    }, _callee2);
  }));
  return _bootstrap.apply(this, arguments);
}

function fetchControlUrl(_x2, _x3, _x4) {
  return _fetchControlUrl.apply(this, arguments);
}

function _fetchControlUrl() {
  _fetchControlUrl = Object(D_workspace_meetnow_node_modules_babel_runtime_helpers_esm_asyncToGenerator__WEBPACK_IMPORTED_MODULE_14__[/* default */ "a"])(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee3(identity, number, baseurl) {
    var auth, party, api, token, partyNumber, response, _response$data$data2, conferenceNo, domain, vmr, scheduledConference, shortNo, planId, sequence, encode, source, parts, url;

    return regeneratorRuntime.wrap(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            if (identity.auth) {
              _context3.next = 3;
              break;
            }

            _context3.next = 3;
            return identity.confirm();

          case 3:
            auth = identity.auth, party = identity.party;
            api = auth.api, token = auth.token;
            partyNumber = party.number;
            _context3.next = 8;
            return api.request('getConferenceInfo').params({
              conferenceNo: number,
              searchNotStartedScheduledConference: false
            }).send();

          case 8:
            response = _context3.sent;
            _response$data$data2 = response.data.data, conferenceNo = _response$data$data2.conferenceNo, domain = _response$data$data2.domain, vmr = _response$data$data2.vmr, scheduledConference = _response$data$data2.scheduledConference;
            shortNo = conferenceNo.split('.')[1];
            planId = '';
            sequence = 1;

            if (vmr) {
              planId = vmr.vmrId;
            }

            if (scheduledConference) {
              planId = scheduledConference.planId;
              sequence = scheduledConference.sequence;
            }

            encode = _adapter_btoa__WEBPACK_IMPORTED_MODULE_16__[/* default */ "a"];
            source = 'WEBUSER';
            parts = ["source=".concat(source), // TODO base64
            "conference=".concat(encode("".concat(shortNo, "@").concat(domain))), "sequence=".concat(sequence), "id=".concat(planId), // TODO base64
            "client=".concat(encode("".concat(partyNumber, "@").concat(domain))), "t=".concat(encode(token))];
            baseurl = baseurl || api.delegate.defaults.baseURL;
            baseurl = baseurl.replace('webapp', 'control');
            url = "".concat(baseurl, "?").concat(parts.join('&'));
            return _context3.abrupt("return", url);

          case 22:
          case "end":
            return _context3.stop();
        }
      }
    }, _callee3);
  }));
  return _fetchControlUrl.apply(this, arguments);
}

/***/ }),

/***/ "1276":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var fixRegExpWellKnownSymbolLogic = __webpack_require__("d784");
var isRegExp = __webpack_require__("44e7");
var anObject = __webpack_require__("825a");
var requireObjectCoercible = __webpack_require__("1d80");
var speciesConstructor = __webpack_require__("4840");
var advanceStringIndex = __webpack_require__("8aa5");
var toLength = __webpack_require__("50c4");
var callRegExpExec = __webpack_require__("14c3");
var regexpExec = __webpack_require__("9263");
var fails = __webpack_require__("d039");

var arrayPush = [].push;
var min = Math.min;
var MAX_UINT32 = 0xFFFFFFFF;

// babel-minify transpiles RegExp('x', 'y') -> /x/y and it causes SyntaxError
var SUPPORTS_Y = !fails(function () { return !RegExp(MAX_UINT32, 'y'); });

// @@split logic
fixRegExpWellKnownSymbolLogic('split', 2, function (SPLIT, nativeSplit, maybeCallNative) {
  var internalSplit;
  if (
    'abbc'.split(/(b)*/)[1] == 'c' ||
    'test'.split(/(?:)/, -1).length != 4 ||
    'ab'.split(/(?:ab)*/).length != 2 ||
    '.'.split(/(.?)(.?)/).length != 4 ||
    '.'.split(/()()/).length > 1 ||
    ''.split(/.?/).length
  ) {
    // based on es5-shim implementation, need to rework it
    internalSplit = function (separator, limit) {
      var string = String(requireObjectCoercible(this));
      var lim = limit === undefined ? MAX_UINT32 : limit >>> 0;
      if (lim === 0) return [];
      if (separator === undefined) return [string];
      // If `separator` is not a regex, use native split
      if (!isRegExp(separator)) {
        return nativeSplit.call(string, separator, lim);
      }
      var output = [];
      var flags = (separator.ignoreCase ? 'i' : '') +
                  (separator.multiline ? 'm' : '') +
                  (separator.unicode ? 'u' : '') +
                  (separator.sticky ? 'y' : '');
      var lastLastIndex = 0;
      // Make `global` and avoid `lastIndex` issues by working with a copy
      var separatorCopy = new RegExp(separator.source, flags + 'g');
      var match, lastIndex, lastLength;
      while (match = regexpExec.call(separatorCopy, string)) {
        lastIndex = separatorCopy.lastIndex;
        if (lastIndex > lastLastIndex) {
          output.push(string.slice(lastLastIndex, match.index));
          if (match.length > 1 && match.index < string.length) arrayPush.apply(output, match.slice(1));
          lastLength = match[0].length;
          lastLastIndex = lastIndex;
          if (output.length >= lim) break;
        }
        if (separatorCopy.lastIndex === match.index) separatorCopy.lastIndex++; // Avoid an infinite loop
      }
      if (lastLastIndex === string.length) {
        if (lastLength || !separatorCopy.test('')) output.push('');
      } else output.push(string.slice(lastLastIndex));
      return output.length > lim ? output.slice(0, lim) : output;
    };
  // Chakra, V8
  } else if ('0'.split(undefined, 0).length) {
    internalSplit = function (separator, limit) {
      return separator === undefined && limit === 0 ? [] : nativeSplit.call(this, separator, limit);
    };
  } else internalSplit = nativeSplit;

  return [
    // `String.prototype.split` method
    // https://tc39.github.io/ecma262/#sec-string.prototype.split
    function split(separator, limit) {
      var O = requireObjectCoercible(this);
      var splitter = separator == undefined ? undefined : separator[SPLIT];
      return splitter !== undefined
        ? splitter.call(separator, O, limit)
        : internalSplit.call(String(O), separator, limit);
    },
    // `RegExp.prototype[@@split]` method
    // https://tc39.github.io/ecma262/#sec-regexp.prototype-@@split
    //
    // NOTE: This cannot be properly polyfilled in engines that don't support
    // the 'y' flag.
    function (regexp, limit) {
      var res = maybeCallNative(internalSplit, regexp, this, limit, internalSplit !== nativeSplit);
      if (res.done) return res.value;

      var rx = anObject(regexp);
      var S = String(this);
      var C = speciesConstructor(rx, RegExp);

      var unicodeMatching = rx.unicode;
      var flags = (rx.ignoreCase ? 'i' : '') +
                  (rx.multiline ? 'm' : '') +
                  (rx.unicode ? 'u' : '') +
                  (SUPPORTS_Y ? 'y' : 'g');

      // ^(? + rx + ) is needed, in combination with some S slicing, to
      // simulate the 'y' flag.
      var splitter = new C(SUPPORTS_Y ? rx : '^(?:' + rx.source + ')', flags);
      var lim = limit === undefined ? MAX_UINT32 : limit >>> 0;
      if (lim === 0) return [];
      if (S.length === 0) return callRegExpExec(splitter, S) === null ? [S] : [];
      var p = 0;
      var q = 0;
      var A = [];
      while (q < S.length) {
        splitter.lastIndex = SUPPORTS_Y ? q : 0;
        var z = callRegExpExec(splitter, SUPPORTS_Y ? S : S.slice(q));
        var e;
        if (
          z === null ||
          (e = min(toLength(splitter.lastIndex + (SUPPORTS_Y ? 0 : q)), S.length)) === p
        ) {
          q = advanceStringIndex(S, q, unicodeMatching);
        } else {
          A.push(S.slice(p, q));
          if (A.length === lim) return A;
          for (var i = 1; i <= z.length - 1; i++) {
            A.push(z[i]);
            if (A.length === lim) return A;
          }
          q = p = e;
        }
      }
      A.push(S.slice(p));
      return A;
    }
  ];
}, !SUPPORTS_Y);


/***/ }),

/***/ "129f":
/***/ (function(module, exports) {

// `SameValue` abstract operation
// https://tc39.github.io/ecma262/#sec-samevalue
module.exports = Object.is || function is(x, y) {
  // eslint-disable-next-line no-self-compare
  return x === y ? x !== 0 || 1 / x === 1 / y : x != x && y != y;
};


/***/ }),

/***/ "14c3":
/***/ (function(module, exports, __webpack_require__) {

var classof = __webpack_require__("c6b6");
var regexpExec = __webpack_require__("9263");

// `RegExpExec` abstract operation
// https://tc39.github.io/ecma262/#sec-regexpexec
module.exports = function (R, S) {
  var exec = R.exec;
  if (typeof exec === 'function') {
    var result = exec.call(R, S);
    if (typeof result !== 'object') {
      throw TypeError('RegExp exec method returned something other than an Object or null');
    }
    return result;
  }

  if (classof(R) !== 'RegExp') {
    throw TypeError('RegExp#exec called on incompatible receiver');
  }

  return regexpExec.call(R, S);
};



/***/ }),

/***/ "159b":
/***/ (function(module, exports, __webpack_require__) {

var global = __webpack_require__("da84");
var DOMIterables = __webpack_require__("fdbc");
var forEach = __webpack_require__("17c2");
var createNonEnumerableProperty = __webpack_require__("9112");

for (var COLLECTION_NAME in DOMIterables) {
  var Collection = global[COLLECTION_NAME];
  var CollectionPrototype = Collection && Collection.prototype;
  // some Chrome versions have non-configurable methods on DOMTokenList
  if (CollectionPrototype && CollectionPrototype.forEach !== forEach) try {
    createNonEnumerableProperty(CollectionPrototype, 'forEach', forEach);
  } catch (error) {
    CollectionPrototype.forEach = forEach;
  }
}


/***/ }),

/***/ "17c2":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var $forEach = __webpack_require__("b727").forEach;
var sloppyArrayMethod = __webpack_require__("b301");

// `Array.prototype.forEach` method implementation
// https://tc39.github.io/ecma262/#sec-array.prototype.foreach
module.exports = sloppyArrayMethod('forEach') ? function forEach(callbackfn /* , thisArg */) {
  return $forEach(this, callbackfn, arguments.length > 1 ? arguments[1] : undefined);
} : [].forEach;


/***/ }),

/***/ "19aa":
/***/ (function(module, exports) {

module.exports = function (it, Constructor, name) {
  if (!(it instanceof Constructor)) {
    throw TypeError('Incorrect ' + (name ? name + ' ' : '') + 'invocation');
  } return it;
};


/***/ }),

/***/ "1be4":
/***/ (function(module, exports, __webpack_require__) {

var getBuiltIn = __webpack_require__("d066");

module.exports = getBuiltIn('document', 'documentElement');


/***/ }),

/***/ "1c0b":
/***/ (function(module, exports) {

module.exports = function (it) {
  if (typeof it != 'function') {
    throw TypeError(String(it) + ' is not a function');
  } return it;
};


/***/ }),

/***/ "1c7e":
/***/ (function(module, exports, __webpack_require__) {

var wellKnownSymbol = __webpack_require__("b622");

var ITERATOR = wellKnownSymbol('iterator');
var SAFE_CLOSING = false;

try {
  var called = 0;
  var iteratorWithReturn = {
    next: function () {
      return { done: !!called++ };
    },
    'return': function () {
      SAFE_CLOSING = true;
    }
  };
  iteratorWithReturn[ITERATOR] = function () {
    return this;
  };
  // eslint-disable-next-line no-throw-literal
  Array.from(iteratorWithReturn, function () { throw 2; });
} catch (error) { /* empty */ }

module.exports = function (exec, SKIP_CLOSING) {
  if (!SKIP_CLOSING && !SAFE_CLOSING) return false;
  var ITERATION_SUPPORT = false;
  try {
    var object = {};
    object[ITERATOR] = function () {
      return {
        next: function () {
          return { done: ITERATION_SUPPORT = true };
        }
      };
    };
    exec(object);
  } catch (error) { /* empty */ }
  return ITERATION_SUPPORT;
};


/***/ }),

/***/ "1d2b":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


module.exports = function bind(fn, thisArg) {
  return function wrap() {
    var args = new Array(arguments.length);
    for (var i = 0; i < args.length; i++) {
      args[i] = arguments[i];
    }
    return fn.apply(thisArg, args);
  };
};


/***/ }),

/***/ "1d80":
/***/ (function(module, exports) {

// `RequireObjectCoercible` abstract operation
// https://tc39.github.io/ecma262/#sec-requireobjectcoercible
module.exports = function (it) {
  if (it == undefined) throw TypeError("Can't call method on " + it);
  return it;
};


/***/ }),

/***/ "1da1":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return _asyncToGenerator; });
/* harmony import */ var core_js_modules_es_object_to_string__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("d3b7");
/* harmony import */ var core_js_modules_es_object_to_string__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(core_js_modules_es_object_to_string__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var core_js_modules_es_promise__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("e6cf");
/* harmony import */ var core_js_modules_es_promise__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(core_js_modules_es_promise__WEBPACK_IMPORTED_MODULE_1__);



function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) {
  try {
    var info = gen[key](arg);
    var value = info.value;
  } catch (error) {
    reject(error);
    return;
  }

  if (info.done) {
    resolve(value);
  } else {
    Promise.resolve(value).then(_next, _throw);
  }
}

function _asyncToGenerator(fn) {
  return function () {
    var self = this,
        args = arguments;
    return new Promise(function (resolve, reject) {
      var gen = fn.apply(self, args);

      function _next(value) {
        asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value);
      }

      function _throw(err) {
        asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err);
      }

      _next(undefined);
    });
  };
}

/***/ }),

/***/ "1dde":
/***/ (function(module, exports, __webpack_require__) {

var fails = __webpack_require__("d039");
var wellKnownSymbol = __webpack_require__("b622");
var V8_VERSION = __webpack_require__("60ae");

var SPECIES = wellKnownSymbol('species');

module.exports = function (METHOD_NAME) {
  // We can't use this feature detection in V8 since it causes
  // deoptimization and serious performance degradation
  // https://github.com/zloirock/core-js/issues/677
  return V8_VERSION >= 51 || !fails(function () {
    var array = [];
    var constructor = array.constructor = {};
    constructor[SPECIES] = function () {
      return { foo: 1 };
    };
    return array[METHOD_NAME](Boolean).foo !== 1;
  });
};


/***/ }),

/***/ "2266":
/***/ (function(module, exports, __webpack_require__) {

var anObject = __webpack_require__("825a");
var isArrayIteratorMethod = __webpack_require__("e95a");
var toLength = __webpack_require__("50c4");
var bind = __webpack_require__("f8c2");
var getIteratorMethod = __webpack_require__("35a1");
var callWithSafeIterationClosing = __webpack_require__("9bdd");

var Result = function (stopped, result) {
  this.stopped = stopped;
  this.result = result;
};

var iterate = module.exports = function (iterable, fn, that, AS_ENTRIES, IS_ITERATOR) {
  var boundFunction = bind(fn, that, AS_ENTRIES ? 2 : 1);
  var iterator, iterFn, index, length, result, next, step;

  if (IS_ITERATOR) {
    iterator = iterable;
  } else {
    iterFn = getIteratorMethod(iterable);
    if (typeof iterFn != 'function') throw TypeError('Target is not iterable');
    // optimisation for array iterators
    if (isArrayIteratorMethod(iterFn)) {
      for (index = 0, length = toLength(iterable.length); length > index; index++) {
        result = AS_ENTRIES
          ? boundFunction(anObject(step = iterable[index])[0], step[1])
          : boundFunction(iterable[index]);
        if (result && result instanceof Result) return result;
      } return new Result(false);
    }
    iterator = iterFn.call(iterable);
  }

  next = iterator.next;
  while (!(step = next.call(iterator)).done) {
    result = callWithSafeIterationClosing(iterator, boundFunction, step.value, AS_ENTRIES);
    if (typeof result == 'object' && result && result instanceof Result) return result;
  } return new Result(false);
};

iterate.stop = function (result) {
  return new Result(true, result);
};


/***/ }),

/***/ "23cb":
/***/ (function(module, exports, __webpack_require__) {

var toInteger = __webpack_require__("a691");

var max = Math.max;
var min = Math.min;

// Helper for a popular repeating case of the spec:
// Let integer be ? ToInteger(index).
// If integer < 0, let result be max((length + integer), 0); else let result be min(length, length).
module.exports = function (index, length) {
  var integer = toInteger(index);
  return integer < 0 ? max(integer + length, 0) : min(integer, length);
};


/***/ }),

/***/ "23e7":
/***/ (function(module, exports, __webpack_require__) {

var global = __webpack_require__("da84");
var getOwnPropertyDescriptor = __webpack_require__("06cf").f;
var createNonEnumerableProperty = __webpack_require__("9112");
var redefine = __webpack_require__("6eeb");
var setGlobal = __webpack_require__("ce4e");
var copyConstructorProperties = __webpack_require__("e893");
var isForced = __webpack_require__("94ca");

/*
  options.target      - name of the target object
  options.global      - target is the global object
  options.stat        - export as static methods of target
  options.proto       - export as prototype methods of target
  options.real        - real prototype method for the `pure` version
  options.forced      - export even if the native feature is available
  options.bind        - bind methods to the target, required for the `pure` version
  options.wrap        - wrap constructors to preventing global pollution, required for the `pure` version
  options.unsafe      - use the simple assignment of property instead of delete + defineProperty
  options.sham        - add a flag to not completely full polyfills
  options.enumerable  - export as enumerable property
  options.noTargetGet - prevent calling a getter on target
*/
module.exports = function (options, source) {
  var TARGET = options.target;
  var GLOBAL = options.global;
  var STATIC = options.stat;
  var FORCED, target, key, targetProperty, sourceProperty, descriptor;
  if (GLOBAL) {
    target = global;
  } else if (STATIC) {
    target = global[TARGET] || setGlobal(TARGET, {});
  } else {
    target = (global[TARGET] || {}).prototype;
  }
  if (target) for (key in source) {
    sourceProperty = source[key];
    if (options.noTargetGet) {
      descriptor = getOwnPropertyDescriptor(target, key);
      targetProperty = descriptor && descriptor.value;
    } else targetProperty = target[key];
    FORCED = isForced(GLOBAL ? key : TARGET + (STATIC ? '.' : '#') + key, options.forced);
    // contained in target
    if (!FORCED && targetProperty !== undefined) {
      if (typeof sourceProperty === typeof targetProperty) continue;
      copyConstructorProperties(sourceProperty, targetProperty);
    }
    // add a flag to not completely full polyfills
    if (options.sham || (targetProperty && targetProperty.sham)) {
      createNonEnumerableProperty(sourceProperty, 'sham', true);
    }
    // extend global
    redefine(target, key, sourceProperty, options);
  }
};


/***/ }),

/***/ "241c":
/***/ (function(module, exports, __webpack_require__) {

var internalObjectKeys = __webpack_require__("ca84");
var enumBugKeys = __webpack_require__("7839");

var hiddenKeys = enumBugKeys.concat('length', 'prototype');

// `Object.getOwnPropertyNames` method
// https://tc39.github.io/ecma262/#sec-object.getownpropertynames
exports.f = Object.getOwnPropertyNames || function getOwnPropertyNames(O) {
  return internalObjectKeys(O, hiddenKeys);
};


/***/ }),

/***/ "2444":
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(process) {

var utils = __webpack_require__("c532");
var normalizeHeaderName = __webpack_require__("c8af");

var DEFAULT_CONTENT_TYPE = {
  'Content-Type': 'application/x-www-form-urlencoded'
};

function setContentTypeIfUnset(headers, value) {
  if (!utils.isUndefined(headers) && utils.isUndefined(headers['Content-Type'])) {
    headers['Content-Type'] = value;
  }
}

function getDefaultAdapter() {
  var adapter;
  // Only Node.JS has a process variable that is of [[Class]] process
  if (typeof process !== 'undefined' && Object.prototype.toString.call(process) === '[object process]') {
    // For node use HTTP adapter
    adapter = __webpack_require__("b50d");
  } else if (typeof XMLHttpRequest !== 'undefined') {
    // For browsers use XHR adapter
    adapter = __webpack_require__("b50d");
  }
  return adapter;
}

var defaults = {
  adapter: getDefaultAdapter(),

  transformRequest: [function transformRequest(data, headers) {
    normalizeHeaderName(headers, 'Accept');
    normalizeHeaderName(headers, 'Content-Type');
    if (utils.isFormData(data) ||
      utils.isArrayBuffer(data) ||
      utils.isBuffer(data) ||
      utils.isStream(data) ||
      utils.isFile(data) ||
      utils.isBlob(data)
    ) {
      return data;
    }
    if (utils.isArrayBufferView(data)) {
      return data.buffer;
    }
    if (utils.isURLSearchParams(data)) {
      setContentTypeIfUnset(headers, 'application/x-www-form-urlencoded;charset=utf-8');
      return data.toString();
    }
    if (utils.isObject(data)) {
      setContentTypeIfUnset(headers, 'application/json;charset=utf-8');
      return JSON.stringify(data);
    }
    return data;
  }],

  transformResponse: [function transformResponse(data) {
    /*eslint no-param-reassign:0*/
    if (typeof data === 'string') {
      try {
        data = JSON.parse(data);
      } catch (e) { /* Ignore */ }
    }
    return data;
  }],

  /**
   * A timeout in milliseconds to abort a request. If set to 0 (default) a
   * timeout is not created.
   */
  timeout: 0,

  xsrfCookieName: 'XSRF-TOKEN',
  xsrfHeaderName: 'X-XSRF-TOKEN',

  maxContentLength: -1,

  validateStatus: function validateStatus(status) {
    return status >= 200 && status < 300;
  }
};

defaults.headers = {
  common: {
    'Accept': 'application/json, text/plain, */*'
  }
};

utils.forEach(['delete', 'get', 'head'], function forEachMethodNoData(method) {
  defaults.headers[method] = {};
});

utils.forEach(['post', 'put', 'patch'], function forEachMethodWithData(method) {
  defaults.headers[method] = utils.merge(DEFAULT_CONTENT_TYPE);
});

module.exports = defaults;

/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__("4362")))

/***/ }),

/***/ "2532":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var $ = __webpack_require__("23e7");
var notARegExp = __webpack_require__("5a34");
var requireObjectCoercible = __webpack_require__("1d80");
var correctIsRegExpLogic = __webpack_require__("ab13");

// `String.prototype.includes` method
// https://tc39.github.io/ecma262/#sec-string.prototype.includes
$({ target: 'String', proto: true, forced: !correctIsRegExpLogic('includes') }, {
  includes: function includes(searchString /* , position = 0 */) {
    return !!~String(requireObjectCoercible(this))
      .indexOf(notARegExp(searchString), arguments.length > 1 ? arguments[1] : undefined);
  }
});


/***/ }),

/***/ "25f0":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var redefine = __webpack_require__("6eeb");
var anObject = __webpack_require__("825a");
var fails = __webpack_require__("d039");
var flags = __webpack_require__("ad6d");

var TO_STRING = 'toString';
var RegExpPrototype = RegExp.prototype;
var nativeToString = RegExpPrototype[TO_STRING];

var NOT_GENERIC = fails(function () { return nativeToString.call({ source: 'a', flags: 'b' }) != '/a/b'; });
// FF44- RegExp#toString has a wrong name
var INCORRECT_NAME = nativeToString.name != TO_STRING;

// `RegExp.prototype.toString` method
// https://tc39.github.io/ecma262/#sec-regexp.prototype.tostring
if (NOT_GENERIC || INCORRECT_NAME) {
  redefine(RegExp.prototype, TO_STRING, function toString() {
    var R = anObject(this);
    var p = String(R.source);
    var rf = R.flags;
    var f = String(rf === undefined && R instanceof RegExp && !('flags' in RegExpPrototype) ? flags.call(R) : rf);
    return '/' + p + '/' + f;
  }, { unsafe: true });
}


/***/ }),

/***/ "2626":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var getBuiltIn = __webpack_require__("d066");
var definePropertyModule = __webpack_require__("9bf2");
var wellKnownSymbol = __webpack_require__("b622");
var DESCRIPTORS = __webpack_require__("83ab");

var SPECIES = wellKnownSymbol('species');

module.exports = function (CONSTRUCTOR_NAME) {
  var Constructor = getBuiltIn(CONSTRUCTOR_NAME);
  var defineProperty = definePropertyModule.f;

  if (DESCRIPTORS && Constructor && !Constructor[SPECIES]) {
    defineProperty(Constructor, SPECIES, {
      configurable: true,
      get: function () { return this; }
    });
  }
};


/***/ }),

/***/ "2c1a":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return createWorker; });
/* harmony import */ var regenerator_runtime_runtime__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("96cf");
/* harmony import */ var regenerator_runtime_runtime__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(regenerator_runtime_runtime__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var D_workspace_meetnow_node_modules_babel_runtime_helpers_esm_asyncToGenerator__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("1da1");
/* harmony import */ var debug__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__("3ded");
/* harmony import */ var debug__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(debug__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var ___WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__("04c9");




var log = debug__WEBPACK_IMPORTED_MODULE_2___default()('MN:Worker');
function createWorker(config) {
  var running = false;
  var working = false;
  var interval = 0;
  var times = 0;
  var timeout;
  var _config$interval = config.interval,
      nextInterval = _config$interval === void 0 ? interval : _config$interval,
      work = config.work,
      cancel = config.cancel;

  function job() {
    return _job.apply(this, arguments);
  }

  function _job() {
    _job = Object(D_workspace_meetnow_node_modules_babel_runtime_helpers_esm_asyncToGenerator__WEBPACK_IMPORTED_MODULE_1__[/* default */ "a"])(
    /*#__PURE__*/
    regeneratorRuntime.mark(function _callee() {
      var immediate,
          _args = arguments;
      return regeneratorRuntime.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              immediate = _args.length > 0 && _args[0] !== undefined ? _args[0] : true;

              if (!(work && immediate)) {
                _context.next = 6;
                break;
              }

              working = true;
              _context.next = 5;
              return work(times++);

            case 5:
              working = false;

            case 6:
              if (running) {
                _context.next = 8;
                break;
              }

              return _context.abrupt("return");

            case 8:
              interval = Object(___WEBPACK_IMPORTED_MODULE_3__[/* isFunction */ "f"])(nextInterval) ? nextInterval() : nextInterval; // schedule next

              timeout = setTimeout(job, interval);

            case 10:
            case "end":
              return _context.stop();
          }
        }
      }, _callee);
    }));
    return _job.apply(this, arguments);
  }

  function start() {
    return _start.apply(this, arguments);
  }

  function _start() {
    _start = Object(D_workspace_meetnow_node_modules_babel_runtime_helpers_esm_asyncToGenerator__WEBPACK_IMPORTED_MODULE_1__[/* default */ "a"])(
    /*#__PURE__*/
    regeneratorRuntime.mark(function _callee2() {
      var immediate,
          _args2 = arguments;
      return regeneratorRuntime.wrap(function _callee2$(_context2) {
        while (1) {
          switch (_context2.prev = _context2.next) {
            case 0:
              immediate = _args2.length > 0 && _args2[0] !== undefined ? _args2[0] : true;
              log('start()');

              if (!running) {
                _context2.next = 4;
                break;
              }

              return _context2.abrupt("return");

            case 4:
              running = true;
              _context2.next = 7;
              return job(immediate);

            case 7:
            case "end":
              return _context2.stop();
          }
        }
      }, _callee2);
    }));
    return _start.apply(this, arguments);
  }

  function stop() {
    log('stop()');
    if (!running) return;

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
    config: config,

    get running() {
      return running;
    },

    start: start,
    stop: stop
  };
}

/***/ }),

/***/ "2cf4":
/***/ (function(module, exports, __webpack_require__) {

var global = __webpack_require__("da84");
var fails = __webpack_require__("d039");
var classof = __webpack_require__("c6b6");
var bind = __webpack_require__("f8c2");
var html = __webpack_require__("1be4");
var createElement = __webpack_require__("cc12");
var userAgent = __webpack_require__("b39a");

var location = global.location;
var set = global.setImmediate;
var clear = global.clearImmediate;
var process = global.process;
var MessageChannel = global.MessageChannel;
var Dispatch = global.Dispatch;
var counter = 0;
var queue = {};
var ONREADYSTATECHANGE = 'onreadystatechange';
var defer, channel, port;

var run = function (id) {
  // eslint-disable-next-line no-prototype-builtins
  if (queue.hasOwnProperty(id)) {
    var fn = queue[id];
    delete queue[id];
    fn();
  }
};

var runner = function (id) {
  return function () {
    run(id);
  };
};

var listener = function (event) {
  run(event.data);
};

var post = function (id) {
  // old engines have not location.origin
  global.postMessage(id + '', location.protocol + '//' + location.host);
};

// Node.js 0.9+ & IE10+ has setImmediate, otherwise:
if (!set || !clear) {
  set = function setImmediate(fn) {
    var args = [];
    var i = 1;
    while (arguments.length > i) args.push(arguments[i++]);
    queue[++counter] = function () {
      // eslint-disable-next-line no-new-func
      (typeof fn == 'function' ? fn : Function(fn)).apply(undefined, args);
    };
    defer(counter);
    return counter;
  };
  clear = function clearImmediate(id) {
    delete queue[id];
  };
  // Node.js 0.8-
  if (classof(process) == 'process') {
    defer = function (id) {
      process.nextTick(runner(id));
    };
  // Sphere (JS game engine) Dispatch API
  } else if (Dispatch && Dispatch.now) {
    defer = function (id) {
      Dispatch.now(runner(id));
    };
  // Browsers with MessageChannel, includes WebWorkers
  // except iOS - https://github.com/zloirock/core-js/issues/624
  } else if (MessageChannel && !/(iphone|ipod|ipad).*applewebkit/i.test(userAgent)) {
    channel = new MessageChannel();
    port = channel.port2;
    channel.port1.onmessage = listener;
    defer = bind(port.postMessage, port, 1);
  // Browsers with postMessage, skip WebWorkers
  // IE8 has postMessage, but it's sync & typeof its postMessage is 'object'
  } else if (global.addEventListener && typeof postMessage == 'function' && !global.importScripts && !fails(post)) {
    defer = post;
    global.addEventListener('message', listener, false);
  // IE8-
  } else if (ONREADYSTATECHANGE in createElement('script')) {
    defer = function (id) {
      html.appendChild(createElement('script'))[ONREADYSTATECHANGE] = function () {
        html.removeChild(this);
        run(id);
      };
    };
  // Rest old browsers
  } else {
    defer = function (id) {
      setTimeout(runner(id), 0);
    };
  }
}

module.exports = {
  set: set,
  clear: clear
};


/***/ }),

/***/ "2d83":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var enhanceError = __webpack_require__("387f");

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
module.exports = function createError(message, config, code, request, response) {
  var error = new Error(message);
  return enhanceError(error, config, code, request, response);
};


/***/ }),

/***/ "2e67":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


module.exports = function isCancel(value) {
  return !!(value && value.__CANCEL__);
};


/***/ }),

/***/ "30b5":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var utils = __webpack_require__("c532");

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
module.exports = function buildURL(url, params, paramsSerializer) {
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


/***/ }),

/***/ "3174":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
var chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/='; // btoa

function btoa(input) {
  var str = String(input); // initialize result and counter

  var block;
  var charCode;
  var idx = 0;
  var map = chars;
  var output = '';
  /* eslint-disable no-cond-assign, no-bitwise, no-mixed-operators */

  for (; // if the next str index does not exist:
  //   change the mapping table to "="
  //   check if d has no fractional digits
  str.charAt(idx | 0) || (map = '=', idx % 1); // "8 - idx % 1 * 8" generates the sequence 2, 4, 6, 8
  output += map.charAt(63 & block >> 8 - idx % 1 * 8)) {
    charCode = str.charCodeAt(idx += 3 / 4);

    if (charCode > 0xFF) {
      throw new Error('"btoa" failed: The string to be encoded contains characters outside of the Latin1 range.');
    }

    block = block << 8 | charCode;
  }

  return output;
}

/* harmony default export */ __webpack_exports__["a"] = (btoa);

/***/ }),

/***/ "3410":
/***/ (function(module, exports, __webpack_require__) {

var $ = __webpack_require__("23e7");
var fails = __webpack_require__("d039");
var toObject = __webpack_require__("7b0b");
var nativeGetPrototypeOf = __webpack_require__("e163");
var CORRECT_PROTOTYPE_GETTER = __webpack_require__("e177");

var FAILS_ON_PRIMITIVES = fails(function () { nativeGetPrototypeOf(1); });

// `Object.getPrototypeOf` method
// https://tc39.github.io/ecma262/#sec-object.getprototypeof
$({ target: 'Object', stat: true, forced: FAILS_ON_PRIMITIVES, sham: !CORRECT_PROTOTYPE_GETTER }, {
  getPrototypeOf: function getPrototypeOf(it) {
    return nativeGetPrototypeOf(toObject(it));
  }
});



/***/ }),

/***/ "344a":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return createTempAuth; });
/* harmony import */ var regenerator_runtime_runtime__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("96cf");
/* harmony import */ var regenerator_runtime_runtime__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(regenerator_runtime_runtime__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var D_workspace_meetnow_node_modules_babel_runtime_helpers_esm_asyncToGenerator__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("1da1");
/* harmony import */ var _user_api__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__("f6b8");
/* harmony import */ var _utils_worker__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__("2c1a");




/* eslint-disable no-use-before-define */

function createTempAuth(_x) {
  return _createTempAuth.apply(this, arguments);
}

function _createTempAuth() {
  _createTempAuth = Object(D_workspace_meetnow_node_modules_babel_runtime_helpers_esm_asyncToGenerator__WEBPACK_IMPORTED_MODULE_1__[/* default */ "a"])(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee3(partyId) {
    var token, api, worker, auth, _auth, invalid, _invalid;

    return regeneratorRuntime.wrap(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            _invalid = function _ref4() {
              _invalid = Object(D_workspace_meetnow_node_modules_babel_runtime_helpers_esm_asyncToGenerator__WEBPACK_IMPORTED_MODULE_1__[/* default */ "a"])(
              /*#__PURE__*/
              regeneratorRuntime.mark(function _callee2() {
                return regeneratorRuntime.wrap(function _callee2$(_context2) {
                  while (1) {
                    switch (_context2.prev = _context2.next) {
                      case 0:
                        worker.stop();
                        token = undefined;

                      case 2:
                      case "end":
                        return _context2.stop();
                    }
                  }
                }, _callee2);
              }));
              return _invalid.apply(this, arguments);
            };

            invalid = function _ref3() {
              return _invalid.apply(this, arguments);
            };

            _auth = function _ref2() {
              _auth = Object(D_workspace_meetnow_node_modules_babel_runtime_helpers_esm_asyncToGenerator__WEBPACK_IMPORTED_MODULE_1__[/* default */ "a"])(
              /*#__PURE__*/
              regeneratorRuntime.mark(function _callee() {
                var response;
                return regeneratorRuntime.wrap(function _callee$(_context) {
                  while (1) {
                    switch (_context.prev = _context.next) {
                      case 0:
                        _context.next = 2;
                        return api.request('getVirtualJWT').params({
                          id: partyId
                        }).send();

                      case 2:
                        response = _context.sent;
                        token = response.data.data.token;

                        if (token) {
                          _context.next = 6;
                          break;
                        }

                        throw new Error('Authorization Error');

                      case 6:
                      case "end":
                        return _context.stop();
                    }
                  }
                }, _callee);
              }));
              return _auth.apply(this, arguments);
            };

            auth = function _ref() {
              return _auth.apply(this, arguments);
            };

            // create api
            api = Object(_user_api__WEBPACK_IMPORTED_MODULE_2__[/* createUserApi */ "a"])(function () {
              return token;
            }); // try auth

            _context3.next = 7;
            return auth();

          case 7:
            // creat auth() worker
            worker = Object(_utils_worker__WEBPACK_IMPORTED_MODULE_3__[/* createWorker */ "a"])({
              interval: 5 * 60 * 1000,
              work: auth
            }); // start worker

            worker.start(false);
            _context3.t0 = api;
            _context3.t1 = worker;
            _context3.t2 = invalid;
            return _context3.abrupt("return", {
              get token() {
                return token;
              },

              api: _context3.t0,
              worker: _context3.t1,
              invalid: _context3.t2
            });

          case 13:
          case "end":
            return _context3.stop();
        }
      }
    }, _callee3);
  }));
  return _createTempAuth.apply(this, arguments);
}

/***/ }),

/***/ "35a1":
/***/ (function(module, exports, __webpack_require__) {

var classof = __webpack_require__("f5df");
var Iterators = __webpack_require__("3f8c");
var wellKnownSymbol = __webpack_require__("b622");

var ITERATOR = wellKnownSymbol('iterator');

module.exports = function (it) {
  if (it != undefined) return it[ITERATOR]
    || it['@@iterator']
    || Iterators[classof(it)];
};


/***/ }),

/***/ "37e8":
/***/ (function(module, exports, __webpack_require__) {

var DESCRIPTORS = __webpack_require__("83ab");
var definePropertyModule = __webpack_require__("9bf2");
var anObject = __webpack_require__("825a");
var objectKeys = __webpack_require__("df75");

// `Object.defineProperties` method
// https://tc39.github.io/ecma262/#sec-object.defineproperties
module.exports = DESCRIPTORS ? Object.defineProperties : function defineProperties(O, Properties) {
  anObject(O);
  var keys = objectKeys(Properties);
  var length = keys.length;
  var index = 0;
  var key;
  while (length > index) definePropertyModule.f(O, key = keys[index++], Properties[key]);
  return O;
};


/***/ }),

/***/ "387f":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


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
module.exports = function enhanceError(error, config, code, request, response) {
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


/***/ }),

/***/ "3934":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var utils = __webpack_require__("c532");

module.exports = (
  utils.isStandardBrowserEnv() ?

  // Standard browser envs have full support of the APIs needed to test
  // whether the request URL is of the same origin as current location.
    (function standardBrowserEnv() {
      var msie = /(msie|trident)/i.test(navigator.userAgent);
      var urlParsingNode = document.createElement('a');
      var originURL;

      /**
    * Parse a URL to discover it's components
    *
    * @param {String} url The URL to be parsed
    * @returns {Object}
    */
      function resolveURL(url) {
        var href = url;

        if (msie) {
        // IE needs attribute set twice to normalize properties
          urlParsingNode.setAttribute('href', href);
          href = urlParsingNode.href;
        }

        urlParsingNode.setAttribute('href', href);

        // urlParsingNode provides the UrlUtils interface - http://url.spec.whatwg.org/#urlutils
        return {
          href: urlParsingNode.href,
          protocol: urlParsingNode.protocol ? urlParsingNode.protocol.replace(/:$/, '') : '',
          host: urlParsingNode.host,
          search: urlParsingNode.search ? urlParsingNode.search.replace(/^\?/, '') : '',
          hash: urlParsingNode.hash ? urlParsingNode.hash.replace(/^#/, '') : '',
          hostname: urlParsingNode.hostname,
          port: urlParsingNode.port,
          pathname: (urlParsingNode.pathname.charAt(0) === '/') ?
            urlParsingNode.pathname :
            '/' + urlParsingNode.pathname
        };
      }

      originURL = resolveURL(window.location.href);

      /**
    * Determine if a URL shares the same origin as the current location
    *
    * @param {String} requestURL The URL to test
    * @returns {boolean} True if URL shares the same origin, otherwise false
    */
      return function isURLSameOrigin(requestURL) {
        var parsed = (utils.isString(requestURL)) ? resolveURL(requestURL) : requestURL;
        return (parsed.protocol === originURL.protocol &&
            parsed.host === originURL.host);
      };
    })() :

  // Non standard browser envs (web workers, react-native) lack needed support.
    (function nonStandardBrowserEnv() {
      return function isURLSameOrigin() {
        return true;
      };
    })()
);


/***/ }),

/***/ "3bbe":
/***/ (function(module, exports, __webpack_require__) {

var isObject = __webpack_require__("861d");

module.exports = function (it) {
  if (!isObject(it) && it !== null) {
    throw TypeError("Can't set " + String(it) + ' as a prototype');
  } return it;
};


/***/ }),

/***/ "3ca3":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var charAt = __webpack_require__("6547").charAt;
var InternalStateModule = __webpack_require__("69f3");
var defineIterator = __webpack_require__("7dd0");

var STRING_ITERATOR = 'String Iterator';
var setInternalState = InternalStateModule.set;
var getInternalState = InternalStateModule.getterFor(STRING_ITERATOR);

// `String.prototype[@@iterator]` method
// https://tc39.github.io/ecma262/#sec-string.prototype-@@iterator
defineIterator(String, 'String', function (iterated) {
  setInternalState(this, {
    type: STRING_ITERATOR,
    string: String(iterated),
    index: 0
  });
// `%StringIteratorPrototype%.next` method
// https://tc39.github.io/ecma262/#sec-%stringiteratorprototype%.next
}, function next() {
  var state = getInternalState(this);
  var string = state.string;
  var index = state.index;
  var point;
  if (index >= string.length) return { value: undefined, done: true };
  point = charAt(string, index);
  state.index += point.length;
  return { value: point, done: false };
});


/***/ }),

/***/ "3ded":
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(process) {/* eslint-env browser */

/**
 * This is the web browser implementation of `debug()`.
 */

exports.log = log;
exports.formatArgs = formatArgs;
exports.save = save;
exports.load = load;
exports.useColors = useColors;
exports.storage = localstorage();

/**
 * Colors.
 */

exports.colors = [
	'#0000CC',
	'#0000FF',
	'#0033CC',
	'#0033FF',
	'#0066CC',
	'#0066FF',
	'#0099CC',
	'#0099FF',
	'#00CC00',
	'#00CC33',
	'#00CC66',
	'#00CC99',
	'#00CCCC',
	'#00CCFF',
	'#3300CC',
	'#3300FF',
	'#3333CC',
	'#3333FF',
	'#3366CC',
	'#3366FF',
	'#3399CC',
	'#3399FF',
	'#33CC00',
	'#33CC33',
	'#33CC66',
	'#33CC99',
	'#33CCCC',
	'#33CCFF',
	'#6600CC',
	'#6600FF',
	'#6633CC',
	'#6633FF',
	'#66CC00',
	'#66CC33',
	'#9900CC',
	'#9900FF',
	'#9933CC',
	'#9933FF',
	'#99CC00',
	'#99CC33',
	'#CC0000',
	'#CC0033',
	'#CC0066',
	'#CC0099',
	'#CC00CC',
	'#CC00FF',
	'#CC3300',
	'#CC3333',
	'#CC3366',
	'#CC3399',
	'#CC33CC',
	'#CC33FF',
	'#CC6600',
	'#CC6633',
	'#CC9900',
	'#CC9933',
	'#CCCC00',
	'#CCCC33',
	'#FF0000',
	'#FF0033',
	'#FF0066',
	'#FF0099',
	'#FF00CC',
	'#FF00FF',
	'#FF3300',
	'#FF3333',
	'#FF3366',
	'#FF3399',
	'#FF33CC',
	'#FF33FF',
	'#FF6600',
	'#FF6633',
	'#FF9900',
	'#FF9933',
	'#FFCC00',
	'#FFCC33'
];

/**
 * Currently only WebKit-based Web Inspectors, Firefox >= v31,
 * and the Firebug extension (any Firefox version) are known
 * to support "%c" CSS customizations.
 *
 * TODO: add a `localStorage` variable to explicitly enable/disable colors
 */

// eslint-disable-next-line complexity
function useColors() {
	// NB: In an Electron preload script, document will be defined but not fully
	// initialized. Since we know we're in Chrome, we'll just detect this case
	// explicitly
	if (typeof window !== 'undefined' && window.process && (window.process.type === 'renderer' || window.process.__nwjs)) {
		return true;
	}

	// Internet Explorer and Edge do not support colors.
	if (typeof navigator !== 'undefined' && navigator.userAgent && navigator.userAgent.toLowerCase().match(/(edge|trident)\/(\d+)/)) {
		return false;
	}

	// Is webkit? http://stackoverflow.com/a/16459606/376773
	// document is undefined in react-native: https://github.com/facebook/react-native/pull/1632
	return (typeof document !== 'undefined' && document.documentElement && document.documentElement.style && document.documentElement.style.WebkitAppearance) ||
		// Is firebug? http://stackoverflow.com/a/398120/376773
		(typeof window !== 'undefined' && window.console && (window.console.firebug || (window.console.exception && window.console.table))) ||
		// Is firefox >= v31?
		// https://developer.mozilla.org/en-US/docs/Tools/Web_Console#Styling_messages
		(typeof navigator !== 'undefined' && navigator.userAgent && navigator.userAgent.toLowerCase().match(/firefox\/(\d+)/) && parseInt(RegExp.$1, 10) >= 31) ||
		// Double check webkit in userAgent just in case we are in a worker
		(typeof navigator !== 'undefined' && navigator.userAgent && navigator.userAgent.toLowerCase().match(/applewebkit\/(\d+)/));
}

/**
 * Colorize log arguments if enabled.
 *
 * @api public
 */

function formatArgs(args) {
	args[0] = (this.useColors ? '%c' : '') +
		this.namespace +
		(this.useColors ? ' %c' : ' ') +
		args[0] +
		(this.useColors ? '%c ' : ' ') +
		'+' + module.exports.humanize(this.diff);

	if (!this.useColors) {
		return;
	}

	const c = 'color: ' + this.color;
	args.splice(1, 0, c, 'color: inherit');

	// The final "%c" is somewhat tricky, because there could be other
	// arguments passed either before or after the %c, so we need to
	// figure out the correct index to insert the CSS into
	let index = 0;
	let lastC = 0;
	args[0].replace(/%[a-zA-Z%]/g, match => {
		if (match === '%%') {
			return;
		}
		index++;
		if (match === '%c') {
			// We only are interested in the *last* %c
			// (the user may have provided their own)
			lastC = index;
		}
	});

	args.splice(lastC, 0, c);
}

/**
 * Invokes `console.log()` when available.
 * No-op when `console.log` is not a "function".
 *
 * @api public
 */
function log(...args) {
	// This hackery is required for IE8/9, where
	// the `console.log` function doesn't have 'apply'
	return typeof console === 'object' &&
		console.log &&
		console.log(...args);
}

/**
 * Save `namespaces`.
 *
 * @param {String} namespaces
 * @api private
 */
function save(namespaces) {
	try {
		if (namespaces) {
			exports.storage.setItem('debug', namespaces);
		} else {
			exports.storage.removeItem('debug');
		}
	} catch (error) {
		// Swallow
		// XXX (@Qix-) should we be logging these?
	}
}

/**
 * Load `namespaces`.
 *
 * @return {String} returns the previously persisted debug modes
 * @api private
 */
function load() {
	let r;
	try {
		r = exports.storage.getItem('debug');
	} catch (error) {
		// Swallow
		// XXX (@Qix-) should we be logging these?
	}

	// If debug isn't set in LS, and we're in Electron, try to load $DEBUG
	if (!r && typeof process !== 'undefined' && 'env' in process) {
		r = Object({"NODE_ENV":"production","BASE_URL":"/"}).DEBUG;
	}

	return r;
}

/**
 * Localstorage attempts to return the localstorage.
 *
 * This is necessary because safari throws
 * when a user disables cookies/localstorage
 * and you attempt to access it.
 *
 * @return {LocalStorage}
 * @api private
 */

function localstorage() {
	try {
		// TVMLKit (Apple TV JS Runtime) does not have a window object, just localStorage in the global context
		// The Browser also has localStorage in the global context.
		return localStorage;
	} catch (error) {
		// Swallow
		// XXX (@Qix-) should we be logging these?
	}
}

module.exports = __webpack_require__("a145")(exports);

const {formatters} = module.exports;

/**
 * Map %j to `JSON.stringify()`, since no Web Inspectors do that by default.
 */

formatters.j = function (v) {
	try {
		return JSON.stringify(v);
	} catch (error) {
		return '[UnexpectedJSONParseError]: ' + error.message;
	}
};

/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__("4362")))

/***/ }),

/***/ "3f8c":
/***/ (function(module, exports) {

module.exports = {};


/***/ }),

/***/ "428f":
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__("da84");


/***/ }),

/***/ "4362":
/***/ (function(module, exports, __webpack_require__) {

exports.nextTick = function nextTick(fn) {
    var args = Array.prototype.slice.call(arguments);
    args.shift();
    setTimeout(function () {
        fn.apply(null, args);
    }, 0);
};

exports.platform = exports.arch = 
exports.execPath = exports.title = 'browser';
exports.pid = 1;
exports.browser = true;
exports.env = {};
exports.argv = [];

exports.binding = function (name) {
	throw new Error('No such module. (Possibly not yet loaded)')
};

(function () {
    var cwd = '/';
    var path;
    exports.cwd = function () { return cwd };
    exports.chdir = function (dir) {
        if (!path) path = __webpack_require__("df7c");
        cwd = path.resolve(dir, cwd);
    };
})();

exports.exit = exports.kill = 
exports.umask = exports.dlopen = 
exports.uptime = exports.memoryUsage = 
exports.uvCounters = function() {};
exports.features = {};


/***/ }),

/***/ "44ad":
/***/ (function(module, exports, __webpack_require__) {

var fails = __webpack_require__("d039");
var classof = __webpack_require__("c6b6");

var split = ''.split;

// fallback for non-array-like ES3 and non-enumerable old V8 strings
module.exports = fails(function () {
  // throws an error in rhino, see https://github.com/mozilla/rhino/issues/346
  // eslint-disable-next-line no-prototype-builtins
  return !Object('z').propertyIsEnumerable(0);
}) ? function (it) {
  return classof(it) == 'String' ? split.call(it, '') : Object(it);
} : Object;


/***/ }),

/***/ "44d2":
/***/ (function(module, exports, __webpack_require__) {

var wellKnownSymbol = __webpack_require__("b622");
var create = __webpack_require__("7c73");
var createNonEnumerableProperty = __webpack_require__("9112");

var UNSCOPABLES = wellKnownSymbol('unscopables');
var ArrayPrototype = Array.prototype;

// Array.prototype[@@unscopables]
// https://tc39.github.io/ecma262/#sec-array.prototype-@@unscopables
if (ArrayPrototype[UNSCOPABLES] == undefined) {
  createNonEnumerableProperty(ArrayPrototype, UNSCOPABLES, create(null));
}

// add a key to Array.prototype[@@unscopables]
module.exports = function (key) {
  ArrayPrototype[UNSCOPABLES][key] = true;
};


/***/ }),

/***/ "44de":
/***/ (function(module, exports, __webpack_require__) {

var global = __webpack_require__("da84");

module.exports = function (a, b) {
  var console = global.console;
  if (console && console.error) {
    arguments.length === 1 ? console.error(a) : console.error(a, b);
  }
};


/***/ }),

/***/ "44e7":
/***/ (function(module, exports, __webpack_require__) {

var isObject = __webpack_require__("861d");
var classof = __webpack_require__("c6b6");
var wellKnownSymbol = __webpack_require__("b622");

var MATCH = wellKnownSymbol('match');

// `IsRegExp` abstract operation
// https://tc39.github.io/ecma262/#sec-isregexp
module.exports = function (it) {
  var isRegExp;
  return isObject(it) && ((isRegExp = it[MATCH]) !== undefined ? !!isRegExp : classof(it) == 'RegExp');
};


/***/ }),

/***/ "466d":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var fixRegExpWellKnownSymbolLogic = __webpack_require__("d784");
var anObject = __webpack_require__("825a");
var toLength = __webpack_require__("50c4");
var requireObjectCoercible = __webpack_require__("1d80");
var advanceStringIndex = __webpack_require__("8aa5");
var regExpExec = __webpack_require__("14c3");

// @@match logic
fixRegExpWellKnownSymbolLogic('match', 1, function (MATCH, nativeMatch, maybeCallNative) {
  return [
    // `String.prototype.match` method
    // https://tc39.github.io/ecma262/#sec-string.prototype.match
    function match(regexp) {
      var O = requireObjectCoercible(this);
      var matcher = regexp == undefined ? undefined : regexp[MATCH];
      return matcher !== undefined ? matcher.call(regexp, O) : new RegExp(regexp)[MATCH](String(O));
    },
    // `RegExp.prototype[@@match]` method
    // https://tc39.github.io/ecma262/#sec-regexp.prototype-@@match
    function (regexp) {
      var res = maybeCallNative(nativeMatch, regexp, this);
      if (res.done) return res.value;

      var rx = anObject(regexp);
      var S = String(this);

      if (!rx.global) return regExpExec(rx, S);

      var fullUnicode = rx.unicode;
      rx.lastIndex = 0;
      var A = [];
      var n = 0;
      var result;
      while ((result = regExpExec(rx, S)) !== null) {
        var matchStr = String(result[0]);
        A[n] = matchStr;
        if (matchStr === '') rx.lastIndex = advanceStringIndex(S, toLength(rx.lastIndex), fullUnicode);
        n++;
      }
      return n === 0 ? null : A;
    }
  ];
});


/***/ }),

/***/ "467f":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var createError = __webpack_require__("2d83");

/**
 * Resolve or reject a Promise based on response status.
 *
 * @param {Function} resolve A function that resolves the promise.
 * @param {Function} reject A function that rejects the promise.
 * @param {object} response The response.
 */
module.exports = function settle(resolve, reject, response) {
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


/***/ }),

/***/ "4840":
/***/ (function(module, exports, __webpack_require__) {

var anObject = __webpack_require__("825a");
var aFunction = __webpack_require__("1c0b");
var wellKnownSymbol = __webpack_require__("b622");

var SPECIES = wellKnownSymbol('species');

// `SpeciesConstructor` abstract operation
// https://tc39.github.io/ecma262/#sec-speciesconstructor
module.exports = function (O, defaultConstructor) {
  var C = anObject(O).constructor;
  var S;
  return C === undefined || (S = anObject(C)[SPECIES]) == undefined ? defaultConstructor : aFunction(S);
};


/***/ }),

/***/ "4930":
/***/ (function(module, exports, __webpack_require__) {

var fails = __webpack_require__("d039");

module.exports = !!Object.getOwnPropertySymbols && !fails(function () {
  // Chrome 38 Symbol has incorrect toString conversion
  // eslint-disable-next-line no-undef
  return !String(Symbol());
});


/***/ }),

/***/ "4a7b":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var utils = __webpack_require__("c532");

/**
 * Config-specific merge-function which creates a new config-object
 * by merging two configuration objects together.
 *
 * @param {Object} config1
 * @param {Object} config2
 * @returns {Object} New object resulting from merging config2 to config1
 */
module.exports = function mergeConfig(config1, config2) {
  // eslint-disable-next-line no-param-reassign
  config2 = config2 || {};
  var config = {};

  utils.forEach(['url', 'method', 'params', 'data'], function valueFromConfig2(prop) {
    if (typeof config2[prop] !== 'undefined') {
      config[prop] = config2[prop];
    }
  });

  utils.forEach(['headers', 'auth', 'proxy'], function mergeDeepProperties(prop) {
    if (utils.isObject(config2[prop])) {
      config[prop] = utils.deepMerge(config1[prop], config2[prop]);
    } else if (typeof config2[prop] !== 'undefined') {
      config[prop] = config2[prop];
    } else if (utils.isObject(config1[prop])) {
      config[prop] = utils.deepMerge(config1[prop]);
    } else if (typeof config1[prop] !== 'undefined') {
      config[prop] = config1[prop];
    }
  });

  utils.forEach([
    'baseURL', 'transformRequest', 'transformResponse', 'paramsSerializer',
    'timeout', 'withCredentials', 'adapter', 'responseType', 'xsrfCookieName',
    'xsrfHeaderName', 'onUploadProgress', 'onDownloadProgress', 'maxContentLength',
    'validateStatus', 'maxRedirects', 'httpAgent', 'httpsAgent', 'cancelToken',
    'socketPath'
  ], function defaultToConfig2(prop) {
    if (typeof config2[prop] !== 'undefined') {
      config[prop] = config2[prop];
    } else if (typeof config1[prop] !== 'undefined') {
      config[prop] = config1[prop];
    }
  });

  return config;
};


/***/ }),

/***/ "4ae1":
/***/ (function(module, exports, __webpack_require__) {

var $ = __webpack_require__("23e7");
var getBuiltIn = __webpack_require__("d066");
var aFunction = __webpack_require__("1c0b");
var anObject = __webpack_require__("825a");
var isObject = __webpack_require__("861d");
var create = __webpack_require__("7c73");
var bind = __webpack_require__("0538");
var fails = __webpack_require__("d039");

var nativeConstruct = getBuiltIn('Reflect', 'construct');

// `Reflect.construct` method
// https://tc39.github.io/ecma262/#sec-reflect.construct
// MS Edge supports only 2 arguments and argumentsList argument is optional
// FF Nightly sets third argument as `new.target`, but does not create `this` from it
var NEW_TARGET_BUG = fails(function () {
  function F() { /* empty */ }
  return !(nativeConstruct(function () { /* empty */ }, [], F) instanceof F);
});
var ARGS_BUG = !fails(function () {
  nativeConstruct(function () { /* empty */ });
});
var FORCED = NEW_TARGET_BUG || ARGS_BUG;

$({ target: 'Reflect', stat: true, forced: FORCED, sham: FORCED }, {
  construct: function construct(Target, args /* , newTarget */) {
    aFunction(Target);
    anObject(args);
    var newTarget = arguments.length < 3 ? Target : aFunction(arguments[2]);
    if (ARGS_BUG && !NEW_TARGET_BUG) return nativeConstruct(Target, args, newTarget);
    if (Target == newTarget) {
      // w/o altered newTarget, optimization for 0-4 arguments
      switch (args.length) {
        case 0: return new Target();
        case 1: return new Target(args[0]);
        case 2: return new Target(args[0], args[1]);
        case 3: return new Target(args[0], args[1], args[2]);
        case 4: return new Target(args[0], args[1], args[2], args[3]);
      }
      // w/o altered newTarget, lot of arguments case
      var $args = [null];
      $args.push.apply($args, args);
      return new (bind.apply(Target, $args))();
    }
    // with altered newTarget, not support built-in constructors
    var proto = newTarget.prototype;
    var instance = create(isObject(proto) ? proto : Object.prototype);
    var result = Function.apply.call(Target, instance, args);
    return isObject(result) ? result : instance;
  }
});


/***/ }),

/***/ "4d63":
/***/ (function(module, exports, __webpack_require__) {

var DESCRIPTORS = __webpack_require__("83ab");
var global = __webpack_require__("da84");
var isForced = __webpack_require__("94ca");
var inheritIfRequired = __webpack_require__("7156");
var defineProperty = __webpack_require__("9bf2").f;
var getOwnPropertyNames = __webpack_require__("241c").f;
var isRegExp = __webpack_require__("44e7");
var getFlags = __webpack_require__("ad6d");
var redefine = __webpack_require__("6eeb");
var fails = __webpack_require__("d039");
var setSpecies = __webpack_require__("2626");
var wellKnownSymbol = __webpack_require__("b622");

var MATCH = wellKnownSymbol('match');
var NativeRegExp = global.RegExp;
var RegExpPrototype = NativeRegExp.prototype;
var re1 = /a/g;
var re2 = /a/g;

// "new" should create a new object, old webkit bug
var CORRECT_NEW = new NativeRegExp(re1) !== re1;

var FORCED = DESCRIPTORS && isForced('RegExp', (!CORRECT_NEW || fails(function () {
  re2[MATCH] = false;
  // RegExp constructor can alter flags and IsRegExp works correct with @@match
  return NativeRegExp(re1) != re1 || NativeRegExp(re2) == re2 || NativeRegExp(re1, 'i') != '/a/i';
})));

// `RegExp` constructor
// https://tc39.github.io/ecma262/#sec-regexp-constructor
if (FORCED) {
  var RegExpWrapper = function RegExp(pattern, flags) {
    var thisIsRegExp = this instanceof RegExpWrapper;
    var patternIsRegExp = isRegExp(pattern);
    var flagsAreUndefined = flags === undefined;
    return !thisIsRegExp && patternIsRegExp && pattern.constructor === RegExpWrapper && flagsAreUndefined ? pattern
      : inheritIfRequired(CORRECT_NEW
        ? new NativeRegExp(patternIsRegExp && !flagsAreUndefined ? pattern.source : pattern, flags)
        : NativeRegExp((patternIsRegExp = pattern instanceof RegExpWrapper)
          ? pattern.source
          : pattern, patternIsRegExp && flagsAreUndefined ? getFlags.call(pattern) : flags)
      , thisIsRegExp ? this : RegExpPrototype, RegExpWrapper);
  };
  var proxy = function (key) {
    key in RegExpWrapper || defineProperty(RegExpWrapper, key, {
      configurable: true,
      get: function () { return NativeRegExp[key]; },
      set: function (it) { NativeRegExp[key] = it; }
    });
  };
  var keys = getOwnPropertyNames(NativeRegExp);
  var index = 0;
  while (keys.length > index) proxy(keys[index++]);
  RegExpPrototype.constructor = RegExpWrapper;
  RegExpWrapper.prototype = RegExpPrototype;
  redefine(global, 'RegExp', RegExpWrapper);
}

// https://tc39.github.io/ecma262/#sec-get-regexp-@@species
setSpecies('RegExp');


/***/ }),

/***/ "4d64":
/***/ (function(module, exports, __webpack_require__) {

var toIndexedObject = __webpack_require__("fc6a");
var toLength = __webpack_require__("50c4");
var toAbsoluteIndex = __webpack_require__("23cb");

// `Array.prototype.{ indexOf, includes }` methods implementation
var createMethod = function (IS_INCLUDES) {
  return function ($this, el, fromIndex) {
    var O = toIndexedObject($this);
    var length = toLength(O.length);
    var index = toAbsoluteIndex(fromIndex, length);
    var value;
    // Array#includes uses SameValueZero equality algorithm
    // eslint-disable-next-line no-self-compare
    if (IS_INCLUDES && el != el) while (length > index) {
      value = O[index++];
      // eslint-disable-next-line no-self-compare
      if (value != value) return true;
    // Array#indexOf ignores holes, Array#includes - not
    } else for (;length > index; index++) {
      if ((IS_INCLUDES || index in O) && O[index] === el) return IS_INCLUDES || index || 0;
    } return !IS_INCLUDES && -1;
  };
};

module.exports = {
  // `Array.prototype.includes` method
  // https://tc39.github.io/ecma262/#sec-array.prototype.includes
  includes: createMethod(true),
  // `Array.prototype.indexOf` method
  // https://tc39.github.io/ecma262/#sec-array.prototype.indexof
  indexOf: createMethod(false)
};


/***/ }),

/***/ "4de4":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var $ = __webpack_require__("23e7");
var $filter = __webpack_require__("b727").filter;
var arrayMethodHasSpeciesSupport = __webpack_require__("1dde");

// `Array.prototype.filter` method
// https://tc39.github.io/ecma262/#sec-array.prototype.filter
// with adding support of @@species
$({ target: 'Array', proto: true, forced: !arrayMethodHasSpeciesSupport('filter') }, {
  filter: function filter(callbackfn /* , thisArg */) {
    return $filter(this, callbackfn, arguments.length > 1 ? arguments[1] : undefined);
  }
});


/***/ }),

/***/ "4df4":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var bind = __webpack_require__("f8c2");
var toObject = __webpack_require__("7b0b");
var callWithSafeIterationClosing = __webpack_require__("9bdd");
var isArrayIteratorMethod = __webpack_require__("e95a");
var toLength = __webpack_require__("50c4");
var createProperty = __webpack_require__("8418");
var getIteratorMethod = __webpack_require__("35a1");

// `Array.from` method implementation
// https://tc39.github.io/ecma262/#sec-array.from
module.exports = function from(arrayLike /* , mapfn = undefined, thisArg = undefined */) {
  var O = toObject(arrayLike);
  var C = typeof this == 'function' ? this : Array;
  var argumentsLength = arguments.length;
  var mapfn = argumentsLength > 1 ? arguments[1] : undefined;
  var mapping = mapfn !== undefined;
  var index = 0;
  var iteratorMethod = getIteratorMethod(O);
  var length, result, step, iterator, next;
  if (mapping) mapfn = bind(mapfn, argumentsLength > 2 ? arguments[2] : undefined, 2);
  // if the target is not iterable or it's an array with the default iterator - use a simple case
  if (iteratorMethod != undefined && !(C == Array && isArrayIteratorMethod(iteratorMethod))) {
    iterator = iteratorMethod.call(O);
    next = iterator.next;
    result = new C();
    for (;!(step = next.call(iterator)).done; index++) {
      createProperty(result, index, mapping
        ? callWithSafeIterationClosing(iterator, mapfn, [step.value, index], true)
        : step.value
      );
    }
  } else {
    length = toLength(O.length);
    result = new C(length);
    for (;length > index; index++) {
      createProperty(result, index, mapping ? mapfn(O[index], index) : O[index]);
    }
  }
  result.length = index;
  return result;
};


/***/ }),

/***/ "4e82":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var $ = __webpack_require__("23e7");
var aFunction = __webpack_require__("1c0b");
var toObject = __webpack_require__("7b0b");
var fails = __webpack_require__("d039");
var sloppyArrayMethod = __webpack_require__("b301");

var nativeSort = [].sort;
var test = [1, 2, 3];

// IE8-
var FAILS_ON_UNDEFINED = fails(function () {
  test.sort(undefined);
});
// V8 bug
var FAILS_ON_NULL = fails(function () {
  test.sort(null);
});
// Old WebKit
var SLOPPY_METHOD = sloppyArrayMethod('sort');

var FORCED = FAILS_ON_UNDEFINED || !FAILS_ON_NULL || SLOPPY_METHOD;

// `Array.prototype.sort` method
// https://tc39.github.io/ecma262/#sec-array.prototype.sort
$({ target: 'Array', proto: true, forced: FORCED }, {
  sort: function sort(comparefn) {
    return comparefn === undefined
      ? nativeSort.call(toObject(this))
      : nativeSort.call(toObject(this), aFunction(comparefn));
  }
});


/***/ }),

/***/ "4ec9":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var collection = __webpack_require__("6d61");
var collectionStrong = __webpack_require__("6566");

// `Map` constructor
// https://tc39.github.io/ecma262/#sec-map-objects
module.exports = collection('Map', function (get) {
  return function Map() { return get(this, arguments.length ? arguments[0] : undefined); };
}, collectionStrong, true);


/***/ }),

/***/ "4fad":
/***/ (function(module, exports, __webpack_require__) {

var $ = __webpack_require__("23e7");
var $entries = __webpack_require__("6f53").entries;

// `Object.entries` method
// https://tc39.github.io/ecma262/#sec-object.entries
$({ target: 'Object', stat: true }, {
  entries: function entries(O) {
    return $entries(O);
  }
});


/***/ }),

/***/ "50c4":
/***/ (function(module, exports, __webpack_require__) {

var toInteger = __webpack_require__("a691");

var min = Math.min;

// `ToLength` abstract operation
// https://tc39.github.io/ecma262/#sec-tolength
module.exports = function (argument) {
  return argument > 0 ? min(toInteger(argument), 0x1FFFFFFFFFFFFF) : 0; // 2 ** 53 - 1 == 9007199254740991
};


/***/ }),

/***/ "5135":
/***/ (function(module, exports) {

var hasOwnProperty = {}.hasOwnProperty;

module.exports = function (it, key) {
  return hasOwnProperty.call(it, key);
};


/***/ }),

/***/ "5270":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var utils = __webpack_require__("c532");
var transformData = __webpack_require__("c401");
var isCancel = __webpack_require__("2e67");
var defaults = __webpack_require__("2444");
var isAbsoluteURL = __webpack_require__("d925");
var combineURLs = __webpack_require__("e683");

/**
 * Throws a `Cancel` if cancellation has been requested.
 */
function throwIfCancellationRequested(config) {
  if (config.cancelToken) {
    config.cancelToken.throwIfRequested();
  }
}

/**
 * Dispatch a request to the server using the configured adapter.
 *
 * @param {object} config The config that is to be used for the request
 * @returns {Promise} The Promise to be fulfilled
 */
module.exports = function dispatchRequest(config) {
  throwIfCancellationRequested(config);

  // Support baseURL config
  if (config.baseURL && !isAbsoluteURL(config.url)) {
    config.url = combineURLs(config.baseURL, config.url);
  }

  // Ensure headers exist
  config.headers = config.headers || {};

  // Transform request data
  config.data = transformData(
    config.data,
    config.headers,
    config.transformRequest
  );

  // Flatten headers
  config.headers = utils.merge(
    config.headers.common || {},
    config.headers[config.method] || {},
    config.headers || {}
  );

  utils.forEach(
    ['delete', 'get', 'head', 'post', 'put', 'patch', 'common'],
    function cleanHeaderConfig(method) {
      delete config.headers[method];
    }
  );

  var adapter = config.adapter || defaults.adapter;

  return adapter(config).then(function onAdapterResolution(response) {
    throwIfCancellationRequested(config);

    // Transform response data
    response.data = transformData(
      response.data,
      response.headers,
      config.transformResponse
    );

    return response;
  }, function onAdapterRejection(reason) {
    if (!isCancel(reason)) {
      throwIfCancellationRequested(config);

      // Transform response data
      if (reason && reason.response) {
        reason.response.data = transformData(
          reason.response.data,
          reason.response.headers,
          config.transformResponse
        );
      }
    }

    return Promise.reject(reason);
  });
};


/***/ }),

/***/ "5319":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var fixRegExpWellKnownSymbolLogic = __webpack_require__("d784");
var anObject = __webpack_require__("825a");
var toObject = __webpack_require__("7b0b");
var toLength = __webpack_require__("50c4");
var toInteger = __webpack_require__("a691");
var requireObjectCoercible = __webpack_require__("1d80");
var advanceStringIndex = __webpack_require__("8aa5");
var regExpExec = __webpack_require__("14c3");

var max = Math.max;
var min = Math.min;
var floor = Math.floor;
var SUBSTITUTION_SYMBOLS = /\$([$&'`]|\d\d?|<[^>]*>)/g;
var SUBSTITUTION_SYMBOLS_NO_NAMED = /\$([$&'`]|\d\d?)/g;

var maybeToString = function (it) {
  return it === undefined ? it : String(it);
};

// @@replace logic
fixRegExpWellKnownSymbolLogic('replace', 2, function (REPLACE, nativeReplace, maybeCallNative) {
  return [
    // `String.prototype.replace` method
    // https://tc39.github.io/ecma262/#sec-string.prototype.replace
    function replace(searchValue, replaceValue) {
      var O = requireObjectCoercible(this);
      var replacer = searchValue == undefined ? undefined : searchValue[REPLACE];
      return replacer !== undefined
        ? replacer.call(searchValue, O, replaceValue)
        : nativeReplace.call(String(O), searchValue, replaceValue);
    },
    // `RegExp.prototype[@@replace]` method
    // https://tc39.github.io/ecma262/#sec-regexp.prototype-@@replace
    function (regexp, replaceValue) {
      var res = maybeCallNative(nativeReplace, regexp, this, replaceValue);
      if (res.done) return res.value;

      var rx = anObject(regexp);
      var S = String(this);

      var functionalReplace = typeof replaceValue === 'function';
      if (!functionalReplace) replaceValue = String(replaceValue);

      var global = rx.global;
      if (global) {
        var fullUnicode = rx.unicode;
        rx.lastIndex = 0;
      }
      var results = [];
      while (true) {
        var result = regExpExec(rx, S);
        if (result === null) break;

        results.push(result);
        if (!global) break;

        var matchStr = String(result[0]);
        if (matchStr === '') rx.lastIndex = advanceStringIndex(S, toLength(rx.lastIndex), fullUnicode);
      }

      var accumulatedResult = '';
      var nextSourcePosition = 0;
      for (var i = 0; i < results.length; i++) {
        result = results[i];

        var matched = String(result[0]);
        var position = max(min(toInteger(result.index), S.length), 0);
        var captures = [];
        // NOTE: This is equivalent to
        //   captures = result.slice(1).map(maybeToString)
        // but for some reason `nativeSlice.call(result, 1, result.length)` (called in
        // the slice polyfill when slicing native arrays) "doesn't work" in safari 9 and
        // causes a crash (https://pastebin.com/N21QzeQA) when trying to debug it.
        for (var j = 1; j < result.length; j++) captures.push(maybeToString(result[j]));
        var namedCaptures = result.groups;
        if (functionalReplace) {
          var replacerArgs = [matched].concat(captures, position, S);
          if (namedCaptures !== undefined) replacerArgs.push(namedCaptures);
          var replacement = String(replaceValue.apply(undefined, replacerArgs));
        } else {
          replacement = getSubstitution(matched, S, position, captures, namedCaptures, replaceValue);
        }
        if (position >= nextSourcePosition) {
          accumulatedResult += S.slice(nextSourcePosition, position) + replacement;
          nextSourcePosition = position + matched.length;
        }
      }
      return accumulatedResult + S.slice(nextSourcePosition);
    }
  ];

  // https://tc39.github.io/ecma262/#sec-getsubstitution
  function getSubstitution(matched, str, position, captures, namedCaptures, replacement) {
    var tailPos = position + matched.length;
    var m = captures.length;
    var symbols = SUBSTITUTION_SYMBOLS_NO_NAMED;
    if (namedCaptures !== undefined) {
      namedCaptures = toObject(namedCaptures);
      symbols = SUBSTITUTION_SYMBOLS;
    }
    return nativeReplace.call(replacement, symbols, function (match, ch) {
      var capture;
      switch (ch.charAt(0)) {
        case '$': return '$';
        case '&': return matched;
        case '`': return str.slice(0, position);
        case "'": return str.slice(tailPos);
        case '<':
          capture = namedCaptures[ch.slice(1, -1)];
          break;
        default: // \d\d?
          var n = +ch;
          if (n === 0) return match;
          if (n > m) {
            var f = floor(n / 10);
            if (f === 0) return match;
            if (f <= m) return captures[f - 1] === undefined ? ch.charAt(1) : captures[f - 1] + ch.charAt(1);
            return match;
          }
          capture = captures[n - 1];
      }
      return capture === undefined ? '' : capture;
    });
  }
});


/***/ }),

/***/ "53ca":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return _typeof; });
/* harmony import */ var core_js_modules_es_symbol__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("a4d3");
/* harmony import */ var core_js_modules_es_symbol__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(core_js_modules_es_symbol__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var core_js_modules_es_symbol_description__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("e01a");
/* harmony import */ var core_js_modules_es_symbol_description__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(core_js_modules_es_symbol_description__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var core_js_modules_es_symbol_iterator__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__("d28b");
/* harmony import */ var core_js_modules_es_symbol_iterator__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(core_js_modules_es_symbol_iterator__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var core_js_modules_es_array_iterator__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__("e260");
/* harmony import */ var core_js_modules_es_array_iterator__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(core_js_modules_es_array_iterator__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var core_js_modules_es_object_to_string__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__("d3b7");
/* harmony import */ var core_js_modules_es_object_to_string__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(core_js_modules_es_object_to_string__WEBPACK_IMPORTED_MODULE_4__);
/* harmony import */ var core_js_modules_es_string_iterator__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__("3ca3");
/* harmony import */ var core_js_modules_es_string_iterator__WEBPACK_IMPORTED_MODULE_5___default = /*#__PURE__*/__webpack_require__.n(core_js_modules_es_string_iterator__WEBPACK_IMPORTED_MODULE_5__);
/* harmony import */ var core_js_modules_web_dom_collections_iterator__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__("ddb0");
/* harmony import */ var core_js_modules_web_dom_collections_iterator__WEBPACK_IMPORTED_MODULE_6___default = /*#__PURE__*/__webpack_require__.n(core_js_modules_web_dom_collections_iterator__WEBPACK_IMPORTED_MODULE_6__);








function _typeof2(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof2 = function _typeof2(obj) { return typeof obj; }; } else { _typeof2 = function _typeof2(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof2(obj); }

function _typeof(obj) {
  if (typeof Symbol === "function" && _typeof2(Symbol.iterator) === "symbol") {
    _typeof = function _typeof(obj) {
      return _typeof2(obj);
    };
  } else {
    _typeof = function _typeof(obj) {
      return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : _typeof2(obj);
    };
  }

  return _typeof(obj);
}

/***/ }),

/***/ "5692":
/***/ (function(module, exports, __webpack_require__) {

var IS_PURE = __webpack_require__("c430");
var store = __webpack_require__("c6cd");

(module.exports = function (key, value) {
  return store[key] || (store[key] = value !== undefined ? value : {});
})('versions', []).push({
  version: '3.3.6',
  mode: IS_PURE ? 'pure' : 'global',
  copyright: '© 2019 Denis Pushkarev (zloirock.ru)'
});


/***/ }),

/***/ "56ef":
/***/ (function(module, exports, __webpack_require__) {

var getBuiltIn = __webpack_require__("d066");
var getOwnPropertyNamesModule = __webpack_require__("241c");
var getOwnPropertySymbolsModule = __webpack_require__("7418");
var anObject = __webpack_require__("825a");

// all object keys, includes non-enumerable and symbols
module.exports = getBuiltIn('Reflect', 'ownKeys') || function ownKeys(it) {
  var keys = getOwnPropertyNamesModule.f(anObject(it));
  var getOwnPropertySymbols = getOwnPropertySymbolsModule.f;
  return getOwnPropertySymbols ? keys.concat(getOwnPropertySymbols(it)) : keys;
};


/***/ }),

/***/ "5899":
/***/ (function(module, exports) {

// a string of all valid unicode whitespaces
// eslint-disable-next-line max-len
module.exports = '\u0009\u000A\u000B\u000C\u000D\u0020\u00A0\u1680\u2000\u2001\u2002\u2003\u2004\u2005\u2006\u2007\u2008\u2009\u200A\u202F\u205F\u3000\u2028\u2029\uFEFF';


/***/ }),

/***/ "58a8":
/***/ (function(module, exports, __webpack_require__) {

var requireObjectCoercible = __webpack_require__("1d80");
var whitespaces = __webpack_require__("5899");

var whitespace = '[' + whitespaces + ']';
var ltrim = RegExp('^' + whitespace + whitespace + '*');
var rtrim = RegExp(whitespace + whitespace + '*$');

// `String.prototype.{ trim, trimStart, trimEnd, trimLeft, trimRight }` methods implementation
var createMethod = function (TYPE) {
  return function ($this) {
    var string = String(requireObjectCoercible($this));
    if (TYPE & 1) string = string.replace(ltrim, '');
    if (TYPE & 2) string = string.replace(rtrim, '');
    return string;
  };
};

module.exports = {
  // `String.prototype.{ trimLeft, trimStart }` methods
  // https://tc39.github.io/ecma262/#sec-string.prototype.trimstart
  start: createMethod(1),
  // `String.prototype.{ trimRight, trimEnd }` methods
  // https://tc39.github.io/ecma262/#sec-string.prototype.trimend
  end: createMethod(2),
  // `String.prototype.trim` method
  // https://tc39.github.io/ecma262/#sec-string.prototype.trim
  trim: createMethod(3)
};


/***/ }),

/***/ "5a34":
/***/ (function(module, exports, __webpack_require__) {

var isRegExp = __webpack_require__("44e7");

module.exports = function (it) {
  if (isRegExp(it)) {
    throw TypeError("The method doesn't accept regular expressions");
  } return it;
};


/***/ }),

/***/ "5c6c":
/***/ (function(module, exports) {

module.exports = function (bitmap, value) {
  return {
    enumerable: !(bitmap & 1),
    configurable: !(bitmap & 2),
    writable: !(bitmap & 4),
    value: value
  };
};


/***/ }),

/***/ "5d41":
/***/ (function(module, exports, __webpack_require__) {

var $ = __webpack_require__("23e7");
var isObject = __webpack_require__("861d");
var anObject = __webpack_require__("825a");
var has = __webpack_require__("5135");
var getOwnPropertyDescriptorModule = __webpack_require__("06cf");
var getPrototypeOf = __webpack_require__("e163");

// `Reflect.get` method
// https://tc39.github.io/ecma262/#sec-reflect.get
function get(target, propertyKey /* , receiver */) {
  var receiver = arguments.length < 3 ? target : arguments[2];
  var descriptor, prototype;
  if (anObject(target) === receiver) return target[propertyKey];
  if (descriptor = getOwnPropertyDescriptorModule.f(target, propertyKey)) return has(descriptor, 'value')
    ? descriptor.value
    : descriptor.get === undefined
      ? undefined
      : descriptor.get.call(receiver);
  if (isObject(prototype = getPrototypeOf(target))) return get(prototype, propertyKey, receiver);
}

$({ target: 'Reflect', stat: true }, {
  get: get
});


/***/ }),

/***/ "6062":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var collection = __webpack_require__("6d61");
var collectionStrong = __webpack_require__("6566");

// `Set` constructor
// https://tc39.github.io/ecma262/#sec-set-objects
module.exports = collection('Set', function (get) {
  return function Set() { return get(this, arguments.length ? arguments[0] : undefined); };
}, collectionStrong);


/***/ }),

/***/ "60ae":
/***/ (function(module, exports, __webpack_require__) {

var global = __webpack_require__("da84");
var userAgent = __webpack_require__("b39a");

var process = global.process;
var versions = process && process.versions;
var v8 = versions && versions.v8;
var match, version;

if (v8) {
  match = v8.split('.');
  version = match[0] + match[1];
} else if (userAgent) {
  match = userAgent.match(/Edge\/(\d+)/);
  if (!match || match[1] >= 74) {
    match = userAgent.match(/Chrome\/(\d+)/);
    if (match) version = match[1];
  }
}

module.exports = version && +version;


/***/ }),

/***/ "60da":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var DESCRIPTORS = __webpack_require__("83ab");
var fails = __webpack_require__("d039");
var objectKeys = __webpack_require__("df75");
var getOwnPropertySymbolsModule = __webpack_require__("7418");
var propertyIsEnumerableModule = __webpack_require__("d1e7");
var toObject = __webpack_require__("7b0b");
var IndexedObject = __webpack_require__("44ad");

var nativeAssign = Object.assign;

// `Object.assign` method
// https://tc39.github.io/ecma262/#sec-object.assign
// should work with symbols and should have deterministic property order (V8 bug)
module.exports = !nativeAssign || fails(function () {
  var A = {};
  var B = {};
  // eslint-disable-next-line no-undef
  var symbol = Symbol();
  var alphabet = 'abcdefghijklmnopqrst';
  A[symbol] = 7;
  alphabet.split('').forEach(function (chr) { B[chr] = chr; });
  return nativeAssign({}, A)[symbol] != 7 || objectKeys(nativeAssign({}, B)).join('') != alphabet;
}) ? function assign(target, source) { // eslint-disable-line no-unused-vars
  var T = toObject(target);
  var argumentsLength = arguments.length;
  var index = 1;
  var getOwnPropertySymbols = getOwnPropertySymbolsModule.f;
  var propertyIsEnumerable = propertyIsEnumerableModule.f;
  while (argumentsLength > index) {
    var S = IndexedObject(arguments[index++]);
    var keys = getOwnPropertySymbols ? objectKeys(S).concat(getOwnPropertySymbols(S)) : objectKeys(S);
    var length = keys.length;
    var j = 0;
    var key;
    while (length > j) {
      key = keys[j++];
      if (!DESCRIPTORS || propertyIsEnumerable.call(S, key)) T[key] = S[key];
    }
  } return T;
} : nativeAssign;


/***/ }),

/***/ "6547":
/***/ (function(module, exports, __webpack_require__) {

var toInteger = __webpack_require__("a691");
var requireObjectCoercible = __webpack_require__("1d80");

// `String.prototype.{ codePointAt, at }` methods implementation
var createMethod = function (CONVERT_TO_STRING) {
  return function ($this, pos) {
    var S = String(requireObjectCoercible($this));
    var position = toInteger(pos);
    var size = S.length;
    var first, second;
    if (position < 0 || position >= size) return CONVERT_TO_STRING ? '' : undefined;
    first = S.charCodeAt(position);
    return first < 0xD800 || first > 0xDBFF || position + 1 === size
      || (second = S.charCodeAt(position + 1)) < 0xDC00 || second > 0xDFFF
        ? CONVERT_TO_STRING ? S.charAt(position) : first
        : CONVERT_TO_STRING ? S.slice(position, position + 2) : (first - 0xD800 << 10) + (second - 0xDC00) + 0x10000;
  };
};

module.exports = {
  // `String.prototype.codePointAt` method
  // https://tc39.github.io/ecma262/#sec-string.prototype.codepointat
  codeAt: createMethod(false),
  // `String.prototype.at` method
  // https://github.com/mathiasbynens/String.prototype.at
  charAt: createMethod(true)
};


/***/ }),

/***/ "6566":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var defineProperty = __webpack_require__("9bf2").f;
var create = __webpack_require__("7c73");
var redefineAll = __webpack_require__("e2cc");
var bind = __webpack_require__("f8c2");
var anInstance = __webpack_require__("19aa");
var iterate = __webpack_require__("2266");
var defineIterator = __webpack_require__("7dd0");
var setSpecies = __webpack_require__("2626");
var DESCRIPTORS = __webpack_require__("83ab");
var fastKey = __webpack_require__("f183").fastKey;
var InternalStateModule = __webpack_require__("69f3");

var setInternalState = InternalStateModule.set;
var internalStateGetterFor = InternalStateModule.getterFor;

module.exports = {
  getConstructor: function (wrapper, CONSTRUCTOR_NAME, IS_MAP, ADDER) {
    var C = wrapper(function (that, iterable) {
      anInstance(that, C, CONSTRUCTOR_NAME);
      setInternalState(that, {
        type: CONSTRUCTOR_NAME,
        index: create(null),
        first: undefined,
        last: undefined,
        size: 0
      });
      if (!DESCRIPTORS) that.size = 0;
      if (iterable != undefined) iterate(iterable, that[ADDER], that, IS_MAP);
    });

    var getInternalState = internalStateGetterFor(CONSTRUCTOR_NAME);

    var define = function (that, key, value) {
      var state = getInternalState(that);
      var entry = getEntry(that, key);
      var previous, index;
      // change existing entry
      if (entry) {
        entry.value = value;
      // create new entry
      } else {
        state.last = entry = {
          index: index = fastKey(key, true),
          key: key,
          value: value,
          previous: previous = state.last,
          next: undefined,
          removed: false
        };
        if (!state.first) state.first = entry;
        if (previous) previous.next = entry;
        if (DESCRIPTORS) state.size++;
        else that.size++;
        // add to index
        if (index !== 'F') state.index[index] = entry;
      } return that;
    };

    var getEntry = function (that, key) {
      var state = getInternalState(that);
      // fast case
      var index = fastKey(key);
      var entry;
      if (index !== 'F') return state.index[index];
      // frozen object case
      for (entry = state.first; entry; entry = entry.next) {
        if (entry.key == key) return entry;
      }
    };

    redefineAll(C.prototype, {
      // 23.1.3.1 Map.prototype.clear()
      // 23.2.3.2 Set.prototype.clear()
      clear: function clear() {
        var that = this;
        var state = getInternalState(that);
        var data = state.index;
        var entry = state.first;
        while (entry) {
          entry.removed = true;
          if (entry.previous) entry.previous = entry.previous.next = undefined;
          delete data[entry.index];
          entry = entry.next;
        }
        state.first = state.last = undefined;
        if (DESCRIPTORS) state.size = 0;
        else that.size = 0;
      },
      // 23.1.3.3 Map.prototype.delete(key)
      // 23.2.3.4 Set.prototype.delete(value)
      'delete': function (key) {
        var that = this;
        var state = getInternalState(that);
        var entry = getEntry(that, key);
        if (entry) {
          var next = entry.next;
          var prev = entry.previous;
          delete state.index[entry.index];
          entry.removed = true;
          if (prev) prev.next = next;
          if (next) next.previous = prev;
          if (state.first == entry) state.first = next;
          if (state.last == entry) state.last = prev;
          if (DESCRIPTORS) state.size--;
          else that.size--;
        } return !!entry;
      },
      // 23.2.3.6 Set.prototype.forEach(callbackfn, thisArg = undefined)
      // 23.1.3.5 Map.prototype.forEach(callbackfn, thisArg = undefined)
      forEach: function forEach(callbackfn /* , that = undefined */) {
        var state = getInternalState(this);
        var boundFunction = bind(callbackfn, arguments.length > 1 ? arguments[1] : undefined, 3);
        var entry;
        while (entry = entry ? entry.next : state.first) {
          boundFunction(entry.value, entry.key, this);
          // revert to the last existing entry
          while (entry && entry.removed) entry = entry.previous;
        }
      },
      // 23.1.3.7 Map.prototype.has(key)
      // 23.2.3.7 Set.prototype.has(value)
      has: function has(key) {
        return !!getEntry(this, key);
      }
    });

    redefineAll(C.prototype, IS_MAP ? {
      // 23.1.3.6 Map.prototype.get(key)
      get: function get(key) {
        var entry = getEntry(this, key);
        return entry && entry.value;
      },
      // 23.1.3.9 Map.prototype.set(key, value)
      set: function set(key, value) {
        return define(this, key === 0 ? 0 : key, value);
      }
    } : {
      // 23.2.3.1 Set.prototype.add(value)
      add: function add(value) {
        return define(this, value = value === 0 ? 0 : value, value);
      }
    });
    if (DESCRIPTORS) defineProperty(C.prototype, 'size', {
      get: function () {
        return getInternalState(this).size;
      }
    });
    return C;
  },
  setStrong: function (C, CONSTRUCTOR_NAME, IS_MAP) {
    var ITERATOR_NAME = CONSTRUCTOR_NAME + ' Iterator';
    var getInternalCollectionState = internalStateGetterFor(CONSTRUCTOR_NAME);
    var getInternalIteratorState = internalStateGetterFor(ITERATOR_NAME);
    // add .keys, .values, .entries, [@@iterator]
    // 23.1.3.4, 23.1.3.8, 23.1.3.11, 23.1.3.12, 23.2.3.5, 23.2.3.8, 23.2.3.10, 23.2.3.11
    defineIterator(C, CONSTRUCTOR_NAME, function (iterated, kind) {
      setInternalState(this, {
        type: ITERATOR_NAME,
        target: iterated,
        state: getInternalCollectionState(iterated),
        kind: kind,
        last: undefined
      });
    }, function () {
      var state = getInternalIteratorState(this);
      var kind = state.kind;
      var entry = state.last;
      // revert to the last existing entry
      while (entry && entry.removed) entry = entry.previous;
      // get next entry
      if (!state.target || !(state.last = entry = entry ? entry.next : state.state.first)) {
        // or finish the iteration
        state.target = undefined;
        return { value: undefined, done: true };
      }
      // return step by kind
      if (kind == 'keys') return { value: entry.key, done: false };
      if (kind == 'values') return { value: entry.value, done: false };
      return { value: [entry.key, entry.value], done: false };
    }, IS_MAP ? 'entries' : 'values', !IS_MAP, true);

    // add [@@species], 23.1.2.2, 23.2.2.2
    setSpecies(CONSTRUCTOR_NAME);
  }
};


/***/ }),

/***/ "65ae":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "b", function() { return isCancel; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return createRequest; });
/* harmony import */ var axios__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("bc3a");
/* harmony import */ var axios__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(axios__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var debug__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("3ded");
/* harmony import */ var debug__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(debug__WEBPACK_IMPORTED_MODULE_1__);


var log = debug__WEBPACK_IMPORTED_MODULE_1___default()('MN:Api:Request');
var isCancel = axios__WEBPACK_IMPORTED_MODULE_0___default.a.isCancel;

function createRequest(config) {
  var delegate = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : axios__WEBPACK_IMPORTED_MODULE_0___default.a;
  var source;
  var request;

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
    source = axios__WEBPACK_IMPORTED_MODULE_0___default.a.CancelToken.source();
    config.cancelToken = source.token;
    return delegate(config);
  }

  function cancel() {
    var reason = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 'canceled';
    log('cancel()');
    return source && source.cancel(reason);
  }

  return request = {
    config: config,
    header: header,
    params: params,
    data: data,
    send: send,
    cancel: cancel
  };
} // export type Request<T, B, D> = ReturnType<typeof createRequest<T, B, D>>;

/***/ }),

/***/ "65f0":
/***/ (function(module, exports, __webpack_require__) {

var isObject = __webpack_require__("861d");
var isArray = __webpack_require__("e8b5");
var wellKnownSymbol = __webpack_require__("b622");

var SPECIES = wellKnownSymbol('species');

// `ArraySpeciesCreate` abstract operation
// https://tc39.github.io/ecma262/#sec-arrayspeciescreate
module.exports = function (originalArray, length) {
  var C;
  if (isArray(originalArray)) {
    C = originalArray.constructor;
    // cross-realm fallback
    if (typeof C == 'function' && (C === Array || isArray(C.prototype))) C = undefined;
    else if (isObject(C)) {
      C = C[SPECIES];
      if (C === null) C = undefined;
    }
  } return new (C === undefined ? Array : C)(length === 0 ? 0 : length);
};


/***/ }),

/***/ "6821":
/***/ (function(module, exports, __webpack_require__) {

(function(){
  var crypt = __webpack_require__("00d8"),
      utf8 = __webpack_require__("9a63").utf8,
      isBuffer = __webpack_require__("044b"),
      bin = __webpack_require__("9a63").bin,

  // The core
  md5 = function (message, options) {
    // Convert to byte array
    if (message.constructor == String)
      if (options && options.encoding === 'binary')
        message = bin.stringToBytes(message);
      else
        message = utf8.stringToBytes(message);
    else if (isBuffer(message))
      message = Array.prototype.slice.call(message, 0);
    else if (!Array.isArray(message))
      message = message.toString();
    // else, assume byte array already

    var m = crypt.bytesToWords(message),
        l = message.length * 8,
        a =  1732584193,
        b = -271733879,
        c = -1732584194,
        d =  271733878;

    // Swap endian
    for (var i = 0; i < m.length; i++) {
      m[i] = ((m[i] <<  8) | (m[i] >>> 24)) & 0x00FF00FF |
             ((m[i] << 24) | (m[i] >>>  8)) & 0xFF00FF00;
    }

    // Padding
    m[l >>> 5] |= 0x80 << (l % 32);
    m[(((l + 64) >>> 9) << 4) + 14] = l;

    // Method shortcuts
    var FF = md5._ff,
        GG = md5._gg,
        HH = md5._hh,
        II = md5._ii;

    for (var i = 0; i < m.length; i += 16) {

      var aa = a,
          bb = b,
          cc = c,
          dd = d;

      a = FF(a, b, c, d, m[i+ 0],  7, -680876936);
      d = FF(d, a, b, c, m[i+ 1], 12, -389564586);
      c = FF(c, d, a, b, m[i+ 2], 17,  606105819);
      b = FF(b, c, d, a, m[i+ 3], 22, -1044525330);
      a = FF(a, b, c, d, m[i+ 4],  7, -176418897);
      d = FF(d, a, b, c, m[i+ 5], 12,  1200080426);
      c = FF(c, d, a, b, m[i+ 6], 17, -1473231341);
      b = FF(b, c, d, a, m[i+ 7], 22, -45705983);
      a = FF(a, b, c, d, m[i+ 8],  7,  1770035416);
      d = FF(d, a, b, c, m[i+ 9], 12, -1958414417);
      c = FF(c, d, a, b, m[i+10], 17, -42063);
      b = FF(b, c, d, a, m[i+11], 22, -1990404162);
      a = FF(a, b, c, d, m[i+12],  7,  1804603682);
      d = FF(d, a, b, c, m[i+13], 12, -40341101);
      c = FF(c, d, a, b, m[i+14], 17, -1502002290);
      b = FF(b, c, d, a, m[i+15], 22,  1236535329);

      a = GG(a, b, c, d, m[i+ 1],  5, -165796510);
      d = GG(d, a, b, c, m[i+ 6],  9, -1069501632);
      c = GG(c, d, a, b, m[i+11], 14,  643717713);
      b = GG(b, c, d, a, m[i+ 0], 20, -373897302);
      a = GG(a, b, c, d, m[i+ 5],  5, -701558691);
      d = GG(d, a, b, c, m[i+10],  9,  38016083);
      c = GG(c, d, a, b, m[i+15], 14, -660478335);
      b = GG(b, c, d, a, m[i+ 4], 20, -405537848);
      a = GG(a, b, c, d, m[i+ 9],  5,  568446438);
      d = GG(d, a, b, c, m[i+14],  9, -1019803690);
      c = GG(c, d, a, b, m[i+ 3], 14, -187363961);
      b = GG(b, c, d, a, m[i+ 8], 20,  1163531501);
      a = GG(a, b, c, d, m[i+13],  5, -1444681467);
      d = GG(d, a, b, c, m[i+ 2],  9, -51403784);
      c = GG(c, d, a, b, m[i+ 7], 14,  1735328473);
      b = GG(b, c, d, a, m[i+12], 20, -1926607734);

      a = HH(a, b, c, d, m[i+ 5],  4, -378558);
      d = HH(d, a, b, c, m[i+ 8], 11, -2022574463);
      c = HH(c, d, a, b, m[i+11], 16,  1839030562);
      b = HH(b, c, d, a, m[i+14], 23, -35309556);
      a = HH(a, b, c, d, m[i+ 1],  4, -1530992060);
      d = HH(d, a, b, c, m[i+ 4], 11,  1272893353);
      c = HH(c, d, a, b, m[i+ 7], 16, -155497632);
      b = HH(b, c, d, a, m[i+10], 23, -1094730640);
      a = HH(a, b, c, d, m[i+13],  4,  681279174);
      d = HH(d, a, b, c, m[i+ 0], 11, -358537222);
      c = HH(c, d, a, b, m[i+ 3], 16, -722521979);
      b = HH(b, c, d, a, m[i+ 6], 23,  76029189);
      a = HH(a, b, c, d, m[i+ 9],  4, -640364487);
      d = HH(d, a, b, c, m[i+12], 11, -421815835);
      c = HH(c, d, a, b, m[i+15], 16,  530742520);
      b = HH(b, c, d, a, m[i+ 2], 23, -995338651);

      a = II(a, b, c, d, m[i+ 0],  6, -198630844);
      d = II(d, a, b, c, m[i+ 7], 10,  1126891415);
      c = II(c, d, a, b, m[i+14], 15, -1416354905);
      b = II(b, c, d, a, m[i+ 5], 21, -57434055);
      a = II(a, b, c, d, m[i+12],  6,  1700485571);
      d = II(d, a, b, c, m[i+ 3], 10, -1894986606);
      c = II(c, d, a, b, m[i+10], 15, -1051523);
      b = II(b, c, d, a, m[i+ 1], 21, -2054922799);
      a = II(a, b, c, d, m[i+ 8],  6,  1873313359);
      d = II(d, a, b, c, m[i+15], 10, -30611744);
      c = II(c, d, a, b, m[i+ 6], 15, -1560198380);
      b = II(b, c, d, a, m[i+13], 21,  1309151649);
      a = II(a, b, c, d, m[i+ 4],  6, -145523070);
      d = II(d, a, b, c, m[i+11], 10, -1120210379);
      c = II(c, d, a, b, m[i+ 2], 15,  718787259);
      b = II(b, c, d, a, m[i+ 9], 21, -343485551);

      a = (a + aa) >>> 0;
      b = (b + bb) >>> 0;
      c = (c + cc) >>> 0;
      d = (d + dd) >>> 0;
    }

    return crypt.endian([a, b, c, d]);
  };

  // Auxiliary functions
  md5._ff  = function (a, b, c, d, x, s, t) {
    var n = a + (b & c | ~b & d) + (x >>> 0) + t;
    return ((n << s) | (n >>> (32 - s))) + b;
  };
  md5._gg  = function (a, b, c, d, x, s, t) {
    var n = a + (b & d | c & ~d) + (x >>> 0) + t;
    return ((n << s) | (n >>> (32 - s))) + b;
  };
  md5._hh  = function (a, b, c, d, x, s, t) {
    var n = a + (b ^ c ^ d) + (x >>> 0) + t;
    return ((n << s) | (n >>> (32 - s))) + b;
  };
  md5._ii  = function (a, b, c, d, x, s, t) {
    var n = a + (c ^ (b | ~d)) + (x >>> 0) + t;
    return ((n << s) | (n >>> (32 - s))) + b;
  };

  // Package private blocksize
  md5._blocksize = 16;
  md5._digestsize = 16;

  module.exports = function (message, options) {
    if (message === undefined || message === null)
      throw new Error('Illegal argument ' + message);

    var digestbytes = crypt.wordsToBytes(md5(message, options));
    return options && options.asBytes ? digestbytes :
        options && options.asString ? bin.bytesToString(digestbytes) :
        crypt.bytesToHex(digestbytes);
  };

})();


/***/ }),

/***/ "69f3":
/***/ (function(module, exports, __webpack_require__) {

var NATIVE_WEAK_MAP = __webpack_require__("7f9a");
var global = __webpack_require__("da84");
var isObject = __webpack_require__("861d");
var createNonEnumerableProperty = __webpack_require__("9112");
var objectHas = __webpack_require__("5135");
var sharedKey = __webpack_require__("f772");
var hiddenKeys = __webpack_require__("d012");

var WeakMap = global.WeakMap;
var set, get, has;

var enforce = function (it) {
  return has(it) ? get(it) : set(it, {});
};

var getterFor = function (TYPE) {
  return function (it) {
    var state;
    if (!isObject(it) || (state = get(it)).type !== TYPE) {
      throw TypeError('Incompatible receiver, ' + TYPE + ' required');
    } return state;
  };
};

if (NATIVE_WEAK_MAP) {
  var store = new WeakMap();
  var wmget = store.get;
  var wmhas = store.has;
  var wmset = store.set;
  set = function (it, metadata) {
    wmset.call(store, it, metadata);
    return metadata;
  };
  get = function (it) {
    return wmget.call(store, it) || {};
  };
  has = function (it) {
    return wmhas.call(store, it);
  };
} else {
  var STATE = sharedKey('state');
  hiddenKeys[STATE] = true;
  set = function (it, metadata) {
    createNonEnumerableProperty(it, STATE, metadata);
    return metadata;
  };
  get = function (it) {
    return objectHas(it, STATE) ? it[STATE] : {};
  };
  has = function (it) {
    return objectHas(it, STATE);
  };
}

module.exports = {
  set: set,
  get: get,
  has: has,
  enforce: enforce,
  getterFor: getterFor
};


/***/ }),

/***/ "6d61":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var $ = __webpack_require__("23e7");
var global = __webpack_require__("da84");
var isForced = __webpack_require__("94ca");
var redefine = __webpack_require__("6eeb");
var InternalMetadataModule = __webpack_require__("f183");
var iterate = __webpack_require__("2266");
var anInstance = __webpack_require__("19aa");
var isObject = __webpack_require__("861d");
var fails = __webpack_require__("d039");
var checkCorrectnessOfIteration = __webpack_require__("1c7e");
var setToStringTag = __webpack_require__("d44e");
var inheritIfRequired = __webpack_require__("7156");

module.exports = function (CONSTRUCTOR_NAME, wrapper, common, IS_MAP, IS_WEAK) {
  var NativeConstructor = global[CONSTRUCTOR_NAME];
  var NativePrototype = NativeConstructor && NativeConstructor.prototype;
  var Constructor = NativeConstructor;
  var ADDER = IS_MAP ? 'set' : 'add';
  var exported = {};

  var fixMethod = function (KEY) {
    var nativeMethod = NativePrototype[KEY];
    redefine(NativePrototype, KEY,
      KEY == 'add' ? function add(value) {
        nativeMethod.call(this, value === 0 ? 0 : value);
        return this;
      } : KEY == 'delete' ? function (key) {
        return IS_WEAK && !isObject(key) ? false : nativeMethod.call(this, key === 0 ? 0 : key);
      } : KEY == 'get' ? function get(key) {
        return IS_WEAK && !isObject(key) ? undefined : nativeMethod.call(this, key === 0 ? 0 : key);
      } : KEY == 'has' ? function has(key) {
        return IS_WEAK && !isObject(key) ? false : nativeMethod.call(this, key === 0 ? 0 : key);
      } : function set(key, value) {
        nativeMethod.call(this, key === 0 ? 0 : key, value);
        return this;
      }
    );
  };

  // eslint-disable-next-line max-len
  if (isForced(CONSTRUCTOR_NAME, typeof NativeConstructor != 'function' || !(IS_WEAK || NativePrototype.forEach && !fails(function () {
    new NativeConstructor().entries().next();
  })))) {
    // create collection constructor
    Constructor = common.getConstructor(wrapper, CONSTRUCTOR_NAME, IS_MAP, ADDER);
    InternalMetadataModule.REQUIRED = true;
  } else if (isForced(CONSTRUCTOR_NAME, true)) {
    var instance = new Constructor();
    // early implementations not supports chaining
    var HASNT_CHAINING = instance[ADDER](IS_WEAK ? {} : -0, 1) != instance;
    // V8 ~ Chromium 40- weak-collections throws on primitives, but should return false
    var THROWS_ON_PRIMITIVES = fails(function () { instance.has(1); });
    // most early implementations doesn't supports iterables, most modern - not close it correctly
    // eslint-disable-next-line no-new
    var ACCEPT_ITERABLES = checkCorrectnessOfIteration(function (iterable) { new NativeConstructor(iterable); });
    // for early implementations -0 and +0 not the same
    var BUGGY_ZERO = !IS_WEAK && fails(function () {
      // V8 ~ Chromium 42- fails only with 5+ elements
      var $instance = new NativeConstructor();
      var index = 5;
      while (index--) $instance[ADDER](index, index);
      return !$instance.has(-0);
    });

    if (!ACCEPT_ITERABLES) {
      Constructor = wrapper(function (dummy, iterable) {
        anInstance(dummy, Constructor, CONSTRUCTOR_NAME);
        var that = inheritIfRequired(new NativeConstructor(), dummy, Constructor);
        if (iterable != undefined) iterate(iterable, that[ADDER], that, IS_MAP);
        return that;
      });
      Constructor.prototype = NativePrototype;
      NativePrototype.constructor = Constructor;
    }

    if (THROWS_ON_PRIMITIVES || BUGGY_ZERO) {
      fixMethod('delete');
      fixMethod('has');
      IS_MAP && fixMethod('get');
    }

    if (BUGGY_ZERO || HASNT_CHAINING) fixMethod(ADDER);

    // weak collections should not contains .clear method
    if (IS_WEAK && NativePrototype.clear) delete NativePrototype.clear;
  }

  exported[CONSTRUCTOR_NAME] = Constructor;
  $({ global: true, forced: Constructor != NativeConstructor }, exported);

  setToStringTag(Constructor, CONSTRUCTOR_NAME);

  if (!IS_WEAK) common.setStrong(Constructor, CONSTRUCTOR_NAME, IS_MAP);

  return Constructor;
};


/***/ }),

/***/ "6eeb":
/***/ (function(module, exports, __webpack_require__) {

var global = __webpack_require__("da84");
var shared = __webpack_require__("5692");
var createNonEnumerableProperty = __webpack_require__("9112");
var has = __webpack_require__("5135");
var setGlobal = __webpack_require__("ce4e");
var nativeFunctionToString = __webpack_require__("9e81");
var InternalStateModule = __webpack_require__("69f3");

var getInternalState = InternalStateModule.get;
var enforceInternalState = InternalStateModule.enforce;
var TEMPLATE = String(nativeFunctionToString).split('toString');

shared('inspectSource', function (it) {
  return nativeFunctionToString.call(it);
});

(module.exports = function (O, key, value, options) {
  var unsafe = options ? !!options.unsafe : false;
  var simple = options ? !!options.enumerable : false;
  var noTargetGet = options ? !!options.noTargetGet : false;
  if (typeof value == 'function') {
    if (typeof key == 'string' && !has(value, 'name')) createNonEnumerableProperty(value, 'name', key);
    enforceInternalState(value).source = TEMPLATE.join(typeof key == 'string' ? key : '');
  }
  if (O === global) {
    if (simple) O[key] = value;
    else setGlobal(key, value);
    return;
  } else if (!unsafe) {
    delete O[key];
  } else if (!noTargetGet && O[key]) {
    simple = true;
  }
  if (simple) O[key] = value;
  else createNonEnumerableProperty(O, key, value);
// add fake Function#toString for correct work wrapped methods / constructors with methods like LoDash isNative
})(Function.prototype, 'toString', function toString() {
  return typeof this == 'function' && getInternalState(this).source || nativeFunctionToString.call(this);
});


/***/ }),

/***/ "6f53":
/***/ (function(module, exports, __webpack_require__) {

var DESCRIPTORS = __webpack_require__("83ab");
var objectKeys = __webpack_require__("df75");
var toIndexedObject = __webpack_require__("fc6a");
var propertyIsEnumerable = __webpack_require__("d1e7").f;

// `Object.{ entries, values }` methods implementation
var createMethod = function (TO_ENTRIES) {
  return function (it) {
    var O = toIndexedObject(it);
    var keys = objectKeys(O);
    var length = keys.length;
    var i = 0;
    var result = [];
    var key;
    while (length > i) {
      key = keys[i++];
      if (!DESCRIPTORS || propertyIsEnumerable.call(O, key)) {
        result.push(TO_ENTRIES ? [key, O[key]] : O[key]);
      }
    }
    return result;
  };
};

module.exports = {
  // `Object.entries` method
  // https://tc39.github.io/ecma262/#sec-object.entries
  entries: createMethod(true),
  // `Object.values` method
  // https://tc39.github.io/ecma262/#sec-object.values
  values: createMethod(false)
};


/***/ }),

/***/ "7156":
/***/ (function(module, exports, __webpack_require__) {

var isObject = __webpack_require__("861d");
var setPrototypeOf = __webpack_require__("d2bb");

// makes subclassing work correct for wrapped built-ins
module.exports = function ($this, dummy, Wrapper) {
  var NewTarget, NewTargetPrototype;
  if (
    // it can work only with native `setPrototypeOf`
    setPrototypeOf &&
    // we haven't completely correct pre-ES6 way for getting `new.target`, so use this
    typeof (NewTarget = dummy.constructor) == 'function' &&
    NewTarget !== Wrapper &&
    isObject(NewTargetPrototype = NewTarget.prototype) &&
    NewTargetPrototype !== Wrapper.prototype
  ) setPrototypeOf($this, NewTargetPrototype);
  return $this;
};


/***/ }),

/***/ "7418":
/***/ (function(module, exports) {

exports.f = Object.getOwnPropertySymbols;


/***/ }),

/***/ "746f":
/***/ (function(module, exports, __webpack_require__) {

var path = __webpack_require__("428f");
var has = __webpack_require__("5135");
var wrappedWellKnownSymbolModule = __webpack_require__("c032");
var defineProperty = __webpack_require__("9bf2").f;

module.exports = function (NAME) {
  var Symbol = path.Symbol || (path.Symbol = {});
  if (!has(Symbol, NAME)) defineProperty(Symbol, NAME, {
    value: wrappedWellKnownSymbolModule.f(NAME)
  });
};


/***/ }),

/***/ "7839":
/***/ (function(module, exports) {

// IE8- don't enum bug keys
module.exports = [
  'constructor',
  'hasOwnProperty',
  'isPrototypeOf',
  'propertyIsEnumerable',
  'toLocaleString',
  'toString',
  'valueOf'
];


/***/ }),

/***/ "7a77":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


/**
 * A `Cancel` is an object that is thrown when an operation is canceled.
 *
 * @class
 * @param {string=} message The message.
 */
function Cancel(message) {
  this.message = message;
}

Cancel.prototype.toString = function toString() {
  return 'Cancel' + (this.message ? ': ' + this.message : '');
};

Cancel.prototype.__CANCEL__ = true;

module.exports = Cancel;


/***/ }),

/***/ "7aac":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var utils = __webpack_require__("c532");

module.exports = (
  utils.isStandardBrowserEnv() ?

  // Standard browser envs support document.cookie
    (function standardBrowserEnv() {
      return {
        write: function write(name, value, expires, path, domain, secure) {
          var cookie = [];
          cookie.push(name + '=' + encodeURIComponent(value));

          if (utils.isNumber(expires)) {
            cookie.push('expires=' + new Date(expires).toGMTString());
          }

          if (utils.isString(path)) {
            cookie.push('path=' + path);
          }

          if (utils.isString(domain)) {
            cookie.push('domain=' + domain);
          }

          if (secure === true) {
            cookie.push('secure');
          }

          document.cookie = cookie.join('; ');
        },

        read: function read(name) {
          var match = document.cookie.match(new RegExp('(^|;\\s*)(' + name + ')=([^;]*)'));
          return (match ? decodeURIComponent(match[3]) : null);
        },

        remove: function remove(name) {
          this.write(name, '', Date.now() - 86400000);
        }
      };
    })() :

  // Non standard browser env (web workers, react-native) lack needed support.
    (function nonStandardBrowserEnv() {
      return {
        write: function write() {},
        read: function read() { return null; },
        remove: function remove() {}
      };
    })()
);


/***/ }),

/***/ "7b0b":
/***/ (function(module, exports, __webpack_require__) {

var requireObjectCoercible = __webpack_require__("1d80");

// `ToObject` abstract operation
// https://tc39.github.io/ecma262/#sec-toobject
module.exports = function (argument) {
  return Object(requireObjectCoercible(argument));
};


/***/ }),

/***/ "7c73":
/***/ (function(module, exports, __webpack_require__) {

var anObject = __webpack_require__("825a");
var defineProperties = __webpack_require__("37e8");
var enumBugKeys = __webpack_require__("7839");
var hiddenKeys = __webpack_require__("d012");
var html = __webpack_require__("1be4");
var documentCreateElement = __webpack_require__("cc12");
var sharedKey = __webpack_require__("f772");
var IE_PROTO = sharedKey('IE_PROTO');

var PROTOTYPE = 'prototype';
var Empty = function () { /* empty */ };

// Create object with fake `null` prototype: use iframe Object with cleared prototype
var createDict = function () {
  // Thrash, waste and sodomy: IE GC bug
  var iframe = documentCreateElement('iframe');
  var length = enumBugKeys.length;
  var lt = '<';
  var script = 'script';
  var gt = '>';
  var js = 'java' + script + ':';
  var iframeDocument;
  iframe.style.display = 'none';
  html.appendChild(iframe);
  iframe.src = String(js);
  iframeDocument = iframe.contentWindow.document;
  iframeDocument.open();
  iframeDocument.write(lt + script + gt + 'document.F=Object' + lt + '/' + script + gt);
  iframeDocument.close();
  createDict = iframeDocument.F;
  while (length--) delete createDict[PROTOTYPE][enumBugKeys[length]];
  return createDict();
};

// `Object.create` method
// https://tc39.github.io/ecma262/#sec-object.create
module.exports = Object.create || function create(O, Properties) {
  var result;
  if (O !== null) {
    Empty[PROTOTYPE] = anObject(O);
    result = new Empty();
    Empty[PROTOTYPE] = null;
    // add "__proto__" for Object.getPrototypeOf polyfill
    result[IE_PROTO] = O;
  } else result = createDict();
  return Properties === undefined ? result : defineProperties(result, Properties);
};

hiddenKeys[IE_PROTO] = true;


/***/ }),

/***/ "7db0":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var $ = __webpack_require__("23e7");
var $find = __webpack_require__("b727").find;
var addToUnscopables = __webpack_require__("44d2");

var FIND = 'find';
var SKIPS_HOLES = true;

// Shouldn't skip holes
if (FIND in []) Array(1)[FIND](function () { SKIPS_HOLES = false; });

// `Array.prototype.find` method
// https://tc39.github.io/ecma262/#sec-array.prototype.find
$({ target: 'Array', proto: true, forced: SKIPS_HOLES }, {
  find: function find(callbackfn /* , that = undefined */) {
    return $find(this, callbackfn, arguments.length > 1 ? arguments[1] : undefined);
  }
});

// https://tc39.github.io/ecma262/#sec-array.prototype-@@unscopables
addToUnscopables(FIND);


/***/ }),

/***/ "7dd0":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var $ = __webpack_require__("23e7");
var createIteratorConstructor = __webpack_require__("9ed3");
var getPrototypeOf = __webpack_require__("e163");
var setPrototypeOf = __webpack_require__("d2bb");
var setToStringTag = __webpack_require__("d44e");
var createNonEnumerableProperty = __webpack_require__("9112");
var redefine = __webpack_require__("6eeb");
var wellKnownSymbol = __webpack_require__("b622");
var IS_PURE = __webpack_require__("c430");
var Iterators = __webpack_require__("3f8c");
var IteratorsCore = __webpack_require__("ae93");

var IteratorPrototype = IteratorsCore.IteratorPrototype;
var BUGGY_SAFARI_ITERATORS = IteratorsCore.BUGGY_SAFARI_ITERATORS;
var ITERATOR = wellKnownSymbol('iterator');
var KEYS = 'keys';
var VALUES = 'values';
var ENTRIES = 'entries';

var returnThis = function () { return this; };

module.exports = function (Iterable, NAME, IteratorConstructor, next, DEFAULT, IS_SET, FORCED) {
  createIteratorConstructor(IteratorConstructor, NAME, next);

  var getIterationMethod = function (KIND) {
    if (KIND === DEFAULT && defaultIterator) return defaultIterator;
    if (!BUGGY_SAFARI_ITERATORS && KIND in IterablePrototype) return IterablePrototype[KIND];
    switch (KIND) {
      case KEYS: return function keys() { return new IteratorConstructor(this, KIND); };
      case VALUES: return function values() { return new IteratorConstructor(this, KIND); };
      case ENTRIES: return function entries() { return new IteratorConstructor(this, KIND); };
    } return function () { return new IteratorConstructor(this); };
  };

  var TO_STRING_TAG = NAME + ' Iterator';
  var INCORRECT_VALUES_NAME = false;
  var IterablePrototype = Iterable.prototype;
  var nativeIterator = IterablePrototype[ITERATOR]
    || IterablePrototype['@@iterator']
    || DEFAULT && IterablePrototype[DEFAULT];
  var defaultIterator = !BUGGY_SAFARI_ITERATORS && nativeIterator || getIterationMethod(DEFAULT);
  var anyNativeIterator = NAME == 'Array' ? IterablePrototype.entries || nativeIterator : nativeIterator;
  var CurrentIteratorPrototype, methods, KEY;

  // fix native
  if (anyNativeIterator) {
    CurrentIteratorPrototype = getPrototypeOf(anyNativeIterator.call(new Iterable()));
    if (IteratorPrototype !== Object.prototype && CurrentIteratorPrototype.next) {
      if (!IS_PURE && getPrototypeOf(CurrentIteratorPrototype) !== IteratorPrototype) {
        if (setPrototypeOf) {
          setPrototypeOf(CurrentIteratorPrototype, IteratorPrototype);
        } else if (typeof CurrentIteratorPrototype[ITERATOR] != 'function') {
          createNonEnumerableProperty(CurrentIteratorPrototype, ITERATOR, returnThis);
        }
      }
      // Set @@toStringTag to native iterators
      setToStringTag(CurrentIteratorPrototype, TO_STRING_TAG, true, true);
      if (IS_PURE) Iterators[TO_STRING_TAG] = returnThis;
    }
  }

  // fix Array#{values, @@iterator}.name in V8 / FF
  if (DEFAULT == VALUES && nativeIterator && nativeIterator.name !== VALUES) {
    INCORRECT_VALUES_NAME = true;
    defaultIterator = function values() { return nativeIterator.call(this); };
  }

  // define iterator
  if ((!IS_PURE || FORCED) && IterablePrototype[ITERATOR] !== defaultIterator) {
    createNonEnumerableProperty(IterablePrototype, ITERATOR, defaultIterator);
  }
  Iterators[NAME] = defaultIterator;

  // export additional methods
  if (DEFAULT) {
    methods = {
      values: getIterationMethod(VALUES),
      keys: IS_SET ? defaultIterator : getIterationMethod(KEYS),
      entries: getIterationMethod(ENTRIES)
    };
    if (FORCED) for (KEY in methods) {
      if (BUGGY_SAFARI_ITERATORS || INCORRECT_VALUES_NAME || !(KEY in IterablePrototype)) {
        redefine(IterablePrototype, KEY, methods[KEY]);
      }
    } else $({ target: NAME, proto: true, forced: BUGGY_SAFARI_ITERATORS || INCORRECT_VALUES_NAME }, methods);
  }

  return methods;
};


/***/ }),

/***/ "7ed3":
/***/ (function(module, exports, __webpack_require__) {

var $ = __webpack_require__("23e7");
var anObject = __webpack_require__("825a");
var isObject = __webpack_require__("861d");
var has = __webpack_require__("5135");
var definePropertyModule = __webpack_require__("9bf2");
var getOwnPropertyDescriptorModule = __webpack_require__("06cf");
var getPrototypeOf = __webpack_require__("e163");
var createPropertyDescriptor = __webpack_require__("5c6c");

// `Reflect.set` method
// https://tc39.github.io/ecma262/#sec-reflect.set
function set(target, propertyKey, V /* , receiver */) {
  var receiver = arguments.length < 4 ? target : arguments[3];
  var ownDescriptor = getOwnPropertyDescriptorModule.f(anObject(target), propertyKey);
  var existingDescriptor, prototype;
  if (!ownDescriptor) {
    if (isObject(prototype = getPrototypeOf(target))) {
      return set(prototype, propertyKey, V, receiver);
    }
    ownDescriptor = createPropertyDescriptor(0);
  }
  if (has(ownDescriptor, 'value')) {
    if (ownDescriptor.writable === false || !isObject(receiver)) return false;
    if (existingDescriptor = getOwnPropertyDescriptorModule.f(receiver, propertyKey)) {
      if (existingDescriptor.get || existingDescriptor.set || existingDescriptor.writable === false) return false;
      existingDescriptor.value = V;
      definePropertyModule.f(receiver, propertyKey, existingDescriptor);
    } else definePropertyModule.f(receiver, propertyKey, createPropertyDescriptor(0, V));
    return true;
  }
  return ownDescriptor.set === undefined ? false : (ownDescriptor.set.call(receiver, V), true);
}

$({ target: 'Reflect', stat: true }, {
  set: set
});


/***/ }),

/***/ "7f9a":
/***/ (function(module, exports, __webpack_require__) {

var global = __webpack_require__("da84");
var nativeFunctionToString = __webpack_require__("9e81");

var WeakMap = global.WeakMap;

module.exports = typeof WeakMap === 'function' && /native code/.test(nativeFunctionToString.call(WeakMap));


/***/ }),

/***/ "8173":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return setupConfig; });
/* harmony import */ var core_js_modules_es_symbol__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("a4d3");
/* harmony import */ var core_js_modules_es_symbol__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(core_js_modules_es_symbol__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var core_js_modules_es_array_filter__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("4de4");
/* harmony import */ var core_js_modules_es_array_filter__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(core_js_modules_es_array_filter__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var core_js_modules_es_object_get_own_property_descriptor__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__("e439");
/* harmony import */ var core_js_modules_es_object_get_own_property_descriptor__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(core_js_modules_es_object_get_own_property_descriptor__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var core_js_modules_es_object_get_own_property_descriptors__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__("dbb4");
/* harmony import */ var core_js_modules_es_object_get_own_property_descriptors__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(core_js_modules_es_object_get_own_property_descriptors__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var core_js_modules_es_object_keys__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__("b64b");
/* harmony import */ var core_js_modules_es_object_keys__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(core_js_modules_es_object_keys__WEBPACK_IMPORTED_MODULE_4__);
/* harmony import */ var core_js_modules_web_dom_collections_for_each__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__("159b");
/* harmony import */ var core_js_modules_web_dom_collections_for_each__WEBPACK_IMPORTED_MODULE_5___default = /*#__PURE__*/__webpack_require__.n(core_js_modules_web_dom_collections_for_each__WEBPACK_IMPORTED_MODULE_5__);
/* harmony import */ var D_workspace_meetnow_node_modules_babel_runtime_helpers_esm_defineProperty__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__("ade3");
/* harmony import */ var _config__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__("86c8");
/* harmony import */ var _browser__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__("dc99");








function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { Object(D_workspace_meetnow_node_modules_babel_runtime_helpers_esm_defineProperty__WEBPACK_IMPORTED_MODULE_6__[/* default */ "a"])(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }


 // export config


function setupConfig(config) {
  var win = Object(_browser__WEBPACK_IMPORTED_MODULE_8__[/* isMiniProgram */ "b"])() ? wx : window;
  var MeetNow = win.MeetNow = win.MeetNow || {}; // create the Meetnow.config from raw config object (if it exists)
  // and convert Meetnow.config into a ConfigApi that has a get() fn

  var configObj = _objectSpread({}, Object(_config__WEBPACK_IMPORTED_MODULE_7__[/* configFromSession */ "b"])(win), {
    persistent: false
  }, config || MeetNow.config, {}, Object(_config__WEBPACK_IMPORTED_MODULE_7__[/* configFromURL */ "c"])(win));

  _config__WEBPACK_IMPORTED_MODULE_7__[/* CONFIG */ "a"].reset(configObj);

  if (_config__WEBPACK_IMPORTED_MODULE_7__[/* CONFIG */ "a"].getBoolean('persistent')) {
    Object(_config__WEBPACK_IMPORTED_MODULE_7__[/* saveConfig */ "d"])(win, configObj);
  }

  MeetNow.config = _config__WEBPACK_IMPORTED_MODULE_7__[/* CONFIG */ "a"];

  if (_config__WEBPACK_IMPORTED_MODULE_7__[/* CONFIG */ "a"].getBoolean('testing')) {
    _config__WEBPACK_IMPORTED_MODULE_7__[/* CONFIG */ "a"].set('debug', 'MN:*');
  }
}

/***/ }),

/***/ "825a":
/***/ (function(module, exports, __webpack_require__) {

var isObject = __webpack_require__("861d");

module.exports = function (it) {
  if (!isObject(it)) {
    throw TypeError(String(it) + ' is not an object');
  } return it;
};


/***/ }),

/***/ "83ab":
/***/ (function(module, exports, __webpack_require__) {

var fails = __webpack_require__("d039");

// Thank's IE8 for his funny defineProperty
module.exports = !fails(function () {
  return Object.defineProperty({}, 'a', { get: function () { return 7; } }).a != 7;
});


/***/ }),

/***/ "8418":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var toPrimitive = __webpack_require__("c04e");
var definePropertyModule = __webpack_require__("9bf2");
var createPropertyDescriptor = __webpack_require__("5c6c");

module.exports = function (object, key, value) {
  var propertyKey = toPrimitive(key);
  if (propertyKey in object) definePropertyModule.f(object, propertyKey, createPropertyDescriptor(0, value));
  else object[propertyKey] = value;
};


/***/ }),

/***/ "841c":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var fixRegExpWellKnownSymbolLogic = __webpack_require__("d784");
var anObject = __webpack_require__("825a");
var requireObjectCoercible = __webpack_require__("1d80");
var sameValue = __webpack_require__("129f");
var regExpExec = __webpack_require__("14c3");

// @@search logic
fixRegExpWellKnownSymbolLogic('search', 1, function (SEARCH, nativeSearch, maybeCallNative) {
  return [
    // `String.prototype.search` method
    // https://tc39.github.io/ecma262/#sec-string.prototype.search
    function search(regexp) {
      var O = requireObjectCoercible(this);
      var searcher = regexp == undefined ? undefined : regexp[SEARCH];
      return searcher !== undefined ? searcher.call(regexp, O) : new RegExp(regexp)[SEARCH](String(O));
    },
    // `RegExp.prototype[@@search]` method
    // https://tc39.github.io/ecma262/#sec-regexp.prototype-@@search
    function (regexp) {
      var res = maybeCallNative(nativeSearch, regexp, this);
      if (res.done) return res.value;

      var rx = anObject(regexp);
      var S = String(this);

      var previousLastIndex = rx.lastIndex;
      if (!sameValue(previousLastIndex, 0)) rx.lastIndex = 0;
      var result = regExpExec(rx, S);
      if (!sameValue(rx.lastIndex, previousLastIndex)) rx.lastIndex = previousLastIndex;
      return result === null ? -1 : result.index;
    }
  ];
});


/***/ }),

/***/ "861d":
/***/ (function(module, exports) {

module.exports = function (it) {
  return typeof it === 'object' ? it !== null : typeof it === 'function';
};


/***/ }),

/***/ "86c8":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";

// EXTERNAL MODULE: ./node_modules/core-js/modules/es.array.filter.js
var es_array_filter = __webpack_require__("4de4");

// EXTERNAL MODULE: ./node_modules/core-js/modules/es.array.iterator.js
var es_array_iterator = __webpack_require__("e260");

// EXTERNAL MODULE: ./node_modules/core-js/modules/es.array.map.js
var es_array_map = __webpack_require__("d81d");

// EXTERNAL MODULE: ./node_modules/core-js/modules/es.array.slice.js
var es_array_slice = __webpack_require__("fb6a");

// EXTERNAL MODULE: ./node_modules/core-js/modules/es.map.js
var es_map = __webpack_require__("4ec9");

// EXTERNAL MODULE: ./node_modules/core-js/modules/es.number.constructor.js
var es_number_constructor = __webpack_require__("a9e3");

// EXTERNAL MODULE: ./node_modules/core-js/modules/es.number.is-nan.js
var es_number_is_nan = __webpack_require__("9129");

// EXTERNAL MODULE: ./node_modules/core-js/modules/es.object.entries.js
var es_object_entries = __webpack_require__("4fad");

// EXTERNAL MODULE: ./node_modules/core-js/modules/es.object.to-string.js
var es_object_to_string = __webpack_require__("d3b7");

// EXTERNAL MODULE: ./node_modules/core-js/modules/es.regexp.exec.js
var es_regexp_exec = __webpack_require__("ac1f");

// EXTERNAL MODULE: ./node_modules/core-js/modules/es.string.iterator.js
var es_string_iterator = __webpack_require__("3ca3");

// EXTERNAL MODULE: ./node_modules/core-js/modules/es.string.search.js
var es_string_search = __webpack_require__("841c");

// EXTERNAL MODULE: ./node_modules/core-js/modules/es.string.split.js
var es_string_split = __webpack_require__("1276");

// EXTERNAL MODULE: ./node_modules/core-js/modules/web.dom-collections.for-each.js
var web_dom_collections_for_each = __webpack_require__("159b");

// EXTERNAL MODULE: ./node_modules/core-js/modules/web.dom-collections.iterator.js
var web_dom_collections_iterator = __webpack_require__("ddb0");

// CONCATENATED MODULE: ./node_modules/@babel/runtime/helpers/esm/arrayWithHoles.js
function _arrayWithHoles(arr) {
  if (Array.isArray(arr)) return arr;
}
// EXTERNAL MODULE: ./node_modules/core-js/modules/es.symbol.js
var es_symbol = __webpack_require__("a4d3");

// EXTERNAL MODULE: ./node_modules/core-js/modules/es.symbol.description.js
var es_symbol_description = __webpack_require__("e01a");

// EXTERNAL MODULE: ./node_modules/core-js/modules/es.symbol.iterator.js
var es_symbol_iterator = __webpack_require__("d28b");

// EXTERNAL MODULE: ./node_modules/core-js/modules/es.regexp.to-string.js
var es_regexp_to_string = __webpack_require__("25f0");

// CONCATENATED MODULE: ./node_modules/@babel/runtime/helpers/esm/iterableToArrayLimit.js








function _iterableToArrayLimit(arr, i) {
  if (!(Symbol.iterator in Object(arr) || Object.prototype.toString.call(arr) === "[object Arguments]")) {
    return;
  }

  var _arr = [];
  var _n = true;
  var _d = false;
  var _e = undefined;

  try {
    for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) {
      _arr.push(_s.value);

      if (i && _arr.length === i) break;
    }
  } catch (err) {
    _d = true;
    _e = err;
  } finally {
    try {
      if (!_n && _i["return"] != null) _i["return"]();
    } finally {
      if (_d) throw _e;
    }
  }

  return _arr;
}
// CONCATENATED MODULE: ./node_modules/@babel/runtime/helpers/esm/nonIterableRest.js
function _nonIterableRest() {
  throw new TypeError("Invalid attempt to destructure non-iterable instance");
}
// CONCATENATED MODULE: ./node_modules/@babel/runtime/helpers/esm/slicedToArray.js



function _slicedToArray(arr, i) {
  return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest();
}
// EXTERNAL MODULE: ./node_modules/@babel/runtime/helpers/esm/classCallCheck.js
var classCallCheck = __webpack_require__("d4ec");

// CONCATENATED MODULE: ./node_modules/@babel/runtime/helpers/esm/createClass.js
function _defineProperties(target, props) {
  for (var i = 0; i < props.length; i++) {
    var descriptor = props[i];
    descriptor.enumerable = descriptor.enumerable || false;
    descriptor.configurable = true;
    if ("value" in descriptor) descriptor.writable = true;
    Object.defineProperty(target, descriptor.key, descriptor);
  }
}

function _createClass(Constructor, protoProps, staticProps) {
  if (protoProps) _defineProperties(Constructor.prototype, protoProps);
  if (staticProps) _defineProperties(Constructor, staticProps);
  return Constructor;
}
// CONCATENATED MODULE: ./packages/meetnow/src/config/config.ts
/* unused harmony export Config */
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return CONFIG; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "b", function() { return configFromSession; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "d", function() { return saveConfig; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "c", function() { return config_configFromURL; });



















var startsWith = function startsWith(input, search) {
  return input.substr(0, search.length) === search;
};

var MEETNOW_PREFIX = 'meetnow:';
var MEETNOW_SESSION_KEY = 'meetnow-persist-config';
var config_Config =
/*#__PURE__*/
function () {
  function Config() {
    Object(classCallCheck["a" /* default */])(this, Config);

    this.m = new Map();
  }

  _createClass(Config, [{
    key: "reset",
    value: function reset(configObj) {
      this.m = new Map(Object.entries(configObj));
    }
  }, {
    key: "get",
    value: function get(key, fallback) {
      var value = this.m.get(key);
      return value !== undefined ? value : fallback;
    }
  }, {
    key: "getBoolean",
    value: function getBoolean(key) {
      var fallback = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
      var val = this.m.get(key);

      if (val === undefined) {
        return fallback;
      }

      if (typeof val === 'string') {
        return val === 'true';
      }

      return !!val;
    }
  }, {
    key: "getNumber",
    value: function getNumber(key, fallback) {
      var val = parseFloat(this.m.get(key));
      return Number.isNaN(val) ? fallback !== undefined ? fallback : NaN : val;
    }
  }, {
    key: "set",
    value: function set(key, value) {
      this.m.set(key, value);
    }
  }]);

  return Config;
}();
var CONFIG = new config_Config();
var configFromSession = function configFromSession(win) {
  try {
    var configStr = win.sessionStorage.getItem(MEETNOW_SESSION_KEY);
    return configStr !== null ? JSON.parse(configStr) : {};
  } catch (e) {
    return {};
  }
};
var saveConfig = function saveConfig(win, c) {
  try {
    win.sessionStorage.setItem(MEETNOW_SESSION_KEY, JSON.stringify(c));
  } catch (e) {
    /* eslint-disable-next-line */
    return;
  }
};
var config_configFromURL = function configFromURL(win) {
  var configObj = {};

  try {
    win.location.search.slice(1).split('&').map(function (entry) {
      return entry.split('=');
    }).map(function (_ref) {
      var _ref2 = _slicedToArray(_ref, 2),
          key = _ref2[0],
          value = _ref2[1];

      return [decodeURIComponent(key), decodeURIComponent(value)];
    }).filter(function (_ref3) {
      var _ref4 = _slicedToArray(_ref3, 1),
          key = _ref4[0];

      return startsWith(key, MEETNOW_PREFIX);
    }).map(function (_ref5) {
      var _ref6 = _slicedToArray(_ref5, 2),
          key = _ref6[0],
          value = _ref6[1];

      return [key.slice(MEETNOW_PREFIX.length), value];
    }).forEach(function (_ref7) {
      var _ref8 = _slicedToArray(_ref7, 2),
          key = _ref8[0],
          value = _ref8[1];

      configObj[key] = value;
    });
  } catch (e) {
    return configObj;
  }

  return configObj;
};

/***/ }),

/***/ "8aa5":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var charAt = __webpack_require__("6547").charAt;

// `AdvanceStringIndex` abstract operation
// https://tc39.github.io/ecma262/#sec-advancestringindex
module.exports = function (S, index, unicode) {
  return index + (unicode ? charAt(S, index).length : 1);
};


/***/ }),

/***/ "8df4":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var Cancel = __webpack_require__("7a77");

/**
 * A `CancelToken` is an object that can be used to request cancellation of an operation.
 *
 * @class
 * @param {Function} executor The executor function.
 */
function CancelToken(executor) {
  if (typeof executor !== 'function') {
    throw new TypeError('executor must be a function.');
  }

  var resolvePromise;
  this.promise = new Promise(function promiseExecutor(resolve) {
    resolvePromise = resolve;
  });

  var token = this;
  executor(function cancel(message) {
    if (token.reason) {
      // Cancellation has already been requested
      return;
    }

    token.reason = new Cancel(message);
    resolvePromise(token.reason);
  });
}

/**
 * Throws a `Cancel` if cancellation has been requested.
 */
CancelToken.prototype.throwIfRequested = function throwIfRequested() {
  if (this.reason) {
    throw this.reason;
  }
};

/**
 * Returns an object that contains a new `CancelToken` and a function that, when called,
 * cancels the `CancelToken`.
 */
CancelToken.source = function source() {
  var cancel;
  var token = new CancelToken(function executor(c) {
    cancel = c;
  });
  return {
    token: token,
    cancel: cancel
  };
};

module.exports = CancelToken;


/***/ }),

/***/ "90e3":
/***/ (function(module, exports) {

var id = 0;
var postfix = Math.random();

module.exports = function (key) {
  return 'Symbol(' + String(key === undefined ? '' : key) + ')_' + (++id + postfix).toString(36);
};


/***/ }),

/***/ "9112":
/***/ (function(module, exports, __webpack_require__) {

var DESCRIPTORS = __webpack_require__("83ab");
var definePropertyModule = __webpack_require__("9bf2");
var createPropertyDescriptor = __webpack_require__("5c6c");

module.exports = DESCRIPTORS ? function (object, key, value) {
  return definePropertyModule.f(object, key, createPropertyDescriptor(1, value));
} : function (object, key, value) {
  object[key] = value;
  return object;
};


/***/ }),

/***/ "9129":
/***/ (function(module, exports, __webpack_require__) {

var $ = __webpack_require__("23e7");

// `Number.isNaN` method
// https://tc39.github.io/ecma262/#sec-number.isnan
$({ target: 'Number', stat: true }, {
  isNaN: function isNaN(number) {
    // eslint-disable-next-line no-self-compare
    return number != number;
  }
});


/***/ }),

/***/ "9263":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var regexpFlags = __webpack_require__("ad6d");

var nativeExec = RegExp.prototype.exec;
// This always refers to the native implementation, because the
// String#replace polyfill uses ./fix-regexp-well-known-symbol-logic.js,
// which loads this file before patching the method.
var nativeReplace = String.prototype.replace;

var patchedExec = nativeExec;

var UPDATES_LAST_INDEX_WRONG = (function () {
  var re1 = /a/;
  var re2 = /b*/g;
  nativeExec.call(re1, 'a');
  nativeExec.call(re2, 'a');
  return re1.lastIndex !== 0 || re2.lastIndex !== 0;
})();

// nonparticipating capturing group, copied from es5-shim's String#split patch.
var NPCG_INCLUDED = /()??/.exec('')[1] !== undefined;

var PATCH = UPDATES_LAST_INDEX_WRONG || NPCG_INCLUDED;

if (PATCH) {
  patchedExec = function exec(str) {
    var re = this;
    var lastIndex, reCopy, match, i;

    if (NPCG_INCLUDED) {
      reCopy = new RegExp('^' + re.source + '$(?!\\s)', regexpFlags.call(re));
    }
    if (UPDATES_LAST_INDEX_WRONG) lastIndex = re.lastIndex;

    match = nativeExec.call(re, str);

    if (UPDATES_LAST_INDEX_WRONG && match) {
      re.lastIndex = re.global ? match.index + match[0].length : lastIndex;
    }
    if (NPCG_INCLUDED && match && match.length > 1) {
      // Fix browsers whose `exec` methods don't consistently return `undefined`
      // for NPCG, like IE8. NOTE: This doesn' work for /(.?)?/
      nativeReplace.call(match[0], reCopy, function () {
        for (i = 1; i < arguments.length - 2; i++) {
          if (arguments[i] === undefined) match[i] = undefined;
        }
      });
    }

    return match;
  };
}

module.exports = patchedExec;


/***/ }),

/***/ "94ca":
/***/ (function(module, exports, __webpack_require__) {

var fails = __webpack_require__("d039");

var replacement = /#|\.prototype\./;

var isForced = function (feature, detection) {
  var value = data[normalize(feature)];
  return value == POLYFILL ? true
    : value == NATIVE ? false
    : typeof detection == 'function' ? fails(detection)
    : !!detection;
};

var normalize = isForced.normalize = function (string) {
  return String(string).replace(replacement, '.').toLowerCase();
};

var data = isForced.data = {};
var NATIVE = isForced.NATIVE = 'N';
var POLYFILL = isForced.POLYFILL = 'P';

module.exports = isForced;


/***/ }),

/***/ "9669":
/***/ (function(module, exports) {

/**
 * Helpers.
 */

var s = 1000;
var m = s * 60;
var h = m * 60;
var d = h * 24;
var w = d * 7;
var y = d * 365.25;

/**
 * Parse or format the given `val`.
 *
 * Options:
 *
 *  - `long` verbose formatting [false]
 *
 * @param {String|Number} val
 * @param {Object} [options]
 * @throws {Error} throw an error if val is not a non-empty string or a number
 * @return {String|Number}
 * @api public
 */

module.exports = function(val, options) {
  options = options || {};
  var type = typeof val;
  if (type === 'string' && val.length > 0) {
    return parse(val);
  } else if (type === 'number' && isFinite(val)) {
    return options.long ? fmtLong(val) : fmtShort(val);
  }
  throw new Error(
    'val is not a non-empty string or a valid number. val=' +
      JSON.stringify(val)
  );
};

/**
 * Parse the given `str` and return milliseconds.
 *
 * @param {String} str
 * @return {Number}
 * @api private
 */

function parse(str) {
  str = String(str);
  if (str.length > 100) {
    return;
  }
  var match = /^(-?(?:\d+)?\.?\d+) *(milliseconds?|msecs?|ms|seconds?|secs?|s|minutes?|mins?|m|hours?|hrs?|h|days?|d|weeks?|w|years?|yrs?|y)?$/i.exec(
    str
  );
  if (!match) {
    return;
  }
  var n = parseFloat(match[1]);
  var type = (match[2] || 'ms').toLowerCase();
  switch (type) {
    case 'years':
    case 'year':
    case 'yrs':
    case 'yr':
    case 'y':
      return n * y;
    case 'weeks':
    case 'week':
    case 'w':
      return n * w;
    case 'days':
    case 'day':
    case 'd':
      return n * d;
    case 'hours':
    case 'hour':
    case 'hrs':
    case 'hr':
    case 'h':
      return n * h;
    case 'minutes':
    case 'minute':
    case 'mins':
    case 'min':
    case 'm':
      return n * m;
    case 'seconds':
    case 'second':
    case 'secs':
    case 'sec':
    case 's':
      return n * s;
    case 'milliseconds':
    case 'millisecond':
    case 'msecs':
    case 'msec':
    case 'ms':
      return n;
    default:
      return undefined;
  }
}

/**
 * Short format for `ms`.
 *
 * @param {Number} ms
 * @return {String}
 * @api private
 */

function fmtShort(ms) {
  var msAbs = Math.abs(ms);
  if (msAbs >= d) {
    return Math.round(ms / d) + 'd';
  }
  if (msAbs >= h) {
    return Math.round(ms / h) + 'h';
  }
  if (msAbs >= m) {
    return Math.round(ms / m) + 'm';
  }
  if (msAbs >= s) {
    return Math.round(ms / s) + 's';
  }
  return ms + 'ms';
}

/**
 * Long format for `ms`.
 *
 * @param {Number} ms
 * @return {String}
 * @api private
 */

function fmtLong(ms) {
  var msAbs = Math.abs(ms);
  if (msAbs >= d) {
    return plural(ms, msAbs, d, 'day');
  }
  if (msAbs >= h) {
    return plural(ms, msAbs, h, 'hour');
  }
  if (msAbs >= m) {
    return plural(ms, msAbs, m, 'minute');
  }
  if (msAbs >= s) {
    return plural(ms, msAbs, s, 'second');
  }
  return ms + ' ms';
}

/**
 * Pluralization helper.
 */

function plural(ms, msAbs, n, name) {
  var isPlural = msAbs >= n * 1.5;
  return Math.round(ms / n) + ' ' + name + (isPlural ? 's' : '');
}


/***/ }),

/***/ "96cf":
/***/ (function(module, exports) {

/**
 * Copyright (c) 2014-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

!(function(global) {
  "use strict";

  var Op = Object.prototype;
  var hasOwn = Op.hasOwnProperty;
  var undefined; // More compressible than void 0.
  var $Symbol = typeof Symbol === "function" ? Symbol : {};
  var iteratorSymbol = $Symbol.iterator || "@@iterator";
  var asyncIteratorSymbol = $Symbol.asyncIterator || "@@asyncIterator";
  var toStringTagSymbol = $Symbol.toStringTag || "@@toStringTag";

  var inModule = typeof module === "object";
  var runtime = global.regeneratorRuntime;
  if (runtime) {
    if (inModule) {
      // If regeneratorRuntime is defined globally and we're in a module,
      // make the exports object identical to regeneratorRuntime.
      module.exports = runtime;
    }
    // Don't bother evaluating the rest of this file if the runtime was
    // already defined globally.
    return;
  }

  // Define the runtime globally (as expected by generated code) as either
  // module.exports (if we're in a module) or a new, empty object.
  runtime = global.regeneratorRuntime = inModule ? module.exports : {};

  function wrap(innerFn, outerFn, self, tryLocsList) {
    // If outerFn provided and outerFn.prototype is a Generator, then outerFn.prototype instanceof Generator.
    var protoGenerator = outerFn && outerFn.prototype instanceof Generator ? outerFn : Generator;
    var generator = Object.create(protoGenerator.prototype);
    var context = new Context(tryLocsList || []);

    // The ._invoke method unifies the implementations of the .next,
    // .throw, and .return methods.
    generator._invoke = makeInvokeMethod(innerFn, self, context);

    return generator;
  }
  runtime.wrap = wrap;

  // Try/catch helper to minimize deoptimizations. Returns a completion
  // record like context.tryEntries[i].completion. This interface could
  // have been (and was previously) designed to take a closure to be
  // invoked without arguments, but in all the cases we care about we
  // already have an existing method we want to call, so there's no need
  // to create a new function object. We can even get away with assuming
  // the method takes exactly one argument, since that happens to be true
  // in every case, so we don't have to touch the arguments object. The
  // only additional allocation required is the completion record, which
  // has a stable shape and so hopefully should be cheap to allocate.
  function tryCatch(fn, obj, arg) {
    try {
      return { type: "normal", arg: fn.call(obj, arg) };
    } catch (err) {
      return { type: "throw", arg: err };
    }
  }

  var GenStateSuspendedStart = "suspendedStart";
  var GenStateSuspendedYield = "suspendedYield";
  var GenStateExecuting = "executing";
  var GenStateCompleted = "completed";

  // Returning this object from the innerFn has the same effect as
  // breaking out of the dispatch switch statement.
  var ContinueSentinel = {};

  // Dummy constructor functions that we use as the .constructor and
  // .constructor.prototype properties for functions that return Generator
  // objects. For full spec compliance, you may wish to configure your
  // minifier not to mangle the names of these two functions.
  function Generator() {}
  function GeneratorFunction() {}
  function GeneratorFunctionPrototype() {}

  // This is a polyfill for %IteratorPrototype% for environments that
  // don't natively support it.
  var IteratorPrototype = {};
  IteratorPrototype[iteratorSymbol] = function () {
    return this;
  };

  var getProto = Object.getPrototypeOf;
  var NativeIteratorPrototype = getProto && getProto(getProto(values([])));
  if (NativeIteratorPrototype &&
      NativeIteratorPrototype !== Op &&
      hasOwn.call(NativeIteratorPrototype, iteratorSymbol)) {
    // This environment has a native %IteratorPrototype%; use it instead
    // of the polyfill.
    IteratorPrototype = NativeIteratorPrototype;
  }

  var Gp = GeneratorFunctionPrototype.prototype =
    Generator.prototype = Object.create(IteratorPrototype);
  GeneratorFunction.prototype = Gp.constructor = GeneratorFunctionPrototype;
  GeneratorFunctionPrototype.constructor = GeneratorFunction;
  GeneratorFunctionPrototype[toStringTagSymbol] =
    GeneratorFunction.displayName = "GeneratorFunction";

  // Helper for defining the .next, .throw, and .return methods of the
  // Iterator interface in terms of a single ._invoke method.
  function defineIteratorMethods(prototype) {
    ["next", "throw", "return"].forEach(function(method) {
      prototype[method] = function(arg) {
        return this._invoke(method, arg);
      };
    });
  }

  runtime.isGeneratorFunction = function(genFun) {
    var ctor = typeof genFun === "function" && genFun.constructor;
    return ctor
      ? ctor === GeneratorFunction ||
        // For the native GeneratorFunction constructor, the best we can
        // do is to check its .name property.
        (ctor.displayName || ctor.name) === "GeneratorFunction"
      : false;
  };

  runtime.mark = function(genFun) {
    if (Object.setPrototypeOf) {
      Object.setPrototypeOf(genFun, GeneratorFunctionPrototype);
    } else {
      genFun.__proto__ = GeneratorFunctionPrototype;
      if (!(toStringTagSymbol in genFun)) {
        genFun[toStringTagSymbol] = "GeneratorFunction";
      }
    }
    genFun.prototype = Object.create(Gp);
    return genFun;
  };

  // Within the body of any async function, `await x` is transformed to
  // `yield regeneratorRuntime.awrap(x)`, so that the runtime can test
  // `hasOwn.call(value, "__await")` to determine if the yielded value is
  // meant to be awaited.
  runtime.awrap = function(arg) {
    return { __await: arg };
  };

  function AsyncIterator(generator) {
    function invoke(method, arg, resolve, reject) {
      var record = tryCatch(generator[method], generator, arg);
      if (record.type === "throw") {
        reject(record.arg);
      } else {
        var result = record.arg;
        var value = result.value;
        if (value &&
            typeof value === "object" &&
            hasOwn.call(value, "__await")) {
          return Promise.resolve(value.__await).then(function(value) {
            invoke("next", value, resolve, reject);
          }, function(err) {
            invoke("throw", err, resolve, reject);
          });
        }

        return Promise.resolve(value).then(function(unwrapped) {
          // When a yielded Promise is resolved, its final value becomes
          // the .value of the Promise<{value,done}> result for the
          // current iteration. If the Promise is rejected, however, the
          // result for this iteration will be rejected with the same
          // reason. Note that rejections of yielded Promises are not
          // thrown back into the generator function, as is the case
          // when an awaited Promise is rejected. This difference in
          // behavior between yield and await is important, because it
          // allows the consumer to decide what to do with the yielded
          // rejection (swallow it and continue, manually .throw it back
          // into the generator, abandon iteration, whatever). With
          // await, by contrast, there is no opportunity to examine the
          // rejection reason outside the generator function, so the
          // only option is to throw it from the await expression, and
          // let the generator function handle the exception.
          result.value = unwrapped;
          resolve(result);
        }, reject);
      }
    }

    var previousPromise;

    function enqueue(method, arg) {
      function callInvokeWithMethodAndArg() {
        return new Promise(function(resolve, reject) {
          invoke(method, arg, resolve, reject);
        });
      }

      return previousPromise =
        // If enqueue has been called before, then we want to wait until
        // all previous Promises have been resolved before calling invoke,
        // so that results are always delivered in the correct order. If
        // enqueue has not been called before, then it is important to
        // call invoke immediately, without waiting on a callback to fire,
        // so that the async generator function has the opportunity to do
        // any necessary setup in a predictable way. This predictability
        // is why the Promise constructor synchronously invokes its
        // executor callback, and why async functions synchronously
        // execute code before the first await. Since we implement simple
        // async functions in terms of async generators, it is especially
        // important to get this right, even though it requires care.
        previousPromise ? previousPromise.then(
          callInvokeWithMethodAndArg,
          // Avoid propagating failures to Promises returned by later
          // invocations of the iterator.
          callInvokeWithMethodAndArg
        ) : callInvokeWithMethodAndArg();
    }

    // Define the unified helper method that is used to implement .next,
    // .throw, and .return (see defineIteratorMethods).
    this._invoke = enqueue;
  }

  defineIteratorMethods(AsyncIterator.prototype);
  AsyncIterator.prototype[asyncIteratorSymbol] = function () {
    return this;
  };
  runtime.AsyncIterator = AsyncIterator;

  // Note that simple async functions are implemented on top of
  // AsyncIterator objects; they just return a Promise for the value of
  // the final result produced by the iterator.
  runtime.async = function(innerFn, outerFn, self, tryLocsList) {
    var iter = new AsyncIterator(
      wrap(innerFn, outerFn, self, tryLocsList)
    );

    return runtime.isGeneratorFunction(outerFn)
      ? iter // If outerFn is a generator, return the full iterator.
      : iter.next().then(function(result) {
          return result.done ? result.value : iter.next();
        });
  };

  function makeInvokeMethod(innerFn, self, context) {
    var state = GenStateSuspendedStart;

    return function invoke(method, arg) {
      if (state === GenStateExecuting) {
        throw new Error("Generator is already running");
      }

      if (state === GenStateCompleted) {
        if (method === "throw") {
          throw arg;
        }

        // Be forgiving, per 25.3.3.3.3 of the spec:
        // https://people.mozilla.org/~jorendorff/es6-draft.html#sec-generatorresume
        return doneResult();
      }

      context.method = method;
      context.arg = arg;

      while (true) {
        var delegate = context.delegate;
        if (delegate) {
          var delegateResult = maybeInvokeDelegate(delegate, context);
          if (delegateResult) {
            if (delegateResult === ContinueSentinel) continue;
            return delegateResult;
          }
        }

        if (context.method === "next") {
          // Setting context._sent for legacy support of Babel's
          // function.sent implementation.
          context.sent = context._sent = context.arg;

        } else if (context.method === "throw") {
          if (state === GenStateSuspendedStart) {
            state = GenStateCompleted;
            throw context.arg;
          }

          context.dispatchException(context.arg);

        } else if (context.method === "return") {
          context.abrupt("return", context.arg);
        }

        state = GenStateExecuting;

        var record = tryCatch(innerFn, self, context);
        if (record.type === "normal") {
          // If an exception is thrown from innerFn, we leave state ===
          // GenStateExecuting and loop back for another invocation.
          state = context.done
            ? GenStateCompleted
            : GenStateSuspendedYield;

          if (record.arg === ContinueSentinel) {
            continue;
          }

          return {
            value: record.arg,
            done: context.done
          };

        } else if (record.type === "throw") {
          state = GenStateCompleted;
          // Dispatch the exception by looping back around to the
          // context.dispatchException(context.arg) call above.
          context.method = "throw";
          context.arg = record.arg;
        }
      }
    };
  }

  // Call delegate.iterator[context.method](context.arg) and handle the
  // result, either by returning a { value, done } result from the
  // delegate iterator, or by modifying context.method and context.arg,
  // setting context.delegate to null, and returning the ContinueSentinel.
  function maybeInvokeDelegate(delegate, context) {
    var method = delegate.iterator[context.method];
    if (method === undefined) {
      // A .throw or .return when the delegate iterator has no .throw
      // method always terminates the yield* loop.
      context.delegate = null;

      if (context.method === "throw") {
        if (delegate.iterator.return) {
          // If the delegate iterator has a return method, give it a
          // chance to clean up.
          context.method = "return";
          context.arg = undefined;
          maybeInvokeDelegate(delegate, context);

          if (context.method === "throw") {
            // If maybeInvokeDelegate(context) changed context.method from
            // "return" to "throw", let that override the TypeError below.
            return ContinueSentinel;
          }
        }

        context.method = "throw";
        context.arg = new TypeError(
          "The iterator does not provide a 'throw' method");
      }

      return ContinueSentinel;
    }

    var record = tryCatch(method, delegate.iterator, context.arg);

    if (record.type === "throw") {
      context.method = "throw";
      context.arg = record.arg;
      context.delegate = null;
      return ContinueSentinel;
    }

    var info = record.arg;

    if (! info) {
      context.method = "throw";
      context.arg = new TypeError("iterator result is not an object");
      context.delegate = null;
      return ContinueSentinel;
    }

    if (info.done) {
      // Assign the result of the finished delegate to the temporary
      // variable specified by delegate.resultName (see delegateYield).
      context[delegate.resultName] = info.value;

      // Resume execution at the desired location (see delegateYield).
      context.next = delegate.nextLoc;

      // If context.method was "throw" but the delegate handled the
      // exception, let the outer generator proceed normally. If
      // context.method was "next", forget context.arg since it has been
      // "consumed" by the delegate iterator. If context.method was
      // "return", allow the original .return call to continue in the
      // outer generator.
      if (context.method !== "return") {
        context.method = "next";
        context.arg = undefined;
      }

    } else {
      // Re-yield the result returned by the delegate method.
      return info;
    }

    // The delegate iterator is finished, so forget it and continue with
    // the outer generator.
    context.delegate = null;
    return ContinueSentinel;
  }

  // Define Generator.prototype.{next,throw,return} in terms of the
  // unified ._invoke helper method.
  defineIteratorMethods(Gp);

  Gp[toStringTagSymbol] = "Generator";

  // A Generator should always return itself as the iterator object when the
  // @@iterator function is called on it. Some browsers' implementations of the
  // iterator prototype chain incorrectly implement this, causing the Generator
  // object to not be returned from this call. This ensures that doesn't happen.
  // See https://github.com/facebook/regenerator/issues/274 for more details.
  Gp[iteratorSymbol] = function() {
    return this;
  };

  Gp.toString = function() {
    return "[object Generator]";
  };

  function pushTryEntry(locs) {
    var entry = { tryLoc: locs[0] };

    if (1 in locs) {
      entry.catchLoc = locs[1];
    }

    if (2 in locs) {
      entry.finallyLoc = locs[2];
      entry.afterLoc = locs[3];
    }

    this.tryEntries.push(entry);
  }

  function resetTryEntry(entry) {
    var record = entry.completion || {};
    record.type = "normal";
    delete record.arg;
    entry.completion = record;
  }

  function Context(tryLocsList) {
    // The root entry object (effectively a try statement without a catch
    // or a finally block) gives us a place to store values thrown from
    // locations where there is no enclosing try statement.
    this.tryEntries = [{ tryLoc: "root" }];
    tryLocsList.forEach(pushTryEntry, this);
    this.reset(true);
  }

  runtime.keys = function(object) {
    var keys = [];
    for (var key in object) {
      keys.push(key);
    }
    keys.reverse();

    // Rather than returning an object with a next method, we keep
    // things simple and return the next function itself.
    return function next() {
      while (keys.length) {
        var key = keys.pop();
        if (key in object) {
          next.value = key;
          next.done = false;
          return next;
        }
      }

      // To avoid creating an additional object, we just hang the .value
      // and .done properties off the next function object itself. This
      // also ensures that the minifier will not anonymize the function.
      next.done = true;
      return next;
    };
  };

  function values(iterable) {
    if (iterable) {
      var iteratorMethod = iterable[iteratorSymbol];
      if (iteratorMethod) {
        return iteratorMethod.call(iterable);
      }

      if (typeof iterable.next === "function") {
        return iterable;
      }

      if (!isNaN(iterable.length)) {
        var i = -1, next = function next() {
          while (++i < iterable.length) {
            if (hasOwn.call(iterable, i)) {
              next.value = iterable[i];
              next.done = false;
              return next;
            }
          }

          next.value = undefined;
          next.done = true;

          return next;
        };

        return next.next = next;
      }
    }

    // Return an iterator with no values.
    return { next: doneResult };
  }
  runtime.values = values;

  function doneResult() {
    return { value: undefined, done: true };
  }

  Context.prototype = {
    constructor: Context,

    reset: function(skipTempReset) {
      this.prev = 0;
      this.next = 0;
      // Resetting context._sent for legacy support of Babel's
      // function.sent implementation.
      this.sent = this._sent = undefined;
      this.done = false;
      this.delegate = null;

      this.method = "next";
      this.arg = undefined;

      this.tryEntries.forEach(resetTryEntry);

      if (!skipTempReset) {
        for (var name in this) {
          // Not sure about the optimal order of these conditions:
          if (name.charAt(0) === "t" &&
              hasOwn.call(this, name) &&
              !isNaN(+name.slice(1))) {
            this[name] = undefined;
          }
        }
      }
    },

    stop: function() {
      this.done = true;

      var rootEntry = this.tryEntries[0];
      var rootRecord = rootEntry.completion;
      if (rootRecord.type === "throw") {
        throw rootRecord.arg;
      }

      return this.rval;
    },

    dispatchException: function(exception) {
      if (this.done) {
        throw exception;
      }

      var context = this;
      function handle(loc, caught) {
        record.type = "throw";
        record.arg = exception;
        context.next = loc;

        if (caught) {
          // If the dispatched exception was caught by a catch block,
          // then let that catch block handle the exception normally.
          context.method = "next";
          context.arg = undefined;
        }

        return !! caught;
      }

      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i];
        var record = entry.completion;

        if (entry.tryLoc === "root") {
          // Exception thrown outside of any try block that could handle
          // it, so set the completion value of the entire function to
          // throw the exception.
          return handle("end");
        }

        if (entry.tryLoc <= this.prev) {
          var hasCatch = hasOwn.call(entry, "catchLoc");
          var hasFinally = hasOwn.call(entry, "finallyLoc");

          if (hasCatch && hasFinally) {
            if (this.prev < entry.catchLoc) {
              return handle(entry.catchLoc, true);
            } else if (this.prev < entry.finallyLoc) {
              return handle(entry.finallyLoc);
            }

          } else if (hasCatch) {
            if (this.prev < entry.catchLoc) {
              return handle(entry.catchLoc, true);
            }

          } else if (hasFinally) {
            if (this.prev < entry.finallyLoc) {
              return handle(entry.finallyLoc);
            }

          } else {
            throw new Error("try statement without catch or finally");
          }
        }
      }
    },

    abrupt: function(type, arg) {
      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i];
        if (entry.tryLoc <= this.prev &&
            hasOwn.call(entry, "finallyLoc") &&
            this.prev < entry.finallyLoc) {
          var finallyEntry = entry;
          break;
        }
      }

      if (finallyEntry &&
          (type === "break" ||
           type === "continue") &&
          finallyEntry.tryLoc <= arg &&
          arg <= finallyEntry.finallyLoc) {
        // Ignore the finally entry if control is not jumping to a
        // location outside the try/catch block.
        finallyEntry = null;
      }

      var record = finallyEntry ? finallyEntry.completion : {};
      record.type = type;
      record.arg = arg;

      if (finallyEntry) {
        this.method = "next";
        this.next = finallyEntry.finallyLoc;
        return ContinueSentinel;
      }

      return this.complete(record);
    },

    complete: function(record, afterLoc) {
      if (record.type === "throw") {
        throw record.arg;
      }

      if (record.type === "break" ||
          record.type === "continue") {
        this.next = record.arg;
      } else if (record.type === "return") {
        this.rval = this.arg = record.arg;
        this.method = "return";
        this.next = "end";
      } else if (record.type === "normal" && afterLoc) {
        this.next = afterLoc;
      }

      return ContinueSentinel;
    },

    finish: function(finallyLoc) {
      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i];
        if (entry.finallyLoc === finallyLoc) {
          this.complete(entry.completion, entry.afterLoc);
          resetTryEntry(entry);
          return ContinueSentinel;
        }
      }
    },

    "catch": function(tryLoc) {
      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i];
        if (entry.tryLoc === tryLoc) {
          var record = entry.completion;
          if (record.type === "throw") {
            var thrown = record.arg;
            resetTryEntry(entry);
          }
          return thrown;
        }
      }

      // The context.catch method must only be called with a location
      // argument that corresponds to a known catch block.
      throw new Error("illegal catch attempt");
    },

    delegateYield: function(iterable, resultName, nextLoc) {
      this.delegate = {
        iterator: values(iterable),
        resultName: resultName,
        nextLoc: nextLoc
      };

      if (this.method === "next") {
        // Deliberately forget the last sent value so that we don't
        // accidentally pass it on to the delegate.
        this.arg = undefined;
      }

      return ContinueSentinel;
    }
  };
})(
  // In sloppy mode, unbound `this` refers to the global object, fallback to
  // Function constructor if we're in global strict mode. That is sadly a form
  // of indirect eval which violates Content Security Policy.
  (function() { return this })() || Function("return this")()
);


/***/ }),

/***/ "99af":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var $ = __webpack_require__("23e7");
var fails = __webpack_require__("d039");
var isArray = __webpack_require__("e8b5");
var isObject = __webpack_require__("861d");
var toObject = __webpack_require__("7b0b");
var toLength = __webpack_require__("50c4");
var createProperty = __webpack_require__("8418");
var arraySpeciesCreate = __webpack_require__("65f0");
var arrayMethodHasSpeciesSupport = __webpack_require__("1dde");
var wellKnownSymbol = __webpack_require__("b622");
var V8_VERSION = __webpack_require__("60ae");

var IS_CONCAT_SPREADABLE = wellKnownSymbol('isConcatSpreadable');
var MAX_SAFE_INTEGER = 0x1FFFFFFFFFFFFF;
var MAXIMUM_ALLOWED_INDEX_EXCEEDED = 'Maximum allowed index exceeded';

// We can't use this feature detection in V8 since it causes
// deoptimization and serious performance degradation
// https://github.com/zloirock/core-js/issues/679
var IS_CONCAT_SPREADABLE_SUPPORT = V8_VERSION >= 51 || !fails(function () {
  var array = [];
  array[IS_CONCAT_SPREADABLE] = false;
  return array.concat()[0] !== array;
});

var SPECIES_SUPPORT = arrayMethodHasSpeciesSupport('concat');

var isConcatSpreadable = function (O) {
  if (!isObject(O)) return false;
  var spreadable = O[IS_CONCAT_SPREADABLE];
  return spreadable !== undefined ? !!spreadable : isArray(O);
};

var FORCED = !IS_CONCAT_SPREADABLE_SUPPORT || !SPECIES_SUPPORT;

// `Array.prototype.concat` method
// https://tc39.github.io/ecma262/#sec-array.prototype.concat
// with adding support of @@isConcatSpreadable and @@species
$({ target: 'Array', proto: true, forced: FORCED }, {
  concat: function concat(arg) { // eslint-disable-line no-unused-vars
    var O = toObject(this);
    var A = arraySpeciesCreate(O, 0);
    var n = 0;
    var i, k, length, len, E;
    for (i = -1, length = arguments.length; i < length; i++) {
      E = i === -1 ? O : arguments[i];
      if (isConcatSpreadable(E)) {
        len = toLength(E.length);
        if (n + len > MAX_SAFE_INTEGER) throw TypeError(MAXIMUM_ALLOWED_INDEX_EXCEEDED);
        for (k = 0; k < len; k++, n++) if (k in E) createProperty(A, n, E[k]);
      } else {
        if (n >= MAX_SAFE_INTEGER) throw TypeError(MAXIMUM_ALLOWED_INDEX_EXCEEDED);
        createProperty(A, n++, E);
      }
    }
    A.length = n;
    return A;
  }
});


/***/ }),

/***/ "9a63":
/***/ (function(module, exports) {

var charenc = {
  // UTF-8 encoding
  utf8: {
    // Convert a string to a byte array
    stringToBytes: function(str) {
      return charenc.bin.stringToBytes(unescape(encodeURIComponent(str)));
    },

    // Convert a byte array to a string
    bytesToString: function(bytes) {
      return decodeURIComponent(escape(charenc.bin.bytesToString(bytes)));
    }
  },

  // Binary encoding
  bin: {
    // Convert a string to a byte array
    stringToBytes: function(str) {
      for (var bytes = [], i = 0; i < str.length; i++)
        bytes.push(str.charCodeAt(i) & 0xFF);
      return bytes;
    },

    // Convert a byte array to a string
    bytesToString: function(bytes) {
      for (var str = [], i = 0; i < bytes.length; i++)
        str.push(String.fromCharCode(bytes[i]));
      return str.join('');
    }
  }
};

module.exports = charenc;


/***/ }),

/***/ "9bdd":
/***/ (function(module, exports, __webpack_require__) {

var anObject = __webpack_require__("825a");

// call something on iterator step with safe closing on error
module.exports = function (iterator, fn, value, ENTRIES) {
  try {
    return ENTRIES ? fn(anObject(value)[0], value[1]) : fn(value);
  // 7.4.6 IteratorClose(iterator, completion)
  } catch (error) {
    var returnMethod = iterator['return'];
    if (returnMethod !== undefined) anObject(returnMethod.call(iterator));
    throw error;
  }
};


/***/ }),

/***/ "9bf2":
/***/ (function(module, exports, __webpack_require__) {

var DESCRIPTORS = __webpack_require__("83ab");
var IE8_DOM_DEFINE = __webpack_require__("0cfb");
var anObject = __webpack_require__("825a");
var toPrimitive = __webpack_require__("c04e");

var nativeDefineProperty = Object.defineProperty;

// `Object.defineProperty` method
// https://tc39.github.io/ecma262/#sec-object.defineproperty
exports.f = DESCRIPTORS ? nativeDefineProperty : function defineProperty(O, P, Attributes) {
  anObject(O);
  P = toPrimitive(P, true);
  anObject(Attributes);
  if (IE8_DOM_DEFINE) try {
    return nativeDefineProperty(O, P, Attributes);
  } catch (error) { /* empty */ }
  if ('get' in Attributes || 'set' in Attributes) throw TypeError('Accessors not supported');
  if ('value' in Attributes) O[P] = Attributes.value;
  return O;
};


/***/ }),

/***/ "9e81":
/***/ (function(module, exports, __webpack_require__) {

var shared = __webpack_require__("5692");

module.exports = shared('native-function-to-string', Function.toString);


/***/ }),

/***/ "9ed3":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var IteratorPrototype = __webpack_require__("ae93").IteratorPrototype;
var create = __webpack_require__("7c73");
var createPropertyDescriptor = __webpack_require__("5c6c");
var setToStringTag = __webpack_require__("d44e");
var Iterators = __webpack_require__("3f8c");

var returnThis = function () { return this; };

module.exports = function (IteratorConstructor, NAME, next) {
  var TO_STRING_TAG = NAME + ' Iterator';
  IteratorConstructor.prototype = create(IteratorPrototype, { next: createPropertyDescriptor(1, next) });
  setToStringTag(IteratorConstructor, TO_STRING_TAG, false, true);
  Iterators[TO_STRING_TAG] = returnThis;
  return IteratorConstructor;
};


/***/ }),

/***/ "a145":
/***/ (function(module, exports, __webpack_require__) {


/**
 * This is the common logic for both the Node.js and web browser
 * implementations of `debug()`.
 */

function setup(env) {
	createDebug.debug = createDebug;
	createDebug.default = createDebug;
	createDebug.coerce = coerce;
	createDebug.disable = disable;
	createDebug.enable = enable;
	createDebug.enabled = enabled;
	createDebug.humanize = __webpack_require__("9669");

	Object.keys(env).forEach(key => {
		createDebug[key] = env[key];
	});

	/**
	* Active `debug` instances.
	*/
	createDebug.instances = [];

	/**
	* The currently active debug mode names, and names to skip.
	*/

	createDebug.names = [];
	createDebug.skips = [];

	/**
	* Map of special "%n" handling functions, for the debug "format" argument.
	*
	* Valid key names are a single, lower or upper-case letter, i.e. "n" and "N".
	*/
	createDebug.formatters = {};

	/**
	* Selects a color for a debug namespace
	* @param {String} namespace The namespace string for the for the debug instance to be colored
	* @return {Number|String} An ANSI color code for the given namespace
	* @api private
	*/
	function selectColor(namespace) {
		let hash = 0;

		for (let i = 0; i < namespace.length; i++) {
			hash = ((hash << 5) - hash) + namespace.charCodeAt(i);
			hash |= 0; // Convert to 32bit integer
		}

		return createDebug.colors[Math.abs(hash) % createDebug.colors.length];
	}
	createDebug.selectColor = selectColor;

	/**
	* Create a debugger with the given `namespace`.
	*
	* @param {String} namespace
	* @return {Function}
	* @api public
	*/
	function createDebug(namespace) {
		let prevTime;

		function debug(...args) {
			// Disabled?
			if (!debug.enabled) {
				return;
			}

			const self = debug;

			// Set `diff` timestamp
			const curr = Number(new Date());
			const ms = curr - (prevTime || curr);
			self.diff = ms;
			self.prev = prevTime;
			self.curr = curr;
			prevTime = curr;

			args[0] = createDebug.coerce(args[0]);

			if (typeof args[0] !== 'string') {
				// Anything else let's inspect with %O
				args.unshift('%O');
			}

			// Apply any `formatters` transformations
			let index = 0;
			args[0] = args[0].replace(/%([a-zA-Z%])/g, (match, format) => {
				// If we encounter an escaped % then don't increase the array index
				if (match === '%%') {
					return match;
				}
				index++;
				const formatter = createDebug.formatters[format];
				if (typeof formatter === 'function') {
					const val = args[index];
					match = formatter.call(self, val);

					// Now we need to remove `args[index]` since it's inlined in the `format`
					args.splice(index, 1);
					index--;
				}
				return match;
			});

			// Apply env-specific formatting (colors, etc.)
			createDebug.formatArgs.call(self, args);

			const logFn = self.log || createDebug.log;
			logFn.apply(self, args);
		}

		debug.namespace = namespace;
		debug.enabled = createDebug.enabled(namespace);
		debug.useColors = createDebug.useColors();
		debug.color = selectColor(namespace);
		debug.destroy = destroy;
		debug.extend = extend;
		// Debug.formatArgs = formatArgs;
		// debug.rawLog = rawLog;

		// env-specific initialization logic for debug instances
		if (typeof createDebug.init === 'function') {
			createDebug.init(debug);
		}

		createDebug.instances.push(debug);

		return debug;
	}

	function destroy() {
		const index = createDebug.instances.indexOf(this);
		if (index !== -1) {
			createDebug.instances.splice(index, 1);
			return true;
		}
		return false;
	}

	function extend(namespace, delimiter) {
		const newDebug = createDebug(this.namespace + (typeof delimiter === 'undefined' ? ':' : delimiter) + namespace);
		newDebug.log = this.log;
		return newDebug;
	}

	/**
	* Enables a debug mode by namespaces. This can include modes
	* separated by a colon and wildcards.
	*
	* @param {String} namespaces
	* @api public
	*/
	function enable(namespaces) {
		createDebug.save(namespaces);

		createDebug.names = [];
		createDebug.skips = [];

		let i;
		const split = (typeof namespaces === 'string' ? namespaces : '').split(/[\s,]+/);
		const len = split.length;

		for (i = 0; i < len; i++) {
			if (!split[i]) {
				// ignore empty strings
				continue;
			}

			namespaces = split[i].replace(/\*/g, '.*?');

			if (namespaces[0] === '-') {
				createDebug.skips.push(new RegExp('^' + namespaces.substr(1) + '$'));
			} else {
				createDebug.names.push(new RegExp('^' + namespaces + '$'));
			}
		}

		for (i = 0; i < createDebug.instances.length; i++) {
			const instance = createDebug.instances[i];
			instance.enabled = createDebug.enabled(instance.namespace);
		}
	}

	/**
	* Disable debug output.
	*
	* @return {String} namespaces
	* @api public
	*/
	function disable() {
		const namespaces = [
			...createDebug.names.map(toNamespace),
			...createDebug.skips.map(toNamespace).map(namespace => '-' + namespace)
		].join(',');
		createDebug.enable('');
		return namespaces;
	}

	/**
	* Returns true if the given mode name is enabled, false otherwise.
	*
	* @param {String} name
	* @return {Boolean}
	* @api public
	*/
	function enabled(name) {
		if (name[name.length - 1] === '*') {
			return true;
		}

		let i;
		let len;

		for (i = 0, len = createDebug.skips.length; i < len; i++) {
			if (createDebug.skips[i].test(name)) {
				return false;
			}
		}

		for (i = 0, len = createDebug.names.length; i < len; i++) {
			if (createDebug.names[i].test(name)) {
				return true;
			}
		}

		return false;
	}

	/**
	* Convert regexp to namespace
	*
	* @param {RegExp} regxep
	* @return {String} namespace
	* @api private
	*/
	function toNamespace(regexp) {
		return regexp.toString()
			.substring(2, regexp.toString().length - 2)
			.replace(/\.\*\?$/, '*');
	}

	/**
	* Coerce `val`.
	*
	* @param {Mixed} val
	* @return {Mixed}
	* @api private
	*/
	function coerce(val) {
		if (val instanceof Error) {
			return val.stack || val.message;
		}
		return val;
	}

	createDebug.enable(createDebug.load());

	return createDebug;
}

module.exports = setup;


/***/ }),

/***/ "a15b":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var $ = __webpack_require__("23e7");
var IndexedObject = __webpack_require__("44ad");
var toIndexedObject = __webpack_require__("fc6a");
var sloppyArrayMethod = __webpack_require__("b301");

var nativeJoin = [].join;

var ES3_STRINGS = IndexedObject != Object;
var SLOPPY_METHOD = sloppyArrayMethod('join', ',');

// `Array.prototype.join` method
// https://tc39.github.io/ecma262/#sec-array.prototype.join
$({ target: 'Array', proto: true, forced: ES3_STRINGS || SLOPPY_METHOD }, {
  join: function join(separator) {
    return nativeJoin.call(toIndexedObject(this), separator === undefined ? ',' : separator);
  }
});


/***/ }),

/***/ "a434":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var $ = __webpack_require__("23e7");
var toAbsoluteIndex = __webpack_require__("23cb");
var toInteger = __webpack_require__("a691");
var toLength = __webpack_require__("50c4");
var toObject = __webpack_require__("7b0b");
var arraySpeciesCreate = __webpack_require__("65f0");
var createProperty = __webpack_require__("8418");
var arrayMethodHasSpeciesSupport = __webpack_require__("1dde");

var max = Math.max;
var min = Math.min;
var MAX_SAFE_INTEGER = 0x1FFFFFFFFFFFFF;
var MAXIMUM_ALLOWED_LENGTH_EXCEEDED = 'Maximum allowed length exceeded';

// `Array.prototype.splice` method
// https://tc39.github.io/ecma262/#sec-array.prototype.splice
// with adding support of @@species
$({ target: 'Array', proto: true, forced: !arrayMethodHasSpeciesSupport('splice') }, {
  splice: function splice(start, deleteCount /* , ...items */) {
    var O = toObject(this);
    var len = toLength(O.length);
    var actualStart = toAbsoluteIndex(start, len);
    var argumentsLength = arguments.length;
    var insertCount, actualDeleteCount, A, k, from, to;
    if (argumentsLength === 0) {
      insertCount = actualDeleteCount = 0;
    } else if (argumentsLength === 1) {
      insertCount = 0;
      actualDeleteCount = len - actualStart;
    } else {
      insertCount = argumentsLength - 2;
      actualDeleteCount = min(max(toInteger(deleteCount), 0), len - actualStart);
    }
    if (len + insertCount - actualDeleteCount > MAX_SAFE_INTEGER) {
      throw TypeError(MAXIMUM_ALLOWED_LENGTH_EXCEEDED);
    }
    A = arraySpeciesCreate(O, actualDeleteCount);
    for (k = 0; k < actualDeleteCount; k++) {
      from = actualStart + k;
      if (from in O) createProperty(A, k, O[from]);
    }
    A.length = actualDeleteCount;
    if (insertCount < actualDeleteCount) {
      for (k = actualStart; k < len - actualDeleteCount; k++) {
        from = k + actualDeleteCount;
        to = k + insertCount;
        if (from in O) O[to] = O[from];
        else delete O[to];
      }
      for (k = len; k > len - actualDeleteCount + insertCount; k--) delete O[k - 1];
    } else if (insertCount > actualDeleteCount) {
      for (k = len - actualDeleteCount; k > actualStart; k--) {
        from = k + actualDeleteCount - 1;
        to = k + insertCount - 1;
        if (from in O) O[to] = O[from];
        else delete O[to];
      }
    }
    for (k = 0; k < insertCount; k++) {
      O[k + actualStart] = arguments[k + 2];
    }
    O.length = len - actualDeleteCount + insertCount;
    return A;
  }
});


/***/ }),

/***/ "a4d3":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var $ = __webpack_require__("23e7");
var global = __webpack_require__("da84");
var IS_PURE = __webpack_require__("c430");
var DESCRIPTORS = __webpack_require__("83ab");
var NATIVE_SYMBOL = __webpack_require__("4930");
var fails = __webpack_require__("d039");
var has = __webpack_require__("5135");
var isArray = __webpack_require__("e8b5");
var isObject = __webpack_require__("861d");
var anObject = __webpack_require__("825a");
var toObject = __webpack_require__("7b0b");
var toIndexedObject = __webpack_require__("fc6a");
var toPrimitive = __webpack_require__("c04e");
var createPropertyDescriptor = __webpack_require__("5c6c");
var nativeObjectCreate = __webpack_require__("7c73");
var objectKeys = __webpack_require__("df75");
var getOwnPropertyNamesModule = __webpack_require__("241c");
var getOwnPropertyNamesExternal = __webpack_require__("057f");
var getOwnPropertySymbolsModule = __webpack_require__("7418");
var getOwnPropertyDescriptorModule = __webpack_require__("06cf");
var definePropertyModule = __webpack_require__("9bf2");
var propertyIsEnumerableModule = __webpack_require__("d1e7");
var createNonEnumerableProperty = __webpack_require__("9112");
var redefine = __webpack_require__("6eeb");
var shared = __webpack_require__("5692");
var sharedKey = __webpack_require__("f772");
var hiddenKeys = __webpack_require__("d012");
var uid = __webpack_require__("90e3");
var wellKnownSymbol = __webpack_require__("b622");
var wrappedWellKnownSymbolModule = __webpack_require__("c032");
var defineWellKnownSymbol = __webpack_require__("746f");
var setToStringTag = __webpack_require__("d44e");
var InternalStateModule = __webpack_require__("69f3");
var $forEach = __webpack_require__("b727").forEach;

var HIDDEN = sharedKey('hidden');
var SYMBOL = 'Symbol';
var PROTOTYPE = 'prototype';
var TO_PRIMITIVE = wellKnownSymbol('toPrimitive');
var setInternalState = InternalStateModule.set;
var getInternalState = InternalStateModule.getterFor(SYMBOL);
var ObjectPrototype = Object[PROTOTYPE];
var $Symbol = global.Symbol;
var JSON = global.JSON;
var nativeJSONStringify = JSON && JSON.stringify;
var nativeGetOwnPropertyDescriptor = getOwnPropertyDescriptorModule.f;
var nativeDefineProperty = definePropertyModule.f;
var nativeGetOwnPropertyNames = getOwnPropertyNamesExternal.f;
var nativePropertyIsEnumerable = propertyIsEnumerableModule.f;
var AllSymbols = shared('symbols');
var ObjectPrototypeSymbols = shared('op-symbols');
var StringToSymbolRegistry = shared('string-to-symbol-registry');
var SymbolToStringRegistry = shared('symbol-to-string-registry');
var WellKnownSymbolsStore = shared('wks');
var QObject = global.QObject;
// Don't use setters in Qt Script, https://github.com/zloirock/core-js/issues/173
var USE_SETTER = !QObject || !QObject[PROTOTYPE] || !QObject[PROTOTYPE].findChild;

// fallback for old Android, https://code.google.com/p/v8/issues/detail?id=687
var setSymbolDescriptor = DESCRIPTORS && fails(function () {
  return nativeObjectCreate(nativeDefineProperty({}, 'a', {
    get: function () { return nativeDefineProperty(this, 'a', { value: 7 }).a; }
  })).a != 7;
}) ? function (O, P, Attributes) {
  var ObjectPrototypeDescriptor = nativeGetOwnPropertyDescriptor(ObjectPrototype, P);
  if (ObjectPrototypeDescriptor) delete ObjectPrototype[P];
  nativeDefineProperty(O, P, Attributes);
  if (ObjectPrototypeDescriptor && O !== ObjectPrototype) {
    nativeDefineProperty(ObjectPrototype, P, ObjectPrototypeDescriptor);
  }
} : nativeDefineProperty;

var wrap = function (tag, description) {
  var symbol = AllSymbols[tag] = nativeObjectCreate($Symbol[PROTOTYPE]);
  setInternalState(symbol, {
    type: SYMBOL,
    tag: tag,
    description: description
  });
  if (!DESCRIPTORS) symbol.description = description;
  return symbol;
};

var isSymbol = NATIVE_SYMBOL && typeof $Symbol.iterator == 'symbol' ? function (it) {
  return typeof it == 'symbol';
} : function (it) {
  return Object(it) instanceof $Symbol;
};

var $defineProperty = function defineProperty(O, P, Attributes) {
  if (O === ObjectPrototype) $defineProperty(ObjectPrototypeSymbols, P, Attributes);
  anObject(O);
  var key = toPrimitive(P, true);
  anObject(Attributes);
  if (has(AllSymbols, key)) {
    if (!Attributes.enumerable) {
      if (!has(O, HIDDEN)) nativeDefineProperty(O, HIDDEN, createPropertyDescriptor(1, {}));
      O[HIDDEN][key] = true;
    } else {
      if (has(O, HIDDEN) && O[HIDDEN][key]) O[HIDDEN][key] = false;
      Attributes = nativeObjectCreate(Attributes, { enumerable: createPropertyDescriptor(0, false) });
    } return setSymbolDescriptor(O, key, Attributes);
  } return nativeDefineProperty(O, key, Attributes);
};

var $defineProperties = function defineProperties(O, Properties) {
  anObject(O);
  var properties = toIndexedObject(Properties);
  var keys = objectKeys(properties).concat($getOwnPropertySymbols(properties));
  $forEach(keys, function (key) {
    if (!DESCRIPTORS || $propertyIsEnumerable.call(properties, key)) $defineProperty(O, key, properties[key]);
  });
  return O;
};

var $create = function create(O, Properties) {
  return Properties === undefined ? nativeObjectCreate(O) : $defineProperties(nativeObjectCreate(O), Properties);
};

var $propertyIsEnumerable = function propertyIsEnumerable(V) {
  var P = toPrimitive(V, true);
  var enumerable = nativePropertyIsEnumerable.call(this, P);
  if (this === ObjectPrototype && has(AllSymbols, P) && !has(ObjectPrototypeSymbols, P)) return false;
  return enumerable || !has(this, P) || !has(AllSymbols, P) || has(this, HIDDEN) && this[HIDDEN][P] ? enumerable : true;
};

var $getOwnPropertyDescriptor = function getOwnPropertyDescriptor(O, P) {
  var it = toIndexedObject(O);
  var key = toPrimitive(P, true);
  if (it === ObjectPrototype && has(AllSymbols, key) && !has(ObjectPrototypeSymbols, key)) return;
  var descriptor = nativeGetOwnPropertyDescriptor(it, key);
  if (descriptor && has(AllSymbols, key) && !(has(it, HIDDEN) && it[HIDDEN][key])) {
    descriptor.enumerable = true;
  }
  return descriptor;
};

var $getOwnPropertyNames = function getOwnPropertyNames(O) {
  var names = nativeGetOwnPropertyNames(toIndexedObject(O));
  var result = [];
  $forEach(names, function (key) {
    if (!has(AllSymbols, key) && !has(hiddenKeys, key)) result.push(key);
  });
  return result;
};

var $getOwnPropertySymbols = function getOwnPropertySymbols(O) {
  var IS_OBJECT_PROTOTYPE = O === ObjectPrototype;
  var names = nativeGetOwnPropertyNames(IS_OBJECT_PROTOTYPE ? ObjectPrototypeSymbols : toIndexedObject(O));
  var result = [];
  $forEach(names, function (key) {
    if (has(AllSymbols, key) && (!IS_OBJECT_PROTOTYPE || has(ObjectPrototype, key))) {
      result.push(AllSymbols[key]);
    }
  });
  return result;
};

// `Symbol` constructor
// https://tc39.github.io/ecma262/#sec-symbol-constructor
if (!NATIVE_SYMBOL) {
  $Symbol = function Symbol() {
    if (this instanceof $Symbol) throw TypeError('Symbol is not a constructor');
    var description = !arguments.length || arguments[0] === undefined ? undefined : String(arguments[0]);
    var tag = uid(description);
    var setter = function (value) {
      if (this === ObjectPrototype) setter.call(ObjectPrototypeSymbols, value);
      if (has(this, HIDDEN) && has(this[HIDDEN], tag)) this[HIDDEN][tag] = false;
      setSymbolDescriptor(this, tag, createPropertyDescriptor(1, value));
    };
    if (DESCRIPTORS && USE_SETTER) setSymbolDescriptor(ObjectPrototype, tag, { configurable: true, set: setter });
    return wrap(tag, description);
  };

  redefine($Symbol[PROTOTYPE], 'toString', function toString() {
    return getInternalState(this).tag;
  });

  propertyIsEnumerableModule.f = $propertyIsEnumerable;
  definePropertyModule.f = $defineProperty;
  getOwnPropertyDescriptorModule.f = $getOwnPropertyDescriptor;
  getOwnPropertyNamesModule.f = getOwnPropertyNamesExternal.f = $getOwnPropertyNames;
  getOwnPropertySymbolsModule.f = $getOwnPropertySymbols;

  if (DESCRIPTORS) {
    // https://github.com/tc39/proposal-Symbol-description
    nativeDefineProperty($Symbol[PROTOTYPE], 'description', {
      configurable: true,
      get: function description() {
        return getInternalState(this).description;
      }
    });
    if (!IS_PURE) {
      redefine(ObjectPrototype, 'propertyIsEnumerable', $propertyIsEnumerable, { unsafe: true });
    }
  }

  wrappedWellKnownSymbolModule.f = function (name) {
    return wrap(wellKnownSymbol(name), name);
  };
}

$({ global: true, wrap: true, forced: !NATIVE_SYMBOL, sham: !NATIVE_SYMBOL }, {
  Symbol: $Symbol
});

$forEach(objectKeys(WellKnownSymbolsStore), function (name) {
  defineWellKnownSymbol(name);
});

$({ target: SYMBOL, stat: true, forced: !NATIVE_SYMBOL }, {
  // `Symbol.for` method
  // https://tc39.github.io/ecma262/#sec-symbol.for
  'for': function (key) {
    var string = String(key);
    if (has(StringToSymbolRegistry, string)) return StringToSymbolRegistry[string];
    var symbol = $Symbol(string);
    StringToSymbolRegistry[string] = symbol;
    SymbolToStringRegistry[symbol] = string;
    return symbol;
  },
  // `Symbol.keyFor` method
  // https://tc39.github.io/ecma262/#sec-symbol.keyfor
  keyFor: function keyFor(sym) {
    if (!isSymbol(sym)) throw TypeError(sym + ' is not a symbol');
    if (has(SymbolToStringRegistry, sym)) return SymbolToStringRegistry[sym];
  },
  useSetter: function () { USE_SETTER = true; },
  useSimple: function () { USE_SETTER = false; }
});

$({ target: 'Object', stat: true, forced: !NATIVE_SYMBOL, sham: !DESCRIPTORS }, {
  // `Object.create` method
  // https://tc39.github.io/ecma262/#sec-object.create
  create: $create,
  // `Object.defineProperty` method
  // https://tc39.github.io/ecma262/#sec-object.defineproperty
  defineProperty: $defineProperty,
  // `Object.defineProperties` method
  // https://tc39.github.io/ecma262/#sec-object.defineproperties
  defineProperties: $defineProperties,
  // `Object.getOwnPropertyDescriptor` method
  // https://tc39.github.io/ecma262/#sec-object.getownpropertydescriptors
  getOwnPropertyDescriptor: $getOwnPropertyDescriptor
});

$({ target: 'Object', stat: true, forced: !NATIVE_SYMBOL }, {
  // `Object.getOwnPropertyNames` method
  // https://tc39.github.io/ecma262/#sec-object.getownpropertynames
  getOwnPropertyNames: $getOwnPropertyNames,
  // `Object.getOwnPropertySymbols` method
  // https://tc39.github.io/ecma262/#sec-object.getownpropertysymbols
  getOwnPropertySymbols: $getOwnPropertySymbols
});

// Chrome 38 and 39 `Object.getOwnPropertySymbols` fails on primitives
// https://bugs.chromium.org/p/v8/issues/detail?id=3443
$({ target: 'Object', stat: true, forced: fails(function () { getOwnPropertySymbolsModule.f(1); }) }, {
  getOwnPropertySymbols: function getOwnPropertySymbols(it) {
    return getOwnPropertySymbolsModule.f(toObject(it));
  }
});

// `JSON.stringify` method behavior with symbols
// https://tc39.github.io/ecma262/#sec-json.stringify
JSON && $({ target: 'JSON', stat: true, forced: !NATIVE_SYMBOL || fails(function () {
  var symbol = $Symbol();
  // MS Edge converts symbol values to JSON as {}
  return nativeJSONStringify([symbol]) != '[null]'
    // WebKit converts symbol values to JSON as null
    || nativeJSONStringify({ a: symbol }) != '{}'
    // V8 throws on boxed symbols
    || nativeJSONStringify(Object(symbol)) != '{}';
}) }, {
  stringify: function stringify(it) {
    var args = [it];
    var index = 1;
    var replacer, $replacer;
    while (arguments.length > index) args.push(arguments[index++]);
    $replacer = replacer = args[1];
    if (!isObject(replacer) && it === undefined || isSymbol(it)) return; // IE8 returns string on undefined
    if (!isArray(replacer)) replacer = function (key, value) {
      if (typeof $replacer == 'function') value = $replacer.call(this, key, value);
      if (!isSymbol(value)) return value;
    };
    args[1] = replacer;
    return nativeJSONStringify.apply(JSON, args);
  }
});

// `Symbol.prototype[@@toPrimitive]` method
// https://tc39.github.io/ecma262/#sec-symbol.prototype-@@toprimitive
if (!$Symbol[PROTOTYPE][TO_PRIMITIVE]) {
  createNonEnumerableProperty($Symbol[PROTOTYPE], TO_PRIMITIVE, $Symbol[PROTOTYPE].valueOf);
}
// `Symbol.prototype[@@toStringTag]` property
// https://tc39.github.io/ecma262/#sec-symbol.prototype-@@tostringtag
setToStringTag($Symbol, SYMBOL);

hiddenKeys[HIDDEN] = true;


/***/ }),

/***/ "a630":
/***/ (function(module, exports, __webpack_require__) {

var $ = __webpack_require__("23e7");
var from = __webpack_require__("4df4");
var checkCorrectnessOfIteration = __webpack_require__("1c7e");

var INCORRECT_ITERATION = !checkCorrectnessOfIteration(function (iterable) {
  Array.from(iterable);
});

// `Array.from` method
// https://tc39.github.io/ecma262/#sec-array.from
$({ target: 'Array', stat: true, forced: INCORRECT_ITERATION }, {
  from: from
});


/***/ }),

/***/ "a691":
/***/ (function(module, exports) {

var ceil = Math.ceil;
var floor = Math.floor;

// `ToInteger` abstract operation
// https://tc39.github.io/ecma262/#sec-tointeger
module.exports = function (argument) {
  return isNaN(argument = +argument) ? 0 : (argument > 0 ? floor : ceil)(argument);
};


/***/ }),

/***/ "a79d":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var $ = __webpack_require__("23e7");
var IS_PURE = __webpack_require__("c430");
var NativePromise = __webpack_require__("fea9");
var getBuiltIn = __webpack_require__("d066");
var speciesConstructor = __webpack_require__("4840");
var promiseResolve = __webpack_require__("cdf9");
var redefine = __webpack_require__("6eeb");

// `Promise.prototype.finally` method
// https://tc39.github.io/ecma262/#sec-promise.prototype.finally
$({ target: 'Promise', proto: true, real: true }, {
  'finally': function (onFinally) {
    var C = speciesConstructor(this, getBuiltIn('Promise'));
    var isFunction = typeof onFinally == 'function';
    return this.then(
      isFunction ? function (x) {
        return promiseResolve(C, onFinally()).then(function () { return x; });
      } : onFinally,
      isFunction ? function (e) {
        return promiseResolve(C, onFinally()).then(function () { throw e; });
      } : onFinally
    );
  }
});

// patch native Promise.prototype for native async functions
if (!IS_PURE && typeof NativePromise == 'function' && !NativePromise.prototype['finally']) {
  redefine(NativePromise.prototype, 'finally', getBuiltIn('Promise').prototype['finally']);
}


/***/ }),

/***/ "a9e3":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var DESCRIPTORS = __webpack_require__("83ab");
var global = __webpack_require__("da84");
var isForced = __webpack_require__("94ca");
var redefine = __webpack_require__("6eeb");
var has = __webpack_require__("5135");
var classof = __webpack_require__("c6b6");
var inheritIfRequired = __webpack_require__("7156");
var toPrimitive = __webpack_require__("c04e");
var fails = __webpack_require__("d039");
var create = __webpack_require__("7c73");
var getOwnPropertyNames = __webpack_require__("241c").f;
var getOwnPropertyDescriptor = __webpack_require__("06cf").f;
var defineProperty = __webpack_require__("9bf2").f;
var trim = __webpack_require__("58a8").trim;

var NUMBER = 'Number';
var NativeNumber = global[NUMBER];
var NumberPrototype = NativeNumber.prototype;

// Opera ~12 has broken Object#toString
var BROKEN_CLASSOF = classof(create(NumberPrototype)) == NUMBER;

// `ToNumber` abstract operation
// https://tc39.github.io/ecma262/#sec-tonumber
var toNumber = function (argument) {
  var it = toPrimitive(argument, false);
  var first, third, radix, maxCode, digits, length, index, code;
  if (typeof it == 'string' && it.length > 2) {
    it = trim(it);
    first = it.charCodeAt(0);
    if (first === 43 || first === 45) {
      third = it.charCodeAt(2);
      if (third === 88 || third === 120) return NaN; // Number('+0x1') should be NaN, old V8 fix
    } else if (first === 48) {
      switch (it.charCodeAt(1)) {
        case 66: case 98: radix = 2; maxCode = 49; break; // fast equal of /^0b[01]+$/i
        case 79: case 111: radix = 8; maxCode = 55; break; // fast equal of /^0o[0-7]+$/i
        default: return +it;
      }
      digits = it.slice(2);
      length = digits.length;
      for (index = 0; index < length; index++) {
        code = digits.charCodeAt(index);
        // parseInt parses a string to a first unavailable symbol
        // but ToNumber should return NaN if a string contains unavailable symbols
        if (code < 48 || code > maxCode) return NaN;
      } return parseInt(digits, radix);
    }
  } return +it;
};

// `Number` constructor
// https://tc39.github.io/ecma262/#sec-number-constructor
if (isForced(NUMBER, !NativeNumber(' 0o1') || !NativeNumber('0b1') || NativeNumber('+0x1'))) {
  var NumberWrapper = function Number(value) {
    var it = arguments.length < 1 ? 0 : value;
    var dummy = this;
    return dummy instanceof NumberWrapper
      // check on 1..constructor(foo) case
      && (BROKEN_CLASSOF ? fails(function () { NumberPrototype.valueOf.call(dummy); }) : classof(dummy) != NUMBER)
        ? inheritIfRequired(new NativeNumber(toNumber(it)), dummy, NumberWrapper) : toNumber(it);
  };
  for (var keys = DESCRIPTORS ? getOwnPropertyNames(NativeNumber) : (
    // ES3:
    'MAX_VALUE,MIN_VALUE,NaN,NEGATIVE_INFINITY,POSITIVE_INFINITY,' +
    // ES2015 (in case, if modules with ES2015 Number statics required before):
    'EPSILON,isFinite,isInteger,isNaN,isSafeInteger,MAX_SAFE_INTEGER,' +
    'MIN_SAFE_INTEGER,parseFloat,parseInt,isInteger'
  ).split(','), j = 0, key; keys.length > j; j++) {
    if (has(NativeNumber, key = keys[j]) && !has(NumberWrapper, key)) {
      defineProperty(NumberWrapper, key, getOwnPropertyDescriptor(NativeNumber, key));
    }
  }
  NumberWrapper.prototype = NumberPrototype;
  NumberPrototype.constructor = NumberWrapper;
  redefine(global, NUMBER, NumberWrapper);
}


/***/ }),

/***/ "ab13":
/***/ (function(module, exports, __webpack_require__) {

var wellKnownSymbol = __webpack_require__("b622");

var MATCH = wellKnownSymbol('match');

module.exports = function (METHOD_NAME) {
  var regexp = /./;
  try {
    '/./'[METHOD_NAME](regexp);
  } catch (e) {
    try {
      regexp[MATCH] = false;
      return '/./'[METHOD_NAME](regexp);
    } catch (f) { /* empty */ }
  } return false;
};


/***/ }),

/***/ "ac1f":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var $ = __webpack_require__("23e7");
var exec = __webpack_require__("9263");

$({ target: 'RegExp', proto: true, forced: /./.exec !== exec }, {
  exec: exec
});


/***/ }),

/***/ "ad6d":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var anObject = __webpack_require__("825a");

// `RegExp.prototype.flags` getter implementation
// https://tc39.github.io/ecma262/#sec-get-regexp.prototype.flags
module.exports = function () {
  var that = anObject(this);
  var result = '';
  if (that.global) result += 'g';
  if (that.ignoreCase) result += 'i';
  if (that.multiline) result += 'm';
  if (that.dotAll) result += 's';
  if (that.unicode) result += 'u';
  if (that.sticky) result += 'y';
  return result;
};


/***/ }),

/***/ "ade3":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return _defineProperty; });
function _defineProperty(obj, key, value) {
  if (key in obj) {
    Object.defineProperty(obj, key, {
      value: value,
      enumerable: true,
      configurable: true,
      writable: true
    });
  } else {
    obj[key] = value;
  }

  return obj;
}

/***/ }),

/***/ "ae93":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var getPrototypeOf = __webpack_require__("e163");
var createNonEnumerableProperty = __webpack_require__("9112");
var has = __webpack_require__("5135");
var wellKnownSymbol = __webpack_require__("b622");
var IS_PURE = __webpack_require__("c430");

var ITERATOR = wellKnownSymbol('iterator');
var BUGGY_SAFARI_ITERATORS = false;

var returnThis = function () { return this; };

// `%IteratorPrototype%` object
// https://tc39.github.io/ecma262/#sec-%iteratorprototype%-object
var IteratorPrototype, PrototypeOfArrayIteratorPrototype, arrayIterator;

if ([].keys) {
  arrayIterator = [].keys();
  // Safari 8 has buggy iterators w/o `next`
  if (!('next' in arrayIterator)) BUGGY_SAFARI_ITERATORS = true;
  else {
    PrototypeOfArrayIteratorPrototype = getPrototypeOf(getPrototypeOf(arrayIterator));
    if (PrototypeOfArrayIteratorPrototype !== Object.prototype) IteratorPrototype = PrototypeOfArrayIteratorPrototype;
  }
}

if (IteratorPrototype == undefined) IteratorPrototype = {};

// 25.1.2.1.1 %IteratorPrototype%[@@iterator]()
if (!IS_PURE && !has(IteratorPrototype, ITERATOR)) {
  createNonEnumerableProperty(IteratorPrototype, ITERATOR, returnThis);
}

module.exports = {
  IteratorPrototype: IteratorPrototype,
  BUGGY_SAFARI_ITERATORS: BUGGY_SAFARI_ITERATORS
};


/***/ }),

/***/ "b041":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var classof = __webpack_require__("f5df");
var wellKnownSymbol = __webpack_require__("b622");

var TO_STRING_TAG = wellKnownSymbol('toStringTag');
var test = {};

test[TO_STRING_TAG] = 'z';

// `Object.prototype.toString` method implementation
// https://tc39.github.io/ecma262/#sec-object.prototype.tostring
module.exports = String(test) !== '[object z]' ? function toString() {
  return '[object ' + classof(this) + ']';
} : test.toString;


/***/ }),

/***/ "b0c0":
/***/ (function(module, exports, __webpack_require__) {

var DESCRIPTORS = __webpack_require__("83ab");
var defineProperty = __webpack_require__("9bf2").f;

var FunctionPrototype = Function.prototype;
var FunctionPrototypeToString = FunctionPrototype.toString;
var nameRE = /^\s*function ([^ (]*)/;
var NAME = 'name';

// Function instances `.name` property
// https://tc39.github.io/ecma262/#sec-function-instances-name
if (DESCRIPTORS && !(NAME in FunctionPrototype)) {
  defineProperty(FunctionPrototype, NAME, {
    configurable: true,
    get: function () {
      try {
        return FunctionPrototypeToString.call(this).match(nameRE)[1];
      } catch (error) {
        return '';
      }
    }
  });
}


/***/ }),

/***/ "b301":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var fails = __webpack_require__("d039");

module.exports = function (METHOD_NAME, argument) {
  var method = [][METHOD_NAME];
  return !method || !fails(function () {
    // eslint-disable-next-line no-useless-call,no-throw-literal
    method.call(null, argument || function () { throw 1; }, 1);
  });
};


/***/ }),

/***/ "b39a":
/***/ (function(module, exports, __webpack_require__) {

var getBuiltIn = __webpack_require__("d066");

module.exports = getBuiltIn('navigator', 'userAgent') || '';


/***/ }),

/***/ "b50d":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var utils = __webpack_require__("c532");
var settle = __webpack_require__("467f");
var buildURL = __webpack_require__("30b5");
var parseHeaders = __webpack_require__("c345");
var isURLSameOrigin = __webpack_require__("3934");
var createError = __webpack_require__("2d83");

module.exports = function xhrAdapter(config) {
  return new Promise(function dispatchXhrRequest(resolve, reject) {
    var requestData = config.data;
    var requestHeaders = config.headers;

    if (utils.isFormData(requestData)) {
      delete requestHeaders['Content-Type']; // Let the browser set it
    }

    var request = new XMLHttpRequest();

    // HTTP basic authentication
    if (config.auth) {
      var username = config.auth.username || '';
      var password = config.auth.password || '';
      requestHeaders.Authorization = 'Basic ' + btoa(username + ':' + password);
    }

    request.open(config.method.toUpperCase(), buildURL(config.url, config.params, config.paramsSerializer), true);

    // Set the request timeout in MS
    request.timeout = config.timeout;

    // Listen for ready state
    request.onreadystatechange = function handleLoad() {
      if (!request || request.readyState !== 4) {
        return;
      }

      // The request errored out and we didn't get a response, this will be
      // handled by onerror instead
      // With one exception: request that using file: protocol, most browsers
      // will return status as 0 even though it's a successful request
      if (request.status === 0 && !(request.responseURL && request.responseURL.indexOf('file:') === 0)) {
        return;
      }

      // Prepare the response
      var responseHeaders = 'getAllResponseHeaders' in request ? parseHeaders(request.getAllResponseHeaders()) : null;
      var responseData = !config.responseType || config.responseType === 'text' ? request.responseText : request.response;
      var response = {
        data: responseData,
        status: request.status,
        statusText: request.statusText,
        headers: responseHeaders,
        config: config,
        request: request
      };

      settle(resolve, reject, response);

      // Clean up request
      request = null;
    };

    // Handle browser request cancellation (as opposed to a manual cancellation)
    request.onabort = function handleAbort() {
      if (!request) {
        return;
      }

      reject(createError('Request aborted', config, 'ECONNABORTED', request));

      // Clean up request
      request = null;
    };

    // Handle low level network errors
    request.onerror = function handleError() {
      // Real errors are hidden from us by the browser
      // onerror should only fire if it's a network error
      reject(createError('Network Error', config, null, request));

      // Clean up request
      request = null;
    };

    // Handle timeout
    request.ontimeout = function handleTimeout() {
      reject(createError('timeout of ' + config.timeout + 'ms exceeded', config, 'ECONNABORTED',
        request));

      // Clean up request
      request = null;
    };

    // Add xsrf header
    // This is only done if running in a standard browser environment.
    // Specifically not if we're in a web worker, or react-native.
    if (utils.isStandardBrowserEnv()) {
      var cookies = __webpack_require__("7aac");

      // Add xsrf header
      var xsrfValue = (config.withCredentials || isURLSameOrigin(config.url)) && config.xsrfCookieName ?
        cookies.read(config.xsrfCookieName) :
        undefined;

      if (xsrfValue) {
        requestHeaders[config.xsrfHeaderName] = xsrfValue;
      }
    }

    // Add headers to the request
    if ('setRequestHeader' in request) {
      utils.forEach(requestHeaders, function setRequestHeader(val, key) {
        if (typeof requestData === 'undefined' && key.toLowerCase() === 'content-type') {
          // Remove Content-Type if data is undefined
          delete requestHeaders[key];
        } else {
          // Otherwise add header to the request
          request.setRequestHeader(key, val);
        }
      });
    }

    // Add withCredentials to request if needed
    if (config.withCredentials) {
      request.withCredentials = true;
    }

    // Add responseType to request if needed
    if (config.responseType) {
      try {
        request.responseType = config.responseType;
      } catch (e) {
        // Expected DOMException thrown by browsers not compatible XMLHttpRequest Level 2.
        // But, this can be suppressed for 'json' type as it can be parsed by default 'transformResponse' function.
        if (config.responseType !== 'json') {
          throw e;
        }
      }
    }

    // Handle progress if needed
    if (typeof config.onDownloadProgress === 'function') {
      request.addEventListener('progress', config.onDownloadProgress);
    }

    // Not all browsers support upload events
    if (typeof config.onUploadProgress === 'function' && request.upload) {
      request.upload.addEventListener('progress', config.onUploadProgress);
    }

    if (config.cancelToken) {
      // Handle cancellation
      config.cancelToken.promise.then(function onCanceled(cancel) {
        if (!request) {
          return;
        }

        request.abort();
        reject(cancel);
        // Clean up request
        request = null;
      });
    }

    if (requestData === undefined) {
      requestData = null;
    }

    // Send the request
    request.send(requestData);
  });
};


/***/ }),

/***/ "b575":
/***/ (function(module, exports, __webpack_require__) {

var global = __webpack_require__("da84");
var getOwnPropertyDescriptor = __webpack_require__("06cf").f;
var classof = __webpack_require__("c6b6");
var macrotask = __webpack_require__("2cf4").set;
var userAgent = __webpack_require__("b39a");

var MutationObserver = global.MutationObserver || global.WebKitMutationObserver;
var process = global.process;
var Promise = global.Promise;
var IS_NODE = classof(process) == 'process';
// Node.js 11 shows ExperimentalWarning on getting `queueMicrotask`
var queueMicrotaskDescriptor = getOwnPropertyDescriptor(global, 'queueMicrotask');
var queueMicrotask = queueMicrotaskDescriptor && queueMicrotaskDescriptor.value;

var flush, head, last, notify, toggle, node, promise, then;

// modern engines have queueMicrotask method
if (!queueMicrotask) {
  flush = function () {
    var parent, fn;
    if (IS_NODE && (parent = process.domain)) parent.exit();
    while (head) {
      fn = head.fn;
      head = head.next;
      try {
        fn();
      } catch (error) {
        if (head) notify();
        else last = undefined;
        throw error;
      }
    } last = undefined;
    if (parent) parent.enter();
  };

  // Node.js
  if (IS_NODE) {
    notify = function () {
      process.nextTick(flush);
    };
  // browsers with MutationObserver, except iOS - https://github.com/zloirock/core-js/issues/339
  } else if (MutationObserver && !/(iphone|ipod|ipad).*applewebkit/i.test(userAgent)) {
    toggle = true;
    node = document.createTextNode('');
    new MutationObserver(flush).observe(node, { characterData: true });
    notify = function () {
      node.data = toggle = !toggle;
    };
  // environments with maybe non-completely correct, but existent Promise
  } else if (Promise && Promise.resolve) {
    // Promise.resolve without an argument throws an error in LG WebOS 2
    promise = Promise.resolve(undefined);
    then = promise.then;
    notify = function () {
      then.call(promise, flush);
    };
  // for other environments - macrotask based on:
  // - setImmediate
  // - MessageChannel
  // - window.postMessag
  // - onreadystatechange
  // - setTimeout
  } else {
    notify = function () {
      // strange IE + webpack dev server bug - use .call(global)
      macrotask.call(global, flush);
    };
  }
}

module.exports = queueMicrotask || function (fn) {
  var task = { fn: fn, next: undefined };
  if (last) last.next = task;
  if (!head) {
    head = task;
    notify();
  } last = task;
};


/***/ }),

/***/ "b622":
/***/ (function(module, exports, __webpack_require__) {

var global = __webpack_require__("da84");
var shared = __webpack_require__("5692");
var uid = __webpack_require__("90e3");
var NATIVE_SYMBOL = __webpack_require__("4930");

var Symbol = global.Symbol;
var store = shared('wks');

module.exports = function (name) {
  return store[name] || (store[name] = NATIVE_SYMBOL && Symbol[name]
    || (NATIVE_SYMBOL ? Symbol : uid)('Symbol.' + name));
};


/***/ }),

/***/ "b64b":
/***/ (function(module, exports, __webpack_require__) {

var $ = __webpack_require__("23e7");
var toObject = __webpack_require__("7b0b");
var nativeKeys = __webpack_require__("df75");
var fails = __webpack_require__("d039");

var FAILS_ON_PRIMITIVES = fails(function () { nativeKeys(1); });

// `Object.keys` method
// https://tc39.github.io/ecma262/#sec-object.keys
$({ target: 'Object', stat: true, forced: FAILS_ON_PRIMITIVES }, {
  keys: function keys(it) {
    return nativeKeys(toObject(it));
  }
});


/***/ }),

/***/ "b727":
/***/ (function(module, exports, __webpack_require__) {

var bind = __webpack_require__("f8c2");
var IndexedObject = __webpack_require__("44ad");
var toObject = __webpack_require__("7b0b");
var toLength = __webpack_require__("50c4");
var arraySpeciesCreate = __webpack_require__("65f0");

var push = [].push;

// `Array.prototype.{ forEach, map, filter, some, every, find, findIndex }` methods implementation
var createMethod = function (TYPE) {
  var IS_MAP = TYPE == 1;
  var IS_FILTER = TYPE == 2;
  var IS_SOME = TYPE == 3;
  var IS_EVERY = TYPE == 4;
  var IS_FIND_INDEX = TYPE == 6;
  var NO_HOLES = TYPE == 5 || IS_FIND_INDEX;
  return function ($this, callbackfn, that, specificCreate) {
    var O = toObject($this);
    var self = IndexedObject(O);
    var boundFunction = bind(callbackfn, that, 3);
    var length = toLength(self.length);
    var index = 0;
    var create = specificCreate || arraySpeciesCreate;
    var target = IS_MAP ? create($this, length) : IS_FILTER ? create($this, 0) : undefined;
    var value, result;
    for (;length > index; index++) if (NO_HOLES || index in self) {
      value = self[index];
      result = boundFunction(value, index, O);
      if (TYPE) {
        if (IS_MAP) target[index] = result; // map
        else if (result) switch (TYPE) {
          case 3: return true;              // some
          case 5: return value;             // find
          case 6: return index;             // findIndex
          case 2: push.call(target, value); // filter
        } else if (IS_EVERY) return false;  // every
      }
    }
    return IS_FIND_INDEX ? -1 : IS_SOME || IS_EVERY ? IS_EVERY : target;
  };
};

module.exports = {
  // `Array.prototype.forEach` method
  // https://tc39.github.io/ecma262/#sec-array.prototype.foreach
  forEach: createMethod(0),
  // `Array.prototype.map` method
  // https://tc39.github.io/ecma262/#sec-array.prototype.map
  map: createMethod(1),
  // `Array.prototype.filter` method
  // https://tc39.github.io/ecma262/#sec-array.prototype.filter
  filter: createMethod(2),
  // `Array.prototype.some` method
  // https://tc39.github.io/ecma262/#sec-array.prototype.some
  some: createMethod(3),
  // `Array.prototype.every` method
  // https://tc39.github.io/ecma262/#sec-array.prototype.every
  every: createMethod(4),
  // `Array.prototype.find` method
  // https://tc39.github.io/ecma262/#sec-array.prototype.find
  find: createMethod(5),
  // `Array.prototype.findIndex` method
  // https://tc39.github.io/ecma262/#sec-array.prototype.findIndex
  findIndex: createMethod(6)
};


/***/ }),

/***/ "bb2f":
/***/ (function(module, exports, __webpack_require__) {

var fails = __webpack_require__("d039");

module.exports = !fails(function () {
  return Object.isExtensible(Object.preventExtensions({}));
});


/***/ }),

/***/ "bc3a":
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__("cee4");

/***/ }),

/***/ "c032":
/***/ (function(module, exports, __webpack_require__) {

exports.f = __webpack_require__("b622");


/***/ }),

/***/ "c04e":
/***/ (function(module, exports, __webpack_require__) {

var isObject = __webpack_require__("861d");

// `ToPrimitive` abstract operation
// https://tc39.github.io/ecma262/#sec-toprimitive
// instead of the ES6 spec version, we didn't implement @@toPrimitive case
// and the second argument - flag - preferred type is a string
module.exports = function (input, PREFERRED_STRING) {
  if (!isObject(input)) return input;
  var fn, val;
  if (PREFERRED_STRING && typeof (fn = input.toString) == 'function' && !isObject(val = fn.call(input))) return val;
  if (typeof (fn = input.valueOf) == 'function' && !isObject(val = fn.call(input))) return val;
  if (!PREFERRED_STRING && typeof (fn = input.toString) == 'function' && !isObject(val = fn.call(input))) return val;
  throw TypeError("Can't convert object to primitive value");
};


/***/ }),

/***/ "c345":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var utils = __webpack_require__("c532");

// Headers whose duplicates are ignored by node
// c.f. https://nodejs.org/api/http.html#http_message_headers
var ignoreDuplicateOf = [
  'age', 'authorization', 'content-length', 'content-type', 'etag',
  'expires', 'from', 'host', 'if-modified-since', 'if-unmodified-since',
  'last-modified', 'location', 'max-forwards', 'proxy-authorization',
  'referer', 'retry-after', 'user-agent'
];

/**
 * Parse headers into an object
 *
 * ```
 * Date: Wed, 27 Aug 2014 08:58:49 GMT
 * Content-Type: application/json
 * Connection: keep-alive
 * Transfer-Encoding: chunked
 * ```
 *
 * @param {String} headers Headers needing to be parsed
 * @returns {Object} Headers parsed into an object
 */
module.exports = function parseHeaders(headers) {
  var parsed = {};
  var key;
  var val;
  var i;

  if (!headers) { return parsed; }

  utils.forEach(headers.split('\n'), function parser(line) {
    i = line.indexOf(':');
    key = utils.trim(line.substr(0, i)).toLowerCase();
    val = utils.trim(line.substr(i + 1));

    if (key) {
      if (parsed[key] && ignoreDuplicateOf.indexOf(key) >= 0) {
        return;
      }
      if (key === 'set-cookie') {
        parsed[key] = (parsed[key] ? parsed[key] : []).concat([val]);
      } else {
        parsed[key] = parsed[key] ? parsed[key] + ', ' + val : val;
      }
    }
  });

  return parsed;
};


/***/ }),

/***/ "c401":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var utils = __webpack_require__("c532");

/**
 * Transform the data for a request or a response
 *
 * @param {Object|String} data The data to be transformed
 * @param {Array} headers The headers for the request or response
 * @param {Array|Function} fns A single function or Array of functions
 * @returns {*} The resulting transformed data
 */
module.exports = function transformData(data, headers, fns) {
  /*eslint no-param-reassign:0*/
  utils.forEach(fns, function transform(fn) {
    data = fn(data, headers);
  });

  return data;
};


/***/ }),

/***/ "c430":
/***/ (function(module, exports) {

module.exports = false;


/***/ }),

/***/ "c532":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var bind = __webpack_require__("1d2b");
var isBuffer = __webpack_require__("c7ce");

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

module.exports = {
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


/***/ }),

/***/ "c6b6":
/***/ (function(module, exports) {

var toString = {}.toString;

module.exports = function (it) {
  return toString.call(it).slice(8, -1);
};


/***/ }),

/***/ "c6cd":
/***/ (function(module, exports, __webpack_require__) {

var global = __webpack_require__("da84");
var setGlobal = __webpack_require__("ce4e");

var SHARED = '__core-js_shared__';
var store = global[SHARED] || setGlobal(SHARED, {});

module.exports = store;


/***/ }),

/***/ "c740":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var $ = __webpack_require__("23e7");
var $findIndex = __webpack_require__("b727").findIndex;
var addToUnscopables = __webpack_require__("44d2");

var FIND_INDEX = 'findIndex';
var SKIPS_HOLES = true;

// Shouldn't skip holes
if (FIND_INDEX in []) Array(1)[FIND_INDEX](function () { SKIPS_HOLES = false; });

// `Array.prototype.findIndex` method
// https://tc39.github.io/ecma262/#sec-array.prototype.findindex
$({ target: 'Array', proto: true, forced: SKIPS_HOLES }, {
  findIndex: function findIndex(callbackfn /* , that = undefined */) {
    return $findIndex(this, callbackfn, arguments.length > 1 ? arguments[1] : undefined);
  }
});

// https://tc39.github.io/ecma262/#sec-array.prototype-@@unscopables
addToUnscopables(FIND_INDEX);


/***/ }),

/***/ "c7ce":
/***/ (function(module, exports) {

/*!
 * Determine if an object is a Buffer
 *
 * @author   Feross Aboukhadijeh <https://feross.org>
 * @license  MIT
 */

module.exports = function isBuffer (obj) {
  return obj != null && obj.constructor != null &&
    typeof obj.constructor.isBuffer === 'function' && obj.constructor.isBuffer(obj)
}


/***/ }),

/***/ "c8af":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var utils = __webpack_require__("c532");

module.exports = function normalizeHeaderName(headers, normalizedName) {
  utils.forEach(headers, function processHeader(value, name) {
    if (name !== normalizedName && name.toUpperCase() === normalizedName.toUpperCase()) {
      headers[normalizedName] = value;
      delete headers[name];
    }
  });
};


/***/ }),

/***/ "c8ba":
/***/ (function(module, exports) {

var g;

// This works in non-strict mode
g = (function() {
	return this;
})();

try {
	// This works if eval is allowed (see CSP)
	g = g || new Function("return this")();
} catch (e) {
	// This works if the window reference is available
	if (typeof window === "object") g = window;
}

// g can still be undefined, but nothing to do about it...
// We return undefined, instead of nothing here, so it's
// easier to handle this case. if(!global) { ...}

module.exports = g;


/***/ }),

/***/ "c975":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var $ = __webpack_require__("23e7");
var $indexOf = __webpack_require__("4d64").indexOf;
var sloppyArrayMethod = __webpack_require__("b301");

var nativeIndexOf = [].indexOf;

var NEGATIVE_ZERO = !!nativeIndexOf && 1 / [1].indexOf(1, -0) < 0;
var SLOPPY_METHOD = sloppyArrayMethod('indexOf');

// `Array.prototype.indexOf` method
// https://tc39.github.io/ecma262/#sec-array.prototype.indexof
$({ target: 'Array', proto: true, forced: NEGATIVE_ZERO || SLOPPY_METHOD }, {
  indexOf: function indexOf(searchElement /* , fromIndex = 0 */) {
    return NEGATIVE_ZERO
      // convert -0 to +0
      ? nativeIndexOf.apply(this, arguments) || 0
      : $indexOf(this, searchElement, arguments.length > 1 ? arguments[1] : undefined);
  }
});


/***/ }),

/***/ "ca84":
/***/ (function(module, exports, __webpack_require__) {

var has = __webpack_require__("5135");
var toIndexedObject = __webpack_require__("fc6a");
var indexOf = __webpack_require__("4d64").indexOf;
var hiddenKeys = __webpack_require__("d012");

module.exports = function (object, names) {
  var O = toIndexedObject(object);
  var i = 0;
  var result = [];
  var key;
  for (key in O) !has(hiddenKeys, key) && has(O, key) && result.push(key);
  // Don't enum bug & hidden keys
  while (names.length > i) if (has(O, key = names[i++])) {
    ~indexOf(result, key) || result.push(key);
  }
  return result;
};


/***/ }),

/***/ "caad":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var $ = __webpack_require__("23e7");
var $includes = __webpack_require__("4d64").includes;
var addToUnscopables = __webpack_require__("44d2");

// `Array.prototype.includes` method
// https://tc39.github.io/ecma262/#sec-array.prototype.includes
$({ target: 'Array', proto: true }, {
  includes: function includes(el /* , fromIndex = 0 */) {
    return $includes(this, el, arguments.length > 1 ? arguments[1] : undefined);
  }
});

// https://tc39.github.io/ecma262/#sec-array.prototype-@@unscopables
addToUnscopables('includes');


/***/ }),

/***/ "cc12":
/***/ (function(module, exports, __webpack_require__) {

var global = __webpack_require__("da84");
var isObject = __webpack_require__("861d");

var document = global.document;
// typeof document.createElement is 'object' in old IE
var EXISTS = isObject(document) && isObject(document.createElement);

module.exports = function (it) {
  return EXISTS ? document.createElement(it) : {};
};


/***/ }),

/***/ "cca6":
/***/ (function(module, exports, __webpack_require__) {

var $ = __webpack_require__("23e7");
var assign = __webpack_require__("60da");

// `Object.assign` method
// https://tc39.github.io/ecma262/#sec-object.assign
$({ target: 'Object', stat: true, forced: Object.assign !== assign }, {
  assign: assign
});


/***/ }),

/***/ "cdf9":
/***/ (function(module, exports, __webpack_require__) {

var anObject = __webpack_require__("825a");
var isObject = __webpack_require__("861d");
var newPromiseCapability = __webpack_require__("f069");

module.exports = function (C, x) {
  anObject(C);
  if (isObject(x) && x.constructor === C) return x;
  var promiseCapability = newPromiseCapability.f(C);
  var resolve = promiseCapability.resolve;
  resolve(x);
  return promiseCapability.promise;
};


/***/ }),

/***/ "ce4e":
/***/ (function(module, exports, __webpack_require__) {

var global = __webpack_require__("da84");
var createNonEnumerableProperty = __webpack_require__("9112");

module.exports = function (key, value) {
  try {
    createNonEnumerableProperty(global, key, value);
  } catch (error) {
    global[key] = value;
  } return value;
};


/***/ }),

/***/ "cee4":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var utils = __webpack_require__("c532");
var bind = __webpack_require__("1d2b");
var Axios = __webpack_require__("0a06");
var mergeConfig = __webpack_require__("4a7b");
var defaults = __webpack_require__("2444");

/**
 * Create an instance of Axios
 *
 * @param {Object} defaultConfig The default config for the instance
 * @return {Axios} A new instance of Axios
 */
function createInstance(defaultConfig) {
  var context = new Axios(defaultConfig);
  var instance = bind(Axios.prototype.request, context);

  // Copy axios.prototype to instance
  utils.extend(instance, Axios.prototype, context);

  // Copy context to instance
  utils.extend(instance, context);

  return instance;
}

// Create the default instance to be exported
var axios = createInstance(defaults);

// Expose Axios class to allow class inheritance
axios.Axios = Axios;

// Factory for creating new instances
axios.create = function create(instanceConfig) {
  return createInstance(mergeConfig(axios.defaults, instanceConfig));
};

// Expose Cancel & CancelToken
axios.Cancel = __webpack_require__("7a77");
axios.CancelToken = __webpack_require__("8df4");
axios.isCancel = __webpack_require__("2e67");

// Expose all/spread
axios.all = function all(promises) {
  return Promise.all(promises);
};
axios.spread = __webpack_require__("0df6");

module.exports = axios;

// Allow use of default import syntax in TypeScript
module.exports.default = axios;


/***/ }),

/***/ "d012":
/***/ (function(module, exports) {

module.exports = {};


/***/ }),

/***/ "d039":
/***/ (function(module, exports) {

module.exports = function (exec) {
  try {
    return !!exec();
  } catch (error) {
    return true;
  }
};


/***/ }),

/***/ "d066":
/***/ (function(module, exports, __webpack_require__) {

var path = __webpack_require__("428f");
var global = __webpack_require__("da84");

var aFunction = function (variable) {
  return typeof variable == 'function' ? variable : undefined;
};

module.exports = function (namespace, method) {
  return arguments.length < 2 ? aFunction(path[namespace]) || aFunction(global[namespace])
    : path[namespace] && path[namespace][method] || global[namespace] && global[namespace][method];
};


/***/ }),

/***/ "d1e7":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var nativePropertyIsEnumerable = {}.propertyIsEnumerable;
var getOwnPropertyDescriptor = Object.getOwnPropertyDescriptor;

// Nashorn ~ JDK8 bug
var NASHORN_BUG = getOwnPropertyDescriptor && !nativePropertyIsEnumerable.call({ 1: 2 }, 1);

// `Object.prototype.propertyIsEnumerable` method implementation
// https://tc39.github.io/ecma262/#sec-object.prototype.propertyisenumerable
exports.f = NASHORN_BUG ? function propertyIsEnumerable(V) {
  var descriptor = getOwnPropertyDescriptor(this, V);
  return !!descriptor && descriptor.enumerable;
} : nativePropertyIsEnumerable;


/***/ }),

/***/ "d28b":
/***/ (function(module, exports, __webpack_require__) {

var defineWellKnownSymbol = __webpack_require__("746f");

// `Symbol.iterator` well-known symbol
// https://tc39.github.io/ecma262/#sec-symbol.iterator
defineWellKnownSymbol('iterator');


/***/ }),

/***/ "d2bb":
/***/ (function(module, exports, __webpack_require__) {

var anObject = __webpack_require__("825a");
var aPossiblePrototype = __webpack_require__("3bbe");

// `Object.setPrototypeOf` method
// https://tc39.github.io/ecma262/#sec-object.setprototypeof
// Works with __proto__ only. Old v8 can't work with null proto objects.
/* eslint-disable no-proto */
module.exports = Object.setPrototypeOf || ('__proto__' in {} ? function () {
  var CORRECT_SETTER = false;
  var test = {};
  var setter;
  try {
    setter = Object.getOwnPropertyDescriptor(Object.prototype, '__proto__').set;
    setter.call(test, []);
    CORRECT_SETTER = test instanceof Array;
  } catch (error) { /* empty */ }
  return function setPrototypeOf(O, proto) {
    anObject(O);
    aPossiblePrototype(proto);
    if (CORRECT_SETTER) setter.call(O, proto);
    else O.__proto__ = proto;
    return O;
  };
}() : undefined);


/***/ }),

/***/ "d3b7":
/***/ (function(module, exports, __webpack_require__) {

var redefine = __webpack_require__("6eeb");
var toString = __webpack_require__("b041");

var ObjectPrototype = Object.prototype;

// `Object.prototype.toString` method
// https://tc39.github.io/ecma262/#sec-object.prototype.tostring
if (toString !== ObjectPrototype.toString) {
  redefine(ObjectPrototype, 'toString', toString, { unsafe: true });
}


/***/ }),

/***/ "d44e":
/***/ (function(module, exports, __webpack_require__) {

var defineProperty = __webpack_require__("9bf2").f;
var has = __webpack_require__("5135");
var wellKnownSymbol = __webpack_require__("b622");

var TO_STRING_TAG = wellKnownSymbol('toStringTag');

module.exports = function (it, TAG, STATIC) {
  if (it && !has(it = STATIC ? it : it.prototype, TO_STRING_TAG)) {
    defineProperty(it, TO_STRING_TAG, { configurable: true, value: TAG });
  }
};


/***/ }),

/***/ "d4ec":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return _classCallCheck; });
function _classCallCheck(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
}

/***/ }),

/***/ "d784":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var createNonEnumerableProperty = __webpack_require__("9112");
var redefine = __webpack_require__("6eeb");
var fails = __webpack_require__("d039");
var wellKnownSymbol = __webpack_require__("b622");
var regexpExec = __webpack_require__("9263");

var SPECIES = wellKnownSymbol('species');

var REPLACE_SUPPORTS_NAMED_GROUPS = !fails(function () {
  // #replace needs built-in support for named groups.
  // #match works fine because it just return the exec results, even if it has
  // a "grops" property.
  var re = /./;
  re.exec = function () {
    var result = [];
    result.groups = { a: '7' };
    return result;
  };
  return ''.replace(re, '$<a>') !== '7';
});

// Chrome 51 has a buggy "split" implementation when RegExp#exec !== nativeExec
// Weex JS has frozen built-in prototypes, so use try / catch wrapper
var SPLIT_WORKS_WITH_OVERWRITTEN_EXEC = !fails(function () {
  var re = /(?:)/;
  var originalExec = re.exec;
  re.exec = function () { return originalExec.apply(this, arguments); };
  var result = 'ab'.split(re);
  return result.length !== 2 || result[0] !== 'a' || result[1] !== 'b';
});

module.exports = function (KEY, length, exec, sham) {
  var SYMBOL = wellKnownSymbol(KEY);

  var DELEGATES_TO_SYMBOL = !fails(function () {
    // String methods call symbol-named RegEp methods
    var O = {};
    O[SYMBOL] = function () { return 7; };
    return ''[KEY](O) != 7;
  });

  var DELEGATES_TO_EXEC = DELEGATES_TO_SYMBOL && !fails(function () {
    // Symbol-named RegExp methods call .exec
    var execCalled = false;
    var re = /a/;

    if (KEY === 'split') {
      // We can't use real regex here since it causes deoptimization
      // and serious performance degradation in V8
      // https://github.com/zloirock/core-js/issues/306
      re = {};
      // RegExp[@@split] doesn't call the regex's exec method, but first creates
      // a new one. We need to return the patched regex when creating the new one.
      re.constructor = {};
      re.constructor[SPECIES] = function () { return re; };
      re.flags = '';
      re[SYMBOL] = /./[SYMBOL];
    }

    re.exec = function () { execCalled = true; return null; };

    re[SYMBOL]('');
    return !execCalled;
  });

  if (
    !DELEGATES_TO_SYMBOL ||
    !DELEGATES_TO_EXEC ||
    (KEY === 'replace' && !REPLACE_SUPPORTS_NAMED_GROUPS) ||
    (KEY === 'split' && !SPLIT_WORKS_WITH_OVERWRITTEN_EXEC)
  ) {
    var nativeRegExpMethod = /./[SYMBOL];
    var methods = exec(SYMBOL, ''[KEY], function (nativeMethod, regexp, str, arg2, forceStringMethod) {
      if (regexp.exec === regexpExec) {
        if (DELEGATES_TO_SYMBOL && !forceStringMethod) {
          // The native String method already delegates to @@method (this
          // polyfilled function), leasing to infinite recursion.
          // We avoid it by directly calling the native @@method method.
          return { done: true, value: nativeRegExpMethod.call(regexp, str, arg2) };
        }
        return { done: true, value: nativeMethod.call(str, regexp, arg2) };
      }
      return { done: false };
    });
    var stringMethod = methods[0];
    var regexMethod = methods[1];

    redefine(String.prototype, KEY, stringMethod);
    redefine(RegExp.prototype, SYMBOL, length == 2
      // 21.2.5.8 RegExp.prototype[@@replace](string, replaceValue)
      // 21.2.5.11 RegExp.prototype[@@split](string, limit)
      ? function (string, arg) { return regexMethod.call(string, this, arg); }
      // 21.2.5.6 RegExp.prototype[@@match](string)
      // 21.2.5.9 RegExp.prototype[@@search](string)
      : function (string) { return regexMethod.call(string, this); }
    );
    if (sham) createNonEnumerableProperty(RegExp.prototype[SYMBOL], 'sham', true);
  }
};


/***/ }),

/***/ "d81d":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var $ = __webpack_require__("23e7");
var $map = __webpack_require__("b727").map;
var arrayMethodHasSpeciesSupport = __webpack_require__("1dde");

// `Array.prototype.map` method
// https://tc39.github.io/ecma262/#sec-array.prototype.map
// with adding support of @@species
$({ target: 'Array', proto: true, forced: !arrayMethodHasSpeciesSupport('map') }, {
  map: function map(callbackfn /* , thisArg */) {
    return $map(this, callbackfn, arguments.length > 1 ? arguments[1] : undefined);
  }
});


/***/ }),

/***/ "d925":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


/**
 * Determines whether the specified URL is absolute
 *
 * @param {string} url The URL to test
 * @returns {boolean} True if the specified URL is absolute, otherwise false
 */
module.exports = function isAbsoluteURL(url) {
  // A URL is considered absolute if it begins with "<scheme>://" or "//" (protocol-relative URL).
  // RFC 3986 defines scheme name as a sequence of characters beginning with a letter and followed
  // by any combination of letters, digits, plus, period, or hyphen.
  return /^([a-z][a-z\d\+\-\.]*:)?\/\//i.test(url);
};


/***/ }),

/***/ "da84":
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(global) {var check = function (it) {
  return it && it.Math == Math && it;
};

// https://github.com/zloirock/core-js/issues/86#issuecomment-115759028
module.exports =
  // eslint-disable-next-line no-undef
  check(typeof globalThis == 'object' && globalThis) ||
  check(typeof window == 'object' && window) ||
  check(typeof self == 'object' && self) ||
  check(typeof global == 'object' && global) ||
  // eslint-disable-next-line no-new-func
  Function('return this')();

/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__("c8ba")))

/***/ }),

/***/ "dbb4":
/***/ (function(module, exports, __webpack_require__) {

var $ = __webpack_require__("23e7");
var DESCRIPTORS = __webpack_require__("83ab");
var ownKeys = __webpack_require__("56ef");
var toIndexedObject = __webpack_require__("fc6a");
var getOwnPropertyDescriptorModule = __webpack_require__("06cf");
var createProperty = __webpack_require__("8418");

// `Object.getOwnPropertyDescriptors` method
// https://tc39.github.io/ecma262/#sec-object.getownpropertydescriptors
$({ target: 'Object', stat: true, sham: !DESCRIPTORS }, {
  getOwnPropertyDescriptors: function getOwnPropertyDescriptors(object) {
    var O = toIndexedObject(object);
    var getOwnPropertyDescriptor = getOwnPropertyDescriptorModule.f;
    var keys = ownKeys(O);
    var result = {};
    var index = 0;
    var key, descriptor;
    while (keys.length > index) {
      descriptor = getOwnPropertyDescriptor(O, key = keys[index++]);
      if (descriptor !== undefined) createProperty(result, key, descriptor);
    }
    return result;
  }
});


/***/ }),

/***/ "dc99":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";

// EXTERNAL MODULE: ./node_modules/core-js/modules/es.array.find.js
var es_array_find = __webpack_require__("7db0");

// EXTERNAL MODULE: ./node_modules/core-js/modules/es.function.name.js
var es_function_name = __webpack_require__("b0c0");

// EXTERNAL MODULE: ./node_modules/@babel/runtime/helpers/esm/typeof.js
var esm_typeof = __webpack_require__("53ca");

// EXTERNAL MODULE: ./node_modules/core-js/modules/es.array.concat.js
var es_array_concat = __webpack_require__("99af");

// EXTERNAL MODULE: ./node_modules/core-js/modules/es.regexp.exec.js
var es_regexp_exec = __webpack_require__("ac1f");

// EXTERNAL MODULE: ./node_modules/core-js/modules/es.string.match.js
var es_string_match = __webpack_require__("466d");

// EXTERNAL MODULE: ./node_modules/core-js/modules/es.string.search.js
var es_string_search = __webpack_require__("841c");

// CONCATENATED MODULE: ./packages/meetnow/src/browser/browser-list.ts




var commonVersionIdentifier = /version\/(\d+(\.?_?\d+)+)/i;
function getFirstMatch(regexp, ua) {
  var match = ua.match(regexp);
  return match && match.length > 0 && match[1] || '';
}
function getSecondMatch(regexp, ua) {
  var match = ua.match(regexp);
  return match && match.length > 1 && match[2] || '';
}
function browser(name, version) {
  return {
    name: name,
    version: version,
    firefox: name === 'firefox',
    chrome: name === 'chrome' || name === 'chromium',
    wechet: name === 'wechat',
    toString: function toString() {
      return "".concat(name.toUpperCase(), " ").concat(version);
    }
  };
}
var browsersList = [{
  test: [/micromessenger/i],
  describe: function describe(ua) {
    return browser('wechat', getFirstMatch(/(?:micromessenger)[\s/](\d+(\.?_?\d+)+)/i, ua) || getFirstMatch(commonVersionIdentifier, ua));
  }
}, {
  test: [/\sedg\//i],
  describe: function describe(ua) {
    return browser('edge', getFirstMatch(/\sedg\/(\d+(\.?_?\d+)+)/i, ua));
  }
}, {
  test: [/edg([ea]|ios)/i],
  describe: function describe(ua) {
    return browser('edge', getSecondMatch(/edg([ea]|ios)\/(\d+(\.?_?\d+)+)/i, ua));
  }
}, {
  test: [/firefox|iceweasel|fxios/i],
  describe: function describe(ua) {
    return browser('firefox', getFirstMatch(/(?:firefox|iceweasel|fxios)[\s/](\d+(\.?_?\d+)+)/i, ua));
  }
}, {
  test: [/chromium/i],
  describe: function describe(ua) {
    return browser('chromium', getFirstMatch(/(?:chromium)[\s/](\d+(\.?_?\d+)+)/i, ua) || getFirstMatch(commonVersionIdentifier, ua));
  }
}, {
  test: [/chrome|crios|crmo/i],
  describe: function describe(ua) {
    return browser('chrome', getFirstMatch(/(?:chrome|crios|crmo)\/(\d+(\.?_?\d+)+)/i, ua));
  }
}, {
  test: [/safari|applewebkit/i],
  describe: function describe(ua) {
    return browser('safari', getFirstMatch(commonVersionIdentifier, ua));
  }
},
/* Something else */
{
  test: [/.*/i],
  describe: function describe(ua) {
    /* Here we try to make sure that there are explicit details about the device
     * in order to decide what regexp exactly we want to apply
     * (as there is a specific decision based on that conclusion)
     */
    var regexpWithoutDeviceSpec = /^(.*)\/(.*) /;
    var regexpWithDeviceSpec = /^(.*)\/(.*)[ \t]\((.*)/;
    var hasDeviceSpec = ua.search('\\(') !== -1;
    var regexp = hasDeviceSpec ? regexpWithDeviceSpec : regexpWithoutDeviceSpec;
    return browser(getFirstMatch(regexp, ua), getSecondMatch(regexp, ua));
  }
}];
// CONCATENATED MODULE: ./packages/meetnow/src/browser/index.ts
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "b", function() { return isMiniProgram; });
/* unused harmony export parseBrowser */
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return getBrowser; });
/* unused harmony export BROWSER */
/* unused harmony export isBrowser */
/* unused harmony export MINIPROGRAM */




var parsed = {};
function isMiniProgram() {
  return (typeof wx === "undefined" ? "undefined" : Object(esm_typeof["a" /* default */])(wx)) === 'object' || (typeof swan === "undefined" ? "undefined" : Object(esm_typeof["a" /* default */])(swan)) === 'object' || (typeof my === "undefined" ? "undefined" : Object(esm_typeof["a" /* default */])(my)) === 'object' || /miniprogram/i.test(navigator.userAgent) || window && window.__wxjs_environment === 'miniprogram';
}
function parseBrowser(ua) {
  if (!parsed.browser) {
    ua = ua || (isMiniProgram() ? 'miniprogram' : navigator.userAgent);
    var descriptor = browsersList.find(function (browser) {
      return browser.test.some(function (condition) {
        return condition.test(ua);
      });
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
var BROWSER = parseBrowser();
function isBrowser(name) {
  return parseBrowser().name === name;
}
var MINIPROGRAM = isMiniProgram();

/***/ }),

/***/ "ddb0":
/***/ (function(module, exports, __webpack_require__) {

var global = __webpack_require__("da84");
var DOMIterables = __webpack_require__("fdbc");
var ArrayIteratorMethods = __webpack_require__("e260");
var createNonEnumerableProperty = __webpack_require__("9112");
var wellKnownSymbol = __webpack_require__("b622");

var ITERATOR = wellKnownSymbol('iterator');
var TO_STRING_TAG = wellKnownSymbol('toStringTag');
var ArrayValues = ArrayIteratorMethods.values;

for (var COLLECTION_NAME in DOMIterables) {
  var Collection = global[COLLECTION_NAME];
  var CollectionPrototype = Collection && Collection.prototype;
  if (CollectionPrototype) {
    // some Chrome versions have non-configurable methods on DOMTokenList
    if (CollectionPrototype[ITERATOR] !== ArrayValues) try {
      createNonEnumerableProperty(CollectionPrototype, ITERATOR, ArrayValues);
    } catch (error) {
      CollectionPrototype[ITERATOR] = ArrayValues;
    }
    if (!CollectionPrototype[TO_STRING_TAG]) {
      createNonEnumerableProperty(CollectionPrototype, TO_STRING_TAG, COLLECTION_NAME);
    }
    if (DOMIterables[COLLECTION_NAME]) for (var METHOD_NAME in ArrayIteratorMethods) {
      // some Chrome versions have non-configurable methods on DOMTokenList
      if (CollectionPrototype[METHOD_NAME] !== ArrayIteratorMethods[METHOD_NAME]) try {
        createNonEnumerableProperty(CollectionPrototype, METHOD_NAME, ArrayIteratorMethods[METHOD_NAME]);
      } catch (error) {
        CollectionPrototype[METHOD_NAME] = ArrayIteratorMethods[METHOD_NAME];
      }
    }
  }
}


/***/ }),

/***/ "df75":
/***/ (function(module, exports, __webpack_require__) {

var internalObjectKeys = __webpack_require__("ca84");
var enumBugKeys = __webpack_require__("7839");

// `Object.keys` method
// https://tc39.github.io/ecma262/#sec-object.keys
module.exports = Object.keys || function keys(O) {
  return internalObjectKeys(O, enumBugKeys);
};


/***/ }),

/***/ "df7c":
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(process) {// .dirname, .basename, and .extname methods are extracted from Node.js v8.11.1,
// backported and transplited with Babel, with backwards-compat fixes

// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.

// resolves . and .. elements in a path array with directory names there
// must be no slashes, empty elements, or device names (c:\) in the array
// (so also no leading and trailing slashes - it does not distinguish
// relative and absolute paths)
function normalizeArray(parts, allowAboveRoot) {
  // if the path tries to go above the root, `up` ends up > 0
  var up = 0;
  for (var i = parts.length - 1; i >= 0; i--) {
    var last = parts[i];
    if (last === '.') {
      parts.splice(i, 1);
    } else if (last === '..') {
      parts.splice(i, 1);
      up++;
    } else if (up) {
      parts.splice(i, 1);
      up--;
    }
  }

  // if the path is allowed to go above the root, restore leading ..s
  if (allowAboveRoot) {
    for (; up--; up) {
      parts.unshift('..');
    }
  }

  return parts;
}

// path.resolve([from ...], to)
// posix version
exports.resolve = function() {
  var resolvedPath = '',
      resolvedAbsolute = false;

  for (var i = arguments.length - 1; i >= -1 && !resolvedAbsolute; i--) {
    var path = (i >= 0) ? arguments[i] : process.cwd();

    // Skip empty and invalid entries
    if (typeof path !== 'string') {
      throw new TypeError('Arguments to path.resolve must be strings');
    } else if (!path) {
      continue;
    }

    resolvedPath = path + '/' + resolvedPath;
    resolvedAbsolute = path.charAt(0) === '/';
  }

  // At this point the path should be resolved to a full absolute path, but
  // handle relative paths to be safe (might happen when process.cwd() fails)

  // Normalize the path
  resolvedPath = normalizeArray(filter(resolvedPath.split('/'), function(p) {
    return !!p;
  }), !resolvedAbsolute).join('/');

  return ((resolvedAbsolute ? '/' : '') + resolvedPath) || '.';
};

// path.normalize(path)
// posix version
exports.normalize = function(path) {
  var isAbsolute = exports.isAbsolute(path),
      trailingSlash = substr(path, -1) === '/';

  // Normalize the path
  path = normalizeArray(filter(path.split('/'), function(p) {
    return !!p;
  }), !isAbsolute).join('/');

  if (!path && !isAbsolute) {
    path = '.';
  }
  if (path && trailingSlash) {
    path += '/';
  }

  return (isAbsolute ? '/' : '') + path;
};

// posix version
exports.isAbsolute = function(path) {
  return path.charAt(0) === '/';
};

// posix version
exports.join = function() {
  var paths = Array.prototype.slice.call(arguments, 0);
  return exports.normalize(filter(paths, function(p, index) {
    if (typeof p !== 'string') {
      throw new TypeError('Arguments to path.join must be strings');
    }
    return p;
  }).join('/'));
};


// path.relative(from, to)
// posix version
exports.relative = function(from, to) {
  from = exports.resolve(from).substr(1);
  to = exports.resolve(to).substr(1);

  function trim(arr) {
    var start = 0;
    for (; start < arr.length; start++) {
      if (arr[start] !== '') break;
    }

    var end = arr.length - 1;
    for (; end >= 0; end--) {
      if (arr[end] !== '') break;
    }

    if (start > end) return [];
    return arr.slice(start, end - start + 1);
  }

  var fromParts = trim(from.split('/'));
  var toParts = trim(to.split('/'));

  var length = Math.min(fromParts.length, toParts.length);
  var samePartsLength = length;
  for (var i = 0; i < length; i++) {
    if (fromParts[i] !== toParts[i]) {
      samePartsLength = i;
      break;
    }
  }

  var outputParts = [];
  for (var i = samePartsLength; i < fromParts.length; i++) {
    outputParts.push('..');
  }

  outputParts = outputParts.concat(toParts.slice(samePartsLength));

  return outputParts.join('/');
};

exports.sep = '/';
exports.delimiter = ':';

exports.dirname = function (path) {
  if (typeof path !== 'string') path = path + '';
  if (path.length === 0) return '.';
  var code = path.charCodeAt(0);
  var hasRoot = code === 47 /*/*/;
  var end = -1;
  var matchedSlash = true;
  for (var i = path.length - 1; i >= 1; --i) {
    code = path.charCodeAt(i);
    if (code === 47 /*/*/) {
        if (!matchedSlash) {
          end = i;
          break;
        }
      } else {
      // We saw the first non-path separator
      matchedSlash = false;
    }
  }

  if (end === -1) return hasRoot ? '/' : '.';
  if (hasRoot && end === 1) {
    // return '//';
    // Backwards-compat fix:
    return '/';
  }
  return path.slice(0, end);
};

function basename(path) {
  if (typeof path !== 'string') path = path + '';

  var start = 0;
  var end = -1;
  var matchedSlash = true;
  var i;

  for (i = path.length - 1; i >= 0; --i) {
    if (path.charCodeAt(i) === 47 /*/*/) {
        // If we reached a path separator that was not part of a set of path
        // separators at the end of the string, stop now
        if (!matchedSlash) {
          start = i + 1;
          break;
        }
      } else if (end === -1) {
      // We saw the first non-path separator, mark this as the end of our
      // path component
      matchedSlash = false;
      end = i + 1;
    }
  }

  if (end === -1) return '';
  return path.slice(start, end);
}

// Uses a mixed approach for backwards-compatibility, as ext behavior changed
// in new Node.js versions, so only basename() above is backported here
exports.basename = function (path, ext) {
  var f = basename(path);
  if (ext && f.substr(-1 * ext.length) === ext) {
    f = f.substr(0, f.length - ext.length);
  }
  return f;
};

exports.extname = function (path) {
  if (typeof path !== 'string') path = path + '';
  var startDot = -1;
  var startPart = 0;
  var end = -1;
  var matchedSlash = true;
  // Track the state of characters (if any) we see before our first dot and
  // after any path separator we find
  var preDotState = 0;
  for (var i = path.length - 1; i >= 0; --i) {
    var code = path.charCodeAt(i);
    if (code === 47 /*/*/) {
        // If we reached a path separator that was not part of a set of path
        // separators at the end of the string, stop now
        if (!matchedSlash) {
          startPart = i + 1;
          break;
        }
        continue;
      }
    if (end === -1) {
      // We saw the first non-path separator, mark this as the end of our
      // extension
      matchedSlash = false;
      end = i + 1;
    }
    if (code === 46 /*.*/) {
        // If this is our first dot, mark it as the start of our extension
        if (startDot === -1)
          startDot = i;
        else if (preDotState !== 1)
          preDotState = 1;
    } else if (startDot !== -1) {
      // We saw a non-dot and non-path separator before our dot, so we should
      // have a good chance at having a non-empty extension
      preDotState = -1;
    }
  }

  if (startDot === -1 || end === -1 ||
      // We saw a non-dot character immediately before the dot
      preDotState === 0 ||
      // The (right-most) trimmed path component is exactly '..'
      preDotState === 1 && startDot === end - 1 && startDot === startPart + 1) {
    return '';
  }
  return path.slice(startDot, end);
};

function filter (xs, f) {
    if (xs.filter) return xs.filter(f);
    var res = [];
    for (var i = 0; i < xs.length; i++) {
        if (f(xs[i], i, xs)) res.push(xs[i]);
    }
    return res;
}

// String.prototype.substr - negative index don't work in IE8
var substr = 'ab'.substr(-1) === 'b'
    ? function (str, start, len) { return str.substr(start, len) }
    : function (str, start, len) {
        if (start < 0) start = str.length + start;
        return str.substr(start, len);
    }
;

/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__("4362")))

/***/ }),

/***/ "e01a":
/***/ (function(module, exports, __webpack_require__) {

"use strict";
// `Symbol.prototype.description` getter
// https://tc39.github.io/ecma262/#sec-symbol.prototype.description

var $ = __webpack_require__("23e7");
var DESCRIPTORS = __webpack_require__("83ab");
var global = __webpack_require__("da84");
var has = __webpack_require__("5135");
var isObject = __webpack_require__("861d");
var defineProperty = __webpack_require__("9bf2").f;
var copyConstructorProperties = __webpack_require__("e893");

var NativeSymbol = global.Symbol;

if (DESCRIPTORS && typeof NativeSymbol == 'function' && (!('description' in NativeSymbol.prototype) ||
  // Safari 12 bug
  NativeSymbol().description !== undefined
)) {
  var EmptyStringDescriptionStore = {};
  // wrap Symbol constructor for correct work with undefined description
  var SymbolWrapper = function Symbol() {
    var description = arguments.length < 1 || arguments[0] === undefined ? undefined : String(arguments[0]);
    var result = this instanceof SymbolWrapper
      ? new NativeSymbol(description)
      // in Edge 13, String(Symbol(undefined)) === 'Symbol(undefined)'
      : description === undefined ? NativeSymbol() : NativeSymbol(description);
    if (description === '') EmptyStringDescriptionStore[result] = true;
    return result;
  };
  copyConstructorProperties(SymbolWrapper, NativeSymbol);
  var symbolPrototype = SymbolWrapper.prototype = NativeSymbol.prototype;
  symbolPrototype.constructor = SymbolWrapper;

  var symbolToString = symbolPrototype.toString;
  var native = String(NativeSymbol('test')) == 'Symbol(test)';
  var regexp = /^Symbol\((.*)\)[^)]+$/;
  defineProperty(symbolPrototype, 'description', {
    configurable: true,
    get: function description() {
      var symbol = isObject(this) ? this.valueOf() : this;
      var string = symbolToString.call(symbol);
      if (has(EmptyStringDescriptionStore, symbol)) return '';
      var desc = native ? string.slice(7, -1) : string.replace(regexp, '$1');
      return desc === '' ? undefined : desc;
    }
  });

  $({ global: true, forced: true }, {
    Symbol: SymbolWrapper
  });
}


/***/ }),

/***/ "e163":
/***/ (function(module, exports, __webpack_require__) {

var has = __webpack_require__("5135");
var toObject = __webpack_require__("7b0b");
var sharedKey = __webpack_require__("f772");
var CORRECT_PROTOTYPE_GETTER = __webpack_require__("e177");

var IE_PROTO = sharedKey('IE_PROTO');
var ObjectPrototype = Object.prototype;

// `Object.getPrototypeOf` method
// https://tc39.github.io/ecma262/#sec-object.getprototypeof
module.exports = CORRECT_PROTOTYPE_GETTER ? Object.getPrototypeOf : function (O) {
  O = toObject(O);
  if (has(O, IE_PROTO)) return O[IE_PROTO];
  if (typeof O.constructor == 'function' && O instanceof O.constructor) {
    return O.constructor.prototype;
  } return O instanceof Object ? ObjectPrototype : null;
};


/***/ }),

/***/ "e177":
/***/ (function(module, exports, __webpack_require__) {

var fails = __webpack_require__("d039");

module.exports = !fails(function () {
  function F() { /* empty */ }
  F.prototype.constructor = null;
  return Object.getPrototypeOf(new F()) !== F.prototype;
});


/***/ }),

/***/ "e260":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var toIndexedObject = __webpack_require__("fc6a");
var addToUnscopables = __webpack_require__("44d2");
var Iterators = __webpack_require__("3f8c");
var InternalStateModule = __webpack_require__("69f3");
var defineIterator = __webpack_require__("7dd0");

var ARRAY_ITERATOR = 'Array Iterator';
var setInternalState = InternalStateModule.set;
var getInternalState = InternalStateModule.getterFor(ARRAY_ITERATOR);

// `Array.prototype.entries` method
// https://tc39.github.io/ecma262/#sec-array.prototype.entries
// `Array.prototype.keys` method
// https://tc39.github.io/ecma262/#sec-array.prototype.keys
// `Array.prototype.values` method
// https://tc39.github.io/ecma262/#sec-array.prototype.values
// `Array.prototype[@@iterator]` method
// https://tc39.github.io/ecma262/#sec-array.prototype-@@iterator
// `CreateArrayIterator` internal method
// https://tc39.github.io/ecma262/#sec-createarrayiterator
module.exports = defineIterator(Array, 'Array', function (iterated, kind) {
  setInternalState(this, {
    type: ARRAY_ITERATOR,
    target: toIndexedObject(iterated), // target
    index: 0,                          // next index
    kind: kind                         // kind
  });
// `%ArrayIteratorPrototype%.next` method
// https://tc39.github.io/ecma262/#sec-%arrayiteratorprototype%.next
}, function () {
  var state = getInternalState(this);
  var target = state.target;
  var kind = state.kind;
  var index = state.index++;
  if (!target || index >= target.length) {
    state.target = undefined;
    return { value: undefined, done: true };
  }
  if (kind == 'keys') return { value: index, done: false };
  if (kind == 'values') return { value: target[index], done: false };
  return { value: [index, target[index]], done: false };
}, 'values');

// argumentsList[@@iterator] is %ArrayProto_values%
// https://tc39.github.io/ecma262/#sec-createunmappedargumentsobject
// https://tc39.github.io/ecma262/#sec-createmappedargumentsobject
Iterators.Arguments = Iterators.Array;

// https://tc39.github.io/ecma262/#sec-array.prototype-@@unscopables
addToUnscopables('keys');
addToUnscopables('values');
addToUnscopables('entries');


/***/ }),

/***/ "e285":
/***/ (function(module, exports, __webpack_require__) {

var global = __webpack_require__("da84");

var globalIsFinite = global.isFinite;

// `Number.isFinite` method
// https://tc39.github.io/ecma262/#sec-number.isfinite
module.exports = Number.isFinite || function isFinite(it) {
  return typeof it == 'number' && globalIsFinite(it);
};


/***/ }),

/***/ "e2cc":
/***/ (function(module, exports, __webpack_require__) {

var redefine = __webpack_require__("6eeb");

module.exports = function (target, src, options) {
  for (var key in src) redefine(target, key, src[key], options);
  return target;
};


/***/ }),

/***/ "e439":
/***/ (function(module, exports, __webpack_require__) {

var $ = __webpack_require__("23e7");
var fails = __webpack_require__("d039");
var toIndexedObject = __webpack_require__("fc6a");
var nativeGetOwnPropertyDescriptor = __webpack_require__("06cf").f;
var DESCRIPTORS = __webpack_require__("83ab");

var FAILS_ON_PRIMITIVES = fails(function () { nativeGetOwnPropertyDescriptor(1); });
var FORCED = !DESCRIPTORS || FAILS_ON_PRIMITIVES;

// `Object.getOwnPropertyDescriptor` method
// https://tc39.github.io/ecma262/#sec-object.getownpropertydescriptor
$({ target: 'Object', stat: true, forced: FORCED, sham: !DESCRIPTORS }, {
  getOwnPropertyDescriptor: function getOwnPropertyDescriptor(it, key) {
    return nativeGetOwnPropertyDescriptor(toIndexedObject(it), key);
  }
});


/***/ }),

/***/ "e667":
/***/ (function(module, exports) {

module.exports = function (exec) {
  try {
    return { error: false, value: exec() };
  } catch (error) {
    return { error: true, value: error };
  }
};


/***/ }),

/***/ "e683":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


/**
 * Creates a new URL by combining the specified URLs
 *
 * @param {string} baseURL The base URL
 * @param {string} relativeURL The relative URL
 * @returns {string} The combined URL
 */
module.exports = function combineURLs(baseURL, relativeURL) {
  return relativeURL
    ? baseURL.replace(/\/+$/, '') + '/' + relativeURL.replace(/^\/+/, '')
    : baseURL;
};


/***/ }),

/***/ "e6cf":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var $ = __webpack_require__("23e7");
var IS_PURE = __webpack_require__("c430");
var global = __webpack_require__("da84");
var getBuiltIn = __webpack_require__("d066");
var NativePromise = __webpack_require__("fea9");
var redefine = __webpack_require__("6eeb");
var redefineAll = __webpack_require__("e2cc");
var setToStringTag = __webpack_require__("d44e");
var setSpecies = __webpack_require__("2626");
var isObject = __webpack_require__("861d");
var aFunction = __webpack_require__("1c0b");
var anInstance = __webpack_require__("19aa");
var classof = __webpack_require__("c6b6");
var iterate = __webpack_require__("2266");
var checkCorrectnessOfIteration = __webpack_require__("1c7e");
var speciesConstructor = __webpack_require__("4840");
var task = __webpack_require__("2cf4").set;
var microtask = __webpack_require__("b575");
var promiseResolve = __webpack_require__("cdf9");
var hostReportErrors = __webpack_require__("44de");
var newPromiseCapabilityModule = __webpack_require__("f069");
var perform = __webpack_require__("e667");
var InternalStateModule = __webpack_require__("69f3");
var isForced = __webpack_require__("94ca");
var wellKnownSymbol = __webpack_require__("b622");
var V8_VERSION = __webpack_require__("60ae");

var SPECIES = wellKnownSymbol('species');
var PROMISE = 'Promise';
var getInternalState = InternalStateModule.get;
var setInternalState = InternalStateModule.set;
var getInternalPromiseState = InternalStateModule.getterFor(PROMISE);
var PromiseConstructor = NativePromise;
var TypeError = global.TypeError;
var document = global.document;
var process = global.process;
var $fetch = getBuiltIn('fetch');
var newPromiseCapability = newPromiseCapabilityModule.f;
var newGenericPromiseCapability = newPromiseCapability;
var IS_NODE = classof(process) == 'process';
var DISPATCH_EVENT = !!(document && document.createEvent && global.dispatchEvent);
var UNHANDLED_REJECTION = 'unhandledrejection';
var REJECTION_HANDLED = 'rejectionhandled';
var PENDING = 0;
var FULFILLED = 1;
var REJECTED = 2;
var HANDLED = 1;
var UNHANDLED = 2;
var Internal, OwnPromiseCapability, PromiseWrapper, nativeThen;

var FORCED = isForced(PROMISE, function () {
  // V8 6.6 (Node 10 and Chrome 66) have a bug with resolving custom thenables
  // https://bugs.chromium.org/p/chromium/issues/detail?id=830565
  // We can't detect it synchronously, so just check versions
  if (V8_VERSION === 66) return true;
  // Unhandled rejections tracking support, NodeJS Promise without it fails @@species test
  if (!IS_NODE && typeof PromiseRejectionEvent != 'function') return true;
  // We need Promise#finally in the pure version for preventing prototype pollution
  if (IS_PURE && !PromiseConstructor.prototype['finally']) return true;
  // We can't use @@species feature detection in V8 since it causes
  // deoptimization and performance degradation
  // https://github.com/zloirock/core-js/issues/679
  if (V8_VERSION >= 51 && /native code/.test(PromiseConstructor)) return false;
  // Detect correctness of subclassing with @@species support
  var promise = PromiseConstructor.resolve(1);
  var FakePromise = function (exec) {
    exec(function () { /* empty */ }, function () { /* empty */ });
  };
  var constructor = promise.constructor = {};
  constructor[SPECIES] = FakePromise;
  return !(promise.then(function () { /* empty */ }) instanceof FakePromise);
});

var INCORRECT_ITERATION = FORCED || !checkCorrectnessOfIteration(function (iterable) {
  PromiseConstructor.all(iterable)['catch'](function () { /* empty */ });
});

// helpers
var isThenable = function (it) {
  var then;
  return isObject(it) && typeof (then = it.then) == 'function' ? then : false;
};

var notify = function (promise, state, isReject) {
  if (state.notified) return;
  state.notified = true;
  var chain = state.reactions;
  microtask(function () {
    var value = state.value;
    var ok = state.state == FULFILLED;
    var index = 0;
    // variable length - can't use forEach
    while (chain.length > index) {
      var reaction = chain[index++];
      var handler = ok ? reaction.ok : reaction.fail;
      var resolve = reaction.resolve;
      var reject = reaction.reject;
      var domain = reaction.domain;
      var result, then, exited;
      try {
        if (handler) {
          if (!ok) {
            if (state.rejection === UNHANDLED) onHandleUnhandled(promise, state);
            state.rejection = HANDLED;
          }
          if (handler === true) result = value;
          else {
            if (domain) domain.enter();
            result = handler(value); // can throw
            if (domain) {
              domain.exit();
              exited = true;
            }
          }
          if (result === reaction.promise) {
            reject(TypeError('Promise-chain cycle'));
          } else if (then = isThenable(result)) {
            then.call(result, resolve, reject);
          } else resolve(result);
        } else reject(value);
      } catch (error) {
        if (domain && !exited) domain.exit();
        reject(error);
      }
    }
    state.reactions = [];
    state.notified = false;
    if (isReject && !state.rejection) onUnhandled(promise, state);
  });
};

var dispatchEvent = function (name, promise, reason) {
  var event, handler;
  if (DISPATCH_EVENT) {
    event = document.createEvent('Event');
    event.promise = promise;
    event.reason = reason;
    event.initEvent(name, false, true);
    global.dispatchEvent(event);
  } else event = { promise: promise, reason: reason };
  if (handler = global['on' + name]) handler(event);
  else if (name === UNHANDLED_REJECTION) hostReportErrors('Unhandled promise rejection', reason);
};

var onUnhandled = function (promise, state) {
  task.call(global, function () {
    var value = state.value;
    var IS_UNHANDLED = isUnhandled(state);
    var result;
    if (IS_UNHANDLED) {
      result = perform(function () {
        if (IS_NODE) {
          process.emit('unhandledRejection', value, promise);
        } else dispatchEvent(UNHANDLED_REJECTION, promise, value);
      });
      // Browsers should not trigger `rejectionHandled` event if it was handled here, NodeJS - should
      state.rejection = IS_NODE || isUnhandled(state) ? UNHANDLED : HANDLED;
      if (result.error) throw result.value;
    }
  });
};

var isUnhandled = function (state) {
  return state.rejection !== HANDLED && !state.parent;
};

var onHandleUnhandled = function (promise, state) {
  task.call(global, function () {
    if (IS_NODE) {
      process.emit('rejectionHandled', promise);
    } else dispatchEvent(REJECTION_HANDLED, promise, state.value);
  });
};

var bind = function (fn, promise, state, unwrap) {
  return function (value) {
    fn(promise, state, value, unwrap);
  };
};

var internalReject = function (promise, state, value, unwrap) {
  if (state.done) return;
  state.done = true;
  if (unwrap) state = unwrap;
  state.value = value;
  state.state = REJECTED;
  notify(promise, state, true);
};

var internalResolve = function (promise, state, value, unwrap) {
  if (state.done) return;
  state.done = true;
  if (unwrap) state = unwrap;
  try {
    if (promise === value) throw TypeError("Promise can't be resolved itself");
    var then = isThenable(value);
    if (then) {
      microtask(function () {
        var wrapper = { done: false };
        try {
          then.call(value,
            bind(internalResolve, promise, wrapper, state),
            bind(internalReject, promise, wrapper, state)
          );
        } catch (error) {
          internalReject(promise, wrapper, error, state);
        }
      });
    } else {
      state.value = value;
      state.state = FULFILLED;
      notify(promise, state, false);
    }
  } catch (error) {
    internalReject(promise, { done: false }, error, state);
  }
};

// constructor polyfill
if (FORCED) {
  // 25.4.3.1 Promise(executor)
  PromiseConstructor = function Promise(executor) {
    anInstance(this, PromiseConstructor, PROMISE);
    aFunction(executor);
    Internal.call(this);
    var state = getInternalState(this);
    try {
      executor(bind(internalResolve, this, state), bind(internalReject, this, state));
    } catch (error) {
      internalReject(this, state, error);
    }
  };
  // eslint-disable-next-line no-unused-vars
  Internal = function Promise(executor) {
    setInternalState(this, {
      type: PROMISE,
      done: false,
      notified: false,
      parent: false,
      reactions: [],
      rejection: false,
      state: PENDING,
      value: undefined
    });
  };
  Internal.prototype = redefineAll(PromiseConstructor.prototype, {
    // `Promise.prototype.then` method
    // https://tc39.github.io/ecma262/#sec-promise.prototype.then
    then: function then(onFulfilled, onRejected) {
      var state = getInternalPromiseState(this);
      var reaction = newPromiseCapability(speciesConstructor(this, PromiseConstructor));
      reaction.ok = typeof onFulfilled == 'function' ? onFulfilled : true;
      reaction.fail = typeof onRejected == 'function' && onRejected;
      reaction.domain = IS_NODE ? process.domain : undefined;
      state.parent = true;
      state.reactions.push(reaction);
      if (state.state != PENDING) notify(this, state, false);
      return reaction.promise;
    },
    // `Promise.prototype.catch` method
    // https://tc39.github.io/ecma262/#sec-promise.prototype.catch
    'catch': function (onRejected) {
      return this.then(undefined, onRejected);
    }
  });
  OwnPromiseCapability = function () {
    var promise = new Internal();
    var state = getInternalState(promise);
    this.promise = promise;
    this.resolve = bind(internalResolve, promise, state);
    this.reject = bind(internalReject, promise, state);
  };
  newPromiseCapabilityModule.f = newPromiseCapability = function (C) {
    return C === PromiseConstructor || C === PromiseWrapper
      ? new OwnPromiseCapability(C)
      : newGenericPromiseCapability(C);
  };

  if (!IS_PURE && typeof NativePromise == 'function') {
    nativeThen = NativePromise.prototype.then;

    // wrap native Promise#then for native async functions
    redefine(NativePromise.prototype, 'then', function then(onFulfilled, onRejected) {
      var that = this;
      return new PromiseConstructor(function (resolve, reject) {
        nativeThen.call(that, resolve, reject);
      }).then(onFulfilled, onRejected);
    // https://github.com/zloirock/core-js/issues/640
    }, { unsafe: true });

    // wrap fetch result
    if (typeof $fetch == 'function') $({ global: true, enumerable: true, forced: true }, {
      // eslint-disable-next-line no-unused-vars
      fetch: function fetch(input /* , init */) {
        return promiseResolve(PromiseConstructor, $fetch.apply(global, arguments));
      }
    });
  }
}

$({ global: true, wrap: true, forced: FORCED }, {
  Promise: PromiseConstructor
});

setToStringTag(PromiseConstructor, PROMISE, false, true);
setSpecies(PROMISE);

PromiseWrapper = getBuiltIn(PROMISE);

// statics
$({ target: PROMISE, stat: true, forced: FORCED }, {
  // `Promise.reject` method
  // https://tc39.github.io/ecma262/#sec-promise.reject
  reject: function reject(r) {
    var capability = newPromiseCapability(this);
    capability.reject.call(undefined, r);
    return capability.promise;
  }
});

$({ target: PROMISE, stat: true, forced: IS_PURE || FORCED }, {
  // `Promise.resolve` method
  // https://tc39.github.io/ecma262/#sec-promise.resolve
  resolve: function resolve(x) {
    return promiseResolve(IS_PURE && this === PromiseWrapper ? PromiseConstructor : this, x);
  }
});

$({ target: PROMISE, stat: true, forced: INCORRECT_ITERATION }, {
  // `Promise.all` method
  // https://tc39.github.io/ecma262/#sec-promise.all
  all: function all(iterable) {
    var C = this;
    var capability = newPromiseCapability(C);
    var resolve = capability.resolve;
    var reject = capability.reject;
    var result = perform(function () {
      var $promiseResolve = aFunction(C.resolve);
      var values = [];
      var counter = 0;
      var remaining = 1;
      iterate(iterable, function (promise) {
        var index = counter++;
        var alreadyCalled = false;
        values.push(undefined);
        remaining++;
        $promiseResolve.call(C, promise).then(function (value) {
          if (alreadyCalled) return;
          alreadyCalled = true;
          values[index] = value;
          --remaining || resolve(values);
        }, reject);
      });
      --remaining || resolve(values);
    });
    if (result.error) reject(result.value);
    return capability.promise;
  },
  // `Promise.race` method
  // https://tc39.github.io/ecma262/#sec-promise.race
  race: function race(iterable) {
    var C = this;
    var capability = newPromiseCapability(C);
    var reject = capability.reject;
    var result = perform(function () {
      var $promiseResolve = aFunction(C.resolve);
      iterate(iterable, function (promise) {
        $promiseResolve.call(C, promise).then(capability.resolve, reject);
      });
    });
    if (result.error) reject(result.value);
    return capability.promise;
  }
});


/***/ }),

/***/ "e893":
/***/ (function(module, exports, __webpack_require__) {

var has = __webpack_require__("5135");
var ownKeys = __webpack_require__("56ef");
var getOwnPropertyDescriptorModule = __webpack_require__("06cf");
var definePropertyModule = __webpack_require__("9bf2");

module.exports = function (target, source) {
  var keys = ownKeys(source);
  var defineProperty = definePropertyModule.f;
  var getOwnPropertyDescriptor = getOwnPropertyDescriptorModule.f;
  for (var i = 0; i < keys.length; i++) {
    var key = keys[i];
    if (!has(target, key)) defineProperty(target, key, getOwnPropertyDescriptor(source, key));
  }
};


/***/ }),

/***/ "e8b5":
/***/ (function(module, exports, __webpack_require__) {

var classof = __webpack_require__("c6b6");

// `IsArray` abstract operation
// https://tc39.github.io/ecma262/#sec-isarray
module.exports = Array.isArray || function isArray(arg) {
  return classof(arg) == 'Array';
};


/***/ }),

/***/ "e95a":
/***/ (function(module, exports, __webpack_require__) {

var wellKnownSymbol = __webpack_require__("b622");
var Iterators = __webpack_require__("3f8c");

var ITERATOR = wellKnownSymbol('iterator');
var ArrayPrototype = Array.prototype;

// check on default Array iterator
module.exports = function (it) {
  return it !== undefined && (Iterators.Array === it || ArrayPrototype[ITERATOR] === it);
};


/***/ }),

/***/ "ea02":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return createDigestAuth; });
/* harmony import */ var regenerator_runtime_runtime__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("96cf");
/* harmony import */ var regenerator_runtime_runtime__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(regenerator_runtime_runtime__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var D_workspace_meetnow_node_modules_babel_runtime_helpers_esm_asyncToGenerator__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("1da1");
/* harmony import */ var _user_api__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__("f6b8");
/* harmony import */ var _utils_worker__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__("2c1a");




function createDigestAuth(_x) {
  return _createDigestAuth.apply(this, arguments);
}

function _createDigestAuth() {
  _createDigestAuth = Object(D_workspace_meetnow_node_modules_babel_runtime_helpers_esm_asyncToGenerator__WEBPACK_IMPORTED_MODULE_1__[/* default */ "a"])(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee3(selection) {
    var token, api, response, worker, invalid, _invalid;

    return regeneratorRuntime.wrap(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            _invalid = function _ref2() {
              _invalid = Object(D_workspace_meetnow_node_modules_babel_runtime_helpers_esm_asyncToGenerator__WEBPACK_IMPORTED_MODULE_1__[/* default */ "a"])(
              /*#__PURE__*/
              regeneratorRuntime.mark(function _callee2() {
                return regeneratorRuntime.wrap(function _callee2$(_context2) {
                  while (1) {
                    switch (_context2.prev = _context2.next) {
                      case 0:
                        _context2.next = 2;
                        return api.request('logout').send() // ignore error anyway
                        .catch(function () {});

                      case 2:
                        worker.stop();
                        token = undefined;

                      case 4:
                      case "end":
                        return _context2.stop();
                    }
                  }
                }, _callee2);
              }));
              return _invalid.apply(this, arguments);
            };

            invalid = function _ref() {
              return _invalid.apply(this, arguments);
            };

            token = selection; // create api

            api = Object(_user_api__WEBPACK_IMPORTED_MODULE_2__[/* createUserApi */ "a"])(function () {
              return token;
            }); // try auth

            _context3.next = 6;
            return api.request('selectAccount').send();

          case 6:
            response = _context3.sent;
            token = response.data.data.token;
            // creat auth() worker
            worker = Object(_utils_worker__WEBPACK_IMPORTED_MODULE_3__[/* createWorker */ "a"])({
              interval: 5 * 60 * 1000,
              work: function () {
                var _work = Object(D_workspace_meetnow_node_modules_babel_runtime_helpers_esm_asyncToGenerator__WEBPACK_IMPORTED_MODULE_1__[/* default */ "a"])(
                /*#__PURE__*/
                regeneratorRuntime.mark(function _callee() {
                  return regeneratorRuntime.wrap(function _callee$(_context) {
                    while (1) {
                      switch (_context.prev = _context.next) {
                        case 0:
                          _context.next = 2;
                          return api.request('refreshToken').send();

                        case 2:
                        case "end":
                          return _context.stop();
                      }
                    }
                  }, _callee);
                }));

                function work() {
                  return _work.apply(this, arguments);
                }

                return work;
              }()
            }); // start worker

            worker.start(false);
            _context3.t0 = api;
            _context3.t1 = worker;
            _context3.t2 = invalid;
            return _context3.abrupt("return", {
              get token() {
                return token;
              },

              api: _context3.t0,
              worker: _context3.t1,
              invalid: _context3.t2
            });

          case 14:
          case "end":
            return _context3.stop();
        }
      }
    }, _callee3);
  }));
  return _createDigestAuth.apply(this, arguments);
}

/***/ }),

/***/ "f00c":
/***/ (function(module, exports, __webpack_require__) {

var $ = __webpack_require__("23e7");
var numberIsFinite = __webpack_require__("e285");

// `Number.isFinite` method
// https://tc39.github.io/ecma262/#sec-number.isfinite
$({ target: 'Number', stat: true }, { isFinite: numberIsFinite });


/***/ }),

/***/ "f069":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var aFunction = __webpack_require__("1c0b");

var PromiseCapability = function (C) {
  var resolve, reject;
  this.promise = new C(function ($$resolve, $$reject) {
    if (resolve !== undefined || reject !== undefined) throw TypeError('Bad Promise constructor');
    resolve = $$resolve;
    reject = $$reject;
  });
  this.resolve = aFunction(resolve);
  this.reject = aFunction(reject);
};

// 25.4.1.5 NewPromiseCapability(C)
module.exports.f = function (C) {
  return new PromiseCapability(C);
};


/***/ }),

/***/ "f183":
/***/ (function(module, exports, __webpack_require__) {

var hiddenKeys = __webpack_require__("d012");
var isObject = __webpack_require__("861d");
var has = __webpack_require__("5135");
var defineProperty = __webpack_require__("9bf2").f;
var uid = __webpack_require__("90e3");
var FREEZING = __webpack_require__("bb2f");

var METADATA = uid('meta');
var id = 0;

var isExtensible = Object.isExtensible || function () {
  return true;
};

var setMetadata = function (it) {
  defineProperty(it, METADATA, { value: {
    objectID: 'O' + ++id, // object ID
    weakData: {}          // weak collections IDs
  } });
};

var fastKey = function (it, create) {
  // return a primitive with prefix
  if (!isObject(it)) return typeof it == 'symbol' ? it : (typeof it == 'string' ? 'S' : 'P') + it;
  if (!has(it, METADATA)) {
    // can't set metadata to uncaught frozen object
    if (!isExtensible(it)) return 'F';
    // not necessary to add metadata
    if (!create) return 'E';
    // add missing metadata
    setMetadata(it);
  // return object ID
  } return it[METADATA].objectID;
};

var getWeakData = function (it, create) {
  if (!has(it, METADATA)) {
    // can't set metadata to uncaught frozen object
    if (!isExtensible(it)) return true;
    // not necessary to add metadata
    if (!create) return false;
    // add missing metadata
    setMetadata(it);
  // return the store of weak collections IDs
  } return it[METADATA].weakData;
};

// add metadata on freeze-family methods calling
var onFreeze = function (it) {
  if (FREEZING && meta.REQUIRED && isExtensible(it) && !has(it, METADATA)) setMetadata(it);
  return it;
};

var meta = module.exports = {
  REQUIRED: false,
  fastKey: fastKey,
  getWeakData: getWeakData,
  onFreeze: onFreeze
};

hiddenKeys[METADATA] = true;


/***/ }),

/***/ "f5df":
/***/ (function(module, exports, __webpack_require__) {

var classofRaw = __webpack_require__("c6b6");
var wellKnownSymbol = __webpack_require__("b622");

var TO_STRING_TAG = wellKnownSymbol('toStringTag');
// ES3 wrong here
var CORRECT_ARGUMENTS = classofRaw(function () { return arguments; }()) == 'Arguments';

// fallback for IE11 Script Access Denied error
var tryGet = function (it, key) {
  try {
    return it[key];
  } catch (error) { /* empty */ }
};

// getting tag from ES6+ `Object.prototype.toString`
module.exports = function (it) {
  var O, tag, result;
  return it === undefined ? 'Undefined' : it === null ? 'Null'
    // @@toStringTag case
    : typeof (tag = tryGet(O = Object(it), TO_STRING_TAG)) == 'string' ? tag
    // builtinTag case
    : CORRECT_ARGUMENTS ? classofRaw(O)
    // ES3 arguments fallback
    : (result = classofRaw(O)) == 'Object' && typeof O.callee == 'function' ? 'Arguments' : result;
};


/***/ }),

/***/ "f6b4":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var utils = __webpack_require__("c532");

function InterceptorManager() {
  this.handlers = [];
}

/**
 * Add a new interceptor to the stack
 *
 * @param {Function} fulfilled The function to handle `then` for a `Promise`
 * @param {Function} rejected The function to handle `reject` for a `Promise`
 *
 * @return {Number} An ID used to remove interceptor later
 */
InterceptorManager.prototype.use = function use(fulfilled, rejected) {
  this.handlers.push({
    fulfilled: fulfilled,
    rejected: rejected
  });
  return this.handlers.length - 1;
};

/**
 * Remove an interceptor from the stack
 *
 * @param {Number} id The ID that was returned by `use`
 */
InterceptorManager.prototype.eject = function eject(id) {
  if (this.handlers[id]) {
    this.handlers[id] = null;
  }
};

/**
 * Iterate over all the registered interceptors
 *
 * This method is particularly useful for skipping over any
 * interceptors that may have become `null` calling `eject`.
 *
 * @param {Function} fn The function to call for each interceptor
 */
InterceptorManager.prototype.forEach = function forEach(fn) {
  utils.forEach(this.handlers, function forEachHandler(h) {
    if (h !== null) {
      fn(h);
    }
  });
};

module.exports = InterceptorManager;


/***/ }),

/***/ "f6b8":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";

// EXTERNAL MODULE: ./node_modules/core-js/modules/es.symbol.js
var es_symbol = __webpack_require__("a4d3");

// EXTERNAL MODULE: ./node_modules/core-js/modules/es.array.filter.js
var es_array_filter = __webpack_require__("4de4");

// EXTERNAL MODULE: ./node_modules/core-js/modules/es.object.get-own-property-descriptor.js
var es_object_get_own_property_descriptor = __webpack_require__("e439");

// EXTERNAL MODULE: ./node_modules/core-js/modules/es.object.get-own-property-descriptors.js
var es_object_get_own_property_descriptors = __webpack_require__("dbb4");

// EXTERNAL MODULE: ./node_modules/core-js/modules/es.object.keys.js
var es_object_keys = __webpack_require__("b64b");

// EXTERNAL MODULE: ./node_modules/core-js/modules/web.dom-collections.for-each.js
var web_dom_collections_for_each = __webpack_require__("159b");

// EXTERNAL MODULE: ./node_modules/@babel/runtime/helpers/esm/defineProperty.js
var defineProperty = __webpack_require__("ade3");

// EXTERNAL MODULE: ./node_modules/axios/index.js
var axios = __webpack_require__("bc3a");
var axios_default = /*#__PURE__*/__webpack_require__.n(axios);

// EXTERNAL MODULE: ./packages/meetnow/node_modules/debug/src/browser.js
var browser = __webpack_require__("3ded");
var browser_default = /*#__PURE__*/__webpack_require__.n(browser);

// CONCATENATED MODULE: ./packages/meetnow/src/api/request-method.ts
var RequestMethod = {
  GET: 'get',
  POST: 'post'
};
// CONCATENATED MODULE: ./packages/meetnow/src/api/api-configs.ts

var baseURL = {
  ctrl: '/conference-ctrl/api/v1/ctrl/',
  usermgr: '/user-manager/api/v1/',
  confmgr: '/conference-manager/api/v1/'
};
var configs = {
  // user manager
  getVirtualJWT: {
    method: RequestMethod.GET,
    url: "".concat(baseURL.usermgr, "external/virtualJwt/party")
  },
  login: {
    method: RequestMethod.POST,
    url: "".concat(baseURL.usermgr, "login")
  },
  selectAccount: {
    method: RequestMethod.POST,
    url: "".concat(baseURL.usermgr, "login/selectAccount")
  },
  logout: {
    method: RequestMethod.POST,
    url: "".concat(baseURL.usermgr, "logout")
  },
  refreshToken: {
    method: RequestMethod.GET,
    url: "".concat(baseURL.usermgr, "current/user/refreshToken")
  },
  sendMobileLoginVerifyCode: {
    method: RequestMethod.POST,
    url: "".concat(baseURL.usermgr, "sendMobileLoginVerifyCode")
  },
  // conference manager
  getConferenceInfo: {
    method: RequestMethod.GET,
    url: "".concat(baseURL.confmgr, "external/conference/info")
  },
  // info
  getURL: {
    method: RequestMethod.POST,
    url: "".concat(baseURL.ctrl, "get-url-by-long-num")
  },
  getFullInfo: {
    method: RequestMethod.POST,
    url: "".concat(baseURL.ctrl, "get-conference-info")
  },
  getBasicInfo: {
    method: RequestMethod.POST,
    url: "".concat(baseURL.ctrl, "get-short-info")
  },
  getBasicInfoOffline: {
    method: RequestMethod.POST,
    url: "".concat(baseURL.ctrl, "get-short-info-offline")
  },
  getStats: {
    method: RequestMethod.POST,
    url: "".concat(baseURL.ctrl, "get-call-stats")
  },
  // lifecycle
  polling: {
    method: RequestMethod.POST,
    url: "".concat(baseURL.ctrl, "polling")
  },
  keepalive: {
    method: RequestMethod.POST,
    url: "".concat(baseURL.ctrl, "user-keepalive")
  },
  // focus
  joinFocus: {
    method: RequestMethod.POST,
    url: "".concat(baseURL.ctrl, "join-focus")
  },
  joinWechat: {
    method: RequestMethod.POST,
    url: "".concat(baseURL.ctrl, "join-wechat")
  },
  // media
  joinMedia: {
    method: RequestMethod.POST,
    url: "".concat(baseURL.ctrl, "join-audio-video")
  },
  renegMedia: {
    method: RequestMethod.POST,
    url: "".concat(baseURL.ctrl, "av-reneg")
  },
  // share
  joinShare: {
    method: RequestMethod.POST,
    url: "".concat(baseURL.ctrl, "join-applicationsharing-v2")
  },
  leaveShare: {
    method: RequestMethod.POST,
    url: "".concat(baseURL.ctrl, "bye-applicationsharing")
  },
  switchShare: {
    method: RequestMethod.POST,
    url: "".concat(baseURL.ctrl, "applicationsharing-switch")
  },
  renegShare: {
    method: RequestMethod.POST,
    url: "".concat(baseURL.ctrl, "applicationsharing-reneg")
  },
  // im
  pushMessage: {
    method: RequestMethod.POST,
    url: "".concat(baseURL.ctrl, "im-info")
  },
  pullMessage: {
    method: RequestMethod.POST,
    url: "".concat(baseURL.ctrl, "get-all-im-info")
  },
  // ctrl
  muteAll: {
    method: RequestMethod.POST,
    url: "".concat(baseURL.ctrl, "mute-all")
  },
  unmuteAll: {
    method: RequestMethod.POST,
    url: "".concat(baseURL.ctrl, "unmute-all")
  },
  acceptLobbyUser: {
    method: RequestMethod.POST,
    url: "".concat(baseURL.ctrl, "grant-lobby-user")
  },
  acceptLobbyUserAll: {
    method: RequestMethod.POST,
    url: "".concat(baseURL.ctrl, "grant-lobby-all")
  },
  rejectLobbyUserAll: {
    method: RequestMethod.POST,
    url: "".concat(baseURL.ctrl, "del-lobby-all")
  },
  waitLobbyUser: {
    method: RequestMethod.POST,
    url: "".concat(baseURL.ctrl, "wait-lobby-user")
  },
  waitLobbyUserAll: {
    method: RequestMethod.POST,
    url: "".concat(baseURL.ctrl, "wait-lobby-all")
  },
  rejectHandupAll: {
    method: RequestMethod.POST,
    url: "".concat(baseURL.ctrl, "reject-all-hand-up")
  },
  deleteUser: {
    method: RequestMethod.POST,
    url: "".concat(baseURL.ctrl, "delete-user")
  },
  setUserMedia: {
    method: RequestMethod.POST,
    url: "".concat(baseURL.ctrl, "modify-user-media")
  },
  setUserRole: {
    method: RequestMethod.POST,
    url: "".concat(baseURL.ctrl, "modify-user-role")
  },
  setUserDisplayText: {
    method: RequestMethod.POST,
    url: "".concat(baseURL.ctrl, "edit-user-display-text")
  },
  holdUser: {
    method: RequestMethod.POST,
    url: "".concat(baseURL.ctrl, "wait-lobby-user")
  },
  inviteUser: {
    method: RequestMethod.POST,
    url: "".concat(baseURL.ctrl, "invite-user")
  },
  setFocusVideo: {
    method: RequestMethod.POST,
    url: "".concat(baseURL.ctrl, "set-focus-video")
  },
  setSpeakMode: {
    method: RequestMethod.POST,
    url: "".concat(baseURL.ctrl, "set-speak-mode")
  },
  setFreeLayout: {
    method: RequestMethod.POST,
    url: "".concat(baseURL.ctrl, "set-free-layout")
  },
  setCustomizeLayout: {
    method: RequestMethod.POST,
    url: "".concat(baseURL.ctrl, "set-customize-layout")
  },
  setGlobalLayout: {
    method: RequestMethod.POST,
    url: "".concat(baseURL.ctrl, "set-global-layout")
  },
  setFecc: {
    method: RequestMethod.POST,
    url: "".concat(baseURL.ctrl, "set-fecc")
  },
  setTitle: {
    method: RequestMethod.POST,
    url: "".concat(baseURL.ctrl, "set-title")
  },
  sendTitle: {
    method: RequestMethod.POST,
    url: "".concat(baseURL.ctrl, "send-title")
  },
  setRecord: {
    method: RequestMethod.POST,
    url: "".concat(baseURL.ctrl, "record-operate")
  },
  setRTMP: {
    method: RequestMethod.POST,
    url: "".concat(baseURL.ctrl, "rtmp-operate")
  },
  setLock: {
    method: RequestMethod.POST,
    url: "".concat(baseURL.ctrl, "lock-conference")
  },
  leave: {
    method: RequestMethod.POST,
    url: "".concat(baseURL.ctrl, "quit-conference")
  },
  end: {
    method: RequestMethod.POST,
    url: "".concat(baseURL.ctrl, "end-conference")
  }
};
var CONFIGS = configs;
// EXTERNAL MODULE: ./node_modules/core-js/modules/es.function.name.js
var es_function_name = __webpack_require__("b0c0");

// EXTERNAL MODULE: ./node_modules/@babel/runtime/helpers/esm/classCallCheck.js
var classCallCheck = __webpack_require__("d4ec");

// EXTERNAL MODULE: ./node_modules/@babel/runtime/helpers/esm/typeof.js
var esm_typeof = __webpack_require__("53ca");

// CONCATENATED MODULE: ./node_modules/@babel/runtime/helpers/esm/assertThisInitialized.js
function _assertThisInitialized(self) {
  if (self === void 0) {
    throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
  }

  return self;
}
// CONCATENATED MODULE: ./node_modules/@babel/runtime/helpers/esm/possibleConstructorReturn.js


function _possibleConstructorReturn(self, call) {
  if (call && (Object(esm_typeof["a" /* default */])(call) === "object" || typeof call === "function")) {
    return call;
  }

  return _assertThisInitialized(self);
}
// EXTERNAL MODULE: ./node_modules/core-js/modules/es.object.get-prototype-of.js
var es_object_get_prototype_of = __webpack_require__("3410");

// CONCATENATED MODULE: ./node_modules/@babel/runtime/helpers/esm/getPrototypeOf.js

function _getPrototypeOf(o) {
  _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) {
    return o.__proto__ || Object.getPrototypeOf(o);
  };
  return _getPrototypeOf(o);
}
// CONCATENATED MODULE: ./node_modules/@babel/runtime/helpers/esm/setPrototypeOf.js
function _setPrototypeOf(o, p) {
  _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) {
    o.__proto__ = p;
    return o;
  };

  return _setPrototypeOf(o, p);
}
// CONCATENATED MODULE: ./node_modules/@babel/runtime/helpers/esm/inherits.js

function _inherits(subClass, superClass) {
  if (typeof superClass !== "function" && superClass !== null) {
    throw new TypeError("Super expression must either be null or a function");
  }

  subClass.prototype = Object.create(superClass && superClass.prototype, {
    constructor: {
      value: subClass,
      writable: true,
      configurable: true
    }
  });
  if (superClass) _setPrototypeOf(subClass, superClass);
}
// EXTERNAL MODULE: ./node_modules/core-js/modules/es.array.iterator.js
var es_array_iterator = __webpack_require__("e260");

// EXTERNAL MODULE: ./node_modules/core-js/modules/es.map.js
var es_map = __webpack_require__("4ec9");

// EXTERNAL MODULE: ./node_modules/core-js/modules/es.object.to-string.js
var es_object_to_string = __webpack_require__("d3b7");

// EXTERNAL MODULE: ./node_modules/core-js/modules/es.string.iterator.js
var es_string_iterator = __webpack_require__("3ca3");

// EXTERNAL MODULE: ./node_modules/core-js/modules/web.dom-collections.iterator.js
var web_dom_collections_iterator = __webpack_require__("ddb0");

// EXTERNAL MODULE: ./node_modules/core-js/modules/es.array.index-of.js
var es_array_index_of = __webpack_require__("c975");

// EXTERNAL MODULE: ./node_modules/core-js/modules/es.regexp.to-string.js
var es_regexp_to_string = __webpack_require__("25f0");

// CONCATENATED MODULE: ./node_modules/@babel/runtime/helpers/esm/isNativeFunction.js



function _isNativeFunction(fn) {
  return Function.toString.call(fn).indexOf("[native code]") !== -1;
}
// EXTERNAL MODULE: ./node_modules/core-js/modules/es.reflect.construct.js
var es_reflect_construct = __webpack_require__("4ae1");

// CONCATENATED MODULE: ./node_modules/@babel/runtime/helpers/esm/construct.js





function isNativeReflectConstruct() {
  if (typeof Reflect === "undefined" || !Reflect.construct) return false;
  if (Reflect.construct.sham) return false;
  if (typeof Proxy === "function") return true;

  try {
    Date.prototype.toString.call(Reflect.construct(Date, [], function () {}));
    return true;
  } catch (e) {
    return false;
  }
}

function construct_construct(Parent, args, Class) {
  if (isNativeReflectConstruct()) {
    construct_construct = Reflect.construct;
  } else {
    construct_construct = function _construct(Parent, args, Class) {
      var a = [null];
      a.push.apply(a, args);
      var Constructor = Function.bind.apply(Parent, a);
      var instance = new Constructor();
      if (Class) _setPrototypeOf(instance, Class.prototype);
      return instance;
    };
  }

  return construct_construct.apply(null, arguments);
}
// CONCATENATED MODULE: ./node_modules/@babel/runtime/helpers/esm/wrapNativeSuper.js









function wrapNativeSuper_wrapNativeSuper(Class) {
  var _cache = typeof Map === "function" ? new Map() : undefined;

  wrapNativeSuper_wrapNativeSuper = function _wrapNativeSuper(Class) {
    if (Class === null || !_isNativeFunction(Class)) return Class;

    if (typeof Class !== "function") {
      throw new TypeError("Super expression must either be null or a function");
    }

    if (typeof _cache !== "undefined") {
      if (_cache.has(Class)) return _cache.get(Class);

      _cache.set(Class, Wrapper);
    }

    function Wrapper() {
      return construct_construct(Class, arguments, _getPrototypeOf(this).constructor);
    }

    Wrapper.prototype = Object.create(Class.prototype, {
      constructor: {
        value: Wrapper,
        enumerable: false,
        writable: true,
        configurable: true
      }
    });
    return _setPrototypeOf(Wrapper, Class);
  };

  return wrapNativeSuper_wrapNativeSuper(Class);
}
// CONCATENATED MODULE: ./packages/meetnow/src/api/api-error.ts






var DEFAULT_ERROR = {
  msg: 'Unknown Error',
  errorCode: -1
};
var api_error_ApiError =
/*#__PURE__*/
function (_Error) {
  _inherits(ApiError, _Error);

  function ApiError(bizCode) {
    var _this;

    var error = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : DEFAULT_ERROR;

    Object(classCallCheck["a" /* default */])(this, ApiError);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(ApiError).call(this));
    _this.name = 'ApiError';
    _this.message = error.msg;
    _this.errCode = error.errorCode;
    _this.bizCode = bizCode;
    return _this;
  }

  return ApiError;
}(wrapNativeSuper_wrapNativeSuper(Error)); // TODO
// api error type checker
// EXTERNAL MODULE: ./packages/meetnow/src/api/request.ts
var api_request = __webpack_require__("65ae");

// CONCATENATED MODULE: ./packages/meetnow/src/api/index.ts








function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { Object(defineProperty["a" /* default */])(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }






var log = browser_default()('MN:Api');
function createApi() {
  var config = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  log('createApi()');
  var delegate = axios_default.a.create(_objectSpread({
    baseURL: '/'
  }, config));
  delegate.interceptors.response.use(function (response) {
    var _response$data = response.data,
        ret = _response$data.ret,
        bizCode = _response$data.bizCode,
        error = _response$data.error,
        data = _response$data.data;
    if (ret < 0) throw new api_error_ApiError(bizCode, error); // should not go here
    // server impl error

    if (ret === 0 && error) throw new api_error_ApiError(bizCode, error);
    log('request success: %o', data); // TBD
    // replace response data with actual data. eg. response.data = data;
    // TODO
    // normalize error

    return response;
  }, function (error) {
    log('request error: %o', error);
    throw error;
  });

  function request(apiName) {
    log("request() \"".concat(apiName, "\""));
    return Object(api_request["a" /* createRequest */])(_objectSpread({}, CONFIGS[apiName]), delegate);
  }

  return {
    get interceptors() {
      return delegate.interceptors;
    },

    request: request,
    delegate: delegate
  };
}
// EXTERNAL MODULE: ./packages/meetnow/src/config/config.ts + 5 modules
var config_config = __webpack_require__("86c8");

// EXTERNAL MODULE: ./packages/meetnow/src/utils/index.ts
var utils = __webpack_require__("04c9");

// CONCATENATED MODULE: ./packages/meetnow/src/auth/user-api.ts
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return createUserApi; });



function createUserApi(token) {
  var api = createApi({
    baseURL: config_config["a" /* CONFIG */].get('baseurl',  false ? undefined : 'https://meetings.ylyun.com/webapp/'),
    timeout: config_config["a" /* CONFIG */].get('timeout', 0)
  });
  api.interceptors.request.use(function (config) {
    if (token) {
      config.headers = config.headers || {};
      config.headers.token = Object(utils["f" /* isFunction */])(token) ? token() : token;
    }

    return config;
  });
  return api;
}

/***/ }),

/***/ "f6fd":
/***/ (function(module, exports) {

// document.currentScript polyfill by Adam Miller

// MIT license

(function(document){
  var currentScript = "currentScript",
      scripts = document.getElementsByTagName('script'); // Live NodeList collection

  // If browser needs currentScript polyfill, add get currentScript() to the document object
  if (!(currentScript in document)) {
    Object.defineProperty(document, currentScript, {
      get: function(){

        // IE 6-10 supports script readyState
        // IE 10+ support stack trace
        try { throw new Error(); }
        catch (err) {

          // Find the second match for the "at" string to get file src url from stack.
          // Specifically works with the format of stack traces in IE.
          var i, res = ((/.*at [^\(]*\((.*):.+:.+\)$/ig).exec(err.stack) || [false])[1];

          // For all scripts on the page, if src matches or if ready state is interactive, return the script tag
          for(i in scripts){
            if(scripts[i].src == res || scripts[i].readyState == "interactive"){
              return scripts[i];
            }
          }

          // If no match, return null
          return null;
        }
      }
    });
  }
})(document);


/***/ }),

/***/ "f772":
/***/ (function(module, exports, __webpack_require__) {

var shared = __webpack_require__("5692");
var uid = __webpack_require__("90e3");

var keys = shared('keys');

module.exports = function (key) {
  return keys[key] || (keys[key] = uid(key));
};


/***/ }),

/***/ "f8c2":
/***/ (function(module, exports, __webpack_require__) {

var aFunction = __webpack_require__("1c0b");

// optional / simple context binding
module.exports = function (fn, that, length) {
  aFunction(fn);
  if (that === undefined) return fn;
  switch (length) {
    case 0: return function () {
      return fn.call(that);
    };
    case 1: return function (a) {
      return fn.call(that, a);
    };
    case 2: return function (a, b) {
      return fn.call(that, a, b);
    };
    case 3: return function (a, b, c) {
      return fn.call(that, a, b, c);
    };
  }
  return function (/* ...args */) {
    return fn.apply(that, arguments);
  };
};


/***/ }),

/***/ "fae3":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);

// CONCATENATED MODULE: ./node_modules/@vue/cli-service/lib/commands/build/setPublicPath.js
// This file is imported into lib/wc client bundles.

if (typeof window !== 'undefined') {
  if (true) {
    __webpack_require__("f6fd")
  }

  var setPublicPath_i
  if ((setPublicPath_i = window.document.currentScript) && (setPublicPath_i = setPublicPath_i.src.match(/(.+\/)[^/]+\.js(\?.*)?$/))) {
    __webpack_require__.p = setPublicPath_i[1] // eslint-disable-line
  }
}

// Indicate to webpack that this file can be concatenated
/* harmony default export */ var setPublicPath = (null);

// EXTERNAL MODULE: ./node_modules/regenerator-runtime/runtime.js
var runtime = __webpack_require__("96cf");

// EXTERNAL MODULE: ./node_modules/@babel/runtime/helpers/esm/asyncToGenerator.js
var asyncToGenerator = __webpack_require__("1da1");

// EXTERNAL MODULE: ./packages/meetnow/node_modules/debug/src/browser.js
var browser = __webpack_require__("3ded");
var browser_default = /*#__PURE__*/__webpack_require__.n(browser);

// EXTERNAL MODULE: ./node_modules/axios/index.js
var axios = __webpack_require__("bc3a");
var axios_default = /*#__PURE__*/__webpack_require__.n(axios);

// EXTERNAL MODULE: ./node_modules/core-js/modules/es.array.concat.js
var es_array_concat = __webpack_require__("99af");

// EXTERNAL MODULE: ./node_modules/core-js/modules/es.object.to-string.js
var es_object_to_string = __webpack_require__("d3b7");

// EXTERNAL MODULE: ./node_modules/core-js/modules/es.promise.js
var es_promise = __webpack_require__("e6cf");

// EXTERNAL MODULE: ./node_modules/core-js/modules/web.dom-collections.for-each.js
var web_dom_collections_for_each = __webpack_require__("159b");

// EXTERNAL MODULE: ./node_modules/axios/lib/utils.js
var utils = __webpack_require__("c532");
var utils_default = /*#__PURE__*/__webpack_require__.n(utils);

// EXTERNAL MODULE: ./node_modules/axios/lib/core/settle.js
var settle = __webpack_require__("467f");
var settle_default = /*#__PURE__*/__webpack_require__.n(settle);

// EXTERNAL MODULE: ./node_modules/axios/lib/helpers/buildURL.js
var buildURL = __webpack_require__("30b5");
var buildURL_default = /*#__PURE__*/__webpack_require__.n(buildURL);

// EXTERNAL MODULE: ./packages/meetnow/src/adapter/btoa.ts
var btoa = __webpack_require__("3174");

// EXTERNAL MODULE: ./node_modules/core-js/modules/es.symbol.js
var es_symbol = __webpack_require__("a4d3");

// EXTERNAL MODULE: ./node_modules/core-js/modules/es.array.filter.js
var es_array_filter = __webpack_require__("4de4");

// EXTERNAL MODULE: ./node_modules/core-js/modules/es.array.includes.js
var es_array_includes = __webpack_require__("caad");

// EXTERNAL MODULE: ./node_modules/core-js/modules/es.array.index-of.js
var es_array_index_of = __webpack_require__("c975");

// EXTERNAL MODULE: ./node_modules/core-js/modules/es.object.get-own-property-descriptor.js
var es_object_get_own_property_descriptor = __webpack_require__("e439");

// EXTERNAL MODULE: ./node_modules/core-js/modules/es.object.get-own-property-descriptors.js
var es_object_get_own_property_descriptors = __webpack_require__("dbb4");

// EXTERNAL MODULE: ./node_modules/core-js/modules/es.object.keys.js
var es_object_keys = __webpack_require__("b64b");

// EXTERNAL MODULE: ./node_modules/@babel/runtime/helpers/esm/defineProperty.js
var defineProperty = __webpack_require__("ade3");

// EXTERNAL MODULE: ./node_modules/axios/lib/core/createError.js
var createError = __webpack_require__("2d83");
var createError_default = /*#__PURE__*/__webpack_require__.n(createError);

// EXTERNAL MODULE: ./node_modules/@babel/runtime/helpers/esm/typeof.js
var esm_typeof = __webpack_require__("53ca");

// CONCATENATED MODULE: ./packages/meetnow/src/adapter/request-delegate.ts

var PLATFORM;

(function (PLATFORM) {
  PLATFORM[PLATFORM["kUnknown"] = 0] = "kUnknown";
  PLATFORM[PLATFORM["kWechat"] = 1] = "kWechat";
  PLATFORM[PLATFORM["kAlipay"] = 2] = "kAlipay";
  PLATFORM[PLATFORM["kBaidu"] = 3] = "kBaidu";
})(PLATFORM || (PLATFORM = {}));

function getPlatform() {
  switch (true) {
    case (typeof wx === "undefined" ? "undefined" : Object(esm_typeof["a" /* default */])(wx)) === 'object':
      return PLATFORM.kWechat;

    case (typeof swan === "undefined" ? "undefined" : Object(esm_typeof["a" /* default */])(swan)) === 'object':
      return PLATFORM.kBaidu;

    case (typeof my === "undefined" ? "undefined" : Object(esm_typeof["a" /* default */])(my)) === 'object':
      return PLATFORM.kAlipay;

    default:
      return PLATFORM.kUnknown;
  }
}

var platform = getPlatform();
var request_delegate_delegate = platform === PLATFORM.kWechat ? wx.request.bind(wx) : platform === PLATFORM.kAlipay ? (my.request || my.httpRequest).bind(my) : platform === PLATFORM.kBaidu ? swan.request.bind(swan) : undefined;
function createRequestDelegate() {
  var task;
  return {
    send: function send(options) {
      if (!request_delegate_delegate) return;
      task = request_delegate_delegate(options);
    },
    abort: function abort() {
      task && task.abort();
    }
  };
}
// CONCATENATED MODULE: ./packages/meetnow/src/adapter/request.ts










function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { Object(defineProperty["a" /* default */])(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }



function createRequest(config) {
  var timer;
  var timeout;
  var onabort;
  var onerror;
  var ontimeout;
  var onsuccess;
  var delegate = createRequestDelegate();
  return {
    send: function send(options) {
      delegate.send(_objectSpread({}, options, {
        success: function success(response) {
          // normalize data
          var headers = response.header || response.headers;
          var status = response.statusCode || response.status || 200;
          var statusText = status === 200 ? 'OK' : status === 400 ? 'Bad Request' : '';
          onsuccess && onsuccess({
            data: response.data,
            status: status,
            statusText: statusText,
            headers: headers,
            config: config,
            request: options
          });
        },
        fail: function fail(data) {
          var isAbort = false;
          var isTimeout = false; // error or timeout

          switch (platform) {
            case PLATFORM.kWechat:
              if (data.errMsg.indexOf('request:fail abort') !== -1) {
                isAbort = true;
              } else if (data.errMsg.indexOf('timeout') !== -1) {
                isTimeout = true;
              }

              break;

            case PLATFORM.kAlipay:
              // https://docs.alipay.com/mini/api/network
              if ([14, 19].includes(data.error)) {
                isAbort = true;
              } else if ([13].includes(data.error)) {
                isTimeout = true;
              }

              break;

            default:
              break;
          }

          var error = isAbort ? createError_default()('Request aborted', config, 'ECONNABORTED', '') : isTimeout ? createError_default()('Request Timeout', config, 'ECONNABORTED', '') : createError_default()('Network Error', config, null, '');

          if (isAbort) {
            onabort && onabort(error);
          }

          if (isTimeout) {
            ontimeout && ontimeout(error);
          }

          onerror && onerror(error);
        },
        complete: function complete() {
          if (timer) {
            clearTimeout(timer);
            timer = undefined;
          }
        }
      }));

      if (timeout) {
        timer = setTimeout(function () {
          ontimeout && ontimeout(createError_default()("timeout of ".concat(config.timeout || 0, "ms exceeded"), config, 'ECONNABORTED', ''));
          timer = undefined;
        }, timeout);
      }
    },
    abort: function abort() {
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
    }

  };
}
// CONCATENATED MODULE: ./packages/meetnow/src/adapter/index.ts









var isString = function isString(val) {
  return typeof val === 'string';
};
function mpAdapter(config) {
  /* eslint-disable-next-line prefer-arrow-callback */
  return new Promise(function dispatchMpRequest(resolve, reject) {
    var url = config.url,
        data = config.data,
        headers = config.headers,
        method = config.method,
        params = config.params,
        paramsSerializer = config.paramsSerializer,
        responseType = config.responseType,
        timeout = config.timeout,
        cancelToken = config.cancelToken; // HTTP basic authentication

    if (config.auth) {
      var _ref = [config.auth.username || '', config.auth.password || ''],
          username = _ref[0],
          password = _ref[1];
      headers.Authorization = "Basic ".concat(Object(btoa["a" /* default */])("".concat(username, ":").concat(password)));
    } // Add headers to the request


    utils_default.a.forEach(headers, function (val, key) {
      var header = key.toLowerCase();

      if (typeof data === 'undefined' && header === 'content-type' || header === 'referer') {
        delete headers[key];
      }
    });
    var request = createRequest(config);
    var options = {
      url: buildURL_default()(url, params, paramsSerializer),
      header: headers,
      method: method && method.toUpperCase(),
      data: isString(data) ? JSON.parse(data) : data,
      responseType: responseType
    };

    if (cancelToken) {
      // Handle cancellation
      cancelToken.promise.then(function (cancel) {
        if (!request) return;
        request.abort();
        reject(cancel);
        request = null;
      });
    }

    request.timeout = timeout;

    request.onsuccess = function handleLoad(response) {
      settle_default()(resolve, reject, response);
      request = null;
    };

    request.onabort = function handleAbort(error) {
      if (!request) return;
      reject(error);
      request = null;
    };

    request.onerror = function handleError(error) {
      if (!request) return;
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
// EXTERNAL MODULE: ./packages/meetnow/src/browser/index.ts + 1 modules
var src_browser = __webpack_require__("dc99");

// EXTERNAL MODULE: ./packages/meetnow/src/config/index.ts
var src_config = __webpack_require__("8173");

// EXTERNAL MODULE: ./packages/meetnow/src/config/config.ts + 5 modules
var config_config = __webpack_require__("86c8");

// EXTERNAL MODULE: ./packages/meetnow/src/auth/index.ts
var src_auth = __webpack_require__("1235");

// EXTERNAL MODULE: ./packages/meetnow/src/auth/user-api.ts + 12 modules
var user_api = __webpack_require__("f6b8");

// EXTERNAL MODULE: ./node_modules/core-js/modules/es.array.join.js
var es_array_join = __webpack_require__("a15b");

// EXTERNAL MODULE: ./node_modules/core-js/modules/es.regexp.exec.js
var es_regexp_exec = __webpack_require__("ac1f");

// EXTERNAL MODULE: ./node_modules/core-js/modules/es.string.split.js
var es_string_split = __webpack_require__("1276");

// EXTERNAL MODULE: ./packages/meetnow/src/auth/temp-auth.ts
var temp_auth = __webpack_require__("344a");

// EXTERNAL MODULE: ./node_modules/core-js/modules/es.symbol.description.js
var es_symbol_description = __webpack_require__("e01a");

// EXTERNAL MODULE: ./node_modules/core-js/modules/es.string.replace.js
var es_string_replace = __webpack_require__("5319");

// EXTERNAL MODULE: ./node_modules/core-js/modules/es.reflect.get.js
var es_reflect_get = __webpack_require__("5d41");

// CONCATENATED MODULE: ./packages/meetnow/src/conference/context.ts

function createContext(delegate) {
  return new Proxy({}, {
    get: function get(target, key) {
      return key in target ? target[key] : Reflect.get(delegate, key);
    }
  });
} // export function createMessageSender(delegate: any) {
//   return new Proxy({}, {
//     get(target: object, key: string) {
//       return Reflect.get(delegate, hyphenate(key));
//     },
//   }) as Context;
// }
// EXTERNAL MODULE: ./node_modules/core-js/modules/es.symbol.iterator.js
var es_symbol_iterator = __webpack_require__("d28b");

// EXTERNAL MODULE: ./node_modules/core-js/modules/es.array.iterator.js
var es_array_iterator = __webpack_require__("e260");

// EXTERNAL MODULE: ./node_modules/core-js/modules/es.array.splice.js
var es_array_splice = __webpack_require__("a434");

// EXTERNAL MODULE: ./node_modules/core-js/modules/es.string.iterator.js
var es_string_iterator = __webpack_require__("3ca3");

// EXTERNAL MODULE: ./node_modules/core-js/modules/web.dom-collections.iterator.js
var web_dom_collections_iterator = __webpack_require__("ddb0");

// EXTERNAL MODULE: ./packages/meetnow/src/utils/index.ts
var src_utils = __webpack_require__("04c9");

// CONCATENATED MODULE: ./packages/meetnow/src/events/index.ts











var log = browser_default()('MN:Events');
function createEvents() {
  var scopedlog = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : log;
  var instance;
  var events = {};

  function on(event, fn) {
    if (Object(src_utils["d" /* isArray */])(event)) {
      event.forEach(function (ev) {
        return on(ev, fn);
      });
      return instance;
    }

    (events[event] || (events[event] = [])).push(fn);
    return instance;
  }

  function off(event, fn) {
    if (Object(src_utils["d" /* isArray */])(event)) {
      event.forEach(function (e) {
        return off(e, fn);
      });
      return instance;
    }

    var callbacks = events[event];

    if (!callbacks) {
      return instance;
    }

    if (!fn) {
      events[event] = null;
      return instance;
    }

    var callback;
    var index = callbacks.length;

    while (index--) {
      callback = callbacks[index];

      if (callback === fn || callback.fn === fn) {
        callbacks.splice(index, 1);
        break;
      }
    }

    return instance;
  }

  function once(event, fn) {
    function wrapper() {
      off(event, wrapper);

      for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }

      fn.apply(this, args);
    }

    wrapper.fn = fn;
    on(event, wrapper);
    return instance;
  }

  function toArray(list, start) {
    start = start || 0;
    var i = list.length - start;
    var ret = new Array(i);

    while (i--) {
      ret[i] = list[i + start];
    }

    return ret;
  }

  function emit(event) {
    scopedlog("emit() \"".concat(event, "\""));
    var callbacks = events[event];
    if (!callbacks) return instance;
    callbacks = callbacks.length > 1 ? toArray(callbacks) : callbacks;

    for (var _len2 = arguments.length, args = new Array(_len2 > 1 ? _len2 - 1 : 0), _key2 = 1; _key2 < _len2; _key2++) {
      args[_key2 - 1] = arguments[_key2];
    }

    var _iteratorNormalCompletion = true;
    var _didIteratorError = false;
    var _iteratorError = undefined;

    try {
      for (var _iterator = callbacks[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
        var callback = _step.value;

        try {
          callback.apply(void 0, args);
        } catch (error) {
          scopedlog("invoke \"".concat(event, "\" callback failed: %o"), error);
        }
      }
    } catch (err) {
      _didIteratorError = true;
      _iteratorError = err;
    } finally {
      try {
        if (!_iteratorNormalCompletion && _iterator.return != null) {
          _iterator.return();
        }
      } finally {
        if (_didIteratorError) {
          throw _iteratorError;
        }
      }
    }

    return instance;
  }

  return instance = {
    on: on,
    off: off,
    once: once,
    emit: emit
  };
}
// EXTERNAL MODULE: ./packages/meetnow/src/api/request.ts
var api_request = __webpack_require__("65ae");

// EXTERNAL MODULE: ./packages/meetnow/src/utils/worker.ts
var utils_worker = __webpack_require__("2c1a");

// CONCATENATED MODULE: ./packages/meetnow/src/conference/keepalive.ts










function keepalive_ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function keepalive_objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { keepalive_ownKeys(Object(source), true).forEach(function (key) { Object(defineProperty["a" /* default */])(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { keepalive_ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }




var keepalive_log = browser_default()('MN:Keepalive');
var DEFAULT_INTERVAL = 30 * 1000;
var MIN_INTERVAL = 2;
var MAX_INTERVAL = 30;
var MAX_ATTEMPTS = 15;

function computeTimeout(upperBound) {
  var lowerBound = upperBound * 0.8;
  return 1000 * (Math.random() * (upperBound - lowerBound) + lowerBound);
}

function computeNextTimeout(attempts) {
  keepalive_log("computeNextTimeout() attempts: ".concat(attempts));
  /* eslint-disable-next-line no-restricted-properties */

  var k = Math.floor(Math.random() * Math.pow(2, attempts) + 1);

  if (k < MIN_INTERVAL) {
    k = MIN_INTERVAL;
  }

  if (k > MAX_INTERVAL) {
    k = MAX_INTERVAL;
  }

  return k * 1000;
}

function createKeepAlive(config) {
  var api = config.api;
  var request;
  var canceled = false;

  var _interval = config.interval || DEFAULT_INTERVAL;

  var attempts = 0;

  function keepalive() {
    return _keepalive.apply(this, arguments);
  }

  function _keepalive() {
    _keepalive = Object(asyncToGenerator["a" /* default */])(
    /*#__PURE__*/
    regeneratorRuntime.mark(function _callee() {
      var response, error, _response$data, bizCode, _response$data$data, data, expectedInterval;

      return regeneratorRuntime.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              keepalive_log('keepalive()');
              _context.prev = 1;
              canceled = false;
              request = api.request('keepalive');
              _context.next = 6;
              return request.send();

            case 6:
              response = _context.sent;
              _context.next = 19;
              break;

            case 9:
              _context.prev = 9;
              _context.t0 = _context["catch"](1);
              error = _context.t0;
              canceled = Object(api_request["b" /* isCancel */])(_context.t0);

              if (!canceled) {
                _context.next = 15;
                break;
              }

              return _context.abrupt("return");

            case 15:
              // if request failed by network or server error,
              // increase next request timeout
              attempts++;
              _interval = computeNextTimeout(attempts);
              keepalive_log('keepalive error: %o', error);
              config.onError && config.onError(error, attempts);

            case 19:
              if (attempts > MAX_ATTEMPTS) {
                config.onError && config.onError(new Error('Max Attempts'), attempts);
              }

              if (!error) {
                _context.next = 22;
                break;
              }

              return _context.abrupt("return");

            case 22:
              _response$data = response.data, bizCode = _response$data.bizCode, _response$data$data = _response$data.data, data = _response$data$data === void 0 ? {
                interval: _interval
              } : _response$data$data;
              expectedInterval = data.interval; // TODO
              // check bizCode

              _interval = Math.min(expectedInterval * 1000, _interval);

            case 25:
            case "end":
              return _context.stop();
          }
        }
      }, _callee, null, [[1, 9]]);
    }));
    return _keepalive.apply(this, arguments);
  }

  var worker = Object(utils_worker["a" /* createWorker */])({
    work: function work() {
      return keepalive();
    },
    interval: function interval() {
      return _interval;
    },
    cancel: function cancel() {
      return request.cancel();
    }
  });
  return keepalive_objectSpread({}, worker, {
    keepalive: keepalive
  });
}
// CONCATENATED MODULE: ./packages/meetnow/src/conference/polling.ts












function polling_ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function polling_objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { polling_ownKeys(Object(source), true).forEach(function (key) { Object(defineProperty["a" /* default */])(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { polling_ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }





var polling_log = browser_default()('MN:Polling');
var polling_DEFAULT_INTERVAL = 100;
var polling_MIN_INTERVAL = 2;
var polling_MAX_INTERVAL = 30;
var polling_MAX_ATTEMPTS = 5;

function polling_computeTimeout(upperBound) {
  var lowerBound = upperBound * 0.8;
  return 1000 * (Math.random() * (upperBound - lowerBound) + lowerBound);
}

function polling_computeNextTimeout(attempts) {
  polling_log("computeNextTimeout() attempts: ".concat(attempts));
  /* eslint-disable-next-line no-restricted-properties */

  var k = Math.floor(Math.random() * Math.pow(2, attempts) + 1);

  if (k < polling_MIN_INTERVAL) {
    k = polling_MIN_INTERVAL;
  }

  if (k > polling_MAX_INTERVAL) {
    k = polling_MAX_INTERVAL;
  }

  return k * 1000;
}

function createPolling(config) {
  var api = config.api;
  var request;
  var _interval = polling_DEFAULT_INTERVAL;
  var attempts = 0;
  var version = 0;

  function analyze(data) {
    if (!data) return;
    var newVersion = data.version,
        category = data.category,
        body = data.body;

    if (!Object(src_utils["e" /* isDef */])(newVersion) || newVersion <= version) {
      polling_log("illegal version: ".concat(newVersion, ", current version: ").concat(version, "."));
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
        polling_log("unsupported category: ".concat(category));
        break;
    }

    version = newVersion;
  }

  function poll() {
    return _poll.apply(this, arguments);
  }

  function _poll() {
    _poll = Object(asyncToGenerator["a" /* default */])(
    /*#__PURE__*/
    regeneratorRuntime.mark(function _callee() {
      var response, error, canceled, timeouted, _response$data, bizCode, data;

      return regeneratorRuntime.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              polling_log('poll()');
              canceled = false;
              timeouted = false;
              _context.prev = 3;
              request = api.request('polling').data({
                version: version
              });
              _context.next = 7;
              return request.send();

            case 7:
              response = _context.sent;
              _context.next = 23;
              break;

            case 10:
              _context.prev = 10;
              _context.t0 = _context["catch"](3);
              error = _context.t0;
              canceled = Object(api_request["b" /* isCancel */])(_context.t0);

              if (!canceled) {
                _context.next = 16;
                break;
              }

              return _context.abrupt("return");

            case 16:
              // polling timeout
              timeouted = !!error && [900408, 901323].includes(error.bizCode);

              if (!timeouted) {
                _context.next = 19;
                break;
              }

              return _context.abrupt("return");

            case 19:
              // if request failed by network or server error,
              // increase next polling timeout
              attempts++;
              _interval = polling_computeNextTimeout(attempts);
              polling_log('polling error: %o', error);
              config.onError && config.onError(error, attempts);

            case 23:
              if (attempts > polling_MAX_ATTEMPTS) {
                config.onError && config.onError(new Error('Max Attempts'), attempts);
              }

              if (!error) {
                _context.next = 26;
                break;
              }

              return _context.abrupt("return");

            case 26:
              _response$data = response.data, bizCode = _response$data.bizCode, data = _response$data.data; // TODO
              // check bizCode

              try {
                analyze(data);
              } catch (error) {
                polling_log('process data failed. %o', error);
              }

              attempts = 0;

            case 29:
            case "end":
              return _context.stop();
          }
        }
      }, _callee, null, [[3, 10]]);
    }));
    return _poll.apply(this, arguments);
  }

  var worker = Object(utils_worker["a" /* createWorker */])({
    work: function work() {
      return poll();
    },
    interval: function interval() {
      return _interval;
    },
    cancel: function cancel() {
      return request.cancel();
    }
  });
  return polling_objectSpread({}, worker, {
    poll: poll,
    analyze: analyze
  });
}
// EXTERNAL MODULE: ./node_modules/core-js/modules/es.object.assign.js
var es_object_assign = __webpack_require__("cca6");

// EXTERNAL MODULE: ./node_modules/core-js/modules/es.reflect.set.js
var es_reflect_set = __webpack_require__("7ed3");

// CONCATENATED MODULE: ./packages/meetnow/src/reactive/index.ts




var reactive_log = browser_default()('MN:Reactive');
function createReactive(data, events) {
  events = events || createEvents(reactive_log);
  return new Proxy(data, {
    set: function set(target, prop, value, receiver) {
      var oldValue = target[prop];
      var hadKey = Object(src_utils["c" /* hasOwn */])(target, prop);
      var result = Reflect.set(target, prop, value, receiver);

      if (!hadKey) {
        events.emit("".concat(Object(src_utils["a" /* camelize */])(prop), "Added"), value);
      }

      if (Object(src_utils["b" /* hasChanged */])(value, oldValue)) {
        events.emit("".concat(Object(src_utils["a" /* camelize */])(prop), "Changed"), value, oldValue);
      }

      return result;
    }
  });
}
// CONCATENATED MODULE: ./packages/meetnow/src/conference/description.ts










function description_ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function description_objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { description_ownKeys(Object(source), true).forEach(function (key) { Object(defineProperty["a" /* default */])(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { description_ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }






var description_log = browser_default()('MN:Information:Description');
function createDescription(data, context) {
  var api = context.api;
  var events = createEvents(description_log);
  /* eslint-disable-next-line no-use-before-define */

  var reactive = createReactive(watch({}), events);
  var description;

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
      attendeeByPass: data['attendee-by-pass']
    };
  }

  function setLock(_x) {
    return _setLock.apply(this, arguments);
  }

  function _setLock() {
    _setLock = Object(asyncToGenerator["a" /* default */])(
    /*#__PURE__*/
    regeneratorRuntime.mark(function _callee(options) {
      var admissionPolicy, _options$attendeeByPa, attendeeByPass;

      return regeneratorRuntime.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              description_log('setLock()');
              admissionPolicy = options.admissionPolicy, _options$attendeeByPa = options.attendeeByPass, attendeeByPass = _options$attendeeByPa === void 0 ? true : _options$attendeeByPa;
              _context.next = 4;
              return api.request('setLock').data({
                'admission-policy': admissionPolicy,
                'attendee-lobby-bypass': attendeeByPass
              }).send();

            case 4:
            case "end":
              return _context.stop();
          }
        }
      }, _callee);
    }));
    return _setLock.apply(this, arguments);
  }

  function lock() {
    return _lock.apply(this, arguments);
  }

  function _lock() {
    _lock = Object(asyncToGenerator["a" /* default */])(
    /*#__PURE__*/
    regeneratorRuntime.mark(function _callee2() {
      var attendeeByPass,
          presenterOnly,
          _args2 = arguments;
      return regeneratorRuntime.wrap(function _callee2$(_context2) {
        while (1) {
          switch (_context2.prev = _context2.next) {
            case 0:
              attendeeByPass = _args2.length > 0 && _args2[0] !== undefined ? _args2[0] : false;
              presenterOnly = _args2.length > 1 && _args2[1] !== undefined ? _args2[1] : true;
              description_log('lock()');
              _context2.next = 5;
              return setLock({
                admissionPolicy: presenterOnly ? 'closedAuthenticated' : 'openAuthenticated',
                attendeeByPass: attendeeByPass
              });

            case 5:
            case "end":
              return _context2.stop();
          }
        }
      }, _callee2);
    }));
    return _lock.apply(this, arguments);
  }

  function unlock() {
    return _unlock.apply(this, arguments);
  }

  function _unlock() {
    _unlock = Object(asyncToGenerator["a" /* default */])(
    /*#__PURE__*/
    regeneratorRuntime.mark(function _callee3() {
      return regeneratorRuntime.wrap(function _callee3$(_context3) {
        while (1) {
          switch (_context3.prev = _context3.next) {
            case 0:
              description_log('unlock()');
              _context3.next = 3;
              return setLock({
                admissionPolicy: 'anonymous'
              });

            case 3:
            case "end":
              return _context3.stop();
          }
        }
      }, _callee3);
    }));
    return _unlock.apply(this, arguments);
  }

  function isLocked() {
    return getLock().admissionPolicy !== 'anonymous';
  }

  return description = description_objectSpread({}, events, {
    get data() {
      return data;
    },

    get subject() {
      return data.subject;
    },

    get: function get(key) {
      return data[key];
    },
    update: update,
    getLock: getLock,
    setLock: setLock,
    lock: lock,
    unlock: unlock,
    isLocked: isLocked
  });
}
// CONCATENATED MODULE: ./packages/meetnow/src/conference/state.ts








function state_ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function state_objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { state_ownKeys(Object(source), true).forEach(function (key) { Object(defineProperty["a" /* default */])(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { state_ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }






var state_log = browser_default()('MN:Information:State');
function createState(data, context) {
  var events = createEvents(state_log);
  /* eslint-disable-next-line no-use-before-define */

  var reactive = createReactive(watch({}), events);
  var description;

  function watch(target) {
    var active = data.active,
        locked = data.locked;
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
    var applicationsharer = data.applicationsharer;
    return applicationsharer.user && applicationsharer.user.entity;
  }

  function getSpeechUserEntity() {
    var speechUserEntity = data['speech-user-entity'];
    return speechUserEntity;
  }

  function getSharingType() {
    var applicationsharer = data.applicationsharer;
    return applicationsharer.user && applicationsharer.user['share-type'];
  }

  return description = state_objectSpread({}, events, {
    get data() {
      return data;
    },

    get: function get(key) {
      return data[key];
    },
    update: update,
    getSharingUserEntity: getSharingUserEntity,
    getSpeechUserEntity: getSpeechUserEntity,
    getSharingType: getSharingType
  });
}
// EXTERNAL MODULE: ./node_modules/core-js/modules/es.array.find.js
var es_array_find = __webpack_require__("7db0");

// EXTERNAL MODULE: ./node_modules/core-js/modules/es.function.name.js
var es_function_name = __webpack_require__("b0c0");

// CONCATENATED MODULE: ./packages/meetnow/src/conference/layout-ctrl.ts




var layout_ctrl_log = browser_default()('MN:Information:Layout');
function createLayoutCtrl(api) {
  function setLayout(_x) {
    return _setLayout.apply(this, arguments);
  }

  function _setLayout() {
    _setLayout = Object(asyncToGenerator["a" /* default */])(
    /*#__PURE__*/
    regeneratorRuntime.mark(function _callee(options) {
      return regeneratorRuntime.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              layout_ctrl_log('setLayout()');
              _context.next = 3;
              return api.request('setFreeLayout').data(options).send();

            case 3:
            case "end":
              return _context.stop();
          }
        }
      }, _callee);
    }));
    return _setLayout.apply(this, arguments);
  }

  function setCustomizeLayout(_x2) {
    return _setCustomizeLayout.apply(this, arguments);
  }

  function _setCustomizeLayout() {
    _setCustomizeLayout = Object(asyncToGenerator["a" /* default */])(
    /*#__PURE__*/
    regeneratorRuntime.mark(function _callee2(options) {
      return regeneratorRuntime.wrap(function _callee2$(_context2) {
        while (1) {
          switch (_context2.prev = _context2.next) {
            case 0:
              layout_ctrl_log('setCustomizeLayout()');
              options.viewer = options.viewer || 'attendee';
              _context2.next = 4;
              return api.request('setCustomizeLayout').data(options).send();

            case 4:
            case "end":
              return _context2.stop();
          }
        }
      }, _callee2);
    }));
    return _setCustomizeLayout.apply(this, arguments);
  }

  function setPresenterLayout(_x3) {
    return _setPresenterLayout.apply(this, arguments);
  }

  function _setPresenterLayout() {
    _setPresenterLayout = Object(asyncToGenerator["a" /* default */])(
    /*#__PURE__*/
    regeneratorRuntime.mark(function _callee3(options) {
      return regeneratorRuntime.wrap(function _callee3$(_context3) {
        while (1) {
          switch (_context3.prev = _context3.next) {
            case 0:
              layout_ctrl_log('setPresenterLayout()');
              options.viewer = 'presenter';
              _context3.next = 4;
              return setCustomizeLayout(options);

            case 4:
            case "end":
              return _context3.stop();
          }
        }
      }, _callee3);
    }));
    return _setPresenterLayout.apply(this, arguments);
  }

  function setAttendeeLayout(_x4) {
    return _setAttendeeLayout.apply(this, arguments);
  }

  function _setAttendeeLayout() {
    _setAttendeeLayout = Object(asyncToGenerator["a" /* default */])(
    /*#__PURE__*/
    regeneratorRuntime.mark(function _callee4(options) {
      return regeneratorRuntime.wrap(function _callee4$(_context4) {
        while (1) {
          switch (_context4.prev = _context4.next) {
            case 0:
              layout_ctrl_log('setAttendeeLayout()');
              options.viewer = 'attendee';
              _context4.next = 4;
              return setCustomizeLayout(options);

            case 4:
            case "end":
              return _context4.stop();
          }
        }
      }, _callee4);
    }));
    return _setAttendeeLayout.apply(this, arguments);
  }

  function setCastViewerLayout(_x5) {
    return _setCastViewerLayout.apply(this, arguments);
  }

  function _setCastViewerLayout() {
    _setCastViewerLayout = Object(asyncToGenerator["a" /* default */])(
    /*#__PURE__*/
    regeneratorRuntime.mark(function _callee5(options) {
      return regeneratorRuntime.wrap(function _callee5$(_context5) {
        while (1) {
          switch (_context5.prev = _context5.next) {
            case 0:
              layout_ctrl_log('setCastViewerLayout()');
              options.viewer = 'castviewer';
              _context5.next = 4;
              return setCustomizeLayout(options);

            case 4:
            case "end":
              return _context5.stop();
          }
        }
      }, _callee5);
    }));
    return _setCastViewerLayout.apply(this, arguments);
  }

  function setOSD() {
    return _setOSD.apply(this, arguments);
  }

  function _setOSD() {
    _setOSD = Object(asyncToGenerator["a" /* default */])(
    /*#__PURE__*/
    regeneratorRuntime.mark(function _callee6() {
      var options,
          name,
          icon,
          _args6 = arguments;
      return regeneratorRuntime.wrap(function _callee6$(_context6) {
        while (1) {
          switch (_context6.prev = _context6.next) {
            case 0:
              options = _args6.length > 0 && _args6[0] !== undefined ? _args6[0] : {
                name: true,
                icon: true
              };
              layout_ctrl_log('setOSD()');
              name = options.name, icon = options.icon;
              _context6.next = 5;
              return api.request('setGlobalLayout').data({
                'hide-osd-site-icon': icon,
                'hide-osd-site-name': name
              }).send();

            case 5:
            case "end":
              return _context6.stop();
          }
        }
      }, _callee6);
    }));
    return _setOSD.apply(this, arguments);
  }

  function setSpeakMode(_x6) {
    return _setSpeakMode.apply(this, arguments);
  }

  function _setSpeakMode() {
    _setSpeakMode = Object(asyncToGenerator["a" /* default */])(
    /*#__PURE__*/
    regeneratorRuntime.mark(function _callee7(mode) {
      return regeneratorRuntime.wrap(function _callee7$(_context7) {
        while (1) {
          switch (_context7.prev = _context7.next) {
            case 0:
              layout_ctrl_log('setSpeakMode()');
              _context7.next = 3;
              return api.request('setSpeakMode').data({
                'speak-mode': mode
              }).send();

            case 3:
            case "end":
              return _context7.stop();
          }
        }
      }, _callee7);
    }));
    return _setSpeakMode.apply(this, arguments);
  }

  return {
    setLayout: setLayout,
    setCustomizeLayout: setCustomizeLayout,
    setPresenterLayout: setPresenterLayout,
    setAttendeeLayout: setAttendeeLayout,
    setCastViewerLayout: setCastViewerLayout,
    setOSD: setOSD,
    setSpeakMode: setSpeakMode
  };
}
// CONCATENATED MODULE: ./packages/meetnow/src/conference/danmaku-ctrl.ts










function danmaku_ctrl_ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function danmaku_ctrl_objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { danmaku_ctrl_ownKeys(Object(source), true).forEach(function (key) { Object(defineProperty["a" /* default */])(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { danmaku_ctrl_ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }


var danmaku_ctrl_log = browser_default()('MN:Information:Danmaku');
var DANMAKU_CONFIGS = {
  position: 'top',
  type: 'static',
  displayTime: 30,
  repeatCount: 2,
  repeatInterval: 5,
  rollDirection: 'R2L'
};
function createDanmakuCtrl(api) {
  var lastConfig = DANMAKU_CONFIGS;

  function setDanmaku(_x) {
    return _setDanmaku.apply(this, arguments);
  }

  function _setDanmaku() {
    _setDanmaku = Object(asyncToGenerator["a" /* default */])(
    /*#__PURE__*/
    regeneratorRuntime.mark(function _callee(config) {
      var finalConfig, type, position, displayTime, repeatCount, repeatInterval, rollDirection;
      return regeneratorRuntime.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              danmaku_ctrl_log('setDanmaku()');
              finalConfig = danmaku_ctrl_objectSpread({}, lastConfig, {
                config: config
              });
              type = finalConfig.type, position = finalConfig.position, displayTime = finalConfig.displayTime, repeatCount = finalConfig.repeatCount, repeatInterval = finalConfig.repeatInterval, rollDirection = finalConfig.rollDirection;
              _context.next = 5;
              return api.request('setTitle').data({
                type: type,
                position: position,
                'display-time': displayTime,
                'repeat-count': repeatCount,
                'repeat-interval': repeatInterval,
                'roll-direction': rollDirection
              }).send();

            case 5:
              lastConfig = finalConfig;

            case 6:
            case "end":
              return _context.stop();
          }
        }
      }, _callee);
    }));
    return _setDanmaku.apply(this, arguments);
  }

  function sendDanmaku(_x2, _x3) {
    return _sendDanmaku.apply(this, arguments);
  }

  function _sendDanmaku() {
    _sendDanmaku = Object(asyncToGenerator["a" /* default */])(
    /*#__PURE__*/
    regeneratorRuntime.mark(function _callee2(msg, options) {
      var _ref, _ref$attendee, attendee, _ref$castviewer, castviewer, _ref$presenter, presenter;

      return regeneratorRuntime.wrap(function _callee2$(_context2) {
        while (1) {
          switch (_context2.prev = _context2.next) {
            case 0:
              danmaku_ctrl_log('sendDanmaku()');
              _ref = options || {}, _ref$attendee = _ref.attendee, attendee = _ref$attendee === void 0 ? true : _ref$attendee, _ref$castviewer = _ref.castviewer, castviewer = _ref$castviewer === void 0 ? true : _ref$castviewer, _ref$presenter = _ref.presenter, presenter = _ref$presenter === void 0 ? true : _ref$presenter;
              _context2.next = 4;
              return api.request('sendTitle').data({
                'display-text': msg,
                'all-attendee': attendee,
                'all-castviewer': castviewer,
                'all-presenter': presenter
              });

            case 4:
            case "end":
              return _context2.stop();
          }
        }
      }, _callee2);
    }));
    return _sendDanmaku.apply(this, arguments);
  }

  return {
    setDanmaku: setDanmaku,
    sendDanmaku: sendDanmaku
  };
}
// CONCATENATED MODULE: ./packages/meetnow/src/conference/view.ts









function view_ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function view_objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { view_ownKeys(Object(source), true).forEach(function (key) { Object(defineProperty["a" /* default */])(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { view_ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }








var view_log = browser_default()('MN:Information:View');
function createView(data, context) {
  var api = context.api;
  var events = createEvents(view_log);
  /* eslint-disable-next-line no-use-before-define */

  var reactive = createReactive(watch({}), events);
  var layout = createLayoutCtrl(api);
  var danmaku = createDanmakuCtrl(api);
  var view;

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
    return data['entity-view'].find(function (view) {
      return view.entity === 'audio-video';
    });
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

  return view = view_objectSpread({}, events, {
    get data() {
      return data;
    },

    get: function get(key) {
      return data[key];
    }
  }, layout, {}, danmaku, {
    update: update,
    getVideoView: getVideoView,
    getLayout: getLayout,
    getFocusUserEntity: getFocusUserEntity,
    getDanmaku: getDanmaku
  });
}
// EXTERNAL MODULE: ./node_modules/core-js/modules/es.array.map.js
var es_array_map = __webpack_require__("d81d");

// EXTERNAL MODULE: ./node_modules/core-js/modules/es.map.js
var es_map = __webpack_require__("4ec9");

// CONCATENATED MODULE: ./packages/meetnow/src/conference/camera-ctrl.ts



var camera_ctrl_log = browser_default()('MN:Information:Camera');
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
  function action(_x) {
    return _action.apply(this, arguments);
  }

  function _action() {
    _action = Object(asyncToGenerator["a" /* default */])(
    /*#__PURE__*/
    regeneratorRuntime.mark(function _callee(type) {
      return regeneratorRuntime.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              camera_ctrl_log('action()');
              _context.next = 3;
              return api.request('setFecc').data({
                'user-entity': entity,
                action: type
              }).send();

            case 3:
            case "end":
              return _context.stop();
          }
        }
      }, _callee);
    }));
    return _action.apply(this, arguments);
  }

  function left() {
    camera_ctrl_log('left()');
    return action(ActionTypes.LEFT);
  }

  function right() {
    camera_ctrl_log('right()');
    return action(ActionTypes.RIGHT);
  }

  function down() {
    camera_ctrl_log('down()');
    return action(ActionTypes.DOWN);
  }

  function up() {
    camera_ctrl_log('up()');
    return action(ActionTypes.UP);
  }

  function zoomout() {
    camera_ctrl_log('zoomout()');
    return action(ActionTypes.ZOOMOUT);
  }

  function zoomin() {
    camera_ctrl_log('zoomin()');
    return action(ActionTypes.ZOOMIN);
  }

  function focusout() {
    camera_ctrl_log('focusout()');
    return action(ActionTypes.FOCUSOUT);
  }

  function focusin() {
    camera_ctrl_log('focusin()');
    return action(ActionTypes.FOCUSIN);
  }

  return {
    action: action,
    left: left,
    right: right,
    down: down,
    up: up,
    zoomout: zoomout,
    zoomin: zoomin,
    focusout: focusout,
    focusin: focusin
  };
}
// CONCATENATED MODULE: ./packages/meetnow/src/conference/user.ts












function user_ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function user_objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { user_ownKeys(Object(source), true).forEach(function (key) { Object(defineProperty["a" /* default */])(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { user_ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }







var user_log = browser_default()('MN:Information:User');
function createUser(data, context) {
  var api = context.api,
      userId = context.userId;
  var events = createEvents(user_log);
  /* eslint-disable-next-line no-use-before-define */

  var reactive = createReactive(watch({}), events);
  /* eslint-disable-next-line no-use-before-define */

  var entity = getEntity();
  var camera = createCameraCtrl(api, entity);
  var user;

  function watch(target) {
    /* eslint-disable no-use-before-define */
    target.displayText = data['display-text'];
    target.role = getRole();
    target.hold = isOnHold();
    target.audio = !isAudioBlocked();
    target.video = !isVideoBlocked();
    target.handup = isHandup();
    target.media = hasMedia();
    target.sharing = isSharing();
    /* eslint-enable no-use-before-define */

    return target;
  }

  function update(diff) {
    if (diff && (diff.state === 'full' || !data)) {
      data = diff;
    } // fire status change events


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
    return data.endpoint.find(function (ep) {
      return ep['session-type'] === type;
    });
  }

  function isOnHold() {
    var endpoint = getEndpoint('audio-video');
    return !!endpoint && endpoint.status === 'on-hold';
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
    var mediaList = data.endpoint.reduce(function (previous, current) {
      return previous.concat(current.media || []);
    }, []);
    return mediaList.find(function (m) {
      return m.label === label;
    });
  }

  function getMediaFilter(label) {
    var media = getMedia(label);

    var _ref = media || {},
        _ref$mediaIngressFi = _ref['media-ingress-filter'],
        ingress = _ref$mediaIngressFi === void 0 ? {
      type: 'block'
    } : _ref$mediaIngressFi,
        _ref$mediaEgressFil = _ref['media-egress-filter'],
        egress = _ref$mediaEgressFil === void 0 ? {
      type: 'block'
    } : _ref$mediaEgressFil;

    return {
      ingress: ingress.type,
      egress: egress.type
    };
  }

  function getAudioFilter() {
    return getMediaFilter('main-audio');
  }

  function getVideoFilter() {
    return getMediaFilter('main-video');
  }

  function isAudioBlocked() {
    var _getAudioFilter = getAudioFilter(),
        ingress = _getAudioFilter.ingress;

    return ingress === 'block';
  }

  function isVideoBlocked() {
    var _getVideoFilter = getVideoFilter(),
        ingress = _getVideoFilter.ingress;

    return ingress === 'block';
  }

  function isHandup() {
    var _getAudioFilter2 = getAudioFilter(),
        ingress = _getAudioFilter2.ingress;

    return ingress === 'unblocking';
  }

  function isSharing() {
    var media = getMedia('applicationsharing');
    return !!media && media.status === 'sendonly';
  }

  function isSIP() {
    return data.protocol.toLowerCase() === 'sip';
  }

  function isHTTP() {
    return data.protocol.toLowerCase() === 'http';
  }

  function isRTMP() {
    return data.protocol.toLowerCase() === 'rtmp';
  } // user ctrl


  function setFilter(_x) {
    return _setFilter.apply(this, arguments);
  }

  function _setFilter() {
    _setFilter = Object(asyncToGenerator["a" /* default */])(
    /*#__PURE__*/
    regeneratorRuntime.mark(function _callee(options) {
      var label, enable, endpoint, media;
      return regeneratorRuntime.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              user_log('setFilter()');
              label = options.label, enable = options.enable;
              endpoint = user.getEndpoint('audio-video');
              media = user.getMedia(label);
              _context.next = 6;
              return api.request('setUserMedia').data({
                'user-entity': entity,
                'endpoint-entity': endpoint.entity,
                'media-id': media.id,
                'media-ingress-filter': enable ? 'unblock' : 'block'
              }).send();

            case 6:
            case "end":
              return _context.stop();
          }
        }
      }, _callee);
    }));
    return _setFilter.apply(this, arguments);
  }

  function setAudioFilter(_x2) {
    return _setAudioFilter.apply(this, arguments);
  }

  function _setAudioFilter() {
    _setAudioFilter = Object(asyncToGenerator["a" /* default */])(
    /*#__PURE__*/
    regeneratorRuntime.mark(function _callee2(enable) {
      return regeneratorRuntime.wrap(function _callee2$(_context2) {
        while (1) {
          switch (_context2.prev = _context2.next) {
            case 0:
              user_log('setAudioFilter()');
              _context2.next = 3;
              return setFilter({
                label: 'main-audio',
                enable: enable
              });

            case 3:
            case "end":
              return _context2.stop();
          }
        }
      }, _callee2);
    }));
    return _setAudioFilter.apply(this, arguments);
  }

  function setVideoFilter(_x3) {
    return _setVideoFilter.apply(this, arguments);
  }

  function _setVideoFilter() {
    _setVideoFilter = Object(asyncToGenerator["a" /* default */])(
    /*#__PURE__*/
    regeneratorRuntime.mark(function _callee3(enable) {
      return regeneratorRuntime.wrap(function _callee3$(_context3) {
        while (1) {
          switch (_context3.prev = _context3.next) {
            case 0:
              user_log('setVideoFilter()');
              _context3.next = 3;
              return setFilter({
                label: 'main-video',
                enable: enable
              });

            case 3:
            case "end":
              return _context3.stop();
          }
        }
      }, _callee3);
    }));
    return _setVideoFilter.apply(this, arguments);
  }

  function setDisplayText(_x4) {
    return _setDisplayText.apply(this, arguments);
  }

  function _setDisplayText() {
    _setDisplayText = Object(asyncToGenerator["a" /* default */])(
    /*#__PURE__*/
    regeneratorRuntime.mark(function _callee4(displayText) {
      return regeneratorRuntime.wrap(function _callee4$(_context4) {
        while (1) {
          switch (_context4.prev = _context4.next) {
            case 0:
              user_log('setDisplayText()');
              _context4.next = 3;
              return api.request('setUserDisplayText').data({
                'user-entity': entity,
                'display-text': displayText
              }).send();

            case 3:
            case "end":
              return _context4.stop();
          }
        }
      }, _callee4);
    }));
    return _setDisplayText.apply(this, arguments);
  }

  function setRole(_x5) {
    return _setRole.apply(this, arguments);
  }

  function _setRole() {
    _setRole = Object(asyncToGenerator["a" /* default */])(
    /*#__PURE__*/
    regeneratorRuntime.mark(function _callee5(role) {
      return regeneratorRuntime.wrap(function _callee5$(_context5) {
        while (1) {
          switch (_context5.prev = _context5.next) {
            case 0:
              user_log('setRole()');
              _context5.next = 3;
              return api.request('setUserRole').data({
                'user-entity': entity,
                role: role
              }).send();

            case 3:
            case "end":
              return _context5.stop();
          }
        }
      }, _callee5);
    }));
    return _setRole.apply(this, arguments);
  }

  function setFocus() {
    return _setFocus.apply(this, arguments);
  }

  function _setFocus() {
    _setFocus = Object(asyncToGenerator["a" /* default */])(
    /*#__PURE__*/
    regeneratorRuntime.mark(function _callee6() {
      var enable,
          _args6 = arguments;
      return regeneratorRuntime.wrap(function _callee6$(_context6) {
        while (1) {
          switch (_context6.prev = _context6.next) {
            case 0:
              enable = _args6.length > 0 && _args6[0] !== undefined ? _args6[0] : true;
              user_log('setFocus()');
              _context6.next = 4;
              return api.request('setFocusVideo').data({
                'user-entity': enable ? entity : ''
              }).send();

            case 4:
            case "end":
              return _context6.stop();
          }
        }
      }, _callee6);
    }));
    return _setFocus.apply(this, arguments);
  }

  function getStats() {
    return _getStats.apply(this, arguments);
  }

  function _getStats() {
    _getStats = Object(asyncToGenerator["a" /* default */])(
    /*#__PURE__*/
    regeneratorRuntime.mark(function _callee7() {
      return regeneratorRuntime.wrap(function _callee7$(_context7) {
        while (1) {
          switch (_context7.prev = _context7.next) {
            case 0:
              user_log('getStats()');
              _context7.next = 3;
              return api.request('getStats').data({
                'user-entity-list': [entity]
              }).send();

            case 3:
            case "end":
              return _context7.stop();
          }
        }
      }, _callee7);
    }));
    return _getStats.apply(this, arguments);
  }

  function kick() {
    return _kick.apply(this, arguments);
  }

  function _kick() {
    _kick = Object(asyncToGenerator["a" /* default */])(
    /*#__PURE__*/
    regeneratorRuntime.mark(function _callee8() {
      return regeneratorRuntime.wrap(function _callee8$(_context8) {
        while (1) {
          switch (_context8.prev = _context8.next) {
            case 0:
              user_log('kick()');
              _context8.next = 3;
              return api.request('deleteUser').data({
                'user-entity': entity
              }).send();

            case 3:
            case "end":
              return _context8.stop();
          }
        }
      }, _callee8);
    }));
    return _kick.apply(this, arguments);
  }

  function hold() {
    return _hold.apply(this, arguments);
  }

  function _hold() {
    _hold = Object(asyncToGenerator["a" /* default */])(
    /*#__PURE__*/
    regeneratorRuntime.mark(function _callee9() {
      return regeneratorRuntime.wrap(function _callee9$(_context9) {
        while (1) {
          switch (_context9.prev = _context9.next) {
            case 0:
              user_log('hold()');
              _context9.next = 3;
              return api.request('waitLobbyUser').data({
                'user-entity': entity
              }).send();

            case 3:
            case "end":
              return _context9.stop();
          }
        }
      }, _callee9);
    }));
    return _hold.apply(this, arguments);
  }

  function unhold() {
    return _unhold.apply(this, arguments);
  }

  function _unhold() {
    _unhold = Object(asyncToGenerator["a" /* default */])(
    /*#__PURE__*/
    regeneratorRuntime.mark(function _callee10() {
      return regeneratorRuntime.wrap(function _callee10$(_context10) {
        while (1) {
          switch (_context10.prev = _context10.next) {
            case 0:
              user_log('unhold()');
              _context10.next = 3;
              return api.request('acceptLobbyUser').data({
                'user-entity': entity
              }).send();

            case 3:
            case "end":
              return _context10.stop();
          }
        }
      }, _callee10);
    }));
    return _unhold.apply(this, arguments);
  }

  function allow() {
    return _allow.apply(this, arguments);
  }

  function _allow() {
    _allow = Object(asyncToGenerator["a" /* default */])(
    /*#__PURE__*/
    regeneratorRuntime.mark(function _callee11() {
      return regeneratorRuntime.wrap(function _callee11$(_context11) {
        while (1) {
          switch (_context11.prev = _context11.next) {
            case 0:
              user_log('allow()');
              _context11.next = 3;
              return api.request('acceptLobbyUser').data({
                'user-entity': entity
              }).send();

            case 3:
            case "end":
              return _context11.stop();
          }
        }
      }, _callee11);
    }));
    return _allow.apply(this, arguments);
  }

  function accept() {
    return _accept.apply(this, arguments);
  }

  function _accept() {
    _accept = Object(asyncToGenerator["a" /* default */])(
    /*#__PURE__*/
    regeneratorRuntime.mark(function _callee12() {
      return regeneratorRuntime.wrap(function _callee12$(_context12) {
        while (1) {
          switch (_context12.prev = _context12.next) {
            case 0:
              user_log('accept()');
              _context12.next = 3;
              return setAudioFilter(true);

            case 3:
            case "end":
              return _context12.stop();
          }
        }
      }, _callee12);
    }));
    return _accept.apply(this, arguments);
  }

  function reject() {
    return _reject.apply(this, arguments);
  }

  function _reject() {
    _reject = Object(asyncToGenerator["a" /* default */])(
    /*#__PURE__*/
    regeneratorRuntime.mark(function _callee13() {
      return regeneratorRuntime.wrap(function _callee13$(_context13) {
        while (1) {
          switch (_context13.prev = _context13.next) {
            case 0:
              user_log('reject()');
              _context13.next = 3;
              return setAudioFilter(false);

            case 3:
            case "end":
              return _context13.stop();
          }
        }
      }, _callee13);
    }));
    return _reject.apply(this, arguments);
  }

  function sendMessage(_x6) {
    return _sendMessage.apply(this, arguments);
  }

  function _sendMessage() {
    _sendMessage = Object(asyncToGenerator["a" /* default */])(
    /*#__PURE__*/
    regeneratorRuntime.mark(function _callee14(msg) {
      var chatChannel;
      return regeneratorRuntime.wrap(function _callee14$(_context14) {
        while (1) {
          switch (_context14.prev = _context14.next) {
            case 0:
              user_log('sendMessage()');
              chatChannel = context.chatChannel;

              if (!(chatChannel && chatChannel.ready)) {
                _context14.next = 5;
                break;
              }

              _context14.next = 5;
              return chatChannel.sendMessage(msg, [entity]);

            case 5:
            case "end":
              return _context14.stop();
          }
        }
      }, _callee14);
    }));
    return _sendMessage.apply(this, arguments);
  }

  return user = user_objectSpread({}, events, {
    get data() {
      return data;
    },

    get: function get(key) {
      return data[key];
    },
    update: update,
    getEntity: getEntity,
    getUID: getUID,
    getDisplayText: getDisplayText,
    getRole: getRole,
    isCurrent: isCurrent,
    isAttendee: isAttendee,
    isPresenter: isPresenter,
    isCastviewer: isCastviewer,
    isOrganizer: isOrganizer,
    getEndpoint: getEndpoint,
    isOnHold: isOnHold,
    hasFocus: hasFocus,
    hasMedia: hasMedia,
    hasSharing: hasSharing,
    hasFECC: hasFECC,
    getMedia: getMedia,
    getAudioFilter: getAudioFilter,
    getVideoFilter: getVideoFilter,
    isAudioBlocked: isAudioBlocked,
    isVideoBlocked: isVideoBlocked,
    isHandup: isHandup,
    isSharing: isSharing,
    isSIP: isSIP,
    isHTTP: isHTTP,
    isRTMP: isRTMP,
    // user ctrl
    setFilter: setFilter,
    setAudioFilter: setAudioFilter,
    setVideoFilter: setVideoFilter,
    setDisplayText: setDisplayText,
    setRole: setRole,
    setFocus: setFocus,
    getStats: getStats,
    kick: kick,
    hold: hold,
    unhold: unhold,
    allow: allow,
    accept: accept,
    reject: reject,
    sendMessage: sendMessage,
    // camera ctrl
    camera: camera
  });
}
// CONCATENATED MODULE: ./packages/meetnow/src/conference/lobby-ctrl.ts



var lobby_ctrl_log = browser_default()('MN:Information:Lobby');
function createLobbyCtrl(api) {
  function remove(_x) {
    return _remove.apply(this, arguments);
  }

  function _remove() {
    _remove = Object(asyncToGenerator["a" /* default */])(
    /*#__PURE__*/
    regeneratorRuntime.mark(function _callee(entity) {
      var apiName;
      return regeneratorRuntime.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              lobby_ctrl_log('remove()');
              apiName = entity ? 'deleteUser' : 'rejectLobbyUserAll';
              _context.next = 4;
              return api.request(apiName).data({
                'user-entity': entity
              }).send();

            case 4:
            case "end":
              return _context.stop();
          }
        }
      }, _callee);
    }));
    return _remove.apply(this, arguments);
  }

  function unhold(_x2) {
    return _unhold.apply(this, arguments);
  }

  function _unhold() {
    _unhold = Object(asyncToGenerator["a" /* default */])(
    /*#__PURE__*/
    regeneratorRuntime.mark(function _callee2(entity) {
      var apiName;
      return regeneratorRuntime.wrap(function _callee2$(_context2) {
        while (1) {
          switch (_context2.prev = _context2.next) {
            case 0:
              lobby_ctrl_log('unhold()');
              apiName = entity ? 'acceptLobbyUser' : 'acceptLobbyUserAll';
              _context2.next = 4;
              return api.request(apiName).data({
                'user-entity': entity
              }).send();

            case 4:
            case "end":
              return _context2.stop();
          }
        }
      }, _callee2);
    }));
    return _unhold.apply(this, arguments);
  }

  function allow(_x3) {
    return _allow.apply(this, arguments);
  }

  function _allow() {
    _allow = Object(asyncToGenerator["a" /* default */])(
    /*#__PURE__*/
    regeneratorRuntime.mark(function _callee3(entity) {
      return regeneratorRuntime.wrap(function _callee3$(_context3) {
        while (1) {
          switch (_context3.prev = _context3.next) {
            case 0:
              lobby_ctrl_log('allow()');
              _context3.next = 3;
              return unhold(entity);

            case 3:
            case "end":
              return _context3.stop();
          }
        }
      }, _callee3);
    }));
    return _allow.apply(this, arguments);
  }

  function hold(_x4) {
    return _hold.apply(this, arguments);
  }

  function _hold() {
    _hold = Object(asyncToGenerator["a" /* default */])(
    /*#__PURE__*/
    regeneratorRuntime.mark(function _callee4(entity) {
      var apiName;
      return regeneratorRuntime.wrap(function _callee4$(_context4) {
        while (1) {
          switch (_context4.prev = _context4.next) {
            case 0:
              lobby_ctrl_log('hold()');
              apiName = entity ? 'waitLobbyUser' : 'waitLobbyUserAll';
              _context4.next = 4;
              return api.request(apiName).data({
                'user-entity': entity
              }).send();

            case 4:
            case "end":
              return _context4.stop();
          }
        }
      }, _callee4);
    }));
    return _hold.apply(this, arguments);
  }

  return {
    remove: remove,
    unhold: unhold,
    hold: hold,
    allow: allow
  };
}
// CONCATENATED MODULE: ./packages/meetnow/src/conference/users.ts

















function users_ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function users_objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { users_ownKeys(Object(source), true).forEach(function (key) { Object(defineProperty["a" /* default */])(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { users_ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }







var users_log = browser_default()('MN:Information:Users');
function createUsers(data, context) {
  var api = context.api;
  var events = createEvents(users_log);
  var userMap = new Map();
  var userList;
  var users;
  /* eslint-disable-next-line no-use-before-define */

  var reactive = createReactive(watch({}), events);
  var lobby = createLobbyCtrl(api);

  function watch(target) {
    /* eslint-disable no-use-before-define */
    // update user list
    userList = data.user.map(function (userdata) {
      var entity = userdata.entity;
      var user = userMap.get(entity);

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
    var added = [];
    var updated = [];
    var deleted = [];

    if (diff) {
      var user = diff.user;
      /* eslint-disable no-use-before-define */

      user.forEach(function (userdata) {
        var entity = userdata.entity,
            state = userdata.state;
        hasUser(entity) ? state === 'deleted' ? deleted.push(userdata) : updated.push(userdata) : added.push(userdata);
      });
      /* eslint-enable no-use-before-define */
    } // fire status change events


    watch(reactive);
    added.forEach(function (userdata) {
      var entity = userdata.entity;
      var user = userMap.get(entity);
      users_log('added user:\n\n %s(%s) \n', user.getDisplayText(), user.getEntity());
      users.emit('user:added', user);
    });
    updated.forEach(function (userdata) {
      var entity = userdata.entity;
      var user = userMap.get(entity); // user data is not proxied, so update it here
      // if user data is 'full', it will replace the old one

      user.update(userdata);
      users_log('updated user:\n\n %s(%s)  \n', user.getDisplayText(), user.getEntity());
      users.emit('user:updated', user);
    });
    deleted.forEach(function (userdata) {
      var entity = userdata.entity;
      var user = userMap.get(entity);
      users_log('deleted user:\n\n %s(%s)  \n', user.getDisplayText(), user.getEntity());
      users.emit('user:deleted', user);
      userMap.delete(entity);
    }); // updated event must come after watch()
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
    return userList.find(function (user) {
      return user.isCurrent();
    });
  }

  function getAttendee() {
    return userList.filter(function (user) {
      return user.isAttendee() && !user.isOnHold();
    });
  }

  function getPresenter() {
    return userList.filter(function (user) {
      return user.isPresenter();
    });
  }

  function getCastviewer() {
    return userList.filter(function (user) {
      return user.isCastviewer();
    });
  }

  function getOrganizer() {
    return userList.filter(function (user) {
      return user.isOrganizer();
    });
  }

  function getOnhold() {
    return userList.filter(function (user) {
      return user.isOnHold();
    });
  }

  function getHandup() {
    return userList.filter(function (user) {
      return user.isHandup();
    });
  }

  function getSharing() {
    return userList.filter(function (user) {
      return user.isSharing();
    });
  }

  function getAudioBlocked() {
    return userList.filter(function (user) {
      return user.isAudioBlocked();
    });
  }

  function getVideoBlocked() {
    return userList.filter(function (user) {
      return user.isVideoBlocked();
    });
  }

  function getSIP() {
    return userList.filter(function (user) {
      return user.isSIP();
    });
  }

  function getHTTP() {
    return userList.filter(function (user) {
      return user.isHTTP();
    });
  }

  function getRTMP() {
    return userList.filter(function (user) {
      return user.isRTMP();
    });
  }

  function invite(_x) {
    return _invite.apply(this, arguments);
  }

  function _invite() {
    _invite = Object(asyncToGenerator["a" /* default */])(
    /*#__PURE__*/
    regeneratorRuntime.mark(function _callee(option) {
      return regeneratorRuntime.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              users_log('invite');
              _context.next = 3;
              return api.request('inviteUser').data({
                uid: option.uid,
                'sip-url': option.sipURL,
                'h323-url': option.h323URL
              });

            case 3:
            case "end":
              return _context.stop();
          }
        }
      }, _callee);
    }));
    return _invite.apply(this, arguments);
  }

  function kick(_x2) {
    return _kick.apply(this, arguments);
  }

  function _kick() {
    _kick = Object(asyncToGenerator["a" /* default */])(
    /*#__PURE__*/
    regeneratorRuntime.mark(function _callee2(entity) {
      return regeneratorRuntime.wrap(function _callee2$(_context2) {
        while (1) {
          switch (_context2.prev = _context2.next) {
            case 0:
              users_log('kick');
              _context2.next = 3;
              return api.request('deleteUser').data({
                'user-entity': entity
              }).send();

            case 3:
            case "end":
              return _context2.stop();
          }
        }
      }, _callee2);
    }));
    return _kick.apply(this, arguments);
  }

  function mute() {
    return _mute.apply(this, arguments);
  }

  function _mute() {
    _mute = Object(asyncToGenerator["a" /* default */])(
    /*#__PURE__*/
    regeneratorRuntime.mark(function _callee3() {
      return regeneratorRuntime.wrap(function _callee3$(_context3) {
        while (1) {
          switch (_context3.prev = _context3.next) {
            case 0:
              users_log('mute');
              _context3.next = 3;
              return api.request('muteAll').send();

            case 3:
            case "end":
              return _context3.stop();
          }
        }
      }, _callee3);
    }));
    return _mute.apply(this, arguments);
  }

  function unmute() {
    return _unmute.apply(this, arguments);
  }

  function _unmute() {
    _unmute = Object(asyncToGenerator["a" /* default */])(
    /*#__PURE__*/
    regeneratorRuntime.mark(function _callee4() {
      return regeneratorRuntime.wrap(function _callee4$(_context4) {
        while (1) {
          switch (_context4.prev = _context4.next) {
            case 0:
              users_log('unmute');
              _context4.next = 3;
              return api.request('unmuteAll').send();

            case 3:
            case "end":
              return _context4.stop();
          }
        }
      }, _callee4);
    }));
    return _unmute.apply(this, arguments);
  }

  return users = users_objectSpread({}, events, {
    get data() {
      return data;
    },

    get: function get(key) {
      return data[key];
    }
  }, lobby, {
    update: update,
    getUserList: getUserList,
    getUser: getUser,
    hasUser: hasUser,
    getCurrent: getCurrent,
    getAttendee: getAttendee,
    getPresenter: getPresenter,
    getCastviewer: getCastviewer,
    getOrganizer: getOrganizer,
    getOnhold: getOnhold,
    getHandup: getHandup,
    getSharing: getSharing,
    getAudioBlocked: getAudioBlocked,
    getVideoBlocked: getVideoBlocked,
    getSIP: getSIP,
    getHTTP: getHTTP,
    getRTMP: getRTMP,
    invite: invite,
    kick: kick,
    mute: mute,
    unmute: unmute
  });
}
// CONCATENATED MODULE: ./packages/meetnow/src/conference/rtmp-ctrl.ts



var rtmp_ctrl_log = browser_default()('MN:Information:RTMP');
var RTMPOperationTypes;

(function (RTMPOperationTypes) {
  RTMPOperationTypes["START"] = "start";
  RTMPOperationTypes["STOP"] = "stop";
  RTMPOperationTypes["PAUSE"] = "pause";
  RTMPOperationTypes["RESUME"] = "resume";
})(RTMPOperationTypes || (RTMPOperationTypes = {}));

function createRTMPCtrl(api) {
  function operation(_x) {
    return _operation.apply(this, arguments);
  }

  function _operation() {
    _operation = Object(asyncToGenerator["a" /* default */])(
    /*#__PURE__*/
    regeneratorRuntime.mark(function _callee(type) {
      return regeneratorRuntime.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              rtmp_ctrl_log('operation');
              _context.next = 3;
              return api.request('setRTMP').data({
                operate: type
              }).send();

            case 3:
            case "end":
              return _context.stop();
          }
        }
      }, _callee);
    }));
    return _operation.apply(this, arguments);
  }

  function start() {
    rtmp_ctrl_log('start');
    return operation(RTMPOperationTypes.START);
  }

  function stop() {
    rtmp_ctrl_log('stop');
    return operation(RTMPOperationTypes.STOP);
  }

  function pause() {
    rtmp_ctrl_log('pause');
    return operation(RTMPOperationTypes.PAUSE);
  }

  function resume() {
    rtmp_ctrl_log('resume');
    return operation(RTMPOperationTypes.RESUME);
  }

  return {
    operation: operation,
    start: start,
    stop: stop,
    pause: pause,
    resume: resume
  };
}
// CONCATENATED MODULE: ./packages/meetnow/src/conference/rtmp.ts









function rtmp_ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function rtmp_objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { rtmp_ownKeys(Object(source), true).forEach(function (key) { Object(defineProperty["a" /* default */])(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { rtmp_ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }







var rtmp_log = browser_default()('MN:Information:RTMP');
function createRTMP(data, context) {
  var api = context.api;
  var events = createEvents(rtmp_log);
  /* eslint-disable-next-line no-use-before-define */

  var reactive = createReactive(watch({}), events);
  var ctrl = createRTMPCtrl(api);
  var rtmp;

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
    return entity ? data.users.find(function (userdata) {
      return userdata.entity === entity;
    }) : data.users.find(function (userdata) {
      return userdata.default;
    }) || data.users[0];
  }

  function getEnable() {
    return data['rtmp-enable'];
  }

  function getStatus(entity) {
    var userdata = getUser(entity);
    return userdata && userdata['rtmp-status'];
  }

  function getReason(entity) {
    var userdata = getUser(entity);
    return userdata && userdata.reason;
  }

  function getDetail(entity) {
    var userdata = getUser(entity);
    if (!userdata) return undefined;
    var status = userdata['rtmp-status'],
        lastStartTime = userdata['rtmp-last-start-time'],
        lastStopDuration = userdata['rtmp-last-stop-duration'],
        reason = userdata.reason;
    return {
      reason: reason,
      status: status,
      lastStartTime: lastStartTime,
      lastStopDuration: lastStopDuration
    };
  }

  return rtmp = rtmp_objectSpread({}, events, {
    get data() {
      return data;
    },

    get: function get(key) {
      return data[key];
    },
    update: update,
    getEnable: getEnable,
    getStatus: getStatus,
    getReason: getReason,
    getDetail: getDetail
  }, ctrl);
}
// CONCATENATED MODULE: ./packages/meetnow/src/conference/record-ctrl.ts



var record_ctrl_log = browser_default()('MN:Information:Record');
var RecordOperationTypes;

(function (RecordOperationTypes) {
  RecordOperationTypes["START"] = "start";
  RecordOperationTypes["STOP"] = "stop";
  RecordOperationTypes["PAUSE"] = "pause";
  RecordOperationTypes["RESUME"] = "resume";
})(RecordOperationTypes || (RecordOperationTypes = {}));

function createRecordCtrl(api) {
  function operation(_x) {
    return _operation.apply(this, arguments);
  }

  function _operation() {
    _operation = Object(asyncToGenerator["a" /* default */])(
    /*#__PURE__*/
    regeneratorRuntime.mark(function _callee(type) {
      return regeneratorRuntime.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              _context.next = 2;
              return api.request('setRecord').data({
                operate: type
              }).send();

            case 2:
            case "end":
              return _context.stop();
          }
        }
      }, _callee);
    }));
    return _operation.apply(this, arguments);
  }

  function start() {
    record_ctrl_log('start()');
    return operation(RecordOperationTypes.START);
  }

  function stop() {
    record_ctrl_log('stop()');
    return operation(RecordOperationTypes.STOP);
  }

  function pause() {
    record_ctrl_log('pause()');
    return operation(RecordOperationTypes.PAUSE);
  }

  function resume() {
    record_ctrl_log('resume()');
    return operation(RecordOperationTypes.RESUME);
  }

  return {
    operation: operation,
    start: start,
    stop: stop,
    pause: pause,
    resume: resume
  };
}
// CONCATENATED MODULE: ./packages/meetnow/src/conference/record.ts








function record_ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function record_objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { record_ownKeys(Object(source), true).forEach(function (key) { Object(defineProperty["a" /* default */])(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { record_ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }







var record_log = browser_default()('MN:Information:Record');
function createRecord(data, context) {
  var api = context.api;
  var events = createEvents(record_log);
  /* eslint-disable-next-line no-use-before-define */

  var reactive = createReactive(watch({}), events);
  var ctrl = createRecordCtrl(api);
  var record;

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
    var userdata = getUser();
    var status = userdata['record-status'],
        lastStartTime = userdata['record-last-start-time'],
        lastStopDuration = userdata['record-last-stop-duration'],
        reason = userdata.reason;
    return {
      reason: reason,
      status: status,
      lastStartTime: lastStartTime,
      lastStopDuration: lastStopDuration
    };
  }

  return record = record_objectSpread({}, events, {
    get data() {
      return data;
    },

    get: function get(key) {
      return data[key];
    },
    update: update,
    getStatus: getStatus,
    getReason: getReason,
    getDetail: getDetail
  }, ctrl);
}
// EXTERNAL MODULE: ./node_modules/core-js/modules/es.array.find-index.js
var es_array_find_index = __webpack_require__("c740");

// CONCATENATED MODULE: ./packages/meetnow/src/conference/merge.ts











var merge_log = browser_default()('MN:Information:Item');
function isItem(item) {
  return Object(src_utils["e" /* isDef */])(item) && Object(src_utils["g" /* isObject */])(item) && !Object(src_utils["d" /* isArray */])(item);
}
function isPartialableItem(item) {
  return isItem(item) && Object(src_utils["c" /* hasOwn */])(item, 'state');
}
function mergeItemList(rhys, items) {
  merge_log('mergelist()');
  var _iteratorNormalCompletion = true;
  var _didIteratorError = false;
  var _iteratorError = undefined;

  try {
    var _loop = function _loop() {
      var item = _step.value;

      if (!isPartialableItem(item)) {
        merge_log('we don not know how to process a non-partialable item in a list, because it is undocumented');
        merge_log('treat it as full state item');
      }

      var id = item.id,
          entity = item.entity,
          _item$state = item.state,
          state = _item$state === void 0 ? 'full' : _item$state;
      var key = entity || id;

      if (!key) {
        merge_log('missing item identity(entity or id).');
        return "continue";
      }

      var index = rhys.findIndex(function (it) {
        return it.entity === key || it.id === key;
      });
      merge_log('item identity: %o', key); // not find

      if (index === -1) {
        if (state === 'deleted') {
          merge_log('can not delete item not exist.');
          return "continue";
        }

        merge_log('item added');
        rhys.push(item);
        return "continue";
      } // finded
      // this is weird as we don't know whether the item list is partial or not


      if (state === 'full') {
        rhys.splice(index, 1, item);
        return "continue";
      } // wanna delete


      if (state === 'deleted') {
        merge_log('item deleted');
        rhys.splice(index, 1);
        return "continue";
      } // wanna update

      /* eslint-disable-next-line no-use-before-define */


      mergeItem(rhys[index], item);
    };

    for (var _iterator = items[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
      var _ret = _loop();

      if (_ret === "continue") continue;
    }
  } catch (err) {
    _didIteratorError = true;
    _iteratorError = err;
  } finally {
    try {
      if (!_iteratorNormalCompletion && _iterator.return != null) {
        _iterator.return();
      }
    } finally {
      if (_didIteratorError) {
        throw _iteratorError;
      }
    }
  }

  return rhys;
}
function mergeItem(rhys, item) {
  merge_log('merge()');

  if (rhys === item) {
    return rhys;
  }

  if (!isPartialableItem(item)) {
    return item;
  }

  var state = item.state;

  if (state === 'full') {
    return item;
  }

  if (state === 'deleted') {
    return null;
  }

  if (state !== 'partial') {
    merge_log("Error: unknown item state. ".concat(state));
    merge_log('use merge policy as "partial"');
  }

  for (var key in item) {
    if (Object(src_utils["c" /* hasOwn */])(item, key)) {
      var value = item[key];
      var current = rhys[key];
      merge_log('item key: %s value: %o -> %o', key, current, value);
      rhys[key] = Object(src_utils["d" /* isArray */])(value) ? mergeItemList(current, value) : isItem(value) ? mergeItem(current, value) : value;
    }
  }

  return rhys;
}
// CONCATENATED MODULE: ./packages/meetnow/src/conference/information.ts










function information_ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function information_objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { information_ownKeys(Object(source), true).forEach(function (key) { Object(defineProperty["a" /* default */])(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { information_ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }



















var information_log = browser_default()('MN:Information');
function createInformation(data, context) {
  var events = createEvents(information_log);
  var api = context.api;

  function createdata(datakey) {
    return new Proxy({}, {
      get: function get(target, key) {
        var delegate = data[datakey];
        return delegate && Reflect.get(delegate, key);
      }
    });
  } // create information parts


  var description = createDescription(createdata('conference-description'), context);
  var state = createState(createdata('conference-state'), context);
  var view = createView(createdata('conference-view'), context);
  var users = createUsers(createdata('users'), context);
  var rtmp = createRTMP(createdata('rtmp-state'), context);
  var record = createRecord(createdata('record-users'), context);
  var information;

  function update(val) {
    information_log('update()');
    var version = data.version;
    var newVersion = val.version,
        newState = val.state;

    if (!newVersion) {
      information_log('receive information without version.');
      return;
    }

    if (newVersion <= version) {
      information_log('receive information with invalid version.');
      return;
    }

    if (newVersion - version > 1) {
      information_log('information version jumped.');
      api.request('getFullInfo').send().then(function (response) {
        return update(response.data.data);
      }).catch(function (error) {
        return information_log('get full information failed: %o', error);
      });
      return;
    }

    if (newState === 'deleted') {
      information_log('can not delete root information.');
      return;
    }

    if (newState === 'full') {
      // hack item state
      // as we want to keep 'data' reference to the same object
      // otherwise we need to re-create all information parts
      Object.assign(data, val);
    } else {
      mergeItem(data, val);
    } // update & prepare all parts


    [{
      key: 'conference-description',
      part: description
    }, {
      key: 'conference-state',
      part: state
    }, {
      key: 'conference-view',
      part: view
    }, {
      key: 'users',
      part: users
    }, {
      key: 'rtmp-state',
      part: rtmp
    }, {
      key: 'record-users',
      part: record
    }].forEach(function (parts) {
      var key = parts.key,
          part = parts.part;

      if (Object(src_utils["c" /* hasOwn */])(val, key)) {
        part.update(val[key]);
      }
    });
    events.emit('updated', information);
  }

  return information = information_objectSpread({}, events, {
    get data() {
      return data;
    },

    get version() {
      return data && data.version;
    },

    get: function get(key) {
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

    update: update
  });
}
// EXTERNAL MODULE: ./node_modules/core-js/modules/es.promise.finally.js
var es_promise_finally = __webpack_require__("a79d");

// EXTERNAL MODULE: ./node_modules/core-js/modules/es.regexp.constructor.js
var es_regexp_constructor = __webpack_require__("4d63");

// EXTERNAL MODULE: ./node_modules/core-js/modules/es.regexp.to-string.js
var es_regexp_to_string = __webpack_require__("25f0");

// EXTERNAL MODULE: ./node_modules/core-js/modules/es.string.match.js
var es_string_match = __webpack_require__("466d");

// EXTERNAL MODULE: ./node_modules/core-js/modules/es.array.slice.js
var es_array_slice = __webpack_require__("fb6a");

// EXTERNAL MODULE: ./node_modules/core-js/modules/es.number.constructor.js
var es_number_constructor = __webpack_require__("a9e3");

// CONCATENATED MODULE: ./packages/meetnow/src/sdp-transform/grammar.ts







/* eslint-disable no-useless-escape */

/* eslint-disable max-len */
var grammar = {
  v: [{
    name: 'version',
    reg: /^(\d*)$/
  }],
  o: [{
    // NB: sessionId will be a String in most cases because it is huge
    name: 'origin',
    reg: /^(\S*) (\d*) (\d*) (\S*) IP(\d) (\S*)/,
    names: ['username', 'sessionId', 'sessionVersion', 'netType', 'ipVer', 'address'],
    format: '%s %s %d %s IP%d %s'
  }],
  // default parsing of these only (though some of these feel outdated)
  s: [{
    name: 'name'
  }],
  i: [{
    name: 'description'
  }],
  u: [{
    name: 'uri'
  }],
  e: [{
    name: 'email'
  }],
  p: [{
    name: 'phone'
  }],
  z: [{
    name: 'timezones'
  }],
  r: [{
    name: 'repeats'
  }],
  // k: [{}], // outdated thing ignored
  t: [{
    name: 'timing',
    reg: /^(\d*) (\d*)/,
    names: ['start', 'stop'],
    format: '%d %d'
  }],
  c: [{
    name: 'connection',
    reg: /^IN IP(\d) (\S*)/,
    names: ['version', 'ip'],
    format: 'IN IP%d %s'
  }],
  b: [{
    push: 'bandwidth',
    reg: /^(TIAS|AS|CT|RR|RS):(\d*)/,
    names: ['type', 'limit'],
    format: '%s:%s'
  }],
  m: [{
    // NB: special - pushes to session
    // TODO: rtp/fmtp should be filtered by the payloads found here?
    reg: /^(\w*) (\d*) ([\w\/]*)(?: (.*))?/,
    names: ['type', 'port', 'protocol', 'payloads'],
    format: '%s %d %s %s'
  }],
  a: [{
    push: 'rtp',
    reg: /^rtpmap:(\d*) ([\w\-\.]*)(?:\s*\/(\d*)(?:\s*\/(\S*))?)?/,
    names: ['payload', 'codec', 'rate', 'encoding'],
    format: function format(o) {
      return o.encoding ? 'rtpmap:%d %s/%s/%s' : o.rate ? 'rtpmap:%d %s/%s' : 'rtpmap:%d %s';
    }
  }, {
    // a=fmtp:111 minptime=10; useinbandfec=1
    push: 'fmtp',
    reg: /^fmtp:(\d*) ([\S| ]*)/,
    names: ['payload', 'config'],
    format: 'fmtp:%d %s'
  }, {
    name: 'control',
    reg: /^control:(.*)/,
    format: 'control:%s'
  }, {
    name: 'rtcp',
    reg: /^rtcp:(\d*)(?: (\S*) IP(\d) (\S*))?/,
    names: ['port', 'netType', 'ipVer', 'address'],
    format: function format(o) {
      return o.address != null ? 'rtcp:%d %s IP%d %s' : 'rtcp:%d';
    }
  }, {
    push: 'rtcpFbTrrInt',
    reg: /^rtcp-fb:(\*|\d*) trr-int (\d*)/,
    names: ['payload', 'value'],
    format: 'rtcp-fb:%d trr-int %d'
  }, {
    push: 'rtcpFb',
    reg: /^rtcp-fb:(\*|\d*) ([\w-_]*)(?: ([\w-_]*))?/,
    names: ['payload', 'type', 'subtype'],
    format: function format(o) {
      return o.subtype != null ? 'rtcp-fb:%s %s %s' : 'rtcp-fb:%s %s';
    }
  }, {
    // a=extmap:1/recvonly URI-gps-string
    push: 'ext',
    reg: /^extmap:(\d+)(?:\/(\w+))? (\S*)(?: (\S*))?/,
    names: ['value', 'direction', 'uri', 'config'],
    format: function format(o) {
      return "extmap:%d".concat(o.direction ? '/%s' : '%v', " %s").concat(o.config ? ' %s' : '');
    }
  }, {
    push: 'crypto',
    reg: /^crypto:(\d*) ([\w_]*) (\S*)(?: (\S*))?/,
    names: ['id', 'suite', 'config', 'sessionConfig'],
    format: function format(o) {
      return o.sessionConfig != null ? 'crypto:%d %s %s %s' : 'crypto:%d %s %s';
    }
  }, {
    name: 'setup',
    reg: /^setup:(\w*)/,
    format: 'setup:%s'
  }, {
    name: 'mid',
    reg: /^mid:([^\s]*)/,
    format: 'mid:%s'
  }, {
    name: 'msid',
    reg: /^msid:(.*)/,
    format: 'msid:%s'
  }, {
    name: 'ptime',
    reg: /^ptime:(\d*)/,
    format: 'ptime:%d'
  }, {
    name: 'maxptime',
    reg: /^maxptime:(\d*)/,
    format: 'maxptime:%d'
  }, {
    name: 'direction',
    reg: /^(sendrecv|recvonly|sendonly|inactive)/
  }, {
    name: 'icelite',
    reg: /^(ice-lite)/
  }, {
    name: 'iceUfrag',
    reg: /^ice-ufrag:(\S*)/,
    format: 'ice-ufrag:%s'
  }, {
    name: 'icePwd',
    reg: /^ice-pwd:(\S*)/,
    format: 'ice-pwd:%s'
  }, {
    name: 'fingerprint',
    reg: /^fingerprint:(\S*) (\S*)/,
    names: ['type', 'hash'],
    format: 'fingerprint:%s %s'
  }, {
    // a=candidate:1162875081 1 udp 2113937151 192.168.34.75 60017 typ host generation 0 network-id 3 network-cost 10
    // a=candidate:3289912957 2 udp 1845501695 193.84.77.194 60017 typ srflx raddr 192.168.34.75 rport 60017 generation 0 network-id 3 network-cost 10
    // a=candidate:229815620 1 tcp 1518280447 192.168.150.19 60017 typ host tcptype active generation 0 network-id 3 network-cost 10
    // a=candidate:3289912957 2 tcp 1845501695 193.84.77.194 60017 typ srflx raddr 192.168.34.75 rport 60017 tcptype passive generation 0 network-id 3 network-cost 10
    push: 'candidates',
    reg: /^candidate:(\S*) (\d*) (\S*) (\d*) (\S*) (\d*) typ (\S*)(?: raddr (\S*) rport (\d*))?(?: tcptype (\S*))?(?: generation (\d*))?(?: network-id (\d*))?(?: network-cost (\d*))?/,
    names: ['foundation', 'component', 'transport', 'priority', 'ip', 'port', 'type', 'raddr', 'rport', 'tcptype', 'generation', 'network-id', 'network-cost'],
    format: function format(o) {
      var str = 'candidate:%s %d %s %d %s %d typ %s';
      str += o.raddr != null ? ' raddr %s rport %d' : '%v%v'; // NB: candidate has three optional chunks, so %void middles one if it's missing

      str += o.tcptype != null ? ' tcptype %s' : '%v';

      if (o.generation != null) {
        str += ' generation %d';
      }

      str += o['network-id'] != null ? ' network-id %d' : '%v';
      str += o['network-cost'] != null ? ' network-cost %d' : '%v';
      return str;
    }
  }, {
    name: 'endOfCandidates',
    reg: /^(end-of-candidates)/
  }, {
    name: 'remoteCandidates',
    reg: /^remote-candidates:(.*)/,
    format: 'remote-candidates:%s'
  }, {
    name: 'iceOptions',
    reg: /^ice-options:(\S*)/,
    format: 'ice-options:%s'
  }, {
    push: 'ssrcs',
    reg: /^ssrc:(\d*) ([\w_-]*)(?::(.*))?/,
    names: ['id', 'attribute', 'value'],
    format: function format(o) {
      var str = 'ssrc:%d';

      if (o.attribute != null) {
        str += ' %s';

        if (o.value != null) {
          str += ':%s';
        }
      }

      return str;
    }
  }, {
    // a=ssrc-group:FEC-FR 3004364195 1080772241
    push: 'ssrcGroups',
    // token-char = %x21 / %x23-27 / %x2A-2B / %x2D-2E / %x30-39 / %x41-5A / %x5E-7E
    reg: /^ssrc-group:([\x21\x23\x24\x25\x26\x27\x2A\x2B\x2D\x2E\w]*) (.*)/,
    names: ['semantics', 'ssrcs'],
    format: 'ssrc-group:%s %s'
  }, {
    name: 'msidSemantic',
    reg: /^msid-semantic:\s?(\w*) (\S*)/,
    names: ['semantic', 'token'],
    format: 'msid-semantic: %s %s'
  }, {
    push: 'groups',
    reg: /^group:(\w*) (.*)/,
    names: ['type', 'mids'],
    format: 'group:%s %s'
  }, {
    name: 'rtcpMux',
    reg: /^(rtcp-mux)/
  }, {
    name: 'rtcpRsize',
    reg: /^(rtcp-rsize)/
  }, {
    name: 'sctpmap',
    reg: /^sctpmap:([\w_\/]*) (\S*)(?: (\S*))?/,
    names: ['sctpmapNumber', 'app', 'maxMessageSize'],
    format: function format(o) {
      return o.maxMessageSize != null ? 'sctpmap:%s %s %s' : 'sctpmap:%s %s';
    }
  }, {
    name: 'xGoogleFlag',
    reg: /^x-google-flag:([^\s]*)/,
    format: 'x-google-flag:%s'
  }, {
    name: 'content',
    reg: /^content:([^\s]*)/,
    format: 'content:%s'
  }, {
    name: 'label',
    reg: /^label:([\d]*)/,
    format: 'label:%d'
  }, {
    push: 'rids',
    reg: /^rid:([\d\w]+) (\w+)(?: ([\S| ]*))?/,
    names: ['id', 'direction', 'params'],
    format: function format(o) {
      return o.params ? 'rid:%s %s %s' : 'rid:%s %s';
    }
  }, {
    // a=imageattr:* send [x=800,y=640] recv *
    // a=imageattr:100 recv [x=320,y=240]
    push: 'imageattrs',
    reg: new RegExp( // a=imageattr:97
    '^imageattr:(\\d+|\\*)' // send [x=800,y=640,sar=1.1,q=0.6] [x=480,y=320]
    + '[\\s\\t]+(send|recv)[\\s\\t]+(\\*|\\[\\S+\\](?:[\\s\\t]+\\[\\S+\\])*)' // recv [x=330,y=250]
    + '(?:[\\s\\t]+(recv|send)[\\s\\t]+(\\*|\\[\\S+\\](?:[\\s\\t]+\\[\\S+\\])*))?'),
    names: ['pt', 'dir1', 'attrs1', 'dir2', 'attrs2'],
    format: function format(o) {
      return "imageattr:%s %s %s".concat(o.dir2 ? ' %s %s' : '');
    }
  }, {
    // a=simulcast:recv 1;4,5 send 6;7
    name: 'simulcast',
    reg: new RegExp( // a=simulcast:
    '^simulcast:' // send 1,2,3;~4,~5
    + '(send|recv) ([a-zA-Z0-9\\-_~;,]+)' // space + recv 6;~7,~8
    + '(?:\\s?(send|recv) ([a-zA-Z0-9\\-_~;,]+))?' // end
    + '$'),
    names: ['dir1', 'list1', 'dir2', 'list2'],
    format: function format(o) {
      return "simulcast:%s %s".concat(o.dir2 ? ' %s %s' : '');
    }
  }, {
    //  https://tools.ietf.org/html/draft-ietf-mmusic-sdp-simulcast-03
    // a=simulcast: recv pt=97;98 send pt=97
    // a=simulcast: send rid=5;6;7 paused=6,7
    name: 'simulcast_03',
    reg: /^simulcast:[\s\t]+([\S+\s\t]+)$/,
    names: ['value'],
    format: 'simulcast: %s'
  }, {
    // a=framerate:25
    // a=framerate:29.97
    name: 'framerate',
    reg: /^framerate:(\d+(?:$|\.\d+))/,
    format: 'framerate:%s'
  }, {
    // a=source-filter: incl IN IP4 239.5.2.31 10.1.15.5
    name: 'sourceFilter',
    reg: /^source-filter: *(excl|incl) (\S*) (IP4|IP6|\*) (\S*) (.*)/,
    names: ['filterMode', 'netType', 'addressTypes', 'destAddress', 'srcList'],
    format: 'source-filter: %s %s %s %s %s'
  }, {
    push: 'invalid',
    names: ['value']
  }]
}; // set sensible defaults to avoid polluting the grammar with boring details

Object.keys(grammar).forEach(function (key) {
  var objs = grammar[key];
  objs.forEach(function (obj) {
    if (!obj.reg) {
      obj.reg = /(.*)/;
    }

    if (!obj.format) {
      obj.format = '%s';
    }
  });
});
// CONCATENATED MODULE: ./packages/meetnow/src/sdp-transform/parser.ts












/* eslint-disable no-useless-escape */

/* eslint-disable no-div-regex */


function toIntIfInt(v) {
  return String(Number(v)) === v ? Number(v) : v;
}

function attachProperties(match, location, names, rawName) {
  if (rawName && !names) {
    location[rawName] = toIntIfInt(match[1]);
  } else {
    for (var i = 0; i < names.length; i += 1) {
      if (match[i + 1] != null) {
        location[names[i]] = toIntIfInt(match[i + 1]);
      }
    }
  }
}

function parseReg(obj, location, content) {
  var needsBlank = obj.name && obj.names;

  if (obj.push && !location[obj.push]) {
    location[obj.push] = [];
  } else if (needsBlank && !location[obj.name]) {
    location[obj.name] = {};
  }

  var keyLocation = obj.push ? {} // blank object that will be pushed
  : needsBlank ? location[obj.name] : location; // otherwise, named location or root

  attachProperties(content.match(obj.reg), keyLocation, obj.names, obj.name);

  if (obj.push) {
    location[obj.push].push(keyLocation);
  }
}
var validLine = RegExp.prototype.test.bind(/^([a-z])=(.*)/);
function parse(sdp) {
  var media = [];
  var session = {
    media: media
  };
  var location = session; // points at where properties go under (one of the above)
  // parse lines we understand

  sdp.split(/(\r\n|\r|\n)/).filter(validLine).forEach(function (l) {
    var type = l[0];
    var content = l.slice(2);

    if (type === 'm') {
      media.push({
        rtp: [],
        fmtp: []
      });
      location = media[media.length - 1]; // point at latest media line
    }

    for (var j = 0; j < (grammar[type] || []).length; j += 1) {
      var obj = grammar[type][j];

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
  var s = expr.split(/=(.+)/, 2);

  if (s.length === 2) {
    acc[s[0]] = toIntIfInt(s[1]);
  }

  return acc;
}
function parseParams(str) {
  return str.split(/\;\s?/).reduce(paramReducer, {});
} // For backward compatibility - alias will be removed in 3.0.0

var parseFmtpConfig = parseParams;
function parsePayloads(str) {
  return str.split(' ').map(Number);
}
function parseRemoteCandidates(str) {
  var candidates = [];
  var parts = str.split(' ').map(toIntIfInt);

  for (var i = 0; i < parts.length; i += 3) {
    candidates.push({
      component: parts[i],
      ip: parts[i + 1],
      port: parts[i + 2]
    });
  }

  return candidates;
}
function parseImageAttributes(str) {
  return str.split(' ').map(function (item) {
    return item.substring(1, item.length - 1).split(',').reduce(paramReducer, {});
  });
}
function parseSimulcastStreamList(str) {
  return str.split(';').map(function (stream) {
    return stream.split(',').map(function (format) {
      var scid;
      var paused = false;

      if (format[0] !== '~') {
        scid = toIntIfInt(format);
      } else {
        scid = toIntIfInt(format.substring(1, format.length));
        paused = true;
      }

      return {
        scid: scid,
        paused: paused
      };
    });
  });
}
// CONCATENATED MODULE: ./packages/meetnow/src/sdp-transform/writer.ts







 // customized util.format - discards excess arguments and can void middle ones

var formatRegExp = /%[sdv%]/g;

var format = function format(formatStr) {
  for (var _len = arguments.length, args = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
    args[_key - 1] = arguments[_key];
  }

  var i = 0;
  var len = args.length;
  return formatStr.replace(formatRegExp, function (x) {
    if (i >= len) {
      return x; // missing argument
    }

    var arg = args[i];
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
  }); // NB: we discard excess arguments - they are typically undefined from makeLine
};

var makeLine = function makeLine(type, obj, location) {
  var str = obj.format instanceof Function ? obj.format(obj.push ? location : location[obj.name]) : obj.format;
  var formatStr = "".concat(type, "=").concat(str);
  var args = [];

  if (obj.names) {
    for (var i = 0; i < obj.names.length; i += 1) {
      var n = obj.names[i];

      if (obj.name) {
        args.push(location[obj.name][n]);
      } else {
        // for mLine and push attributes
        args.push(location[obj.names[i]]);
      }
    }
  } else {
    args.push(location[obj.name]);
  }

  return format.apply(void 0, [formatStr].concat(args));
}; // RFC specified order
// TODO: extend this with all the rest


var defaultOuterOrder = ['v', 'o', 's', 'i', 'u', 'e', 'p', 'c', 'b', 't', 'r', 'z', 'a'];
var defaultInnerOrder = ['i', 'c', 'b', 'a'];
function write(session, opts) {
  opts = opts || {}; // ensure certain properties exist

  if (session.version == null) {
    session.version = 0; // 'v=0' must be there (only defined version atm)
  }

  if (session.name == null) {
    session.name = ' '; // 's= ' must be there if no meaningful name set
  }

  session.media.forEach(function (mLine) {
    if (mLine.payloads == null) {
      mLine.payloads = '';
    }
  });
  var outerOrder = opts.outerOrder || defaultOuterOrder;
  var innerOrder = opts.innerOrder || defaultInnerOrder;
  var sdp = []; // loop through outerOrder for matching properties on session

  outerOrder.forEach(function (type) {
    grammar[type].forEach(function (obj) {
      if (obj.name in session && session[obj.name] != null) {
        sdp.push(makeLine(type, obj, session));
      } else if (obj.push in session && session[obj.push] != null) {
        session[obj.push].forEach(function (el) {
          sdp.push(makeLine(type, obj, el));
        });
      }
    });
  }); // then for each media line, follow the innerOrder

  session.media.forEach(function (mLine) {
    sdp.push(makeLine('m', grammar.m[0], mLine));
    innerOrder.forEach(function (type) {
      grammar[type].forEach(function (obj) {
        if (obj.name in mLine && mLine[obj.name] != null) {
          sdp.push(makeLine(type, obj, mLine));
        } else if (obj.push in mLine && mLine[obj.push] != null) {
          mLine[obj.push].forEach(function (el) {
            sdp.push(makeLine(type, obj, el));
          });
        }
      });
    });
  });
  return "".concat(sdp.join('\r\n'), "\r\n");
}
// CONCATENATED MODULE: ./packages/meetnow/src/media/close-media-stream.ts


function closeMediaStream(stream) {
  if (!stream) return; // Latest spec states that MediaStream has no stop() method and instead must
  // call stop() on every MediaStreamTrack.

  try {
    if (stream.getTracks) {
      stream.getTracks().forEach(function (track) {
        return track.stop();
      });
    } else {
      stream.getAudioTracks().forEach(function (track) {
        return track.stop();
      });
      stream.getVideoTracks().forEach(function (track) {
        return track.stop();
      });
    }
  } catch (error) {
    // Deprecated by the spec, but still in use.
    // NOTE: In Temasys IE plugin stream.stop is a callable 'object'.
    if (typeof stream.stop === 'function' || Object(esm_typeof["a" /* default */])(stream.stop) === 'object') {
      stream.stop();
    }
  }
}
// CONCATENATED MODULE: ./packages/meetnow/src/media/stream-utils.ts


function stream_utils_setup(stream) {
  stream.close = stream.stop = function close() {
    closeMediaStream(this);
  };

  stream.pause = function pause() {
    this.getTracks().forEach(function (track) {
      return track.enabled = false;
    });
  };

  stream.play = function play() {
    this.getTracks().forEach(function (track) {
      return track.enabled = true;
    });
  };

  stream.muteAudio = function muteAudio() {
    var mute = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : true;
    this.getAudioTracks().forEach(function (track) {
      return track.enabled = !mute;
    });
  };

  stream.muteVideo = function muteVideo() {
    var mute = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : true;
    this.getVideoTracks().forEach(function (track) {
      return track.enabled = !mute;
    });
  };

  return stream;
}
// CONCATENATED MODULE: ./packages/meetnow/src/media/get-user-media.ts





function getUserMedia(_x) {
  return _getUserMedia.apply(this, arguments);
}

function _getUserMedia() {
  _getUserMedia = Object(asyncToGenerator["a" /* default */])(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee(constraints) {
    var stream;
    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            if (!navigator.mediaDevices.getUserMedia) {
              _context.next = 6;
              break;
            }

            _context.next = 3;
            return navigator.mediaDevices.getUserMedia(constraints);

          case 3:
            stream = _context.sent;
            _context.next = 13;
            break;

          case 6:
            if (!navigator.getUserMedia) {
              _context.next = 12;
              break;
            }

            _context.next = 9;
            return new Promise(function (resolve, reject) {
              navigator.getUserMedia(constraints, resolve, reject);
            });

          case 9:
            stream = _context.sent;
            _context.next = 13;
            break;

          case 12:
            throw new Error('Not Supported');

          case 13:
            return _context.abrupt("return", stream_utils_setup(stream));

          case 14:
          case "end":
            return _context.stop();
        }
      }
    }, _callee);
  }));
  return _getUserMedia.apply(this, arguments);
}
// EXTERNAL MODULE: ./node_modules/core-js/modules/es.number.is-finite.js
var es_number_is_finite = __webpack_require__("f00c");

// EXTERNAL MODULE: ./node_modules/core-js/modules/es.number.is-nan.js
var es_number_is_nan = __webpack_require__("9129");

// CONCATENATED MODULE: ./packages/meetnow/src/channel/rtc-stats.ts







var MAX_ARCHIVE_SIZE = 10;
function createRTCStats() {
  var quality = -1;
  var inbound = {};
  var outbound = {};
  var archives = [];
  var maxArchiveSize = MAX_ARCHIVE_SIZE;
  var rtcstats;

  function clear() {
    quality = -1;
    inbound = {};
    outbound = {};
    archives = [];
  }

  function update(report) {
    var latestInbound = {};
    var latestOutbound = {};
    var isLegacyStats = false;
    report.forEach(function (stats) {
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

        default:
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
    var totalPacketsLostRate = 0;
    var totalChannel = 0;

    if (inbound.audio) {
      totalChannel++;
      totalPacketsLostRate += inbound.audio.packetsLostRate || 0;
    }

    if (inbound.video) {
      totalChannel++;
      totalPacketsLostRate += inbound.video.packetsLostRate || 0;
    }

    if (totalChannel) {
      var average = totalPacketsLostRate / totalChannel;
      quality = average >= 12 ? 0 : average >= 5 ? 1 : average >= 3 ? 2 : average >= 2 ? 3 : 4;
    }
    /* eslint-disable-next-line no-use-before-define */


    archive();
  }

  function parseRTPStats(report, stats) {
    var codec = report.get(stats.codecId);
    var track = report.get(stats.trackId);
    var transport = report.get(stats.transportId);
    var remote = report.get(stats.remoteId);

    if (codec) {
      codec.name = codec.mimeType.split('/')[1];
    }

    if (!stats.codecId || !stats.trackId || !stats.transportId) {// TODO
    }

    if (transport) {
      var localCertificate = report.get(transport.localCertificateId);
      var remoteCertificate = report.get(transport.remoteCertificateId);
      var selectedCandidatePair = report.get(transport.selectedCandidatePairId);
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

  function parseSSRCStats(report, stats) {
    var isLegacyStats = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;

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

    var codec = {
      name: stats.googCodecName,
      implementationName: stats.codecImplementationName
    };
    var track = {
      frameHeight: stats.googFrameHeightReceived || stats.googFrameHeightSent,
      frameWidth: stats.googFrameWidthReceived || stats.googFrameWidthSent,
      frameRate: stats.googFrameRateReceived || stats.googFrameRateSent
    };
    stats.codec = codec;
    stats.track = track;
    return stats;
  }

  function updateRTPStats(stats, direction) {
    if (!stats) {
      return;
    }

    var prestats = rtcstats[direction][stats.mediaType];

    var diff = function diff() {
      var x = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
      var y = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
      var key = arguments.length > 2 ? arguments[2] : undefined;

      if (typeof x[key] !== 'undefined' && typeof y[key] !== 'undefined') {
        return Math.abs(x[key] - y[key]);
      }

      return 0;
    };

    var safe = function safe(x) {
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
        var timeDiff = diff(stats, prestats, 'timestamp');
        var valueDiff; // calc packetsLostRate

        if (direction === 'outbound' && !stats.packetsLostRate) {
          /* eslint-disable-next-line no-use-before-define */
          var archived = getArchive()[direction][stats.mediaType];
          var lostDiff = diff(stats, archived, 'packetsLost');
          var sentDiff = diff(stats, archived, 'packetsSent');
          var totalPackets = lostDiff + sentDiff;
          stats.packetsLostRate = totalPackets === 0 ? 0 : safe(lostDiff / totalPackets);
          stats.packetsLostRate *= 100;
        }

        if (direction === 'inbound' && !stats.packetsLostRate) {
          /* eslint-disable-next-line no-use-before-define */
          var _archived = getArchive()[direction][stats.mediaType];

          var _lostDiff = diff(stats, _archived, 'packetsLost');

          var receivedDiff = diff(stats, _archived, 'packetsReceived');

          var _totalPackets = _lostDiff + receivedDiff;

          stats.packetsLostRate = _totalPackets === 0 ? 0 : safe(_lostDiff / _totalPackets);
          stats.packetsLostRate *= 100;
        } // calc outgoingBitrate


        if (direction === 'outbound' && !stats.outgoingBitrate) {
          valueDiff = diff(stats, prestats, 'bytesSent');
          stats.outgoingBitrate = safe(valueDiff * 8 / timeDiff);
        } // calc incomingBitrate


        if (direction === 'inbound' && !stats.incomingBitrate) {
          valueDiff = diff(stats, prestats, 'bytesReceived');
          stats.incomingBitrate = safe(valueDiff * 8 / timeDiff);
        } // calc transport outgoingBitrate


        if (stats.transport && prestats.transport && !stats.transport.outgoingBitrate) {
          valueDiff = diff(stats.transport, prestats.transport, 'bytesSent');
          stats.transport.outgoingBitrate = safe(valueDiff * 8 / timeDiff);
        } // calc transport incomingBitrate


        if (stats.transport && prestats.transport && !stats.transport.incomingBitrate) {
          valueDiff = diff(stats.transport, prestats.transport, 'bytesReceived');
          stats.transport.incomingBitrate = safe(valueDiff * 8 / timeDiff);
        } // calc frameRate


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
    } else {
      rtcstats[direction][stats.mediaType] = stats;
    }
  }

  function archive() {
    if (archives.length === maxArchiveSize) {
      archives.shift();
    }

    archives.push({
      quality: quality,
      inbound: inbound,
      outbound: outbound
    });
  }

  function getArchive() {
    var index = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;
    var _archives = archives,
        length = _archives.length;
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

    update: update,
    clear: clear
  };
}
// CONCATENATED MODULE: ./packages/meetnow/src/channel/channel.ts
























function channel_ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function channel_objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { channel_ownKeys(Object(source), true).forEach(function (key) { Object(defineProperty["a" /* default */])(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { channel_ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }









var channel_log = browser_default()('MN:Channel');
var channel_browser = Object(src_browser["a" /* getBrowser */])();
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


var holdMediaTypes = ['audio', 'video'];
function createChannel(config) {
  var invite = config.invite,
      confirm = config.confirm,
      cancel = config.cancel,
      bye = config.bye,
      localstream = config.localstream;
  var events = createEvents(channel_log); // The RTCPeerConnection instance (public attribute).

  var connection;
  var status = STATUS.kNull;
  var canceled = false;
  var rtcStats = createRTCStats(); // Prevent races on serial PeerConnction operations.

  var connectionPromiseQueue = Promise.resolve(); // Default rtcOfferConstraints(passed in connect()).

  var rtcConstraints;
  var rtcOfferConstraints; // Local MediaStream.

  var localMediaStream;
  var localMediaStreamLocallyGenerated = false; // Flag to indicate PeerConnection ready for new actions.

  var rtcReady = false;
  var startTime;
  var endTime; // Mute/Hold state.

  var audioMuted = false;
  var videoMuted = false;
  var localHold = false; // there is no in dialog sdp offer, so remote hold is alway false

  var remoteHold = false;

  function throwIfStatus(condition, message) {
    if (status !== condition) return;
    throw new Error(message || 'Invalid State');
  }

  function throwIfNotStatus(condition, message) {
    if (status === condition) return;
    throw new Error(message || 'Invalid State');
  }

  function throwIfTerminated() {
    var message = 'Terminated';
    if (canceled) throw new Error(message);
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
      video: videoMuted
    };
  }

  function getHold() {
    return {
      local: localHold,
      remote: remoteHold
    };
  }

  function createRTCConnection(rtcConstraints) {
    channel_log('createRTCConnection()');
    /* tslint:disable */

    connection = new RTCPeerConnection(rtcConstraints);
    connection.addEventListener('iceconnectionstatechange', function () {
      if (!connection) return;
      var _connection = connection,
          state = _connection.iceConnectionState;

      if (state === 'failed') {
        events.emit('peerconnection:connectionfailed');
        /* eslint-disable-next-line no-use-before-define */

        terminate('RTP Timeout');
      }
    });
    events.emit('peerconnection', connection);
  }

  function createLocalDescription(_x, _x2) {
    return _createLocalDescription.apply(this, arguments);
  }

  function _createLocalDescription() {
    _createLocalDescription = Object(asyncToGenerator["a" /* default */])(
    /*#__PURE__*/
    regeneratorRuntime.mark(function _callee(type, constraints) {
      var desc, sdp;
      return regeneratorRuntime.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              channel_log('createLocalDescription()');
              rtcReady = false;

              if (!(type === 'offer')) {
                _context.next = 16;
                break;
              }

              _context.prev = 3;
              _context.next = 6;
              return connection.createOffer(constraints);

            case 6:
              desc = _context.sent;
              _context.next = 14;
              break;

            case 9:
              _context.prev = 9;
              _context.t0 = _context["catch"](3);
              channel_log('createOffer failed: %o', _context.t0);
              events.emit('peerconnection:createofferfailed', _context.t0);
              throw _context.t0;

            case 14:
              _context.next = 31;
              break;

            case 16:
              if (!(type === 'answer')) {
                _context.next = 30;
                break;
              }

              _context.prev = 17;
              _context.next = 20;
              return connection.createAnswer(constraints);

            case 20:
              desc = _context.sent;
              _context.next = 28;
              break;

            case 23:
              _context.prev = 23;
              _context.t1 = _context["catch"](17);
              channel_log('createAnswer failed: %o', _context.t1);
              events.emit('peerconnection:createanswerfailed', _context.t1);
              throw _context.t1;

            case 28:
              _context.next = 31;
              break;

            case 30:
              throw new TypeError('Invalid Type');

            case 31:
              _context.prev = 31;
              _context.next = 34;
              return connection.setLocalDescription(desc);

            case 34:
              _context.next = 42;
              break;

            case 36:
              _context.prev = 36;
              _context.t2 = _context["catch"](31);
              channel_log('setLocalDescription failed: %o', _context.t2);
              rtcReady = true;
              events.emit('peerconnection:setlocaldescriptionfailed', _context.t2);
              throw _context.t2;

            case 42:
              _context.next = 44;
              return new Promise(function (resolve) {
                // When remote fingerprint is changed, setRemoteDescription will not restart ice immediately,
                // and iceGatheringState stay complete for a while.
                // We will get a local sdp without ip candidates, if resolve right away.
                // if (type === 'offer' && connection.iceGatheringState === 'complete')
                // Resolve right away if 'pc.iceGatheringState' is 'complete'.
                if (connection.iceGatheringState === 'complete') {
                  resolve();
                  return;
                }

                var finished = false;
                var listener;

                var ready = function ready() {
                  connection.removeEventListener('icecandidate', listener);
                  finished = true;
                  resolve();
                };

                connection.addEventListener('icecandidate', listener = function listener(event) {
                  var candidate = event.candidate;

                  if (candidate) {
                    events.emit('icecandidate', {
                      candidate: candidate,
                      ready: ready
                    });
                  } else if (!finished) {
                    ready();
                  }
                });
              });

            case 44:
              rtcReady = true;
              sdp = connection.localDescription.sdp;
              desc = {
                originator: 'local',
                type: type,
                sdp: sdp
              };
              events.emit('sdp', desc);
              return _context.abrupt("return", desc.sdp);

            case 49:
            case "end":
              return _context.stop();
          }
        }
      }, _callee, null, [[3, 9], [17, 23], [31, 36]]);
    }));
    return _createLocalDescription.apply(this, arguments);
  }

  function connect() {
    return _connect.apply(this, arguments);
  }

  function _connect() {
    _connect = Object(asyncToGenerator["a" /* default */])(
    /*#__PURE__*/
    regeneratorRuntime.mark(function _callee2() {
      var options,
          _options$rtcConstrain,
          _options$rtcOfferCons,
          mediaStream,
          _options$mediaConstra,
          mediaConstraints,
          localSDP,
          answer,
          _answer,
          remoteSDP,
          desc,
          offer,
          _args2 = arguments;

      return regeneratorRuntime.wrap(function _callee2$(_context2) {
        while (1) {
          switch (_context2.prev = _context2.next) {
            case 0:
              options = _args2.length > 0 && _args2[0] !== undefined ? _args2[0] : {};
              channel_log('connect()');
              throwIfNotStatus(STATUS.kNull);

              if (window.RTCPeerConnection) {
                _context2.next = 5;
                break;
              }

              throw new Error('WebRTC not supported');

            case 5:
              status = STATUS.kProgress;
              /* eslint-disable-next-line no-use-before-define */

              onProgress('local');
              events.emit('connecting');
              _options$rtcConstrain = options.rtcConstraints;
              rtcConstraints = _options$rtcConstrain === void 0 ? {
                sdpSemantics: 'plan-b',
                iceServers: [{
                  urls: 'stun:stun.l.google.com:19302'
                }]
              } : _options$rtcConstrain;
              _options$rtcOfferCons = options.rtcOfferConstraints;
              rtcOfferConstraints = _options$rtcOfferCons === void 0 ? {
                offerToReceiveAudio: true,
                offerToReceiveVideo: true
              } : _options$rtcOfferCons;
              mediaStream = options.mediaStream, _options$mediaConstra = options.mediaConstraints, mediaConstraints = _options$mediaConstra === void 0 ? {
                audio: true,
                video: true
              } : _options$mediaConstra;
              createRTCConnection(rtcConstraints);

              if (!mediaStream) {
                _context2.next = 19;
                break;
              }

              localMediaStream = mediaStream;
              localMediaStreamLocallyGenerated = false;
              _context2.next = 24;
              break;

            case 19:
              if (!(mediaConstraints.audio || mediaConstraints.video)) {
                _context2.next = 24;
                break;
              }

              _context2.next = 22;
              return getUserMedia(mediaConstraints).catch(function (error) {
                /* eslint-disable-next-line no-use-before-define */
                onFailed('local', 'User Denied Media Access');
                channel_log('getusermedia failed: %o', error);
                throw error;
              });

            case 22:
              localMediaStream = _context2.sent;
              localMediaStreamLocallyGenerated = true;

            case 24:
              throwIfTerminated();

              if (!localMediaStream) {
                _context2.next = 34;
                break;
              }

              localMediaStream.getTracks().forEach(function (track) {
                connection.addTrack(track, localMediaStream);
              });
              _context2.prev = 27;
              _context2.next = 30;
              return localstream(localMediaStream);

            case 30:
              _context2.next = 34;
              break;

            case 32:
              _context2.prev = 32;
              _context2.t0 = _context2["catch"](27);

            case 34:
              _context2.next = 36;
              return createLocalDescription('offer', rtcOfferConstraints).catch(function (error) {
                /* eslint-disable-next-line no-use-before-define */
                onFailed('local', 'WebRTC Error');
                channel_log('createOff|setLocalDescription failed: %o', error);
                throw error;
              });

            case 36:
              localSDP = _context2.sent;
              throwIfTerminated();
              status = STATUS.kOffered;
              _context2.prev = 39;
              _context2.next = 42;
              return invite({
                sdp: localSDP
              });

            case 42:
              answer = _context2.sent;
              _context2.next = 50;
              break;

            case 45:
              _context2.prev = 45;
              _context2.t1 = _context2["catch"](39);

              /* eslint-disable-next-line no-use-before-define */
              onFailed('local', 'Request Error');
              channel_log('invite failed: %o', _context2.t1);
              throw _context2.t1;

            case 50:
              throwIfTerminated();
              status = STATUS.kAnswered;
              _answer = answer, remoteSDP = _answer.sdp;
              desc = {
                originator: 'remote',
                type: 'answer',
                sdp: remoteSDP
              };
              events.emit('sdp', desc);

              if (!(connection.signalingState === 'stable')) {
                _context2.next = 71;
                break;
              }

              _context2.prev = 56;
              _context2.next = 59;
              return connection.createOffer();

            case 59:
              offer = _context2.sent;
              _context2.next = 62;
              return connection.setLocalDescription(offer);

            case 62:
              _context2.next = 71;
              break;

            case 64:
              _context2.prev = 64;
              _context2.t2 = _context2["catch"](56);

              /* eslint-disable-next-line no-use-before-define */
              onFailed('local', 'WebRTC Error');
              channel_log('createOff|setLocalDescription failed: %o', _context2.t2);
              _context2.next = 70;
              return bye();

            case 70:
              throw _context2.t2;

            case 71:
              _context2.prev = 71;
              _context2.next = 74;
              return connection.setRemoteDescription({
                type: 'answer',
                sdp: desc.sdp
              });

            case 74:
              _context2.next = 84;
              break;

            case 76:
              _context2.prev = 76;
              _context2.t3 = _context2["catch"](71);

              /* eslint-disable-next-line no-use-before-define */
              onFailed('local', 'Bad Media Description');
              events.emit('peerconnection:setremotedescriptionfailed', _context2.t3);
              channel_log('setRemoteDescription failed: %o', _context2.t3);
              _context2.next = 83;
              return bye();

            case 83:
              throw _context2.t3;

            case 84:
              _context2.prev = 84;
              _context2.next = 87;
              return confirm();

            case 87:
              _context2.next = 94;
              break;

            case 89:
              _context2.prev = 89;
              _context2.t4 = _context2["catch"](84);

              /* eslint-disable-next-line no-use-before-define */
              onFailed('local', 'Request Error');
              channel_log('confirm failed: %o', _context2.t4);
              throw _context2.t4;

            case 94:
              status = STATUS.kAccepted;
              /* eslint-disable-next-line no-use-before-define */

              onAccepted('local');
              events.emit('connected');

            case 97:
            case "end":
              return _context2.stop();
          }
        }
      }, _callee2, null, [[27, 32], [39, 45], [56, 64], [71, 76], [84, 89]]);
    }));
    return _connect.apply(this, arguments);
  }

  function terminate(_x3) {
    return _terminate.apply(this, arguments);
  }

  function _terminate() {
    _terminate = Object(asyncToGenerator["a" /* default */])(
    /*#__PURE__*/
    regeneratorRuntime.mark(function _callee3(reason) {
      return regeneratorRuntime.wrap(function _callee3$(_context3) {
        while (1) {
          switch (_context3.prev = _context3.next) {
            case 0:
              channel_log('terminate()');
              _context3.t0 = status;
              _context3.next = _context3.t0 === STATUS.kNull ? 4 : _context3.t0 === STATUS.kTerminated ? 4 : _context3.t0 === STATUS.kProgress ? 5 : _context3.t0 === STATUS.kOffered ? 5 : _context3.t0 === STATUS.kAnswered ? 15 : _context3.t0 === STATUS.kAccepted ? 15 : 19;
              break;

            case 4:
              return _context3.abrupt("break", 20);

            case 5:
              channel_log('canceling channel');

              if (!(status === STATUS.kOffered)) {
                _context3.next = 11;
                break;
              }

              _context3.next = 9;
              return cancel(reason);

            case 9:
              _context3.next = 12;
              break;

            case 11:
              canceled = true;

            case 12:
              status = STATUS.kCanceled;
              /* eslint-disable-next-line no-use-before-define */

              onFailed('local', 'Canceled');
              return _context3.abrupt("break", 20);

            case 15:
              _context3.next = 17;
              return bye(reason);

            case 17:
              /* eslint-disable-next-line no-use-before-define */
              onEnded('local', 'Terminated');
              return _context3.abrupt("break", 20);

            case 19:
              return _context3.abrupt("break", 20);

            case 20:
            case "end":
              return _context3.stop();
          }
        }
      }, _callee3);
    }));
    return _terminate.apply(this, arguments);
  }

  function close() {
    channel_log('close()');
    if (status === STATUS.kTerminated) return;

    if (connection) {
      try {
        connection.close();
        connection = undefined;
      } catch (error) {
        channel_log('error closing RTCPeerConnection %o', error);
      }
    }
    /* eslint-disable-next-line no-use-before-define */


    maybeCloseLocalMediaStream();
    localMediaStream = undefined;
    localMediaStreamLocallyGenerated = false;
    rtcStats.clear();
    status = STATUS.kTerminated;
  }

  function toggleMuteAudio(mute) {
    connection.getSenders().forEach(function (sender) {
      if (sender.track && sender.track.kind === 'audio') {
        sender.track.enabled = !mute;
      }
    });
  }

  function toggleMuteVideo(mute) {
    connection.getSenders().forEach(function (sender) {
      if (sender.track && sender.track.kind === 'video') {
        sender.track.enabled = !mute;
      }
    });
  }

  function setLocalMediaStatus() {
    var enableAudio = true;
    var enableVideo = true;

    if (localHold || remoteHold && localMediaStreamLocallyGenerated) {
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

  function maybeCloseLocalMediaStream() {
    if (localMediaStream && localMediaStreamLocallyGenerated) {
      closeMediaStream(localMediaStream);
      localMediaStream = undefined;
      localMediaStreamLocallyGenerated = false;
    }
  }

  function onProgress(originator, message) {
    channel_log('channel progress');
    events.emit('progress', {
      originator: originator,
      message: message
    });
  }

  function onAccepted(originator, message) {
    channel_log('channel accepted');
    events.emit('accepted', {
      originator: originator,
      message: message
    });
    startTime = new Date();
  }

  function onEnded(originator, message) {
    channel_log('channel ended');
    endTime = new Date();
    close();
    events.emit('ended', {
      originator: originator,
      message: message
    });
  }

  function onFailed(originator, message) {
    channel_log('channel failed');
    close();
    events.emit('failed', {
      originator: originator,
      message: message
    });
  }

  function onMute() {
    setLocalMediaStatus();
    events.emit('mute', {
      audio: audioMuted,
      video: videoMuted
    });
  }

  function onUnMute() {
    setLocalMediaStatus();
    events.emit('unmute', {
      audio: !audioMuted,
      video: !videoMuted
    });
  }

  function onHold(originator) {
    setLocalMediaStatus();
    events.emit('hold', {
      originator: originator,
      localHold: localHold,
      remoteHold: remoteHold
    });
  }

  function onUnHold(originator) {
    setLocalMediaStatus();
    events.emit('unhold', {
      originator: originator,
      localHold: localHold,
      remoteHold: remoteHold
    });
  }

  function mute() {
    var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {
      audio: true,
      video: false
    };
    channel_log('mute()');
    var changed = false;

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

  function unmute() {
    var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {
      audio: true,
      video: true
    };
    channel_log('unmute()');
    var changed = false;

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

  function hold() {
    return _hold.apply(this, arguments);
  }

  function _hold() {
    _hold = Object(asyncToGenerator["a" /* default */])(
    /*#__PURE__*/
    regeneratorRuntime.mark(function _callee4() {
      return regeneratorRuntime.wrap(function _callee4$(_context4) {
        while (1) {
          switch (_context4.prev = _context4.next) {
            case 0:
              channel_log('unhold()');

              if (!localHold) {
                _context4.next = 4;
                break;
              }

              channel_log('Already hold');
              return _context4.abrupt("return");

            case 4:
              localHold = true;
              onHold('local');
              /* eslint-disable-next-line no-use-before-define */

              _context4.next = 8;
              return renegotiate();

            case 8:
            case "end":
              return _context4.stop();
          }
        }
      }, _callee4);
    }));
    return _hold.apply(this, arguments);
  }

  function unhold() {
    return _unhold.apply(this, arguments);
  }

  function _unhold() {
    _unhold = Object(asyncToGenerator["a" /* default */])(
    /*#__PURE__*/
    regeneratorRuntime.mark(function _callee5() {
      return regeneratorRuntime.wrap(function _callee5$(_context5) {
        while (1) {
          switch (_context5.prev = _context5.next) {
            case 0:
              channel_log('unhold()');

              if (localHold) {
                _context5.next = 4;
                break;
              }

              channel_log('Already unhold');
              return _context5.abrupt("return");

            case 4:
              localHold = false;
              onUnHold('local');
              /* eslint-disable-next-line no-use-before-define */

              _context5.next = 8;
              return renegotiate();

            case 8:
            case "end":
              return _context5.stop();
          }
        }
      }, _callee5);
    }));
    return _unhold.apply(this, arguments);
  }

  function renegotiate() {
    return _renegotiate.apply(this, arguments);
  }

  function _renegotiate() {
    _renegotiate = Object(asyncToGenerator["a" /* default */])(
    /*#__PURE__*/
    regeneratorRuntime.mark(function _callee6() {
      var options,
          localSDP,
          answer,
          desc,
          _args6 = arguments;
      return regeneratorRuntime.wrap(function _callee6$(_context6) {
        while (1) {
          switch (_context6.prev = _context6.next) {
            case 0:
              options = _args6.length > 0 && _args6[0] !== undefined ? _args6[0] : {};
              channel_log('renegotiate()');

              if (rtcReady) {
                _context6.next = 5;
                break;
              }

              channel_log('RTC not ready');
              return _context6.abrupt("return");

            case 5:
              _context6.next = 7;
              return createLocalDescription('offer', rtcOfferConstraints);

            case 7:
              localSDP = _context6.sent;
              _context6.next = 10;
              return invite({
                sdp: mangleOffer(localSDP)
              });

            case 10:
              answer = _context6.sent;
              desc = {
                originator: 'remote',
                type: 'answer',
                sdp: answer.sdp
              };
              events.emit('sdp', desc);
              _context6.prev = 13;
              connection.setRemoteDescription({
                type: 'answer',
                sdp: desc.sdp
              });
              _context6.next = 21;
              break;

            case 17:
              _context6.prev = 17;
              _context6.t0 = _context6["catch"](13);
              events.emit('peerconnection:setremotedescriptionfailed', _context6.t0);
              throw _context6.t0;

            case 21:
              _context6.prev = 21;
              _context6.next = 24;
              return confirm();

            case 24:
              _context6.next = 31;
              break;

            case 26:
              _context6.prev = 26;
              _context6.t1 = _context6["catch"](21);

              /* eslint-disable-next-line no-use-before-define */
              onFailed('local', 'Request Error');
              channel_log('confirm failed: %o', _context6.t1);
              throw _context6.t1;

            case 31:
            case "end":
              return _context6.stop();
          }
        }
      }, _callee6, null, [[13, 17], [21, 26]]);
    }));
    return _renegotiate.apply(this, arguments);
  }

  function mangleOffer(offer) {
    channel_log('mangleOffer()'); // nothing to do

    if (!localHold && !remoteHold) return offer;
    var sdp = parse(offer); // Local hold.

    if (localHold && !remoteHold) {
      var _iteratorNormalCompletion = true;
      var _didIteratorError = false;
      var _iteratorError = undefined;

      try {
        for (var _iterator = sdp.media[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
          var m = _step.value;

          if (holdMediaTypes.indexOf(m.type) === -1) {
            continue;
          }

          if (!m.direction) {
            m.direction = 'sendonly';
          } else if (m.direction === 'sendrecv') {
            m.direction = 'sendonly';
          } else if (m.direction === 'recvonly') {
            m.direction = 'inactive';
          }
        } // Local and remote hold.

      } catch (err) {
        _didIteratorError = true;
        _iteratorError = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion && _iterator.return != null) {
            _iterator.return();
          }
        } finally {
          if (_didIteratorError) {
            throw _iteratorError;
          }
        }
      }
    } else if (localHold && remoteHold) {
      var _iteratorNormalCompletion2 = true;
      var _didIteratorError2 = false;
      var _iteratorError2 = undefined;

      try {
        for (var _iterator2 = sdp.media[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
          var _m = _step2.value;

          if (holdMediaTypes.indexOf(_m.type) === -1) {
            continue;
          }

          _m.direction = 'inactive';
        } // Remote hold.

      } catch (err) {
        _didIteratorError2 = true;
        _iteratorError2 = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion2 && _iterator2.return != null) {
            _iterator2.return();
          }
        } finally {
          if (_didIteratorError2) {
            throw _iteratorError2;
          }
        }
      }
    } else if (remoteHold) {
      var _iteratorNormalCompletion3 = true;
      var _didIteratorError3 = false;
      var _iteratorError3 = undefined;

      try {
        for (var _iterator3 = sdp.media[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
          var _m2 = _step3.value;

          if (holdMediaTypes.indexOf(_m2.type) === -1) {
            continue;
          }

          if (!_m2.direction) {
            _m2.direction = 'recvonly';
          } else if (_m2.direction === 'sendrecv') {
            _m2.direction = 'recvonly';
          } else if (_m2.direction === 'recvonly') {
            _m2.direction = 'inactive';
          }
        }
      } catch (err) {
        _didIteratorError3 = true;
        _iteratorError3 = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion3 && _iterator3.return != null) {
            _iterator3.return();
          }
        } finally {
          if (_didIteratorError3) {
            throw _iteratorError3;
          }
        }
      }
    }

    return write(sdp);
  }

  function getRemoteStream() {
    channel_log('getRemoteStream()');
    var stream;

    if (connection.getReceivers) {
      stream = new window.MediaStream();
      connection.getReceivers().forEach(function (receiver) {
        var track = receiver.track;

        if (track) {
          stream.addTrack(track);
        }
      });
    } else if (connection.getRemoteStreams) {
      stream = connection.getRemoteStreams()[0];
    }

    return stream;
  }

  function getLocalStream() {
    channel_log('getLocalStream()');
    var stream;

    if (connection.getSenders) {
      stream = new window.MediaStream();
      connection.getSenders().forEach(function (sender) {
        var track = sender.track;

        if (track) {
          stream.addTrack(track);
        }
      });
    } else if (connection.getLocalStreams) {
      stream = connection.getLocalStreams()[0];
    }

    return stream;
  }

  function addLocalStream(stream) {
    channel_log('addLocalStream()');
    if (!stream) return;

    if (connection.addTrack) {
      stream.getTracks().forEach(function (track) {
        connection.addTrack(track, stream);
      });
    } else if (connection.addStream) {
      connection.addStream(stream);
    }
  }

  function removeLocalStream() {
    channel_log('removeLocalStream()');

    if (connection.getSenders && connection.removeTrack) {
      connection.getSenders().forEach(function (sender) {
        connection.removeTrack(sender);
      });
    } else if (connection.getLocalStreams && connection.removeStream) {
      connection.getLocalStreams().forEach(function (stream) {
        connection.removeStream(stream);
      });
    }
  }

  function replaceLocalStream(_x4) {
    return _replaceLocalStream.apply(this, arguments);
  }

  function _replaceLocalStream() {
    _replaceLocalStream = Object(asyncToGenerator["a" /* default */])(
    /*#__PURE__*/
    regeneratorRuntime.mark(function _callee9(stream) {
      var renegotiation,
          audioTrack,
          videoTrack,
          queue,
          renegotiationNeeded,
          peerHasAudio,
          peerHasVideo,
          shimReplaceTrack,
          _args9 = arguments;
      return regeneratorRuntime.wrap(function _callee9$(_context9) {
        while (1) {
          switch (_context9.prev = _context9.next) {
            case 0:
              shimReplaceTrack = function _ref2(sender) {
                sender.replaceTrack =
                /*#__PURE__*/
                function () {
                  var _replaceTrack = Object(asyncToGenerator["a" /* default */])(
                  /*#__PURE__*/
                  regeneratorRuntime.mark(function _callee7(newTrack) {
                    var offer;
                    return regeneratorRuntime.wrap(function _callee7$(_context7) {
                      while (1) {
                        switch (_context7.prev = _context7.next) {
                          case 0:
                            connection.removeTrack(sender);
                            connection.addTrack(newTrack, stream);
                            _context7.next = 4;
                            return connection.createOffer();

                          case 4:
                            offer = _context7.sent;
                            offer.type = connection.localDescription.type;
                            /* eslint-disable-next-line no-use-before-define */

                            offer.sdp = replaceSSRCs(connection.localDescription.sdp, offer.sdp);
                            _context7.next = 9;
                            return connection.setLocalDescription(offer);

                          case 9:
                            _context7.next = 11;
                            return connection.setRemoteDescription(connection.remoteDescription);

                          case 11:
                          case "end":
                            return _context7.stop();
                        }
                      }
                    }, _callee7);
                  }));

                  function replaceTrack(_x7) {
                    return _replaceTrack.apply(this, arguments);
                  }

                  return replaceTrack;
                }();
              };

              renegotiation = _args9.length > 1 && _args9[1] !== undefined ? _args9[1] : false;
              channel_log('replaceLocalStream()');
              audioTrack = stream ? stream.getAudioTracks()[0] : null;
              videoTrack = stream ? stream.getVideoTracks()[0] : null;
              queue = [];
              renegotiationNeeded = false;
              peerHasAudio = false;
              peerHasVideo = false;

              if (connection.getSenders) {
                connection.getSenders().forEach(function (sender) {
                  if (!sender.track) return;
                  peerHasAudio = sender.track.kind === 'audio' || peerHasAudio;
                  peerHasVideo = sender.track.kind === 'video' || peerHasVideo;
                });
                renegotiationNeeded = Boolean(audioTrack) !== peerHasAudio || Boolean(videoTrack) !== peerHasVideo || renegotiation;
                /* eslint-disable-next-line no-use-before-define */

                maybeCloseLocalMediaStream();

                if (renegotiationNeeded) {
                  removeLocalStream();
                  addLocalStream(stream);
                  queue.push(renegotiate());
                } else {
                  connection.getSenders().forEach(function (sender) {
                    if (!sender.track) return;

                    if (!sender.replaceTrack && !(sender.prototype && sender.prototype.replaceTrack)) {
                      /* eslint-disable-next-line no-use-before-define */
                      shimReplaceTrack(sender);
                    }

                    if (audioTrack && sender.track.kind === 'audio') {
                      queue.push(sender.replaceTrack(audioTrack).catch(function (e) {
                        channel_log('replace audio track error: %o', e);
                      }));
                    }

                    if (videoTrack && sender.track.kind === 'video') {
                      queue.push(sender.replaceTrack(videoTrack).catch(function (e) {
                        channel_log('replace video track error: %o', e);
                      }));
                    }
                  });
                }
              }

              _context9.next = 12;
              return Promise.all(queue).finally(
              /*#__PURE__*/
              Object(asyncToGenerator["a" /* default */])(
              /*#__PURE__*/
              regeneratorRuntime.mark(function _callee8() {
                return regeneratorRuntime.wrap(function _callee8$(_context8) {
                  while (1) {
                    switch (_context8.prev = _context8.next) {
                      case 0:
                        localMediaStream = getLocalStream();
                        localMediaStreamLocallyGenerated = false;

                      case 2:
                      case "end":
                        return _context8.stop();
                    }
                  }
                }, _callee8);
              })));

            case 12:
              _context9.prev = 12;
              _context9.next = 15;
              return localstream(localMediaStream);

            case 15:
              _context9.next = 19;
              break;

            case 17:
              _context9.prev = 17;
              _context9.t0 = _context9["catch"](12);

            case 19:
            case "end":
              return _context9.stop();
          }
        }
      }, _callee9, null, [[12, 17]]);
    }));
    return _replaceLocalStream.apply(this, arguments);
  }

  function replaceSSRCs(currentDescription, newDescription) {
    var ssrcs = currentDescription.match(/a=ssrc-group:FID (\d+) (\d+)\r\n/);
    var newssrcs = newDescription.match(/a=ssrc-group:FID (\d+) (\d+)\r\n/);

    if (!ssrcs) {
      // Firefox offers wont have FID yet
      ssrcs = currentDescription.match(/a=ssrc:(\d+) cname:(.*)\r\n/g)[1].match(/a=ssrc:(\d+)/);
      newssrcs = newDescription.match(/a=ssrc:(\d+) cname:(.*)\r\n/g)[1].match(/a=ssrc:(\d+)/);
    }

    for (var i = 1; i < ssrcs.length; i++) {
      newDescription = newDescription.replace(new RegExp(newssrcs[i], 'g'), ssrcs[i]);
    }

    return newDescription;
  }

  function adjustBandWidth(_x5) {
    return _adjustBandWidth.apply(this, arguments);
  }

  function _adjustBandWidth() {
    _adjustBandWidth = Object(asyncToGenerator["a" /* default */])(
    /*#__PURE__*/
    regeneratorRuntime.mark(function _callee10(options) {
      var audio, video, queue;
      return regeneratorRuntime.wrap(function _callee10$(_context10) {
        while (1) {
          switch (_context10.prev = _context10.next) {
            case 0:
              channel_log('adjustBandWidth()');
              audio = options.audio, video = options.video;
              queue = [];

              if ('RTCRtpSender' in window && 'setParameters' in window.RTCRtpSender.prototype) {
                connection.getSenders().forEach(function (sender) {
                  if (sender.track) return;
                  var parameters = sender.getParameters();

                  if (typeof audio !== 'undefined' && sender.track.kind === 'audio') {
                    if (audio === 0) {
                      delete parameters.encodings[0].maxBitrate;
                    } else {
                      parameters.encodings[0].maxBitrate = audio * 1024;
                    }

                    queue.push(sender.setParameters(parameters).catch(function (e) {
                      channel_log('apply audio parameters error: %o', e);
                    }));
                  }

                  if (typeof video !== 'undefined' && sender.track.kind === 'video') {
                    if (video === 0) {
                      delete parameters.encodings[0].maxBitrate;
                    } else {
                      parameters.encodings[0].maxBitrate = video * 1024;
                    }

                    queue.push(sender.setParameters(parameters).catch(function (e) {
                      channel_log('apply video parameters error: %o', e);
                    }));
                  }
                });
              } else {
                // Fallback to the SDP munging with local renegotiation way of limiting
                // the bandwidth.
                queue.push(connection.createOffer().then(function (offer) {
                  return connection.setLocalDescription(offer);
                }).then(function () {
                  var sdp = parse(connection.remoteDescription.sdp);
                  var _iteratorNormalCompletion4 = true;
                  var _didIteratorError4 = false;
                  var _iteratorError4 = undefined;

                  try {
                    for (var _iterator4 = sdp.media[Symbol.iterator](), _step4; !(_iteratorNormalCompletion4 = (_step4 = _iterator4.next()).done); _iteratorNormalCompletion4 = true) {
                      var m = _step4.value;

                      if (typeof audio !== 'undefined' && m.type === 'audio') {
                        if (audio === 0) {
                          m.bandwidth = [];
                        } else {
                          m.bandwidth = [{
                            type: 'TIAS',
                            limit: Math.ceil(audio * 1024)
                          }];
                        }
                      }

                      if (typeof video !== 'undefined' && m.type === 'video') {
                        if (video === 0) {
                          m.bandwidth = [];
                        } else {
                          m.bandwidth = [{
                            type: 'TIAS',
                            limit: Math.ceil(video * 1024)
                          }];
                        }
                      }
                    }
                  } catch (err) {
                    _didIteratorError4 = true;
                    _iteratorError4 = err;
                  } finally {
                    try {
                      if (!_iteratorNormalCompletion4 && _iterator4.return != null) {
                        _iterator4.return();
                      }
                    } finally {
                      if (_didIteratorError4) {
                        throw _iteratorError4;
                      }
                    }
                  }

                  var desc = {
                    type: connection.remoteDescription.type,
                    sdp: write(sdp)
                  };
                  return connection.setRemoteDescription(desc);
                }).catch(function (e) {
                  channel_log('applying bandwidth restriction to setRemoteDescription error: %o', e);
                }));
              }

              _context10.next = 6;
              return Promise.all(queue);

            case 6:
            case "end":
              return _context10.stop();
          }
        }
      }, _callee10);
    }));
    return _adjustBandWidth.apply(this, arguments);
  }

  function applyConstraints(_x6) {
    return _applyConstraints.apply(this, arguments);
  }

  function _applyConstraints() {
    _applyConstraints = Object(asyncToGenerator["a" /* default */])(
    /*#__PURE__*/
    regeneratorRuntime.mark(function _callee11(options) {
      var audio, video, queue;
      return regeneratorRuntime.wrap(function _callee11$(_context11) {
        while (1) {
          switch (_context11.prev = _context11.next) {
            case 0:
              channel_log('applyConstraints()');
              audio = options.audio, video = options.video;
              queue = [];

              if (connection.getSenders && window.MediaStreamTrack.prototype.applyConstraints) {
                connection.getSenders().forEach(function (sender) {
                  if (audio && sender.track && sender.track.kind === 'audio') {
                    queue.push(sender.track.applyConstraints(audio).catch(function (e) {
                      channel_log('apply audio constraints error: %o', e);
                    }));
                  }

                  if (video && sender.track && sender.track.kind === 'video') {
                    queue.push(sender.track.applyConstraints(video).catch(function (e) {
                      channel_log('apply video constraints error: %o', e);
                    }));
                  }
                });
              }

              _context11.next = 6;
              return Promise.all(queue);

            case 6:
            case "end":
              return _context11.stop();
          }
        }
      }, _callee11);
    }));
    return _applyConstraints.apply(this, arguments);
  }

  function getStats() {
    return _getStats.apply(this, arguments);
  }

  function _getStats() {
    _getStats = Object(asyncToGenerator["a" /* default */])(
    /*#__PURE__*/
    regeneratorRuntime.mark(function _callee12() {
      var stats;
      return regeneratorRuntime.wrap(function _callee12$(_context12) {
        while (1) {
          switch (_context12.prev = _context12.next) {
            case 0:
              channel_log('getStats()');

              if (!(connection.signalingState === 'stable')) {
                _context12.next = 14;
                break;
              }

              if (!channel_browser.chrome) {
                _context12.next = 8;
                break;
              }

              _context12.next = 5;
              return new Promise(function (resolve) {
                connection.getStats(function (stats) {
                  resolve(stats.result());
                });
              });

            case 5:
              stats = _context12.sent;
              _context12.next = 11;
              break;

            case 8:
              _context12.next = 10;
              return connection.getStats();

            case 10:
              stats = _context12.sent;

            case 11:
              rtcStats.update(stats);
              _context12.next = 15;
              break;

            case 14:
              channel_log('update rtc stats failed since connection is unstable.');

            case 15:
              return _context12.abrupt("return", rtcStats);

            case 16:
            case "end":
              return _context12.stop();
          }
        }
      }, _callee12);
    }));
    return _getStats.apply(this, arguments);
  }

  return channel_objectSpread({}, events, {
    get status() {
      return status;
    },

    get connection() {
      return connection;
    },

    get startTime() {
      return startTime;
    },

    get endTime() {
      return endTime;
    },

    isInProgress: isInProgress,
    isEstablished: isEstablished,
    isEnded: isEnded,
    getMute: getMute,
    getHold: getHold,
    connect: connect,
    terminate: terminate,
    renegotiate: renegotiate,
    mute: mute,
    unmute: unmute,
    hold: hold,
    unhold: unhold,
    getRemoteStream: getRemoteStream,
    getLocalStream: getLocalStream,
    replaceLocalStream: replaceLocalStream,
    adjustBandWidth: adjustBandWidth,
    applyConstraints: applyConstraints,
    getStats: getStats
  });
}
// EXTERNAL MODULE: ./node_modules/core-js/modules/es.array.from.js
var es_array_from = __webpack_require__("a630");

// EXTERNAL MODULE: ./node_modules/core-js/modules/es.array.sort.js
var es_array_sort = __webpack_require__("4e82");

// EXTERNAL MODULE: ./node_modules/core-js/modules/es.set.js
var es_set = __webpack_require__("6062");

// EXTERNAL MODULE: ./node_modules/core-js/modules/es.string.includes.js
var es_string_includes = __webpack_require__("2532");

// CONCATENATED MODULE: ./packages/meetnow/src/channel/sdp-modifier.ts
























var sdp_modifier_log = browser_default()('MN:SDP');
var sdp_modifier_browser = Object(src_browser["a" /* getBrowser */])();
function createModifier() {
  var _content = 'main';
  var _width = 1920;
  var _height = 1080;
  var _frameRate = 30;
  var _highFrameRate = false;

  var _prefer;

  var _unsupport;

  var modifier;

  function build() {
    return function (data) {
      var originator = data.originator,
          type = data.type;
      var sdp = parse(data.sdp);
      var maxWidth = _width;
      var maxHeight = _height;
      var maxFrameRate = _frameRate;
      var maxFrameSize = Math.ceil(maxWidth * maxHeight / 255);
      var maxMbps = Math.ceil(maxFrameRate * maxFrameSize);
      var bandwidth = maxHeight >= 1080 ? 2048 : maxHeight >= 720 ? 1280 : maxHeight >= 360 ? 512 : 512;
      bandwidth = Math.ceil(bandwidth * maxFrameRate / 30); // calc frameRate ratio
      // process sdp

      var _iteratorNormalCompletion = true;
      var _didIteratorError = false;
      var _iteratorError = undefined;

      try {
        var _loop = function _loop() {
          var m = _step.value;

          /*
          m.candidates = m.candidates.filter((c) =>
          {
            return c.component === 1;
          });
          */
          if (m.type === 'video') {
            m.content = _content;
            m.bandwidth = [{
              type: 'TIAS',
              limit: Math.ceil(bandwidth * 1024)
            }];
            var vp8Payloads = new Set();
            var h264Payloads = new Set();
            var vp8Config = ["max-fr=".concat(maxFrameRate), "max-fs=".concat(maxFrameSize)];
            var h264Config = ["max-mbps=".concat(maxMbps), "max-fs=".concat(maxFrameSize)]; // find codec payload

            var _iteratorNormalCompletion2 = true;
            var _didIteratorError2 = false;
            var _iteratorError2 = undefined;

            try {
              var _loop2 = function _loop2() {
                var r = _step2.value;
                var codec = r.codec.toUpperCase();
                var fmtp = void 0;

                switch (codec) {
                  case 'VP8':
                  case 'VP9':
                    vp8Payloads.add(Number(r.payload));
                    fmtp = m.fmtp.find(function (f) {
                      return f.payload === r.payload;
                    });

                    if (fmtp) {
                      fmtp.config = fmtp.config.split(';').filter(function (p) {
                        return !(/^max-fr/.test(p) || /^max-fs/.test(p));
                      }).concat(vp8Config).join(';');
                    } else {
                      m.fmtp.push({
                        payload: r.payload,
                        config: vp8Config.join(';')
                      });
                    }

                    break;

                  case 'H264':
                    h264Payloads.add(Number(r.payload));
                    fmtp = m.fmtp.find(function (f) {
                      return f.payload === r.payload;
                    });

                    if (fmtp) {
                      if (_highFrameRate && fmtp.config.indexOf('profile-level-id=42e01f') !== -1 && originator === 'local' && type === 'offer') {
                        fmtp.config = fmtp.config.split(';').filter(function (p) {
                          return !(/^max-mbps/.test(p) || /^max-fs/.test(p) || /^profile-level-id/.test(p));
                        }).concat(['profile-level-id=64001f']).concat(h264Config).join(';');
                      } else if (_highFrameRate && fmtp.config.indexOf('profile-level-id=64001f') !== -1 && originator === 'remote' && type === 'answer') {
                        fmtp.config = fmtp.config.split(';').filter(function (p) {
                          return !(/^max-mbps/.test(p) || /^max-fs/.test(p) || /^profile-level-id/.test(p));
                        }).concat(['profile-level-id=42e01f']).concat(h264Config).join(';');
                      } else {
                        fmtp.config = fmtp.config.split(';').filter(function (p) {
                          return !(/^max-mbps/.test(p) || /^max-fs/.test(p));
                        }).concat(h264Config).join(';');
                      }
                    } else {
                      m.fmtp.push({
                        payload: r.payload,
                        config: h264Config.join(';')
                      });
                    }

                    break;

                  default:
                    break;
                }
              };

              for (var _iterator2 = m.rtp[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
                _loop2();
              }
            } catch (err) {
              _didIteratorError2 = true;
              _iteratorError2 = err;
            } finally {
              try {
                if (!_iteratorNormalCompletion2 && _iterator2.return != null) {
                  _iterator2.return();
                }
              } finally {
                if (_didIteratorError2) {
                  throw _iteratorError2;
                }
              }
            }

            var _iteratorNormalCompletion3 = true;
            var _didIteratorError3 = false;
            var _iteratorError3 = undefined;

            try {
              for (var _iterator3 = m.fmtp[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
                var f = _step3.value;
                var aptConfig = f.config.split(';').find(function (p) {
                  return /^apt=/.test(p);
                });

                if (!aptConfig) {
                  continue;
                }

                var apt = aptConfig.split('=')[1];

                if (vp8Payloads.has(Number(apt))) {
                  vp8Payloads.add(Number(f.payload));
                } else if (h264Payloads.has(Number(apt))) {
                  h264Payloads.add(Number(f.payload));
                }
              }
            } catch (err) {
              _didIteratorError3 = true;
              _iteratorError3 = err;
            } finally {
              try {
                if (!_iteratorNormalCompletion3 && _iterator3.return != null) {
                  _iterator3.return();
                }
              } finally {
                if (_didIteratorError3) {
                  throw _iteratorError3;
                }
              }
            }

            var preferCodec = _prefer === 'vp8' ? vp8Payloads : _prefer === 'h264' ? h264Payloads : new Set();
            var unsupportCodec = _unsupport === 'vp8' ? vp8Payloads : _unsupport === 'h264' ? h264Payloads : new Set(); // firefox do not support multiple h264 codec/decode insts
            // when content sharing or using multiple tab, codec/decode might be error.
            // and chrome ver58 has a really low resolution in h264 codec when content sharing.
            // use VP8/VP9 first

            if (sdp_modifier_browser.firefox || sdp_modifier_browser.chrome && parseInt(sdp_modifier_browser.version, 10) < 63 && _content === 'slides') {
              preferCodec = vp8Payloads;
            }

            if (!preferCodec.size || !unsupportCodec.size) {
              var payloads = String(m.payloads).split(' ');
              payloads = payloads.filter(function (p) {
                return !preferCodec.has(Number(p));
              });
              payloads = payloads.filter(function (p) {
                return !unsupportCodec.has(Number(p));
              });
              payloads = Array.from(preferCodec).sort(function (x, y) {
                return x - y;
              }).concat(payloads);
              m.rtp = m.rtp.filter(function (r) {
                return !unsupportCodec.has(Number(r.payload));
              });
              m.fmtp = m.fmtp.filter(function (r) {
                return !unsupportCodec.has(Number(r.payload));
              });
              var rtps = [];
              var fmtps = [];
              payloads.forEach(function (p) {
                var rtp = m.rtp.find(function (r) {
                  return r.payload === Number(p);
                });
                var fmtp = m.fmtp.find(function (f) {
                  return f.payload === Number(p);
                });
                if (rtp) rtps.push(rtp);
                if (fmtp) fmtps.push(fmtp);
              });
              m.rtp = rtps;
              m.fmtp = fmtps;
              m.payloads = payloads.join(' ');
            }
          }

          if (m.type === 'audio') {
            m.bandwidth = [{
              type: 'TIAS',
              limit: Math.ceil(128 * 1024)
            }];
          }
        };

        for (var _iterator = sdp.media[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
          _loop();
        } // filter out unsupported application media

      } catch (err) {
        _didIteratorError = true;
        _iteratorError = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion && _iterator.return != null) {
            _iterator.return();
          }
        } finally {
          if (_didIteratorError) {
            throw _iteratorError;
          }
        }
      }

      sdp.media = sdp.media.filter(function (m) {
        return m.type !== 'application' || /TLS/.test(m.protocol);
      });

      if (originator === 'remote') {
        sdp.media.forEach(function (m) {
          var payloads = String(m.payloads).split(' ');

          if (m.rtcpFb) {
            var rtcpFb = [];
            m.rtcpFb.forEach(function (fb) {
              if (fb.payload === '*' || payloads.includes("".concat(fb.payload))) {
                rtcpFb.push(fb);
              }
            });
            m.rtcpFb = rtcpFb;
          }

          if (m.fmtp) {
            var fmtp = [];
            m.fmtp.forEach(function (fm) {
              if (fm.payload === '*' || payloads.includes("".concat(fm.payload))) {
                fmtp.push(fm);
              }
            });
            m.fmtp = fmtp;
          }

          if (m.rtp) {
            var rtp = [];
            m.rtp.forEach(function (r) {
              if (r.payload === '*' || payloads.includes("".concat(r.payload))) {
                rtp.push(r);
              }
            });
            m.rtp = rtp;
          }
        });

        if (type === 'offer' && sdp_modifier_browser.firefox) {
          sdp.media.forEach(function (m) {
            if (m.mid === undefined) {
              m.mid = m.type === 'audio' ? 0 : m.type === 'video' ? 1 : m.mid;
            }
          });
        }
      }

      data.sdp = write(sdp);
      sdp_modifier_log("".concat(originator, " sdp: \n\n %s \n"), data.sdp);
    };
  }

  return modifier = {
    content: function content(val) {
      _content = val;
      return modifier;
    },
    width: function width(val) {
      _width = val;
      return modifier;
    },
    height: function height(val) {
      _height = val;
      return modifier;
    },
    frameRate: function frameRate(val) {
      _frameRate = val;
      return modifier;
    },
    highFrameRate: function highFrameRate(val) {
      _highFrameRate = val;
      return modifier;
    },
    prefer: function prefer(val) {
      _prefer = val;
      return modifier;
    },
    unsupport: function unsupport(val) {
      _unsupport = val;
      return modifier;
    },
    build: build
  };
}
// CONCATENATED MODULE: ./packages/meetnow/src/channel/media-channel.ts










function media_channel_ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function media_channel_objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { media_channel_ownKeys(Object(source), true).forEach(function (key) { Object(defineProperty["a" /* default */])(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { media_channel_ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }





var media_channel_log = browser_default()('MN:MediaChannel');
function createMediaChannel(config) {
  var api = config.api,
      _config$type = config.type,
      type = _config$type === void 0 ? 'main' : _config$type;
  var mediaVersion;
  var callId;
  var request;
  var icetimmeout;

  var _localstream;

  var remotestream;
  var channel = createChannel({
    invite: function () {
      var _invite = Object(asyncToGenerator["a" /* default */])(
      /*#__PURE__*/
      regeneratorRuntime.mark(function _callee(offer) {
        var sdp, apiName, response, _response$data$data, _response$data$data$m, _response$data$data$m2;

        return regeneratorRuntime.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                media_channel_log('invite()');
                sdp = offer.sdp;
                apiName = mediaVersion ? type === 'main' ? 'renegMedia' : 'renegShare' : type === 'main' ? 'joinMedia' : 'joinShare';
                request = api.request(apiName).data({
                  sdp: sdp,
                  'media-version': mediaVersion
                });
                _context.next = 6;
                return request.send();

              case 6:
                response = _context.sent;
                _response$data$data = response.data.data;
                sdp = _response$data$data.sdp;
                _response$data$data$m = _response$data$data['media-version'];
                mediaVersion = _response$data$data$m === void 0 ? mediaVersion : _response$data$data$m;
                _response$data$data$m2 = _response$data$data['mcu-callid'];
                callId = _response$data$data$m2 === void 0 ? callId : _response$data$data$m2;
                media_channel_log('MCU call-id: %s', callId);
                return _context.abrupt("return", {
                  sdp: sdp
                });

              case 15:
              case "end":
                return _context.stop();
            }
          }
        }, _callee);
      }));

      function invite(_x) {
        return _invite.apply(this, arguments);
      }

      return invite;
    }(),
    confirm: function confirm() {
      media_channel_log('confirm()');
      request = undefined; // send confirm
    },
    cancel: function cancel() {
      media_channel_log('cancel()');
      request && request.cancel();
      request = undefined;
    },
    bye: function bye() {
      media_channel_log('bye()');
      request = undefined;
    },
    localstream: function localstream(stream) {
      _localstream = stream;
      channel.emit('localstream', _localstream);
    }
  });
  channel.on('sdp', createModifier().content(type).prefer('h264').build());
  channel.on('peerconnection', function (pc) {
    pc.addEventListener('connectionstatechange', function () {
      media_channel_log('peerconnection:connectionstatechange : %s', pc.connectionState);
    });
    pc.addEventListener('iceconnectionstatechange', function () {
      media_channel_log('peerconnection:iceconnectionstatechange : %s', pc.iceConnectionState);
    });
    pc.addEventListener('icegatheringstatechange', function () {
      media_channel_log('peerconnection:icegatheringstatechange : %s', pc.iceGatheringState);
    });
    pc.addEventListener('negotiationneeded', function () {
      media_channel_log('peerconnection:negotiationneeded');
      channel.emit('negotiationneeded');
    });
    pc.addEventListener('track', function (event) {
      media_channel_log('peerconnection:track: %o', event);
      remotestream = event.streams[0];
      channel.emit('remotestream', remotestream);
    }); // for old browser(firefox)

    pc.addEventListener('addstream', function (event) {
      media_channel_log('peerconnection:addstream: %o', event);
      remotestream = event.stream;
      channel.emit('remotestream', remotestream);
    });
    pc.addEventListener('removestream', function (event) {
      media_channel_log('peerconnection:removestream: %o', event);
      remotestream = channel.getRemoteStream();
      channel.emit('removestream', remotestream);
    });
  });
  channel.on('icecandidate', function (data) {
    var candidate = data.candidate,
        ready = data.ready;

    if (icetimmeout) {
      clearTimeout(icetimmeout);
      icetimmeout = undefined;
    }

    if (candidate) {
      icetimmeout = setTimeout(function () {
        media_channel_log('ICE gathering timeout in 3 seconds');
        ready();
      }, 3000);
    }
  });
  return media_channel_objectSpread({}, channel, {
    get status() {
      return channel.status;
    },

    get connection() {
      return channel.connection;
    },

    get startTime() {
      return channel.startTime;
    },

    get endTime() {
      return channel.endTime;
    },

    get version() {
      return mediaVersion;
    },

    get callId() {
      return callId;
    }

  });
}
// CONCATENATED MODULE: ./packages/meetnow/src/channel/message.ts



var MessageStatus;

(function (MessageStatus) {
  MessageStatus[MessageStatus["kNull"] = 0] = "kNull";
  MessageStatus[MessageStatus["kSending"] = 1] = "kSending";
  MessageStatus[MessageStatus["kSuccess"] = 2] = "kSuccess";
  MessageStatus[MessageStatus["kFailed"] = 3] = "kFailed";
})(MessageStatus || (MessageStatus = {}));

var message_log = browser_default()('MN:Message');
function createMessage(config) {
  var api = config.api,
      onSucceeded = config.onSucceeded,
      onFailed = config.onFailed;
  var status = MessageStatus.kNull;
  var direction = 'outgoing';
  var content;
  var timestamp;
  var version;
  /* eslint-disable-next-line prefer-destructuring */

  var sender = config.sender;
  var receiver;
  var isPrivate = false;
  var message;
  var request;

  function send(_x, _x2) {
    return _send.apply(this, arguments);
  }

  function _send() {
    _send = Object(asyncToGenerator["a" /* default */])(
    /*#__PURE__*/
    regeneratorRuntime.mark(function _callee(message, target) {
      var response, _response, data, _data$data;

      return regeneratorRuntime.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              message_log('send()');

              if (!(direction === 'incoming')) {
                _context.next = 3;
                break;
              }

              throw new Error('Invalid Status');

            case 3:
              status = MessageStatus.kSending;
              request = api.request('pushMessage').data({
                'im-context': message,
                'user-entity-list': target
              });
              _context.prev = 5;
              _context.next = 8;
              return request.send();

            case 8:
              response = _context.sent;
              _context.next = 16;
              break;

            case 11:
              _context.prev = 11;
              _context.t0 = _context["catch"](5);
              status = MessageStatus.kFailed;
              onFailed && onFailed(message);
              throw _context.t0;

            case 16:
              _response = response, data = _response.data;
              content = message;
              receiver = target;
              _data$data = data.data;
              version = _data$data['im-version'];
              timestamp = _data$data['im-timestamp'];
              status = MessageStatus.kSuccess;
              onSucceeded && onSucceeded(message);

            case 24:
            case "end":
              return _context.stop();
          }
        }
      }, _callee, null, [[5, 11]]);
    }));
    return _send.apply(this, arguments);
  }

  function retry() {
    return _retry.apply(this, arguments);
  }

  function _retry() {
    _retry = Object(asyncToGenerator["a" /* default */])(
    /*#__PURE__*/
    regeneratorRuntime.mark(function _callee2() {
      return regeneratorRuntime.wrap(function _callee2$(_context2) {
        while (1) {
          switch (_context2.prev = _context2.next) {
            case 0:
              message_log('retry()');

              if (content) {
                _context2.next = 3;
                break;
              }

              throw new Error('Invalid Message');

            case 3:
              _context2.next = 5;
              return send(content, receiver);

            case 5:
            case "end":
              return _context2.stop();
          }
        }
      }, _callee2);
    }));
    return _retry.apply(this, arguments);
  }

  function cancel() {
    message_log('cancel()');

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
      displayText: data['sender-display-text']
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
      return receiver && receiver.length > 0 || isPrivate;
    },

    send: send,
    retry: retry,
    cancel: cancel,
    incoming: incoming
  };
}
// CONCATENATED MODULE: ./packages/meetnow/src/channel/chat-channel.ts











function chat_channel_ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function chat_channel_objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { chat_channel_ownKeys(Object(source), true).forEach(function (key) { Object(defineProperty["a" /* default */])(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { chat_channel_ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }




var chat_channel_log = browser_default()('MN:ChatChannel');
function createChatChannel(config) {
  var api = config.api,
      sender = config.sender;
  var events = createEvents(chat_channel_log);
  var messages = [];
  var request;
  var ready = false;

  function connect() {
    return _connect.apply(this, arguments);
  }

  function _connect() {
    _connect = Object(asyncToGenerator["a" /* default */])(
    /*#__PURE__*/
    regeneratorRuntime.mark(function _callee() {
      var count,
          response,
          data,
          _args = arguments;
      return regeneratorRuntime.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              count = _args.length > 0 && _args[0] !== undefined ? _args[0] : 2000;
              chat_channel_log('connect()');

              if (!ready) {
                _context.next = 4;
                break;
              }

              return _context.abrupt("return");

            case 4:
              request = api.request('pullMessage').data({
                count: count
              });
              _context.next = 7;
              return request.send();

            case 7:
              response = _context.sent;
              data = response.data.data;
              messages = data.imInfos.map(function (msg) {
                return createMessage({
                  api: api
                }).incoming(msg);
              });
              ready = true;
              events.emit('ready');
              events.emit('connected');

            case 13:
            case "end":
              return _context.stop();
          }
        }
      }, _callee);
    }));
    return _connect.apply(this, arguments);
  }

  function terminate() {
    return _terminate.apply(this, arguments);
  }

  function _terminate() {
    _terminate = Object(asyncToGenerator["a" /* default */])(
    /*#__PURE__*/
    regeneratorRuntime.mark(function _callee2() {
      return regeneratorRuntime.wrap(function _callee2$(_context2) {
        while (1) {
          switch (_context2.prev = _context2.next) {
            case 0:
              chat_channel_log('terminate()');
              messages = [];
              ready = false;

              if (request) {
                request.cancel();
                request = undefined;
              }

              events.emit('disconnected');

            case 5:
            case "end":
              return _context2.stop();
          }
        }
      }, _callee2);
    }));
    return _terminate.apply(this, arguments);
  }

  function sendMessage(_x, _x2) {
    return _sendMessage.apply(this, arguments);
  }

  function _sendMessage() {
    _sendMessage = Object(asyncToGenerator["a" /* default */])(
    /*#__PURE__*/
    regeneratorRuntime.mark(function _callee3(msg, target) {
      var message;
      return regeneratorRuntime.wrap(function _callee3$(_context3) {
        while (1) {
          switch (_context3.prev = _context3.next) {
            case 0:
              chat_channel_log('sendMessage()');
              message = createMessage({
                api: api,
                sender: sender
              });
              events.emit('message', {
                originator: 'local',
                message: message
              });
              _context3.next = 5;
              return message.send(msg, target);

            case 5:
              messages.push(message);
              return _context3.abrupt("return", message);

            case 7:
            case "end":
              return _context3.stop();
          }
        }
      }, _callee3);
    }));
    return _sendMessage.apply(this, arguments);
  }

  function incoming(data) {
    chat_channel_log('incoming()');
    var message = createMessage({
      api: api
    }).incoming(data);
    events.emit('message', {
      originator: 'remote',
      message: message
    });
    messages.push(message);
    return message;
  }

  return chat_channel_objectSpread({}, events, {
    get ready() {
      return ready;
    },

    connect: connect,
    terminate: terminate,
    sendMessage: sendMessage,
    incoming: incoming
  });
}
// CONCATENATED MODULE: ./packages/meetnow/src/conference/index.ts














function conference_ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function conference_objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { conference_ownKeys(Object(source), true).forEach(function (key) { Object(defineProperty["a" /* default */])(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { conference_ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }











var conference_log = browser_default()('MN:Conference');
var miniprogram = Object(src_browser["b" /* isMiniProgram */])();
var conference_browser = Object(src_browser["a" /* getBrowser */])();
var conference_STATUS;

(function (STATUS) {
  STATUS[STATUS["kNull"] = 0] = "kNull";
  STATUS[STATUS["kConnecting"] = 1] = "kConnecting";
  STATUS[STATUS["kConnected"] = 2] = "kConnected";
  STATUS[STATUS["kDisconnecting"] = 3] = "kDisconnecting";
  STATUS[STATUS["kDisconnected"] = 4] = "kDisconnected";
})(conference_STATUS || (conference_STATUS = {}));

function createConference(config) {
  var api = config.api;
  var events = createEvents(conference_log);
  var keepalive;
  var polling;
  var information;
  var interceptor;
  var conference;
  var mediaChannel;
  var shareChannel;
  var chatChannel;
  var user; // current user

  var status = conference_STATUS.kNull;
  var uuid;
  var userId; // as conference entity

  var url;
  var request; // request chain

  var trtc;

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
    if (status !== condition) return;
    throw new Error(message || 'Invalid State');
  }

  function throwIfNotStatus(condition, message) {
    if (status === condition) return;
    throw new Error(message || 'Invalid State');
  }

  function onConnecting() {
    conference_log('conference connecting');
    status = conference_STATUS.kConnecting;
    events.emit('connecting');
  }

  function onConnected() {
    conference_log('conference connected');
    /* eslint-disable-next-line no-use-before-define */

    setup();
    status = conference_STATUS.kConnected;
    events.emit('connected');
  }

  function onDisconnecting() {
    conference_log('conference disconnecting');
    status = conference_STATUS.kDisconnecting;
    events.emit('disconnecting');
  }

  function onDisconnected(data) {
    conference_log('conference disconnected');
    /* eslint-disable-next-line no-use-before-define */

    cleanup();
    status = conference_STATUS.kDisconnected;
    events.emit('disconnected', data);
  }

  function onAccepted() {
    conference_log('conference accepted');
    events.emit('accepted');
  }

  function maybeChat() {
    return _maybeChat.apply(this, arguments);
  }

  function _maybeChat() {
    _maybeChat = Object(asyncToGenerator["a" /* default */])(
    /*#__PURE__*/
    regeneratorRuntime.mark(function _callee() {
      return regeneratorRuntime.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              if (chatChannel) {
                _context.next = 2;
                break;
              }

              return _context.abrupt("return");

            case 2:
              if (!chatChannel.ready) {
                _context.next = 4;
                break;
              }

              return _context.abrupt("return");

            case 4:
              _context.next = 6;
              return chatChannel.connect().catch(function () {});

            case 6:
            case "end":
              return _context.stop();
          }
        }
      }, _callee);
    }));
    return _maybeChat.apply(this, arguments);
  }

  function join() {
    return _join.apply(this, arguments);
  }

  function _join() {
    _join = Object(asyncToGenerator["a" /* default */])(
    /*#__PURE__*/
    regeneratorRuntime.mark(function _callee2() {
      var options,
          response,
          data,
          hasMedia,
          _response,
          useragent,
          clientinfo,
          apiName,
          _response2,
          _data$data,
          _response3,
          info,
          context,
          _args2 = arguments;

      return regeneratorRuntime.wrap(function _callee2$(_context2) {
        while (1) {
          switch (_context2.prev = _context2.next) {
            case 0:
              options = _args2.length > 0 && _args2[0] !== undefined ? _args2[0] : {};
              conference_log('join()');
              throwIfNotStatus(conference_STATUS.kNull);

              if (!(!options.url && !options.number)) {
                _context2.next = 5;
                break;
              }

              throw new TypeError('Invalid Number');

            case 5:
              status = conference_STATUS.kConnecting;
              onConnecting();
              hasMedia = true;

              if (!(!options.url && options.number)) {
                _context2.next = 16;
                break;
              }

              request = api.request('getURL').data({
                'long-number': options.number
              });
              _context2.next = 12;
              return request.send();

            case 12:
              response = _context2.sent;
              _response = response;
              data = _response.data;
              options.url = data.data.url;

            case 16:
              useragent = config_config["a" /* CONFIG */].get('useragent', "Yealink ".concat(miniprogram ? 'WECHAT' : 'WEB-APP', " ").concat("1.1.3-beta"));
              clientinfo = config_config["a" /* CONFIG */].get('clientinfo', "".concat(miniprogram ? 'Apollo_WeChat' : 'Apollo_WebRTC', " ").concat("1.1.3-beta")); // join focus

              apiName = miniprogram ? 'joinWechat' : 'joinFocus';
              request = api.request(apiName).data({
                // 'conference-uuid'     : null,
                // 'conference-user-id'  : null,
                'conference-url': options.url,
                'conference-pwd': options.password,
                'user-agent': useragent,
                'client-url': options.url.replace(/\w+@/g, miniprogram ? 'wechat@' : 'webrtc@'),
                'client-display-text': options.displayName || "".concat(conference_browser),
                'client-type': 'http',
                'client-info': clientinfo,
                'pure-ctrl-channel': !hasMedia,
                // if join with media
                'is-webrtc': !miniprogram && hasMedia,
                'is-wechat': miniprogram,
                'video-session-info': miniprogram && {
                  bitrate: 600 * 1024,
                  'video-width': 640,
                  'video-height': 360,
                  'frame-rate': 15
                }
              });
              _context2.prev = 20;
              _context2.next = 23;
              return request.send();

            case 23:
              response = _context2.sent;
              _context2.next = 30;
              break;

            case 26:
              _context2.prev = 26;
              _context2.t0 = _context2["catch"](20);
              events.emit('failed', _context2.t0);
              throw _context2.t0;

            case 30:
              _response2 = response;
              data = _response2.data;
              _data$data = data.data;
              userId = _data$data['conference-user-id'];
              uuid = _data$data['conference-uuid'];
              trtc = miniprogram ? data.data : {};
              onAccepted();

              if (!(!userId || !uuid)) {
                _context2.next = 40;
                break;
              }

              conference_log('internal error');
              throw new Error('Internal Error');

            case 40:
              url = options.url;
              // setup request interceptor for ctrl api
              interceptor = api.interceptors.request.use(function (config) {
                if (/conference-ctrl/.test(config.url) && config.method === 'post') {
                  config.data = conference_objectSpread({
                    'conference-user-id': userId,
                    'conference-uuid': uuid
                  }, config.data);
                }

                return config;
              }); // get full info

              request = api.request('getFullInfo');
              _context2.prev = 43;
              _context2.next = 46;
              return request.send();

            case 46:
              response = _context2.sent;
              _context2.next = 53;
              break;

            case 49:
              _context2.prev = 49;
              _context2.t1 = _context2["catch"](43);
              events.emit('failed', _context2.t1);
              throw _context2.t1;

            case 53:
              _response3 = response;
              data = _response3.data;
              info = data.data; // create context

              context = createContext(conference); // create information

              information = createInformation(info, context);
              onConnected();
              return _context2.abrupt("return", conference);

            case 60:
            case "end":
              return _context2.stop();
          }
        }
      }, _callee2, null, [[20, 26], [43, 49]]);
    }));
    return _join.apply(this, arguments);
  }

  function leave() {
    return _leave.apply(this, arguments);
  }

  function _leave() {
    _leave = Object(asyncToGenerator["a" /* default */])(
    /*#__PURE__*/
    regeneratorRuntime.mark(function _callee3() {
      return regeneratorRuntime.wrap(function _callee3$(_context3) {
        while (1) {
          switch (_context3.prev = _context3.next) {
            case 0:
              throwIfStatus(conference_STATUS.kDisconnecting);
              throwIfStatus(conference_STATUS.kDisconnected);
              _context3.t0 = status;
              _context3.next = _context3.t0 === conference_STATUS.kNull ? 5 : _context3.t0 === conference_STATUS.kConnecting ? 6 : _context3.t0 === conference_STATUS.kConnected ? 6 : _context3.t0 === conference_STATUS.kDisconnecting ? 15 : _context3.t0 === conference_STATUS.kDisconnected ? 15 : 15;
              break;

            case 5:
              return _context3.abrupt("break", 16);

            case 6:
              if (!(status === conference_STATUS.kConnected)) {
                _context3.next = 13;
                break;
              }

              onDisconnecting();
              _context3.next = 10;
              return api.request('leave').send().catch(function (error) {
                conference_log('leave error: ', error);
              });

            case 10:
              onDisconnected();
              _context3.next = 14;
              break;

            case 13:
              if (request) {
                request.cancel();
                onDisconnected();
              }

            case 14:
              return _context3.abrupt("break", 16);

            case 15:
              return _context3.abrupt("break", 16);

            case 16:
              return _context3.abrupt("return", conference);

            case 17:
            case "end":
              return _context3.stop();
          }
        }
      }, _callee3);
    }));
    return _leave.apply(this, arguments);
  }

  function end() {
    return _end.apply(this, arguments);
  }

  function _end() {
    _end = Object(asyncToGenerator["a" /* default */])(
    /*#__PURE__*/
    regeneratorRuntime.mark(function _callee4() {
      return regeneratorRuntime.wrap(function _callee4$(_context4) {
        while (1) {
          switch (_context4.prev = _context4.next) {
            case 0:
              throwIfNotStatus(conference_STATUS.kConnected);
              _context4.next = 3;
              return leave();

            case 3:
              _context4.next = 5;
              return api.request('end').data({
                'conference-url': url
              }).send();

            case 5:
              return _context4.abrupt("return", conference);

            case 6:
            case "end":
              return _context4.stop();
          }
        }
      }, _callee4);
    }));
    return _end.apply(this, arguments);
  }

  function setup() {
    getCurrentUser();
    var _information = information,
        state = _information.state,
        users = _information.users;
    state.on('sharingUserEntityChanged', function (val) {
      // in some cases, eg. whitebord sharing
      // sharing use entity is an new unique id, which can not be find in user list
      // use the second param the help making sharing detection strategy
      // 1. no user & no entity => no sharing
      // 2. no user & has entity => sharing
      // 3. has user => sharing
      events.emit('sharinguser', users.getUser(val), val);
    });
    state.on('speechUserEntityChanged', function (val) {
      // just in case, for the same reason with sharing use entity
      events.emit('speechuser', users.getUser(val), val);
    });
    users.on('user:added', function () {
      for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }

      return events.emit.apply(events, ['user:added'].concat(args));
    });
    users.on('user:updated', function () {
      for (var _len2 = arguments.length, args = new Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
        args[_key2] = arguments[_key2];
      }

      return events.emit.apply(events, ['user:updated'].concat(args));
    });
    users.on('user:deleted', function () {
      for (var _len3 = arguments.length, args = new Array(_len3), _key3 = 0; _key3 < _len3; _key3++) {
        args[_key3] = arguments[_key3];
      }

      return events.emit.apply(events, ['user:deleted'].concat(args));
    }); // create keepalive worker

    keepalive = createKeepAlive({
      api: api
    }); // create polling worker

    polling = createPolling({
      api: api,
      onInformation: function onInformation(data) {
        conference_log('receive information: %o', data);
        information.update(data);
        events.emit('information', information);
        getCurrentUser();
      },
      onMessage: function onMessage(data) {
        conference_log('receive message: %o', data);
        chatChannel.incoming(data);
      },
      onRenegotiate: function onRenegotiate(data) {
        conference_log('receive renegotiate: %o', data);
        mediaChannel.renegotiate();
      },
      onQuit: function onQuit(data) {
        conference_log('receive quit: %o', data);

        if (status === conference_STATUS.kDisconnecting || status === conference_STATUS.kDisconnected) {
          conference_log('receive quit while disconnecting, ignore it');
          return;
        } // bizCode = 901314 ended by presenter
        // bizCode = 901320 kicked by presenter


        onDisconnected(data);
      },
      onError: function onError(data) {
        conference_log('polling error: %o', data);

        if (status === conference_STATUS.kDisconnecting || status === conference_STATUS.kDisconnected) {
          conference_log('polling error while disconnecting, ignore it');
          return;
        }

        if (data.message === 'Network Error') {
          conference_log('polling error while network error');
          return;
        }

        events.emit('error', data); // there are some problems with polling
        // leave conference
        //

        onDisconnected(data);
      }
    }); // start keepalive & polling

    keepalive.start();
    polling.start(); // create channels

    mediaChannel = createMediaChannel({
      api: api,
      type: 'main'
    });
    shareChannel = createMediaChannel({
      api: api,
      type: 'slides'
    });
    chatChannel = createChatChannel({
      api: api
    });
    chatChannel.on('message', function () {
      for (var _len4 = arguments.length, args = new Array(_len4), _key4 = 0; _key4 < _len4; _key4++) {
        args[_key4] = arguments[_key4];
      }

      return events.emit.apply(events, ['message'].concat(args));
    });
    chatChannel.on('ready', function () {
      for (var _len5 = arguments.length, args = new Array(_len5), _key5 = 0; _key5 < _len5; _key5++) {
        args[_key5] = arguments[_key5];
      }

      return events.emit.apply(events, ['chatready'].concat(args));
    });
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

  function share(_x) {
    return _share.apply(this, arguments);
  }

  function _share() {
    _share = Object(asyncToGenerator["a" /* default */])(
    /*#__PURE__*/
    regeneratorRuntime.mark(function _callee5(options) {
      return regeneratorRuntime.wrap(function _callee5$(_context5) {
        while (1) {
          switch (_context5.prev = _context5.next) {
            case 0:
              throwIfNotStatus(conference_STATUS.kConnected);

              if (!(!shareChannel.isInProgress() && !shareChannel.isEstablished())) {
                _context5.next = 4;
                break;
              }

              _context5.next = 4;
              return shareChannel.connect(options);

            case 4:
              _context5.next = 6;
              return api.request('switchShare').data({
                share: true
              }).send();

            case 6:
            case "end":
              return _context5.stop();
          }
        }
      }, _callee5);
    }));
    return _share.apply(this, arguments);
  }

  function setSharing() {
    return _setSharing.apply(this, arguments);
  }

  function _setSharing() {
    _setSharing = Object(asyncToGenerator["a" /* default */])(
    /*#__PURE__*/
    regeneratorRuntime.mark(function _callee6() {
      var enable,
          _args6 = arguments;
      return regeneratorRuntime.wrap(function _callee6$(_context6) {
        while (1) {
          switch (_context6.prev = _context6.next) {
            case 0:
              enable = _args6.length > 0 && _args6[0] !== undefined ? _args6[0] : true;
              throwIfNotStatus(conference_STATUS.kConnected);
              _context6.next = 4;
              return api.request('switchShare').data({
                share: enable
              }).send();

            case 4:
            case "end":
              return _context6.stop();
          }
        }
      }, _callee6);
    }));
    return _setSharing.apply(this, arguments);
  }

  function sendMessage(_x2, _x3) {
    return _sendMessage.apply(this, arguments);
  }

  function _sendMessage() {
    _sendMessage = Object(asyncToGenerator["a" /* default */])(
    /*#__PURE__*/
    regeneratorRuntime.mark(function _callee7(msg, target) {
      return regeneratorRuntime.wrap(function _callee7$(_context7) {
        while (1) {
          switch (_context7.prev = _context7.next) {
            case 0:
              throwIfNotStatus(conference_STATUS.kConnected);

              if (!(!chatChannel || !chatChannel.ready)) {
                _context7.next = 3;
                break;
              }

              throw new Error('Not Ready');

            case 3:
              _context7.next = 5;
              return chatChannel.sendMessage(msg, target);

            case 5:
            case "end":
              return _context7.stop();
          }
        }
      }, _callee7);
    }));
    return _sendMessage.apply(this, arguments);
  }

  return conference = conference_objectSpread({}, events, {
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
      return "".concat(userId);
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

    join: join,
    leave: leave,
    end: end,
    share: share,
    setSharing: setSharing,
    sendMessage: sendMessage
  });
}
// CONCATENATED MODULE: ./packages/meetnow/src/user-agent/index.ts














function user_agent_ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function user_agent_objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { user_agent_ownKeys(Object(source), true).forEach(function (key) { Object(defineProperty["a" /* default */])(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { user_agent_ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }




var user_agent_log = browser_default()('MN:UA');
function urlToNumber(url) {
  var parts = url.split('@');
  var number = parts[0];
  var enterprise = parts[1].split('.')[0];
  return "".concat(number, ".").concat(enterprise);
}
function createUA() {
  var config = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  var auth = config.auth;
  var api;

  if (auth) {
    var _auth = auth;
    api = _auth.api;
  } // fetch conference basic info


  function fetch(_x) {
    return _fetch.apply(this, arguments);
  }

  function _fetch() {
    _fetch = Object(asyncToGenerator["a" /* default */])(
    /*#__PURE__*/
    regeneratorRuntime.mark(function _callee(number) {
      var response, data, info, partyId, url, _response, _data$data, _response2, _response3;

      return regeneratorRuntime.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              user_agent_log('fetch()');

              if (!api) {
                api = Object(user_api["a" /* createUserApi */])();
              } // get conference url


              _context.next = 4;
              return api.request('getURL').data({
                'long-number': number
              }).send();

            case 4:
              response = _context.sent;
              _response = response;
              data = _response.data;
              _data$data = data.data;
              partyId = _data$data['party-id'];
              url = _data$data.url;
              _context.prev = 10;
              _context.next = 13;
              return api.request('getBasicInfo').data({
                'conference-url': url
              }).send();

            case 13:
              response = _context.sent;
              _response2 = response;
              data = _response2.data;
              info = data.data;
              _context.next = 34;
              break;

            case 19:
              _context.prev = 19;
              _context.t0 = _context["catch"](10);
              user_agent_log('Conference not started.');
              _context.prev = 22;
              _context.next = 25;
              return api.request('getBasicInfoOffline').data({
                'long-number': number
              }).send();

            case 25:
              response = _context.sent;
              _response3 = response;
              data = _response3.data;
              info = data.data;
              _context.next = 34;
              break;

            case 31:
              _context.prev = 31;
              _context.t1 = _context["catch"](22);
              user_agent_log('Conference not exist.');

            case 34:
              if (info) {
                _context.next = 36;
                break;
              }

              throw new Error('Not Exist');

            case 36:
              return _context.abrupt("return", {
                partyId: partyId,
                number: number,
                url: url,
                info: info
              });

            case 37:
            case "end":
              return _context.stop();
          }
        }
      }, _callee, null, [[10, 19], [22, 31]]);
    }));
    return _fetch.apply(this, arguments);
  }

  function connect(_x2) {
    return _connect.apply(this, arguments);
  }

  function _connect() {
    _connect = Object(asyncToGenerator["a" /* default */])(
    /*#__PURE__*/
    regeneratorRuntime.mark(function _callee2(options) {
      var partyId, url, number, response, data, _data$data2, isTempAuthLocallyGenerated, _auth2, conference, join;

      return regeneratorRuntime.wrap(function _callee2$(_context2) {
        while (1) {
          switch (_context2.prev = _context2.next) {
            case 0:
              user_agent_log('connect()');

              // create user api
              if (!api) {
                api = Object(user_api["a" /* createUserApi */])();
              }

              if (options.number) {
                _context2.next = 4;
                break;
              }

              throw new TypeError('Invalid Number');

            case 4:
              number = options.number; // get conference url

              _context2.next = 7;
              return api.request('getURL').data({
                'long-number': number
              }).send();

            case 7:
              response = _context2.sent;
              data = response.data;
              /* eslint-disable-next-line prefer-const */

              _data$data2 = data.data;
              partyId = _data$data2['party-id'];
              url = _data$data2.url;

              if (partyId) {
                _context2.next = 14;
                break;
              }

              throw new TypeError('Invalid Number');

            case 14:
              isTempAuthLocallyGenerated = false; // temp auth

              if (!(!auth || !auth.token)) {
                _context2.next = 22;
                break;
              }

              _context2.next = 18;
              return Object(temp_auth["a" /* createTempAuth */])(partyId);

            case 18:
              auth = _context2.sent;
              _auth2 = auth;
              api = _auth2.api;
              isTempAuthLocallyGenerated = true;

            case 22:
              // create stand alone user api for conference.
              // auth is required
              conference = createConference({
                api: api
              }); // hack join method

              join = conference.join;

              conference.join = function (additional) {
                return join(user_agent_objectSpread({
                  url: url
                }, options, {}, additional));
              };

              if (isTempAuthLocallyGenerated) {
                conference.once('disconnected', auth.invalid);
              }

              return _context2.abrupt("return", conference);

            case 27:
            case "end":
              return _context2.stop();
          }
        }
      }, _callee2);
    }));
    return _connect.apply(this, arguments);
  }

  return {
    fetch: fetch,
    connect: connect
  };
}
// CONCATENATED MODULE: ./packages/meetnow/src/index.ts












if (false) {}

var src_log = browser_default()('MN');
var src_version = "1.1.3-beta"; // global setup

function src_setup(config) {
  Object(src_config["a" /* setupConfig */])(config);

  if (Object(src_browser["b" /* isMiniProgram */])()) {
    axios_default.a.defaults.adapter = mpAdapter;
  }

  browser_default.a.enable(config_config["a" /* CONFIG */].get('debug', 'MN*,-MN:Api*,-MN:Information:Item,-MN:Worker'));
  src_log('setup() [version]: %s', src_version);
}

function src_connect(_x) {
  return meetnow_src_connect.apply(this, arguments);
}

function meetnow_src_connect() {
  meetnow_src_connect = Object(asyncToGenerator["a" /* default */])(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee(options) {
    var ua, conference;
    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            ua = createUA();
            _context.next = 3;
            return ua.connect(options);

          case 3:
            conference = _context.sent;
            return _context.abrupt("return", conference);

          case 5:
          case "end":
            return _context.stop();
        }
      }
    }, _callee);
  }));
  return meetnow_src_connect.apply(this, arguments);
}
// CONCATENATED MODULE: ./node_modules/@vue/cli-service/lib/commands/build/entry-lib-no-default.js
/* concated harmony reexport debug */__webpack_require__.d(__webpack_exports__, "debug", function() { return browser_default.a; });
/* concated harmony reexport axios */__webpack_require__.d(__webpack_exports__, "axios", function() { return axios_default.a; });
/* concated harmony reexport adapter */__webpack_require__.d(__webpack_exports__, "adapter", function() { return mpAdapter; });
/* concated harmony reexport version */__webpack_require__.d(__webpack_exports__, "version", function() { return src_version; });
/* concated harmony reexport setup */__webpack_require__.d(__webpack_exports__, "setup", function() { return src_setup; });
/* concated harmony reexport AuthType */__webpack_require__.d(__webpack_exports__, "AuthType", function() { return src_auth["AuthType"]; });
/* concated harmony reexport bootstrap */__webpack_require__.d(__webpack_exports__, "bootstrap", function() { return src_auth["bootstrap"]; });
/* concated harmony reexport createUserApi */__webpack_require__.d(__webpack_exports__, "createUserApi", function() { return user_api["a" /* createUserApi */]; });
/* concated harmony reexport createUA */__webpack_require__.d(__webpack_exports__, "createUA", function() { return createUA; });
/* concated harmony reexport fetchControlUrl */__webpack_require__.d(__webpack_exports__, "fetchControlUrl", function() { return src_auth["fetchControlUrl"]; });
/* concated harmony reexport connect */__webpack_require__.d(__webpack_exports__, "connect", function() { return src_connect; });




/***/ }),

/***/ "fb6a":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var $ = __webpack_require__("23e7");
var isObject = __webpack_require__("861d");
var isArray = __webpack_require__("e8b5");
var toAbsoluteIndex = __webpack_require__("23cb");
var toLength = __webpack_require__("50c4");
var toIndexedObject = __webpack_require__("fc6a");
var createProperty = __webpack_require__("8418");
var arrayMethodHasSpeciesSupport = __webpack_require__("1dde");
var wellKnownSymbol = __webpack_require__("b622");

var SPECIES = wellKnownSymbol('species');
var nativeSlice = [].slice;
var max = Math.max;

// `Array.prototype.slice` method
// https://tc39.github.io/ecma262/#sec-array.prototype.slice
// fallback for not array-like ES3 strings and DOM objects
$({ target: 'Array', proto: true, forced: !arrayMethodHasSpeciesSupport('slice') }, {
  slice: function slice(start, end) {
    var O = toIndexedObject(this);
    var length = toLength(O.length);
    var k = toAbsoluteIndex(start, length);
    var fin = toAbsoluteIndex(end === undefined ? length : end, length);
    // inline `ArraySpeciesCreate` for usage native `Array#slice` where it's possible
    var Constructor, result, n;
    if (isArray(O)) {
      Constructor = O.constructor;
      // cross-realm fallback
      if (typeof Constructor == 'function' && (Constructor === Array || isArray(Constructor.prototype))) {
        Constructor = undefined;
      } else if (isObject(Constructor)) {
        Constructor = Constructor[SPECIES];
        if (Constructor === null) Constructor = undefined;
      }
      if (Constructor === Array || Constructor === undefined) {
        return nativeSlice.call(O, k, fin);
      }
    }
    result = new (Constructor === undefined ? Array : Constructor)(max(fin - k, 0));
    for (n = 0; k < fin; k++, n++) if (k in O) createProperty(result, n, O[k]);
    result.length = n;
    return result;
  }
});


/***/ }),

/***/ "fc6a":
/***/ (function(module, exports, __webpack_require__) {

// toObject with fallback for non-array-like ES3 strings
var IndexedObject = __webpack_require__("44ad");
var requireObjectCoercible = __webpack_require__("1d80");

module.exports = function (it) {
  return IndexedObject(requireObjectCoercible(it));
};


/***/ }),

/***/ "fdbc":
/***/ (function(module, exports) {

// iterable DOM collections
// flag - `iterable` interface - 'entries', 'keys', 'values', 'forEach' methods
module.exports = {
  CSSRuleList: 0,
  CSSStyleDeclaration: 0,
  CSSValueList: 0,
  ClientRectList: 0,
  DOMRectList: 0,
  DOMStringList: 0,
  DOMTokenList: 1,
  DataTransferItemList: 0,
  FileList: 0,
  HTMLAllCollection: 0,
  HTMLCollection: 0,
  HTMLFormElement: 0,
  HTMLSelectElement: 0,
  MediaList: 0,
  MimeTypeArray: 0,
  NamedNodeMap: 0,
  NodeList: 1,
  PaintRequestList: 0,
  Plugin: 0,
  PluginArray: 0,
  SVGLengthList: 0,
  SVGNumberList: 0,
  SVGPathSegList: 0,
  SVGPointList: 0,
  SVGStringList: 0,
  SVGTransformList: 0,
  SourceBufferList: 0,
  StyleSheetList: 0,
  TextTrackCueList: 0,
  TextTrackList: 0,
  TouchList: 0
};


/***/ }),

/***/ "fea9":
/***/ (function(module, exports, __webpack_require__) {

var global = __webpack_require__("da84");

module.exports = global.Promise;


/***/ })

/******/ });
});