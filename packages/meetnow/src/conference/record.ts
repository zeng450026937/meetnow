import debug from 'debug';
import { createEvents, Events } from '../events';
import { ConferenceRecordUser, ConferenceRecordUsers } from './conference-info';
import { createReactive } from '../reactive';
import { createRecordCtrl, RecordCtrl } from './record-ctrl';
import { Context } from './context';

export { ConferenceRecordUser, ConferenceRecordUsers };

const log = debug('MN:Information:Record');

export interface Record extends Events, RecordCtrl {
  readonly data: ConferenceRecordUsers,
  get: <T extends keyof ConferenceRecordUsers>(key: T) => ConferenceRecordUsers[T];
  update: (diff?: ConferenceRecordUsers) => void;

  getStatus: () => ConferenceRecordUser['record-status'];
  getReason: () => ConferenceRecordUser['reason'];
  getDetail: () => {
    reason: ConferenceRecordUser['reason'];
    status: ConferenceRecordUser['record-status'];
    lastStartTime: ConferenceRecordUser['record-last-start-time'];
    lastStopDuration: ConferenceRecordUser['record-last-stop-duration'];
  };
}

export function createRecord(data: ConferenceRecordUsers, context: Context): Record {
  const { api } = context;
  const events = createEvents(log);
  /* eslint-disable-next-line no-use-before-define */
  const reactive = createReactive(watch({}), events);
  const ctrl = createRecordCtrl(api);
  let record: any;

  function watch(target: any) {
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
