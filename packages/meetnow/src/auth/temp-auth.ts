import { createUserApi } from './user-api';
import { createWorker } from '../utils/worker';
import { Authentication } from './interface';

/* eslint-disable no-use-before-define */

export async function createTempAuth(
  partyId: string,
): Promise<Authentication> {
  let token: string | undefined;

  // create api
  const api = createUserApi(() => token);

  // try auth
  await auth();

  // creat auth() worker
  const worker = createWorker({
    interval : 5 * 60 * 1000,
    work     : auth,
  });

  // start worker
  worker.start(false);


  async function auth() {
    const response = await api
      .request('getVirtualJWT')
      .params({ id: partyId })
      .send();

    ({ token } = response.data.data);

    if (!token) {
      throw new Error('Authorization Error');
    }
  }

  async function invalid() {
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
