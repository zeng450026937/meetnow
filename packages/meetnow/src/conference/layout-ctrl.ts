import { Api } from '../api';

export function createLayoutCtrl(api: Api) {
  async function setLayout(options) {
    await api
      .request('setFreeLayout')
      .data(options)
      .send();
  }
  async function setCustomizeLayout(options) {
    await api
      .request('setCustomizeLayout')
      .data(options)
      .send();
  }

  async function setPresenterLayout(options) {
    options.viewer = 'presenter';
    await setCustomizeLayout(options);
  }

  async function setAttendeeLayout(options) {
    options.viewer = 'attendee';
    await setCustomizeLayout(options);
  }

  async function setCastViewerLayout(options) {
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
