import { createEvents } from '../events';
import { getUserMedia } from '../media/get-user-media';
import { closeMediaStream } from '../media/close-media-stream';
import SDPTransform from '../sdp-transform';

export interface ChannelConfigs {
  sendOffer: (offer: { sdp: string }) => Promise<{
    'sdp': string,
  }>
}

export interface ConnectOptions {
  rtcConstraints?: RTCConfiguration;
  rtcOfferConstraints?: RTCOfferOptions;
  mediaStream?: MediaStream;
  mediaConstraints?: MediaStreamConstraints;
}

export interface RenegotiateOptions {
  rtcConstraints?: RTCConfiguration;
  rtcOfferConstraints?: RTCOfferOptions;
  mediaStream?: MediaStream;
  mediaConstraints?: MediaStreamConstraints;
}

/**
 * Local variables.
 */
const holdMediaTypes = ['audio', 'video'];

export function createChannel(config: ChannelConfigs) {
  const { sendOffer } = config;
  const events = createEvents();

  // The RTCPeerConnection instance (public attribute).
  let connection: RTCPeerConnection | undefined;

  // Prevent races on serial PeerConnction operations.
  const connectionPromiseQueue = Promise.resolve();

  // Default rtcOfferConstraints(passed in connect()).
  let rtcConstraints: RTCConfiguration | undefined;
  let rtcOfferConstraints: RTCOfferOptions | undefined;

  // Local MediaStream.
  let localMediaStream: MediaStream | undefined;
  let localMediaStreamLocallyGenerated = false;

  // Flag to indicate PeerConnection ready for new actions.
  let rtcReady;
  let startTime: Date | undefined;
  let endTime: Date | undefined;

  // Mute/Hold state.
  let audioMuted = false;
  let videoMuted = false;
  let localHold = false;
  const remoteHold = false;

  function createRTCConnection(rtcConstraints?: RTCConfiguration) {
    /* tslint:disable */
    connection = new RTCPeerConnection(rtcConstraints);

    connection.addEventListener('iceconnectionstatechange', () => {
      const {
        iceConnectionState: state,
      } = connection;

      if (state === 'failed') {
        events.emit('peerconnection:connectionfailed');
        /* eslint-disable-next-line no-use-before-define */
        close();
      }
    });

    events.emit('peerconnection', connection);
  }

  async function createLocalDescription(type: 'offer' | 'answer', constraints: RTCOfferOptions) {
    rtcReady = false;
    let desc: RTCSessionDescriptionInit;

    if (type === 'offer') {
      try {
        desc = await connection.createOffer(constraints);
      } catch (error) {
        events.emit('peerconnection:createofferfailed', error);
        throw error;
      }
    } else if (type === 'answer') {
      try {
        desc = await connection.createAnswer(constraints);
      } catch (error) {
        events.emit('peerconnection:createanswerfailed', error);
        throw error;
      }
    } else {
      throw new Error('invalid type');
    }

    try {
      await connection.setLocalDescription(desc);
    } catch (error) {
      rtcReady = true;
      events.emit('peerconnection:setlocaldescriptionfailed', error);
      throw error;
    }

    await new Promise((resolve) => {
      // When remote fingerprint is changed, setRemoteDescription will not restart ice immediately,
      // and iceGatheringState stay complete for a while.
      // We will get a local sdp without ip candidates, if resolve right away.

      // if (type === 'offer' && connection.iceGatheringState === 'complete')

      // Resolve right away if 'pc.iceGatheringState' is 'complete'.

      if (connection.iceGatheringState === 'complete') {
        resolve();
        return;
      }

      let finished = false;
      let listener;

      const ready = () => {
        connection.removeEventListener('icecandidate', listener);
        finished = true;
        resolve();
      };

      connection.addEventListener('icecandidate', listener = (event) => {
        const { candidate } = event;
        if (candidate) {
          events.emit('icecandidate', {
            candidate,
            ready,
          });
        } else if (!finished) {
          ready();
        }
      });
    });

    rtcReady = true;

    const { sdp } = connection.localDescription;

    desc = {
      originator : 'local',
      type,
      sdp,
    } as any;

    events.emit('sdp', desc);

    return desc.sdp;
  }

  async function connect(options: ConnectOptions = {}) {
    ({
      rtcConstraints = {
        sdpSemantics : 'plan-b', // '' unified-plan plan-b
        iceServers   : [{ urls: 'stun:stun.l.google.com:19302' }],
      } as RTCConfiguration,
      rtcOfferConstraints,
    } = options);

    const {
      mediaStream,
      mediaConstraints = {
        audio : true,
        video : true,
      },
    } = options;

    createRTCConnection(rtcConstraints);

    if (mediaStream) {
      localMediaStream = mediaStream;
      localMediaStreamLocallyGenerated = false;
    } else if (mediaConstraints.audio || mediaConstraints.video) {
      localMediaStream = await getUserMedia(mediaConstraints);
      localMediaStreamLocallyGenerated = true;
    }

    if (localMediaStream) {
      localMediaStream.getTracks().forEach((track) => {
        connection.addTrack(track, localMediaStream);
      });
    }

    events.emit('connecting');

    const localSDP = await createLocalDescription('offer', rtcOfferConstraints);

    const answer = await sendOffer({ sdp: localSDP });

    const {
      sdp: remoteSDP,
    } = answer;

    const desc = {
      originator : 'remote',
      type       : 'answer',
      sdp        : remoteSDP,
    };

    events.emit('sdp', desc);

    try {
      connection.setRemoteDescription({
        type : 'answer',
        sdp  : desc.sdp,
      });
    } catch (error) {
      events.emit('peerconnection:setremotedescriptionfailed', error);
      throw error;
    }

    events.emit('connected');
  }

  function close() {
    if (connection) {
      try {
        connection.close();
      } catch (error) {
        console.warn('erro closing RTCPeerConnection', error);
      }
      connection = null;
    }

    if (localMediaStream && localMediaStreamLocallyGenerated) {
      closeMediaStream(localMediaStream);
    }

    localMediaStream = null;
    localMediaStreamLocallyGenerated = false;
  }

  function toggleMuteAudio(mute: boolean) {
    connection.getSenders().forEach((sender) => {
      if (sender.track && sender.track.kind === 'audio') {
        sender.track.enabled = !mute;
      }
    });
  }

  function toggleMuteVideo(mute: boolean) {
    connection.getSenders().forEach((sender) => {
      if (sender.track && sender.track.kind === 'video') {
        sender.track.enabled = !mute;
      }
    });
  }

  function setLocalMediaStatus() {
    let enableAudio = true;
    let enableVideo = true;

    if (localHold || (remoteHold && localMediaStreamLocallyGenerated)) {
      enableAudio = false;
      enableVideo = false;
    }

    if (audioMuted) {
      enableAudio = false;
    }

    if (videoMuted) {
      enableVideo = false;
    }

    toggleMuteAudio(!enableAudio);
    toggleMuteVideo(!enableVideo);
  }

  function onProgress() {}

  function onAccepted() {}

  function onEnded() {}

  function onFailed() {}

  function onFinished() {}

  function onMute() {
    setLocalMediaStatus();

    events.emit('mute', {
      audio : audioMuted,
      video : videoMuted,
    });
  }
  function onUnMute() {
    setLocalMediaStatus();

    events.emit('unmute', {
      audio : !audioMuted,
      video : !videoMuted,
    });
  }
  function onHold(originator: 'local' | 'remote') {
    setLocalMediaStatus();

    events.emit('hold', {
      originator,
      localHold,
      remoteHold,
    });
  }
  function onUnHold(originator: 'local' | 'remote') {
    setLocalMediaStatus();

    events.emit('unhold', {
      originator,
      localHold,
      remoteHold,
    });
  }

  function mute(options = { audio: true, video: false }) {
    let changed = false;

    if (audioMuted === false && options.audio) {
      changed = true;
      audioMuted = true;
    }

    if (videoMuted === false && options.video) {
      changed = true;
      videoMuted = true;
    }

    if (changed) {
      onMute();
    }
  }

  function unmute(options = { audio: true, video: true }) {
    let changed = false;

    if (audioMuted === true && options.audio) {
      changed = true;
      audioMuted = false;
    }

    if (videoMuted === true && options.video) {
      changed = true;
      videoMuted = false;
    }

    if (changed) {
      onUnMute();
    }
  }

  function hold() {
    if (localHold) {
      console.warn('Already hold');
      return;
    }

    localHold = true;

    onHold('local');

    /* eslint-disable-next-line no-use-before-define */
    renegotiate();
  }

  function unhold() {
    if (!localHold) {
      console.warn('Already unhold');
      return;
    }

    localHold = false;

    onUnHold('local');

    /* eslint-disable-next-line no-use-before-define */
    renegotiate();
  }

  async function renegotiate(options: RenegotiateOptions = {}) {
    if (!rtcReady) {
      console.warn('RTC not ready');
      return;
    }

    const localSDP = await createLocalDescription('offer', rtcOfferConstraints);

    /* eslint-disable-next-line no-use-before-define */
    const answer = await sendOffer({ sdp: mangleOffer(localSDP) });

    const desc = {
      originator : 'remote',
      type       : 'answer',
      sdp        : answer.sdp,
    };

    events.emit('sdp', desc);

    try {
      connection.setRemoteDescription({
        type : 'answer',
        sdp  : desc.sdp,
      });
    } catch (error) {
      events.emit('peerconnection:setremotedescriptionfailed', error);
      throw error;
    }
  }

  function mangleOffer(offer: string) {
    // nothing to do
    if (!localHold && !remoteHold) return offer;

    const sdp = SDPTransform.parse(offer);

    // Local hold.
    if (localHold && !remoteHold) {
      for (const m of sdp.media) {
        if (holdMediaTypes.indexOf(m.type) === -1) {
          continue;
        }
        if (!m.direction) {
          m.direction = 'sendonly';
        } else if (m.direction === 'sendrecv') {
          m.direction = 'sendonly';
        } else if (m.direction === 'recvonly') {
          m.direction = 'inactive';
        }
      }
    // Local and remote hold.
    } else if (localHold && remoteHold) {
      for (const m of sdp.media) {
        if (holdMediaTypes.indexOf(m.type) === -1) {
          continue;
        }
        m.direction = 'inactive';
      }
    // Remote hold.
    } else if (remoteHold) {
      for (const m of sdp.media) {
        if (holdMediaTypes.indexOf(m.type) === -1) {
          continue;
        }
        if (!m.direction) {
          m.direction = 'recvonly';
        } else if (m.direction === 'sendrecv') {
          m.direction = 'recvonly';
        } else if (m.direction === 'recvonly') {
          m.direction = 'inactive';
        }
      }
    }

    return SDPTransform.write(sdp);
  }

  return {
    ...events,
    get connection() {
      return connection;
    },
    connect,
    close,
    renegotiate,
    mute,
    unmute,
    hold,
    unhold,
  };
}
