/* eslint */

import { pushTarget, popTarget } from '../observer/dep';

import {
  remove,
  nextTick,
  handleError,
} from '../util/index';

export function initLifecycle(vm) {
  const options = vm.$options;

  // locate first non-abstract parent
  const parent = options.parent;

  if (parent) {
    parent.$children.push(vm);
  }

  vm.$parent = parent;
  vm.$root = parent ? parent.$root : vm;

  vm.$children = [];

  vm._isDestroyed = false;
  vm._isBeingDestroyed = false;
}

export function lifecycleMixin(Vue) {
  Vue.prototype.$nextTick = function(fn) {
    return nextTick(fn, this);
  };
  
  Vue.prototype.$destroy = function() {
    const vm = this;

    if (vm._isBeingDestroyed) {
      return;
    }
    callHook(vm, 'beforeDestroy');
    vm._isBeingDestroyed = true;
    // remove self from parent
    const parent = vm.$parent;

    if (parent && !parent._isBeingDestroyed) {
      remove(parent.$children, vm);
    }
    // destroy childrens
    let i = vm.$children.length;

    while (i--) {
      if (vm.$children[i] && vm.$children[i]._isVue) {
        vm.$children[i].$destroy();
      }
    }
    // teardown watchers
    i = vm._watchers.length;

    while (i--) {
      vm._watchers[i].teardown();
    }
    // remove reference from data ob
    // frozen object may not have observer.
    if (vm._data.__ob__) {
      vm._data.__ob__.vmCount--;
    }
    // call the last hook...
    vm._isDestroyed = true;
    // fire destroyed hook
    callHook(vm, 'destroyed');
    // turn off all instance listeners.
    vm.$off();
  };
}

export function callHook(vm, hook) {
  // #7573 disable dep collection when invoking lifecycle hooks
  pushTarget();
  const handlers = vm.$options[hook];

  if (handlers) {
    for (let i = 0, j = handlers.length; i < j; i++) {
      try {
        handlers[i].call(vm);
      }
      catch (e) {
        handleError(e, vm, `${hook} hook`);
      }
    }
  }
  if (vm._hasHookEvent) {
    vm.$emit(`hook:${hook}`);
  }
  popTarget();
}
