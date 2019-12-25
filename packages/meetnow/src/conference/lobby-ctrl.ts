import debug from 'debug';
import { Api } from '../api';

const log = debug('Lobby');

export function createLobbyCtrl(api: Api) {
  async function reject(entity?: string) {
    log('reject()');

    const apiName = entity ? 'deleteUser' : 'rejectLobbyUserAll';
    await api
      .request(apiName)
      .data({ 'user-entity': entity })
      .send();
  }

  async function accept(entity?: string) {
    log('accept()');

    const apiName = entity ? 'acceptLobbyUser' : 'acceptLobbyUserAll';
    await api
      .request(apiName)
      .data({ 'user-entity': entity })
      .send();
  }

  async function hold(entity?: string) {
    log('hold()');

    const apiName = entity ? 'waitLobbyUser' : 'waitLobbyUserAll';
    await api
      .request(apiName)
      .data({ 'user-entity': entity })
      .send();
  }

  return {
    reject,
    accept,
    hold,
  };
}
