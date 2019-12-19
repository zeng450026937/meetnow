import { createEvents } from '../events';
import { ConferenceDescription } from './conference-info';
import { createReactive } from '../reactive';

export function createDescription(data: ConferenceDescription) {
  const events = createEvents();
  /* eslint-disable-next-line no-use-before-define */
  const reactive = createReactive(watch({}), events);
  let description;

  function watch(target) {
    /* eslint-disable no-use-before-define */
    /* eslint-enable no-use-before-define */
    return target;
  }

  function update(diff?: ConferenceDescription) {
    // fire status change events
    watch(reactive);
    events.emit('updated', description as Description);
  }

  return description = {
    ...events,

    get data() {
      return data;
    },

    get(key: keyof ConferenceDescription) {
      return data[key];
    },

    update,
  };
}

export type Description = ReturnType<typeof createDescription>;
