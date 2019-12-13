import { initState } from './state';
import { initEvents } from './events';
import { initLifecycle, callHook } from './lifecycle';
import { initProvide, initInjections } from './inject';
import { extend, mergeOptions } from '../util/index';

function resolveModifiedOptions(Ctor) {
  let modified;
  const latest = Ctor.options;
  const sealed = Ctor.sealedOptions;

  Object.keys(latest).forEach((key) => {
    if (latest[key] !== sealed[key]) {
      if (!modified) modified = {};
      modified[key] = latest[key];
    }
  });

  return modified;
}

function resolveConstructorOptions(Ctor) {
  let options = Ctor.options;

  if (Ctor.super) {
    const superOptions = resolveConstructorOptions(Ctor.super);
    const cachedSuperOptions = Ctor.superOptions;

    if (superOptions !== cachedSuperOptions) {
      Ctor.superOptions = superOptions;
      const modifiedOptions = resolveModifiedOptions(Ctor);

      if (modifiedOptions) extend(Ctor.extendOptions, modifiedOptions);

      options = Ctor.options = mergeOptions(superOptions, Ctor.extendOptions);
      if (options.name) options.components[options.name] = Ctor;
    }
  }

  return options;
}

let uid = 0;

// must call this
function initVue(options = {}) {
  this._uid = uid++;

  this._isVue = true;
  this._self = this;

  this.$options = mergeOptions(
    resolveConstructorOptions(this.constructor),
    options,
    this,
  );

  initLifecycle(this);
  initEvents(this);
  callHook(this, 'beforeCreate');
  initInjections(this);
  initState(this);
  initProvide(this);
  callHook(this, 'created');
}

export default initVue;
