import debug from 'debug';
import { createEvents, Events } from '../events';
import { camelize, hasChanged, hasOwn } from '../utils';

const log = debug('MN:Reactive');

export function createReactive<T extends object>(data: T, events?: Events): T {
  events = events || createEvents(log);
  return new Proxy<T>(data, {
    set(target: object, prop: string, value: unknown, receiver: object) {
      const oldValue = (target as any)[prop];
      const hadKey = hasOwn(target, prop);
      const result = Reflect.set(target, prop, value, receiver);

      if (!hadKey) {
        (events as Events).emit(`${ camelize(prop) }Added`, value);
      }
      if (hasChanged(value, oldValue)) {
        (events as Events).emit(`${ camelize(prop) }Changed`, value, oldValue);
      }

      return result;
    },
  });
}
