import { createEvents } from '../events';
import { ConferenceState } from './conference-info';
import { createReactive } from '../reactive';
import { mergeItem } from './merge';

export function createState(data: ConferenceState) {
  const events = createEvents();
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

  function update(val?: ConferenceState) {
    if (val) {
      data = mergeItem(data, val);
    }
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
