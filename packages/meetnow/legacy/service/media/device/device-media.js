/* eslint-disable lines-between-class-members */
import browser from 'bowser';
import { AudioQuality, VideoQuality } from './config';
import Media from './media';
import { getUserMedia } from '../../../utils/get-user-media';
import Logger from '../../../log/index';
import ERRORS from '../../../constants/errors';

const logger = Logger.genLogger('DeviceMedia');

class DeviceMedia extends Media {
  constructor(options = {}) {
    super();
    // Initialized
    this.deviceInit = false;
    this.deviceList = [];
    this.audioDevice = options.audioDevice;
    this.videoDevice = options.videoDevice;
    this.audioQuality = options.audioQuality || AudioQuality;
    this.videoQuality = options.videoQuality || VideoQuality;
    this.refCount = 0;
    this.resetCount = 0;
    this.isResetting = false;
    this.resetQueue = Promise.resolve();
    navigator.mediaDevices.ondevicechange = this.detectDevice.bind(this);
    this.detectDevice();
  }

  isAcquiring() {
    return !!this.refCount;
  }

  get audioInputDevices() {
    return this.deviceList.filter((device) => device.kind === 'audioinput');
  }

  get audioOutputDevices() {
    return this.deviceList.filter((device) => device.kind === 'audiooutput') || [];
  }

  get videoInputDevices() {
    return this.deviceList.filter((device) => device.kind === 'videoinput') || [];
  }

  get constraints() {
    return this.genConstraints();
  }

  async acquireStream(force = false) {
    logger.info('acquireStream');
    if (!this.deviceInit) return Promise.reject(ERRORS.MEDIA_UN_INIT);
    this.refCount++;
    if (this.stream && !force) return Promise.resolve(this.stream);
    if (this.videoInputDevices.length <= 0 && this.audioInputDevices.length <= 0) return;

    const constraints = this.genConstraints();

    return getUserMedia(constraints)
      .then((stream) => {
        if (this.stream) this.stream.close();
        if (this.refCount > 0) return this.stream = stream;
        stream.close();
        this.stream = null;
      })
      .catch((error) => {
        logger.error(error);
        this.stream = null;
      });
  }
  async releaseStream(force = false) {
    logger.info('releaseStream');
    await Promise.resolve();

    if (this.refCount > 0) this.refCount--;
    if (!this.stream) return;
    if (this.refCount === 0 || force) {
      this.stream.close();
      this.stream = null;
    }
  }
  async resetStream() {
    logger.info('resetStream', this.stream);
    const doReset = async () => {
      if (this.resetCount > 1) return Promise.resolve();
      this.isResetting = true;
      logger.info('isResetting: ', this.isResetting, this.resetCount);
      try {
        if (!this.isAcquiring()) return;
        await this.releaseStream(true);
        await this.acquireStream(true);
      }
      catch (e) { console.warn(e); }
      finally { this.isResetting = false; }
    };

    this.resetCount++;
    this.resetQueue = this.resetQueue.then(doReset).then(() => this.resetCount--);
  }

  async resetAudioQuality() {
    if (this.refCount === 0 || !this.stream) return;
    if (!MediaStreamTrack.prototype.applyConstraints) return this.resetStream();

    this.stream.getAudioTracks().forEach((track) => {
      track.applyConstraints(this.audioQuality)
        .catch((e) => {
          logger.warn(`Apply audio constraints failed: ${ e }`);
        });
    });
  }
  async resetVideoQuality() {
    if (this.refCount === 0 || !this.stream) return;

    if (!MediaStreamTrack.prototype.applyConstraints) return this.resetStream();

    this.stream.getVideoTracks().forEach((track) => {
      track.applyConstraints(this.videoQuality)
        .catch((e) => {
          logger.warn(`Apply video constraints failed: ${ e }`);
        });
    });
  }

  genConstraints() {
    logger.info('genConstraints');

    const constraints = {};

    if (this.audioDevice) {
      constraints.audio = Object.assign({}, this.audioDevice);
    }
    if (this.videoDevice) {
      constraints.video = Object.assign({}, this.videoDevice);
    }
    if (constraints.audio && this.audioQuality) {
      Object.assign(constraints.audio, this.audioQuality);
    }
    if (constraints.video && this.videoQuality) {
      Object.assign(constraints.video, this.videoQuality);
    }

    if (browser.ios && browser.safari) this.genSafariConstraints(constraints);
    if (browser.android) this.genAndroidConstraints(constraints);

    logger.info('genConstraints: ', constraints);

    return constraints;
  }

  genSafariConstraints(constraints) {
    if (!constraints.video || !this.videoDevice) return;

    const index = this.videoInputDevices.findIndex((device) => device.deviceId === this.videoDevice.deviceId);

    constraints.video.facingMode = { exact: index === 1 ? 'user' : 'environment' };

    return constraints;
  }

  genAndroidConstraints(constraints) {
    if (!constraints.video || !this.videoDevice) return;

    const index = this.videoInputDevices.findIndex((device) => device.deviceId === this.videoDevice.deviceId);

    constraints.video.facingMode = { exact: index === 1 ? 'user' : 'environment' };

    return constraints;
  }

  // 检测设备
  detectDevice() {
    return navigator.mediaDevices.enumerateDevices()
      .then((deviceList) => {
        this.deviceList = deviceList.map((d) => d.toJSON());
        this.deviceInit = true;
      })
      .catch((error) => logger.warn('enumerate devices error: %s', error));
  }

  destroy() {
    navigator.mediaDevices.removeEventListener('devicechange', this.detectDevice.bind(this));
    if (this.stream) { this.stream.close(); this.stream = null; }
    this.streamAnalyser.destroy();
    this.streamAnalyser = null;
  }
}

export default DeviceMedia;
