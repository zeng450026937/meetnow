import { Api } from '../api';
import { EntityState } from './conference-info';
import { createLobbyCtrl } from './lobby-ctrl';

export function createLobby(data: EntityState, api: Api) {
  const ctrl = createLobbyCtrl(api);

  return {
    ...ctrl,

    get data() {
      return data;
    },

    get(key: keyof EntityState) {
      return data[key];
    },
  };
}
