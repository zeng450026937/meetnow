import { createEvents } from '../events';
import { ConferenceUsers } from './conference-info';
import { createUser, User } from './user';
import { createReactive } from '../reactive';
import { mergeItem } from './merge';

export function createUsers(data: ConferenceUsers) {
  const events = createEvents();
  const userMap = new Map<string, User>();
  /* eslint-disable-next-line no-use-before-define */
  const reactive = createReactive(watch({}), events);
  let userList: User[];
  let users;

  const added: string[] = [];
  const updated: string[] = [];
  const deleted: string[] = [];

  function watch(target) {
    /* eslint-disable no-use-before-define */

    // update user list
    userList = data.user.map((userdata) => {
      const { entity } = userdata;
      let user = userMap.get(entity);
      if (user) {
        user.update(userdata);
      } else {
        user = createUser(userdata);
        userMap.set(entity, user);
      }
      return user;
    });

    /* eslint-enable no-use-before-define */
    return target;
  }

  function clear() {
    added.length = 0;
    updated.length = 0;
    deleted.length = 0;
  }

  function update(val?: ConferenceUsers) {
    if (val) {
      /* eslint-disable no-use-before-define */
      val.user.forEach((userdata) => {
        const { entity, state } = userdata;
        hasUser(entity)
          ? state === 'deleted'
            ? deleted.push(entity)
            : updated.push(entity)
          : added.push(entity);
      });
      /* eslint-enable no-use-before-define */

      data = mergeItem(data, val);
    }
    // fire status change events
    watch(reactive);

    added.forEach((entity) => {
      users.emit('user:added', userMap.get(entity));
    });
    updated.forEach((entity) => {
      const user = userMap.get(entity);
      user.update();
      users.emit('user:updated', user);
    });
    deleted.forEach((entity) => {
      users.emit('user:deleted', userMap.get(entity));
      userMap.delete(entity);
    });

    console.log('added', added);
    console.log('updated', updated);
    console.log('deleted', deleted);

    clear();

    // updated event must come after watch()
    // as user can access userlit via updated event
    events.emit('updated', users as Users);
  }

  function check(val: ConferenceUsers) {
    clear();

    /* eslint-disable no-use-before-define */
    val.user.forEach((userdata) => {
      const { entity, state } = userdata;
      hasUser(entity)
        ? state === 'deleted'
          ? deleted.push(entity)
          : updated.push(entity)
        : added.push(entity);
    });
    /* eslint-enable no-use-before-define */
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

    check,
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
