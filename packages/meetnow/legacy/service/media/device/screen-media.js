/* eslint-disable lines-between-class-members */
import Bowser from 'bowser';
import Analysis from '../../../utils/browser-analysis';
import { ScreenQuality } from './config';
import Media from './media';
import { getUserMedia, getDisplayMedia } from '../../../utils/get-user-media';
import Logger from '../../../log/index';

const logger = Logger.genLogger('ScreenDevice');

const api = 'ylGetScreen';

let pluginCallback = null;

class ScreenDevice extends Media {
  constructor(options = {}) {
    super('screen');
    this.quality = options.quality || ScreenQuality;
    this.source = 'desktop'; // desktop | screen
    this.constraints = { frameRate: 5, width: 1920, height: 1080 };
  }

  get supportNativeShare() {
    return (Bowser.firefox && Bowser.version >= 66)
      || (Analysis.isChrome && Analysis.chromeVersion >= 75)
      || (Bowser.msedge && Bowser.version >= 17);
  }

  acquireStream(smoothMode = false) {
    logger.warn('acquireStream');
    if (this.stream) return Promise.resolve(this.stream);
    const quality = {};

    if (smoothMode) {
      quality.frameRate = 30;
      quality.width = 1080;
      quality.height = 720;
    }
    else {
      quality.frameRate = 5;
      quality.width = 1920;
      quality.height = 1080;
    }

    this.genConstraints({ quality });
    const acquire = this.supportNativeShare
      ? this.acquireInAdvancedBrowser()
      : this.acquireInOlderBrowser();

    return acquire.then((stream) => {
      if (!stream) logger.warn('acquire screen stream failed');
      if (this.stream) {
        this.stream.removeEventListener('inactive', this.releaseStream.bind(this));
        this.stream.close();
      }
      stream.addEventListener('inactive', this.releaseStream.bind(this));

      return this.stream = stream;
    }).catch((error) => {
      logger.error(error);
      this.stream = null;
      throw error;
    });
  }

  openExternalPlugin() {
    return new Promise((resolve, reject) => {
      if (Bowser.firefox) resolve(this.genConstraints({ source: 'screen' }));
      else if (Bowser.chrome) {
        const pending = window.setTimeout(() => {
          window.removeEventListener('message', pluginCallback);
          pluginCallback = null;
          reject(new Error('No Extension Tool'));
        }, 2000);

        pluginCallback = (event) => {
          if (event.origin !== window.location.origin) return;
          const { type, sourceId } = event.data;

          if (type === `${ api }Done`) {
            window.removeEventListener('message', pluginCallback);
            pluginCallback = null;
            if (sourceId) resolve(this.genConstraints({ source: 'desktop', deviceId: sourceId }));
            else reject(new Error('User Canceled'));
          }
          else if (type === `${ api }Pending`) window.clearTimeout(event.data.id);
        };
        window.addEventListener('message', pluginCallback);

        window.postMessage({ type: api, id: Number(pending) }, '*');
      }
    });
  }

  acquireInAdvancedBrowser() {
    return getDisplayMedia(this.constraints);
  }
  acquireInOlderBrowser() {
    return this.openExternalPlugin().then((val) => {
      console.warn(val);

      return getUserMedia(this.constraints);
    });
  }

  releaseStream(force = false) {
    logger.warn('releaseStream');
    if (!this.stream) return;
    this.stream.close();
    this.stream = null;
  }
  genConstraints({ quality, source, deviceId }) {
    if (quality) this.quality = quality;
    const mandatory = {
      maxWidth     : this.quality.width,
      maxHeight    : this.quality.height,
      minFrameRate : this.quality.frameRate,
      maxFrameRate : this.quality.frameRate,
    };

    if (this.supportNativeShare) this.constraints = { video: { ...this.quality } }; // 支持原生的辅流分享
    else if (Bowser.chrome) {
      mandatory.chromeMediaSource = source;
      mandatory.chromeMediaSourceId = deviceId;
      const optional = [{ googTemporalLayeredScreencast: true }];

      this.constraints = {
        deviceId : undefined,
        audio    : false,
        video    : { mandatory, optional },
      };
    }
    else if (Bowser.firefox) {
      this.constraints = {
        deviceId : undefined,
        audio    : false,
        video    : {
          ...mandatory,
          mozMediaSource : source,
          mediaSource    : source,
        },
      };
    }

    return this.constraints;
  }
}

export default ScreenDevice;
