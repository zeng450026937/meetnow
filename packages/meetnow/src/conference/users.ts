import { createEvents } from '../events';
import { ConferenceUser, ConferenceUsers } from './conference-info';
import { createUser, User } from './user';
import { createReactive } from '../reactive';
import { Context } from './context';

export function createUsers(data: ConferenceUsers, context: Context) {
  const events = createEvents();
  const userMap = new Map<string, User>();
  /* eslint-disable-next-line no-use-before-define */
  const reactive = createReactive(watch({}), events);
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

  function getUserList() {
    return userList;
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

  return users = {
    ...events,

    get data() {
      return data;
    },

    get(key: keyof ConferenceUsers) {
      return data[key];
    },

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
  };
}

export type Users = ReturnType<typeof createUsers>;
