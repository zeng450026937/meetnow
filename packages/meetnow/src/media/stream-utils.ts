import { closeMediaStream } from './close-media-stream';

declare global {
  interface MediaStream {
    close: () => void;
    stop: () => void;
    pause: () => void;
    play: () => void;
    muteAudio: (mute?: boolean) => void;
    muteVideo: (mute?: boolean) => void;
  }
}

export function setup(stream: MediaStream): MediaStream {
  stream.close = stream.stop = function close() {
    closeMediaStream(this);
  };
  stream.pause = function pause() {
    this.getTracks().forEach(track => track.enabled = false);
  };
  stream.play = function play() {
    this.getTracks().forEach(track => track.enabled = true);
  };
  stream.muteAudio = function muteAudio(mute: boolean = true) {
    this.getAudioTracks().forEach(track => track.enabled = !mute);
  };
  stream.muteVideo = function muteVideo(mute: boolean = true) {
    this.getVideoTracks().forEach(track => track.enabled = !mute);
  };

  return stream;
}
