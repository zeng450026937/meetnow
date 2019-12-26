import debug from 'debug';
import { createEvents } from '../events';
import { ConferenceRecordUsers } from './conference-info';
import { createReactive } from '../reactive';
import { createRecordCtrl } from './record-ctrl';
import { Context } from './context';

const log = debug('Meetnow:Information:Record');

export function createRecord(data: ConferenceRecordUsers, context: Context) {
  const { api } = context;
  const events = createEvents(log);
  /* eslint-disable-next-line no-use-before-define */
  const reactive = createReactive(watch({}), events);
  const ctrl = createRecordCtrl(api);
  let record;

  function watch(target) {
    /* eslint-disable no-use-before-define */
    target.status = getStatus();
    /* eslint-enable no-use-before-define */
    return target;
  }

  function update(diff?: ConferenceRecordUsers) {
    // fire status change events
    watch(reactive);
    events.emit('updated', record as Record);
  }

  function getUser() {
    return data.user;
  }

  function getStatus() {
    return getUser()['record-status'];
  }
  function getReason() {
    return getUser().reason;
  }
  function getDetail() {
    const userdata = getUser();
    const {
      'record-status': status,
      'record-last-start-time': lastStartTime,
      'record-last-stop-duration': lastStopDuration,
      reason,
    } = userdata;
    return {
      reason,
      status,
      lastStartTime,
      lastStopDuration,
    };
  }

  return record = {
    ...events,

    get data() {
      return data;
    },

    get(key: keyof ConferenceRecordUsers) {
      return data[key];
    },

    update,

    getStatus,
    getReason,
    getDetail,

    // record ctrl
    ...ctrl,
  };
}

export type Record = ReturnType<typeof createRecord>;
