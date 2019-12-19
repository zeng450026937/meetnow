import { Api } from '../api';

export interface InviteOptions {
  uid: string[];
  sipURL: string;
  h323URL: string;
}

export type SpeakMode = 'free' | 'hand-up'

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
  function end() {}

  // lock-conference
  function lock() {}

  // mute-all
  function mute() {}

  // unmute-all
  function unmute() {}

  // reject-all-hand-up
  function rejectHandup() {}

  // delete-user
  function kickUser() {}

  // set-speak-mode
  function setSpeakMode(mode: SpeakMode) {}

  return {};
}
