import debug from 'debug';
import { Api } from '../api';

const log = debug('MN:Information:Record');

export type RecordOperationType = 'start'| 'stop'| 'pause'| 'resume';

export enum RecordOperationTypes {
  START = 'start',
  STOP = 'stop',
  PAUSE = 'pause',
  RESUME = 'resume',
}

export interface RecordCtrl {
  operation: (type: RecordOperationType) => Promise<void>;
  start: () => Promise<void>;
  stop: () => Promise<void>;
  pause: () => Promise<void>;
  resume: () => Promise<void>;
}

export function createRecordCtrl(api: Api): RecordCtrl {
  async function operation(type: RecordOperationType) {
    await api
      .request('setRecord')
      .data({ operate: type })
      .send();
  }

  function start() {
    log('start()');

    return operation(RecordOperationTypes.START);
  }
  function stop() {
    log('stop()');

    return operation(RecordOperationTypes.STOP);
  }
  function pause() {
    log('pause()');

    return operation(RecordOperationTypes.PAUSE);
  }
  function resume() {
    log('resume()');

    return operation(RecordOperationTypes.RESUME);
  }

  return {
    operation,

    start,
    stop,
    pause,
    resume,
  };
}
