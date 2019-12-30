import debug from 'debug';
import { Api } from '../api';

const log = debug('MN:Information:RTMP');

export type RTMPOperationType = 'start'| 'stop'| 'pause'| 'resume';

export enum RTMPOperationTypes {
  START = 'start',
  STOP = 'stop',
  PAUSE = 'pause',
  RESUME = 'resume',
}

export function createRTMPCtrl(api: Api) {
  async function operation(type: RTMPOperationType) {
    log('operation');

    await api
      .request('setRTMP')
      .data({ operate: type })
      .send();
  }

  function start() {
    log('start');

    return operation(RTMPOperationTypes.START);
  }
  function stop() {
    log('stop');

    return operation(RTMPOperationTypes.STOP);
  }
  function pause() {
    log('pause');

    return operation(RTMPOperationTypes.PAUSE);
  }
  function resume() {
    log('resume');

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
