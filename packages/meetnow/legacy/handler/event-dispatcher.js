import { EventEmitter } from 'events';
import { TIMER } from './timer-handler';
import EVENTS from '../constants/events';

/**
 * Design Principle
 *
 * AIM:
 * The event dispatcher's most essential aim is communicating individual module
 * And so that individual module's load become configurable
 *
 * Event Name:
 * Event's name should be a simplified description rather action.
 * As so, event dispatcher can execute specific action by defined abstract description
 * Such as following samples
 * [1] GOOD: JOIN_CONF_SUCCEED | BAD: RESET_CONF_INFO
 * [2] GOOD: NEW_MESSAGE       | BAD: START_REFRESH_TOKEN
 * ...
 *
 * Function:
 * In the SDK currently, Event Dispatcher two functions mainly
 * [1] Dispatch event witch defined originally in handler context
 * [2] In individual service module,
 *     users can subscribe specific event and provide handler function in there own context
 *
 */

export { EVENTS };

class EventDispatcher extends EventEmitter {
  constructor(options = {}) {
    super();
    this.$api = options.api;
    this.$ctx = options.context;

    this.initEventHandler();
  }

  initEventHandler() {
    this.on(EVENTS.JOIN_FOCUS_SUCCEED, (data) => {
      this.$api.setConfInfo(data);
    });
    this.on(EVENTS.JOIN_MEDIA_SUCCEED, (data) => {
      console.warn('JOIN_MEDIA_SUCCEED', data);
    });
    this.on(EVENTS.JOIN_SHARE_SUCCEED, (data) => {
      console.warn('JOIN_SHARE_SUCCEED');
    });
    this.on(EVENTS.JOIN_CONF_SUCCEED, (data) => {
      console.warn('JOIN_CONF_SUCCEED');
      this.$ctx.timerHandler.startTimer([TIMER.HEART_BEAT, TIMER.UPDATE_TOKEN]);
    });
    this.on(EVENTS.EXIT_CONF_SUCCEED, (data) => {
      console.warn('EXIT_CONF_SUCCEED');
      this.$ctx.timerHandler.stopTimer();
      this.$ctx.pollingHandler.reset();
      this.$api.reset();
    });
    this.on(EVENTS.CONF_INFO_INITIALIZED, (data) => {
      console.warn('CONF_INFO_INITIALIZED');
      this.$ctx.pollingHandler.reset();
      this.$ctx.pollingHandler.startPolling();
    });
    this.on(EVENTS.CONF_ENDED, (data) => {
      console.warn('CONF_ENDED');
    });
    this.on(EVENTS.KICKED, (data) => {
      console.warn('KICKED');
    });
    this.on(EVENTS.NEW_MESSAGE, (data) => {
      console.warn('NEW_MESSAGE');
    });
  }
}

export default EventDispatcher;
