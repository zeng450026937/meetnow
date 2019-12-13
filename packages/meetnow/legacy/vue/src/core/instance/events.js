import {
  toArray,
  invokeWithErrorHandling, isUndef,
} from '../util/index';

export function initEvents(vm) {
  vm._events = Object.create(null);
  vm._hasHookEvent = false;
}

export function eventsMixin(Vue) {
  const hookRE = /^hook:/;

  Vue.prototype.$on = function (event, fn) {
    const vm = this;

    if (Array.isArray(event)) {
      for (let i = 0, l = event.length; i < l; i++) {
        vm.$on(event[i], fn);
      }
    }
    else {
      (vm._events[event] || (vm._events[event] = [])).push(fn);
      // optimize hook:event cost by using a boolean flag marked at registration
      // instead of a hash lookup
      if (hookRE.test(event)) {
        vm._hasHookEvent = true;
      }
    }

    return vm;
  };

  Vue.prototype.$once = function (event, fn) {
    const vm = this;

    function on(...params) {
      vm.$off(event, on);
      fn.apply(vm, params);
    }
    on.fn = fn;
    vm.$on(event, on);

    return vm;
  };

  Vue.prototype.$off = function (event, fn) {
    const vm = this;

    if (isUndef(event)) vm._events = Object.create(null);
    else if (Array.isArray(event)) event.forEach((e) => vm.$off(e, fn));
    else {
      const cbs = vm._events[event];

      if (cbs) {
        if (!fn) vm._events[event] = null;
        else {
          let cb;

          let i = cbs.length;

          while (i--) {
            cb = cbs[i];
            if (cb === fn || cb.fn === fn) {
              cbs.splice(i, 1);
              break;
            }
          }
        }
      }
    }

    return vm;
  };

  Vue.prototype.$emit = function (event, ...params) {
    const vm = this;

    let cbs = vm._events[event];

    if (cbs) {
      cbs = cbs.length > 1 ? toArray(cbs) : cbs;
      const args = toArray(params);
      const info = `event handler for "${ event }"`;

      for (let i = 0, l = cbs.length; i < l; i++) {
        invokeWithErrorHandling(cbs[i], vm, args, vm, info);
      }
    }

    return vm;
  };
}
