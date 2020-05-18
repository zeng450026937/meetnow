import debug from 'debug';
import { AxiosResponse } from 'axios';
import { Api } from '../api';
import { Request, RequestResult } from '../api/request';
import { createEvents, Events } from '../events';

export enum MessageStatus {
  kNull,
  kSending,
  kSuccess,
  kFailed,
}
export type MessageDirection = 'incoming' | 'outgoing';

export interface MessageData {
  'is-private': boolean,
  'im-context': string,
  'im-timestamp': number,
  'im-version': number,
  'sender-entity': string,
  'sender-subject-id': string
  'sender-display-text': string
}

export interface MessageSender {
  'entity': string;
  'subjectId': string;
  'displayText': string; // get display text from user instance as display text can be changed
}

export interface MessageConfigs {
  api: Api;
  content?: string;
  sender?: MessageSender;
}

const log = debug('MN:Message');

export interface Message {
  readonly status: MessageStatus;
  readonly direction: MessageDirection;
  readonly content?: string;
  readonly timestamp?: number;
  readonly version?: number;
  readonly sender?: MessageSender;
  readonly receiver?: string[];
  readonly private?: boolean;
  send: (target?: string[]) => Promise<void>;
  retry: () => Promise<void>;
  cancel: () => void;
  incoming: (data: MessageData) => Message;
}

export function createMessage(config: MessageConfigs): Message {
  const { api } = config;
  const events = createEvents(log);

  let status = MessageStatus.kNull;
  let direction: MessageDirection = 'outgoing';
  let timestamp: number | undefined;
  let version: number | undefined;
  /* eslint-disable-next-line prefer-destructuring */
  let content: string | undefined = config.content;
  /* eslint-disable-next-line prefer-destructuring */
  let sender: MessageSender | undefined = config.sender;
  let receiver: string[] | undefined;
  let isPrivate: boolean = false;

  let message: any;
  let request: Request | undefined;

  async function send(target?: string[]) {
    log('send()');

    if (direction === 'incoming') throw new Error('Invalid Status');

    status = MessageStatus.kSending;
    events.emit('sending', message);

    request = api
      .request('pushMessage')
      .data({
        'im-context'       : message,
        'user-entity-list' : target,
      });

    let response: AxiosResponse<RequestResult>;

    try {
      response = await request.send();
    } catch (error) {
      status = MessageStatus.kFailed;

      events.emit('failed', message);

      throw error;
    }

    const { data } = response;

    receiver = target;
    ({
      'im-version': version,
      'im-timestamp': timestamp,
    } = data.data);

    status = MessageStatus.kSuccess;

    events.emit('succeeded', message);
  }

  async function retry() {
    log('retry()');

    if (!content) throw new Error('Invalid Message');

    await send(receiver);
  }

  function cancel() {
    log('cancel()');

    if (request) {
      request.cancel();
      request = undefined;
    }
  }

  function incoming(data: MessageData) {
    direction = 'incoming';

    content = data['im-context'];
    timestamp = data['im-timestamp'];
    version = data['im-version'];
    isPrivate = data['is-private'];

    sender = {
      entity      : data['sender-entity'],
      subjectId   : data['sender-subject-id'],
      displayText : data['sender-display-text'],
    };

    return message as Message;
  }

  return message = {
    ...events,

    get status() {
      return status;
    },
    get direction() {
      return direction;
    },
    get content() {
      return content;
    },
    get timestamp() {
      return timestamp;
    },
    get version() {
      return version;
    },
    get sender() {
      return sender;
    },
    get receiver() {
      return receiver;
    },
    get private() {
      return (receiver && receiver.length > 0) || isPrivate;
    },

    send,
    retry,
    cancel,

    incoming,
  };
}
