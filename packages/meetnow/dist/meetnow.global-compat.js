(function (exports, debug, axios) {
	'use strict';

	debug = debug && debug.hasOwnProperty('default') ? debug['default'] : debug;
	axios = axios && axios.hasOwnProperty('default') ? axios['default'] : axios;

	var commonjsGlobal = typeof globalThis !== 'undefined' ? globalThis : typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : {};

	function createCommonjsModule(fn, module) {
		return module = { exports: {} }, fn(module, module.exports), module.exports;
	}

	var runtime = createCommonjsModule(function (module) {
	/**
	 * Copyright (c) 2014-present, Facebook, Inc.
	 *
	 * This source code is licensed under the MIT license found in the
	 * LICENSE file in the root directory of this source tree.
	 */

	!(function(global) {

	  var Op = Object.prototype;
	  var hasOwn = Op.hasOwnProperty;
	  var undefined$1; // More compressible than void 0.
	  var $Symbol = typeof Symbol === "function" ? Symbol : {};
	  var iteratorSymbol = $Symbol.iterator || "@@iterator";
	  var asyncIteratorSymbol = $Symbol.asyncIterator || "@@asyncIterator";
	  var toStringTagSymbol = $Symbol.toStringTag || "@@toStringTag";
	  var runtime = global.regeneratorRuntime;
	  if (runtime) {
	    {
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
	  runtime = global.regeneratorRuntime =  module.exports ;

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
	    if (method === undefined$1) {
	      // A .throw or .return when the delegate iterator has no .throw
	      // method always terminates the yield* loop.
	      context.delegate = null;

	      if (context.method === "throw") {
	        if (delegate.iterator.return) {
	          // If the delegate iterator has a return method, give it a
	          // chance to clean up.
	          context.method = "return";
	          context.arg = undefined$1;
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
	        context.arg = undefined$1;
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

	          next.value = undefined$1;
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
	    return { value: undefined$1, done: true };
	  }

	  Context.prototype = {
	    constructor: Context,

	    reset: function(skipTempReset) {
	      this.prev = 0;
	      this.next = 0;
	      // Resetting context._sent for legacy support of Babel's
	      // function.sent implementation.
	      this.sent = this._sent = undefined$1;
	      this.done = false;
	      this.delegate = null;

	      this.method = "next";
	      this.arg = undefined$1;

	      this.tryEntries.forEach(resetTryEntry);

	      if (!skipTempReset) {
	        for (var name in this) {
	          // Not sure about the optimal order of these conditions:
	          if (name.charAt(0) === "t" &&
	              hasOwn.call(this, name) &&
	              !isNaN(+name.slice(1))) {
	            this[name] = undefined$1;
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
	          context.arg = undefined$1;
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
	        this.arg = undefined$1;
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
	});

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

	var check = function (it) {
	  return it && it.Math == Math && it;
	};

	// https://github.com/zloirock/core-js/issues/86#issuecomment-115759028
	var global_1 =
	  // eslint-disable-next-line no-undef
	  check(typeof globalThis == 'object' && globalThis) ||
	  check(typeof window == 'object' && window) ||
	  check(typeof self == 'object' && self) ||
	  check(typeof commonjsGlobal == 'object' && commonjsGlobal) ||
	  // eslint-disable-next-line no-new-func
	  Function('return this')();

	var fails = function (exec) {
	  try {
	    return !!exec();
	  } catch (error) {
	    return true;
	  }
	};

	// Thank's IE8 for his funny defineProperty
	var descriptors = !fails(function () {
	  return Object.defineProperty({}, 'a', { get: function () { return 7; } }).a != 7;
	});

	var nativePropertyIsEnumerable = {}.propertyIsEnumerable;
	var getOwnPropertyDescriptor = Object.getOwnPropertyDescriptor;

	// Nashorn ~ JDK8 bug
	var NASHORN_BUG = getOwnPropertyDescriptor && !nativePropertyIsEnumerable.call({ 1: 2 }, 1);

	// `Object.prototype.propertyIsEnumerable` method implementation
	// https://tc39.github.io/ecma262/#sec-object.prototype.propertyisenumerable
	var f = NASHORN_BUG ? function propertyIsEnumerable(V) {
	  var descriptor = getOwnPropertyDescriptor(this, V);
	  return !!descriptor && descriptor.enumerable;
	} : nativePropertyIsEnumerable;

	var objectPropertyIsEnumerable = {
		f: f
	};

	var createPropertyDescriptor = function (bitmap, value) {
	  return {
	    enumerable: !(bitmap & 1),
	    configurable: !(bitmap & 2),
	    writable: !(bitmap & 4),
	    value: value
	  };
	};

	var toString = {}.toString;

	var classofRaw = function (it) {
	  return toString.call(it).slice(8, -1);
	};

	var split = ''.split;

	// fallback for non-array-like ES3 and non-enumerable old V8 strings
	var indexedObject = fails(function () {
	  // throws an error in rhino, see https://github.com/mozilla/rhino/issues/346
	  // eslint-disable-next-line no-prototype-builtins
	  return !Object('z').propertyIsEnumerable(0);
	}) ? function (it) {
	  return classofRaw(it) == 'String' ? split.call(it, '') : Object(it);
	} : Object;

	// `RequireObjectCoercible` abstract operation
	// https://tc39.github.io/ecma262/#sec-requireobjectcoercible
	var requireObjectCoercible = function (it) {
	  if (it == undefined) throw TypeError("Can't call method on " + it);
	  return it;
	};

	// toObject with fallback for non-array-like ES3 strings



	var toIndexedObject = function (it) {
	  return indexedObject(requireObjectCoercible(it));
	};

	var isObject = function (it) {
	  return typeof it === 'object' ? it !== null : typeof it === 'function';
	};

	// `ToPrimitive` abstract operation
	// https://tc39.github.io/ecma262/#sec-toprimitive
	// instead of the ES6 spec version, we didn't implement @@toPrimitive case
	// and the second argument - flag - preferred type is a string
	var toPrimitive = function (input, PREFERRED_STRING) {
	  if (!isObject(input)) return input;
	  var fn, val;
	  if (PREFERRED_STRING && typeof (fn = input.toString) == 'function' && !isObject(val = fn.call(input))) return val;
	  if (typeof (fn = input.valueOf) == 'function' && !isObject(val = fn.call(input))) return val;
	  if (!PREFERRED_STRING && typeof (fn = input.toString) == 'function' && !isObject(val = fn.call(input))) return val;
	  throw TypeError("Can't convert object to primitive value");
	};

	var hasOwnProperty = {}.hasOwnProperty;

	var has = function (it, key) {
	  return hasOwnProperty.call(it, key);
	};

	var document$1 = global_1.document;
	// typeof document.createElement is 'object' in old IE
	var EXISTS = isObject(document$1) && isObject(document$1.createElement);

	var documentCreateElement = function (it) {
	  return EXISTS ? document$1.createElement(it) : {};
	};

	// Thank's IE8 for his funny defineProperty
	var ie8DomDefine = !descriptors && !fails(function () {
	  return Object.defineProperty(documentCreateElement('div'), 'a', {
	    get: function () { return 7; }
	  }).a != 7;
	});

	var nativeGetOwnPropertyDescriptor = Object.getOwnPropertyDescriptor;

	// `Object.getOwnPropertyDescriptor` method
	// https://tc39.github.io/ecma262/#sec-object.getownpropertydescriptor
	var f$1 = descriptors ? nativeGetOwnPropertyDescriptor : function getOwnPropertyDescriptor(O, P) {
	  O = toIndexedObject(O);
	  P = toPrimitive(P, true);
	  if (ie8DomDefine) try {
	    return nativeGetOwnPropertyDescriptor(O, P);
	  } catch (error) { /* empty */ }
	  if (has(O, P)) return createPropertyDescriptor(!objectPropertyIsEnumerable.f.call(O, P), O[P]);
	};

	var objectGetOwnPropertyDescriptor = {
		f: f$1
	};

	var anObject = function (it) {
	  if (!isObject(it)) {
	    throw TypeError(String(it) + ' is not an object');
	  } return it;
	};

	var nativeDefineProperty = Object.defineProperty;

	// `Object.defineProperty` method
	// https://tc39.github.io/ecma262/#sec-object.defineproperty
	var f$2 = descriptors ? nativeDefineProperty : function defineProperty(O, P, Attributes) {
	  anObject(O);
	  P = toPrimitive(P, true);
	  anObject(Attributes);
	  if (ie8DomDefine) try {
	    return nativeDefineProperty(O, P, Attributes);
	  } catch (error) { /* empty */ }
	  if ('get' in Attributes || 'set' in Attributes) throw TypeError('Accessors not supported');
	  if ('value' in Attributes) O[P] = Attributes.value;
	  return O;
	};

	var objectDefineProperty = {
		f: f$2
	};

	var createNonEnumerableProperty = descriptors ? function (object, key, value) {
	  return objectDefineProperty.f(object, key, createPropertyDescriptor(1, value));
	} : function (object, key, value) {
	  object[key] = value;
	  return object;
	};

	var setGlobal = function (key, value) {
	  try {
	    createNonEnumerableProperty(global_1, key, value);
	  } catch (error) {
	    global_1[key] = value;
	  } return value;
	};

	var SHARED = '__core-js_shared__';
	var store = global_1[SHARED] || setGlobal(SHARED, {});

	var sharedStore = store;

	var shared = createCommonjsModule(function (module) {
	(module.exports = function (key, value) {
	  return sharedStore[key] || (sharedStore[key] = value !== undefined ? value : {});
	})('versions', []).push({
	  version: '3.3.6',
	  mode:  'global',
	  copyright: '© 2019 Denis Pushkarev (zloirock.ru)'
	});
	});

	var functionToString = shared('native-function-to-string', Function.toString);

	var WeakMap = global_1.WeakMap;

	var nativeWeakMap = typeof WeakMap === 'function' && /native code/.test(functionToString.call(WeakMap));

	var id = 0;
	var postfix = Math.random();

	var uid = function (key) {
	  return 'Symbol(' + String(key === undefined ? '' : key) + ')_' + (++id + postfix).toString(36);
	};

	var keys = shared('keys');

	var sharedKey = function (key) {
	  return keys[key] || (keys[key] = uid(key));
	};

	var hiddenKeys = {};

	var WeakMap$1 = global_1.WeakMap;
	var set, get, has$1;

	var enforce = function (it) {
	  return has$1(it) ? get(it) : set(it, {});
	};

	var getterFor = function (TYPE) {
	  return function (it) {
	    var state;
	    if (!isObject(it) || (state = get(it)).type !== TYPE) {
	      throw TypeError('Incompatible receiver, ' + TYPE + ' required');
	    } return state;
	  };
	};

	if (nativeWeakMap) {
	  var store$1 = new WeakMap$1();
	  var wmget = store$1.get;
	  var wmhas = store$1.has;
	  var wmset = store$1.set;
	  set = function (it, metadata) {
	    wmset.call(store$1, it, metadata);
	    return metadata;
	  };
	  get = function (it) {
	    return wmget.call(store$1, it) || {};
	  };
	  has$1 = function (it) {
	    return wmhas.call(store$1, it);
	  };
	} else {
	  var STATE = sharedKey('state');
	  hiddenKeys[STATE] = true;
	  set = function (it, metadata) {
	    createNonEnumerableProperty(it, STATE, metadata);
	    return metadata;
	  };
	  get = function (it) {
	    return has(it, STATE) ? it[STATE] : {};
	  };
	  has$1 = function (it) {
	    return has(it, STATE);
	  };
	}

	var internalState = {
	  set: set,
	  get: get,
	  has: has$1,
	  enforce: enforce,
	  getterFor: getterFor
	};

	var redefine = createCommonjsModule(function (module) {
	var getInternalState = internalState.get;
	var enforceInternalState = internalState.enforce;
	var TEMPLATE = String(functionToString).split('toString');

	shared('inspectSource', function (it) {
	  return functionToString.call(it);
	});

	(module.exports = function (O, key, value, options) {
	  var unsafe = options ? !!options.unsafe : false;
	  var simple = options ? !!options.enumerable : false;
	  var noTargetGet = options ? !!options.noTargetGet : false;
	  if (typeof value == 'function') {
	    if (typeof key == 'string' && !has(value, 'name')) createNonEnumerableProperty(value, 'name', key);
	    enforceInternalState(value).source = TEMPLATE.join(typeof key == 'string' ? key : '');
	  }
	  if (O === global_1) {
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
	  return typeof this == 'function' && getInternalState(this).source || functionToString.call(this);
	});
	});

	var path = global_1;

	var aFunction = function (variable) {
	  return typeof variable == 'function' ? variable : undefined;
	};

	var getBuiltIn = function (namespace, method) {
	  return arguments.length < 2 ? aFunction(path[namespace]) || aFunction(global_1[namespace])
	    : path[namespace] && path[namespace][method] || global_1[namespace] && global_1[namespace][method];
	};

	var ceil = Math.ceil;
	var floor = Math.floor;

	// `ToInteger` abstract operation
	// https://tc39.github.io/ecma262/#sec-tointeger
	var toInteger = function (argument) {
	  return isNaN(argument = +argument) ? 0 : (argument > 0 ? floor : ceil)(argument);
	};

	var min = Math.min;

	// `ToLength` abstract operation
	// https://tc39.github.io/ecma262/#sec-tolength
	var toLength = function (argument) {
	  return argument > 0 ? min(toInteger(argument), 0x1FFFFFFFFFFFFF) : 0; // 2 ** 53 - 1 == 9007199254740991
	};

	var max = Math.max;
	var min$1 = Math.min;

	// Helper for a popular repeating case of the spec:
	// Let integer be ? ToInteger(index).
	// If integer < 0, let result be max((length + integer), 0); else let result be min(length, length).
	var toAbsoluteIndex = function (index, length) {
	  var integer = toInteger(index);
	  return integer < 0 ? max(integer + length, 0) : min$1(integer, length);
	};

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

	var arrayIncludes = {
	  // `Array.prototype.includes` method
	  // https://tc39.github.io/ecma262/#sec-array.prototype.includes
	  includes: createMethod(true),
	  // `Array.prototype.indexOf` method
	  // https://tc39.github.io/ecma262/#sec-array.prototype.indexof
	  indexOf: createMethod(false)
	};

	var indexOf = arrayIncludes.indexOf;


	var objectKeysInternal = function (object, names) {
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

	// IE8- don't enum bug keys
	var enumBugKeys = [
	  'constructor',
	  'hasOwnProperty',
	  'isPrototypeOf',
	  'propertyIsEnumerable',
	  'toLocaleString',
	  'toString',
	  'valueOf'
	];

	var hiddenKeys$1 = enumBugKeys.concat('length', 'prototype');

	// `Object.getOwnPropertyNames` method
	// https://tc39.github.io/ecma262/#sec-object.getownpropertynames
	var f$3 = Object.getOwnPropertyNames || function getOwnPropertyNames(O) {
	  return objectKeysInternal(O, hiddenKeys$1);
	};

	var objectGetOwnPropertyNames = {
		f: f$3
	};

	var f$4 = Object.getOwnPropertySymbols;

	var objectGetOwnPropertySymbols = {
		f: f$4
	};

	// all object keys, includes non-enumerable and symbols
	var ownKeys = getBuiltIn('Reflect', 'ownKeys') || function ownKeys(it) {
	  var keys = objectGetOwnPropertyNames.f(anObject(it));
	  var getOwnPropertySymbols = objectGetOwnPropertySymbols.f;
	  return getOwnPropertySymbols ? keys.concat(getOwnPropertySymbols(it)) : keys;
	};

	var copyConstructorProperties = function (target, source) {
	  var keys = ownKeys(source);
	  var defineProperty = objectDefineProperty.f;
	  var getOwnPropertyDescriptor = objectGetOwnPropertyDescriptor.f;
	  for (var i = 0; i < keys.length; i++) {
	    var key = keys[i];
	    if (!has(target, key)) defineProperty(target, key, getOwnPropertyDescriptor(source, key));
	  }
	};

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

	var isForced_1 = isForced;

	var getOwnPropertyDescriptor$1 = objectGetOwnPropertyDescriptor.f;






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
	var _export = function (options, source) {
	  var TARGET = options.target;
	  var GLOBAL = options.global;
	  var STATIC = options.stat;
	  var FORCED, target, key, targetProperty, sourceProperty, descriptor;
	  if (GLOBAL) {
	    target = global_1;
	  } else if (STATIC) {
	    target = global_1[TARGET] || setGlobal(TARGET, {});
	  } else {
	    target = (global_1[TARGET] || {}).prototype;
	  }
	  if (target) for (key in source) {
	    sourceProperty = source[key];
	    if (options.noTargetGet) {
	      descriptor = getOwnPropertyDescriptor$1(target, key);
	      targetProperty = descriptor && descriptor.value;
	    } else targetProperty = target[key];
	    FORCED = isForced_1(GLOBAL ? key : TARGET + (STATIC ? '.' : '#') + key, options.forced);
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

	// `IsArray` abstract operation
	// https://tc39.github.io/ecma262/#sec-isarray
	var isArray = Array.isArray || function isArray(arg) {
	  return classofRaw(arg) == 'Array';
	};

	// `ToObject` abstract operation
	// https://tc39.github.io/ecma262/#sec-toobject
	var toObject = function (argument) {
	  return Object(requireObjectCoercible(argument));
	};

	var createProperty = function (object, key, value) {
	  var propertyKey = toPrimitive(key);
	  if (propertyKey in object) objectDefineProperty.f(object, propertyKey, createPropertyDescriptor(0, value));
	  else object[propertyKey] = value;
	};

	var nativeSymbol = !!Object.getOwnPropertySymbols && !fails(function () {
	  // Chrome 38 Symbol has incorrect toString conversion
	  // eslint-disable-next-line no-undef
	  return !String(Symbol());
	});

	var Symbol$1 = global_1.Symbol;
	var store$2 = shared('wks');

	var wellKnownSymbol = function (name) {
	  return store$2[name] || (store$2[name] = nativeSymbol && Symbol$1[name]
	    || (nativeSymbol ? Symbol$1 : uid)('Symbol.' + name));
	};

	var SPECIES = wellKnownSymbol('species');

	// `ArraySpeciesCreate` abstract operation
	// https://tc39.github.io/ecma262/#sec-arrayspeciescreate
	var arraySpeciesCreate = function (originalArray, length) {
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

	var userAgent = getBuiltIn('navigator', 'userAgent') || '';

	var process = global_1.process;
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

	var v8Version = version && +version;

	var SPECIES$1 = wellKnownSymbol('species');

	var arrayMethodHasSpeciesSupport = function (METHOD_NAME) {
	  // We can't use this feature detection in V8 since it causes
	  // deoptimization and serious performance degradation
	  // https://github.com/zloirock/core-js/issues/677
	  return v8Version >= 51 || !fails(function () {
	    var array = [];
	    var constructor = array.constructor = {};
	    constructor[SPECIES$1] = function () {
	      return { foo: 1 };
	    };
	    return array[METHOD_NAME](Boolean).foo !== 1;
	  });
	};

	var IS_CONCAT_SPREADABLE = wellKnownSymbol('isConcatSpreadable');
	var MAX_SAFE_INTEGER = 0x1FFFFFFFFFFFFF;
	var MAXIMUM_ALLOWED_INDEX_EXCEEDED = 'Maximum allowed index exceeded';

	// We can't use this feature detection in V8 since it causes
	// deoptimization and serious performance degradation
	// https://github.com/zloirock/core-js/issues/679
	var IS_CONCAT_SPREADABLE_SUPPORT = v8Version >= 51 || !fails(function () {
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
	_export({ target: 'Array', proto: true, forced: FORCED }, {
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
	var classof = function (it) {
	  var O, tag, result;
	  return it === undefined ? 'Undefined' : it === null ? 'Null'
	    // @@toStringTag case
	    : typeof (tag = tryGet(O = Object(it), TO_STRING_TAG)) == 'string' ? tag
	    // builtinTag case
	    : CORRECT_ARGUMENTS ? classofRaw(O)
	    // ES3 arguments fallback
	    : (result = classofRaw(O)) == 'Object' && typeof O.callee == 'function' ? 'Arguments' : result;
	};

	var TO_STRING_TAG$1 = wellKnownSymbol('toStringTag');
	var test = {};

	test[TO_STRING_TAG$1] = 'z';

	// `Object.prototype.toString` method implementation
	// https://tc39.github.io/ecma262/#sec-object.prototype.tostring
	var objectToString = String(test) !== '[object z]' ? function toString() {
	  return '[object ' + classof(this) + ']';
	} : test.toString;

	var ObjectPrototype = Object.prototype;

	// `Object.prototype.toString` method
	// https://tc39.github.io/ecma262/#sec-object.prototype.tostring
	if (objectToString !== ObjectPrototype.toString) {
	  redefine(ObjectPrototype, 'toString', objectToString, { unsafe: true });
	}

	// iterable DOM collections
	// flag - `iterable` interface - 'entries', 'keys', 'values', 'forEach' methods
	var domIterables = {
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

	var aFunction$1 = function (it) {
	  if (typeof it != 'function') {
	    throw TypeError(String(it) + ' is not a function');
	  } return it;
	};

	// optional / simple context binding
	var bindContext = function (fn, that, length) {
	  aFunction$1(fn);
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

	var push = [].push;

	// `Array.prototype.{ forEach, map, filter, some, every, find, findIndex }` methods implementation
	var createMethod$1 = function (TYPE) {
	  var IS_MAP = TYPE == 1;
	  var IS_FILTER = TYPE == 2;
	  var IS_SOME = TYPE == 3;
	  var IS_EVERY = TYPE == 4;
	  var IS_FIND_INDEX = TYPE == 6;
	  var NO_HOLES = TYPE == 5 || IS_FIND_INDEX;
	  return function ($this, callbackfn, that, specificCreate) {
	    var O = toObject($this);
	    var self = indexedObject(O);
	    var boundFunction = bindContext(callbackfn, that, 3);
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

	var arrayIteration = {
	  // `Array.prototype.forEach` method
	  // https://tc39.github.io/ecma262/#sec-array.prototype.foreach
	  forEach: createMethod$1(0),
	  // `Array.prototype.map` method
	  // https://tc39.github.io/ecma262/#sec-array.prototype.map
	  map: createMethod$1(1),
	  // `Array.prototype.filter` method
	  // https://tc39.github.io/ecma262/#sec-array.prototype.filter
	  filter: createMethod$1(2),
	  // `Array.prototype.some` method
	  // https://tc39.github.io/ecma262/#sec-array.prototype.some
	  some: createMethod$1(3),
	  // `Array.prototype.every` method
	  // https://tc39.github.io/ecma262/#sec-array.prototype.every
	  every: createMethod$1(4),
	  // `Array.prototype.find` method
	  // https://tc39.github.io/ecma262/#sec-array.prototype.find
	  find: createMethod$1(5),
	  // `Array.prototype.findIndex` method
	  // https://tc39.github.io/ecma262/#sec-array.prototype.findIndex
	  findIndex: createMethod$1(6)
	};

	var sloppyArrayMethod = function (METHOD_NAME, argument) {
	  var method = [][METHOD_NAME];
	  return !method || !fails(function () {
	    // eslint-disable-next-line no-useless-call,no-throw-literal
	    method.call(null, argument || function () { throw 1; }, 1);
	  });
	};

	var $forEach = arrayIteration.forEach;


	// `Array.prototype.forEach` method implementation
	// https://tc39.github.io/ecma262/#sec-array.prototype.foreach
	var arrayForEach = sloppyArrayMethod('forEach') ? function forEach(callbackfn /* , thisArg */) {
	  return $forEach(this, callbackfn, arguments.length > 1 ? arguments[1] : undefined);
	} : [].forEach;

	for (var COLLECTION_NAME in domIterables) {
	  var Collection = global_1[COLLECTION_NAME];
	  var CollectionPrototype = Collection && Collection.prototype;
	  // some Chrome versions have non-configurable methods on DOMTokenList
	  if (CollectionPrototype && CollectionPrototype.forEach !== arrayForEach) try {
	    createNonEnumerableProperty(CollectionPrototype, 'forEach', arrayForEach);
	  } catch (error) {
	    CollectionPrototype.forEach = arrayForEach;
	  }
	}

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

	var toString$1 = Object.prototype.toString;

	/**
	 * Determine if a value is an Array
	 *
	 * @param {Object} val The value to test
	 * @returns {boolean} True if value is an Array, otherwise false
	 */
	function isArray$1(val) {
	  return toString$1.call(val) === '[object Array]';
	}

	/**
	 * Determine if a value is an ArrayBuffer
	 *
	 * @param {Object} val The value to test
	 * @returns {boolean} True if value is an ArrayBuffer, otherwise false
	 */
	function isArrayBuffer(val) {
	  return toString$1.call(val) === '[object ArrayBuffer]';
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
	function isObject$1(val) {
	  return val !== null && typeof val === 'object';
	}

	/**
	 * Determine if a value is a Date
	 *
	 * @param {Object} val The value to test
	 * @returns {boolean} True if value is a Date, otherwise false
	 */
	function isDate(val) {
	  return toString$1.call(val) === '[object Date]';
	}

	/**
	 * Determine if a value is a File
	 *
	 * @param {Object} val The value to test
	 * @returns {boolean} True if value is a File, otherwise false
	 */
	function isFile(val) {
	  return toString$1.call(val) === '[object File]';
	}

	/**
	 * Determine if a value is a Blob
	 *
	 * @param {Object} val The value to test
	 * @returns {boolean} True if value is a Blob, otherwise false
	 */
	function isBlob(val) {
	  return toString$1.call(val) === '[object Blob]';
	}

	/**
	 * Determine if a value is a Function
	 *
	 * @param {Object} val The value to test
	 * @returns {boolean} True if value is a Function, otherwise false
	 */
	function isFunction(val) {
	  return toString$1.call(val) === '[object Function]';
	}

	/**
	 * Determine if a value is a Stream
	 *
	 * @param {Object} val The value to test
	 * @returns {boolean} True if value is a Stream, otherwise false
	 */
	function isStream(val) {
	  return isObject$1(val) && isFunction(val.pipe);
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

	  if (isArray$1(obj)) {
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
	  isArray: isArray$1,
	  isArrayBuffer: isArrayBuffer,
	  isBuffer: isBuffer,
	  isFormData: isFormData,
	  isArrayBufferView: isArrayBufferView,
	  isString: isString,
	  isNumber: isNumber,
	  isObject: isObject$1,
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

	// `Object.keys` method
	// https://tc39.github.io/ecma262/#sec-object.keys
	var objectKeys = Object.keys || function keys(O) {
	  return objectKeysInternal(O, enumBugKeys);
	};

	// `Object.defineProperties` method
	// https://tc39.github.io/ecma262/#sec-object.defineproperties
	var objectDefineProperties = descriptors ? Object.defineProperties : function defineProperties(O, Properties) {
	  anObject(O);
	  var keys = objectKeys(Properties);
	  var length = keys.length;
	  var index = 0;
	  var key;
	  while (length > index) objectDefineProperty.f(O, key = keys[index++], Properties[key]);
	  return O;
	};

	var html = getBuiltIn('document', 'documentElement');

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
	var objectCreate = Object.create || function create(O, Properties) {
	  var result;
	  if (O !== null) {
	    Empty[PROTOTYPE] = anObject(O);
	    result = new Empty();
	    Empty[PROTOTYPE] = null;
	    // add "__proto__" for Object.getPrototypeOf polyfill
	    result[IE_PROTO] = O;
	  } else result = createDict();
	  return Properties === undefined ? result : objectDefineProperties(result, Properties);
	};

	hiddenKeys[IE_PROTO] = true;

	var nativeGetOwnPropertyNames = objectGetOwnPropertyNames.f;

	var toString$2 = {}.toString;

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
	var f$5 = function getOwnPropertyNames(it) {
	  return windowNames && toString$2.call(it) == '[object Window]'
	    ? getWindowNames(it)
	    : nativeGetOwnPropertyNames(toIndexedObject(it));
	};

	var objectGetOwnPropertyNamesExternal = {
		f: f$5
	};

	var f$6 = wellKnownSymbol;

	var wrappedWellKnownSymbol = {
		f: f$6
	};

	var defineProperty = objectDefineProperty.f;

	var defineWellKnownSymbol = function (NAME) {
	  var Symbol = path.Symbol || (path.Symbol = {});
	  if (!has(Symbol, NAME)) defineProperty(Symbol, NAME, {
	    value: wrappedWellKnownSymbol.f(NAME)
	  });
	};

	var defineProperty$1 = objectDefineProperty.f;



	var TO_STRING_TAG$2 = wellKnownSymbol('toStringTag');

	var setToStringTag = function (it, TAG, STATIC) {
	  if (it && !has(it = STATIC ? it : it.prototype, TO_STRING_TAG$2)) {
	    defineProperty$1(it, TO_STRING_TAG$2, { configurable: true, value: TAG });
	  }
	};

	var $forEach$1 = arrayIteration.forEach;

	var HIDDEN = sharedKey('hidden');
	var SYMBOL = 'Symbol';
	var PROTOTYPE$1 = 'prototype';
	var TO_PRIMITIVE = wellKnownSymbol('toPrimitive');
	var setInternalState = internalState.set;
	var getInternalState = internalState.getterFor(SYMBOL);
	var ObjectPrototype$1 = Object[PROTOTYPE$1];
	var $Symbol = global_1.Symbol;
	var JSON$1 = global_1.JSON;
	var nativeJSONStringify = JSON$1 && JSON$1.stringify;
	var nativeGetOwnPropertyDescriptor$1 = objectGetOwnPropertyDescriptor.f;
	var nativeDefineProperty$1 = objectDefineProperty.f;
	var nativeGetOwnPropertyNames$1 = objectGetOwnPropertyNamesExternal.f;
	var nativePropertyIsEnumerable$1 = objectPropertyIsEnumerable.f;
	var AllSymbols = shared('symbols');
	var ObjectPrototypeSymbols = shared('op-symbols');
	var StringToSymbolRegistry = shared('string-to-symbol-registry');
	var SymbolToStringRegistry = shared('symbol-to-string-registry');
	var WellKnownSymbolsStore = shared('wks');
	var QObject = global_1.QObject;
	// Don't use setters in Qt Script, https://github.com/zloirock/core-js/issues/173
	var USE_SETTER = !QObject || !QObject[PROTOTYPE$1] || !QObject[PROTOTYPE$1].findChild;

	// fallback for old Android, https://code.google.com/p/v8/issues/detail?id=687
	var setSymbolDescriptor = descriptors && fails(function () {
	  return objectCreate(nativeDefineProperty$1({}, 'a', {
	    get: function () { return nativeDefineProperty$1(this, 'a', { value: 7 }).a; }
	  })).a != 7;
	}) ? function (O, P, Attributes) {
	  var ObjectPrototypeDescriptor = nativeGetOwnPropertyDescriptor$1(ObjectPrototype$1, P);
	  if (ObjectPrototypeDescriptor) delete ObjectPrototype$1[P];
	  nativeDefineProperty$1(O, P, Attributes);
	  if (ObjectPrototypeDescriptor && O !== ObjectPrototype$1) {
	    nativeDefineProperty$1(ObjectPrototype$1, P, ObjectPrototypeDescriptor);
	  }
	} : nativeDefineProperty$1;

	var wrap = function (tag, description) {
	  var symbol = AllSymbols[tag] = objectCreate($Symbol[PROTOTYPE$1]);
	  setInternalState(symbol, {
	    type: SYMBOL,
	    tag: tag,
	    description: description
	  });
	  if (!descriptors) symbol.description = description;
	  return symbol;
	};

	var isSymbol = nativeSymbol && typeof $Symbol.iterator == 'symbol' ? function (it) {
	  return typeof it == 'symbol';
	} : function (it) {
	  return Object(it) instanceof $Symbol;
	};

	var $defineProperty = function defineProperty(O, P, Attributes) {
	  if (O === ObjectPrototype$1) $defineProperty(ObjectPrototypeSymbols, P, Attributes);
	  anObject(O);
	  var key = toPrimitive(P, true);
	  anObject(Attributes);
	  if (has(AllSymbols, key)) {
	    if (!Attributes.enumerable) {
	      if (!has(O, HIDDEN)) nativeDefineProperty$1(O, HIDDEN, createPropertyDescriptor(1, {}));
	      O[HIDDEN][key] = true;
	    } else {
	      if (has(O, HIDDEN) && O[HIDDEN][key]) O[HIDDEN][key] = false;
	      Attributes = objectCreate(Attributes, { enumerable: createPropertyDescriptor(0, false) });
	    } return setSymbolDescriptor(O, key, Attributes);
	  } return nativeDefineProperty$1(O, key, Attributes);
	};

	var $defineProperties = function defineProperties(O, Properties) {
	  anObject(O);
	  var properties = toIndexedObject(Properties);
	  var keys = objectKeys(properties).concat($getOwnPropertySymbols(properties));
	  $forEach$1(keys, function (key) {
	    if (!descriptors || $propertyIsEnumerable.call(properties, key)) $defineProperty(O, key, properties[key]);
	  });
	  return O;
	};

	var $create = function create(O, Properties) {
	  return Properties === undefined ? objectCreate(O) : $defineProperties(objectCreate(O), Properties);
	};

	var $propertyIsEnumerable = function propertyIsEnumerable(V) {
	  var P = toPrimitive(V, true);
	  var enumerable = nativePropertyIsEnumerable$1.call(this, P);
	  if (this === ObjectPrototype$1 && has(AllSymbols, P) && !has(ObjectPrototypeSymbols, P)) return false;
	  return enumerable || !has(this, P) || !has(AllSymbols, P) || has(this, HIDDEN) && this[HIDDEN][P] ? enumerable : true;
	};

	var $getOwnPropertyDescriptor = function getOwnPropertyDescriptor(O, P) {
	  var it = toIndexedObject(O);
	  var key = toPrimitive(P, true);
	  if (it === ObjectPrototype$1 && has(AllSymbols, key) && !has(ObjectPrototypeSymbols, key)) return;
	  var descriptor = nativeGetOwnPropertyDescriptor$1(it, key);
	  if (descriptor && has(AllSymbols, key) && !(has(it, HIDDEN) && it[HIDDEN][key])) {
	    descriptor.enumerable = true;
	  }
	  return descriptor;
	};

	var $getOwnPropertyNames = function getOwnPropertyNames(O) {
	  var names = nativeGetOwnPropertyNames$1(toIndexedObject(O));
	  var result = [];
	  $forEach$1(names, function (key) {
	    if (!has(AllSymbols, key) && !has(hiddenKeys, key)) result.push(key);
	  });
	  return result;
	};

	var $getOwnPropertySymbols = function getOwnPropertySymbols(O) {
	  var IS_OBJECT_PROTOTYPE = O === ObjectPrototype$1;
	  var names = nativeGetOwnPropertyNames$1(IS_OBJECT_PROTOTYPE ? ObjectPrototypeSymbols : toIndexedObject(O));
	  var result = [];
	  $forEach$1(names, function (key) {
	    if (has(AllSymbols, key) && (!IS_OBJECT_PROTOTYPE || has(ObjectPrototype$1, key))) {
	      result.push(AllSymbols[key]);
	    }
	  });
	  return result;
	};

	// `Symbol` constructor
	// https://tc39.github.io/ecma262/#sec-symbol-constructor
	if (!nativeSymbol) {
	  $Symbol = function Symbol() {
	    if (this instanceof $Symbol) throw TypeError('Symbol is not a constructor');
	    var description = !arguments.length || arguments[0] === undefined ? undefined : String(arguments[0]);
	    var tag = uid(description);
	    var setter = function (value) {
	      if (this === ObjectPrototype$1) setter.call(ObjectPrototypeSymbols, value);
	      if (has(this, HIDDEN) && has(this[HIDDEN], tag)) this[HIDDEN][tag] = false;
	      setSymbolDescriptor(this, tag, createPropertyDescriptor(1, value));
	    };
	    if (descriptors && USE_SETTER) setSymbolDescriptor(ObjectPrototype$1, tag, { configurable: true, set: setter });
	    return wrap(tag, description);
	  };

	  redefine($Symbol[PROTOTYPE$1], 'toString', function toString() {
	    return getInternalState(this).tag;
	  });

	  objectPropertyIsEnumerable.f = $propertyIsEnumerable;
	  objectDefineProperty.f = $defineProperty;
	  objectGetOwnPropertyDescriptor.f = $getOwnPropertyDescriptor;
	  objectGetOwnPropertyNames.f = objectGetOwnPropertyNamesExternal.f = $getOwnPropertyNames;
	  objectGetOwnPropertySymbols.f = $getOwnPropertySymbols;

	  if (descriptors) {
	    // https://github.com/tc39/proposal-Symbol-description
	    nativeDefineProperty$1($Symbol[PROTOTYPE$1], 'description', {
	      configurable: true,
	      get: function description() {
	        return getInternalState(this).description;
	      }
	    });
	    {
	      redefine(ObjectPrototype$1, 'propertyIsEnumerable', $propertyIsEnumerable, { unsafe: true });
	    }
	  }

	  wrappedWellKnownSymbol.f = function (name) {
	    return wrap(wellKnownSymbol(name), name);
	  };
	}

	_export({ global: true, wrap: true, forced: !nativeSymbol, sham: !nativeSymbol }, {
	  Symbol: $Symbol
	});

	$forEach$1(objectKeys(WellKnownSymbolsStore), function (name) {
	  defineWellKnownSymbol(name);
	});

	_export({ target: SYMBOL, stat: true, forced: !nativeSymbol }, {
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

	_export({ target: 'Object', stat: true, forced: !nativeSymbol, sham: !descriptors }, {
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

	_export({ target: 'Object', stat: true, forced: !nativeSymbol }, {
	  // `Object.getOwnPropertyNames` method
	  // https://tc39.github.io/ecma262/#sec-object.getownpropertynames
	  getOwnPropertyNames: $getOwnPropertyNames,
	  // `Object.getOwnPropertySymbols` method
	  // https://tc39.github.io/ecma262/#sec-object.getownpropertysymbols
	  getOwnPropertySymbols: $getOwnPropertySymbols
	});

	// Chrome 38 and 39 `Object.getOwnPropertySymbols` fails on primitives
	// https://bugs.chromium.org/p/v8/issues/detail?id=3443
	_export({ target: 'Object', stat: true, forced: fails(function () { objectGetOwnPropertySymbols.f(1); }) }, {
	  getOwnPropertySymbols: function getOwnPropertySymbols(it) {
	    return objectGetOwnPropertySymbols.f(toObject(it));
	  }
	});

	// `JSON.stringify` method behavior with symbols
	// https://tc39.github.io/ecma262/#sec-json.stringify
	JSON$1 && _export({ target: 'JSON', stat: true, forced: !nativeSymbol || fails(function () {
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
	    return nativeJSONStringify.apply(JSON$1, args);
	  }
	});

	// `Symbol.prototype[@@toPrimitive]` method
	// https://tc39.github.io/ecma262/#sec-symbol.prototype-@@toprimitive
	if (!$Symbol[PROTOTYPE$1][TO_PRIMITIVE]) {
	  createNonEnumerableProperty($Symbol[PROTOTYPE$1], TO_PRIMITIVE, $Symbol[PROTOTYPE$1].valueOf);
	}
	// `Symbol.prototype[@@toStringTag]` property
	// https://tc39.github.io/ecma262/#sec-symbol.prototype-@@tostringtag
	setToStringTag($Symbol, SYMBOL);

	hiddenKeys[HIDDEN] = true;

	var $filter = arrayIteration.filter;


	// `Array.prototype.filter` method
	// https://tc39.github.io/ecma262/#sec-array.prototype.filter
	// with adding support of @@species
	_export({ target: 'Array', proto: true, forced: !arrayMethodHasSpeciesSupport('filter') }, {
	  filter: function filter(callbackfn /* , thisArg */) {
	    return $filter(this, callbackfn, arguments.length > 1 ? arguments[1] : undefined);
	  }
	});

	var UNSCOPABLES = wellKnownSymbol('unscopables');
	var ArrayPrototype = Array.prototype;

	// Array.prototype[@@unscopables]
	// https://tc39.github.io/ecma262/#sec-array.prototype-@@unscopables
	if (ArrayPrototype[UNSCOPABLES] == undefined) {
	  createNonEnumerableProperty(ArrayPrototype, UNSCOPABLES, objectCreate(null));
	}

	// add a key to Array.prototype[@@unscopables]
	var addToUnscopables = function (key) {
	  ArrayPrototype[UNSCOPABLES][key] = true;
	};

	var $includes = arrayIncludes.includes;


	// `Array.prototype.includes` method
	// https://tc39.github.io/ecma262/#sec-array.prototype.includes
	_export({ target: 'Array', proto: true }, {
	  includes: function includes(el /* , fromIndex = 0 */) {
	    return $includes(this, el, arguments.length > 1 ? arguments[1] : undefined);
	  }
	});

	// https://tc39.github.io/ecma262/#sec-array.prototype-@@unscopables
	addToUnscopables('includes');

	var $indexOf = arrayIncludes.indexOf;


	var nativeIndexOf = [].indexOf;

	var NEGATIVE_ZERO = !!nativeIndexOf && 1 / [1].indexOf(1, -0) < 0;
	var SLOPPY_METHOD = sloppyArrayMethod('indexOf');

	// `Array.prototype.indexOf` method
	// https://tc39.github.io/ecma262/#sec-array.prototype.indexof
	_export({ target: 'Array', proto: true, forced: NEGATIVE_ZERO || SLOPPY_METHOD }, {
	  indexOf: function indexOf(searchElement /* , fromIndex = 0 */) {
	    return NEGATIVE_ZERO
	      // convert -0 to +0
	      ? nativeIndexOf.apply(this, arguments) || 0
	      : $indexOf(this, searchElement, arguments.length > 1 ? arguments[1] : undefined);
	  }
	});

	var nativeGetOwnPropertyDescriptor$2 = objectGetOwnPropertyDescriptor.f;


	var FAILS_ON_PRIMITIVES = fails(function () { nativeGetOwnPropertyDescriptor$2(1); });
	var FORCED$1 = !descriptors || FAILS_ON_PRIMITIVES;

	// `Object.getOwnPropertyDescriptor` method
	// https://tc39.github.io/ecma262/#sec-object.getownpropertydescriptor
	_export({ target: 'Object', stat: true, forced: FORCED$1, sham: !descriptors }, {
	  getOwnPropertyDescriptor: function getOwnPropertyDescriptor(it, key) {
	    return nativeGetOwnPropertyDescriptor$2(toIndexedObject(it), key);
	  }
	});

	// `Object.getOwnPropertyDescriptors` method
	// https://tc39.github.io/ecma262/#sec-object.getownpropertydescriptors
	_export({ target: 'Object', stat: true, sham: !descriptors }, {
	  getOwnPropertyDescriptors: function getOwnPropertyDescriptors(object) {
	    var O = toIndexedObject(object);
	    var getOwnPropertyDescriptor = objectGetOwnPropertyDescriptor.f;
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

	var FAILS_ON_PRIMITIVES$1 = fails(function () { objectKeys(1); });

	// `Object.keys` method
	// https://tc39.github.io/ecma262/#sec-object.keys
	_export({ target: 'Object', stat: true, forced: FAILS_ON_PRIMITIVES$1 }, {
	  keys: function keys(it) {
	    return objectKeys(toObject(it));
	  }
	});

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

	function _typeof(obj) {
	  if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") {
	    _typeof = function _typeof(obj) {
	      return typeof obj;
	    };
	  } else {
	    _typeof = function _typeof(obj) {
	      return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
	    };
	  }

	  return _typeof(obj);
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
	    case (typeof wx === "undefined" ? "undefined" : _typeof(wx)) === 'object':
	      return PLATFORM.kWechat;

	    case (typeof swan === "undefined" ? "undefined" : _typeof(swan)) === 'object':
	      return PLATFORM.kBaidu;

	    case (typeof my === "undefined" ? "undefined" : _typeof(my)) === 'object':
	      return PLATFORM.kAlipay;

	    default:
	      return PLATFORM.kUnknown;
	  }
	}

	var platform = getPlatform();
	var delegate = platform === PLATFORM.kWechat ? wx.request.bind(wx) : platform === PLATFORM.kAlipay ? (my.request || my.httpRequest).bind(my) : platform === PLATFORM.kBaidu ? swan.request.bind(swan) : undefined;
	function createRequestDelegate() {
	  var task;
	  return {
	    send: function send(options) {
	      if (!delegate) return;
	      task = delegate(options);
	    },
	    abort: function abort() {
	      task && task.abort();
	    }
	  };
	}

	function ownKeys$1(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

	function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys$1(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys$1(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }
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
	          }

	          var error = isAbort ? createError('Request aborted', config, 'ECONNABORTED', '') : isTimeout ? createError('Request Timeout', config, 'ECONNABORTED', '') : createError('Network Error', config, null, '');

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
	          ontimeout && ontimeout(createError("timeout of ".concat(config.timeout || 0, "ms exceeded"), config, 'ECONNABORTED', ''));
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

	var isString$1 = function isString(val) {
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
	      headers.Authorization = "Basic ".concat(btoa("".concat(username, ":").concat(password)));
	    } // Add headers to the request


	    utils.forEach(headers, function (val, key) {
	      var header = key.toLowerCase();

	      if (typeof data === 'undefined' && header === 'content-type' || header === 'referer') {
	        delete headers[key];
	      }
	    });
	    var request = createRequest(config);
	    var options = {
	      url: buildURL(url, params, paramsSerializer),
	      header: headers,
	      method: method && method.toUpperCase(),
	      data: isString$1(data) ? JSON.parse(data) : data,
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
	      settle(resolve, reject, response);
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

	var $find = arrayIteration.find;


	var FIND = 'find';
	var SKIPS_HOLES = true;

	// Shouldn't skip holes
	if (FIND in []) Array(1)[FIND](function () { SKIPS_HOLES = false; });

	// `Array.prototype.find` method
	// https://tc39.github.io/ecma262/#sec-array.prototype.find
	_export({ target: 'Array', proto: true, forced: SKIPS_HOLES }, {
	  find: function find(callbackfn /* , that = undefined */) {
	    return $find(this, callbackfn, arguments.length > 1 ? arguments[1] : undefined);
	  }
	});

	// https://tc39.github.io/ecma262/#sec-array.prototype-@@unscopables
	addToUnscopables(FIND);

	var defineProperty$2 = objectDefineProperty.f;

	var FunctionPrototype = Function.prototype;
	var FunctionPrototypeToString = FunctionPrototype.toString;
	var nameRE = /^\s*function ([^ (]*)/;
	var NAME = 'name';

	// Function instances `.name` property
	// https://tc39.github.io/ecma262/#sec-function-instances-name
	if (descriptors && !(NAME in FunctionPrototype)) {
	  defineProperty$2(FunctionPrototype, NAME, {
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

	// `RegExp.prototype.flags` getter implementation
	// https://tc39.github.io/ecma262/#sec-get-regexp.prototype.flags
	var regexpFlags = function () {
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

	var regexpExec = patchedExec;

	_export({ target: 'RegExp', proto: true, forced: /./.exec !== regexpExec }, {
	  exec: regexpExec
	});

	var SPECIES$2 = wellKnownSymbol('species');

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

	var fixRegexpWellKnownSymbolLogic = function (KEY, length, exec, sham) {
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
	      re.constructor[SPECIES$2] = function () { return re; };
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

	// `String.prototype.{ codePointAt, at }` methods implementation
	var createMethod$2 = function (CONVERT_TO_STRING) {
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

	var stringMultibyte = {
	  // `String.prototype.codePointAt` method
	  // https://tc39.github.io/ecma262/#sec-string.prototype.codepointat
	  codeAt: createMethod$2(false),
	  // `String.prototype.at` method
	  // https://github.com/mathiasbynens/String.prototype.at
	  charAt: createMethod$2(true)
	};

	var charAt = stringMultibyte.charAt;

	// `AdvanceStringIndex` abstract operation
	// https://tc39.github.io/ecma262/#sec-advancestringindex
	var advanceStringIndex = function (S, index, unicode) {
	  return index + (unicode ? charAt(S, index).length : 1);
	};

	// `RegExpExec` abstract operation
	// https://tc39.github.io/ecma262/#sec-regexpexec
	var regexpExecAbstract = function (R, S) {
	  var exec = R.exec;
	  if (typeof exec === 'function') {
	    var result = exec.call(R, S);
	    if (typeof result !== 'object') {
	      throw TypeError('RegExp exec method returned something other than an Object or null');
	    }
	    return result;
	  }

	  if (classofRaw(R) !== 'RegExp') {
	    throw TypeError('RegExp#exec called on incompatible receiver');
	  }

	  return regexpExec.call(R, S);
	};

	// @@match logic
	fixRegexpWellKnownSymbolLogic('match', 1, function (MATCH, nativeMatch, maybeCallNative) {
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

	      if (!rx.global) return regexpExecAbstract(rx, S);

	      var fullUnicode = rx.unicode;
	      rx.lastIndex = 0;
	      var A = [];
	      var n = 0;
	      var result;
	      while ((result = regexpExecAbstract(rx, S)) !== null) {
	        var matchStr = String(result[0]);
	        A[n] = matchStr;
	        if (matchStr === '') rx.lastIndex = advanceStringIndex(S, toLength(rx.lastIndex), fullUnicode);
	        n++;
	      }
	      return n === 0 ? null : A;
	    }
	  ];
	});

	// `SameValue` abstract operation
	// https://tc39.github.io/ecma262/#sec-samevalue
	var sameValue = Object.is || function is(x, y) {
	  // eslint-disable-next-line no-self-compare
	  return x === y ? x !== 0 || 1 / x === 1 / y : x != x && y != y;
	};

	// @@search logic
	fixRegexpWellKnownSymbolLogic('search', 1, function (SEARCH, nativeSearch, maybeCallNative) {
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
	      var result = regexpExecAbstract(rx, S);
	      if (!sameValue(rx.lastIndex, previousLastIndex)) rx.lastIndex = previousLastIndex;
	      return result === null ? -1 : result.index;
	    }
	  ];
	});

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

	var SPECIES$3 = wellKnownSymbol('species');
	var nativeSlice = [].slice;
	var max$1 = Math.max;

	// `Array.prototype.slice` method
	// https://tc39.github.io/ecma262/#sec-array.prototype.slice
	// fallback for not array-like ES3 strings and DOM objects
	_export({ target: 'Array', proto: true, forced: !arrayMethodHasSpeciesSupport('slice') }, {
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
	        Constructor = Constructor[SPECIES$3];
	        if (Constructor === null) Constructor = undefined;
	      }
	      if (Constructor === Array || Constructor === undefined) {
	        return nativeSlice.call(O, k, fin);
	      }
	    }
	    result = new (Constructor === undefined ? Array : Constructor)(max$1(fin - k, 0));
	    for (n = 0; k < fin; k++, n++) if (k in O) createProperty(result, n, O[k]);
	    result.length = n;
	    return result;
	  }
	});

	var aPossiblePrototype = function (it) {
	  if (!isObject(it) && it !== null) {
	    throw TypeError("Can't set " + String(it) + ' as a prototype');
	  } return it;
	};

	// `Object.setPrototypeOf` method
	// https://tc39.github.io/ecma262/#sec-object.setprototypeof
	// Works with __proto__ only. Old v8 can't work with null proto objects.
	/* eslint-disable no-proto */
	var objectSetPrototypeOf = Object.setPrototypeOf || ('__proto__' in {} ? function () {
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

	// makes subclassing work correct for wrapped built-ins
	var inheritIfRequired = function ($this, dummy, Wrapper) {
	  var NewTarget, NewTargetPrototype;
	  if (
	    // it can work only with native `setPrototypeOf`
	    objectSetPrototypeOf &&
	    // we haven't completely correct pre-ES6 way for getting `new.target`, so use this
	    typeof (NewTarget = dummy.constructor) == 'function' &&
	    NewTarget !== Wrapper &&
	    isObject(NewTargetPrototype = NewTarget.prototype) &&
	    NewTargetPrototype !== Wrapper.prototype
	  ) objectSetPrototypeOf($this, NewTargetPrototype);
	  return $this;
	};

	// a string of all valid unicode whitespaces
	// eslint-disable-next-line max-len
	var whitespaces = '\u0009\u000A\u000B\u000C\u000D\u0020\u00A0\u1680\u2000\u2001\u2002\u2003\u2004\u2005\u2006\u2007\u2008\u2009\u200A\u202F\u205F\u3000\u2028\u2029\uFEFF';

	var whitespace = '[' + whitespaces + ']';
	var ltrim = RegExp('^' + whitespace + whitespace + '*');
	var rtrim = RegExp(whitespace + whitespace + '*$');

	// `String.prototype.{ trim, trimStart, trimEnd, trimLeft, trimRight }` methods implementation
	var createMethod$3 = function (TYPE) {
	  return function ($this) {
	    var string = String(requireObjectCoercible($this));
	    if (TYPE & 1) string = string.replace(ltrim, '');
	    if (TYPE & 2) string = string.replace(rtrim, '');
	    return string;
	  };
	};

	var stringTrim = {
	  // `String.prototype.{ trimLeft, trimStart }` methods
	  // https://tc39.github.io/ecma262/#sec-string.prototype.trimstart
	  start: createMethod$3(1),
	  // `String.prototype.{ trimRight, trimEnd }` methods
	  // https://tc39.github.io/ecma262/#sec-string.prototype.trimend
	  end: createMethod$3(2),
	  // `String.prototype.trim` method
	  // https://tc39.github.io/ecma262/#sec-string.prototype.trim
	  trim: createMethod$3(3)
	};

	var getOwnPropertyNames = objectGetOwnPropertyNames.f;
	var getOwnPropertyDescriptor$2 = objectGetOwnPropertyDescriptor.f;
	var defineProperty$3 = objectDefineProperty.f;
	var trim$1 = stringTrim.trim;

	var NUMBER = 'Number';
	var NativeNumber = global_1[NUMBER];
	var NumberPrototype = NativeNumber.prototype;

	// Opera ~12 has broken Object#toString
	var BROKEN_CLASSOF = classofRaw(objectCreate(NumberPrototype)) == NUMBER;

	// `ToNumber` abstract operation
	// https://tc39.github.io/ecma262/#sec-tonumber
	var toNumber = function (argument) {
	  var it = toPrimitive(argument, false);
	  var first, third, radix, maxCode, digits, length, index, code;
	  if (typeof it == 'string' && it.length > 2) {
	    it = trim$1(it);
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
	if (isForced_1(NUMBER, !NativeNumber(' 0o1') || !NativeNumber('0b1') || NativeNumber('+0x1'))) {
	  var NumberWrapper = function Number(value) {
	    var it = arguments.length < 1 ? 0 : value;
	    var dummy = this;
	    return dummy instanceof NumberWrapper
	      // check on 1..constructor(foo) case
	      && (BROKEN_CLASSOF ? fails(function () { NumberPrototype.valueOf.call(dummy); }) : classofRaw(dummy) != NUMBER)
	        ? inheritIfRequired(new NativeNumber(toNumber(it)), dummy, NumberWrapper) : toNumber(it);
	  };
	  for (var keys$1 = descriptors ? getOwnPropertyNames(NativeNumber) : (
	    // ES3:
	    'MAX_VALUE,MIN_VALUE,NaN,NEGATIVE_INFINITY,POSITIVE_INFINITY,' +
	    // ES2015 (in case, if modules with ES2015 Number statics required before):
	    'EPSILON,isFinite,isInteger,isNaN,isSafeInteger,MAX_SAFE_INTEGER,' +
	    'MIN_SAFE_INTEGER,parseFloat,parseInt,isInteger'
	  ).split(','), j = 0, key; keys$1.length > j; j++) {
	    if (has(NativeNumber, key = keys$1[j]) && !has(NumberWrapper, key)) {
	      defineProperty$3(NumberWrapper, key, getOwnPropertyDescriptor$2(NativeNumber, key));
	    }
	  }
	  NumberWrapper.prototype = NumberPrototype;
	  NumberPrototype.constructor = NumberWrapper;
	  redefine(global_1, NUMBER, NumberWrapper);
	}

	// `Number.isNaN` method
	// https://tc39.github.io/ecma262/#sec-number.isnan
	_export({ target: 'Number', stat: true }, {
	  isNaN: function isNaN(number) {
	    // eslint-disable-next-line no-self-compare
	    return number != number;
	  }
	});

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
	    var f = String(rf === undefined && R instanceof RegExp && !('flags' in RegExpPrototype) ? regexpFlags.call(R) : rf);
	    return '/' + p + '/' + f;
	  }, { unsafe: true });
	}

	var max$2 = Math.max;
	var min$2 = Math.min;
	var floor$1 = Math.floor;
	var SUBSTITUTION_SYMBOLS = /\$([$&'`]|\d\d?|<[^>]*>)/g;
	var SUBSTITUTION_SYMBOLS_NO_NAMED = /\$([$&'`]|\d\d?)/g;

	var maybeToString = function (it) {
	  return it === undefined ? it : String(it);
	};

	// @@replace logic
	fixRegexpWellKnownSymbolLogic('replace', 2, function (REPLACE, nativeReplace, maybeCallNative) {
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
	        var result = regexpExecAbstract(rx, S);
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
	        var position = max$2(min$2(toInteger(result.index), S.length), 0);
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
	            var f = floor$1(n / 10);
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

	var isDef = function isDef(value) {
	  return value !== undefined && value !== null;
	};
	var isArray$2 = Array.isArray;
	var isFunction$1 = function isFunction(val) {
	  return typeof val === 'function';
	};
	var isObject$2 = function isObject(val) {
	  return _typeof(val) === 'object' && val !== null;
	};
	var hasOwnProperty$1 = Object.prototype.hasOwnProperty;
	var hasOwn = function hasOwn(val, key) {
	  return hasOwnProperty$1.call(val, key);
	};
	var camelizeRE = /-(\w)/g;
	var camelize = function camelize(str) {
	  return str.replace(camelizeRE, function (_, c) {
	    return c ? c.toUpperCase() : '';
	  });
	};

	var hasChanged = function hasChanged(value, oldValue) {
	  /* eslint-disable-next-line no-self-compare */
	  return value !== oldValue && (value === value || oldValue === oldValue);
	};

	var parsed = {};
	function isMiniProgram() {
	  return isObject$2(wx) || isObject$2(swan) || isObject$2(my) || /miniprogram/i.test(navigator.userAgent) || window && window.__wxjs_environment === 'miniprogram';
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
	var MINIPROGRAM = isMiniProgram();

	var $map = arrayIteration.map;


	// `Array.prototype.map` method
	// https://tc39.github.io/ecma262/#sec-array.prototype.map
	// with adding support of @@species
	_export({ target: 'Array', proto: true, forced: !arrayMethodHasSpeciesSupport('map') }, {
	  map: function map(callbackfn /* , thisArg */) {
	    return $map(this, callbackfn, arguments.length > 1 ? arguments[1] : undefined);
	  }
	});

	var freezing = !fails(function () {
	  return Object.isExtensible(Object.preventExtensions({}));
	});

	var internalMetadata = createCommonjsModule(function (module) {
	var defineProperty = objectDefineProperty.f;



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
	  if (freezing && meta.REQUIRED && isExtensible(it) && !has(it, METADATA)) setMetadata(it);
	  return it;
	};

	var meta = module.exports = {
	  REQUIRED: false,
	  fastKey: fastKey,
	  getWeakData: getWeakData,
	  onFreeze: onFreeze
	};

	hiddenKeys[METADATA] = true;
	});
	var internalMetadata_1 = internalMetadata.REQUIRED;
	var internalMetadata_2 = internalMetadata.fastKey;
	var internalMetadata_3 = internalMetadata.getWeakData;
	var internalMetadata_4 = internalMetadata.onFreeze;

	var iterators = {};

	var ITERATOR = wellKnownSymbol('iterator');
	var ArrayPrototype$1 = Array.prototype;

	// check on default Array iterator
	var isArrayIteratorMethod = function (it) {
	  return it !== undefined && (iterators.Array === it || ArrayPrototype$1[ITERATOR] === it);
	};

	var ITERATOR$1 = wellKnownSymbol('iterator');

	var getIteratorMethod = function (it) {
	  if (it != undefined) return it[ITERATOR$1]
	    || it['@@iterator']
	    || iterators[classof(it)];
	};

	// call something on iterator step with safe closing on error
	var callWithSafeIterationClosing = function (iterator, fn, value, ENTRIES) {
	  try {
	    return ENTRIES ? fn(anObject(value)[0], value[1]) : fn(value);
	  // 7.4.6 IteratorClose(iterator, completion)
	  } catch (error) {
	    var returnMethod = iterator['return'];
	    if (returnMethod !== undefined) anObject(returnMethod.call(iterator));
	    throw error;
	  }
	};

	var iterate_1 = createCommonjsModule(function (module) {
	var Result = function (stopped, result) {
	  this.stopped = stopped;
	  this.result = result;
	};

	var iterate = module.exports = function (iterable, fn, that, AS_ENTRIES, IS_ITERATOR) {
	  var boundFunction = bindContext(fn, that, AS_ENTRIES ? 2 : 1);
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
	});

	var anInstance = function (it, Constructor, name) {
	  if (!(it instanceof Constructor)) {
	    throw TypeError('Incorrect ' + (name ? name + ' ' : '') + 'invocation');
	  } return it;
	};

	var ITERATOR$2 = wellKnownSymbol('iterator');
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
	  iteratorWithReturn[ITERATOR$2] = function () {
	    return this;
	  };
	  // eslint-disable-next-line no-throw-literal
	  Array.from(iteratorWithReturn, function () { throw 2; });
	} catch (error) { /* empty */ }

	var checkCorrectnessOfIteration = function (exec, SKIP_CLOSING) {
	  if (!SKIP_CLOSING && !SAFE_CLOSING) return false;
	  var ITERATION_SUPPORT = false;
	  try {
	    var object = {};
	    object[ITERATOR$2] = function () {
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

	var collection = function (CONSTRUCTOR_NAME, wrapper, common, IS_MAP, IS_WEAK) {
	  var NativeConstructor = global_1[CONSTRUCTOR_NAME];
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
	  if (isForced_1(CONSTRUCTOR_NAME, typeof NativeConstructor != 'function' || !(IS_WEAK || NativePrototype.forEach && !fails(function () {
	    new NativeConstructor().entries().next();
	  })))) {
	    // create collection constructor
	    Constructor = common.getConstructor(wrapper, CONSTRUCTOR_NAME, IS_MAP, ADDER);
	    internalMetadata.REQUIRED = true;
	  } else if (isForced_1(CONSTRUCTOR_NAME, true)) {
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
	        if (iterable != undefined) iterate_1(iterable, that[ADDER], that, IS_MAP);
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
	  _export({ global: true, forced: Constructor != NativeConstructor }, exported);

	  setToStringTag(Constructor, CONSTRUCTOR_NAME);

	  if (!IS_WEAK) common.setStrong(Constructor, CONSTRUCTOR_NAME, IS_MAP);

	  return Constructor;
	};

	var redefineAll = function (target, src, options) {
	  for (var key in src) redefine(target, key, src[key], options);
	  return target;
	};

	var correctPrototypeGetter = !fails(function () {
	  function F() { /* empty */ }
	  F.prototype.constructor = null;
	  return Object.getPrototypeOf(new F()) !== F.prototype;
	});

	var IE_PROTO$1 = sharedKey('IE_PROTO');
	var ObjectPrototype$2 = Object.prototype;

	// `Object.getPrototypeOf` method
	// https://tc39.github.io/ecma262/#sec-object.getprototypeof
	var objectGetPrototypeOf = correctPrototypeGetter ? Object.getPrototypeOf : function (O) {
	  O = toObject(O);
	  if (has(O, IE_PROTO$1)) return O[IE_PROTO$1];
	  if (typeof O.constructor == 'function' && O instanceof O.constructor) {
	    return O.constructor.prototype;
	  } return O instanceof Object ? ObjectPrototype$2 : null;
	};

	var ITERATOR$3 = wellKnownSymbol('iterator');
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
	    PrototypeOfArrayIteratorPrototype = objectGetPrototypeOf(objectGetPrototypeOf(arrayIterator));
	    if (PrototypeOfArrayIteratorPrototype !== Object.prototype) IteratorPrototype = PrototypeOfArrayIteratorPrototype;
	  }
	}

	if (IteratorPrototype == undefined) IteratorPrototype = {};

	// 25.1.2.1.1 %IteratorPrototype%[@@iterator]()
	if ( !has(IteratorPrototype, ITERATOR$3)) {
	  createNonEnumerableProperty(IteratorPrototype, ITERATOR$3, returnThis);
	}

	var iteratorsCore = {
	  IteratorPrototype: IteratorPrototype,
	  BUGGY_SAFARI_ITERATORS: BUGGY_SAFARI_ITERATORS
	};

	var IteratorPrototype$1 = iteratorsCore.IteratorPrototype;





	var returnThis$1 = function () { return this; };

	var createIteratorConstructor = function (IteratorConstructor, NAME, next) {
	  var TO_STRING_TAG = NAME + ' Iterator';
	  IteratorConstructor.prototype = objectCreate(IteratorPrototype$1, { next: createPropertyDescriptor(1, next) });
	  setToStringTag(IteratorConstructor, TO_STRING_TAG, false);
	  iterators[TO_STRING_TAG] = returnThis$1;
	  return IteratorConstructor;
	};

	var IteratorPrototype$2 = iteratorsCore.IteratorPrototype;
	var BUGGY_SAFARI_ITERATORS$1 = iteratorsCore.BUGGY_SAFARI_ITERATORS;
	var ITERATOR$4 = wellKnownSymbol('iterator');
	var KEYS = 'keys';
	var VALUES = 'values';
	var ENTRIES = 'entries';

	var returnThis$2 = function () { return this; };

	var defineIterator = function (Iterable, NAME, IteratorConstructor, next, DEFAULT, IS_SET, FORCED) {
	  createIteratorConstructor(IteratorConstructor, NAME, next);

	  var getIterationMethod = function (KIND) {
	    if (KIND === DEFAULT && defaultIterator) return defaultIterator;
	    if (!BUGGY_SAFARI_ITERATORS$1 && KIND in IterablePrototype) return IterablePrototype[KIND];
	    switch (KIND) {
	      case KEYS: return function keys() { return new IteratorConstructor(this, KIND); };
	      case VALUES: return function values() { return new IteratorConstructor(this, KIND); };
	      case ENTRIES: return function entries() { return new IteratorConstructor(this, KIND); };
	    } return function () { return new IteratorConstructor(this); };
	  };

	  var TO_STRING_TAG = NAME + ' Iterator';
	  var INCORRECT_VALUES_NAME = false;
	  var IterablePrototype = Iterable.prototype;
	  var nativeIterator = IterablePrototype[ITERATOR$4]
	    || IterablePrototype['@@iterator']
	    || DEFAULT && IterablePrototype[DEFAULT];
	  var defaultIterator = !BUGGY_SAFARI_ITERATORS$1 && nativeIterator || getIterationMethod(DEFAULT);
	  var anyNativeIterator = NAME == 'Array' ? IterablePrototype.entries || nativeIterator : nativeIterator;
	  var CurrentIteratorPrototype, methods, KEY;

	  // fix native
	  if (anyNativeIterator) {
	    CurrentIteratorPrototype = objectGetPrototypeOf(anyNativeIterator.call(new Iterable()));
	    if (IteratorPrototype$2 !== Object.prototype && CurrentIteratorPrototype.next) {
	      if ( objectGetPrototypeOf(CurrentIteratorPrototype) !== IteratorPrototype$2) {
	        if (objectSetPrototypeOf) {
	          objectSetPrototypeOf(CurrentIteratorPrototype, IteratorPrototype$2);
	        } else if (typeof CurrentIteratorPrototype[ITERATOR$4] != 'function') {
	          createNonEnumerableProperty(CurrentIteratorPrototype, ITERATOR$4, returnThis$2);
	        }
	      }
	      // Set @@toStringTag to native iterators
	      setToStringTag(CurrentIteratorPrototype, TO_STRING_TAG, true);
	    }
	  }

	  // fix Array#{values, @@iterator}.name in V8 / FF
	  if (DEFAULT == VALUES && nativeIterator && nativeIterator.name !== VALUES) {
	    INCORRECT_VALUES_NAME = true;
	    defaultIterator = function values() { return nativeIterator.call(this); };
	  }

	  // define iterator
	  if ( IterablePrototype[ITERATOR$4] !== defaultIterator) {
	    createNonEnumerableProperty(IterablePrototype, ITERATOR$4, defaultIterator);
	  }
	  iterators[NAME] = defaultIterator;

	  // export additional methods
	  if (DEFAULT) {
	    methods = {
	      values: getIterationMethod(VALUES),
	      keys: IS_SET ? defaultIterator : getIterationMethod(KEYS),
	      entries: getIterationMethod(ENTRIES)
	    };
	    if (FORCED) for (KEY in methods) {
	      if (BUGGY_SAFARI_ITERATORS$1 || INCORRECT_VALUES_NAME || !(KEY in IterablePrototype)) {
	        redefine(IterablePrototype, KEY, methods[KEY]);
	      }
	    } else _export({ target: NAME, proto: true, forced: BUGGY_SAFARI_ITERATORS$1 || INCORRECT_VALUES_NAME }, methods);
	  }

	  return methods;
	};

	var SPECIES$4 = wellKnownSymbol('species');

	var setSpecies = function (CONSTRUCTOR_NAME) {
	  var Constructor = getBuiltIn(CONSTRUCTOR_NAME);
	  var defineProperty = objectDefineProperty.f;

	  if (descriptors && Constructor && !Constructor[SPECIES$4]) {
	    defineProperty(Constructor, SPECIES$4, {
	      configurable: true,
	      get: function () { return this; }
	    });
	  }
	};

	var defineProperty$4 = objectDefineProperty.f;








	var fastKey = internalMetadata.fastKey;


	var setInternalState$1 = internalState.set;
	var internalStateGetterFor = internalState.getterFor;

	var collectionStrong = {
	  getConstructor: function (wrapper, CONSTRUCTOR_NAME, IS_MAP, ADDER) {
	    var C = wrapper(function (that, iterable) {
	      anInstance(that, C, CONSTRUCTOR_NAME);
	      setInternalState$1(that, {
	        type: CONSTRUCTOR_NAME,
	        index: objectCreate(null),
	        first: undefined,
	        last: undefined,
	        size: 0
	      });
	      if (!descriptors) that.size = 0;
	      if (iterable != undefined) iterate_1(iterable, that[ADDER], that, IS_MAP);
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
	        if (descriptors) state.size++;
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
	        if (descriptors) state.size = 0;
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
	          if (descriptors) state.size--;
	          else that.size--;
	        } return !!entry;
	      },
	      // 23.2.3.6 Set.prototype.forEach(callbackfn, thisArg = undefined)
	      // 23.1.3.5 Map.prototype.forEach(callbackfn, thisArg = undefined)
	      forEach: function forEach(callbackfn /* , that = undefined */) {
	        var state = getInternalState(this);
	        var boundFunction = bindContext(callbackfn, arguments.length > 1 ? arguments[1] : undefined, 3);
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
	    if (descriptors) defineProperty$4(C.prototype, 'size', {
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
	      setInternalState$1(this, {
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

	// `Map` constructor
	// https://tc39.github.io/ecma262/#sec-map-objects
	var es_map = collection('Map', function (get) {
	  return function Map() { return get(this, arguments.length ? arguments[0] : undefined); };
	}, collectionStrong, true);

	var propertyIsEnumerable = objectPropertyIsEnumerable.f;

	// `Object.{ entries, values }` methods implementation
	var createMethod$4 = function (TO_ENTRIES) {
	  return function (it) {
	    var O = toIndexedObject(it);
	    var keys = objectKeys(O);
	    var length = keys.length;
	    var i = 0;
	    var result = [];
	    var key;
	    while (length > i) {
	      key = keys[i++];
	      if (!descriptors || propertyIsEnumerable.call(O, key)) {
	        result.push(TO_ENTRIES ? [key, O[key]] : O[key]);
	      }
	    }
	    return result;
	  };
	};

	var objectToArray = {
	  // `Object.entries` method
	  // https://tc39.github.io/ecma262/#sec-object.entries
	  entries: createMethod$4(true),
	  // `Object.values` method
	  // https://tc39.github.io/ecma262/#sec-object.values
	  values: createMethod$4(false)
	};

	var $entries = objectToArray.entries;

	// `Object.entries` method
	// https://tc39.github.io/ecma262/#sec-object.entries
	_export({ target: 'Object', stat: true }, {
	  entries: function entries(O) {
	    return $entries(O);
	  }
	});

	var charAt$1 = stringMultibyte.charAt;



	var STRING_ITERATOR = 'String Iterator';
	var setInternalState$2 = internalState.set;
	var getInternalState$1 = internalState.getterFor(STRING_ITERATOR);

	// `String.prototype[@@iterator]` method
	// https://tc39.github.io/ecma262/#sec-string.prototype-@@iterator
	defineIterator(String, 'String', function (iterated) {
	  setInternalState$2(this, {
	    type: STRING_ITERATOR,
	    string: String(iterated),
	    index: 0
	  });
	// `%StringIteratorPrototype%.next` method
	// https://tc39.github.io/ecma262/#sec-%stringiteratorprototype%.next
	}, function next() {
	  var state = getInternalState$1(this);
	  var string = state.string;
	  var index = state.index;
	  var point;
	  if (index >= string.length) return { value: undefined, done: true };
	  point = charAt$1(string, index);
	  state.index += point.length;
	  return { value: point, done: false };
	});

	var MATCH = wellKnownSymbol('match');

	// `IsRegExp` abstract operation
	// https://tc39.github.io/ecma262/#sec-isregexp
	var isRegexp = function (it) {
	  var isRegExp;
	  return isObject(it) && ((isRegExp = it[MATCH]) !== undefined ? !!isRegExp : classofRaw(it) == 'RegExp');
	};

	var SPECIES$5 = wellKnownSymbol('species');

	// `SpeciesConstructor` abstract operation
	// https://tc39.github.io/ecma262/#sec-speciesconstructor
	var speciesConstructor = function (O, defaultConstructor) {
	  var C = anObject(O).constructor;
	  var S;
	  return C === undefined || (S = anObject(C)[SPECIES$5]) == undefined ? defaultConstructor : aFunction$1(S);
	};

	var arrayPush = [].push;
	var min$3 = Math.min;
	var MAX_UINT32 = 0xFFFFFFFF;

	// babel-minify transpiles RegExp('x', 'y') -> /x/y and it causes SyntaxError
	var SUPPORTS_Y = !fails(function () { return !RegExp(MAX_UINT32, 'y'); });

	// @@split logic
	fixRegexpWellKnownSymbolLogic('split', 2, function (SPLIT, nativeSplit, maybeCallNative) {
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
	      if (!isRegexp(separator)) {
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
	      if (S.length === 0) return regexpExecAbstract(splitter, S) === null ? [S] : [];
	      var p = 0;
	      var q = 0;
	      var A = [];
	      while (q < S.length) {
	        splitter.lastIndex = SUPPORTS_Y ? q : 0;
	        var z = regexpExecAbstract(splitter, SUPPORTS_Y ? S : S.slice(q));
	        var e;
	        if (
	          z === null ||
	          (e = min$3(toLength(splitter.lastIndex + (SUPPORTS_Y ? 0 : q)), S.length)) === p
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

	var ARRAY_ITERATOR = 'Array Iterator';
	var setInternalState$3 = internalState.set;
	var getInternalState$2 = internalState.getterFor(ARRAY_ITERATOR);

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
	var es_array_iterator = defineIterator(Array, 'Array', function (iterated, kind) {
	  setInternalState$3(this, {
	    type: ARRAY_ITERATOR,
	    target: toIndexedObject(iterated), // target
	    index: 0,                          // next index
	    kind: kind                         // kind
	  });
	// `%ArrayIteratorPrototype%.next` method
	// https://tc39.github.io/ecma262/#sec-%arrayiteratorprototype%.next
	}, function () {
	  var state = getInternalState$2(this);
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
	iterators.Arguments = iterators.Array;

	// https://tc39.github.io/ecma262/#sec-array.prototype-@@unscopables
	addToUnscopables('keys');
	addToUnscopables('values');
	addToUnscopables('entries');

	var ITERATOR$5 = wellKnownSymbol('iterator');
	var TO_STRING_TAG$3 = wellKnownSymbol('toStringTag');
	var ArrayValues = es_array_iterator.values;

	for (var COLLECTION_NAME$1 in domIterables) {
	  var Collection$1 = global_1[COLLECTION_NAME$1];
	  var CollectionPrototype$1 = Collection$1 && Collection$1.prototype;
	  if (CollectionPrototype$1) {
	    // some Chrome versions have non-configurable methods on DOMTokenList
	    if (CollectionPrototype$1[ITERATOR$5] !== ArrayValues) try {
	      createNonEnumerableProperty(CollectionPrototype$1, ITERATOR$5, ArrayValues);
	    } catch (error) {
	      CollectionPrototype$1[ITERATOR$5] = ArrayValues;
	    }
	    if (!CollectionPrototype$1[TO_STRING_TAG$3]) {
	      createNonEnumerableProperty(CollectionPrototype$1, TO_STRING_TAG$3, COLLECTION_NAME$1);
	    }
	    if (domIterables[COLLECTION_NAME$1]) for (var METHOD_NAME in es_array_iterator) {
	      // some Chrome versions have non-configurable methods on DOMTokenList
	      if (CollectionPrototype$1[METHOD_NAME] !== es_array_iterator[METHOD_NAME]) try {
	        createNonEnumerableProperty(CollectionPrototype$1, METHOD_NAME, es_array_iterator[METHOD_NAME]);
	      } catch (error) {
	        CollectionPrototype$1[METHOD_NAME] = es_array_iterator[METHOD_NAME];
	      }
	    }
	  }
	}

	function _arrayWithHoles(arr) {
	  if (Array.isArray(arr)) return arr;
	}

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

	function _nonIterableRest() {
	  throw new TypeError("Invalid attempt to destructure non-iterable instance");
	}

	function _slicedToArray(arr, i) {
	  return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest();
	}

	function _classCallCheck(instance, Constructor) {
	  if (!(instance instanceof Constructor)) {
	    throw new TypeError("Cannot call a class as a function");
	  }
	}

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

	var startsWith = function startsWith(input, search) {
	  return input.substr(0, search.length) === search;
	};

	var MEETNOW_PREFIX = 'meetnow:';
	var MEETNOW_SESSION_KEY = 'meetnow-persist-config';
	var Config =
	/*#__PURE__*/
	function () {
	  function Config() {
	    _classCallCheck(this, Config);

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
	var CONFIG = new Config();
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
	var configFromURL = function configFromURL(win) {
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

	function ownKeys$2(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

	function _objectSpread$1(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys$2(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys$2(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }
	function setupConfig(config) {
	  var win = isMiniProgram() ? wx : window;
	  var MeetNow = win.MeetNow = win.MeetNow || {
	    config: config
	  }; // create the Ionic.config from raw config object (if it exists)
	  // and convert Ionic.config into a ConfigApi that has a get() fn

	  var configObj = _objectSpread$1({}, configFromSession(win), {
	    persistent: false
	  }, MeetNow.config, {}, configFromURL(win));

	  CONFIG.reset(configObj);

	  if (CONFIG.getBoolean('persistent')) {
	    saveConfig(win, configObj);
	  } // first see if the mode was set as an attribute on <html>
	  // which could have been set by the user, or by pre-rendering
	  // otherwise get the mode via config settings, and fallback to md


	  MeetNow.config = CONFIG;

	  if (CONFIG.getBoolean('testing')) {
	    CONFIG.set('debug', 'MN:*');
	  }
	}

	var nativeJoin = [].join;

	var ES3_STRINGS = indexedObject != Object;
	var SLOPPY_METHOD$1 = sloppyArrayMethod('join', ',');

	// `Array.prototype.join` method
	// https://tc39.github.io/ecma262/#sec-array.prototype.join
	_export({ target: 'Array', proto: true, forced: ES3_STRINGS || SLOPPY_METHOD$1 }, {
	  join: function join(separator) {
	    return nativeJoin.call(toIndexedObject(this), separator === undefined ? ',' : separator);
	  }
	});

	var RequestMethod = {
	  GET: 'get',
	  POST: 'post'
	};

	var baseURL = {
	  ctrl: '/conference-ctrl/api/v1/ctrl/',
	  usermgr: '/user-manager/api/v1/'
	};
	var configs = {
	  // user manager
	  getVirtualJWT: {
	    method: RequestMethod.GET,
	    url: "".concat(baseURL.usermgr, "external/virtualJwt/party")
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

	function _assertThisInitialized(self) {
	  if (self === void 0) {
	    throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
	  }

	  return self;
	}

	function _possibleConstructorReturn(self, call) {
	  if (call && (_typeof(call) === "object" || typeof call === "function")) {
	    return call;
	  }

	  return _assertThisInitialized(self);
	}

	function _getPrototypeOf(o) {
	  _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) {
	    return o.__proto__ || Object.getPrototypeOf(o);
	  };
	  return _getPrototypeOf(o);
	}

	function _setPrototypeOf(o, p) {
	  _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) {
	    o.__proto__ = p;
	    return o;
	  };

	  return _setPrototypeOf(o, p);
	}

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

	function _isNativeFunction(fn) {
	  return Function.toString.call(fn).indexOf("[native code]") !== -1;
	}

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

	function _construct(Parent, args, Class) {
	  if (isNativeReflectConstruct()) {
	    _construct = Reflect.construct;
	  } else {
	    _construct = function _construct(Parent, args, Class) {
	      var a = [null];
	      a.push.apply(a, args);
	      var Constructor = Function.bind.apply(Parent, a);
	      var instance = new Constructor();
	      if (Class) _setPrototypeOf(instance, Class.prototype);
	      return instance;
	    };
	  }

	  return _construct.apply(null, arguments);
	}

	function _wrapNativeSuper(Class) {
	  var _cache = typeof Map === "function" ? new Map() : undefined;

	  _wrapNativeSuper = function _wrapNativeSuper(Class) {
	    if (Class === null || !_isNativeFunction(Class)) return Class;

	    if (typeof Class !== "function") {
	      throw new TypeError("Super expression must either be null or a function");
	    }

	    if (typeof _cache !== "undefined") {
	      if (_cache.has(Class)) return _cache.get(Class);

	      _cache.set(Class, Wrapper);
	    }

	    function Wrapper() {
	      return _construct(Class, arguments, _getPrototypeOf(this).constructor);
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

	  return _wrapNativeSuper(Class);
	}

	var DEFAULT_ERROR = {
	  msg: 'Unknown Error',
	  errorCode: -1
	};
	var ApiError =
	/*#__PURE__*/
	function (_Error) {
	  _inherits(ApiError, _Error);

	  function ApiError(bizCode) {
	    var _this;

	    var error = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : DEFAULT_ERROR;

	    _classCallCheck(this, ApiError);

	    _this = _possibleConstructorReturn(this, _getPrototypeOf(ApiError).call(this));
	    _this.name = 'ApiError';
	    _this.message = error.msg;
	    _this.errCode = error.errorCode;
	    _this.bizCode = bizCode;
	    return _this;
	  }

	  return ApiError;
	}(_wrapNativeSuper(Error)); // TODO
	// api error type checker

	var log = debug('MN:Api:Request');
	var isCancel = axios.isCancel;
	function createRequest$1(config) {
	  var delegate = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : axios;
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
	    source = axios.CancelToken.source();
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

	function ownKeys$3(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

	function _objectSpread$2(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys$3(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys$3(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }
	var log$1 = debug('MN:Api'); // long polling timeout within 30 seconds

	var DEFAULT_TIMEOUT = 35 * 1000;
	function createApi() {
	  var config = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
	  log$1('createApi()');
	  var delegate = axios.create(_objectSpread$2({
	    baseURL: '/',
	    timeout: DEFAULT_TIMEOUT
	  }, config));
	  delegate.interceptors.response.use(function (response) {
	    var _response$data = response.data,
	        ret = _response$data.ret,
	        bizCode = _response$data.bizCode,
	        error = _response$data.error,
	        data = _response$data.data;
	    if (ret < 0) throw new ApiError(bizCode, error); // should not go here
	    // server impl error

	    if (ret === 0 && error) throw new ApiError(bizCode, error);
	    log$1('request success: %o', data); // TBD
	    // replace response data with actual data. eg. response.data = data;
	    // TODO
	    // normalize error

	    return response;
	  }, function (error) {
	    log$1('request error: %o', error);
	    throw error;
	  });

	  function request(apiName) {
	    log$1("request() \"".concat(apiName, "\""));
	    return createRequest$1(_objectSpread$2({}, CONFIGS[apiName]), delegate);
	  }

	  return {
	    get interceptors() {
	      return delegate.interceptors;
	    },

	    request: request
	  };
	}

	var log$2 = debug('MN:Worker');
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
	    _job = _asyncToGenerator(
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
	              interval = isFunction$1(nextInterval) ? nextInterval() : nextInterval; // schedule next

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
	    _start = _asyncToGenerator(
	    /*#__PURE__*/
	    regeneratorRuntime.mark(function _callee2() {
	      var immediate,
	          _args2 = arguments;
	      return regeneratorRuntime.wrap(function _callee2$(_context2) {
	        while (1) {
	          switch (_context2.prev = _context2.next) {
	            case 0:
	              immediate = _args2.length > 0 && _args2[0] !== undefined ? _args2[0] : true;
	              log$2('start()');

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
	    log$2('stop()');
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

	var defineProperty$5 = objectDefineProperty.f;


	var NativeSymbol = global_1.Symbol;

	if (descriptors && typeof NativeSymbol == 'function' && (!('description' in NativeSymbol.prototype) ||
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
	  defineProperty$5(symbolPrototype, 'description', {
	    configurable: true,
	    get: function description() {
	      var symbol = isObject(this) ? this.valueOf() : this;
	      var string = symbolToString.call(symbol);
	      if (has(EmptyStringDescriptionStore, symbol)) return '';
	      var desc = native ? string.slice(7, -1) : string.replace(regexp, '$1');
	      return desc === '' ? undefined : desc;
	    }
	  });

	  _export({ global: true, forced: true }, {
	    Symbol: SymbolWrapper
	  });
	}

	// `Reflect.get` method
	// https://tc39.github.io/ecma262/#sec-reflect.get
	function get$1(target, propertyKey /* , receiver */) {
	  var receiver = arguments.length < 3 ? target : arguments[2];
	  var descriptor, prototype;
	  if (anObject(target) === receiver) return target[propertyKey];
	  if (descriptor = objectGetOwnPropertyDescriptor.f(target, propertyKey)) return has(descriptor, 'value')
	    ? descriptor.value
	    : descriptor.get === undefined
	      ? undefined
	      : descriptor.get.call(receiver);
	  if (isObject(prototype = objectGetPrototypeOf(target))) return get$1(prototype, propertyKey, receiver);
	}

	_export({ target: 'Reflect', stat: true }, {
	  get: get$1
	});

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

	// `Symbol.iterator` well-known symbol
	// https://tc39.github.io/ecma262/#sec-symbol.iterator
	defineWellKnownSymbol('iterator');

	var max$3 = Math.max;
	var min$4 = Math.min;
	var MAX_SAFE_INTEGER$1 = 0x1FFFFFFFFFFFFF;
	var MAXIMUM_ALLOWED_LENGTH_EXCEEDED = 'Maximum allowed length exceeded';

	// `Array.prototype.splice` method
	// https://tc39.github.io/ecma262/#sec-array.prototype.splice
	// with adding support of @@species
	_export({ target: 'Array', proto: true, forced: !arrayMethodHasSpeciesSupport('splice') }, {
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
	      actualDeleteCount = min$4(max$3(toInteger(deleteCount), 0), len - actualStart);
	    }
	    if (len + insertCount - actualDeleteCount > MAX_SAFE_INTEGER$1) {
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

	var log$3 = debug('MN:Events');
	function createEvents() {
	  var scopedlog = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : log$3;
	  var instance;
	  var events = {};

	  function _on(event, fn) {
	    if (isArray$2(event)) {
	      event.forEach(function (ev) {
	        return _on(ev, fn);
	      });
	      return;
	    }

	    (events[event] || (events[event] = [])).push(fn);
	  }

	  function _off(event, fn) {
	    if (isArray$2(event)) {
	      event.forEach(function (e) {
	        return _off(e, fn);
	      });
	      return;
	    }

	    var callbacks = events[event];
	    if (!callbacks) return;

	    if (!fn) {
	      events[event] = null;
	      return;
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
	  }

	  function _once(event, fn) {
	    function wrapper() {
	      _off(event, wrapper);

	      for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
	        args[_key] = arguments[_key];
	      }

	      fn.apply(this, args);
	    }

	    wrapper.fn = fn;

	    _on(event, wrapper);
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

	  function _emit(event) {
	    scopedlog("emit() \"".concat(event, "\""));
	    var callbacks = events[event];
	    if (!callbacks) return;
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
	  }

	  return instance = {
	    on: function on(event, fn) {
	      _on(event, fn);

	      return instance;
	    },
	    off: function off(event, fn) {
	      _off(event, fn);

	      return instance;
	    },
	    once: function once(event, fn) {
	      _once(event, fn);

	      return instance;
	    },
	    emit: function emit(event) {
	      for (var _len3 = arguments.length, args = new Array(_len3 > 1 ? _len3 - 1 : 0), _key3 = 1; _key3 < _len3; _key3++) {
	        args[_key3 - 1] = arguments[_key3];
	      }

	      _emit.apply(void 0, [event].concat(args));

	      return instance;
	    }
	  };
	}

	function ownKeys$4(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

	function _objectSpread$3(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys$4(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys$4(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }
	var log$4 = debug('MN:Keepalive');
	var DEFAULT_INTERVAL = 30 * 1000;
	var MIN_INTERVAL = 2;
	var MAX_INTERVAL = 30;
	var MAX_ATTEMPTS = 15;

	function computeNextTimeout(attempts) {
	  log$4("computeNextTimeout() attempts: ".concat(attempts));
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
	    _keepalive = _asyncToGenerator(
	    /*#__PURE__*/
	    regeneratorRuntime.mark(function _callee() {
	      var response, error, _response$data, bizCode, _response$data$data, data, expectedInterval;

	      return regeneratorRuntime.wrap(function _callee$(_context) {
	        while (1) {
	          switch (_context.prev = _context.next) {
	            case 0:
	              log$4('keepalive()');
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
	              canceled = isCancel(_context.t0);

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
	              log$4('keepalive error: %o', error);
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

	  var worker = createWorker({
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
	  return _objectSpread$3({}, worker, {
	    keepalive: keepalive
	  });
	}

	function ownKeys$5(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

	function _objectSpread$4(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys$5(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys$5(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }
	var log$5 = debug('MN:Polling');
	var DEFAULT_INTERVAL$1 = 100;
	var MIN_INTERVAL$1 = 2;
	var MAX_INTERVAL$1 = 30;
	var MAX_ATTEMPTS$1 = 15;

	function computeNextTimeout$1(attempts) {
	  log$5("computeNextTimeout() attempts: ".concat(attempts));
	  /* eslint-disable-next-line no-restricted-properties */

	  var k = Math.floor(Math.random() * Math.pow(2, attempts) + 1);

	  if (k < MIN_INTERVAL$1) {
	    k = MIN_INTERVAL$1;
	  }

	  if (k > MAX_INTERVAL$1) {
	    k = MAX_INTERVAL$1;
	  }

	  return k * 1000;
	}

	function createPolling(config) {
	  var api = config.api;
	  var request;
	  var _interval = DEFAULT_INTERVAL$1;
	  var attempts = 0;
	  var version = 0;

	  function analyze(data) {
	    if (!data) return;
	    var newVersion = data.version,
	        category = data.category,
	        body = data.body;

	    if (!isDef(newVersion) || newVersion <= version) {
	      log$5("illegal version: ".concat(newVersion, ", current version: ").concat(version, "."));
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
	        log$5("unsupported category: ".concat(category));
	        break;
	    }

	    version = newVersion;
	  }

	  function poll() {
	    return _poll.apply(this, arguments);
	  }

	  function _poll() {
	    _poll = _asyncToGenerator(
	    /*#__PURE__*/
	    regeneratorRuntime.mark(function _callee() {
	      var response, error, canceled, timeouted, _response$data, bizCode, data;

	      return regeneratorRuntime.wrap(function _callee$(_context) {
	        while (1) {
	          switch (_context.prev = _context.next) {
	            case 0:
	              log$5('poll()');
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
	              canceled = isCancel(_context.t0);

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
	              _interval = computeNextTimeout$1(attempts);
	              log$5('polling error: %o', error);
	              config.onError && config.onError(error, attempts);

	            case 23:
	              if (attempts > MAX_ATTEMPTS$1) {
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
	                log$5('process data failed. %o', error);
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

	  var worker = createWorker({
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
	  return _objectSpread$4({}, worker, {
	    poll: poll,
	    analyze: analyze
	  });
	}

	// `Reflect.set` method
	// https://tc39.github.io/ecma262/#sec-reflect.set
	function set$1(target, propertyKey, V /* , receiver */) {
	  var receiver = arguments.length < 4 ? target : arguments[3];
	  var ownDescriptor = objectGetOwnPropertyDescriptor.f(anObject(target), propertyKey);
	  var existingDescriptor, prototype;
	  if (!ownDescriptor) {
	    if (isObject(prototype = objectGetPrototypeOf(target))) {
	      return set$1(prototype, propertyKey, V, receiver);
	    }
	    ownDescriptor = createPropertyDescriptor(0);
	  }
	  if (has(ownDescriptor, 'value')) {
	    if (ownDescriptor.writable === false || !isObject(receiver)) return false;
	    if (existingDescriptor = objectGetOwnPropertyDescriptor.f(receiver, propertyKey)) {
	      if (existingDescriptor.get || existingDescriptor.set || existingDescriptor.writable === false) return false;
	      existingDescriptor.value = V;
	      objectDefineProperty.f(receiver, propertyKey, existingDescriptor);
	    } else objectDefineProperty.f(receiver, propertyKey, createPropertyDescriptor(0, V));
	    return true;
	  }
	  return ownDescriptor.set === undefined ? false : (ownDescriptor.set.call(receiver, V), true);
	}

	_export({ target: 'Reflect', stat: true }, {
	  set: set$1
	});

	var log$6 = debug('MN:Reactive');
	function createReactive() {
	  var data = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
	  var events = arguments.length > 1 ? arguments[1] : undefined;
	  events = events || createEvents(log$6);
	  return new Proxy(data, {
	    set: function set(target, prop, value, receiver) {
	      var oldValue = target[prop];
	      var hadKey = hasOwn(target, prop);
	      var result = Reflect.set(target, prop, value, receiver);

	      if (!hadKey) {
	        events.emit("".concat(camelize(prop), "Added"), value);
	      }

	      if (hasChanged(value, oldValue)) {
	        events.emit("".concat(camelize(prop), "Changed"), value, oldValue);
	      }

	      return result;
	    }
	  });
	}

	function ownKeys$6(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

	function _objectSpread$5(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys$6(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys$6(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }
	var log$7 = debug('MN:Information:Description');
	function createDescription(data, context) {
	  var api = context.api;
	  var events = createEvents(log$7);
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
	    _setLock = _asyncToGenerator(
	    /*#__PURE__*/
	    regeneratorRuntime.mark(function _callee(options) {
	      var admissionPolicy, _options$attendeeByPa, attendeeByPass;

	      return regeneratorRuntime.wrap(function _callee$(_context) {
	        while (1) {
	          switch (_context.prev = _context.next) {
	            case 0:
	              log$7('setLock()');
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
	    _lock = _asyncToGenerator(
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
	              log$7('lock()');
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
	    _unlock = _asyncToGenerator(
	    /*#__PURE__*/
	    regeneratorRuntime.mark(function _callee3() {
	      return regeneratorRuntime.wrap(function _callee3$(_context3) {
	        while (1) {
	          switch (_context3.prev = _context3.next) {
	            case 0:
	              log$7('unlock()');
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

	  return description = _objectSpread$5({}, events, {
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

	function ownKeys$7(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

	function _objectSpread$6(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys$7(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys$7(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }
	var log$8 = debug('MN:Information:State');
	function createState(data, context) {
	  var events = createEvents(log$8);
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

	  return description = _objectSpread$6({}, events, {
	    get data() {
	      return data;
	    },

	    get: function get(key) {
	      return data[key];
	    },
	    update: update,
	    getSharingUserEntity: getSharingUserEntity,
	    getSpeechUserEntity: getSpeechUserEntity
	  });
	}

	var log$9 = debug('MN:Information:Layout');
	function createLayoutCtrl(api) {
	  function setLayout(_x) {
	    return _setLayout.apply(this, arguments);
	  }

	  function _setLayout() {
	    _setLayout = _asyncToGenerator(
	    /*#__PURE__*/
	    regeneratorRuntime.mark(function _callee(options) {
	      return regeneratorRuntime.wrap(function _callee$(_context) {
	        while (1) {
	          switch (_context.prev = _context.next) {
	            case 0:
	              log$9('setLayout()');
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
	    _setCustomizeLayout = _asyncToGenerator(
	    /*#__PURE__*/
	    regeneratorRuntime.mark(function _callee2(options) {
	      return regeneratorRuntime.wrap(function _callee2$(_context2) {
	        while (1) {
	          switch (_context2.prev = _context2.next) {
	            case 0:
	              log$9('setCustomizeLayout()');
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
	    _setPresenterLayout = _asyncToGenerator(
	    /*#__PURE__*/
	    regeneratorRuntime.mark(function _callee3(options) {
	      return regeneratorRuntime.wrap(function _callee3$(_context3) {
	        while (1) {
	          switch (_context3.prev = _context3.next) {
	            case 0:
	              log$9('setPresenterLayout()');
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
	    _setAttendeeLayout = _asyncToGenerator(
	    /*#__PURE__*/
	    regeneratorRuntime.mark(function _callee4(options) {
	      return regeneratorRuntime.wrap(function _callee4$(_context4) {
	        while (1) {
	          switch (_context4.prev = _context4.next) {
	            case 0:
	              log$9('setAttendeeLayout()');
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
	    _setCastViewerLayout = _asyncToGenerator(
	    /*#__PURE__*/
	    regeneratorRuntime.mark(function _callee5(options) {
	      return regeneratorRuntime.wrap(function _callee5$(_context5) {
	        while (1) {
	          switch (_context5.prev = _context5.next) {
	            case 0:
	              log$9('setCastViewerLayout()');
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
	    _setOSD = _asyncToGenerator(
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
	              log$9('setOSD()');
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
	    _setSpeakMode = _asyncToGenerator(
	    /*#__PURE__*/
	    regeneratorRuntime.mark(function _callee7(mode) {
	      return regeneratorRuntime.wrap(function _callee7$(_context7) {
	        while (1) {
	          switch (_context7.prev = _context7.next) {
	            case 0:
	              log$9('setSpeakMode()');
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

	function ownKeys$8(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

	function _objectSpread$7(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys$8(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys$8(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }
	var log$a = debug('MN:Information:Danmaku');
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
	    _setDanmaku = _asyncToGenerator(
	    /*#__PURE__*/
	    regeneratorRuntime.mark(function _callee(config) {
	      var finalConfig, type, position, displayTime, repeatCount, repeatInterval, rollDirection;
	      return regeneratorRuntime.wrap(function _callee$(_context) {
	        while (1) {
	          switch (_context.prev = _context.next) {
	            case 0:
	              log$a('setDanmaku()');
	              finalConfig = _objectSpread$7({}, lastConfig, {
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
	    _sendDanmaku = _asyncToGenerator(
	    /*#__PURE__*/
	    regeneratorRuntime.mark(function _callee2(msg, options) {
	      var _ref, _ref$attendee, attendee, _ref$castviewer, castviewer, _ref$presenter, presenter;

	      return regeneratorRuntime.wrap(function _callee2$(_context2) {
	        while (1) {
	          switch (_context2.prev = _context2.next) {
	            case 0:
	              log$a('sendDanmaku()');
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

	function ownKeys$9(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

	function _objectSpread$8(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys$9(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys$9(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }
	var log$b = debug('MN:Information:View');
	function createView(data, context) {
	  var api = context.api;
	  var events = createEvents(log$b);
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

	  return view = _objectSpread$8({}, events, {
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

	var log$c = debug('MN:Information:Camera');
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
	    _action = _asyncToGenerator(
	    /*#__PURE__*/
	    regeneratorRuntime.mark(function _callee(type) {
	      return regeneratorRuntime.wrap(function _callee$(_context) {
	        while (1) {
	          switch (_context.prev = _context.next) {
	            case 0:
	              log$c('action()');
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

	function ownKeys$a(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

	function _objectSpread$9(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys$a(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys$a(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }
	var log$d = debug('MN:Information:User');
	function createUser(data, context) {
	  var api = context.api,
	      userId = context.userId;
	  var events = createEvents(log$d);
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
	  } // user ctrl


	  function setFilter(_x) {
	    return _setFilter.apply(this, arguments);
	  }

	  function _setFilter() {
	    _setFilter = _asyncToGenerator(
	    /*#__PURE__*/
	    regeneratorRuntime.mark(function _callee(options) {
	      var label, enable, endpoint, media;
	      return regeneratorRuntime.wrap(function _callee$(_context) {
	        while (1) {
	          switch (_context.prev = _context.next) {
	            case 0:
	              log$d('setFilter()');
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
	    _setAudioFilter = _asyncToGenerator(
	    /*#__PURE__*/
	    regeneratorRuntime.mark(function _callee2(enable) {
	      return regeneratorRuntime.wrap(function _callee2$(_context2) {
	        while (1) {
	          switch (_context2.prev = _context2.next) {
	            case 0:
	              log$d('setAudioFilter()');
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
	    _setVideoFilter = _asyncToGenerator(
	    /*#__PURE__*/
	    regeneratorRuntime.mark(function _callee3(enable) {
	      return regeneratorRuntime.wrap(function _callee3$(_context3) {
	        while (1) {
	          switch (_context3.prev = _context3.next) {
	            case 0:
	              log$d('setVideoFilter()');
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
	    _setDisplayText = _asyncToGenerator(
	    /*#__PURE__*/
	    regeneratorRuntime.mark(function _callee4(displayText) {
	      return regeneratorRuntime.wrap(function _callee4$(_context4) {
	        while (1) {
	          switch (_context4.prev = _context4.next) {
	            case 0:
	              log$d('setDisplayText()');
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
	    _setRole = _asyncToGenerator(
	    /*#__PURE__*/
	    regeneratorRuntime.mark(function _callee5(role) {
	      return regeneratorRuntime.wrap(function _callee5$(_context5) {
	        while (1) {
	          switch (_context5.prev = _context5.next) {
	            case 0:
	              log$d('setRole()');
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
	    _setFocus = _asyncToGenerator(
	    /*#__PURE__*/
	    regeneratorRuntime.mark(function _callee6() {
	      var enable,
	          _args6 = arguments;
	      return regeneratorRuntime.wrap(function _callee6$(_context6) {
	        while (1) {
	          switch (_context6.prev = _context6.next) {
	            case 0:
	              enable = _args6.length > 0 && _args6[0] !== undefined ? _args6[0] : true;
	              log$d('setFocus()');
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
	    _getStats = _asyncToGenerator(
	    /*#__PURE__*/
	    regeneratorRuntime.mark(function _callee7() {
	      return regeneratorRuntime.wrap(function _callee7$(_context7) {
	        while (1) {
	          switch (_context7.prev = _context7.next) {
	            case 0:
	              log$d('getStats()');
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
	    _kick = _asyncToGenerator(
	    /*#__PURE__*/
	    regeneratorRuntime.mark(function _callee8() {
	      return regeneratorRuntime.wrap(function _callee8$(_context8) {
	        while (1) {
	          switch (_context8.prev = _context8.next) {
	            case 0:
	              log$d('kick()');
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
	    _hold = _asyncToGenerator(
	    /*#__PURE__*/
	    regeneratorRuntime.mark(function _callee9() {
	      return regeneratorRuntime.wrap(function _callee9$(_context9) {
	        while (1) {
	          switch (_context9.prev = _context9.next) {
	            case 0:
	              log$d('hold()');
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
	    _unhold = _asyncToGenerator(
	    /*#__PURE__*/
	    regeneratorRuntime.mark(function _callee10() {
	      return regeneratorRuntime.wrap(function _callee10$(_context10) {
	        while (1) {
	          switch (_context10.prev = _context10.next) {
	            case 0:
	              log$d('unhold()');
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
	    _allow = _asyncToGenerator(
	    /*#__PURE__*/
	    regeneratorRuntime.mark(function _callee11() {
	      return regeneratorRuntime.wrap(function _callee11$(_context11) {
	        while (1) {
	          switch (_context11.prev = _context11.next) {
	            case 0:
	              log$d('allow()');
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
	    _accept = _asyncToGenerator(
	    /*#__PURE__*/
	    regeneratorRuntime.mark(function _callee12() {
	      return regeneratorRuntime.wrap(function _callee12$(_context12) {
	        while (1) {
	          switch (_context12.prev = _context12.next) {
	            case 0:
	              log$d('accept()');
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
	    _reject = _asyncToGenerator(
	    /*#__PURE__*/
	    regeneratorRuntime.mark(function _callee13() {
	      return regeneratorRuntime.wrap(function _callee13$(_context13) {
	        while (1) {
	          switch (_context13.prev = _context13.next) {
	            case 0:
	              log$d('reject()');
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
	    _sendMessage = _asyncToGenerator(
	    /*#__PURE__*/
	    regeneratorRuntime.mark(function _callee14(msg) {
	      var chatChannel;
	      return regeneratorRuntime.wrap(function _callee14$(_context14) {
	        while (1) {
	          switch (_context14.prev = _context14.next) {
	            case 0:
	              log$d('sendMessage()');
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

	  return user = _objectSpread$9({}, events, {
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

	var log$e = debug('MN:Information:Lobby');
	function createLobbyCtrl(api) {
	  function remove(_x) {
	    return _remove.apply(this, arguments);
	  }

	  function _remove() {
	    _remove = _asyncToGenerator(
	    /*#__PURE__*/
	    regeneratorRuntime.mark(function _callee(entity) {
	      var apiName;
	      return regeneratorRuntime.wrap(function _callee$(_context) {
	        while (1) {
	          switch (_context.prev = _context.next) {
	            case 0:
	              log$e('remove()');
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
	    _unhold = _asyncToGenerator(
	    /*#__PURE__*/
	    regeneratorRuntime.mark(function _callee2(entity) {
	      var apiName;
	      return regeneratorRuntime.wrap(function _callee2$(_context2) {
	        while (1) {
	          switch (_context2.prev = _context2.next) {
	            case 0:
	              log$e('unhold()');
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
	    _allow = _asyncToGenerator(
	    /*#__PURE__*/
	    regeneratorRuntime.mark(function _callee3(entity) {
	      return regeneratorRuntime.wrap(function _callee3$(_context3) {
	        while (1) {
	          switch (_context3.prev = _context3.next) {
	            case 0:
	              log$e('allow()');
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
	    _hold = _asyncToGenerator(
	    /*#__PURE__*/
	    regeneratorRuntime.mark(function _callee4(entity) {
	      var apiName;
	      return regeneratorRuntime.wrap(function _callee4$(_context4) {
	        while (1) {
	          switch (_context4.prev = _context4.next) {
	            case 0:
	              log$e('hold()');
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

	function ownKeys$b(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

	function _objectSpread$a(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys$b(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys$b(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }
	var log$f = debug('MN:Information:Users');
	function createUsers(data, context) {
	  var api = context.api;
	  var events = createEvents(log$f);
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
	      log$f('added user:\n\n %s(%s) \n', user.getDisplayText(), user.getEntity());
	      users.emit('user:added', user);
	    });
	    updated.forEach(function (userdata) {
	      var entity = userdata.entity;
	      var user = userMap.get(entity); // user data is not proxied, so update it here
	      // if user data is 'full', it will replace the old one

	      user.update(userdata);
	      log$f('updated user:\n\n %s(%s)  \n', user.getDisplayText(), user.getEntity());
	      users.emit('user:updated', user);
	    });
	    deleted.forEach(function (userdata) {
	      var entity = userdata.entity;
	      var user = userMap.get(entity);
	      log$f('deleted user:\n\n %s(%s)  \n', user.getDisplayText(), user.getEntity());
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
	    _invite = _asyncToGenerator(
	    /*#__PURE__*/
	    regeneratorRuntime.mark(function _callee(option) {
	      return regeneratorRuntime.wrap(function _callee$(_context) {
	        while (1) {
	          switch (_context.prev = _context.next) {
	            case 0:
	              log$f('invite');
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
	    _kick = _asyncToGenerator(
	    /*#__PURE__*/
	    regeneratorRuntime.mark(function _callee2(entity) {
	      return regeneratorRuntime.wrap(function _callee2$(_context2) {
	        while (1) {
	          switch (_context2.prev = _context2.next) {
	            case 0:
	              log$f('kick');
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
	    _mute = _asyncToGenerator(
	    /*#__PURE__*/
	    regeneratorRuntime.mark(function _callee3() {
	      return regeneratorRuntime.wrap(function _callee3$(_context3) {
	        while (1) {
	          switch (_context3.prev = _context3.next) {
	            case 0:
	              log$f('mute');
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
	    _unmute = _asyncToGenerator(
	    /*#__PURE__*/
	    regeneratorRuntime.mark(function _callee4() {
	      return regeneratorRuntime.wrap(function _callee4$(_context4) {
	        while (1) {
	          switch (_context4.prev = _context4.next) {
	            case 0:
	              log$f('unmute');
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

	  return users = _objectSpread$a({}, events, {
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

	var log$g = debug('MN:Information:RTMP');
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
	    _operation = _asyncToGenerator(
	    /*#__PURE__*/
	    regeneratorRuntime.mark(function _callee(type) {
	      return regeneratorRuntime.wrap(function _callee$(_context) {
	        while (1) {
	          switch (_context.prev = _context.next) {
	            case 0:
	              log$g('operation');
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
	    operation: operation,
	    start: start,
	    stop: stop,
	    pause: pause,
	    resume: resume
	  };
	}

	function ownKeys$c(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

	function _objectSpread$b(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys$c(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys$c(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }
	var log$h = debug('MN:Information:RTMP');
	function createRTMP(data, context) {
	  var api = context.api;
	  var events = createEvents(log$h);
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

	  return rtmp = _objectSpread$b({}, events, {
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

	var log$i = debug('MN:Information:Record');
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
	    _operation = _asyncToGenerator(
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
	    operation: operation,
	    start: start,
	    stop: stop,
	    pause: pause,
	    resume: resume
	  };
	}

	function ownKeys$d(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

	function _objectSpread$c(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys$d(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys$d(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }
	var log$j = debug('MN:Information:Record');
	function createRecord(data, context) {
	  var api = context.api;
	  var events = createEvents(log$j);
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

	  return record = _objectSpread$c({}, events, {
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

	var $findIndex = arrayIteration.findIndex;


	var FIND_INDEX = 'findIndex';
	var SKIPS_HOLES$1 = true;

	// Shouldn't skip holes
	if (FIND_INDEX in []) Array(1)[FIND_INDEX](function () { SKIPS_HOLES$1 = false; });

	// `Array.prototype.findIndex` method
	// https://tc39.github.io/ecma262/#sec-array.prototype.findindex
	_export({ target: 'Array', proto: true, forced: SKIPS_HOLES$1 }, {
	  findIndex: function findIndex(callbackfn /* , that = undefined */) {
	    return $findIndex(this, callbackfn, arguments.length > 1 ? arguments[1] : undefined);
	  }
	});

	// https://tc39.github.io/ecma262/#sec-array.prototype-@@unscopables
	addToUnscopables(FIND_INDEX);

	var log$k = debug('MN:Information:Item');
	function isItem(item) {
	  return isDef(item) && isObject$2(item) && !isArray$2(item);
	}
	function isPartialableItem(item) {
	  return isItem(item) && hasOwn(item, 'state');
	}
	function mergeItemList(rhys, items) {
	  log$k('mergelist()');
	  var _iteratorNormalCompletion = true;
	  var _didIteratorError = false;
	  var _iteratorError = undefined;

	  try {
	    var _loop = function _loop() {
	      var item = _step.value;

	      if (!isPartialableItem(item)) {
	        log$k('we don not know how to process a non-partialable item in a list, because it is undocumented');
	        log$k('treat it as full state item');
	      }

	      var id = item.id,
	          entity = item.entity,
	          _item$state = item.state,
	          state = _item$state === void 0 ? 'full' : _item$state;
	      var key = entity || id;

	      if (!key) {
	        log$k('missing item identity(entity or id).');
	        return "continue";
	      }

	      var index = rhys.findIndex(function (it) {
	        return it.entity === key || it.id === key;
	      });
	      log$k('item identity: %o', key); // not find

	      if (index === -1) {
	        if (state === 'deleted') {
	          log$k('can not delete item not exist.');
	          return "continue";
	        }

	        log$k('item added');
	        rhys.push(item);
	        return "continue";
	      } // finded
	      // this is weird as we don't know whether the item list is partial or not


	      if (state === 'full') {
	        rhys.splice(index, 1, item);
	        return "continue";
	      } // wanna delete


	      if (state === 'deleted') {
	        log$k('item deleted');
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
	  log$k('merge()');

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
	    log$k("Error: unknown item state. ".concat(state));
	    log$k('use merge policy as "partial"');
	  }

	  for (var key in item) {
	    if (hasOwn(item, key)) {
	      var value = item[key];
	      var current = rhys[key];
	      log$k('item key: %s value: %o -> %o', key, current, value);
	      rhys[key] = isArray$2(value) ? mergeItemList(current, value) : isItem(value) ? mergeItem(current, value) : value;
	    }
	  }

	  return rhys;
	}

	function ownKeys$e(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

	function _objectSpread$d(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys$e(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys$e(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }
	var log$l = debug('MN:Information');
	function createInformation(data, context) {
	  var events = createEvents(log$l);
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
	  var state = createState(createdata('conference-state'));
	  var view = createView(createdata('conference-view'), context);
	  var users = createUsers(createdata('users'), context);
	  var rtmp = createRTMP(createdata('rtmp-state'), context);
	  var record = createRecord(createdata('record-users'), context);
	  var information;

	  function update(val) {
	    log$l('update()');
	    var version = data.version;
	    var newVersion = val.version,
	        newState = val.state;

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
	      api.request('getFullInfo').send().then(function (response) {
	        return update(response.data.data);
	      }).catch(function (error) {
	        return log$l('get full information failed: %o', error);
	      });
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

	      if (hasOwn(val, key)) {
	        part.update(val[key]);
	      }
	    });
	    events.emit('updated', information);
	  }

	  return information = _objectSpread$d({}, events, {
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

	var defineProperty$6 = objectDefineProperty.f;
	var getOwnPropertyNames$1 = objectGetOwnPropertyNames.f;







	var MATCH$1 = wellKnownSymbol('match');
	var NativeRegExp = global_1.RegExp;
	var RegExpPrototype$1 = NativeRegExp.prototype;
	var re1 = /a/g;
	var re2 = /a/g;

	// "new" should create a new object, old webkit bug
	var CORRECT_NEW = new NativeRegExp(re1) !== re1;

	var FORCED$2 = descriptors && isForced_1('RegExp', (!CORRECT_NEW || fails(function () {
	  re2[MATCH$1] = false;
	  // RegExp constructor can alter flags and IsRegExp works correct with @@match
	  return NativeRegExp(re1) != re1 || NativeRegExp(re2) == re2 || NativeRegExp(re1, 'i') != '/a/i';
	})));

	// `RegExp` constructor
	// https://tc39.github.io/ecma262/#sec-regexp-constructor
	if (FORCED$2) {
	  var RegExpWrapper = function RegExp(pattern, flags) {
	    var thisIsRegExp = this instanceof RegExpWrapper;
	    var patternIsRegExp = isRegexp(pattern);
	    var flagsAreUndefined = flags === undefined;
	    return !thisIsRegExp && patternIsRegExp && pattern.constructor === RegExpWrapper && flagsAreUndefined ? pattern
	      : inheritIfRequired(CORRECT_NEW
	        ? new NativeRegExp(patternIsRegExp && !flagsAreUndefined ? pattern.source : pattern, flags)
	        : NativeRegExp((patternIsRegExp = pattern instanceof RegExpWrapper)
	          ? pattern.source
	          : pattern, patternIsRegExp && flagsAreUndefined ? regexpFlags.call(pattern) : flags)
	      , thisIsRegExp ? this : RegExpPrototype$1, RegExpWrapper);
	  };
	  var proxy = function (key) {
	    key in RegExpWrapper || defineProperty$6(RegExpWrapper, key, {
	      configurable: true,
	      get: function () { return NativeRegExp[key]; },
	      set: function (it) { NativeRegExp[key] = it; }
	    });
	  };
	  var keys$2 = getOwnPropertyNames$1(NativeRegExp);
	  var index = 0;
	  while (keys$2.length > index) proxy(keys$2[index++]);
	  RegExpPrototype$1.constructor = RegExpWrapper;
	  RegExpWrapper.prototype = RegExpPrototype$1;
	  redefine(global_1, 'RegExp', RegExpWrapper);
	}

	// https://tc39.github.io/ecma262/#sec-get-regexp-@@species
	setSpecies('RegExp');

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
	    if (typeof stream.stop === 'function' || _typeof(stream.stop) === 'object') {
	      stream.stop();
	    }
	  }
	}

	function setup(stream) {
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

	function getUserMedia(_x) {
	  return _getUserMedia.apply(this, arguments);
	}

	function _getUserMedia() {
	  _getUserMedia = _asyncToGenerator(
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
	            return _context.abrupt("return", setup(stream));

	          case 14:
	          case "end":
	            return _context.stop();
	        }
	      }
	    }, _callee);
	  }));
	  return _getUserMedia.apply(this, arguments);
	}

	var globalIsFinite = global_1.isFinite;

	// `Number.isFinite` method
	// https://tc39.github.io/ecma262/#sec-number.isfinite
	var numberIsFinite = Number.isFinite || function isFinite(it) {
	  return typeof it == 'number' && globalIsFinite(it);
	};

	// `Number.isFinite` method
	// https://tc39.github.io/ecma262/#sec-number.isfinite
	_export({ target: 'Number', stat: true }, { isFinite: numberIsFinite });

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

	    if (!stats.codecId || !stats.trackId || !stats.transportId) ;

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

	function ownKeys$f(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

	function _objectSpread$e(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys$f(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys$f(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }
	var log$m = debug('MN:Channel');
	var browser$1 = getBrowser();
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
	      bye = config.bye;
	  var events = createEvents(log$m); // The RTCPeerConnection instance (public attribute).

	  var connection;
	  var status = STATUS.kNull;
	  var canceled = false;
	  var rtcStats = createRTCStats(); // Prevent races on serial PeerConnction operations.

	  var rtcConstraints;
	  var rtcOfferConstraints; // Local MediaStream.

	  var localMediaStream;
	  var localMediaStreamLocallyGenerated = false; // Flag to indicate PeerConnection ready for new actions.

	  var rtcReady = false;

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
	    log$m('createRTCConnection()');
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
	    _createLocalDescription = _asyncToGenerator(
	    /*#__PURE__*/
	    regeneratorRuntime.mark(function _callee(type, constraints) {
	      var desc, sdp;
	      return regeneratorRuntime.wrap(function _callee$(_context) {
	        while (1) {
	          switch (_context.prev = _context.next) {
	            case 0:
	              log$m('createLocalDescription()');
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
	              log$m('createOffer failed: %o', _context.t0);
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
	              log$m('createAnswer failed: %o', _context.t1);
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
	              log$m('setLocalDescription failed: %o', _context.t2);
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
	    _connect = _asyncToGenerator(
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
	              log$m('connect()');
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
	                log$m('getusermedia failed: %o', error);
	                throw error;
	              });

	            case 22:
	              localMediaStream = _context2.sent;
	              localMediaStreamLocallyGenerated = true;

	            case 24:
	              throwIfTerminated();

	              if (localMediaStream) {
	                localMediaStream.getTracks().forEach(function (track) {
	                  connection.addTrack(track, localMediaStream);
	                });
	              }

	              _context2.next = 28;
	              return createLocalDescription('offer', rtcOfferConstraints).catch(function (error) {
	                /* eslint-disable-next-line no-use-before-define */
	                onFailed('local', 'WebRTC Error');
	                log$m('createOff|setLocalDescription failed: %o', error);
	                throw error;
	              });

	            case 28:
	              localSDP = _context2.sent;
	              throwIfTerminated();
	              status = STATUS.kOffered;
	              _context2.prev = 31;
	              _context2.next = 34;
	              return invite({
	                sdp: localSDP
	              });

	            case 34:
	              answer = _context2.sent;
	              _context2.next = 42;
	              break;

	            case 37:
	              _context2.prev = 37;
	              _context2.t0 = _context2["catch"](31);

	              /* eslint-disable-next-line no-use-before-define */
	              onFailed('local', 'Request Error');
	              log$m('invite failed: %o', _context2.t0);
	              throw _context2.t0;

	            case 42:
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
	                _context2.next = 63;
	                break;
	              }

	              _context2.prev = 48;
	              _context2.next = 51;
	              return connection.createOffer();

	            case 51:
	              offer = _context2.sent;
	              _context2.next = 54;
	              return connection.setLocalDescription(offer);

	            case 54:
	              _context2.next = 63;
	              break;

	            case 56:
	              _context2.prev = 56;
	              _context2.t1 = _context2["catch"](48);

	              /* eslint-disable-next-line no-use-before-define */
	              onFailed('local', 'WebRTC Error');
	              log$m('createOff|setLocalDescription failed: %o', _context2.t1);
	              _context2.next = 62;
	              return bye();

	            case 62:
	              throw _context2.t1;

	            case 63:
	              _context2.prev = 63;
	              _context2.next = 66;
	              return connection.setRemoteDescription({
	                type: 'answer',
	                sdp: desc.sdp
	              });

	            case 66:
	              _context2.next = 76;
	              break;

	            case 68:
	              _context2.prev = 68;
	              _context2.t2 = _context2["catch"](63);

	              /* eslint-disable-next-line no-use-before-define */
	              onFailed('local', 'Bad Media Description');
	              events.emit('peerconnection:setremotedescriptionfailed', _context2.t2);
	              log$m('setRemoteDescription failed: %o', _context2.t2);
	              _context2.next = 75;
	              return bye();

	            case 75:
	              throw _context2.t2;

	            case 76:
	              _context2.prev = 76;
	              _context2.next = 79;
	              return confirm();

	            case 79:
	              _context2.next = 86;
	              break;

	            case 81:
	              _context2.prev = 81;
	              _context2.t3 = _context2["catch"](76);

	              /* eslint-disable-next-line no-use-before-define */
	              onFailed('local', 'Request Error');
	              log$m('confirm failed: %o', _context2.t3);
	              throw _context2.t3;

	            case 86:
	              status = STATUS.kAccepted;
	              /* eslint-disable-next-line no-use-before-define */

	              onAccepted('local');
	              events.emit('connected');

	            case 89:
	            case "end":
	              return _context2.stop();
	          }
	        }
	      }, _callee2, null, [[31, 37], [48, 56], [63, 68], [76, 81]]);
	    }));
	    return _connect.apply(this, arguments);
	  }

	  function terminate(_x3) {
	    return _terminate.apply(this, arguments);
	  }

	  function _terminate() {
	    _terminate = _asyncToGenerator(
	    /*#__PURE__*/
	    regeneratorRuntime.mark(function _callee3(reason) {
	      return regeneratorRuntime.wrap(function _callee3$(_context3) {
	        while (1) {
	          switch (_context3.prev = _context3.next) {
	            case 0:
	              log$m('terminate()');
	              _context3.t0 = status;
	              _context3.next = _context3.t0 === STATUS.kNull ? 4 : _context3.t0 === STATUS.kTerminated ? 4 : _context3.t0 === STATUS.kProgress ? 5 : _context3.t0 === STATUS.kOffered ? 5 : _context3.t0 === STATUS.kAnswered ? 15 : _context3.t0 === STATUS.kAccepted ? 15 : 19;
	              break;

	            case 4:
	              return _context3.abrupt("break", 20);

	            case 5:
	              log$m('canceling channel');

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
	    log$m('close()');
	    if (status === STATUS.kTerminated) return;

	    if (connection) {
	      try {
	        connection.close();
	        connection = undefined;
	      } catch (error) {
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

	    if (localHold || remoteHold ) {
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
	      originator: originator,
	      message: message
	    });
	  }

	  function onAccepted(originator, message) {
	    log$m('channel accepted');
	    events.emit('accepted', {
	      originator: originator,
	      message: message
	    });
	  }

	  function onEnded(originator, message) {
	    log$m('channel ended');
	    close();
	    events.emit('ended', {
	      originator: originator,
	      message: message
	    });
	  }

	  function onFailed(originator, message) {
	    log$m('channel failed');
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
	    log$m('mute()');
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
	    log$m('unmute()');
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
	    _hold = _asyncToGenerator(
	    /*#__PURE__*/
	    regeneratorRuntime.mark(function _callee4() {
	      return regeneratorRuntime.wrap(function _callee4$(_context4) {
	        while (1) {
	          switch (_context4.prev = _context4.next) {
	            case 0:
	              log$m('unhold()');

	              if (!localHold) {
	                _context4.next = 4;
	                break;
	              }

	              log$m('Already hold');
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
	    _unhold = _asyncToGenerator(
	    /*#__PURE__*/
	    regeneratorRuntime.mark(function _callee5() {
	      return regeneratorRuntime.wrap(function _callee5$(_context5) {
	        while (1) {
	          switch (_context5.prev = _context5.next) {
	            case 0:
	              log$m('unhold()');

	              if (localHold) {
	                _context5.next = 4;
	                break;
	              }

	              log$m('Already unhold');
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
	    _renegotiate = _asyncToGenerator(
	    /*#__PURE__*/
	    regeneratorRuntime.mark(function _callee6() {
	      var localSDP,
	          answer,
	          desc;
	      return regeneratorRuntime.wrap(function _callee6$(_context6) {
	        while (1) {
	          switch (_context6.prev = _context6.next) {
	            case 0:
	              log$m('renegotiate()');

	              if (rtcReady) {
	                _context6.next = 5;
	                break;
	              }

	              log$m('RTC not ready');
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
	            case "end":
	              return _context6.stop();
	          }
	        }
	      }, _callee6, null, [[13, 17]]);
	    }));
	    return _renegotiate.apply(this, arguments);
	  }

	  function mangleOffer(offer) {
	    log$m('mangleOffer()'); // nothing to do

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
	    }

	    return write(sdp);
	  }

	  function getRemoteStream() {
	    log$m('getRemoteStream()');
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

	  function addLocalStream(stream) {
	    log$m('addLocalStream()');
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
	    log$m('removeLocalStream()');

	    if (connection.getSenders && connection.removeTrack) {
	      connection.getSenders().forEach(function (sender) {
	        if (sender.track) {
	          sender.track.stop();
	        }

	        connection.removeTrack(sender);
	      });
	    } else if (connection.getLocalStreams && connection.removeStream) {
	      connection.getLocalStreams().forEach(function (stream) {
	        stream.getTracks().forEach(function (track) {
	          track.stop();
	        });
	        connection.removeStream(stream);
	      });
	    }
	  }

	  function getLocalStream() {
	    log$m('getLocalStream()');
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

	  function setLocalStream(stream) {
	    removeLocalStream();
	    addLocalStream(stream);
	  }

	  function replaceLocalStream(_x4) {
	    return _replaceLocalStream.apply(this, arguments);
	  }

	  function _replaceLocalStream() {
	    _replaceLocalStream = _asyncToGenerator(
	    /*#__PURE__*/
	    regeneratorRuntime.mark(function _callee8(stream) {
	      var renegotiation,
	          audioTrack,
	          videoTrack,
	          queue,
	          renegotiationNeeded,
	          peerHasAudio,
	          peerHasVideo,
	          shimReplaceTrack,
	          _args8 = arguments;
	      return regeneratorRuntime.wrap(function _callee8$(_context8) {
	        while (1) {
	          switch (_context8.prev = _context8.next) {
	            case 0:
	              shimReplaceTrack = function _ref(sender) {
	                sender.replaceTrack =
	                /*#__PURE__*/
	                function () {
	                  var _replaceTrack = _asyncToGenerator(
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

	              renegotiation = _args8.length > 1 && _args8[1] !== undefined ? _args8[1] : false;
	              log$m('replaceLocalStream()');
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
	                        log$m('replace audio track error: %o', e);
	                      }));
	                    }

	                    if (videoTrack && sender.track.kind === 'video') {
	                      queue.push(sender.replaceTrack(videoTrack).catch(function (e) {
	                        log$m('replace video track error: %o', e);
	                      }));
	                    }
	                  });
	                }
	              }

	              _context8.next = 12;
	              return Promise.all(queue);

	            case 12:
	            case "end":
	              return _context8.stop();
	          }
	        }
	      }, _callee8);
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
	    _adjustBandWidth = _asyncToGenerator(
	    /*#__PURE__*/
	    regeneratorRuntime.mark(function _callee9(options) {
	      var audio, video, queue;
	      return regeneratorRuntime.wrap(function _callee9$(_context9) {
	        while (1) {
	          switch (_context9.prev = _context9.next) {
	            case 0:
	              log$m('adjustBandWidth()');
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
	                      log$m('apply audio parameters error: %o', e);
	                    }));
	                  }

	                  if (typeof video !== 'undefined' && sender.track.kind === 'video') {
	                    if (video === 0) {
	                      delete parameters.encodings[0].maxBitrate;
	                    } else {
	                      parameters.encodings[0].maxBitrate = video * 1024;
	                    }

	                    queue.push(sender.setParameters(parameters).catch(function (e) {
	                      log$m('apply video parameters error: %o', e);
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
	                  log$m('applying bandwidth restriction to setRemoteDescription error: %o', e);
	                }));
	              }

	              _context9.next = 6;
	              return Promise.all(queue);

	            case 6:
	            case "end":
	              return _context9.stop();
	          }
	        }
	      }, _callee9);
	    }));
	    return _adjustBandWidth.apply(this, arguments);
	  }

	  function applyConstraints(_x6) {
	    return _applyConstraints.apply(this, arguments);
	  }

	  function _applyConstraints() {
	    _applyConstraints = _asyncToGenerator(
	    /*#__PURE__*/
	    regeneratorRuntime.mark(function _callee10(options) {
	      var audio, video, queue;
	      return regeneratorRuntime.wrap(function _callee10$(_context10) {
	        while (1) {
	          switch (_context10.prev = _context10.next) {
	            case 0:
	              log$m('applyConstraints()');
	              audio = options.audio, video = options.video;
	              queue = [];

	              if (connection.getSenders && window.MediaStreamTrack.prototype.applyConstraints) {
	                connection.getSenders().forEach(function (sender) {
	                  if (audio && sender.track && sender.track.kind === 'audio') {
	                    queue.push(sender.track.applyConstraints(audio).catch(function (e) {
	                      log$m('apply audio constraints error: %o', e);
	                    }));
	                  }

	                  if (video && sender.track && sender.track.kind === 'video') {
	                    queue.push(sender.track.applyConstraints(video).catch(function (e) {
	                      log$m('apply video constraints error: %o', e);
	                    }));
	                  }
	                });
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
	    return _applyConstraints.apply(this, arguments);
	  }

	  function getStats() {
	    return _getStats.apply(this, arguments);
	  }

	  function _getStats() {
	    _getStats = _asyncToGenerator(
	    /*#__PURE__*/
	    regeneratorRuntime.mark(function _callee11() {
	      var stats;
	      return regeneratorRuntime.wrap(function _callee11$(_context11) {
	        while (1) {
	          switch (_context11.prev = _context11.next) {
	            case 0:
	              log$m('getStats()');

	              if (!(connection.signalingState === 'stable')) {
	                _context11.next = 14;
	                break;
	              }

	              if (!browser$1.chrome) {
	                _context11.next = 8;
	                break;
	              }

	              _context11.next = 5;
	              return new Promise(function (resolve) {
	                connection.getStats(function (stats) {
	                  resolve(stats.result());
	                });
	              });

	            case 5:
	              stats = _context11.sent;
	              _context11.next = 11;
	              break;

	            case 8:
	              _context11.next = 10;
	              return connection.getStats();

	            case 10:
	              stats = _context11.sent;

	            case 11:
	              rtcStats.update(stats);
	              _context11.next = 15;
	              break;

	            case 14:
	              log$m('update rtc stats failed since connection is unstable.');

	            case 15:
	              return _context11.abrupt("return", rtcStats);

	            case 16:
	            case "end":
	              return _context11.stop();
	          }
	        }
	      }, _callee11);
	    }));
	    return _getStats.apply(this, arguments);
	  }

	  return _objectSpread$e({}, events, {
	    get status() {
	      return status;
	    },

	    get connection() {
	      return connection;
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
	    addLocalStream: addLocalStream,
	    removeLocalStream: removeLocalStream,
	    getLocalStream: getLocalStream,
	    setLocalStream: setLocalStream,
	    replaceLocalStream: replaceLocalStream,
	    adjustBandWidth: adjustBandWidth,
	    applyConstraints: applyConstraints,
	    getStats: getStats
	  });
	}

	// `Array.from` method implementation
	// https://tc39.github.io/ecma262/#sec-array.from
	var arrayFrom = function from(arrayLike /* , mapfn = undefined, thisArg = undefined */) {
	  var O = toObject(arrayLike);
	  var C = typeof this == 'function' ? this : Array;
	  var argumentsLength = arguments.length;
	  var mapfn = argumentsLength > 1 ? arguments[1] : undefined;
	  var mapping = mapfn !== undefined;
	  var index = 0;
	  var iteratorMethod = getIteratorMethod(O);
	  var length, result, step, iterator, next;
	  if (mapping) mapfn = bindContext(mapfn, argumentsLength > 2 ? arguments[2] : undefined, 2);
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

	var INCORRECT_ITERATION = !checkCorrectnessOfIteration(function (iterable) {
	  Array.from(iterable);
	});

	// `Array.from` method
	// https://tc39.github.io/ecma262/#sec-array.from
	_export({ target: 'Array', stat: true, forced: INCORRECT_ITERATION }, {
	  from: arrayFrom
	});

	var nativeSort = [].sort;
	var test$1 = [1, 2, 3];

	// IE8-
	var FAILS_ON_UNDEFINED = fails(function () {
	  test$1.sort(undefined);
	});
	// V8 bug
	var FAILS_ON_NULL = fails(function () {
	  test$1.sort(null);
	});
	// Old WebKit
	var SLOPPY_METHOD$2 = sloppyArrayMethod('sort');

	var FORCED$3 = FAILS_ON_UNDEFINED || !FAILS_ON_NULL || SLOPPY_METHOD$2;

	// `Array.prototype.sort` method
	// https://tc39.github.io/ecma262/#sec-array.prototype.sort
	_export({ target: 'Array', proto: true, forced: FORCED$3 }, {
	  sort: function sort(comparefn) {
	    return comparefn === undefined
	      ? nativeSort.call(toObject(this))
	      : nativeSort.call(toObject(this), aFunction$1(comparefn));
	  }
	});

	// `Set` constructor
	// https://tc39.github.io/ecma262/#sec-set-objects
	var es_set = collection('Set', function (get) {
	  return function Set() { return get(this, arguments.length ? arguments[0] : undefined); };
	}, collectionStrong);

	var notARegexp = function (it) {
	  if (isRegexp(it)) {
	    throw TypeError("The method doesn't accept regular expressions");
	  } return it;
	};

	var MATCH$2 = wellKnownSymbol('match');

	var correctIsRegexpLogic = function (METHOD_NAME) {
	  var regexp = /./;
	  try {
	    '/./'[METHOD_NAME](regexp);
	  } catch (e) {
	    try {
	      regexp[MATCH$2] = false;
	      return '/./'[METHOD_NAME](regexp);
	    } catch (f) { /* empty */ }
	  } return false;
	};

	// `String.prototype.includes` method
	// https://tc39.github.io/ecma262/#sec-string.prototype.includes
	_export({ target: 'String', proto: true, forced: !correctIsRegexpLogic('includes') }, {
	  includes: function includes(searchString /* , position = 0 */) {
	    return !!~String(requireObjectCoercible(this))
	      .indexOf(notARegexp(searchString), arguments.length > 1 ? arguments[1] : undefined);
	  }
	});

	var log$n = debug('MN:SDP');
	var browser$2 = getBrowser();
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

	            if (browser$2.firefox || browser$2.chrome && parseInt(browser$2.version, 10) < 63 && _content === 'slides') {
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

	        if (type === 'offer' && browser$2.firefox) {
	          sdp.media.forEach(function (m) {
	            if (m.mid === undefined) {
	              m.mid = m.type === 'audio' ? 0 : m.type === 'video' ? 1 : m.mid;
	            }
	          });
	        }
	      }

	      data.sdp = write(sdp);
	      log$n("".concat(originator, " sdp: \n\n %s \n"), data.sdp);
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

	function ownKeys$g(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

	function _objectSpread$f(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys$g(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys$g(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }
	var log$o = debug('MN:MediaChannel');
	function createMediaChannel(config) {
	  var api = config.api,
	      _config$type = config.type,
	      type = _config$type === void 0 ? 'main' : _config$type;
	  var mediaVersion;
	  var callId;
	  var request;
	  var icetimmeout;
	  var localstream;
	  var remotestream;
	  var channel = createChannel({
	    invite: function () {
	      var _invite = _asyncToGenerator(
	      /*#__PURE__*/
	      regeneratorRuntime.mark(function _callee(offer) {
	        var sdp, apiName, response, _response$data$data;

	        return regeneratorRuntime.wrap(function _callee$(_context) {
	          while (1) {
	            switch (_context.prev = _context.next) {
	              case 0:
	                log$o('invite()');
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
	                mediaVersion = _response$data$data['media-version'];
	                callId = _response$data$data['mcu-callid'];
	                log$o('MCU call-id: %s', callId);
	                return _context.abrupt("return", {
	                  sdp: sdp
	                });

	              case 13:
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
	      log$o('confirm()');
	      request = undefined;
	      localstream = channel.getLocalStream();
	      channel.emit('localstream', localstream); // send confirm
	    },
	    cancel: function cancel() {
	      log$o('cancel()');
	      request && request.cancel();
	    },
	    bye: function bye() {
	      log$o('bye()');
	      request = undefined;
	    }
	  });
	  channel.on('sdp', createModifier().content(type).prefer('h264').build());
	  channel.on('peerconnection', function (pc) {
	    pc.addEventListener('connectionstatechange', function () {
	      log$o('peerconnection:connectionstatechange : %s', pc.connectionState);
	    });
	    pc.addEventListener('iceconnectionstatechange', function () {
	      log$o('peerconnection:iceconnectionstatechange : %s', pc.iceConnectionState);
	    });
	    pc.addEventListener('icegatheringstatechange', function () {
	      log$o('peerconnection:icegatheringstatechange : %s', pc.iceGatheringState);
	    });
	    pc.addEventListener('negotiationneeded', function () {
	      log$o('peerconnection:negotiationneeded');
	    });
	    pc.addEventListener('track', function (event) {
	      log$o('peerconnection:track: %o', event);
	      remotestream = event.streams[0];
	      channel.emit('remotestream', remotestream);
	    }); // for old browser(firefox)

	    pc.addEventListener('addstream', function (event) {
	      log$o('peerconnection:addstream: %o', event);
	      remotestream = event.stream;
	      channel.emit('remotestream', remotestream);
	    });
	    pc.addEventListener('removestream', function (event) {
	      log$o('peerconnection:removestream: %o', event);
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
	        log$o('ICE gathering timeout in 3 seconds');
	        ready();
	      }, 3000);
	    }
	  });
	  return _objectSpread$f({}, channel, {
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
	    }

	  });
	}

	var MessageStatus;

	(function (MessageStatus) {
	  MessageStatus[MessageStatus["kNull"] = 0] = "kNull";
	  MessageStatus[MessageStatus["kSending"] = 1] = "kSending";
	  MessageStatus[MessageStatus["kSuccess"] = 2] = "kSuccess";
	  MessageStatus[MessageStatus["kFailed"] = 3] = "kFailed";
	})(MessageStatus || (MessageStatus = {}));

	var log$p = debug('MN:Message');
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
	    _send = _asyncToGenerator(
	    /*#__PURE__*/
	    regeneratorRuntime.mark(function _callee(message, target) {
	      var response, _response, data, _data$data;

	      return regeneratorRuntime.wrap(function _callee$(_context) {
	        while (1) {
	          switch (_context.prev = _context.next) {
	            case 0:
	              log$p('send()');

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
	    _retry = _asyncToGenerator(
	    /*#__PURE__*/
	    regeneratorRuntime.mark(function _callee2() {
	      return regeneratorRuntime.wrap(function _callee2$(_context2) {
	        while (1) {
	          switch (_context2.prev = _context2.next) {
	            case 0:
	              log$p('retry()');

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

	function ownKeys$h(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

	function _objectSpread$g(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys$h(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys$h(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }
	var log$q = debug('MN:ChatChannel');
	function createChatChannel(config) {
	  var api = config.api,
	      sender = config.sender;
	  var events = createEvents(log$q);
	  var messages = [];
	  var request;
	  var ready = false;

	  function connect() {
	    return _connect.apply(this, arguments);
	  }

	  function _connect() {
	    _connect = _asyncToGenerator(
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
	              log$q('connect()');

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
	    _terminate = _asyncToGenerator(
	    /*#__PURE__*/
	    regeneratorRuntime.mark(function _callee2() {
	      return regeneratorRuntime.wrap(function _callee2$(_context2) {
	        while (1) {
	          switch (_context2.prev = _context2.next) {
	            case 0:
	              log$q('terminate()');
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
	    _sendMessage = _asyncToGenerator(
	    /*#__PURE__*/
	    regeneratorRuntime.mark(function _callee3(msg, target) {
	      var message;
	      return regeneratorRuntime.wrap(function _callee3$(_context3) {
	        while (1) {
	          switch (_context3.prev = _context3.next) {
	            case 0:
	              log$q('sendMessage()');
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
	    log$q('incoming()');
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

	  return _objectSpread$g({}, events, {
	    get ready() {
	      return ready;
	    },

	    connect: connect,
	    terminate: terminate,
	    sendMessage: sendMessage,
	    incoming: incoming
	  });
	}

	function ownKeys$i(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

	function _objectSpread$h(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys$i(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys$i(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }
	var log$r = debug('MN:Conference');
	var miniprogram = isMiniProgram();
	var browser$3 = getBrowser();

	(function (STATUS) {
	  STATUS[STATUS["kNull"] = 0] = "kNull";
	  STATUS[STATUS["kConnecting"] = 1] = "kConnecting";
	  STATUS[STATUS["kConnected"] = 2] = "kConnected";
	  STATUS[STATUS["kDisconnecting"] = 3] = "kDisconnecting";
	  STATUS[STATUS["kDisconnected"] = 4] = "kDisconnected";
	})(exports.STATUS || (exports.STATUS = {}));

	function createConference(config) {
	  var api = config.api;
	  var events = createEvents(log$r);
	  var keepalive;
	  var polling;
	  var information;
	  var interceptor;
	  var conference;
	  var mediaChannel;
	  var shareChannel;
	  var chatChannel;
	  var user; // current user

	  var status = exports.STATUS.kNull;
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

	  function maybeChat() {
	    return _maybeChat.apply(this, arguments);
	  }

	  function _maybeChat() {
	    _maybeChat = _asyncToGenerator(
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
	    _join = _asyncToGenerator(
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
	              log$r('join()');
	              throwIfNotStatus(exports.STATUS.kNull);

	              if (!(!options.url && !options.number)) {
	                _context2.next = 5;
	                break;
	              }

	              throw new TypeError('Invalid Number');

	            case 5:
	              status = exports.STATUS.kConnecting;
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
	              useragent = CONFIG.get('useragent', "Yealink ".concat(miniprogram ? 'WECHAT' : 'WEB-APP', " ", "1.0.0-beta"));
	              clientinfo = CONFIG.get('clientinfo', "".concat(miniprogram ? 'Apollo_WeChat' : 'Apollo_WebRTC', " ", "1.0.0-beta")); // join focus

	              apiName = miniprogram ? 'joinWechat' : 'joinFocus';
	              request = api.request(apiName).data({
	                // 'conference-uuid'     : null,
	                // 'conference-user-id'  : null,
	                'conference-url': options.url,
	                'conference-pwd': options.password,
	                'user-agent': useragent,
	                'client-url': options.url.replace(/\w+@/g, miniprogram ? 'wechat@' : 'webrtc@'),
	                'client-display-text': options.displayName || "".concat(browser$3),
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

	              if (!(!userId || !uuid)) {
	                _context2.next = 39;
	                break;
	              }

	              log$r('internal error');
	              throw new Error('Internal Error');

	            case 39:
	              url = options.url;
	              // setup request interceptor for ctrl api
	              interceptor = api.interceptors.request.use(function (config) {
	                if (/conference-ctrl/.test(config.url) && config.method === 'post') {
	                  config.data = _objectSpread$h({
	                    'conference-user-id': userId,
	                    'conference-uuid': uuid
	                  }, config.data);
	                }

	                return config;
	              }); // get full info

	              request = api.request('getFullInfo');
	              _context2.prev = 42;
	              _context2.next = 45;
	              return request.send();

	            case 45:
	              response = _context2.sent;
	              _context2.next = 52;
	              break;

	            case 48:
	              _context2.prev = 48;
	              _context2.t1 = _context2["catch"](42);
	              events.emit('failed', _context2.t1);
	              throw _context2.t1;

	            case 52:
	              _response3 = response;
	              data = _response3.data;
	              info = data.data; // create context

	              context = createContext(conference); // create information

	              information = createInformation(info, context);
	              onConnected();
	              return _context2.abrupt("return", conference);

	            case 59:
	            case "end":
	              return _context2.stop();
	          }
	        }
	      }, _callee2, null, [[20, 26], [42, 48]]);
	    }));
	    return _join.apply(this, arguments);
	  }

	  function leave() {
	    return _leave.apply(this, arguments);
	  }

	  function _leave() {
	    _leave = _asyncToGenerator(
	    /*#__PURE__*/
	    regeneratorRuntime.mark(function _callee3() {
	      return regeneratorRuntime.wrap(function _callee3$(_context3) {
	        while (1) {
	          switch (_context3.prev = _context3.next) {
	            case 0:
	              throwIfStatus(exports.STATUS.kDisconnecting);
	              throwIfStatus(exports.STATUS.kDisconnected);
	              _context3.t0 = status;
	              _context3.next = _context3.t0 === exports.STATUS.kNull ? 5 : _context3.t0 === exports.STATUS.kConnecting ? 6 : _context3.t0 === exports.STATUS.kConnected ? 6 : _context3.t0 === exports.STATUS.kDisconnecting ? 15 : _context3.t0 === exports.STATUS.kDisconnected ? 15 : 15;
	              break;

	            case 5:
	              return _context3.abrupt("break", 16);

	            case 6:
	              if (!(status === exports.STATUS.kConnected)) {
	                _context3.next = 13;
	                break;
	              }

	              onDisconnecting();
	              _context3.next = 10;
	              return api.request('leave').send();

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
	    _end = _asyncToGenerator(
	    /*#__PURE__*/
	    regeneratorRuntime.mark(function _callee4() {
	      return regeneratorRuntime.wrap(function _callee4$(_context4) {
	        while (1) {
	          switch (_context4.prev = _context4.next) {
	            case 0:
	              throwIfNotStatus(exports.STATUS.kConnected);
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
	      events.emit('sharinguser', users.getUser(val));
	    });
	    state.on('speechUserEntityChanged', function (val) {
	      events.emit('speechuser', users.getUser(val));
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
	        log$r('receive information: %o', data);
	        information.update(data);
	        events.emit('information', information);
	        getCurrentUser();
	      },
	      onMessage: function onMessage(data) {
	        log$r('receive message: %o', data);
	        chatChannel.incoming(data);
	      },
	      onRenegotiate: function onRenegotiate(data) {
	        log$r('receive renegotiate: %o', data);
	        mediaChannel.renegotiate();
	      },
	      onQuit: function onQuit(data) {
	        log$r('receive quit: %o', data);
	        if (status === exports.STATUS.kDisconnecting || status === exports.STATUS.kDisconnected) return; // bizCode = 901314 ended by presenter
	        // bizCode = 901320 kicked by presenter

	        onDisconnected(data);
	      },
	      onError: function onError(data) {
	        log$r('polling error, about to leave...');
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
	    _share = _asyncToGenerator(
	    /*#__PURE__*/
	    regeneratorRuntime.mark(function _callee5(options) {
	      return regeneratorRuntime.wrap(function _callee5$(_context5) {
	        while (1) {
	          switch (_context5.prev = _context5.next) {
	            case 0:
	              throwIfNotStatus(exports.STATUS.kConnected);

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
	    _setSharing = _asyncToGenerator(
	    /*#__PURE__*/
	    regeneratorRuntime.mark(function _callee6() {
	      var enable,
	          _args6 = arguments;
	      return regeneratorRuntime.wrap(function _callee6$(_context6) {
	        while (1) {
	          switch (_context6.prev = _context6.next) {
	            case 0:
	              enable = _args6.length > 0 && _args6[0] !== undefined ? _args6[0] : true;
	              throwIfNotStatus(exports.STATUS.kConnected);
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
	    _sendMessage = _asyncToGenerator(
	    /*#__PURE__*/
	    regeneratorRuntime.mark(function _callee7(msg, target) {
	      return regeneratorRuntime.wrap(function _callee7$(_context7) {
	        while (1) {
	          switch (_context7.prev = _context7.next) {
	            case 0:
	              throwIfNotStatus(exports.STATUS.kConnected);

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

	  return conference = _objectSpread$h({}, events, {
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

	function ownKeys$j(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

	function _objectSpread$i(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys$j(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys$j(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }
	var log$s = debug('MN:UA');
	function urlToNumber(url) {
	  var parts = url.split('@');
	  var number = parts[0];
	  var enterprise = parts[1].split('.')[0];
	  return "".concat(number, ".").concat(enterprise);
	}
	function createUA(config) {
	  var api;
	  var worker;
	  var token;
	  var partyId;
	  var url;

	  function createUserApi() {
	    var auth = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : true;
	    var api = createApi({
	      baseURL: CONFIG.get('baseurl',  'https://meetings.ylyun.com/webapp/')
	    });
	    api.interceptors.request.use(function (config) {
	      if (auth && token) {
	        config.headers = config.headers || {};
	        config.headers.token = token;
	      }

	      return config;
	    });
	    return api;
	  }

	  function auth() {
	    return _auth.apply(this, arguments);
	  }

	  function _auth() {
	    _auth = _asyncToGenerator(
	    /*#__PURE__*/
	    regeneratorRuntime.mark(function _callee() {
	      var response;
	      return regeneratorRuntime.wrap(function _callee$(_context) {
	        while (1) {
	          switch (_context.prev = _context.next) {
	            case 0:
	              log$s('auth()');

	              if (partyId) {
	                _context.next = 3;
	                break;
	              }

	              throw new Error('Authorization Error');

	            case 3:
	              _context.next = 5;
	              return api.request('getVirtualJWT').params({
	                id: partyId
	              }).send();

	            case 5:
	              response = _context.sent;
	              token = response.data.data.token;

	              if (token) {
	                _context.next = 9;
	                break;
	              }

	              throw new Error('Authorization Error');

	            case 9:
	            case "end":
	              return _context.stop();
	          }
	        }
	      }, _callee);
	    }));
	    return _auth.apply(this, arguments);
	  }

	  function stop() {
	    log$s('stop()');

	    if (worker) {
	      worker.stop();
	    } // clear token will break all api request


	    token = undefined;
	  }

	  function fetch(_x) {
	    return _fetch.apply(this, arguments);
	  } // currently, we don't support connect multiple conference for authenticate reason


	  function _fetch() {
	    _fetch = _asyncToGenerator(
	    /*#__PURE__*/
	    regeneratorRuntime.mark(function _callee2(number) {
	      var response, data, info, partyId, url, _response, _data$data, _response2, _response3;

	      return regeneratorRuntime.wrap(function _callee2$(_context2) {
	        while (1) {
	          switch (_context2.prev = _context2.next) {
	            case 0:
	              log$s('fetch()');

	              if (!api) {
	                api = createUserApi(false);
	              } // get conference url


	              _context2.next = 4;
	              return api.request('getURL').data({
	                'long-number': number
	              }).send();

	            case 4:
	              response = _context2.sent;
	              _response = response;
	              data = _response.data;
	              _data$data = data.data;
	              partyId = _data$data['party-id'];
	              url = _data$data.url;
	              _context2.prev = 10;
	              _context2.next = 13;
	              return api.request('getBasicInfo').data({
	                'conference-url': url
	              }).send();

	            case 13:
	              response = _context2.sent;
	              _response2 = response;
	              data = _response2.data;
	              info = data.data;
	              _context2.next = 34;
	              break;

	            case 19:
	              _context2.prev = 19;
	              _context2.t0 = _context2["catch"](10);
	              log$s('Conference not started.');
	              _context2.prev = 22;
	              _context2.next = 25;
	              return api.request('getBasicInfoOffline').data({
	                'long-number': number
	              }).send();

	            case 25:
	              response = _context2.sent;
	              _response3 = response;
	              data = _response3.data;
	              info = data.data;
	              _context2.next = 34;
	              break;

	            case 31:
	              _context2.prev = 31;
	              _context2.t1 = _context2["catch"](22);
	              log$s('Conference not exist.');

	            case 34:
	              if (info) {
	                _context2.next = 36;
	                break;
	              }

	              throw new Error('Not Exist');

	            case 36:
	              return _context2.abrupt("return", {
	                partyId: partyId,
	                number: number,
	                url: url,
	                info: info
	              });

	            case 37:
	            case "end":
	              return _context2.stop();
	          }
	        }
	      }, _callee2, null, [[10, 19], [22, 31]]);
	    }));
	    return _fetch.apply(this, arguments);
	  }

	  function connect(_x2) {
	    return _connect.apply(this, arguments);
	  }

	  function _connect() {
	    _connect = _asyncToGenerator(
	    /*#__PURE__*/
	    regeneratorRuntime.mark(function _callee4(options) {
	      var number, response, data, _data$data2, conference, join;

	      return regeneratorRuntime.wrap(function _callee4$(_context4) {
	        while (1) {
	          switch (_context4.prev = _context4.next) {
	            case 0:
	              log$s('connect()'); // create user api

	              if (!api) {
	                api = createUserApi(false);
	              } // creat auth() worker


	              if (!worker) {
	                worker = createWorker({
	                  interval: 5 * 60 * 1000,
	                  work: function () {
	                    var _work = _asyncToGenerator(
	                    /*#__PURE__*/
	                    regeneratorRuntime.mark(function _callee3() {
	                      return regeneratorRuntime.wrap(function _callee3$(_context3) {
	                        while (1) {
	                          switch (_context3.prev = _context3.next) {
	                            case 0:
	                              _context3.next = 2;
	                              return auth();

	                            case 2:
	                            case "end":
	                              return _context3.stop();
	                          }
	                        }
	                      }, _callee3);
	                    }));

	                    function work() {
	                      return _work.apply(this, arguments);
	                    }

	                    return work;
	                  }()
	                });
	              }

	              if (options.number) {
	                _context4.next = 5;
	                break;
	              }

	              throw new TypeError('Invalid Number');

	            case 5:
	              number = options.number; // get conference url

	              _context4.next = 8;
	              return api.request('getURL').data({
	                'long-number': number
	              }).send();

	            case 8:
	              response = _context4.sent;
	              data = response.data;
	              /* eslint-disable-next-line prefer-const */

	              _data$data2 = data.data;
	              partyId = _data$data2['party-id'];
	              url = _data$data2.url;
	              _context4.next = 15;
	              return worker.start();

	            case 15:
	              conference = createConference({
	                api: createUserApi()
	              }); // hack join method

	              join = conference.join;

	              conference.join = function (additional) {
	                return join(_objectSpread$i({
	                  url: url
	                }, options, {}, additional));
	              }; // stop auth worker as we can only connect one conference


	              conference.once('disconnected', stop);
	              return _context4.abrupt("return", conference);

	            case 20:
	            case "end":
	              return _context4.stop();
	          }
	        }
	      }, _callee4);
	    }));
	    return _connect.apply(this, arguments);
	  }

	  return {
	    stop: stop,
	    fetch: fetch,
	    connect: connect
	  };
	}

	function createMedia() {
	  return {};
	}

	var log$t = debug('MN');
	var version$1 = "1.0.0-beta"; // global setup

	function setup$1(config) {
	  setupConfig(config);

	  if (isMiniProgram()) {
	    axios.defaults.adapter = mpAdapter;
	  }

	  debug.enable(CONFIG.get('debug', 'MN*,-MN:Api*,-MN:Information:Item,-MN:Worker'));
	  log$t('setup() [version]: %s', version$1);
	}

	function connect(_x) {
	  return _connect.apply(this, arguments);
	}

	function _connect() {
	  _connect = _asyncToGenerator(
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
	  return _connect.apply(this, arguments);
	}

	var index$1 = {
	  version: version$1,
	  createUA: createUA,
	  setup: setup$1,
	  connect: connect
	};

	exports.debug = debug;
	exports.axios = axios;
	exports.adapter = mpAdapter;
	exports.createConference = createConference;
	exports.createEvents = createEvents;
	exports.createMedia = createMedia;
	exports.createReactive = createReactive;
	exports.createUA = createUA;
	exports.default = index$1;
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

	return exports;

}({}, debug, axios));
