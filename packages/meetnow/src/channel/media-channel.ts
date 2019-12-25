import { Api } from '../api';
import { createChannel } from './channel';
import { createModifier } from './sdp-modifier';
import { getBrowser } from '../browser';

const browser = getBrowser();

export interface MediaChannelConfigs {
  api: Api;
  type?: 'main' | 'slides';
}

export function createMediaChannel(config: MediaChannelConfigs) {
  const { api, type = 'main' } = config;
  let mediaVersion: number;
  let callId: string;

  const channel = createChannel({
    sendOffer : async (offer) => {
      let { sdp } = offer;

      const apiName = mediaVersion
        ? type === 'main'
          ? 'renegMedia'
          : 'renegShare'
        : type === 'main'
          ? 'joinMedia'
          : 'joinShare';
      const response = await api
        .request(apiName)
        .data({
          sdp,
          'media-version' : mediaVersion,
        })
        .send();

      ({
        sdp,
        'media-version': mediaVersion,
        'mcu-callid': callId,
      } = response.data.data);

      return { sdp };
    },
  });

  channel.on(
    'sdp',
    createModifier()
      .content(type)
      .prefer('h264')
      .build(),
  );

  return {
    ...channel,
  };
}
