import debug from 'debug';
import { Api } from '../api';
import { createChannel } from './channel';
import { createModifier } from './sdp-modifier';
import { Request } from '../api/request';

const log = debug('Meetnow:MediaChannel');

export interface MediaChannelConfigs {
  api: Api;
  type?: 'main' | 'slides';
}

export function createMediaChannel(config: MediaChannelConfigs) {
  const { api, type = 'main' } = config;
  let mediaVersion: number;
  let callId: string;
  let request: Request | undefined;
  let icetimmeout;

  const channel = createChannel({
    invite : async (offer) => {
      let { sdp } = offer;

      const apiName = mediaVersion
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
        'media-version': mediaVersion,
        'mcu-callid': callId,
      } = response.data.data);

      log('MCU call-id: %s', callId);

      return { sdp };
    },
    cancel : () => request.cancel(),
    bye    : () => {},
  });

  channel.on(
    'sdp',
    createModifier()
      .content(type)
      .prefer('h264')
      .build(),
  );

  channel.on('icecandidate', (data) => {
    const { candidate, ready } = data;

    if (icetimmeout) {
      clearTimeout(icetimmeout);
      icetimmeout = null;
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
  };
}
