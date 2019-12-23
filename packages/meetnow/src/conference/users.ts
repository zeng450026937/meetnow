import { createEvents } from '../events';
import { ConferenceUser, ConferenceUsers } from './conference-info';
import { createUser, User } from './user';
import { createReactive } from '../reactive';
import { createLobbyCtrl } from './lobby-ctrl';
import { Context } from './context';

export interface InviteOptions {
  uid: string[];
  sipURL: string;
  h323URL: string;
}

export function createUsers(data: ConferenceUsers, context: Context) {
  const { api } = context;
  const events = createEvents();
  const userMap = new Map<string, User>();
  /* eslint-disable-next-line no-use-before-define */
  const reactive = createReactive(watch({}), events);
  const lobby = createLobbyCtrl(api);
  let userList: User[];
  let users;

  function watch(target) {
    /* eslint-disable no-use-before-define */

    // update user list
    userList = data.user.map((userdata) => {
      const { entity } = userdata;
      let user = userMap.get(entity);
      if (user) {
        user.update(userdata);
      } else {
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
      /* eslint-disable no-use-before-define */
      diff.user.forEach((userdata) => {
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
      users.emit('user:added', userMap.get(entity));
    });
    updated.forEach((userdata) => {
      const { entity } = userdata;
      const user = userMap.get(entity);
      user.update();
      users.emit('user:updated', user);
    });
    deleted.forEach((userdata) => {
      const { entity } = userdata;
      users.emit('user:deleted', userMap.get(entity));
      userMap.delete(entity);
    });

    // updated event must come after watch()
    // as user can access userlit via updated event
    events.emit('updated', users as Users);
  }

  function getUserList(filter?: (user?: User) => boolean) {
    return userList.filter(filter || (() => true));
  }

  function getUser(entity: string) {
    return userMap.get(entity);
  }
  function hasUser(entity: string) {
    return userMap.has(entity);
  }

  function getAttendee() {
    return userList.filter((user) => user.isAttendee());
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
    await api
      .request('inviteUser')
      .data({
        uid        : option.uid,
        'sip-url'  : option.sipURL,
        'h323-url' : option.h323URL,
      });
  }
  async function kick(entity: string) {
    await api
      .request('deleteUser')
      .data({ 'user-entity': entity })
      .send();
  }

  async function mute() {
    await api
      .request('muteAll')
      .send();
  }
  async function unmute() {
    await api
      .request('unmuteAll')
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
  };
}

export type Users = ReturnType<typeof createUsers>;
