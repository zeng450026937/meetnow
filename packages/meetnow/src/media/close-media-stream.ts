export function closeMediaStream(stream?: MediaStream) {
  if (!stream) return;

  // Latest spec states that MediaStream has no stop() method and instead must
  // call stop() on every MediaStreamTrack.
  try {
    if (stream.getTracks) {
      stream.getTracks().forEach(track => track.stop());
    } else {
      stream.getAudioTracks().forEach(track => track.stop());
      stream.getVideoTracks().forEach(track => track.stop());
    }
  } catch (error) {
    // Deprecated by the spec, but still in use.
    // NOTE: In Temasys IE plugin stream.stop is a callable 'object'.
    if (typeof (stream as any).stop === 'function' || typeof (stream as any).stop === 'object') {
      (stream as any).stop();
    }
  }
}
