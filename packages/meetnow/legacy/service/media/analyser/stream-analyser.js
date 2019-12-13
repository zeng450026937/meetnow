/* eslint-disable lines-between-class-members */
import Logger from '../../../log/index';
import VolumeAnalyser from './volume-analyser';
import StatusAnalyser from './status-analyser';

const logger = Logger.genLogger('StreamAnalyser');

class StreamAnalyser {
  constructor(device) {
    this.device = device;
    this.statusAnalyser = new StatusAnalyser(device);
    this.volumeAnalyser = new VolumeAnalyser(device);
    this.analyseVolume = true;
    this.analyseStatus = true;
    this.startAnalyse();
  }

  get stream() { return this.device.stream; }

  get analyseVolume() { return this.volumeAnalyser.enable; }
  set analyseVolume(val) { this.volumeAnalyser.enable = val; }

  get analyseStatus() { return this.statusAnalyser.enable; }
  set analyseStatus(val) { this.statusAnalyser.enable = val; }

  destroy() {
    this.statusAnalyser.destroy();
    this.statusAnalyser = null;
    this.volumeAnalyser.destroy();
    this.volumeAnalyser = null;
  }

  startAnalyse() {
    logger.warn('startAnalyse Volume & status');
    if (!this.stream) {
      if (this.volumeAnalyser.timer) this.volumeAnalyser.stop();
      if (this.statusAnalyser.timer) this.statusAnalyser.stop();
    }
    else {
      if (this.analyseVolume) this.volumeAnalyser.start();
      if (this.analyseStatus) this.statusAnalyser.start();
    }
  }
}

export default StreamAnalyser;
