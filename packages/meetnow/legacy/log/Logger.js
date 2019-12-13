const levelMap = {
  error : {
    color : 'red',
  },
  warn : {
    color : 'orange',
  },
  info : {
    color : 'green',
  },
  log : {
    color : 'pink',
  },
  debug : {
    color : 'purple',
  },
  trace : {
    color : 'blue',
  },
};
// 'ShareChannel', 'MediaChannel', 'DeviceMedia', 'API', 'Media', 'StreamAnalyser', 'VolumeAnalyser', 'UA'
const hideModel = ['API'];

class Logger {
  constructor(options = {}) {
    this.ns = (typeof options === 'object' ? options.ns : options) || 'Default';
    this.prefix = '';
    Object.keys(levelMap).forEach((level) => {
      this[level] = (...args) => {
        if (hideModel.includes(this.ns)) return;

        return this._log(level, levelMap[level], ...args);
      };
    });
  }

  _log(level, config, ...args) {
    const startTime = new Date();
    const asString = (date) => {
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      const hour = String(date.getHours()).padStart(2, '0');
      const minute = String(date.getMinutes()).padStart(2, '0');
      const second = String(date.getSeconds()).padStart(2, '0');

      return `${ year }-${ month }-${ day } ${ hour }:${ minute }:${ second }`;
    };

    console[level](
      `%c${ asString(startTime) } %c[${ this.ns }]: ${ this.prefix }`,
      'color: grey',
      `color: ${ config.color }`,
      ...args,
    );
  }

  _ns(ns) {
    this.ns = ns || 'Default';

    return this;
  }

  attachPrefix(prefix) {
    if (prefix) this.prefix = prefix;
  }
}

export default Logger;
