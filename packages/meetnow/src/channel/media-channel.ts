import debug from 'debug';
import { Api } from '../api';
import { Channel, createChannel } from './channel';
import { createModifier } from './sdp-modifier';
import { Request } from '../api/request';

export * from './channel';

const log = debug('MN:MediaChannel');

export interface MediaChannelConfigs {
  api: Api;
  type?: 'main' | 'slides';
}

export interface MediaChannel extends Channel {
  readonly version?: number;
  readonly callId?: string;
}

export function createMediaChannel(config: MediaChannelConfigs): MediaChannel {
  const { api, type = 'main' } = config;
  let mediaVersion: number | undefined;
  let callId: string;
  let request: Request | undefined;
  let icetimmeout: number | undefined;

  let localstream: MediaStream | undefined;
  let remotestream: MediaStream | undefined;

  const channel = createChannel({
    invite : async (offer) => {
      log('invite()');

      let { sdp } = offer;

      const apiName = offer.renegotiate
        ? type === 'main'
          ? 'renegMedia'
          : 'renegShare'
        : type === 'main'
          ? 'joinMedia'
          : 'joinShare';

      request = api
        .request(apiName)
        .data({
          sdp,
          'media-version' : mediaVersion,
        });

      const response = await request.send();

      ({
        sdp,
        'media-version': mediaVersion = mediaVersion,
        'mcu-callid': callId = callId,
      } = response.data.data);

      log('MCU call-id: %s', callId);

      return { sdp };
    },
    confirm : () => {
      log('confirm()');

      request = undefined;

      // send confirm
    },
    cancel : () => {
      log('cancel()');

      request && request.cancel();
      request = undefined;
      mediaVersion = undefined;
    },
    bye : () => {
      log('bye()');

      request = undefined;
      mediaVersion = undefined;
    },

    localstream : (stream) => {
      localstream = stream;

      channel.emit('localstream', localstream);
    },
  });

  channel.on(
    'sdp',
    (data) => {
      if (data.originator === 'local') {
        createModifier()
          .content(type)
          .prefer('h264')
          .build()(data);
        return;
      }

      log(`${ data.originator } sdp: \n\n %s \n`, data.sdp);
    },
  );

  channel.on('peerconnection', (pc: RTCPeerConnection) => {
    pc.addEventListener('connectionstatechange', () => {
      log('peerconnection:connectionstatechange : %s', pc.connectionState);
    });

    pc.addEventListener('iceconnectionstatechange', () => {
      log('peerconnection:iceconnectionstatechange : %s', pc.iceConnectionState);
    });

    pc.addEventListener('icegatheringstatechange', () => {
      log('peerconnection:icegatheringstatechange : %s', pc.iceGatheringState);
    });

    pc.addEventListener('negotiationneeded', () => {
      log('peerconnection:negotiationneeded');

      channel.emit('negotiationneeded');
    });

    pc.addEventListener('track', (event) => {
      log('peerconnection:track: %o', event);
      remotestream = event.streams[0];

      channel.emit('remotestream', remotestream);
    });

    // for old browser(firefox)
    pc.addEventListener('addstream', (event: any) => {
      log('peerconnection:addstream: %o', event);
      remotestream = event.stream;

      channel.emit('remotestream', remotestream);
    });
    pc.addEventListener('removestream', (event) => {
      log('peerconnection:removestream: %o', event);
      remotestream = channel.getRemoteStream();

      channel.emit('removestream', remotestream);
    });
  });

  channel.on('icecandidate', (data: any) => {
    const { candidate, ready } = data;

    if (icetimmeout) {
      clearTimeout(icetimmeout);
      icetimmeout = undefined;
    }

    if (candidate) {
      icetimmeout = setTimeout(() => {
        log('ICE gathering timeout in 3 seconds');
        ready();
      }, 3000);
    }
  });

  return {
    ...channel,

    get status() {
      return channel.status;
    },
    get connection() {
      return channel.connection;
    },

    get startTime() {
      return channel.startTime;
    },
    get endTime() {
      return channel.endTime;
    },

    get version() {
      return mediaVersion;
    },
    get callId() {
      return callId;
    },
  };
}
