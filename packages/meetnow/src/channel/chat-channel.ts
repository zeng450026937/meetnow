import debug from 'debug';
import { Api } from '../api';
import { Request } from '../api/request';
import { createEvents } from '../events';
import { createMessage, Message, MessageData } from './message';

const log = debug('Meetnow:ChatChannel');

export interface ChatChannelConfigs {
  api: Api;
}

export function createChatChannel(config: ChatChannelConfigs) {
  const { api } = config;
  const events = createEvents(log);
  let messages: Message[] = [];
  let request: Request;

  async function connect(count?: number) {
    request = api.request('pullMessage').data({ count });

    const response = await request.send();

    const { data } = response.data;

    messages = (data.imInfos as MessageData[])
      .map((msg) => {
        return createMessage({ api }).incoming(msg);
      });
  }

  async function terminate() {
    if (!request) return;

    request.cancel();

    request = null;
  }

  async function sendMessage(msg: string, target?: string[]) {
    const message = createMessage({ api });

    await message.send(msg, target);

    messages.push(message);
  }

  function incoming(data: MessageData) {
    const message = createMessage({ api }).incoming(data);

    messages.push(message);
  }

  return {
    ...events,

    connect,
    terminate,

    sendMessage,

    incoming,
  };
}

export type ChatChannel = ReturnType<typeof createChatChannel>;
