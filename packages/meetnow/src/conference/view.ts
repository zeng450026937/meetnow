import { createEvents } from '../events';
import { ConferenceView } from './conference-info';
import { createReactive } from '../reactive';
import { Context } from './context';

export function createView(data: ConferenceView, context: Context) {
  const events = createEvents();
  /* eslint-disable-next-line no-use-before-define */
  const reactive = createReactive(watch({}), events);
  let view;

  function watch(target) {
    /* eslint-disable no-use-before-define */
    target.focusUserEntity = getFocusUserEntity();
    /* eslint-enable no-use-before-define */
    return target;
  }

  function update(diff?: ConferenceView) {
    // fire status change events
    watch(reactive);
    events.emit('updated', view as View);
  }

  function getVideoView() {
    return data['entity-view'].find((view) => view.entity === 'audio-video');
  }
  function getLayout() {
    return getVideoView()['entity-state'];
  }
  function getFocusUserEntity() {
    return getLayout()['focus-video-user-entity'];
  }
  function getDanmaku() {
    return getVideoView().title;
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

    getVideoView,
    getLayout,
    getFocusUserEntity,
    getDanmaku,
  };
}

export type View = ReturnType<typeof createView>;
