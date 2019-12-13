import Vue from './vue/index';
import Request from './request/index';
import Logger from './log/Logger';
import { initService, initHandler, provideContext } from './init';
import UA from './service/ua/UA';
import defaultConfig from './config/index';
import { toArray } from './utils/index';

const WebRTC_SDK = Vue.extend({
  data() {
    return {
      ctx     : null,
      // private
      logger  : {},
      request : {},
    };
  },
  computed : {
    api() {
      return this.request;
    },
    on() {
      return this.eventHandler.on.bind(this.eventHandler);
    },
    off() {
      return this.eventHandler.off.bind(this.eventHandler);
    },
    once() {
      return this.eventHandler.once.bind(this.eventHandler);
    },
    emit() {
      return this.eventHandler.emit.bind(this.eventHandler);
    },
  },
  created() {
    const { services, REQUEST } = this.$options.config || defaultConfig;

    this.logger = new Logger();
    this.request = new Request({ ctx: this, REQUEST });

    initHandler(this);
    // init UA
    this.ua = new UA({ parent: this });
    provideContext(this.ua, this);

    initService(this, services);
  },
});

let _VUE;

function install(VUE) {
  if (install.installed && VUE === _VUE) return;

  install.installed = true;
  _VUE = VUE;

  function initWebRTC_SDK() {
    const options = this.$options;

    this.$rtc = options.rtc || (options.parent && options.parent.$rtc);

    if (options.bind) {
      const bind = (ns, dataList) => {
        const path = ns.split('.');
        const target = path.reduce((service, cur) => service[cur], this.$rtc);

        if (!target) return;
        dataList.forEach((data) => {
          Reflect.defineProperty(this, data, {
            get() { return target[data]; },
            set(val) { target[data] = val; },
          });
        });
      };

      toArray(options.bind).forEach((item) => bind(item.service, toArray(item.data)));
    }
  }

  VUE.mixin({ beforeCreate: initWebRTC_SDK });
}

WebRTC_SDK.install = install;

export default WebRTC_SDK;
export { Vue };
