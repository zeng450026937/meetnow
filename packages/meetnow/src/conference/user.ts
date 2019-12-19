import { Api } from '../api';
import { createEvents } from '../events';
import {
  ConferenceUser, MediaFilter, UserEndpoint, UserMedia,
} from './conference-info';
import { createReactive } from '../reactive';
import { mergeItem } from './merge';

export function createUser(data: ConferenceUser, api?: Api) {
  const events = createEvents();
  /* eslint-disable-next-line no-use-before-define */
  const reactive = createReactive(watch({}), events);
  let user;

  function watch(target) {
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

  function update(val?: ConferenceUser) {
    if (val) {
      data = mergeItem(data, val);
    }
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

  function getRole() {
    return data.roles && data.roles.role;
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
    getRole,

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
  };
}

export type User = ReturnType<typeof createUser>;
