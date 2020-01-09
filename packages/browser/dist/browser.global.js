var Browser = (function (exports) {
  'use strict';

  const commonVersionIdentifier = /version\/(\d+(\.?_?\d+)+)/i;
  function getFirstMatch(regexp, ua) {
      const match = ua.match(regexp);
      return (match && match.length > 0 && match[1]) || '';
  }
  function getSecondMatch(regexp, ua) {
      const match = ua.match(regexp);
      return (match && match.length > 1 && match[2]) || '';
  }
  function browser(name, version) {
      return {
          name,
          version,
          firefox: name === 'firefox',
          chrome: name === 'chrome' || name === 'chromium',
          wechet: name === 'wechat',
      };
  }
  const browsersList = [
      {
          test: [/micromessenger/i],
          describe(ua) {
              return browser('wechat', getFirstMatch(/(?:micromessenger)[\s/](\d+(\.?_?\d+)+)/i, ua) || getFirstMatch(commonVersionIdentifier, ua));
          },
      },
      {
          test: [/\sedg\//i],
          describe(ua) {
              return browser('edge', getFirstMatch(/\sedg\/(\d+(\.?_?\d+)+)/i, ua));
          },
      },
      {
          test: [/edg([ea]|ios)/i],
          describe(ua) {
              return browser('edge', getSecondMatch(/edg([ea]|ios)\/(\d+(\.?_?\d+)+)/i, ua));
          },
      },
      {
          test: [/firefox|iceweasel|fxios/i],
          describe(ua) {
              return browser('firefox', getFirstMatch(/(?:firefox|iceweasel|fxios)[\s/](\d+(\.?_?\d+)+)/i, ua));
          },
      },
      {
          test: [/chromium/i],
          describe(ua) {
              return browser('chromium', getFirstMatch(/(?:chromium)[\s/](\d+(\.?_?\d+)+)/i, ua) || getFirstMatch(commonVersionIdentifier, ua));
          },
      },
      {
          test: [/chrome|crios|crmo/i],
          describe(ua) {
              return browser('chrome', getFirstMatch(/(?:chrome|crios|crmo)\/(\d+(\.?_?\d+)+)/i, ua));
          },
      },
      {
          test: [/safari|applewebkit/i],
          describe(ua) {
              return browser('safari', getFirstMatch(commonVersionIdentifier, ua));
          },
      },
      /* Something else */
      {
          test: [/.*/i],
          describe(ua) {
              /* Here we try to make sure that there are explicit details about the device
               * in order to decide what regexp exactly we want to apply
               * (as there is a specific decision based on that conclusion)
               */
              const regexpWithoutDeviceSpec = /^(.*)\/(.*) /;
              const regexpWithDeviceSpec = /^(.*)\/(.*)[ \t]\((.*)/;
              const hasDeviceSpec = ua.search('\\(') !== -1;
              const regexp = hasDeviceSpec ? regexpWithDeviceSpec : regexpWithoutDeviceSpec;
              return browser(getFirstMatch(regexp, ua), getSecondMatch(regexp, ua));
          },
      },
  ];

  const parsed = {};
  function parseBrowser(ua) {
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
  function getBrowser() {
      return parseBrowser();
  }
  const BROWSER = parseBrowser();
  function isBrowser(name) {
      return parseBrowser().name === name;
  }
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
  function isMiniProgram() {
      return /miniprogram/i.test(navigator.userAgent) || (window && window.__wxjs_environment === 'miniprogram');
  }
  const MINIPROGRAM = isMiniProgram();

  exports.BROWSER = BROWSER;
  exports.MINIPROGRAM = MINIPROGRAM;
  exports.getBrowser = getBrowser;
  exports.isBrowser = isBrowser;
  exports.isMiniProgram = isMiniProgram;
  exports.parseBrowser = parseBrowser;

  return exports;

}({}));
