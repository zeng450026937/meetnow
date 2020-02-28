import { createUserApi } from './user-api';
import { createWorker } from '../utils/worker';
import { Authentication } from './interface';
import { isObject } from '../utils';

export async function createDigestAuth(
  selection: string | { token: string },
): Promise<Authentication> {
  let token: string | undefined = isObject(selection)
    ? selection.token
    : selection;

  // create api
  const api = createUserApi(() => token);

  // try auth
  const response = await api.request('selectAccount').send();

  ({ token } = response.data.data);

  // creat auth() worker
  const worker = createWorker({
    interval : 5 * 60 * 1000,
    work     : async () => {
      await api.request('refreshToken').send();
    },
  });

  // start worker
  worker.start(false);


  async function invalid() {
    await api.request('logout')
      .send()
      // ignore error anyway
      .catch(() => {});

    worker.stop();

    token = undefined;
  }

  return {
    get token() {
      return token;
    },

    api,
    worker,

    invalid,
  };
}
