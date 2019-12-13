import { Api } from '../api';
import { createKeepAlive, KeepAlive } from './keepalive';
import { createPolling, Polling } from './polling';

export interface JoinOptions {
  number: string;
  password?: string;
  displayName?: string;
  url: string;
}

export interface ConferenceConfigs {
  api: Api;
}

export function createConference(config: ConferenceConfigs) {
  const { api } = config;
  let keepalive: KeepAlive;
  let polling: Polling;
  let conference;

  let uuid: string | undefined;
  let userId: string | undefined;

  // Sequence of join conference
  //
  // 1. connect focus channel
  // 2. connect media channel
  // 3. connect share channel
  // 4. create keepalive worker
  // 5. create polling worker
  // 6. fetch conference info
  async function join(options: JoinOptions) {
    const response = await api
      .request('joinFocus')
      .data({
        // 'conference-uuid'     : '',
        // 'conference-user-id'  : '',
        'conference-url'      : options.url,
        'conference-pwd'      : options.password,
        'user-agent'          : 'Yealink Meeting WebRTC',
        'client-url'          : options.url.replace(/\w+@/g, 'webrtc@'),
        'client-display-text' : options.url,
        'client-type'         : 'HTTP',
        'pure-ctrl-channel'   : true,
        'is-webrtc'           : true,
      })
      .send();

    const { data } = response;

    // TODO
    // check bizCode

    ({
      'conference-user-id': userId,
      'conference-uuid': uuid,
    } = data.data);

    if (!userId) {
      console.error('internal error');
      debugger;
    }

    keepalive = createKeepAlive({ api });
    polling = createPolling({ api });

    keepalive.start();
    polling.start();
  }

  function leave() {}

  return conference = {
    join,
    leave,
  };
}

export type Conference = ReturnType<typeof createConference>;
