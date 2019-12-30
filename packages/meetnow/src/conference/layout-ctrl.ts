import debug from 'debug';
import { Api } from '../api';
import { ApiDataMap } from '../api/api-configs';

const log = debug('MN:Information:Layout');

export function createLayoutCtrl(api: Api) {
  async function setLayout(options: ApiDataMap['setFreeLayout']) {
    log('setLayout()');

    await api
      .request('setFreeLayout')
      .data(options)
      .send();
  }
  async function setCustomizeLayout(options: ApiDataMap['setCustomizeLayout']) {
    log('setCustomizeLayout()');

    options.viewer = options.viewer || 'attendee';

    await api
      .request('setCustomizeLayout')
      .data(options)
      .send();
  }

  async function setPresenterLayout(options: ApiDataMap['setCustomizeLayout']) {
    log('setPresenterLayout()');

    options.viewer = 'presenter';

    await setCustomizeLayout(options);
  }

  async function setAttendeeLayout(options: ApiDataMap['setCustomizeLayout']) {
    log('setAttendeeLayout()');

    options.viewer = 'attendee';

    await setCustomizeLayout(options);
  }

  async function setCastViewerLayout(options: ApiDataMap['setCustomizeLayout']) {
    log('setCastViewerLayout()');

    options.viewer = 'castviewer';

    await setCustomizeLayout(options);
  }

  async function setOSD(options = { name: true, icon: true }) {
    log('setOSD()');

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
    log('setSpeakMode()');

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
