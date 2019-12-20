import { Api } from '../api';
import { EntityState } from './conference-info';
import { createLayoutCtrl } from './layout-ctrl';

export function createLayout(data: EntityState, api: Api) {
  const ctrl = createLayoutCtrl(api);

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

export type Layout = ReturnType<typeof createLayout>;
