import debug from 'debug';
import { createEvents } from '../events';
import {
  ConferenceUser, MediaFilter, UserEndpoint, UserMedia,
} from './conference-info';
import { createReactive } from '../reactive';
import { Context } from './context';
import { createCameraCtrl } from './camera-ctrl';

const log = debug('MN:Information:User');

export interface FilterOptions {
  label: UserMedia['label']
  enable: boolean;
}

export function createUser(data: ConferenceUser, context: Context) {
  const { api, userId } = context;
  const events = createEvents(log);
  /* eslint-disable-next-line no-use-before-define */
  const reactive = createReactive(watch({}), events);
  /* eslint-disable-next-line no-use-before-define */
  const entity = getEntity();
  const camera = createCameraCtrl(api, entity);
  let user: any;

  function watch(target: any) {
    /* eslint-disable no-use-before-define */
    target.displayText = data['display-text'];

    target.role = getRole();

    target.hold = isOnHold();
    target.handup = isHandup();

    target.audio = !isAudioBlocked();
    target.video = !isVideoBlocked();

    target.media = hasMedia();
    target.sharing = isSharing();
    /* eslint-enable no-use-before-define */
    return target;
  }

  function update(diff?: ConferenceUser) {
    // fire status change events
    watch(reactive);
    events.emit('updated', user as User);
  }

  function getEntity() {
    return data.entity;
  }
  function getUID() {
    return data['subject-id'];
  }
  function getDisplayText() {
    return data['display-text'];
  }
  function getRole() {
    return data.roles && data.roles.role;
  }

  function isCurrent() {
    return entity === userId;
  }
  function isAttendee() {
    return getRole() === 'attendee';
  }
  function isPresenter() {
    return getRole() === 'presenter';
  }
  function isCastviewer() {
    return getRole() === 'castviewer';
  }
  function isOrganizer() {
    return getRole() === 'organizer';
  }

  function getEndpoint(type: UserEndpoint['session-type']) {
    return data.endpoint.find((ep) => ep['session-type'] === type);
  }
  function isOnHold() {
    const endpoint = getEndpoint('audio-video');
    return endpoint && endpoint.status === 'on-hold';
  }

  function hasFocus() {
    return !!getEndpoint('focus');
  }
  function hasMedia() {
    return !!getEndpoint('audio-video');
  }
  function hasSharing() {
    return !!getEndpoint('applicationsharing');
  }
  function hasFECC() {
    return !!getEndpoint('fecc');
  }

  function getMedia(label: UserMedia['label']) {
    const mediaList = data.endpoint.reduce((previous, current) => {
      return previous.concat(current.media || []);
    }, [] as UserMedia[]);
    return mediaList.find((m) => m.label === label);
  }
  function getMediaFilter(label: UserMedia['label']) {
    const media = getMedia(label);
    const {
      'media-ingress-filter': ingress = { type: 'block' } as MediaFilter,
      'media-egress-filter': egress = { type: 'block' } as MediaFilter,
    } = media || {};
    return {
      ingress : ingress.type,
      egress  : egress.type,
    };
  }
  function getAudioFilter() {
    return getMediaFilter('main-audio');
  }
  function getVideoFilter() {
    return getMediaFilter('main-video');
  }

  function isAudioBlocked() {
    const { ingress } = getAudioFilter();
    return ingress === 'block';
  }
  function isVideoBlocked() {
    const { ingress } = getVideoFilter();
    return ingress === 'block';
  }

  function isHandup() {
    const { ingress } = getAudioFilter();
    return ingress === 'unblocking';
  }
  function isSharing() {
    const media = getMedia('applicationsharing');
    return media && media.status === 'sendonly';
  }

  function isSIP() {
    return data.protocol.toLowerCase() === 'sip';
  }
  function isHTTP() {
    return data.protocol.toLowerCase() === 'http';
  }
  function isRTMP() {
    return data.protocol.toLowerCase() === 'rtmp';
  }

  // user ctrl

  async function setFilter(options: FilterOptions) {
    log('setFilter()');

    const { label, enable } = options;
    const endpoint = user.getEndpoint('audio-video');
    const media = user.getMedia(label);

    await api
      .request('setUserMedia')
      .data({
        'user-entity'          : entity,
        'endpoint-entity'      : endpoint.entity,
        'media-id'             : media.id,
        'media-ingress-filter' : enable ? 'unblock' : 'block',
      })
      .send();
  }

  async function setAudioFilter(enable: boolean) {
    log('setAudioFilter()');

    await setFilter({ label: 'main-audio', enable });
  }
  async function setVideoFilter(enable: boolean) {
    log('setVideoFilter()');

    await setFilter({ label: 'main-video', enable });
  }

  async function setDisplayText(displayText: string) {
    log('setDisplayText()');

    await api
      .request('setUserDisplayText')
      .data({
        'user-entity'  : entity,
        'display-text' : displayText,
      })
      .send();
  }

  async function setRole(role: 'attendee' | 'presenter') {
    log('setRole()');

    await api
      .request('setUserRole')
      .data({
        'user-entity' : entity,
        role,
      })
      .send();
  }

  async function setFocus(enable: boolean = true) {
    log('setFocus()');

    await api
      .request('setFocusVideo')
      .data({
        'user-entity' : enable ? entity : '',
      })
      .send();
  }

  async function getStats() {
    log('getStats()');

    await api
      .request('getStats')
      .data({ 'user-entity-list': [entity] })
      .send();
  }

  async function kick() {
    log('kick()');

    await api
      .request('deleteUser')
      .data({ 'user-entity': entity })
      .send();
  }

  async function hold() {
    log('hold()');

    await api
      .request('waitLobbyUser')
      .data({ 'user-entity': entity })
      .send();
  }
  async function unhold() {
    log('unhold()');

    await api
      .request('acceptLobbyUser')
      .data({ 'user-entity': entity })
      .send();
  }
  async function allow() {
    log('allow()');

    await api
      .request('acceptLobbyUser')
      .data({ 'user-entity': entity })
      .send();
  }

  async function accept() {
    log('accept()');

    await setAudioFilter(true);
  }
  async function reject() {
    log('reject()');

    await setAudioFilter(false);
  }

  function sendMessage(msg: string) {
    log('sendMessage()');
    log('TBD');
  }

  return user = {
    ...events,

    get data() {
      return data;
    },

    get(key: keyof ConferenceUser) {
      return data[key];
    },

    update,

    getEntity,
    getUID,
    getDisplayText,
    getRole,

    isCurrent,
    isAttendee,
    isPresenter,
    isCastviewer,
    isOrganizer,

    getEndpoint,
    isOnHold,

    hasFocus,
    hasMedia,
    hasSharing,
    hasFECC,

    getMedia,
    getAudioFilter,
    getVideoFilter,

    isAudioBlocked,
    isVideoBlocked,

    isHandup,
    isSharing,

    isSIP,
    isHTTP,
    isRTMP,

    // user ctrl
    setFilter,
    setAudioFilter,
    setVideoFilter,

    setDisplayText,
    setRole,
    setFocus,

    getStats,

    kick,

    hold,
    unhold,
    allow,

    accept,
    reject,

    sendMessage,

    // camera ctrl
    camera,
  };
}

export type User = ReturnType<typeof createUser>;
