import { setup } from './stream-utils';

export async function getDisplayMedia(constraints: any) {
  let stream: MediaStream;

  if ((navigator.mediaDevices as any).getDisplayMedia) {
    stream = await (navigator.mediaDevices as any).getDisplayMedia(constraints);
  } else if ((navigator as any).getDisplayMedia) {
    // support edge
    stream = await new Promise((resolve, reject) => {
      (navigator as any).getDisplayMedia(constraints, resolve, reject);
    });
  } else {
    throw new Error('Not Supported');
  }

  return setup(stream);
}
