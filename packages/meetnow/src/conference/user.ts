
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

export function createUser() {}
