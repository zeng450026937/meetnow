import { createEvents } from '../events';
import { ConferenceRTMPUsers } from './conference-info';
import { createReactive } from '../reactive';
import { mergeItem } from './merge';

export function createRTMP(data: ConferenceRTMPUsers) {
  const events = createEvents();
  /* eslint-disable-next-line no-use-before-define */
  const reactive = createReactive(watch({}), events);
  let rtmp;

  function watch(target) {
    /* eslint-disable no-use-before-define */
    target.enable = data['rtmp-enable'];
    target.status = getStatus();
    /* eslint-enable no-use-before-define */
    return target;
  }

  function update(val?: ConferenceRTMPUsers) {
    if (val) {
      data = mergeItem(data, val);
    }
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

    getUser,
    getStatus,
    getReason,
    getDetail,
  };
}

export type RTMP = ReturnType<typeof createRTMP>;
