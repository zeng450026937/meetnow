const commonVersionIdentifier = /version\/(\d+(\.?_?\d+)+)/i;

export function getFirstMatch(regexp: RegExp, ua: string) {
  const match = ua.match(regexp);
  return (match && match.length > 0 && match[1]) || '';
}

export function getSecondMatch(regexp: RegExp, ua: string) {
  const match = ua.match(regexp);
  return (match && match.length > 1 && match[2]) || '';
}

export function browser(name: string, version: string) {
  return {
    name,
    version,
    firefox : name === 'firefox',
    chrome  : name === 'chrome' || name === 'chromium',
    wechet  : name === 'wechat',
    toString() {
      return `${ name.toUpperCase() } ${ version }`;
    },
  };
}

export const browsersList = [
  {
    test : [/micromessenger/i],
    describe(ua: string) {
      return browser(
        'wechat',
        getFirstMatch(/(?:micromessenger)[\s/](\d+(\.?_?\d+)+)/i, ua) || getFirstMatch(commonVersionIdentifier, ua),
      );
    },
  },
  {
    test : [/\sedg\//i],
    describe(ua: string) {
      return browser(
        'edge',
        getFirstMatch(/\sedg\/(\d+(\.?_?\d+)+)/i, ua),
      );
    },
  },
  {
    test : [/edg([ea]|ios)/i],
    describe(ua: string) {
      return browser(
        'edge',
        getSecondMatch(/edg([ea]|ios)\/(\d+(\.?_?\d+)+)/i, ua),
      );
    },
  },
  {
    test : [/firefox|iceweasel|fxios/i],
    describe(ua: string) {
      return browser(
        'firefox',
        getFirstMatch(/(?:firefox|iceweasel|fxios)[\s/](\d+(\.?_?\d+)+)/i, ua),
      );
    },
  },
  {
    test : [/chromium/i],
    describe(ua: string) {
      return browser(
        'chromium',
        getFirstMatch(/(?:chromium)[\s/](\d+(\.?_?\d+)+)/i, ua) || getFirstMatch(commonVersionIdentifier, ua),
      );
    },
  },
  {
    test : [/chrome|crios|crmo/i],
    describe(ua: string) {
      return browser(
        'chrome',
        getFirstMatch(/(?:chrome|crios|crmo)\/(\d+(\.?_?\d+)+)/i, ua),
      );
    },
  },
  {
    test : [/safari|applewebkit/i],
    describe(ua: string) {
      return browser(
        'safari',
        getFirstMatch(commonVersionIdentifier, ua),
      );
    },
  },
  /* Something else */
  {
    test : [/.*/i],
    describe(ua: string) {
      /* Here we try to make sure that there are explicit details about the device
       * in order to decide what regexp exactly we want to apply
       * (as there is a specific decision based on that conclusion)
       */
      const regexpWithoutDeviceSpec = /^(.*)\/(.*) /;
      const regexpWithDeviceSpec = /^(.*)\/(.*)[ \t]\((.*)/;
      const hasDeviceSpec = ua.search('\\(') !== -1;
      const regexp = hasDeviceSpec ? regexpWithDeviceSpec : regexpWithoutDeviceSpec;
      return browser(
        getFirstMatch(regexp, ua),
        getSecondMatch(regexp, ua),
      );
    },
  },
];
