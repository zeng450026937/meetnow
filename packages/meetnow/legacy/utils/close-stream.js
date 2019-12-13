export function closeMediaStream(stream) {
  if (!stream) {
    return;
  }

  // Latest spec states that MediaStream has no stop() method and instead must
  // call stop() on every MediaStreamTrack.
  try {
    let tracks;

    if (stream.getTracks) {
      tracks = stream.getTracks();
      tracks.forEach((track) => {
        track.stop();
      });
    }
    else {
      tracks = stream.getAudioTracks();
      tracks.forEach((track) => {
        track.stop();
      });
      tracks = stream.getVideoTracks();
      tracks.forEach((track) => {
        track.stop();
      });
    }
  }
  catch (error) {
    // Deprecated by the spec, but still in use.
    // NOTE: In Temasys IE plugin stream.stop is a callable 'object'.
    if (typeof stream.stop === 'function' || typeof stream.stop === 'object') {
      stream.stop();
    }
  }
}
