import { Api } from '../api';

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

export function createCameraCtrl(entity: string, api: Api) {
  async function action(type: ActionType) {
    await api
      .request('setFecc')
      .data({
        'user-entity' : entity,
        action        : type,
      })
      .send();
  }
  function left() {
    return action(ActionTypes.LEFT);
  }
  function right() {
    return action(ActionTypes.RIGHT);
  }
  function down() {
    return action(ActionTypes.DOWN);
  }
  function up() {
    return action(ActionTypes.UP);
  }
  function zoomout() {
    return action(ActionTypes.ZOOMOUT);
  }
  function zoomin() {
    return action(ActionTypes.ZOOMIN);
  }
  function focusout() {
    return action(ActionTypes.FOCUSOUT);
  }
  function focusin() {
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
