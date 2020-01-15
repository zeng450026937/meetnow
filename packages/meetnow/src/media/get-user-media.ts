import { setup } from './stream-utils';

export async function getUserMedia(constraints: MediaStreamConstraints) {
  let stream: MediaStream;

  if (navigator.mediaDevices.getUserMedia) {
    stream = await navigator.mediaDevices.getUserMedia(constraints);
  } else if ((navigator as any).getUserMedia) {
    // support chrome 52
    stream = await new Promise((resolve, reject) => {
      (navigator as any).getUserMedia(constraints, resolve, reject);
    });
  } else {
    throw new Error('Not Supported');
  }

  return setup(stream);
}
