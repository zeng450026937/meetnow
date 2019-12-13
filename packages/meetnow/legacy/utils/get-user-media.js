import { closeMediaStream } from './close-stream';

export function getUserMedia(constraints) {
  return navigator.mediaDevices.getUserMedia(constraints)
    .then((stream) => {
      stream.close = stream.stop = function () {
        closeMediaStream(this);
      };
      stream.pause = function () {
        this.getTracks().forEach((track) => track.enabled = false);
      };
      stream.play = function () {
        this.getTracks().forEach((track) => track.enabled = true);
      };
      stream.muteAudio = function (mute) {
        this.getAudioTracks().forEach((track) => track.enabled = !mute);
      };
      stream.muteVideo = function (mute) {
        this.getVideoTracks().forEach((track) => track.enabled = !mute);
      };

      return stream;
    });
}

export function getDisplayMedia(constraints) {
  const isUnStandardBrowser = navigator.getDisplayMedia;
  const isStandardBrowser = navigator.mediaDevices.getDisplayMedia;

  // TODO 怎样解决 不能写在一起的问题
  if (isStandardBrowser) {
    return navigator.mediaDevices.getDisplayMedia(constraints)
      .then((stream) => {
        stream.close = stream.stop = function () {
          closeMediaStream(this);
        };

        return stream;
      });
  }
  if (isUnStandardBrowser) {
    return navigator.getDisplayMedia(constraints)
      .then((stream) => {
        stream.close = stream.stop = function () {
          closeMediaStream(this);
        };

        return stream;
      });
  }

  return Promise.reject(new Error('unSupport browser'));
}
