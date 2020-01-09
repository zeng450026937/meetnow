var Browser = (function (exports) {
  'use strict';

  /* eslint-disable no-useless-escape */
  /* eslint-disable max-len */
  const grammar = {
      v: [{
              name: 'version',
              reg: /^(\d*)$/,
          }],
      o: [{
              // NB: sessionId will be a String in most cases because it is huge
              name: 'origin',
              reg: /^(\S*) (\d*) (\d*) (\S*) IP(\d) (\S*)/,
              names: ['username', 'sessionId', 'sessionVersion', 'netType', 'ipVer', 'address'],
              format: '%s %s %d %s IP%d %s',
          }],
      // default parsing of these only (though some of these feel outdated)
      s: [{ name: 'name' }],
      i: [{ name: 'description' }],
      u: [{ name: 'uri' }],
      e: [{ name: 'email' }],
      p: [{ name: 'phone' }],
      z: [{ name: 'timezones' }],
      r: [{ name: 'repeats' }],
      // k: [{}], // outdated thing ignored
      t: [{
              name: 'timing',
              reg: /^(\d*) (\d*)/,
              names: ['start', 'stop'],
              format: '%d %d',
          }],
      c: [{
              name: 'connection',
              reg: /^IN IP(\d) (\S*)/,
              names: ['version', 'ip'],
              format: 'IN IP%d %s',
          }],
      b: [{
              push: 'bandwidth',
              reg: /^(TIAS|AS|CT|RR|RS):(\d*)/,
              names: ['type', 'limit'],
              format: '%s:%s',
          }],
      m: [{
              // NB: special - pushes to session
              // TODO: rtp/fmtp should be filtered by the payloads found here?
              reg: /^(\w*) (\d*) ([\w\/]*)(?: (.*))?/,
              names: ['type', 'port', 'protocol', 'payloads'],
              format: '%s %d %s %s',
          }],
      a: [
          {
              push: 'rtp',
              reg: /^rtpmap:(\d*) ([\w\-\.]*)(?:\s*\/(\d*)(?:\s*\/(\S*))?)?/,
              names: ['payload', 'codec', 'rate', 'encoding'],
              format(o) {
                  return (o.encoding)
                      ? 'rtpmap:%d %s/%s/%s'
                      : o.rate
                          ? 'rtpmap:%d %s/%s'
                          : 'rtpmap:%d %s';
              },
          },
          {
              // a=fmtp:111 minptime=10; useinbandfec=1
              push: 'fmtp',
              reg: /^fmtp:(\d*) ([\S| ]*)/,
              names: ['payload', 'config'],
              format: 'fmtp:%d %s',
          },
          {
              name: 'control',
              reg: /^control:(.*)/,
              format: 'control:%s',
          },
          {
              name: 'rtcp',
              reg: /^rtcp:(\d*)(?: (\S*) IP(\d) (\S*))?/,
              names: ['port', 'netType', 'ipVer', 'address'],
              format(o) {
                  return (o.address != null)
                      ? 'rtcp:%d %s IP%d %s'
                      : 'rtcp:%d';
              },
          },
          {
              push: 'rtcpFbTrrInt',
              reg: /^rtcp-fb:(\*|\d*) trr-int (\d*)/,
              names: ['payload', 'value'],
              format: 'rtcp-fb:%d trr-int %d',
          },
          {
              push: 'rtcpFb',
              reg: /^rtcp-fb:(\*|\d*) ([\w-_]*)(?: ([\w-_]*))?/,
              names: ['payload', 'type', 'subtype'],
              format(o) {
                  return (o.subtype != null)
                      ? 'rtcp-fb:%s %s %s'
                      : 'rtcp-fb:%s %s';
              },
          },
          {
              // a=extmap:1/recvonly URI-gps-string
              push: 'ext',
              reg: /^extmap:(\d+)(?:\/(\w+))? (\S*)(?: (\S*))?/,
              names: ['value', 'direction', 'uri', 'config'],
              format(o) {
                  return `extmap:%d${o.direction ? '/%s' : '%v'} %s${o.config ? ' %s' : ''}`;
              },
          },
          {
              push: 'crypto',
              reg: /^crypto:(\d*) ([\w_]*) (\S*)(?: (\S*))?/,
              names: ['id', 'suite', 'config', 'sessionConfig'],
              format(o) {
                  return (o.sessionConfig != null)
                      ? 'crypto:%d %s %s %s'
                      : 'crypto:%d %s %s';
              },
          },
          {
              name: 'setup',
              reg: /^setup:(\w*)/,
              format: 'setup:%s',
          },
          {
              name: 'mid',
              reg: /^mid:([^\s]*)/,
              format: 'mid:%s',
          },
          {
              name: 'msid',
              reg: /^msid:(.*)/,
              format: 'msid:%s',
          },
          {
              name: 'ptime',
              reg: /^ptime:(\d*)/,
              format: 'ptime:%d',
          },
          {
              name: 'maxptime',
              reg: /^maxptime:(\d*)/,
              format: 'maxptime:%d',
          },
          {
              name: 'direction',
              reg: /^(sendrecv|recvonly|sendonly|inactive)/,
          },
          {
              name: 'icelite',
              reg: /^(ice-lite)/,
          },
          {
              name: 'iceUfrag',
              reg: /^ice-ufrag:(\S*)/,
              format: 'ice-ufrag:%s',
          },
          {
              name: 'icePwd',
              reg: /^ice-pwd:(\S*)/,
              format: 'ice-pwd:%s',
          },
          {
              name: 'fingerprint',
              reg: /^fingerprint:(\S*) (\S*)/,
              names: ['type', 'hash'],
              format: 'fingerprint:%s %s',
          },
          {
              // a=candidate:1162875081 1 udp 2113937151 192.168.34.75 60017 typ host generation 0 network-id 3 network-cost 10
              // a=candidate:3289912957 2 udp 1845501695 193.84.77.194 60017 typ srflx raddr 192.168.34.75 rport 60017 generation 0 network-id 3 network-cost 10
              // a=candidate:229815620 1 tcp 1518280447 192.168.150.19 60017 typ host tcptype active generation 0 network-id 3 network-cost 10
              // a=candidate:3289912957 2 tcp 1845501695 193.84.77.194 60017 typ srflx raddr 192.168.34.75 rport 60017 tcptype passive generation 0 network-id 3 network-cost 10
              push: 'candidates',
              reg: /^candidate:(\S*) (\d*) (\S*) (\d*) (\S*) (\d*) typ (\S*)(?: raddr (\S*) rport (\d*))?(?: tcptype (\S*))?(?: generation (\d*))?(?: network-id (\d*))?(?: network-cost (\d*))?/,
              names: ['foundation', 'component', 'transport', 'priority', 'ip', 'port', 'type', 'raddr', 'rport', 'tcptype', 'generation', 'network-id', 'network-cost'],
              format(o) {
                  let str = 'candidate:%s %d %s %d %s %d typ %s';
                  str += (o.raddr != null) ? ' raddr %s rport %d' : '%v%v';
                  // NB: candidate has three optional chunks, so %void middles one if it's missing
                  str += (o.tcptype != null) ? ' tcptype %s' : '%v';
                  if (o.generation != null) {
                      str += ' generation %d';
                  }
                  str += (o['network-id'] != null) ? ' network-id %d' : '%v';
                  str += (o['network-cost'] != null) ? ' network-cost %d' : '%v';
                  return str;
              },
          },
          {
              name: 'endOfCandidates',
              reg: /^(end-of-candidates)/,
          },
          {
              name: 'remoteCandidates',
              reg: /^remote-candidates:(.*)/,
              format: 'remote-candidates:%s',
          },
          {
              name: 'iceOptions',
              reg: /^ice-options:(\S*)/,
              format: 'ice-options:%s',
          },
          {
              push: 'ssrcs',
              reg: /^ssrc:(\d*) ([\w_-]*)(?::(.*))?/,
              names: ['id', 'attribute', 'value'],
              format(o) {
                  let str = 'ssrc:%d';
                  if (o.attribute != null) {
                      str += ' %s';
                      if (o.value != null) {
                          str += ':%s';
                      }
                  }
                  return str;
              },
          },
          {
              // a=ssrc-group:FEC-FR 3004364195 1080772241
              push: 'ssrcGroups',
              // token-char = %x21 / %x23-27 / %x2A-2B / %x2D-2E / %x30-39 / %x41-5A / %x5E-7E
              reg: /^ssrc-group:([\x21\x23\x24\x25\x26\x27\x2A\x2B\x2D\x2E\w]*) (.*)/,
              names: ['semantics', 'ssrcs'],
              format: 'ssrc-group:%s %s',
          },
          {
              name: 'msidSemantic',
              reg: /^msid-semantic:\s?(\w*) (\S*)/,
              names: ['semantic', 'token'],
              format: 'msid-semantic: %s %s',
          },
          {
              push: 'groups',
              reg: /^group:(\w*) (.*)/,
              names: ['type', 'mids'],
              format: 'group:%s %s',
          },
          {
              name: 'rtcpMux',
              reg: /^(rtcp-mux)/,
          },
          {
              name: 'rtcpRsize',
              reg: /^(rtcp-rsize)/,
          },
          {
              name: 'sctpmap',
              reg: /^sctpmap:([\w_\/]*) (\S*)(?: (\S*))?/,
              names: ['sctpmapNumber', 'app', 'maxMessageSize'],
              format(o) {
                  return (o.maxMessageSize != null)
                      ? 'sctpmap:%s %s %s'
                      : 'sctpmap:%s %s';
              },
          },
          {
              name: 'xGoogleFlag',
              reg: /^x-google-flag:([^\s]*)/,
              format: 'x-google-flag:%s',
          },
          {
              name: 'content',
              reg: /^content:([^\s]*)/,
              format: 'content:%s',
          },
          {
              name: 'label',
              reg: /^label:([\d]*)/,
              format: 'label:%d',
          },
          {
              push: 'rids',
              reg: /^rid:([\d\w]+) (\w+)(?: ([\S| ]*))?/,
              names: ['id', 'direction', 'params'],
              format(o) {
                  return (o.params) ? 'rid:%s %s %s' : 'rid:%s %s';
              },
          },
          {
              // a=imageattr:* send [x=800,y=640] recv *
              // a=imageattr:100 recv [x=320,y=240]
              push: 'imageattrs',
              reg: new RegExp(
              // a=imageattr:97
              '^imageattr:(\\d+|\\*)'
                  // send [x=800,y=640,sar=1.1,q=0.6] [x=480,y=320]
                  + '[\\s\\t]+(send|recv)[\\s\\t]+(\\*|\\[\\S+\\](?:[\\s\\t]+\\[\\S+\\])*)'
                  // recv [x=330,y=250]
                  + '(?:[\\s\\t]+(recv|send)[\\s\\t]+(\\*|\\[\\S+\\](?:[\\s\\t]+\\[\\S+\\])*))?'),
              names: ['pt', 'dir1', 'attrs1', 'dir2', 'attrs2'],
              format(o) {
                  return `imageattr:%s %s %s${o.dir2 ? ' %s %s' : ''}`;
              },
          },
          {
              // a=simulcast:recv 1;4,5 send 6;7
              name: 'simulcast',
              reg: new RegExp(
              // a=simulcast:
              '^simulcast:'
                  // send 1,2,3;~4,~5
                  + '(send|recv) ([a-zA-Z0-9\\-_~;,]+)'
                  // space + recv 6;~7,~8
                  + '(?:\\s?(send|recv) ([a-zA-Z0-9\\-_~;,]+))?'
                  // end
                  + '$'),
              names: ['dir1', 'list1', 'dir2', 'list2'],
              format(o) {
                  return `simulcast:%s %s${o.dir2 ? ' %s %s' : ''}`;
              },
          },
          {
              //  https://tools.ietf.org/html/draft-ietf-mmusic-sdp-simulcast-03
              // a=simulcast: recv pt=97;98 send pt=97
              // a=simulcast: send rid=5;6;7 paused=6,7
              name: 'simulcast_03',
              reg: /^simulcast:[\s\t]+([\S+\s\t]+)$/,
              names: ['value'],
              format: 'simulcast: %s',
          },
          {
              // a=framerate:25
              // a=framerate:29.97
              name: 'framerate',
              reg: /^framerate:(\d+(?:$|\.\d+))/,
              format: 'framerate:%s',
          },
          {
              // a=source-filter: incl IN IP4 239.5.2.31 10.1.15.5
              name: 'sourceFilter',
              reg: /^source-filter: *(excl|incl) (\S*) (IP4|IP6|\*) (\S*) (.*)/,
              names: ['filterMode', 'netType', 'addressTypes', 'destAddress', 'srcList'],
              format: 'source-filter: %s %s %s %s %s',
          },
          {
              push: 'invalid',
              names: ['value'],
          },
      ],
  };
  // set sensible defaults to avoid polluting the grammar with boring details
  Object.keys(grammar).forEach((key) => {
      const objs = grammar[key];
      objs.forEach((obj) => {
          if (!obj.reg) {
              obj.reg = /(.*)/;
          }
          if (!obj.format) {
              obj.format = '%s';
          }
      });
  });

  /* eslint-disable no-useless-escape */
  function toIntIfInt(v) {
      return String(Number(v)) === v ? Number(v) : v;
  }
  function attachProperties(match, location, names, rawName) {
      if (rawName && !names) {
          location[rawName] = toIntIfInt(match[1]);
      }
      else {
          for (let i = 0; i < names.length; i += 1) {
              if (match[i + 1] != null) {
                  location[names[i]] = toIntIfInt(match[i + 1]);
              }
          }
      }
  }
  function parseReg(obj, location, content) {
      const needsBlank = obj.name && obj.names;
      if (obj.push && !location[obj.push]) {
          location[obj.push] = [];
      }
      else if (needsBlank && !location[obj.name]) {
          location[obj.name] = {};
      }
      const keyLocation = obj.push
          ? {} // blank object that will be pushed
          : needsBlank ? location[obj.name] : location; // otherwise, named location or root
      attachProperties(content.match(obj.reg), keyLocation, obj.names, obj.name);
      if (obj.push) {
          location[obj.push].push(keyLocation);
      }
  }
  const validLine = RegExp.prototype.test.bind(/^([a-z])=(.*)/);
  function parse(sdp) {
      const media = [];
      const session = { media };
      let location = session; // points at where properties go under (one of the above)
      // parse lines we understand
      sdp.split(/(\r\n|\r|\n)/).filter(validLine)
          .forEach((l) => {
          const type = l[0];
          const content = l.slice(2);
          if (type === 'm') {
              media.push({ rtp: [], fmtp: [] });
              location = media[media.length - 1]; // point at latest media line
          }
          for (let j = 0; j < (grammar[type] || []).length; j += 1) {
              const obj = grammar[type][j];
              if (obj.reg.test(content)) {
                  parseReg(obj, location, content);
                  return;
              }
          }
      });
      session.media = media; // link it up
      return session;
  }
  function paramReducer(acc, expr) {
      const s = expr.split(/=(.+)/, 2);
      if (s.length === 2) {
          acc[s[0]] = toIntIfInt(s[1]);
      }
      return acc;
  }
  function parseParams(str) {
      return str.split(/\;\s?/).reduce(paramReducer, {});
  }
  // For backward compatibility - alias will be removed in 3.0.0
  const parseFmtpConfig = parseParams;
  function parsePayloads(str) {
      return str.split(' ').map(Number);
  }
  function parseRemoteCandidates(str) {
      const candidates = [];
      const parts = str.split(' ').map(toIntIfInt);
      for (let i = 0; i < parts.length; i += 3) {
          candidates.push({
              component: parts[i],
              ip: parts[i + 1],
              port: parts[i + 2],
          });
      }
      return candidates;
  }
  function parseImageAttributes(str) {
      return str.split(' ').map((item) => {
          return item.substring(1, item.length - 1).split(',')
              .reduce(paramReducer, {});
      });
  }
  function parseSimulcastStreamList(str) {
      return str.split(';').map((stream) => {
          return stream.split(',').map((format) => {
              let scid;
              let paused = false;
              if (format[0] !== '~') {
                  scid = toIntIfInt(format);
              }
              else {
                  scid = toIntIfInt(format.substring(1, format.length));
                  paused = true;
              }
              return {
                  scid,
                  paused,
              };
          });
      });
  }

  // customized util.format - discards excess arguments and can void middle ones
  const formatRegExp = /%[sdv%]/g;
  const format = function (formatStr, ...args) {
      let i = 0;
      const len = args.length;
      return formatStr.replace(formatRegExp, (x) => {
          if (i >= len) {
              return x; // missing argument
          }
          const arg = args[i];
          i += 1;
          switch (x) {
              case '%%':
                  return '%';
              case '%s':
                  return String(arg);
              case '%d':
                  return Number(arg);
              case '%v':
                  return '';
              default:
                  return arg;
          }
      });
      // NB: we discard excess arguments - they are typically undefined from makeLine
  };
  const makeLine = function (type, obj, location) {
      const str = obj.format instanceof Function
          ? (obj.format(obj.push ? location : location[obj.name]))
          : obj.format;
      const formatStr = `${type}=${str}`;
      const args = [];
      if (obj.names) {
          for (let i = 0; i < obj.names.length; i += 1) {
              const n = obj.names[i];
              if (obj.name) {
                  args.push(location[obj.name][n]);
              }
              else { // for mLine and push attributes
                  args.push(location[obj.names[i]]);
              }
          }
      }
      else {
          args.push(location[obj.name]);
      }
      return format(formatStr, ...args);
  };
  // RFC specified order
  // TODO: extend this with all the rest
  const defaultOuterOrder = [
      'v', 'o', 's', 'i',
      'u', 'e', 'p', 'c',
      'b', 't', 'r', 'z', 'a',
  ];
  const defaultInnerOrder = ['i', 'c', 'b', 'a'];
  function write(session, opts) {
      opts = opts || {};
      // ensure certain properties exist
      if (session.version == null) {
          session.version = 0; // 'v=0' must be there (only defined version atm)
      }
      if (session.name == null) {
          session.name = ' '; // 's= ' must be there if no meaningful name set
      }
      session.media.forEach((mLine) => {
          if (mLine.payloads == null) {
              mLine.payloads = '';
          }
      });
      const outerOrder = opts.outerOrder || defaultOuterOrder;
      const innerOrder = opts.innerOrder || defaultInnerOrder;
      const sdp = [];
      // loop through outerOrder for matching properties on session
      outerOrder.forEach((type) => {
          grammar[type].forEach((obj) => {
              if (obj.name in session && session[obj.name] != null) {
                  sdp.push(makeLine(type, obj, session));
              }
              else if (obj.push in session && session[obj.push] != null) {
                  session[obj.push].forEach((el) => {
                      sdp.push(makeLine(type, obj, el));
                  });
              }
          });
      });
      // then for each media line, follow the innerOrder
      session.media.forEach((mLine) => {
          sdp.push(makeLine('m', grammar.m[0], mLine));
          innerOrder.forEach((type) => {
              grammar[type].forEach((obj) => {
                  if (obj.name in mLine && mLine[obj.name] != null) {
                      sdp.push(makeLine(type, obj, mLine));
                  }
                  else if (obj.push in mLine && mLine[obj.push] != null) {
                      mLine[obj.push].forEach((el) => {
                          sdp.push(makeLine(type, obj, el));
                      });
                  }
              });
          });
      });
      return `${sdp.join('\r\n')}\r\n`;
  }

  var index = {
      write,
      parse,
      parseFmtpConfig,
      parseRemoteCandidates,
      parseParams,
      parsePayloads,
      parseImageAttributes,
      parseSimulcastStreamList,
  };

  exports.default = index;
  exports.paramReducer = paramReducer;
  exports.parse = parse;
  exports.parseFmtpConfig = parseFmtpConfig;
  exports.parseImageAttributes = parseImageAttributes;
  exports.parseParams = parseParams;
  exports.parsePayloads = parsePayloads;
  exports.parseReg = parseReg;
  exports.parseRemoteCandidates = parseRemoteCandidates;
  exports.parseSimulcastStreamList = parseSimulcastStreamList;
  exports.write = write;

  return exports;

}({}));
