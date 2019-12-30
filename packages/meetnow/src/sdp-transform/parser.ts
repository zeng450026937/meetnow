/* eslint-disable no-useless-escape */
/* eslint-disable no-div-regex */

import { grammar } from './grammar';

function toIntIfInt(v: any) {
  return String(Number(v)) === v ? Number(v) : v;
}

function attachProperties(match: any, location: any, names: any, rawName: any) {
  if (rawName && !names) {
    location[rawName] = toIntIfInt(match[1]);
  } else {
    for (let i = 0; i < names.length; i += 1) {
      if (match[i + 1] != null) {
        location[names[i]] = toIntIfInt(match[i + 1]);
      }
    }
  }
}

export function parseReg(obj: any, location: any, content: any) {
  const needsBlank = obj.name && obj.names;

  if (obj.push && !location[obj.push]) {
    location[obj.push] = [];
  } else if (needsBlank && !location[obj.name]) {
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

export interface SDP {
  version?: number;
  origin?: {
    username: string;
    sessionId: string;
    sessionVersion: number;
    netType: string;
    ipVer: number;
    address: string;
  };
  name?: string;
  description?: string;
  uri?: string;
  email?: string;
  phone?: string;
  timezones?: string;
  repeats?: string;
  timing?: {
    start: number;
    stop: number;
  };
  msidSemantic?: {
    semantic: string;
    token: string;
  };
  groups?: {
    type: string;
    mids: string;
  }[];
  media?: {
    type: string;
    port: number;
    protocol: string;
    payloads: string;
    control?: string;
    connection?: {
      version: number;
      ip: string;
    };
    bandwidth?: {
      type: string;
      limit: number;
    }[];
    rtp?: {
      payload: number | string;
      codec: string;
      rate?: number;
      encoding?: number;
    }[];
    fmtp?: {
      payload: number | string;
      config: string;
    }[];
    rtcp?: {
      port: number;
      netType?: string;
      ipVer?: number;
      address?: string;
    }[];
    rtcpFbTrrInt?: {
      payload: number;
      value: number;
    }[];
    rtcpFb?: {
      payload: number | string;
      type: string;
      subtype?: string;
    }[];
    ext?: {
      value: number;
      direction?: string;
      uri: string;
      config?: string;
    }[];
    crypto?: {
      id: number;
      suite: string;
      config: string;
      sessionConfig?: string;
    }[];
    setup?: string;
    mid?: string | number;
    msid?: string;
    ptime?: number;
    maxptime?: number;
    direction?: 'sendrecv'|'recvonly'|'sendonly'|'inactive';
    icelite?: string;
    iceUfrag?: string;
    icePwd?: string;
    iceOptions?: string;
    fingerprint?: {
      type: string;
      hash: string;
    };
    candidates?: {
      foundation: number;
      component: number;
      transport: string;
      priority: number;
      ip: string;
      port: number;
      type: string;
      raddr?: string;
      rport?: number;
      tcptype?: number;
      generation?: number;
      'network-id'?: number;
      'network-cost'?: number;
    }[];
    endOfCandidates?: string;
    remoteCandidates?: string;
    ssrcs?: {
      id: number;
      attribute?: string;
      value?: string;
    }[];
    ssrcGroups?: {
      semantics: string
      ssrcs: string;
    }[];
    rtcpMux?: string;
    rtcpRsize?: string;
    sctpmap?: {
      sctpmapNumber: number;
      app?: string;
      maxMessageSize?: number;
    };
    xGoogleFlag?: string;
    content?: string;
    label?: number;
    rids?: {
      id: number;
      direction: string;
      params?: string;
    };
    imageattrs?: {
      pt: string;
      dir1: string;
      attrs1: string;
      dir2?: string;
      attrs2?: string;
    };
    simulcast?: {
      dir1: string;
      list1: string;
      dir2?: string;
      list2?: string;
    };
    'simulcast_03'?: {
      value: string;
    };
    framerate?: string;
    sourceFilter?: {
      filterMode: string;
      netType: string;
      addressTypes: string;
      destAddress: string;
      srcList: string;
    };
    invalid?: { value: string }[];
  }[];
}

export function parse(sdp: string): SDP;
export function parse(sdp: string) {
  const media: any[] = [];
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

      for (let j = 0; j < (grammar[(type as keyof typeof grammar)] || []).length; j += 1) {
        const obj = grammar[(type as keyof typeof grammar)][j];

        if ((obj as any).reg.test(content)) {
          parseReg(obj, location, content);
          return;
        }
      }
    });

  session.media = media; // link it up

  return session as SDP;
}

export function paramReducer(acc: any, expr: any) {
  const s = expr.split(/=(.+)/, 2);

  if (s.length === 2) {
    acc[s[0]] = toIntIfInt(s[1]);
  }

  return acc;
}

export function parseParams(str: any) {
  return str.split(/\;\s?/).reduce(paramReducer, {});
}

// For backward compatibility - alias will be removed in 3.0.0
export const parseFmtpConfig = parseParams;

export function parsePayloads(str: any) {
  return str.split(' ').map(Number);
}

export function parseRemoteCandidates(str: any) {
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
}

export function parseImageAttributes(str: any) {
  return str.split(' ').map((item: any) => {
    return item.substring(1, item.length - 1).split(',')
      .reduce(paramReducer, {});
  });
}

export function parseSimulcastStreamList(str: any) {
  return str.split(';').map((stream: any) => {
    return stream.split(',').map((format: any) => {
      let scid; let
        paused = false;

      if (format[0] !== '~') {
        scid = toIntIfInt(format);
      } else {
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
