import { createEvents } from '../events';
import { ConferenceView, EntityState } from './conference-info';
import { createReactive } from '../reactive';

export function createView(data: ConferenceView) {
  const events = createEvents();
  /* eslint-disable-next-line no-use-before-define */
  const reactive = createReactive(watch({}), events);
  let layout: EntityState;
  let view;

  function watch(target) {
    /* eslint-disable no-use-before-define */
    layout = getLayout();
    target.focusUserEntity = layout && layout['focus-video-user-entity'];
    /* eslint-enable no-use-before-define */
    return target;
  }

  function update(diff?: ConferenceView) {
    // fire status change events
    watch(reactive);
    events.emit('updated', view as View);
  }

  function getLayout() {
    const view = data['entity-view'].find((view) => view.entity === 'audio-video');
    return view && view['entity-state'];
  }

  return view = {
    ...events,

    get data() {
      return data;
    },

    get(key: keyof ConferenceView) {
      return data[key];
    },

    update,

    getLayout,
  };
}

export type View = ReturnType<typeof createView>;
