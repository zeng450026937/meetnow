

export function createDescription() {
  return new Proxy({}, {
    get(target, prop) {},
  });
}
