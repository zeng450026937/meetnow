import { browsersList } from './browser-list';

export interface ParsedResult {
  browser: {
    name: string;
    version: string;
    firefox: boolean;
    chrome: boolean;
  };
}

const parsed = {} as ParsedResult;

export function parseBrowser(ua?: string) {
  if (!parsed.browser) {
    ua = ua || navigator.userAgent;

    const descriptor = browsersList.find((browser) => {
      return browser.test.some(condition => condition.test(ua));
    });

    if (descriptor) {
      parsed.browser = descriptor.describe(ua);
    }
  }
  return parsed.browser;
}

export function getBrowser() {
  return parseBrowser();
}

export function isBrowser(name: string) {
  return parseBrowser().name === name;
}
