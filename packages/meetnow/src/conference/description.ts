import debug from 'debug';
import { createEvents, Events } from '../events';
import { ConferenceDescription } from './conference-info';
import { createReactive } from '../reactive';
import { Context } from './context';

export { ConferenceDescription };

const log = debug('MN:Information:Description');

export interface LockOptions {
  admissionPolicy: ConferenceDescription['admission-policy'];
  attendeeByPass?: boolean;
}

export interface Description extends Events {
  readonly data: ConferenceDescription,
  readonly subject: ConferenceDescription['subject'],
  get: <T extends keyof ConferenceDescription>(key: T) => ConferenceDescription[T];
  update: (diff?: ConferenceDescription) => void;

  getLock: () => LockOptions;
  setLock: (options: LockOptions) => Promise<void>;

  lock: (attendeeByPass?: boolean, presenterOnly?: boolean) => Promise<void>;
  unlock: () => Promise<void>;

  isLocked: () => boolean;
}

export function createDescription(data: ConferenceDescription, context: Context): Description {
  const { api } = context;
  const events = createEvents(log);
  /* eslint-disable-next-line no-use-before-define */
  const reactive = createReactive(watch({}), events);
  let description: any;

  function watch(target: any) {
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
    } as LockOptions;
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
