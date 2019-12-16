import { setup } from './stream-utils';

export async function getDisplayMedia(constraints: any) {
  let stream: MediaStream;

  try {
    if (navigator.mediaDevices.getUserMedia) {
      stream = await navigator.mediaDevices.getUserMedia(constraints);
    } else if ((navigator as any).getDisplayMedia) {
      stream = await (navigator as any).getDisplayMedia(constraints);
    }
  } catch (error) {
    throw error;
  }

  return setup(stream);
}
