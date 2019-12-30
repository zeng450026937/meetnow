import debug from 'debug';
import { Api } from '../api';

const log = debug('MN:Information:Camera');

export type ActionType =
  | 'PanLeft'
  | 'PanRight'
  | 'TiltDown'
  | 'TiltUp'
  | 'ZoomOut'
  | 'ZoomIn'
  | 'FocusOut'
  | 'FocusIn';

export enum ActionTypes {
  LEFT = 'PanLeft',
  RIGHT = 'PanRight',
  DOWN = 'TiltDown',
  UP = 'TiltUp',
  ZOOMOUT = 'ZoomOut',
  ZOOMIN = 'ZoomIn',
  FOCUSOUT = 'FocusOut',
  FOCUSIN = 'FocusIn',
}

export function createCameraCtrl(api: Api, entity: string) {
  async function action(type: ActionType) {
    log('action()');

    await api
      .request('setFecc')
      .data({
        'user-entity' : entity,
        action        : type,
      })
      .send();
  }
  function left() {
    log('left()');

    return action(ActionTypes.LEFT);
  }
  function right() {
    log('right()');

    return action(ActionTypes.RIGHT);
  }
  function down() {
    log('down()');

    return action(ActionTypes.DOWN);
  }
  function up() {
    log('up()');

    return action(ActionTypes.UP);
  }
  function zoomout() {
    log('zoomout()');

    return action(ActionTypes.ZOOMOUT);
  }
  function zoomin() {
    log('zoomin()');

    return action(ActionTypes.ZOOMIN);
  }
  function focusout() {
    log('focusout()');

    return action(ActionTypes.FOCUSOUT);
  }
  function focusin() {
    log('focusin()');

    return action(ActionTypes.FOCUSIN);
  }

  return {
    action,

    left,
    right,

    down,
    up,

    zoomout,
    zoomin,

    focusout,
    focusin,
  };
}

export type CameraCtrl = ReturnType<typeof createCameraCtrl>;
