import { createEvents, Events } from '../events';
import { camelize } from '../utils';

export function createReactive(data: object = {}, events?: Events) {
  events = events || createEvents();
  return new Proxy(data, {
    set(target, prop: string, value) {
      let oldValue;

      if (prop in target) {
        oldValue = target[prop];
      }

      target[prop] = value;

      if (oldValue !== value) {
        events.emit(`${ camelize(prop) }Changed`, value, oldValue);
      }

      return true;
    },
  });
}
