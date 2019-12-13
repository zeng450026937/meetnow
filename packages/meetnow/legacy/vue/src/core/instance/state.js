import Watcher from '../observer/watcher';
import Dep, { pushTarget, popTarget } from '../observer/dep';

import {
  set,
  del,
  observe,
  defineReactive,
  toggleObserving,
} from '../observer/index';

import {
  bind,
  noop,
  hasOwn,
  isReserved,
  handleError,
  nativeWatch,
  validateProp,
  isPlainObject,
  isFunction,
} from '../util/index';

const sharedPropertyDefinition = {
  enumerable   : true,
  configurable : true,
  get          : noop,
  set          : noop,
};

export function proxy(target, sourceKey, key) {
  sharedPropertyDefinition.get = function proxyGetter() {
    return this[sourceKey][key];
  };
  sharedPropertyDefinition.set = function proxySetter(val) {
    this[sourceKey][key] = val;
  };
  Object.defineProperty(target, key, sharedPropertyDefinition);
}

function initProps(vm, propsOptions) {
  const propsData = vm.$options.propsData || {};
  const props = vm._props = {};
  // cache prop keys so that future props updates can iterate using Array
  // instead of dynamic object key enumeration.
  const keys = vm.$options._propKeys = [];
  const isRoot = !vm.$parent;
  // root instance props should be converted

  if (!isRoot) {
    toggleObserving(false);
  }
  Object.keys(propsOptions).forEach((key) => {
    keys.push(key);
    const value = validateProp(key, propsOptions, propsData, vm);

    defineReactive(props, key, value);

    // static props are already proxied on the component's prototype
    // during Vue.extend(). We only need to proxy props defined at
    // instantiation here.
    if (!(key in vm)) proxy(vm, '_props', key);
  });
  toggleObserving(true);
}

function initData(vm) {
  let data = vm.$options.data;

  data = vm._data = typeof data === 'function'
    ? getData(data, vm)
    : data || {};
  if (!isPlainObject(data)) {
    data = {};
  }
  // proxy data on instance
  const keys = Object.keys(data);
  const props = vm.$options.props;

  let i = keys.length;

  while (i--) {
    const key = keys[i];

    if (props && hasOwn(props, key)) {
      //
    }
    else if (!isReserved(key)) {
      proxy(vm, '_data', key);
    }
  }
  // observe data
  observe(data, true);
}

export function getData(data, vm) {
  // #7573 disable dep collection when invoking data getters
  pushTarget();
  try {
    return data.call(vm, vm);
  }
  catch (e) {
    handleError(e, vm, 'data()');

    return {};
  }
  finally {
    popTarget();
  }
}

const computedWatcherOptions = { lazy: true };

function initComputed(vm, computed = {}) {
  // $flow-disable-line
  const watchers = vm._computedWatchers = Object.create(null);

  Object.keys(computed).forEach((key) => {
    const userDef = computed[key];
    const getter = isFunction(userDef) ? userDef : userDef.get;

    watchers[key] = new Watcher(
      vm,
      getter || noop,
      noop,
      computedWatcherOptions,
    );
    // component-defined computed properties are already defined on the
    // component prototype. We only need to define computed properties defined
    // at instantiation here.
    if (!(key in vm)) {
      defineComputed(vm, key, userDef);
    }
  });
}

export function defineComputed(target, key, userDef) {
  if (isFunction(userDef)) {
    sharedPropertyDefinition.get = createComputedGetter(key);
    sharedPropertyDefinition.set = noop;
  }
  else {
    sharedPropertyDefinition.get = userDef.get
      ? userDef.cache !== false
        ? createComputedGetter(key)
        : createGetterInvoker(userDef.get)
      : noop;
    sharedPropertyDefinition.set = userDef.set || noop;
  }
  Object.defineProperty(target, key, sharedPropertyDefinition);
}

function createComputedGetter(key) {
  return function computedGetter() {
    const watcher = this._computedWatchers && this._computedWatchers[key];

    if (watcher) {
      if (watcher.dirty) {
        watcher.evaluate();
      }
      if (Dep.target) {
        watcher.depend();
      }

      return watcher.value;
    }
  };
}

function createGetterInvoker(fn) {
  return function computedGetter() {
    return fn.call(this, this);
  };
}

function initMethods(vm, methods = {}) {
  Object.keys(methods).forEach((key) => {
    vm[key] = typeof methods[key] !== 'function' ? noop : bind(methods[key], vm);
  });
}

function initWatch(vm, watch = {}) {
  Object.keys(watch).forEach((key) => {
    const handler = watch[key];

    if (Array.isArray(handler)) {
      for (let i = 0; i < handler.length; i++) {
        createWatcher(vm, key, handler[i]);
      }
    }
    else {
      createWatcher(vm, key, handler);
    }
  });
}

function createWatcher(vm, expOrFn, handler, options) {
  if (isPlainObject(handler)) {
    options = handler;
    handler = handler.handler;
  }
  if (typeof handler === 'string') {
    handler = vm[handler];
  }

  return vm.$watch(expOrFn, handler, options);
}

export function stateMixin(Vue) {
  // flow somehow has problems with directly declared definition object
  // when using Object.defineProperty, so we have to procedurally build up
  // the object here.
  const dataDef = {};

  dataDef.get = function () { return this._data; };
  const propsDef = {};

  propsDef.get = function () { return this._props; };

  Object.defineProperty(Vue.prototype, '$data', dataDef);
  Object.defineProperty(Vue.prototype, '$props', propsDef);

  Vue.prototype.$set = set;
  Vue.prototype.$delete = del;

  Vue.prototype.$watch = function (expOrFn, cb, options) {
    const vm = this;

    if (isPlainObject(cb)) {
      return createWatcher(vm, expOrFn, cb, options);
    }
    options = options || {};
    options.user = true;
    const watcher = new Watcher(vm, expOrFn, cb, options);

    if (options.immediate) {
      try {
        cb.call(vm, watcher.value);
      }
      catch (error) {
        handleError(error, vm, `callback for immediate watcher "${ watcher.expression }"`);
      }
    }

    return function unwatchFn() {
      watcher.teardown();
    };
  };
}

export function initState(vm) {
  vm._watchers = [];
  const opts = vm.$options;

  if (opts.props) initProps(vm, opts.props);
  if (opts.methods) initMethods(vm, opts.methods);

  if (opts.data) {
    initData(vm);
  }
  else {
    observe(vm._data = {}, true);
  }

  if (opts.computed) initComputed(vm, opts.computed);
  if (opts.watch && opts.watch !== nativeWatch) {
    initWatch(vm, opts.watch);
  }
}
