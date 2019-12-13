// Timer Handler provide page irrelevant timer
import EVENTS from '../constants/events';

export const TIMER = {
  HEART_BEAT   : 'heartBeat',
  UPDATE_STAT  : 'updateStat',
  UPDATE_TOKEN : 'updateToken',
};
// Timeout Timer only heartBeat currently
const isTimeout = (timer) => ['heartBeat'.includes(timer)];

class TimerHandler {
  constructor(options = {}) {
    this.$api = options.api;
    this.runningTimer = [];

    Object.values(TIMER).forEach((t) => this[`${ t }Timer`] = null);
  }

  startTimer(timers) {
    if (!timers) timers = Object.values(TIMER);

    timers = Array.isArray(timers) ? timers : [timers];
    timers.forEach((timer) => {
      if (this[timer]) {
        if (this.isRunning(timer)) return;
        this.runningTimer.push(timer);
        this[timer]();
      }
    });
  }

  stopTimer(timers) {
    this._clearTimer(timers);
  }

  async [TIMER.HEART_BEAT]() {
    if (!this.isRunning(TIMER.HEART_BEAT)) return;
    if (this.heartBeatTimer) clearTimeout(this.heartBeatTimer);

    const result = await this.$api.keepalive();
    const interval = (result && result.data && result.data.interval) || 30;

    this.heartBeatTimer = setTimeout(() => this[TIMER.HEART_BEAT](), interval * 1000);
  }

  [TIMER.UPDATE_TOKEN]() {
    if (!this.isRunning(TIMER.UPDATE_TOKEN)) return;
    if (this.updateTokenTimer) clearInterval(this.updateTokenTimer);

    this.updateTokenTimer = setInterval(() => this.$api.updateToken(), 1000 * 60 * 5);
  }

  [TIMER.UPDATE_STAT]() { // Consider user this timer unless have to
    if (!this.isRunning(TIMER.UPDATE_STAT)) return;
    if (this.updateStatTimer) clearInterval(this.updateStatTimer);

    this.updateStatTimer = setInterval(() => this.$emit(EVENTS.CONF_STATS_UPDATED), 1000 * 5);
  }

  isRunning(timer) {
    return this.runningTimer.includes(timer);
  }

  // timerName is timer's prefix, such as heartBeatTimer's timerName is heartBeat
  _clearTimer(timers) {
    const clear = (timer, _isTimeout = true) => {
      const instance = `${ timer }Timer`;

      if (!this[instance]) return;

      if (_isTimeout) clearTimeout(this[instance]);
      else clearInterval(this[instance]);

      this[instance] = null;
      this.runningTimer.splice(this.runningTimer.indexOf(timer), 1);
    };

    if (!timers) timers = Object.values(TIMER);
    timers = Array.isArray(timers) ? timers : [timers];
    timers.forEach((t) => clear(t, isTimeout(t)));
  }
}

export default TimerHandler;
