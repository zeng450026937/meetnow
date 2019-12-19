import { Api } from '../api';

export function createLobbyCtrl(api: Api) {
  async function reject(entity?: string) {
    const apiName = entity ? 'deleteUser' : 'rejectLobbyUserAll';
    await api
      .request(apiName)
      .data({ 'user-entity': entity })
      .send();
  }

  async function accept(entity?: string) {
    const apiName = entity ? 'acceptLobbyUser' : 'acceptLobbyUserAll';
    await api
      .request(apiName)
      .data({ 'user-entity': entity })
      .send();
  }

  async function hold(entity?: string) {
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
