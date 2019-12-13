import Quality from './quality';

class VideoQuality extends Quality {
  constructor() {
    super({ kind: 'video' });

    this.aspectRatio = 16 / 9;
    this.frameRate = 30;
    this.height = 720;
    this.width = 1280;
  }

  get id() {
    return this.width + this.height + this.frameRate;
  }

  toObject() {
    return {
      aspectRatio : this.aspectRatio,
      frameRate   : this.frameRate,
      height      : this.height,
      width       : this.width,
    };
  }
}

export default VideoQuality;
