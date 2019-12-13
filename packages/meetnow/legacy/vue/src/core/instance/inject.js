import { hasOwn, isFunction } from '../../shared/util';
import { hasSymbol } from '../util/index';
import { defineReactive, toggleObserving } from '../observer/index';

export function initProvide(vm) {
  const provide = vm.$options.provide;

  if (provide) {
    vm._provided = isFunction(provide)
      ? provide.call(vm)
      : provide;
  }
}

export function initInjections(vm) {
  const result = resolveInject(vm.$options.inject, vm);

  if (result) {
    toggleObserving(false);
    Object.keys(result).forEach((key) => {
      defineReactive(vm, key, result[key]);
    });
    toggleObserving(true);
  }
}

export function resolveInject(inject, vm) {
  if (inject) {
    // inject is :any because flow is not smart enough to figure out cached
    const result = Object.create(null);
    const keys = hasSymbol
      ? Reflect.ownKeys(inject)
      : Object.keys(inject);

    for (let i = 0; i < keys.length; i++) {
      const key = keys[i];
      // #6574 in case the inject object is observed...

      if (key === '__ob__') continue;
      const provideKey = inject[key].from;

      let source = vm;

      while (source) {
        if (source._provided && hasOwn(source._provided, provideKey)) {
          result[key] = source._provided[provideKey];
          break;
        }
        source = source.$parent;
      }
      if (!source) {
        if ('default' in inject[key]) {
          const provideDefault = inject[key].default;

          result[key] = isFunction(provideDefault)
            ? provideDefault.call(vm)
            : provideDefault;
        }
      }
    }

    return result;
  }
}
