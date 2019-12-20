import { Api } from '../api';
import { UserMedia } from './conference-info';
import { User } from './user';

export interface FilterOptions {
  label: UserMedia['label']
  enable: boolean;
}

export function createUserCtrl(user: User, api: Api) {
  const entity = user.getEntity();

  async function setFilter(options: FilterOptions) {
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
    await setFilter({ label: 'main-audio', enable });
  }
  async function setVideoFilter(enable: boolean) {
    await setFilter({ label: 'main-video', enable });
  }

  async function setDisplayText(displayText: string) {
    await api
      .request('setUserDisplayText')
      .data({
        'user-entity'  : entity,
        'display-text' : displayText,
      })
      .send();
  }

  async function setRole(role: 'attendee' | 'presenter') {
    await api
      .request('setUserRole')
      .data({
        'user-entity' : entity,
        role,
      })
      .send();
  }

  async function setFocusVideo(enable: boolean = true) {
    await api
      .request('setFocusVideo')
      .data({
        'user-entity' : enable ? entity : '',
      })
      .send();
  }

  async function getStats() {
    await api
      .request('getStats')
      .data({ 'user-entity-list': [entity] })
      .send();
  }

  return {
    setFilter,
    setAudioFilter,
    setVideoFilter,

    setDisplayText,
    setRole,
    setFocusVideo,

    getStats,
  };
}
