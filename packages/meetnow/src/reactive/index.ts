import debug from 'debug';
import { createEvents, Events } from '../events';
import { camelize, hasChanged, hasOwn } from '../utils';

const log = debug('MN:Reactive');

export function createReactive(data: object = {}, events?: Events) {
  events = events || createEvents(log);
  return new Proxy(data, {
    set(target: object, prop: string, value: unknown, receiver: object) {
      const oldValue = target[prop];
      const hadKey = hasOwn(target, prop);
      const result = Reflect.set(target, prop, value, receiver);

      if (!hadKey) {
        events.emit(`${ camelize(prop) }Added`, value);
      }
      if (hasChanged(value, oldValue)) {
        events.emit(`${ camelize(prop) }Changed`, value, oldValue);
      }

      return result;
    },
  });
}
