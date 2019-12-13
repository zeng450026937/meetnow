import Analyser from './analyser';
import Logger from '../../../log/index';

const logger = Logger.genLogger('VolumeAnalyser');

class VolumeAnalyser extends Analyser {
  constructor(device) {
    super(device);
    this.volume = 0;
    this.context = null;
    this.contextAnalyser = null;
    this.streamSource = null;
  }

  analyse() {
    // logger.info('VolumeAnalyser analyse');
    if (!this.context
      || !this.contextAnalyser
      || !this.streamSource
    ) return this.volume = 0;

    const length = this.contextAnalyser.frequencyBinCount;
    const array = new Uint8Array(length);

    this.contextAnalyser.getByteFrequencyData(array);
    const sum = array.reduce((acc, val) => acc + val, 0);

    this.volume = sum / length;
  }

  start() {
    logger.info('VolumeAnalyser start');
    this.createContextAnalyser();
    this.createStreamSource();
    super.start();
  }

  stop() {
    logger.info('VolumeAnalyser stop');
    if (this.streamSource) {
      this.streamSource.disconnect();
      this.streamSource = null;
    }

    this.volume = 0;
    super.stop();
  }


  createContextAnalyser() {
    logger.info('VolumeAnalyser createContextAnalyser');
    if (this.context && this.contextAnalyser) return;
    window.AudioContext = window.AudioContext || window.webkitAudioContext;
    if (!window.AudioContext) {
      console.warn(window.AudioContext || window.webkitAudioContext);
      return logger.warn('can not create context analyser');
    }

    this.context = new AudioContext();
    this.contextAnalyser = this.context.createAnalyser();
    this.contextAnalyser.fftSize = 1024;
    this.contextAnalyser.smoothingTimeConstant = 0.5;
  }

  createStreamSource() {
    logger.info('VolumeAnalyser createStreamSource');
    if (this.streamSource) {
      this.streamSource.disconnect();
      this.streamSource = null;
    }

    if (this.context && this.stream && this.stream.getAudioTracks().length > 0) {
      this.streamSource = this.context.createMediaStreamSource(this.stream);
      if (!this.streamSource) throw new Error('create MediaStreamSource failed');
      this.streamSource.connect(this.contextAnalyser);

      if (this.context.state === 'suspended') this.context.resume();
    }
  }

  destroy() {
    logger.info('VolumeAnalyser destroy');
    if (this.contextAnalyser) {
      if (this.contextAnalyser.disable) this.contextAnalyser.disable();
      this.contextAnalyser = null;
    }
    if (this.context) this.context = null;
    super.destroy();
  }
}

export default VolumeAnalyser;
