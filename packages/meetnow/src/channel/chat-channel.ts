import debug from 'debug';
import { Api } from '../api';
import { Request } from '../api/request';
import { createEvents } from '../events';
import {
  createMessage, Message, MessageData, MessageSender,
} from './message';

const log = debug('MN:ChatChannel');

export interface ChatChannelConfigs {
  api: Api;
  sender?: MessageSender;
}

export function createChatChannel(config: ChatChannelConfigs) {
  const { api, sender } = config;
  const events = createEvents(log);
  let messages: Message[] = [];
  let request: Request | undefined;
  let ready = false;

  async function connect(count: number = 2000) {
    log('connect()');

    if (ready) return;

    request = api.request('pullMessage').data({ count });

    const response = await request.send();

    const { data } = response.data;

    messages = (data.imInfos as MessageData[])
      .map((msg) => {
        return createMessage({ api }).incoming(msg);
      });

    ready = true;

    events.emit('ready');
    events.emit('connected');
  }

  async function terminate() {
    log('terminate()');

    messages = [];
    ready = false;

    if (request) {
      request.cancel();
      request = undefined;
    }

    events.emit('disconnected');
  }

  async function sendMessage(msg: string, target?: string[]) {
    log('sendMessage()');

    const message = createMessage({ api, sender });

    events.emit('message', {
      originator : 'local',
      message,
    });

    await message.send(msg, target);

    messages.push(message);

    return message;
  }

  function incoming(data: MessageData) {
    log('incoming()');

    const message = createMessage({ api }).incoming(data);

    events.emit('message', {
      originator : 'remote',
      message,
    });

    messages.push(message);

    return message;
  }

  return {
    ...events,

    get ready() {
      return ready;
    },

    connect,
    terminate,

    sendMessage,

    incoming,
  };
}

export type ChatChannel = ReturnType<typeof createChatChannel>;
