import { createEvents } from '../events';
import { ConferenceDescription } from './conference-info';
import { createReactive } from '../reactive';
import { Context } from './context';

export interface LockOptions {
  policy: ConferenceDescription['admission-policy'];
  attendeeByPass?: boolean;
}

export function createDescription(data: ConferenceDescription, context: Context) {
  const { api } = context;
  const events = createEvents();
  /* eslint-disable-next-line no-use-before-define */
  const reactive = createReactive(watch({}), events);
  let description;

  function watch(target) {
    /* eslint-disable no-use-before-define */
    target.lock = isLocked();
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
      policy         : data['admission-policy'],
      attendeeByPass : data['attendee-by-pass'],
    };
  }
  async function setLock(options: LockOptions) {
    const { policy, attendeeByPass = true } = options;

    await api
      .request('setLock')
      .data({
        'admission-policy'      : policy,
        'attendee-lobby-bypass' : attendeeByPass,
      })
      .send();
  }

  async function lock(attendeeByPass: boolean = false, presenterOnly: boolean = true) {
    await setLock({
      policy : presenterOnly ? 'closedAuthenticated' : 'openAuthenticated',
      attendeeByPass,
    });
  }
  async function unlock() {
    await setLock({
      policy : 'anonymous',
    });
  }

  function isLocked() {
    return getLock().policy !== 'anonymous';
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
