
import { grammar } from './grammar';

// customized util.format - discards excess arguments and can void middle ones
const formatRegExp = /%[sdv%]/g;
const format = function (formatStr: string, ...args: any[]) {
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

  const formatStr = `${ type }=${ str }`;
  const args = [];

  if (obj.names) {
    for (let i = 0; i < obj.names.length; i += 1) {
      const n = obj.names[i];

      if (obj.name) {
        args.push(location[obj.name][n]);
      } else { // for mLine and push attributes
        args.push(location[obj.names[i]]);
      }
    }
  } else {
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


export function write(session, opts?) {
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
      } else if (obj.push in session && session[obj.push] != null) {
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
        } else if (obj.push in mLine && mLine[obj.push] != null) {
          mLine[obj.push].forEach((el) => {
            sdp.push(makeLine(type, obj, el));
          });
        }
      });
    });
  });

  return `${ sdp.join('\r\n') }\r\n`;
}
