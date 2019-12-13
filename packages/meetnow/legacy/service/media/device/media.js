/* eslint-disable lines-between-class-members */
import { EventEmitter } from 'events';
import StreamAnalyser from '../analyser/stream-analyser';

class Media extends EventEmitter {
  constructor(type = 'local') {
    super();
    this.type = type; // local screen
    this._stream = null;
    this.streamAnalyser = new StreamAnalyser(this);
  }

  get stream() { return this._stream; }
  set stream(val) {
    if (this.type === 'screen') return this._stream = val;
    this._removeStreamListener();
    this._stream = val;
    this.streamAnalyser.startAnalyse();
  }

  get volume() { return this.streamAnalyser && this.streamAnalyser.volumeAnalyser.volume; }
  get status() { return this.streamAnalyser && this.streamAnalyser.statusAnalyser.status; }

  acquireStream(force = false) {}
  releaseStream(force = false) {}

  genConstraints() {}
  _removeStreamListener() {
    if (this.stream) {
      this.stream.removeEventListener('inactive', this.streamAnalyser.statusAnalyser.streamInactive);
    }
  }

  // 手动回收内存
  destroy() {
    if (this.stream) { this.stream.close(); this.stream = null; }
    this.streamAnalyser.destroy();
    this.streamAnalyser = null;
  }
}

export default Media;
