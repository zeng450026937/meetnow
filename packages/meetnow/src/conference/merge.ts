import debug from 'debug';
import {
  hasOwn, isArray, isDef, isObject,
} from '../utils';

const log = debug('Meetnow:Information:Item');

export type ItemValue = string | number | boolean | Item | null;

export interface Item {
  [key: string]: ItemValue | ItemValue[];
}

export interface PartialableItem extends Item {
  'state': 'full' | 'partial' | 'deleted';
  'entity'?: string;
  'id'?: string;
}

export function isItem(item: ItemValue | ItemValue[]): item is Item {
  return isDef(item) && isObject(item) && !isArray(item);
}

export function isPartialableItem(item: ItemValue | ItemValue[]): item is PartialableItem {
  return isItem(item) && hasOwn(item, 'state');
}

export function mergeItemList(rhys: ItemValue[], items: ItemValue[]): ItemValue[] {
  log('mergelist()');

  for (const item of items) {
    if (!isPartialableItem(item)) {
      return items;
    }

    const { id, entity, state = 'partial' } = item;
    const key = entity || id;

    if (!key) {
      log('Error: missing item identity(entity or id).');
      continue;
    }

    const index = (rhys as PartialableItem[])
      .findIndex((it) => it.entity === key || it.id === key);

    log('item identity: %o', key);

    // not find
    if (index === -1) {
      if (state === 'deleted') {
        log('Error: can not delete item not exsit.');
        continue;
      }
      log('item added');
      rhys.push(item);
      break;
    }

    // finded
    // wanna delete
    if (state === 'deleted') {
      log('item deleted');
      rhys.splice(index, 1);
      break;
    }

    // wanna update
    /* eslint-disable-next-line no-use-before-define */
    mergeItem(rhys[index] as PartialableItem, item);
  }

  return rhys;
}

export function mergeItem<T extends Item>(rhys: T, item: T): T | null {
  log('merge()');

  if (rhys === item) {
    return rhys;
  }
  if (!isPartialableItem(item)) {
    return item;
  }

  const { state } = item;

  if (state === 'full') {
    return item;
  }
  if (state === 'deleted') {
    return null;
  }
  if (state !== 'partial') {
    log(`Error: unknown item state. ${ state }`);
    log('use merge policy as "partial"');
  }

  for (const key in item) {
    if (hasOwn(item, key)) {
      const value = item[key];
      const current = rhys[key];

      log('item key: %s value: %o -> %o', key, current, value);

      (rhys as Item)[key] = isArray(value)
        ? mergeItemList(current as ItemValue[], value)
        : isItem(value)
          ? mergeItem(current as Item, value)
          : value;
    }
  }

  return rhys;
}
