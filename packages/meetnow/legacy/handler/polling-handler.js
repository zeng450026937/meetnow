import { isSuccess } from '../utils/index';
import ERRORS from '../constants/errors';
import { EVENTS } from './event-dispatcher';

// Polling Handler isn't allowed to operate service directly
// So that Unnecessary to provide context
// You are encouraged to emit a event
class PollingHandler {
  constructor(options = {}) {
    this.$api = options.api;
    // $emit will be auto provide when event handler init
    this.$emit = null;
    this.stopped = true;
    this.version = 0;
    this.confVersion = 0;
  }

  reset() {
    this.stopPolling();
    this.version = 0;
    this.confVersion = 0;
  }

  setConfInfo(confInfo = {}) {
    if (confInfo.version) this.confVersion = confInfo.version;
  }

  startPolling(timeout = 0) {
    if (this.stopped) {
      this.stopped = false;

      setTimeout(() => !this.stopped && this.polling(), timeout);
    }
  }

  restartPolling(timeout) {
    this.stopPolling();
    this.startPolling(timeout);
  }

  stopPolling() {
    this.stopped = true;
  }

  polling() {
    return this.$api.polling({ version: this.version })
      .then((result) => {
        if (this.stopped) return;

        const { bizCode, data = {} } = result;
        const { category, version, body } = data;

        if (version == null || !isSuccess(bizCode)) return this.restartPolling(200);

        switch (category) {
          case 'conference-info': this.updateConfInfo(body); break;
          case 'im-record': this.updateIMRecord(body); break;
          case 'port-change': this.handlerPortChanged(version); break;
          case 'call-record-list': this.updateCallRecordList(); break;
          case 'quit-conference': this.handlerQuitConf(body); break;
          default: break;
        }

        this.version = version;

        return this.restartPolling(100);
      }).catch((error) => this.handlerError(error));
  }

  updateConfInfo(body = {}) {
    const newVersion = body.version;
    const currentVersion = this.confVersion;

    if (newVersion < currentVersion) return;
    if (currentVersion && newVersion - currentVersion > 1) return this.$emit(EVENTS.FULL_CONF_INFO_UPDATED);
    this.setConfInfo({ version: newVersion });
    this.$emit(EVENTS.PART_CONF_INFO_UPDATED, body);
  }

  updateCallRecordList() {

  }

  updateIMRecord(data) {
    this.$emit(EVENTS.NEW_MESSAGE, data);
  }

  handlerPortChanged(version) {
    if (this.version >= version) return;
    this.$emit(EVENTS.RENEG_NEEDED);
  }

  handlerQuitConf(body) {
    if (body.bizCode === 901314) return this.$emit(EVENTS.CONF_ENDED);
    if (body.bizCode === 901320) return this.$emit(EVENTS.KICKED);
  }

  handlerError(error = {}) {
    if (!error.bizCode) return;
    if ([900408, 901323].includes(error.bizCode)) return this.restartPolling(200);
    if ([901304].includes(error.bizCode)) return this.$emit(EVENTS.CONF_ENDED);

    return this.$emit(EVENTS.KICKED);
  }
}

export default PollingHandler;
