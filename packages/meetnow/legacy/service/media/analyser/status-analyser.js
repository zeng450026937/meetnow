import Analyser from './analyser';
import Logger from '../../../log/index';

const logger = Logger.genLogger('StatusAnalyser');

class StatusAnalyser extends Analyser {
  constructor(device) {
    super(device);
    this.status = {};
    this.initStatus();
    this.streamInactive = this.initStatus;
  }

  initStatus() {
    if (!this.status) this.status = {};
    this.status.active = false;
    this.status.audio = false;
    this.status.video = false;
  }

  analyse() {
    // logger.info('StatusAnalyser analyse');
    if (!this.stream) return this.initStatus();

    const audioTracks = this.stream.getAudioTracks();
    const videoTracks = this.stream.getVideoTracks();

    this.status.active = this.stream.active === undefined
      ? Boolean(audioTracks[0]) && Boolean(videoTracks[0])
      : this.stream.active;

    if (this.status.active) {
      this.status.audio = this.checkAvailable(audioTracks);
      this.status.video = this.checkAvailable(videoTracks);
    }
  }

  start() {
    logger.info('StatusAnalyser start');
    if (!this.stream) return;

    this.stream.addEventListener('inactive', this.streamInactive);
    super.start();
  }

  checkAvailable(tracks = []) {
    return tracks.some(
      (track) => (!('readyState' in track) || track.readyState === 'live')
        && (!('muted' in track) || track.muted !== true),
    );
  }

  destroy() {
    if (this.stream) this.stream.removeEventListener('inactive', this.streamInactive);
    super.destroy();
  }
}

export default StatusAnalyser;
