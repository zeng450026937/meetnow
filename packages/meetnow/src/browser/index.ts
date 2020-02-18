import { browsersList } from './browser-list';
import { isObject } from '../utils';

export interface ParsedResult {
  browser: {
    name: string;
    version: string;
    firefox: boolean;
    chrome: boolean;
  };
}

const parsed = {} as ParsedResult;

/*
if (!window.WeixinJSBridge || !WeixinJSBridge.invoke) { // 首先判断当前是否存在微信桥
  document.addEventListener('WeixinJSBridgeReady', () => { // 微信桥不存在则监听微信桥准备事件
    if (window.__wxjs_environment === 'miniprogram') { // 当微信桥挂在上了之后则判断当前微信环境是否为小程序
      console.log('在小程序');
    } else {
      console.log('在微信');
    }
  }, false);
}
*/
declare const wx: any;
declare const swan: any;
declare const my: any;

export function isMiniProgram() {
  return (typeof wx === 'object') || (typeof swan === 'object') || (typeof my === 'object')
  || /miniprogram/i.test(navigator.userAgent)
  || (window && window.__wxjs_environment === 'miniprogram');
}

export function parseBrowser(ua?: string) {
  if (!parsed.browser) {
    ua = ua || (isMiniProgram() ? 'miniprogram' : navigator.userAgent);

    const descriptor = browsersList.find((browser) => {
      return browser.test.some(condition => condition.test((ua as string)));
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

export const BROWSER = parseBrowser();

export function isBrowser(name: string) {
  return parseBrowser().name === name;
}

declare global {
  interface Window {
    WeixinJSBridge: any;
    /* eslint-disable-next-line */
    __wxjs_environment: any;
  }
}


export const MINIPROGRAM = isMiniProgram();
