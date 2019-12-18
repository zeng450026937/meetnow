import { setup } from './stream-utils';

export async function getUserMedia(constraints: MediaStreamConstraints) {
  let stream: MediaStream;

  if (navigator.mediaDevices.getUserMedia) {
    stream = await navigator.mediaDevices.getUserMedia(constraints);
  } else {
    throw new Error('Not Supported');
  }

  return setup(stream);
}
