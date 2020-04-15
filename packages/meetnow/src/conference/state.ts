import debug from 'debug';
import { createEvents } from '../events';
import { ConferenceState } from './conference-info';
import { createReactive } from '../reactive';
import { Context } from './context';

const log = debug('MN:Information:State');

export function createState(data: ConferenceState, context: Context) {
  const events = createEvents(log);
  /* eslint-disable-next-line no-use-before-define */
  const reactive = createReactive(watch({}), events);
  let description: any;

  function watch(target: any) {
    const {
      active,
      locked,
    } = data;
    /* eslint-disable no-use-before-define */
    target.active = active;
    target.locked = locked;
    target.sharingUserEntity = getSharingUserEntity();
    target.speechUserEntity = getSpeechUserEntity();
    /* eslint-enable no-use-before-define */
    return target;
  }

  function update(diff?: ConferenceState) {
    // fire status change events
    watch(reactive);
    events.emit('updated', description as State);
  }

  function getSharingUserEntity() {
    const { applicationsharer } = data;
    return applicationsharer.user && applicationsharer.user.entity;
  }
  function getSpeechUserEntity() {
    const { 'speech-user-entity': speechUserEntity } = data;
    return speechUserEntity;
  }

  function getSharingType() {
    const { applicationsharer } = data;
    return applicationsharer.user && applicationsharer.user['share-type'];
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

    getSharingUserEntity,
    getSpeechUserEntity,

    getSharingType,
  };
}

export type State = ReturnType<typeof createState>;
