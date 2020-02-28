/* eslint-disable prefer-spread, prefer-rest-params */

function ownKeys(object: any, enumerableOnly?: boolean) {
  const keys = Object.keys(object);
  if (Object.getOwnPropertySymbols) {
    let symbols = Object.getOwnPropertySymbols(object);
    if (enumerableOnly) {
      symbols = symbols.filter((sym) => {
        return Object.getOwnPropertyDescriptor(object, sym)!.enumerable;
      });
    }
    keys.push.apply(keys, symbols as any);
  }
  return keys;
}

function objectSpread(target) {
  for (let index = 1; index < arguments.length; index++) {
    const nextSource = arguments[index];
    if (nextSource !== null && nextSource !== undefined) {
      if (Object.getOwnPropertyDescriptors) {
        Object.defineProperties(target, Object.getOwnPropertyDescriptors(nextSource));
      } else {
        ownKeys(Object(nextSource)).forEach((key) => {
          Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(nextSource, key)!);
        });
      }
    }
  }
  return target;
}

if (typeof (Object as any).spread !== 'function') {
  Object.defineProperty(Object, 'spread', {
    value        : objectSpread,
    writable     : true,
    configurable : true,
  });
}
