import debug from 'debug';
import { createEvents } from '../events';
import { createDescription, Description } from './description';
import { createState, State } from './state';
import { createView, View } from './view';
import { createUsers, User, Users } from './users';
import { createRTMP } from './rtmp';
import { createRecord } from './record';
import { mergeItem } from './merge';
import { hasOwn } from '../utils';
import { Context } from './context';
import { ConferenceInformation } from './conference-info';

export {
  Description, State, View, Users, User,
};

const log = debug('MN:Information');

export function createInformation(data: ConferenceInformation, context: Context) {
  const events = createEvents(log);
  const {
    'conference-description': descriptiondata,
    'conference-state': statedata,
    'conference-view': viewdata,
    users: usersdata,
    'rtmp-state': rtmpdata,
    'record-users': recorddata,
  } = data;

  // create information parts
  const description = createDescription(descriptiondata, context);
  const state = createState(statedata, context);
  const view = createView(viewdata, context);
  const users = createUsers(usersdata, context);
  const rtmp = createRTMP(rtmpdata, context);
  const record = createRecord(recorddata, context);

  let information;

  function update(val: ConferenceInformation) {
    log('update()');

    const { version } = data;
    const { version: newVersion, state: newState } = val;

    if (!newVersion) {
      log('receive information without version.');
      return;
    }
    if (newVersion <= version) {
      log('receive information with invalid version.');
      return;
    }
    if (newVersion - version > 1) {
      log('information version jumped.');
      // TODO
      // get full information
      return;
    }
    if (newState === 'deleted') {
      log('can not delete root information.');
      return;
    }

    data = mergeItem(data, val);

    // update & prepare all parts
    [
      {
        key  : 'conference-description',
        part : description,
      },
      {
        key  : 'conference-state',
        part : state,
      },
      {
        key  : 'conference-view',
        part : view,
      },
      {
        key  : 'users',
        part : users,
      },
      {
        key  : 'rtmp-state',
        part : rtmp,
      },
      {
        key  : 'record-users',
        part : record,
      },
    ].forEach((parts) => {
      const { key, part } = parts;
      if (hasOwn(val, key)) {
        part.update(val[key]);
      }
    });

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

    get(key: keyof ConferenceInformation) {
      return data[key];
    },

    get description() {
      return description;
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
    get rtmp() {
      return rtmp;
    },
    get record() {
      return record;
    },

    update,
  };
}

export type Information = ReturnType<typeof createInformation>;
