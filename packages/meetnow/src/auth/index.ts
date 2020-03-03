import md5 from 'md5';
import btoa from '../adapter/btoa';
import { createUserApi } from './user-api';
import { createDigestAuth } from './digest-auth';
import { Api } from '../api';
import { Authentication } from './interface';

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

export interface Identity {
  party: any;
  subject: any;
  cloudAccount: any;

  token: string;
  seeded: boolean;
  lastLogin: boolean;

  readonly account: any;
  readonly auth?: Authentication;

  confirm: () => Promise<Authentication>;
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

  const identities: Identity[] = tokens.map(token => {
    const identityToken = token.token;
    let identityAuth;

    return {
      ...token,

      get account() {
        return account;
      },
      get auth() {
        return identityAuth;
      },

      async confirm() {
        if (!identityAuth) {
          identityAuth = await createDigestAuth(identityToken);
        }
        return identityAuth;
      },
    } as Identity;
  });

  return {
    account,
    identities,
  };
}

export async function fetchControlUrl(
  identity: Identity,
  number: string,
  baseurl?: string,
) {
  const { auth, party } = identity;

  // check identity
  if (!auth) {
    await identity.confirm();
  }

  const { api, token } = auth!;
  const { number: partyNumber } = party;

  const response = await (api as Api).request('getConferenceInfo')
    .params({
      conferenceNo                        : number,
      searchNotStartedScheduledConference : false,
    })
    .send();

  const {
    conferenceNo,
    domain,
    vmr,
    scheduledConference,
  } = response.data.data;

  const shortNo = (conferenceNo as string).split('.')[1];

  let planId = '';
  let sequence = 1;

  if (vmr) {
    ({ vmrId: planId } = vmr);
  }
  if (scheduledConference) {
    ({ planId, sequence } = scheduledConference);
  }

  const encode = btoa;

  const source = 'WEBUSER';

  const parts = [
    `source=${ source }`,
    // TODO base64
    `conference=${ encode(`${ shortNo }@${ domain }`) }`,
    `sequence=${ sequence }`,
    `id=${ planId }`,
    // TODO base64
    `client=${ encode(`${ partyNumber }@${ domain }`) }`,
    `t=${ encode(token!) }`,
  ];

  baseurl = baseurl || api.delegate.defaults.baseURL!;
  baseurl = baseurl.replace('webapp', 'control');

  const url = `${ baseurl }?${ parts.join('&') }`;

  return url;
}
