import config from '../config';
import { initUse } from './use';
import { initMixin } from './mixin';
import { initExtend } from './extend';
import { set, del, defineReactive } from '../observer/index';

const {
  warn,
  extend,
  nextTick,
  mergeOptions,
} = require('../util/index');

export function initGlobalAPI(Vue) {
  // config
  const configDef = {};

  configDef.get = () => config;
  if (process.env.NODE_ENV !== 'production') {
    configDef.set = () => {
      warn(
        'Do not replace the Vue.config object, set individual fields instead.'
      );
    };
  }
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

  Vue.observable = (obj) => {
    observe(obj);
    return obj;
  }

  Vue.options = Object.create(null);

  initUse(Vue);
  initMixin(Vue);
  initExtend(Vue);
}
