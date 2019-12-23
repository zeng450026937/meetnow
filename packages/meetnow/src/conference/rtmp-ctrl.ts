import { Api } from '../api';

export type RTMPOperationType = 'start'| 'stop'| 'pause'| 'resume';

export enum RTMPOperationTypes {
  START = 'start',
  STOP = 'stop',
  PAUSE = 'pause',
  RESUME = 'resume',
}

export function createRTMPCtrl(api: Api) {
  async function operation(type: RTMPOperationType) {
    await api
      .request('setRTMP')
      .data({ operate: type })
      .send();
  }

  function start() {
    return operation(RTMPOperationTypes.START);
  }
  function stop() {
    return operation(RTMPOperationTypes.STOP);
  }
  function pause() {
    return operation(RTMPOperationTypes.PAUSE);
  }
  function resume() {
    return operation(RTMPOperationTypes.RESUME);
  }

  return {
    operation,

    start,
    stop,
    pause,
    resume,
  };
}

export type RTMPCtrl = ReturnType<typeof createRTMPCtrl>;
