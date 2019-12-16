import { createEvents } from '../events';

export interface User {
  isShareAvariable: () => boolean;
  isCurrentUser: () => boolean;
  isOrganizer: () => boolean;
  isForwarder: () => boolean;

  setFilter: () => Promise<void>;
  setAudioFilter: () => Promise<void>;
  setVideoFilter: () => Promise<void>;
  setPermission: () => Promise<void>;
  setDemonstrator: () => Promise<void>;
  setPresenterDemonstrator: () => Promise<void>;
}

export function createUser(data: object) {
  const events = createEvents();
  let user;

  function update(val: object) {
    data = val;
    events.emit('updated', user);
  }

  return user = {
    ...events,
    update,
  };
}
