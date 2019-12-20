import { createEvents } from '../events';
import { mergeItem } from './merge';
import { createDescription } from './description';
import { createState } from './state';
import { createView } from './view';
import { createUsers } from './users';
import { ConferenceInformation } from './conference-info';
import { hasOwn } from '../utils';
import { Api } from '../api';

export interface InformationConfigs {
  api: Api;
  uuid: string; // coference uuid
  userId: string; // conference userId
}

export function createInformation(data: ConferenceInformation, config?: InformationConfigs) {
  const events = createEvents();
  const {
    'conference-descriotion': descriptiondata,
    'conference-state': statedata,
    'conference-view': viewdata,
    users: usersdata,
  } = data;
  // create information parts
  const descriotion = createDescription(descriptiondata);
  const state = createState(statedata);
  const view = createView(viewdata);
  const users = createUsers(usersdata);

  let information;

  function update(val: ConferenceInformation) {
    const { version } = data;
    const { version: newVersion, state: newState } = val;

    if (!newVersion) {
      console.warn('internal error');
      debugger;
      return;
    }
    if (newVersion <= version) {
      console.warn('internal error');
      debugger;
      return;
    }
    if (newVersion - version > 1) {
      console.warn('internal error');
      debugger;
      return;
    }
    if (newState === 'deleted') {
      // can not delete root information
      console.warn('internal error');
      debugger;
      return;
    }

    data = mergeItem(data, val);

    // update & prepare all parts
    if (hasOwn(val, 'conference-descriotion')) {
      descriotion.update();
    }
    if (hasOwn(val, 'conference-state')) {
      state.update();
    }
    if (hasOwn(val, 'conference-view')) {
      view.update();
    }
    if (hasOwn(val, 'users')) {
      users.update(val.users);
    }

    events.emit('updated', information as Information);
  }

  return information = {
    ...events,

    get data() {
      return data;
    },
    get version() {
      return data && data.version;
    },

    get descriotion() {
      return descriotion;
    },
    get state() {
      return state;
    },
    get view() {
      return view;
    },
    get users() {
      return users;
    },

    update,
  };
}

export type Information = ReturnType<typeof createInformation>;
