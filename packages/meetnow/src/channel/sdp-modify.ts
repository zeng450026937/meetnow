import { parse, write } from '../sdp-transform';
import { getBrowser } from '../browser';

const browser = getBrowser();

export interface Data {
  originator: 'local' | 'remote';
  type: 'offer' | 'answer';
  sdp: string;
}

export function tias() {}

export function createModifier() {
  const modifiers = [];

  function build() {
    return (data: Data) => {
      const sdp = parse(data.sdp);

      data.sdp = write(sdp);
    };
  }

  function content(val: string) {
    modifiers.push();
  }

  return {
    build,
  };
}
