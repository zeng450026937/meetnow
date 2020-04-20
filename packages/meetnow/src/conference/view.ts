import debug from 'debug';
import { createEvents, Events } from '../events';
import { ConferenceView, EntityState, EntityView } from './conference-info';
import { createReactive } from '../reactive';
import { createLayoutCtrl, LayoutCtrl } from './layout-ctrl';
import { createDanmakuCtrl, DanmakuCtrl } from './danmaku-ctrl';
import { Context } from './context';

export { ConferenceView };

const log = debug('MN:Information:View');

export interface View extends Events, DanmakuCtrl, LayoutCtrl {
  readonly data: ConferenceView,
  get: <T extends keyof ConferenceView>(key: T) => ConferenceView[T];
  update: (diff?: ConferenceView) => void;

  getVideoView: () => EntityView | undefined;
  getLayout: () => EntityState | undefined;
  getFocusUserEntity: () => EntityState['focus-video-user-entity'],
  getDanmaku: () => EntityView['title'],
}

export function createView(data: ConferenceView, context: Context): View {
  const { api } = context;
  const events = createEvents(log);
  /* eslint-disable-next-line no-use-before-define */
  const reactive = createReactive(watch({}), events);
  const layout = createLayoutCtrl(api);
  const danmaku = createDanmakuCtrl(api);
  let view: any;

  function watch(target: any) {
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
    return getVideoView()!['entity-state'];
  }
  function getFocusUserEntity() {
    return getLayout()!['focus-video-user-entity'];
  }
  function getDanmaku() {
    return getVideoView()!.title;
  }

  return view = {
    ...events,

    get data() {
      return data;
    },

    get(key: keyof ConferenceView) {
      return data[key];
    },

    ...layout,
    ...danmaku,

    update,

    getVideoView,
    getLayout,
    getFocusUserEntity,
    getDanmaku,
  };
}
