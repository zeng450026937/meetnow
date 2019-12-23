import { Api } from '../api';

export type RecordOperationType = 'start'| 'stop'| 'pause'| 'resume';

export enum RecordOperationTypes {
  START = 'start',
  STOP = 'stop',
  PAUSE = 'pause',
  RESUME = 'resume',
}

export function createRecordCtrl(api: Api) {
  async function operation(type: RecordOperationType) {
    await api
      .request('setRecord')
      .data({ operate: type })
      .send();
  }

  function start() {
    return operation(RecordOperationTypes.START);
  }
  function stop() {
    return operation(RecordOperationTypes.STOP);
  }
  function pause() {
    return operation(RecordOperationTypes.PAUSE);
  }
  function resume() {
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

export type RecordCtrl = ReturnType<typeof createRecordCtrl>;
