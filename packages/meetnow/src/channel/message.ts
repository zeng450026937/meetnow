import debug from 'debug';
import { AxiosResponse } from 'axios';
import { Api } from '../api';
import { Request, RequestResult } from '../api/request';

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
  sender?: MessageSender;
  onSucceeded?: (msg: Message) => void;
  onFailed?: (msg: Message) => void;
}

const log = debug('MN:Message');

export function createMessage(config: MessageConfigs) {
  const { api, onSucceeded, onFailed } = config;

  let status = MessageStatus.kNull;
  let direction: MessageDirection = 'outgoing';
  let content: string | undefined;
  let timestamp: number | undefined;
  let version: number | undefined;
  /* eslint-disable-next-line prefer-destructuring */
  let sender: MessageSender | undefined = config.sender;
  let receiver: string[] | undefined;
  let isPrivate: boolean = false;

  let message: any;
  let request: Request | undefined;

  async function send(message: string, target?: string[]) {
    log('send()');

    if (direction === 'incoming') throw new Error('Invalid Status');

    status = MessageStatus.kSending;

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

      onFailed && onFailed(message as any);

      throw error;
    }

    const { data } = response;

    content = message;
    receiver = target;
    ({
      'im-version': version,
      'im-timestamp': timestamp,
    } = data.data);

    status = MessageStatus.kSuccess;

    onSucceeded && onSucceeded(message as any);
  }

  async function retry() {
    log('retry()');

    if (!content) throw new Error('Invalid Message');

    await send(content, receiver);
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

export type Message = ReturnType<typeof createMessage>;
