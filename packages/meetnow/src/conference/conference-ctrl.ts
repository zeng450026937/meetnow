import { Api } from '../api';
import { ConferenceDescription } from './conference-info';

export interface InviteOptions {
  uid: string[];
  sipURL: string;
  h323URL: string;
}

export type SpeakMode = 'free' | 'hand-up'

export interface LockOptions {
  policy: ConferenceDescription['admission-policy'];
  attendeeByPass?: boolean;
}

export function createConferenceCtrl(api: Api) {
  async function invite(option: Partial<InviteOptions>) {
    await api
      .request('inviteUser')
      .data({
        uid        : option.uid,
        'sip-url'  : option.sipURL,
        'h323-url' : option.h323URL,
      });
  }

  // end-conference
  async function end() {
    await api
      .request('end')
      .data({ 'conference-url': '' })
      .send();
  }

  async function setLock(options: LockOptions) {
    await api
      .request('setLock')
      .data({
        'admission-policy'      : options.policy,
        'attendee-lobby-bypass' : options.attendeeByPass,
      })
      .send();
  }

  async function lock(attendeeByPass?: boolean) {
    await setLock({
      policy : 'closedAuthenticated',
      attendeeByPass,
    });
  }
  async function unlock() {
    await setLock({
      policy : 'anonymous',
    });
  }

  // mute-all
  function mute() {}

  // unmute-all
  function unmute() {}

  // reject-all-hand-up
  function rejectHandup() {}

  // delete-user
  function kick() {}

  // set-speak-mode
  function setSpeakMode(mode: SpeakMode) {}

  return {
    invite,
    kick,

    end,

    setLock,
    lock,
    unlock,

    mute,
    unmute,
  };
}
