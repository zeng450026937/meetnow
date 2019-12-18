import { setup } from './stream-utils';

export async function getDisplayMedia(constraints: any) {
  let stream: MediaStream;

  if ((navigator.mediaDevices as any).getDisplayMedia) {
    stream = await (navigator.mediaDevices as any).getDisplayMedia(constraints);
  } else if ((navigator as any).getDisplayMedia) {
    stream = await (navigator as any).getDisplayMedia(constraints);
  } else {
    throw new Error('Not Supported');
  }

  return setup(stream);
}
