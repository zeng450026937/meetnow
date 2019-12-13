/* eslint-disable global-require */
import Vue from './vue/index';
import { isFunction, isPlainObject, unCapitalize } from './vue/src/shared/util';
import { isClosed } from './config/index';
// handler
import TimerHandler from './handler/timer-handler';
import PollingHandler from './handler/polling-handler';
import EventDispatcher from './handler/event-dispatcher';
import ExceptionHandler from './handler/exception-handler';
// service
import Chat from './service/conference/chat';
import Media from './service/media/index';
import Member from './service/conference/member';
import External from './service/external/index';
import Conference from './service/conference';
import Controller from './service/conference/controller';
import MediaChannel from './service/channel/media-channel';
import ShareChannel from './service/channel/share-channel';

// const handlerStore = {
//   EventDispatcher,
//   PollingHandler,
//   ExceptionHandler,
//   TimerHandler,
// };

const serviceStore = {
  Chat,
  Media,
  Member,
  External,
  Conference,
  Controller,
  MediaChannel,
  ShareChannel,
};

const attachExceptionHandler = (vm) => {
  if (!vm.exceptionHandler) return;

  Vue.config.warnHandler = vm.exceptionHandler.handlerVueWarning;
  Vue.config.errorHandler = vm.exceptionHandler.handlerVueException;
};

const attachLogger = (service, vm) => {
  service.$log = {};

  const tag = service.$options.tag || service.$options.name;

  Object.keys(vm.logger).forEach((key) => {
    if (isFunction(vm.logger[key])) { // TODO new Logger ?
      service.$log[key] = (...args) => vm.logger._ns(tag)[key](...args);
    }
  });
};

export const attachTools = (service, vm) => {
  service.$on = vm.on;
  service.$api = vm.api;
  service.$emit = vm.emit;
  service.$once = vm.once;

  attachLogger(service, vm);
};

export const provideContext = (service, vm) => {
  attachTools(service, vm);

  // provide hook when context init
  if (service.$options.afterContextInit) {
    service.$options.afterContextInit.call(service);
  }
};

const initHandler = (vm) => {
  const handlerOptions = {
    context : vm,
    api     : vm.request,
  };

  vm.exceptionHandler = new ExceptionHandler(handlerOptions);
  attachExceptionHandler(vm);

  vm.timerHandler = new TimerHandler(handlerOptions);
  vm.eventHandler = new EventDispatcher(handlerOptions);
  vm.pollingHandler = new PollingHandler(handlerOptions);

  const handlers = [
    vm.eventHandler,
    vm.timerHandler,
    vm.pollingHandler,
    vm.exceptionHandler,
  ];

  handlers.forEach((handler) => handler.$emit = vm.emit);
  // const options = {
  //   context : vm,
  //   api     : vm.request,
  // };
  // const handlerList = [];
  //
  // handlers.forEach((handler) => {
  //   if (isClosed(handler)) return;
  //   if (isPlainObject(handler) && handler.isCustom) {
  //     return this[handler.key] = new handler.Target(options);
  //   }
  //   if (handlerStore[handler]) {
  //     this[unCapitalize(handler)] = new handlerStore[handler](options);
  //     handlerList.push(this[unCapitalize(handler)]);
  //     if (handler === 'ExceptionHandler') attachExceptionHandler(vm);
  //   }
  // });
  //
  // if (this.eventHandler) {
  //   handlerList.forEach((handler) => {
  //     handler.$emit = this.eventHandler.emit.bind(this.eventHandler);
  //   });
  // }
};

const initService = (vm, services = []) => {
  const serviceList = [];

  services.forEach((service) => {
    if (!service || isClosed(service)) return;
    if (isPlainObject(service)) {
      vm[service.key] = service.isCustom
        ? new service.Target({ parent: vm })
        : new serviceStore[service.Target]({ parent: vm });

      const { subServices } = service;

      if (Array.isArray(subServices)) initService(vm[service.key], subServices);

      return serviceList.push(vm[service.key]);
    }

    const Target = serviceStore[service];

    if (Target) {
      vm[unCapitalize(service)] = new Target({ parent: vm });
      serviceList.push(vm[unCapitalize(service)]);
    }
  });

  serviceList.forEach((service) => provideContext(service, vm.$root));
};


export {
  initHandler,
  initService,
};
