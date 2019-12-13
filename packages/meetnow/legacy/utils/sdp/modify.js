import Bowser from 'bowser';
import sdpTransform from './transform';

/**
 * adjustSdp 的调用规则
 * data 要提供的属性有:
 * sdp sdp 报文
 * originator 来源 local remote
 * type offer answer 呼叫类型 是 offer 还是 answer
 *
 * options 要提供的属性有:
 * type main 主流 slides 辅流
 * videoConstraints  width height frameRate
 * isEducation 是否是教育模式
 * iceTimeOut 获取ice超时的定时器 传 id
 */

const adjustSdp = (data = {}, options = {}) => {
  if (!data.sdp) return new Error('no sdp');
  const sdp = sdpTransform.parse(data.sdp);

  if (!Array.isArray(sdp.media)) sdp.media = [sdp.media];

  const { videoConstraints = {} } = options;
  const maxWidth = videoConstraints.width || 1920;
  const maxHeight = videoConstraints.height || 1080;
  const maxFr = videoConstraints.frameRate || 30;

  const maxFs = Math.ceil(maxWidth * maxHeight / 255);
  const maxMbps = Math.ceil(maxFr * maxFs);

  let bandwidth = maxHeight >= 1080 ? 2048 : maxHeight >= 720 ? 1280 : maxHeight >= 360 ? 512 : 512;

  bandwidth = Math.ceil(bandwidth * maxFr / 30);

  sdp.media.forEach((media) => {
    if (media.type === 'video') {
      media.content = options.type;
      media.bandwidth = [
        {
          type  : 'TIAS',
          limit : Math.ceil(bandwidth * 1024),
        },
      ];

      const vp8Payloads = new Set();
      const h264Payloads = new Set();

      const vp8Config = [`max-fr=${ maxFr }`, `max-fs=${ maxFs }`];
      const h264Config = [`max-mbps=${ maxMbps }`, `max-fs=${ maxFs }`];

      if (Array.isArray(media.rtp)) {
        media.rtp.forEach((rtp) => {
          const codec = rtp.codec.toUpperCase();

          let fmtp = null;

          switch (codec) {
            case 'VP8':
            case 'VP9':
              vp8Payloads.add(Number(rtp.payload));
              fmtp = media.fmtp.find((f) => (f.payload === rtp.payload));
              if (fmtp) {
                fmtp.config = fmtp.config.split(';')
                  .filter((p) => !(/^max-fr/.test(p) || /^max-fs/.test(p)))
                  .concat(vp8Config)
                  .join(';');
              }
              else {
                media.fmtp.push({
                  payload : rtp.payload,
                  config  : vp8Config.join(';'),
                });
              }
              break;
            case 'H264':
              h264Payloads.add(Number(rtp.payload));
              fmtp = media.fmtp.find((f) => (f.payload === rtp.payload));
              if (fmtp) {
                if (options.isEducation === true
                  && fmtp.config.contains('profile-level-id=42e01f')
                  && data.originator === 'local'
                  && data.type === 'offer') {
                  fmtp.config = fmtp.config.split(';')
                    .filter((p) => !(/^max-(mbps|fs)/.test(p) || /^profile-level-id/.test(p)))
                    .concat(['profile-level-id=64001f'])
                    .concat(h264Config)
                    .join(';');
                }
                else if (options.isEducation === true
                  && fmtp.config.contains('profile-level-id=64001f')
                  && data.originator === 'remote'
                  && data.type === 'answer') {
                  fmtp.config = fmtp.config.split(';')
                    .filter((p) => !(/^max-(mbps|fs)/.test(p) || /^profile-level-id/.test(p)))
                    .concat(['profile-level-id=42e01f'])
                    .concat(h264Config)
                    .join(';');
                }
                else {
                  fmtp.config = fmtp.config.split(';')
                    .filter((p) => !(/^max-(mbps|fs)/.test(p)))
                    .concat(h264Config)
                    .join(';');
                }
              }
              else {
                media.fmtp.push({
                  payload : rtp.payload,
                  config  : h264Config.join(';'),
                });
              }
              break;
            default: break;
          }
        });
      }

      if (Array.isArray(media.fmtp)) {
        media.fmtp.forEach((fmtp) => {
          const aptConfig = fmtp.config.split(';').find((p) => /^apt=/.test(p));

          if (!aptConfig) { return; }

          const apt = aptConfig.split('=')[1];

          if (vp8Payloads.has(Number(apt))) {
            vp8Payloads.add(Number(fmtp.payload));
          }
          else if (h264Payloads.has(Number(apt))) {
            h264Payloads.add(Number(fmtp.payload));
          }
        });
      }

      let preferCodec = h264Payloads;
      const unSupportCodec = new Set();

      if (Bowser.firefox
        || (Bowser.chrome && Bowser.android)
        || (Bowser.chrome && Number.parseInt(`${ Bowser.version }`, 10) < 63 && options.type === 'slides')) {
        preferCodec = vp8Payloads;
      }

      let payloads = String(media.payloads).split(' ');

      payloads = payloads.filter((p) => !preferCodec.has(Number(p)));
      payloads = payloads.filter((p) => !unSupportCodec.has(Number(p)));
      payloads = Array.from(preferCodec)
        .sort((x, y) => (x - y))
        .concat(payloads);

      media.rtp = media.rtp.filter((r) => !unSupportCodec.has(Number(r.payload)));
      media.fmtp = media.fmtp.filter((r) => !unSupportCodec.has(Number(r.payload)));

      const rtps = [];
      const fmtps = [];

      payloads.forEach((p) => {
        const rtp = media.rtp.find((r) => r.payload === Number(p));
        const fmtp = media.fmtp.find((f) => f.payload === Number(p));

        if (rtp) rtps.push(rtp);
        if (fmtp) fmtps.push(fmtp);
      });

      media.rtp = rtps;
      media.fmtp = fmtps;

      media.payloads = payloads.join(' ');
    }
    if (media.type === 'audio') {
      media.bandwidth = [
        {
          type  : 'TIAS',
          limit : Math.ceil(128 * 1024),
        },
      ];
    }

    // chrome 60以下重协商要求offer的sdp必须使用actpass，不能指定
    // 60以上版本可以直接指定active或passive
    if (media.setup === 'passive'
      && data.originator === 'remote'
      && data.type === 'offer'
      && Bowser.chrome
      && Number.parseInt(`${ Bowser.version }`, 10) < 60) {
      media.setup = 'actpass';
    }
  });


  // filter out unsupported application media
  sdp.media = sdp.media.filter((media) => media.type !== 'application' || /TLS/.test(media.protocol));

  if (data.originator === 'local') {
    if (options.iceTimeOut) {
      clearTimeout(options.iceTimeOut);
    }
  }

  if (data.originator === 'remote') {
    sdp.media.forEach((media) => {
      const payloads = String(media.payloads).split(' ');

      if (media.rtcpFb) {
        const rtcpFb = [];

        media.rtcpFb.forEach((fb) => {
          if (fb.payload === '*' || payloads.includes(`${ fb.payload }`)) {
            rtcpFb.push(fb);
          }
        });

        media.rtcpFb = rtcpFb;
      }

      if (media.fmtp) {
        const fmtp = [];

        media.fmtp.forEach((fm) => {
          if (fm.payload === '*' || payloads.includes(`${ fm.payload }`)) {
            fmtp.push(fm);
          }
        });

        media.fmtp = fmtp;
      }

      if (media.rtp) {
        const rtp = [];

        media.rtp.forEach((r) => {
          if (r.payload === '*' || payloads.includes(`${ r.payload }`)) {
            rtp.push(r);
          }
        });

        media.rtp = rtp;
      }
    });

    if (data.type === 'offer' && Bowser.firefox) {
      sdp.media.forEach((media) => {
        if (media.mid === undefined) return;

        if (media.type === 'audio') media.mid = 0;
        else if (media.type === 'video') media.mid = 1;
      });
    }
  }

  // sdp.media[1].ext[0].value = 5;

  data.sdp = sdpTransform.write(sdp);

  return data;
};

export default adjustSdp;
