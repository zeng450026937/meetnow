import { createEvents } from '../events';

export function createReactive(data: object = {}) {
  const events = createEvents();
  return new Proxy(data, {
    set(target, prop: string, value) {
      let oldValue;

      if (prop in target) {
        oldValue = target[prop];
      }

      target[prop] = value;

      if (oldValue !== value) {
        events.emit(`${ prop }Changed`, value, oldValue);
      }

      return true;
    },
  });
}
