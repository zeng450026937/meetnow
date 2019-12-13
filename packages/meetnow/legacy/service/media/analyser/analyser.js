import Logger from '../../../log/index';

const logger = Logger.genLogger('Analyser');

class Analyser {
  constructor(device) {
    this.device = device;
    this.enable = false;
    this.timer = null;
    this.interval = 100; // TODO interval = 100
  }

  get stream() {
    return this.device.stream;
  }

  analyse() {}

  start() {
    logger.info('start');
    if (!this.stream) return;
    this.analyse();
    this.timer = setInterval(() => this.analyse(), this.interval);
  }

  stop() {
    logger.info('stop');
    if (!this.timer) return;
    clearInterval(this.timer);
    this.timer = null;
  }

  destroy() {
    logger.info('destroy');
    this.stop();
  }
}

export default Analyser;
