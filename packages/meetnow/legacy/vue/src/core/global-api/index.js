import config from '../config';
import { initUse } from './use';
import { initMixin } from './mixin';
import { initExtend } from './extend';
import { set, del, observe } from '../observer/index';


import {
  warn,
  extend,
  nextTick,
  mergeOptions,
  defineReactive,
} from '../util/index';

export function initGlobalAPI(Vue) {
  // config
  const configDef = {};

  configDef.get = () => config;
  Object.defineProperty(Vue, 'config', configDef);

  // exposed util methods.
  // NOTE: these are not considered part of the public API - avoid relying on
  // them unless you are aware of the risk.
  Vue.util = {
    warn,
    extend,
    mergeOptions,
    defineReactive,
  };

  Vue.set = set;
  Vue.delete = del;
  Vue.nextTick = nextTick;

  // 2.6 explicit observable API
  Vue.observable = (obj) => {
    observe(obj);

    return obj;
  };

  Vue.options = Object.create(null);

  // this is used to identify the "base" constructor to extend all plain-object
  // components with in Weex's multi-instance scenarios.
  Vue.options._base = Vue;
  Vue.options.components = {};

  initUse(Vue);
  initMixin(Vue);
  initExtend(Vue);
}
