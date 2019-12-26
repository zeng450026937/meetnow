import debug from 'debug';
import { createEvents } from '../events';
import { ConferenceState } from './conference-info';
import { createReactive } from '../reactive';
import { Context } from './context';

const log = debug('Meetnow:Information:State');

export function createState(data: ConferenceState, context: Context) {
  const events = createEvents(log);
  /* eslint-disable-next-line no-use-before-define */
  const reactive = createReactive(watch({}), events);
  let description;

  function watch(target) {
    const {
      active,
      locked,
      applicationsharer,
      'speech-user-entity': speechUserEntity,
    } = data;
    /* eslint-disable no-use-before-define */
    target.active = active;
    target.locked = locked;
    target.sharingUserEntity = applicationsharer.user && applicationsharer.user.entity;
    target.speechUserEntity = speechUserEntity;
    /* eslint-enable no-use-before-define */
    return target;
  }

  function update(diff?: ConferenceState) {
    // fire status change events
    watch(reactive);
    events.emit('updated', description as State);
  }

  return description = {
    ...events,

    get data() {
      return data;
    },

    get(key: keyof ConferenceState) {
      return data[key];
    },

    update,
  };
}

export type State = ReturnType<typeof createState>;
