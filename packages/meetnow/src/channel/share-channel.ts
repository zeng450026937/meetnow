import { Api } from '../api';
import { createChannel } from './channel';

export interface MediaChannelConfigs {
  api: Api;
}

export function createShareChannel(config: MediaChannelConfigs) {
  const { api } = config;
  let mediaVersion: number;
  let callId: string;

  const channel = createChannel({
    sendOffer : async (offer) => {
      let { sdp } = offer;

      const apiName = mediaVersion ? 'renegShare' : 'joinShare';
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

  return {
    ...channel,
  };
}
