import debug from 'debug';
import { createEvents } from '../events';
import { ConferenceDescription } from './conference-info';
import { createReactive } from '../reactive';
import { Context } from './context';

const log = debug('Meetnow:Information:Description');

export interface LockOptions {
  admissionPolicy: ConferenceDescription['admission-policy'];
  attendeeByPass?: boolean;
}

export function createDescription(data: ConferenceDescription, context: Context) {
  const { api } = context;
  const events = createEvents(log);
  /* eslint-disable-next-line no-use-before-define */
  const reactive = createReactive(watch({}), events);
  let description;

  function watch(target) {
    /* eslint-disable no-use-before-define */
    target.locked = isLocked();
    /* eslint-enable no-use-before-define */
    return target;
  }

  function update(diff?: ConferenceDescription) {
    // fire status change events
    watch(reactive);
    events.emit('updated', description as Description);
  }

  function getLock() {
    return {
      admissionPolicy : data['admission-policy'],
      attendeeByPass  : data['attendee-by-pass'],
    };
  }
  async function setLock(options: LockOptions) {
    log('setLock()');

    const { admissionPolicy, attendeeByPass = true } = options;

    await api
      .request('setLock')
      .data({
        'admission-policy'      : admissionPolicy,
        'attendee-lobby-bypass' : attendeeByPass,
      })
      .send();
  }

  async function lock(attendeeByPass: boolean = false, presenterOnly: boolean = true) {
    log('lock()');

    await setLock({
      admissionPolicy : presenterOnly ? 'closedAuthenticated' : 'openAuthenticated',
      attendeeByPass,
    });
  }
  async function unlock() {
    log('unlock()');

    await setLock({
      admissionPolicy : 'anonymous',
    });
  }

  function isLocked() {
    return getLock().admissionPolicy !== 'anonymous';
  }

  return description = {
    ...events,

    get data() {
      return data;
    },
    get subject() {
      return data.subject;
    },

    get(key: keyof ConferenceDescription) {
      return data[key];
    },

    update,

    getLock,
    setLock,

    lock,
    unlock,

    isLocked,
  };
}

export type Description = ReturnType<typeof createDescription>;
