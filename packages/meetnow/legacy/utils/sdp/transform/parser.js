/* eslint-disable no-useless-escape */
/* eslint-disable no-div-regex */
import grammar from './grammar';

const toIntIfInt = function (v) {
  return String(Number(v)) === v ? Number(v) : v;
};

const attachProperties = function (match, location, names, rawName) {
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
};

const parseReg = function (obj, location, content) {
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
};

const validLine = RegExp.prototype.test.bind(/^([a-z])=(.*)/);

export const parse = function (sdp) {
  const session = {};
  const media = [];

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
          return parseReg(obj, location, content);
        }
      }
    });

  session.media = media; // link it up

  return session;
};

const paramReducer = function (acc, expr) {
  const s = expr.split(/=(.+)/, 2);

  if (s.length === 2) {
    acc[s[0]] = toIntIfInt(s[1]);
  }

  return acc;
};

export const parseParams = function (str) {
  return str.split(/\;\s?/).reduce(paramReducer, {});
};

// For backward compatibility - alias will be removed in 3.0.0
export const parseFmtpConfig = parseParams;

export const parsePayloads = function (str) {
  return str.split(' ').map(Number);
};

export const parseRemoteCandidates = function (str) {
  const candidates = [];
  const parts = str.split(' ').map(toIntIfInt);

  for (let i = 0; i < parts.length; i += 3) {
    candidates.push({
      component : parts[i],
      ip        : parts[i + 1],
      port      : parts[i + 2],
    });
  }

  return candidates;
};

export const parseImageAttributes = function (str) {
  return str.split(' ').map((item) => item.substring(1, item.length - 1).split(',')
    .reduce(paramReducer, {}));
};

export const parseSimulcastStreamList = function (str) {
  return str.split(';').map((stream) => stream.split(',').map((format) => {
    let scid;

    let
      paused = false;

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
  }));
};
