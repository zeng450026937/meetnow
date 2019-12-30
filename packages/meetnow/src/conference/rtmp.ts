import debug from 'debug';
import { createEvents } from '../events';
import { ConferenceRTMPUsers } from './conference-info';
import { createReactive } from '../reactive';
import { createRTMPCtrl } from './rtmp-ctrl';
import { Context } from './context';

const log = debug('MN:Information:RTMP');

export function createRTMP(data: ConferenceRTMPUsers, context: Context) {
  const { api } = context;
  const events = createEvents(log);
  /* eslint-disable-next-line no-use-before-define */
  const reactive = createReactive(watch({}), events);
  const ctrl = createRTMPCtrl(api);
  let rtmp;

  function watch(target) {
    /* eslint-disable no-use-before-define */
    target.enable = data['rtmp-enable'];
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

  function getStatus(entity?: string) {
    return getUser(entity)['rtmp-status'];
  }
  function getReason(entity?: string) {
    return getUser(entity).reason;
  }
  function getDetail(entity?: string) {
    const userdata = getUser(entity);
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

    getStatus,
    getReason,
    getDetail,

    // rtmp ctrl
    ...ctrl,
  };
}

export type RTMP = ReturnType<typeof createRTMP>;
