/**
 * Check if a string starts with $ or _
 */
function isReserved(str) {
  const c = (String(str)).charCodeAt(0);

  return c === 0x24 || c === 0x5F;
}

/**
 * Define a property.
 */
function def(obj, key, val, enumerable) {
  Object.defineProperty(obj, key, {
    value        : val,
    enumerable   : Boolean(enumerable),
    writable     : true,
    configurable : true,
  });
}

/**
 * Parse simple path.
 */
const bailRE = /[^\w.$]/;

function parsePath(path) {
  if (bailRE.test(path)) {
    return;
  }
  const segments = path.split('.');

  return function(obj) {
    for (let i = 0; i < segments.length; i++) {
      if (!obj) return;
      obj = obj[segments[i]];
    }
    
    return obj;
  };
}

export {
  isReserved,
  def,
  parsePath,
};
