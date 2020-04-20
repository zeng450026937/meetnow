import debug from 'debug';
import { createEvents, Events } from '../events';
import { ConferenceRTMPUser, ConferenceRTMPUsers } from './conference-info';
import { createReactive } from '../reactive';
import { createRTMPCtrl, RTMPCtrl } from './rtmp-ctrl';
import { Context } from './context';

export { ConferenceRTMPUser, ConferenceRTMPUsers };

const log = debug('MN:Information:RTMP');

export interface RTMP extends Events, RTMPCtrl {
  readonly data: ConferenceRTMPUsers,
  get: <T extends keyof ConferenceRTMPUsers>(key: T) => ConferenceRTMPUsers[T];
  update: (diff?: ConferenceRTMPUsers) => void;

  getEnable: () => ConferenceRTMPUsers['rtmp-enable'];
  getStatus: () => ConferenceRTMPUser['rtmp-status'] | undefined;
  getReason: () => ConferenceRTMPUser['reason'] | undefined;
  getDetail: () => {
    reason: ConferenceRTMPUser['reason'];
    status: ConferenceRTMPUser['rtmp-status'];
    lastStartTime: ConferenceRTMPUser['rtmp-last-start-time'];
    lastStopDuration: ConferenceRTMPUser['rtmp-last-stop-duration'];
  } | undefined;
}

export function createRTMP(data: ConferenceRTMPUsers, context: Context): RTMP {
  const { api } = context;
  const events = createEvents(log);
  /* eslint-disable-next-line no-use-before-define */
  const reactive = createReactive(watch({}), events);
  const ctrl = createRTMPCtrl(api);
  let rtmp: any;

  function watch(target: any) {
    /* eslint-disable no-use-before-define */
    target.enable = getEnable();
    target.status = getStatus();
    /* eslint-enable no-use-before-define */
    return target;
  }

  function update(diff?: ConferenceRTMPUsers) {
    // fire status change events
    watch(reactive);
    events.emit('updated', rtmp as RTMP);
  }

  function getUser(entity?: string) {
    return entity
      ? data.users.find((userdata) => userdata.entity === entity)
      : data.users.find((userdata) => userdata.default) || data.users[0];
  }

  function getEnable() {
    return data['rtmp-enable'];
  }
  function getStatus(entity?: string) {
    const userdata = getUser(entity);
    return userdata && userdata['rtmp-status'];
  }
  function getReason(entity?: string) {
    const userdata = getUser(entity);
    return userdata && userdata.reason;
  }
  function getDetail(entity?: string) {
    const userdata = getUser(entity);
    if (!userdata) return undefined;
    const {
      'rtmp-status': status,
      'rtmp-last-start-time': lastStartTime,
      'rtmp-last-stop-duration': lastStopDuration,
      reason,
    } = userdata;
    return {
      reason,
      status,
      lastStartTime,
      lastStopDuration,
    };
  }

  return rtmp = {
    ...events,

    get data() {
      return data;
    },

    get(key: keyof ConferenceRTMPUsers) {
      return data[key];
    },

    update,

    getEnable,
    getStatus,
    getReason,
    getDetail,

    // rtmp ctrl
    ...ctrl,
  };
}
