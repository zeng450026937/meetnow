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

export interface InformationParts<T extends keyof ConferenceInformation, P> {
  key: T;
  delegate: P;
  create: (data: ConferenceInformation[T], context: Context) => P;
}

export function createInformation(data: ConferenceInformation, context: Context) {
  const events = createEvents();
  const {
    'conference-descriotion': descriptiondata,
    'conference-state': statedata,
    'conference-view': viewdata,
    users: usersdata,
    'rtmp-state': rtmpdata,
    'record-users': recorddata,
  } = data;
  const parts = [
    {
      key     : 'conference-descriotion',
      creator : (partsdata) => createDescription(partsdata, context),
    },
    {
      key     : 'conference-state',
      creator : (partsdata) => createState(partsdata, context),
    },
    {
      key     : 'conference-view',
      creator : (partsdata) => createView(partsdata, context),
    },
    {
      key     : 'users',
      creator : (partsdata) => createUsers(partsdata, context),
    },
    {
      key     : 'rtmp-state',
      creator : (partsdata) => createRTMP(partsdata, context),
    },
    {
      key     : 'record-users',
      creator : (partsdata) => createRecord(partsdata, context),
    },
  ].map((part) => {
    const { key, creator } = part;
    const delegate = creator(data[key]);
    return {
      key,
      delegate,
    };
  });
  // create information parts
  const descriotion = createDescription(descriptiondata, context);
  const state = createState(statedata, context);
  const view = createView(viewdata, context);
  const users = createUsers(usersdata, context);
  const rtmp = createRTMP(rtmpdata, context);
  const record = createRecord(recorddata, context);

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
    [
      {
        key      : 'conference-descriotion',
        delegate : descriotion,
      },
      {
        key      : 'conference-state',
        delegate : state,
      },
      {
        key      : 'conference-view',
        delegate : view,
      },
      {
        key      : 'users',
        delegate : users,
      },
      {
        key      : 'rtmp-state',
        delegate : rtmp,
      },
    ].forEach((parts) => {
      const { key, delegate } = parts;
      if (hasOwn(val, key)) {
        delegate.update(val[key]);
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
