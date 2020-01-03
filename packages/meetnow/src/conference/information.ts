import debug from 'debug';
import { createEvents } from '../events';
import { createDescription } from './description';
import { createState } from './state';
import { createView } from './view';
import { createUsers } from './users';
import { createRTMP } from './rtmp';
import { createRecord } from './record';
import { mergeItem } from './merge';
import { hasOwn } from '../utils';
import { Context } from './context';
import { ConferenceInformation } from './conference-info';

export * from './description';
export * from './state';
export * from './view';
export * from './users';
export * from './rtmp';
export * from './record';

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
  const description = createDescription(descriptiondata!, context);
  const state = createState(statedata!, context);
  const view = createView(viewdata!, context);
  const users = createUsers(usersdata!, context);
  const rtmp = createRTMP(rtmpdata!, context);
  const record = createRecord(recorddata!, context);

  let information: any;

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
    if (newState === 'full') {
      // hack item state
      // as we want to keep 'data' reference to the same object
      // otherwise we need to recreate all information parts
      val.state = 'partial';
    }

    data = mergeItem(data, val)!;

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
