import { Api } from '../api';
import { ApiDataMap } from '../api/api-configs';

export function createLayoutCtrl(api: Api) {
  async function setLayout(options: ApiDataMap['setFreeLayout']) {
    await api
      .request('setFreeLayout')
      .data(options)
      .send();
  }
  async function setCustomizeLayout(options: ApiDataMap['setCustomizeLayout']) {
    await api
      .request('setCustomizeLayout')
      .data(options)
      .send();
  }

  async function setPresenterLayout(options: ApiDataMap['setCustomizeLayout']) {
    options.viewer = 'presenter';
    await setCustomizeLayout(options);
  }

  async function setAttendeeLayout(options: ApiDataMap['setCustomizeLayout']) {
    options.viewer = 'attendee';
    await setCustomizeLayout(options);
  }

  async function setCastViewerLayout(options: ApiDataMap['setCustomizeLayout']) {
    options.viewer = 'castviewer';
    await setCustomizeLayout(options);
  }

  async function setOSD(options = { name: true, icon: true }) {
    const { name, icon } = options;
    await api
      .request('setGlobalLayout')
      .data({
        'hide-osd-site-icon' : icon,
        'hide-osd-site-name' : name,
      })
      .send();
  }

  async function setSpeakMode(mode: 'free' | 'hand-up') {
    await api
      .request('setSpeakMode')
      .data({ 'speak-mode': mode })
      .send();
  }

  return {
    setLayout,
    setCustomizeLayout,

    setPresenterLayout,
    setAttendeeLayout,
    setCastViewerLayout,

    setOSD,
    setSpeakMode,
  };
}
