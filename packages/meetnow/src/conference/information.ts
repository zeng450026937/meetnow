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
  const { api } = context;

  function createdata<T extends keyof ConferenceInformation>(datakey: T) {
    return new Proxy({}, {
      get(target: object, key: string | symbol) {
        const delegate = data[datakey];
        return delegate && Reflect.get(delegate, key);
      },
    }) as ConferenceInformation[T];
  }

  // create information parts
  const description = createDescription(createdata('conference-description')!, context);
  const state = createState(createdata('conference-state')!, context);
  const view = createView(createdata('conference-view')!, context);
  const users = createUsers(createdata('users')!, context);
  const rtmp = createRTMP(createdata('rtmp-state')!, context);
  const record = createRecord(createdata('record-users')!, context);

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

      api
        .request('getFullInfo')
        .send()
        .then((response) => update(response.data.data as ConferenceInformation))
        .catch((error) => log('get full information failed: %o', error));

      return;
    }
    if (newState === 'deleted') {
      log('can not delete root information.');
      return;
    }
    if (newState === 'full') {
      // hack item state
      // as we want to keep 'data' reference to the same object
      // otherwise we need to re-create all information parts
      Object.assign(data, val);
    } else {
      mergeItem(data, val)!;
    }

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
