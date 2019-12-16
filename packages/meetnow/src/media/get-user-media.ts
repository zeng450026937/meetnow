import { setup } from './stream-utils';

export async function getUserMedia(constraints: MediaStreamConstraints) {
  let stream: MediaStream;

  try {
    stream = await navigator.mediaDevices.getUserMedia(constraints);
  } catch (error) {
    throw error;
  }

  return setup(stream);
}
