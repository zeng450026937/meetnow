import debug from 'debug';
import { getBrowser } from '../browser';
import { parse, write } from '../sdp-transform';

const log = debug('MN:SDP');
const browser = getBrowser();

export interface Data {
  originator: 'local' | 'remote';
  type: 'offer' | 'answer';
  sdp: string;
}

export function createModifier() {
  let content = 'main';
  let width = 1920;
  let height = 1080;
  let frameRate = 30;
  let highFrameRate = false;
  let prefer: 'vp8' | 'h264' | undefined;
  let unsupport: 'vp8' | 'h264' | undefined;
  let modifier: any;

  function build() {
    return (data: Data) => {
      const { originator, type } = data;
      const sdp = parse(data.sdp);

      const maxWidth = width;
      const maxHeight = height;
      const maxFrameRate = frameRate;

      const maxFrameSize = Math.ceil(maxWidth * maxHeight / 255);
      const maxMbps = Math.ceil(maxFrameRate * maxFrameSize);

      let bandwidth = maxHeight >= 1080
        ? 2048
        : maxHeight >= 720
          ? 1280
          : maxHeight >= 360
            ? 512
            : 512;

      bandwidth = Math.ceil(bandwidth * maxFrameRate / 30); // calc frameRate ratio


      // process sdp
      for (const m of sdp.media!) {
        /*
        m.candidates = m.candidates.filter((c) =>
        {
          return c.component === 1;
        });
        */

        if (m.type === 'video') {
          m.content = content;
          m.bandwidth = [
            {
              type  : 'TIAS',
              limit : Math.ceil(bandwidth * 1024),
            },
          ];

          const vp8Payloads = new Set<number>();
          const h264Payloads = new Set<number>();

          const vp8Config = [`max-fr=${ maxFrameRate }`, `max-fs=${ maxFrameSize }`];
          const h264Config = [`max-mbps=${ maxMbps }`, `max-fs=${ maxFrameSize }`];

          // find codec payload
          for (const r of m.rtp!) {
            const codec = r.codec.toUpperCase();
            let fmtp: any;

            switch (codec) {
              case 'VP8':
              case 'VP9':
                vp8Payloads.add(Number(r.payload));
                fmtp = m.fmtp!.find((f) => (f.payload === r.payload));
                if (fmtp) {
                  fmtp.config = fmtp.config.split(';')
                    .filter((p: any) => { return !(/^max-fr/.test(p) || /^max-fs/.test(p)); })
                    .concat(vp8Config)
                    .join(';');
                } else {
                  m.fmtp!.push({
                    payload : r.payload,
                    config  : vp8Config.join(';'),
                  });
                }
                break;
              case 'H264':
                h264Payloads.add(Number(r.payload));
                fmtp = m.fmtp!.find((f) => (f.payload === r.payload));
                if (fmtp) {
                  if (highFrameRate
                  && fmtp.config.indexOf('profile-level-id=42e01f') !== -1
                  && originator === 'local'
                  && type === 'offer') {
                    fmtp.config = fmtp.config.split(';')
                      .filter((p: any) => { return !(/^max-mbps/.test(p) || /^max-fs/.test(p) || /^profile-level-id/.test(p)); })
                      .concat(['profile-level-id=64001f'])
                      .concat(h264Config)
                      .join(';');
                  } else if (highFrameRate
                  && fmtp.config.indexOf('profile-level-id=64001f') !== -1
                  && originator === 'remote'
                  && type === 'answer') {
                    fmtp.config = fmtp.config.split(';')
                      .filter((p: any) => { return !(/^max-mbps/.test(p) || /^max-fs/.test(p) || /^profile-level-id/.test(p)); })
                      .concat(['profile-level-id=42e01f'])
                      .concat(h264Config)
                      .join(';');
                  } else {
                    fmtp.config = fmtp.config.split(';')
                      .filter((p: any) => { return !(/^max-mbps/.test(p) || /^max-fs/.test(p)); })
                      .concat(h264Config)
                      .join(';');
                  }
                } else {
                  m.fmtp!.push({
                    payload : r.payload,
                    config  : h264Config.join(';'),
                  });
                }
                break;
              default:
                break;
            }
          }

          for (const f of m.fmtp!) {
            const aptConfig = f.config
              .split(';')
              .find((p) => { return /^apt=/.test(p); });

            if (!aptConfig) { continue; }

            const apt = aptConfig.split('=')[1];

            if (vp8Payloads.has(Number(apt))) {
              vp8Payloads.add(Number(f.payload));
            } else
            if (h264Payloads.has(Number(apt))) {
              h264Payloads.add(Number(f.payload));
            }
          }

          let preferCodec = prefer === 'vp8'
            ? vp8Payloads
            : prefer === 'h264'
              ? h264Payloads
              : new Set<number>();

          const unsupportCodec = unsupport === 'vp8'
            ? vp8Payloads
            : unsupport === 'h264'
              ? h264Payloads
              : new Set<number>();

          // firefox do not support multiple h264 codec/decode insts
          // when content sharing or using multiple tab, codec/decode might be error.
          // and chrome ver58 has a really low resolution in h264 codec when content sharing.
          // use VP8/VP9 first
          if (
            browser.firefox
              || (browser.chrome && parseInt(browser.version, 10) < 63 && content === 'slides')
          ) {
            preferCodec = vp8Payloads;
          }

          if (!preferCodec.size || !unsupportCodec.size) {
            let payloads: (string | number)[] = String(m.payloads).split(' ');

            payloads = payloads.filter((p) => { return !preferCodec.has(Number(p)); });
            payloads = payloads.filter((p) => { return !unsupportCodec.has(Number(p)); });
            payloads = Array.from(preferCodec)
              .sort((x, y) => (x - y))
              .concat(payloads as any);

            m.rtp = m.rtp!.filter((r) => !unsupportCodec.has(Number(r.payload)));
            m.fmtp = m.fmtp!.filter((r) => !unsupportCodec.has(Number(r.payload)));

            const rtps: any[] = [];
            const fmtps: any[] = [];

            payloads.forEach((p) => {
              const rtp = m.rtp!.find((r) => r.payload === Number(p));
              const fmtp = m.fmtp!.find((f) => f.payload === Number(p));

              if (rtp) rtps.push(rtp);
              if (fmtp) fmtps.push(fmtp);
            });

            m.rtp = rtps;
            m.fmtp = fmtps;

            m.payloads = payloads.join(' ');
          }
        }

        if (m.type === 'audio') {
          m.bandwidth = [
            {
              type  : 'TIAS',
              limit : Math.ceil(128 * 1024),
            },
          ];
        }
      }

      // filter out unsupported application media
      sdp.media = sdp.media!.filter((m) => m.type !== 'application' || /TLS/.test(m.protocol));

      if (originator === 'remote') {
        sdp.media.forEach((m) => {
          const payloads = String(m.payloads).split(' ');

          if (m.rtcpFb) {
            const rtcpFb: any[] = [];

            m.rtcpFb.forEach((fb) => {
              if (fb.payload === '*' || payloads.includes(`${ fb.payload }`)) {
                rtcpFb.push(fb);
              }
            });

            m.rtcpFb = rtcpFb;
          }

          if (m.fmtp) {
            const fmtp: any[] = [];

            m.fmtp.forEach((fm) => {
              if (fm.payload === '*' || payloads.includes(`${ fm.payload }`)) {
                fmtp.push(fm);
              }
            });

            m.fmtp = fmtp;
          }

          if (m.rtp) {
            const rtp: any[] = [];

            m.rtp.forEach((r) => {
              if (r.payload === '*' || payloads.includes(`${ r.payload }`)) {
                rtp.push(r);
              }
            });

            m.rtp = rtp;
          }
        });

        if (type === 'offer' && browser.firefox) {
          sdp.media.forEach((m) => {
            if (m.mid === undefined) {
              m.mid = m.type === 'audio'
                ? 0
                : m.type === 'video'
                  ? 1
                  : m.mid;
            }
          });
        }
      }

      data.sdp = write(sdp);

      log(`${ originator } sdp: \n\n %s \n`, data.sdp);
    };
  }

  return modifier = {
    content(val: 'main' | 'slides') {
      content = val;
      return modifier as Modifier;
    },
    width(val: number) {
      width = val;
      return modifier as Modifier;
    },
    height(val: number) {
      height = val;
      return modifier as Modifier;
    },
    frameRate(val: number) {
      frameRate = val;
      return modifier as Modifier;
    },
    highFrameRate(val: boolean) {
      highFrameRate = val;
      return modifier as Modifier;
    },
    prefer(val: 'h264' | 'vp8') {
      prefer = val;
      return modifier as Modifier;
    },
    unsupport(val: 'h264' | 'vp8') {
      unsupport = val;
      return modifier as Modifier;
    },

    build,
  };
}

export type Modifier = ReturnType<typeof createModifier>;
