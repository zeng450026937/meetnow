import { Api } from '../api';

export type OperationType = 'start'| 'stop'| 'pause'| 'resume';

export enum OperationTypes {
  START = 'start',
  STOP = 'stop',
  PAUSE = 'pause',
  RESUME = 'resume',
}

export function createRecordCtrl(api: Api) {
  async function operation(type: OperationType) {
    await api
      .request('record')
      .data({ operate: type })
      .send();
  }
  function start() {
    return operation(OperationTypes.START);
  }
  function stop() {
    return operation(OperationTypes.STOP);
  }
  function pause() {
    return operation(OperationTypes.PAUSE);
  }
  function resume() {
    return operation(OperationTypes.RESUME);
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
