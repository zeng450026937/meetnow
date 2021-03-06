import debug from 'debug';
import { Api } from '../api';

const log = debug('MN:Information:Danmaku');

export type DanmakuType = 'dynamic'| 'static';
export type DanmakuPosition = 'top'| 'medium'| 'bottom';
export type DanmakuRollDirection = 'R2L' | 'L2R';

export interface DanmakuConfigs {
  type: DanmakuType;
  position: DanmakuPosition;
  displayTime: number; // in seconds
  repeatCount: number;
  repeatInterval: number;
  rollDirection: DanmakuRollDirection;
}

export interface DanmakuOptions {
  presenter: boolean;
  attendee: boolean;
  castviewer: boolean;
}

export const DANMAKU_CONFIGS: DanmakuConfigs = {
  position       : 'top',
  type           : 'static',
  displayTime    : 30,
  repeatCount    : 2,
  repeatInterval : 5,
  rollDirection  : 'R2L',
};

export interface DanmakuCtrl {
  setDanmaku: (config: Partial<DanmakuConfigs>) => Promise<void>;
  sendDanmaku: (msg: string, options?: Partial<DanmakuOptions>) => Promise<void>;
}

export function createDanmakuCtrl(api: Api): DanmakuCtrl {
  let lastConfig: DanmakuConfigs = DANMAKU_CONFIGS;

  async function setDanmaku(config: Partial<DanmakuConfigs>) {
    log('setDanmaku()');

    const finalConfig = {
      ...lastConfig,
      config,
    };
    const {
      type, position, displayTime, repeatCount, repeatInterval, rollDirection,
    } = finalConfig;

    await api
      .request('setTitle')
      .data({
        type,
        position,
        'display-time'    : displayTime,
        'repeat-count'    : repeatCount,
        'repeat-interval' : repeatInterval,
        'roll-direction'  : rollDirection,
      })
      .send();

    lastConfig = finalConfig;
  }

  async function sendDanmaku(msg: string, options?: Partial<DanmakuOptions>) {
    log('sendDanmaku()');

    const {
      attendee = true,
      castviewer = true,
      presenter = true,
    } = options || {};

    await api
      .request('sendTitle')
      .data({
        'display-text'   : msg,
        'all-attendee'   : attendee,
        'all-castviewer' : castviewer,
        'all-presenter'  : presenter,
      });
  }

  return {
    setDanmaku,
    sendDanmaku,
  };
}
