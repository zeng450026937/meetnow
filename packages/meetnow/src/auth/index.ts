import md5 from 'md5';
import { createUserApi } from './user-api';
import { createDigestAuth } from './digest-auth';

export * from './interface';
export * from './user-api';
export * from './digest-auth';
export * from './temp-auth';

export enum AuthType {
  email = '0',
  mobile = '1',
  verifycode = '9',
}

export interface AuthInfo {
  'principle': string;
  'credential': string;
  // needed if using subdomain
  'enterprise'?: string;
  // default '86'
  'areacode'?: string;
  // default '1'
  'authtype'?: AuthType;
}

export async function bootstrap(auth: AuthInfo) {
  const api = createUserApi();

  const response = await api.request('login')
    .data({
      principle   : auth.principle,
      credential  : md5(auth.credential),
      number      : auth.enterprise,
      mobileCode  : auth.areacode,
      accountType : auth.authtype,
    })
    .send();

  const { account, tokens } = response.data.data;

  async function confirm(token: string) {
    /* eslint-disable-next-line no-return-await */
    return await createDigestAuth(token);
  }

  return {
    account,
    tokens,

    confirm,
  };
}
