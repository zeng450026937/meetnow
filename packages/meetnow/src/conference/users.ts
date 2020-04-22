import debug from 'debug';
import { createEvents, Events } from '../events';
import { ConferenceUser, ConferenceUsers } from './conference-info';
import { createUser, User } from './user';
import { createReactive } from '../reactive';
import { createLobbyCtrl, LobbyCtrl } from './lobby-ctrl';
import { Context } from './context';

export * from './user';

const log = debug('MN:Information:Users');

export interface InviteOptions {
  uid: string[];
  sipURL: string;
  h323URL: string;
}

export interface Users extends Events, LobbyCtrl {
  readonly data: ConferenceUsers,
  get: <T extends keyof ConferenceUsers>(key: T) => ConferenceUsers[T];
  update: (diff?: ConferenceUsers) => void;

  getUserList: (filter?: ((user?: User) => boolean)) => User[];

  getUser: (entity: string) => User | undefined;
  hasUser: (entity: string) => boolean;

  getCurrent: () => User | undefined;
  getAttendee: () => User[];
  getPresenter: () => User[];
  getCastviewer: () => User[];
  getOrganizer: () => User[];

  getOnhold: () => User[];
  getHandup: () => User[];

  getSharing: () => User[];
  getAudioBlocked: () => User[];
  getVideoBlocked: () => User[];

  getSIP: () => User[];
  getHTTP: () => User[];
  getRTMP: () => User[];

  invite: (option: Partial<InviteOptions>) => Promise<void>;
  kick: (entity: string) => Promise<void>;

  mute: () => Promise<void>;
  unmute: () => Promise<void>;
  reject: () => Promise<void>;
}

export function createUsers(data: ConferenceUsers, context: Context): Users {
  const { api } = context;
  const events = createEvents(log);
  const userMap = new Map<string, User>();

  let userList: User[];
  let users: any;

  /* eslint-disable-next-line no-use-before-define */
  const reactive = createReactive(watch({}), events);
  const lobby = createLobbyCtrl(api);

  function watch(target: any) {
    /* eslint-disable no-use-before-define */

    // update user list
    userList = data.user.map((userdata) => {
      const { entity } = userdata;
      let user = userMap.get(entity);
      if (!user) {
        user = createUser(userdata, context);
        userMap.set(entity, user);
      }
      return user;
    });

    /* eslint-enable no-use-before-define */
    return target;
  }


  function update(diff?: ConferenceUsers) {
    const added: ConferenceUser[] = [];
    const updated: ConferenceUser[] = [];
    const deleted: ConferenceUser[] = [];

    if (diff) {
      const { user } = diff;
      /* eslint-disable no-use-before-define */
      user.forEach((userdata) => {
        const { entity, state } = userdata;
        hasUser(entity)
          ? state === 'deleted'
            ? deleted.push(userdata)
            : updated.push(userdata)
          : added.push(userdata);
      });
      /* eslint-enable no-use-before-define */
    }
    // fire status change events
    watch(reactive);

    added.forEach((userdata) => {
      const { entity } = userdata;
      const user = userMap.get(entity)!;
      log('added user:\n\n %s(%s) \n', user.getDisplayText(), user.getEntity());
      users.emit('user:added', user);
    });
    updated.forEach((userdata) => {
      const { entity } = userdata;
      const user = userMap.get(entity)!;
      // user data is not proxied, so update it here
      // if user data is 'full', it will replace the old one
      user.update(userdata);
      log('updated user:\n\n %s(%s)  \n', user.getDisplayText(), user.getEntity());
      users.emit('user:updated', user);
    });
    deleted.forEach((userdata) => {
      const { entity } = userdata;
      const user = userMap.get(entity)!;
      log('deleted user:\n\n %s(%s)  \n', user.getDisplayText(), user.getEntity());
      users.emit('user:deleted', user);
      userMap.delete(entity);
    });

    // updated event must come after watch()
    // as user can access userlit via updated event
    events.emit('updated', users as Users);
  }

  function getUserList(filter?: (user?: User) => boolean) {
    return filter ? userList.filter(filter) : userList;
  }

  function getUser(entity: string) {
    return userMap.get(entity);
  }
  function hasUser(entity: string) {
    return userMap.has(entity);
  }

  function getCurrent() {
    return userList.find((user) => user.isCurrent());
  }
  function getAttendee() {
    return userList.filter((user) => user.isAttendee() && !user.isOnHold());
  }
  function getPresenter() {
    return userList.filter((user) => user.isPresenter());
  }
  function getCastviewer() {
    return userList.filter((user) => user.isCastviewer());
  }
  function getOrganizer() {
    return userList.filter((user) => user.isOrganizer());
  }

  function getOnhold() {
    return userList.filter((user) => user.isOnHold());
  }
  function getHandup() {
    return userList.filter((user) => user.isHandup());
  }

  function getSharing() {
    return userList.filter((user) => user.isSharing());
  }

  function getAudioBlocked() {
    return userList.filter((user) => user.isAudioBlocked());
  }
  function getVideoBlocked() {
    return userList.filter((user) => user.isVideoBlocked());
  }

  function getSIP() {
    return userList.filter((user) => user.isSIP());
  }
  function getHTTP() {
    return userList.filter((user) => user.isHTTP());
  }
  function getRTMP() {
    return userList.filter((user) => user.isRTMP());
  }


  async function invite(option: Partial<InviteOptions>) {
    log('invite');

    await api
      .request('inviteUser')
      .data({
        uid        : option.uid,
        'sip-url'  : option.sipURL,
        'h323-url' : option.h323URL,
      });
  }
  async function kick(entity: string) {
    log('kick');

    await api
      .request('deleteUser')
      .data({ 'user-entity': entity })
      .send();
  }

  async function mute() {
    log('mute');

    await api
      .request('muteAll')
      .send();
  }
  async function unmute() {
    log('unmute');

    await api
      .request('unmuteAll')
      .send();
  }
  async function reject() {
    log('reject');

    await api
      .request('rejectHandupAll')
      .send();
  }

  return users = {
    ...events,

    get data() {
      return data;
    },

    get(key: keyof ConferenceUsers) {
      return data[key];
    },

    ...lobby,

    update,

    getUserList,

    getUser,
    hasUser,

    getCurrent,
    getAttendee,
    getPresenter,
    getCastviewer,
    getOrganizer,

    getOnhold,
    getHandup,

    getSharing,
    getAudioBlocked,
    getVideoBlocked,

    getSIP,
    getHTTP,
    getRTMP,

    invite,
    kick,

    mute,
    unmute,
    reject,
  };
}
