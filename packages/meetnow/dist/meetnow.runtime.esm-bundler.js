/*
 *  Copyright (c) 2016 The WebRTC project authors. All Rights Reserved.
 *
 *  Use of this source code is governed by a BSD-style license
 *  that can be found in the LICENSE file in the root of the source
 *  tree.
 */

let logDisabled_ = true;
let deprecationWarnings_ = true;

/**
 * Extract browser version out of the provided user agent string.
 *
 * @param {!string} uastring userAgent string.
 * @param {!string} expr Regular expression used as match criteria.
 * @param {!number} pos position in the version string to be returned.
 * @return {!number} browser version.
 */
function extractVersion(uastring, expr, pos) {
  const match = uastring.match(expr);
  return match && match.length >= pos && parseInt(match[pos], 10);
}

// Wraps the peerconnection event eventNameToWrap in a function
// which returns the modified event object (or false to prevent
// the event).
function wrapPeerConnectionEvent(window, eventNameToWrap, wrapper) {
  if (!window.RTCPeerConnection) {
    return;
  }
  const proto = window.RTCPeerConnection.prototype;
  const nativeAddEventListener = proto.addEventListener;
  proto.addEventListener = function(nativeEventName, cb) {
    if (nativeEventName !== eventNameToWrap) {
      return nativeAddEventListener.apply(this, arguments);
    }
    const wrappedCallback = (e) => {
      const modifiedEvent = wrapper(e);
      if (modifiedEvent) {
        cb(modifiedEvent);
      }
    };
    this._eventMap = this._eventMap || {};
    this._eventMap[cb] = wrappedCallback;
    return nativeAddEventListener.apply(this, [nativeEventName,
      wrappedCallback]);
  };

  const nativeRemoveEventListener = proto.removeEventListener;
  proto.removeEventListener = function(nativeEventName, cb) {
    if (nativeEventName !== eventNameToWrap || !this._eventMap
        || !this._eventMap[cb]) {
      return nativeRemoveEventListener.apply(this, arguments);
    }
    const unwrappedCb = this._eventMap[cb];
    delete this._eventMap[cb];
    return nativeRemoveEventListener.apply(this, [nativeEventName,
      unwrappedCb]);
  };

  Object.defineProperty(proto, 'on' + eventNameToWrap, {
    get() {
      return this['_on' + eventNameToWrap];
    },
    set(cb) {
      if (this['_on' + eventNameToWrap]) {
        this.removeEventListener(eventNameToWrap,
            this['_on' + eventNameToWrap]);
        delete this['_on' + eventNameToWrap];
      }
      if (cb) {
        this.addEventListener(eventNameToWrap,
            this['_on' + eventNameToWrap] = cb);
      }
    },
    enumerable: true,
    configurable: true
  });
}

function disableLog(bool) {
  if (typeof bool !== 'boolean') {
    return new Error('Argument type: ' + typeof bool +
        '. Please use a boolean.');
  }
  logDisabled_ = bool;
  return (bool) ? 'adapter.js logging disabled' :
      'adapter.js logging enabled';
}

/**
 * Disable or enable deprecation warnings
 * @param {!boolean} bool set to true to disable warnings.
 */
function disableWarnings(bool) {
  if (typeof bool !== 'boolean') {
    return new Error('Argument type: ' + typeof bool +
        '. Please use a boolean.');
  }
  deprecationWarnings_ = !bool;
  return 'adapter.js deprecation warnings ' + (bool ? 'disabled' : 'enabled');
}

function log() {
  if (typeof window === 'object') {
    if (logDisabled_) {
      return;
    }
    if (typeof console !== 'undefined' && typeof console.log === 'function') {
      console.log.apply(console, arguments);
    }
  }
}

/**
 * Shows a deprecation warning suggesting the modern and spec-compatible API.
 */
function deprecated(oldMethod, newMethod) {
  if (!deprecationWarnings_) {
    return;
  }
  console.warn(oldMethod + ' is deprecated, please use ' + newMethod +
      ' instead.');
}

/**
 * Browser detector.
 *
 * @return {object} result containing browser and version
 *     properties.
 */
function detectBrowser(window) {
  const {navigator} = window;

  // Returned result object.
  const result = {browser: null, version: null};

  // Fail early if it's not a browser
  if (typeof window === 'undefined' || !window.navigator) {
    result.browser = 'Not a browser.';
    return result;
  }

  if (navigator.mozGetUserMedia) { // Firefox.
    result.browser = 'firefox';
    result.version = extractVersion(navigator.userAgent,
        /Firefox\/(\d+)\./, 1);
  } else if (navigator.webkitGetUserMedia ||
      (window.isSecureContext === false && window.webkitRTCPeerConnection &&
       !window.RTCIceGatherer)) {
    // Chrome, Chromium, Webview, Opera.
    // Version matches Chrome/WebRTC version.
    // Chrome 74 removed webkitGetUserMedia on http as well so we need the
    // more complicated fallback to webkitRTCPeerConnection.
    result.browser = 'chrome';
    result.version = extractVersion(navigator.userAgent,
        /Chrom(e|ium)\/(\d+)\./, 2);
  } else if (navigator.mediaDevices &&
      navigator.userAgent.match(/Edge\/(\d+).(\d+)$/)) { // Edge.
    result.browser = 'edge';
    result.version = extractVersion(navigator.userAgent,
        /Edge\/(\d+).(\d+)$/, 2);
  } else if (window.RTCPeerConnection &&
      navigator.userAgent.match(/AppleWebKit\/(\d+)\./)) { // Safari.
    result.browser = 'safari';
    result.version = extractVersion(navigator.userAgent,
        /AppleWebKit\/(\d+)\./, 1);
    result.supportsUnifiedPlan = window.RTCRtpTransceiver &&
        'currentDirection' in window.RTCRtpTransceiver.prototype;
  } else { // Default fallthrough: not supported.
    result.browser = 'Not a supported browser.';
    return result;
  }

  return result;
}

/**
 * Checks if something is an object.
 *
 * @param {*} val The something you want to check.
 * @return true if val is an object, false otherwise.
 */
function isObject(val) {
  return Object.prototype.toString.call(val) === '[object Object]';
}

/**
 * Remove all empty objects and undefined values
 * from a nested object -- an enhanced and vanilla version
 * of Lodash's `compact`.
 */
function compactObject(data) {
  if (!isObject(data)) {
    return data;
  }

  return Object.keys(data).reduce(function(accumulator, key) {
    const isObj = isObject(data[key]);
    const value = isObj ? compactObject(data[key]) : data[key];
    const isEmptyObject = isObj && !Object.keys(value).length;
    if (value === undefined || isEmptyObject) {
      return accumulator;
    }
    return Object.assign(accumulator, {[key]: value});
  }, {});
}

/* iterates the stats graph recursively. */
function walkStats(stats, base, resultSet) {
  if (!base || resultSet.has(base.id)) {
    return;
  }
  resultSet.set(base.id, base);
  Object.keys(base).forEach(name => {
    if (name.endsWith('Id')) {
      walkStats(stats, stats.get(base[name]), resultSet);
    } else if (name.endsWith('Ids')) {
      base[name].forEach(id => {
        walkStats(stats, stats.get(id), resultSet);
      });
    }
  });
}

/* filter getStats for a sender/receiver track. */
function filterStats(result, track, outbound) {
  const streamStatsType = outbound ? 'outbound-rtp' : 'inbound-rtp';
  const filteredResult = new Map();
  if (track === null) {
    return filteredResult;
  }
  const trackStats = [];
  result.forEach(value => {
    if (value.type === 'track' &&
        value.trackIdentifier === track.id) {
      trackStats.push(value);
    }
  });
  trackStats.forEach(trackStat => {
    result.forEach(stats => {
      if (stats.type === streamStatsType && stats.trackId === trackStat.id) {
        walkStats(result, stats, filteredResult);
      }
    });
  });
  return filteredResult;
}

/*
 *  Copyright (c) 2016 The WebRTC project authors. All Rights Reserved.
 *
 *  Use of this source code is governed by a BSD-style license
 *  that can be found in the LICENSE file in the root of the source
 *  tree.
 */
const logging = log;

function shimGetUserMedia(window) {
  const navigator = window && window.navigator;

  if (!navigator.mediaDevices) {
    return;
  }

  const browserDetails = detectBrowser(window);

  const constraintsToChrome_ = function(c) {
    if (typeof c !== 'object' || c.mandatory || c.optional) {
      return c;
    }
    const cc = {};
    Object.keys(c).forEach(key => {
      if (key === 'require' || key === 'advanced' || key === 'mediaSource') {
        return;
      }
      const r = (typeof c[key] === 'object') ? c[key] : {ideal: c[key]};
      if (r.exact !== undefined && typeof r.exact === 'number') {
        r.min = r.max = r.exact;
      }
      const oldname_ = function(prefix, name) {
        if (prefix) {
          return prefix + name.charAt(0).toUpperCase() + name.slice(1);
        }
        return (name === 'deviceId') ? 'sourceId' : name;
      };
      if (r.ideal !== undefined) {
        cc.optional = cc.optional || [];
        let oc = {};
        if (typeof r.ideal === 'number') {
          oc[oldname_('min', key)] = r.ideal;
          cc.optional.push(oc);
          oc = {};
          oc[oldname_('max', key)] = r.ideal;
          cc.optional.push(oc);
        } else {
          oc[oldname_('', key)] = r.ideal;
          cc.optional.push(oc);
        }
      }
      if (r.exact !== undefined && typeof r.exact !== 'number') {
        cc.mandatory = cc.mandatory || {};
        cc.mandatory[oldname_('', key)] = r.exact;
      } else {
        ['min', 'max'].forEach(mix => {
          if (r[mix] !== undefined) {
            cc.mandatory = cc.mandatory || {};
            cc.mandatory[oldname_(mix, key)] = r[mix];
          }
        });
      }
    });
    if (c.advanced) {
      cc.optional = (cc.optional || []).concat(c.advanced);
    }
    return cc;
  };

  const shimConstraints_ = function(constraints, func) {
    if (browserDetails.version >= 61) {
      return func(constraints);
    }
    constraints = JSON.parse(JSON.stringify(constraints));
    if (constraints && typeof constraints.audio === 'object') {
      const remap = function(obj, a, b) {
        if (a in obj && !(b in obj)) {
          obj[b] = obj[a];
          delete obj[a];
        }
      };
      constraints = JSON.parse(JSON.stringify(constraints));
      remap(constraints.audio, 'autoGainControl', 'googAutoGainControl');
      remap(constraints.audio, 'noiseSuppression', 'googNoiseSuppression');
      constraints.audio = constraintsToChrome_(constraints.audio);
    }
    if (constraints && typeof constraints.video === 'object') {
      // Shim facingMode for mobile & surface pro.
      let face = constraints.video.facingMode;
      face = face && ((typeof face === 'object') ? face : {ideal: face});
      const getSupportedFacingModeLies = browserDetails.version < 66;

      if ((face && (face.exact === 'user' || face.exact === 'environment' ||
                    face.ideal === 'user' || face.ideal === 'environment')) &&
          !(navigator.mediaDevices.getSupportedConstraints &&
            navigator.mediaDevices.getSupportedConstraints().facingMode &&
            !getSupportedFacingModeLies)) {
        delete constraints.video.facingMode;
        let matches;
        if (face.exact === 'environment' || face.ideal === 'environment') {
          matches = ['back', 'rear'];
        } else if (face.exact === 'user' || face.ideal === 'user') {
          matches = ['front'];
        }
        if (matches) {
          // Look for matches in label, or use last cam for back (typical).
          return navigator.mediaDevices.enumerateDevices()
          .then(devices => {
            devices = devices.filter(d => d.kind === 'videoinput');
            let dev = devices.find(d => matches.some(match =>
              d.label.toLowerCase().includes(match)));
            if (!dev && devices.length && matches.includes('back')) {
              dev = devices[devices.length - 1]; // more likely the back cam
            }
            if (dev) {
              constraints.video.deviceId = face.exact ? {exact: dev.deviceId} :
                                                        {ideal: dev.deviceId};
            }
            constraints.video = constraintsToChrome_(constraints.video);
            logging('chrome: ' + JSON.stringify(constraints));
            return func(constraints);
          });
        }
      }
      constraints.video = constraintsToChrome_(constraints.video);
    }
    logging('chrome: ' + JSON.stringify(constraints));
    return func(constraints);
  };

  const shimError_ = function(e) {
    if (browserDetails.version >= 64) {
      return e;
    }
    return {
      name: {
        PermissionDeniedError: 'NotAllowedError',
        PermissionDismissedError: 'NotAllowedError',
        InvalidStateError: 'NotAllowedError',
        DevicesNotFoundError: 'NotFoundError',
        ConstraintNotSatisfiedError: 'OverconstrainedError',
        TrackStartError: 'NotReadableError',
        MediaDeviceFailedDueToShutdown: 'NotAllowedError',
        MediaDeviceKillSwitchOn: 'NotAllowedError',
        TabCaptureError: 'AbortError',
        ScreenCaptureError: 'AbortError',
        DeviceCaptureError: 'AbortError'
      }[e.name] || e.name,
      message: e.message,
      constraint: e.constraint || e.constraintName,
      toString() {
        return this.name + (this.message && ': ') + this.message;
      }
    };
  };

  const getUserMedia_ = function(constraints, onSuccess, onError) {
    shimConstraints_(constraints, c => {
      navigator.webkitGetUserMedia(c, onSuccess, e => {
        if (onError) {
          onError(shimError_(e));
        }
      });
    });
  };
  navigator.getUserMedia = getUserMedia_.bind(navigator);

  // Even though Chrome 45 has navigator.mediaDevices and a getUserMedia
  // function which returns a Promise, it does not accept spec-style
  // constraints.
  if (navigator.mediaDevices.getUserMedia) {
    const origGetUserMedia = navigator.mediaDevices.getUserMedia.
        bind(navigator.mediaDevices);
    navigator.mediaDevices.getUserMedia = function(cs) {
      return shimConstraints_(cs, c => origGetUserMedia(c).then(stream => {
        if (c.audio && !stream.getAudioTracks().length ||
            c.video && !stream.getVideoTracks().length) {
          stream.getTracks().forEach(track => {
            track.stop();
          });
          throw new DOMException('', 'NotFoundError');
        }
        return stream;
      }, e => Promise.reject(shimError_(e))));
    };
  }
}

/*
 *  Copyright (c) 2018 The adapter.js project authors. All Rights Reserved.
 *
 *  Use of this source code is governed by a BSD-style license
 *  that can be found in the LICENSE file in the root of the source
 *  tree.
 */
function shimGetDisplayMedia(window, getSourceId) {
  if (window.navigator.mediaDevices &&
    'getDisplayMedia' in window.navigator.mediaDevices) {
    return;
  }
  if (!(window.navigator.mediaDevices)) {
    return;
  }
  // getSourceId is a function that returns a promise resolving with
  // the sourceId of the screen/window/tab to be shared.
  if (typeof getSourceId !== 'function') {
    console.error('shimGetDisplayMedia: getSourceId argument is not ' +
        'a function');
    return;
  }
  window.navigator.mediaDevices.getDisplayMedia =
    function getDisplayMedia(constraints) {
      return getSourceId(constraints)
        .then(sourceId => {
          const widthSpecified = constraints.video && constraints.video.width;
          const heightSpecified = constraints.video &&
            constraints.video.height;
          const frameRateSpecified = constraints.video &&
            constraints.video.frameRate;
          constraints.video = {
            mandatory: {
              chromeMediaSource: 'desktop',
              chromeMediaSourceId: sourceId,
              maxFrameRate: frameRateSpecified || 3
            }
          };
          if (widthSpecified) {
            constraints.video.mandatory.maxWidth = widthSpecified;
          }
          if (heightSpecified) {
            constraints.video.mandatory.maxHeight = heightSpecified;
          }
          return window.navigator.mediaDevices.getUserMedia(constraints);
        });
    };
}

function shimMediaStream(window) {
  window.MediaStream = window.MediaStream || window.webkitMediaStream;
}

function shimOnTrack(window) {
  if (typeof window === 'object' && window.RTCPeerConnection && !('ontrack' in
      window.RTCPeerConnection.prototype)) {
    Object.defineProperty(window.RTCPeerConnection.prototype, 'ontrack', {
      get() {
        return this._ontrack;
      },
      set(f) {
        if (this._ontrack) {
          this.removeEventListener('track', this._ontrack);
        }
        this.addEventListener('track', this._ontrack = f);
      },
      enumerable: true,
      configurable: true
    });
    const origSetRemoteDescription =
        window.RTCPeerConnection.prototype.setRemoteDescription;
    window.RTCPeerConnection.prototype.setRemoteDescription =
      function setRemoteDescription() {
        if (!this._ontrackpoly) {
          this._ontrackpoly = (e) => {
            // onaddstream does not fire when a track is added to an existing
            // stream. But stream.onaddtrack is implemented so we use that.
            e.stream.addEventListener('addtrack', te => {
              let receiver;
              if (window.RTCPeerConnection.prototype.getReceivers) {
                receiver = this.getReceivers()
                  .find(r => r.track && r.track.id === te.track.id);
              } else {
                receiver = {track: te.track};
              }

              const event = new Event('track');
              event.track = te.track;
              event.receiver = receiver;
              event.transceiver = {receiver};
              event.streams = [e.stream];
              this.dispatchEvent(event);
            });
            e.stream.getTracks().forEach(track => {
              let receiver;
              if (window.RTCPeerConnection.prototype.getReceivers) {
                receiver = this.getReceivers()
                  .find(r => r.track && r.track.id === track.id);
              } else {
                receiver = {track};
              }
              const event = new Event('track');
              event.track = track;
              event.receiver = receiver;
              event.transceiver = {receiver};
              event.streams = [e.stream];
              this.dispatchEvent(event);
            });
          };
          this.addEventListener('addstream', this._ontrackpoly);
        }
        return origSetRemoteDescription.apply(this, arguments);
      };
  } else {
    // even if RTCRtpTransceiver is in window, it is only used and
    // emitted in unified-plan. Unfortunately this means we need
    // to unconditionally wrap the event.
    wrapPeerConnectionEvent(window, 'track', e => {
      if (!e.transceiver) {
        Object.defineProperty(e, 'transceiver',
          {value: {receiver: e.receiver}});
      }
      return e;
    });
  }
}

function shimGetSendersWithDtmf(window) {
  // Overrides addTrack/removeTrack, depends on shimAddTrackRemoveTrack.
  if (typeof window === 'object' && window.RTCPeerConnection &&
      !('getSenders' in window.RTCPeerConnection.prototype) &&
      'createDTMFSender' in window.RTCPeerConnection.prototype) {
    const shimSenderWithDtmf = function(pc, track) {
      return {
        track,
        get dtmf() {
          if (this._dtmf === undefined) {
            if (track.kind === 'audio') {
              this._dtmf = pc.createDTMFSender(track);
            } else {
              this._dtmf = null;
            }
          }
          return this._dtmf;
        },
        _pc: pc
      };
    };

    // augment addTrack when getSenders is not available.
    if (!window.RTCPeerConnection.prototype.getSenders) {
      window.RTCPeerConnection.prototype.getSenders = function getSenders() {
        this._senders = this._senders || [];
        return this._senders.slice(); // return a copy of the internal state.
      };
      const origAddTrack = window.RTCPeerConnection.prototype.addTrack;
      window.RTCPeerConnection.prototype.addTrack =
        function addTrack(track, stream) {
          let sender = origAddTrack.apply(this, arguments);
          if (!sender) {
            sender = shimSenderWithDtmf(this, track);
            this._senders.push(sender);
          }
          return sender;
        };

      const origRemoveTrack = window.RTCPeerConnection.prototype.removeTrack;
      window.RTCPeerConnection.prototype.removeTrack =
        function removeTrack(sender) {
          origRemoveTrack.apply(this, arguments);
          const idx = this._senders.indexOf(sender);
          if (idx !== -1) {
            this._senders.splice(idx, 1);
          }
        };
    }
    const origAddStream = window.RTCPeerConnection.prototype.addStream;
    window.RTCPeerConnection.prototype.addStream = function addStream(stream) {
      this._senders = this._senders || [];
      origAddStream.apply(this, [stream]);
      stream.getTracks().forEach(track => {
        this._senders.push(shimSenderWithDtmf(this, track));
      });
    };

    const origRemoveStream = window.RTCPeerConnection.prototype.removeStream;
    window.RTCPeerConnection.prototype.removeStream =
      function removeStream(stream) {
        this._senders = this._senders || [];
        origRemoveStream.apply(this, [stream]);

        stream.getTracks().forEach(track => {
          const sender = this._senders.find(s => s.track === track);
          if (sender) { // remove sender
            this._senders.splice(this._senders.indexOf(sender), 1);
          }
        });
      };
  } else if (typeof window === 'object' && window.RTCPeerConnection &&
             'getSenders' in window.RTCPeerConnection.prototype &&
             'createDTMFSender' in window.RTCPeerConnection.prototype &&
             window.RTCRtpSender &&
             !('dtmf' in window.RTCRtpSender.prototype)) {
    const origGetSenders = window.RTCPeerConnection.prototype.getSenders;
    window.RTCPeerConnection.prototype.getSenders = function getSenders() {
      const senders = origGetSenders.apply(this, []);
      senders.forEach(sender => sender._pc = this);
      return senders;
    };

    Object.defineProperty(window.RTCRtpSender.prototype, 'dtmf', {
      get() {
        if (this._dtmf === undefined) {
          if (this.track.kind === 'audio') {
            this._dtmf = this._pc.createDTMFSender(this.track);
          } else {
            this._dtmf = null;
          }
        }
        return this._dtmf;
      }
    });
  }
}

function shimGetStats(window) {
  if (!window.RTCPeerConnection) {
    return;
  }

  const origGetStats = window.RTCPeerConnection.prototype.getStats;
  window.RTCPeerConnection.prototype.getStats = function getStats() {
    const [selector, onSucc, onErr] = arguments;

    // If selector is a function then we are in the old style stats so just
    // pass back the original getStats format to avoid breaking old users.
    if (arguments.length > 0 && typeof selector === 'function') {
      return origGetStats.apply(this, arguments);
    }

    // When spec-style getStats is supported, return those when called with
    // either no arguments or the selector argument is null.
    if (origGetStats.length === 0 && (arguments.length === 0 ||
        typeof selector !== 'function')) {
      return origGetStats.apply(this, []);
    }

    const fixChromeStats_ = function(response) {
      const standardReport = {};
      const reports = response.result();
      reports.forEach(report => {
        const standardStats = {
          id: report.id,
          timestamp: report.timestamp,
          type: {
            localcandidate: 'local-candidate',
            remotecandidate: 'remote-candidate'
          }[report.type] || report.type
        };
        report.names().forEach(name => {
          standardStats[name] = report.stat(name);
        });
        standardReport[standardStats.id] = standardStats;
      });

      return standardReport;
    };

    // shim getStats with maplike support
    const makeMapStats = function(stats) {
      return new Map(Object.keys(stats).map(key => [key, stats[key]]));
    };

    if (arguments.length >= 2) {
      const successCallbackWrapper_ = function(response) {
        onSucc(makeMapStats(fixChromeStats_(response)));
      };

      return origGetStats.apply(this, [successCallbackWrapper_,
        selector]);
    }

    // promise-support
    return new Promise((resolve, reject) => {
      origGetStats.apply(this, [
        function(response) {
          resolve(makeMapStats(fixChromeStats_(response)));
        }, reject]);
    }).then(onSucc, onErr);
  };
}

function shimSenderReceiverGetStats(window) {
  if (!(typeof window === 'object' && window.RTCPeerConnection &&
      window.RTCRtpSender && window.RTCRtpReceiver)) {
    return;
  }

  // shim sender stats.
  if (!('getStats' in window.RTCRtpSender.prototype)) {
    const origGetSenders = window.RTCPeerConnection.prototype.getSenders;
    if (origGetSenders) {
      window.RTCPeerConnection.prototype.getSenders = function getSenders() {
        const senders = origGetSenders.apply(this, []);
        senders.forEach(sender => sender._pc = this);
        return senders;
      };
    }

    const origAddTrack = window.RTCPeerConnection.prototype.addTrack;
    if (origAddTrack) {
      window.RTCPeerConnection.prototype.addTrack = function addTrack() {
        const sender = origAddTrack.apply(this, arguments);
        sender._pc = this;
        return sender;
      };
    }
    window.RTCRtpSender.prototype.getStats = function getStats() {
      const sender = this;
      return this._pc.getStats().then(result =>
        /* Note: this will include stats of all senders that
         *   send a track with the same id as sender.track as
         *   it is not possible to identify the RTCRtpSender.
         */
        filterStats(result, sender.track, true));
    };
  }

  // shim receiver stats.
  if (!('getStats' in window.RTCRtpReceiver.prototype)) {
    const origGetReceivers = window.RTCPeerConnection.prototype.getReceivers;
    if (origGetReceivers) {
      window.RTCPeerConnection.prototype.getReceivers =
        function getReceivers() {
          const receivers = origGetReceivers.apply(this, []);
          receivers.forEach(receiver => receiver._pc = this);
          return receivers;
        };
    }
    wrapPeerConnectionEvent(window, 'track', e => {
      e.receiver._pc = e.srcElement;
      return e;
    });
    window.RTCRtpReceiver.prototype.getStats = function getStats() {
      const receiver = this;
      return this._pc.getStats().then(result =>
        filterStats(result, receiver.track, false));
    };
  }

  if (!('getStats' in window.RTCRtpSender.prototype &&
      'getStats' in window.RTCRtpReceiver.prototype)) {
    return;
  }

  // shim RTCPeerConnection.getStats(track).
  const origGetStats = window.RTCPeerConnection.prototype.getStats;
  window.RTCPeerConnection.prototype.getStats = function getStats() {
    if (arguments.length > 0 &&
        arguments[0] instanceof window.MediaStreamTrack) {
      const track = arguments[0];
      let sender;
      let receiver;
      let err;
      this.getSenders().forEach(s => {
        if (s.track === track) {
          if (sender) {
            err = true;
          } else {
            sender = s;
          }
        }
      });
      this.getReceivers().forEach(r => {
        if (r.track === track) {
          if (receiver) {
            err = true;
          } else {
            receiver = r;
          }
        }
        return r.track === track;
      });
      if (err || (sender && receiver)) {
        return Promise.reject(new DOMException(
          'There are more than one sender or receiver for the track.',
          'InvalidAccessError'));
      } else if (sender) {
        return sender.getStats();
      } else if (receiver) {
        return receiver.getStats();
      }
      return Promise.reject(new DOMException(
        'There is no sender or receiver for the track.',
        'InvalidAccessError'));
    }
    return origGetStats.apply(this, arguments);
  };
}

function shimAddTrackRemoveTrackWithNative(window) {
  // shim addTrack/removeTrack with native variants in order to make
  // the interactions with legacy getLocalStreams behave as in other browsers.
  // Keeps a mapping stream.id => [stream, rtpsenders...]
  window.RTCPeerConnection.prototype.getLocalStreams =
    function getLocalStreams() {
      this._shimmedLocalStreams = this._shimmedLocalStreams || {};
      return Object.keys(this._shimmedLocalStreams)
        .map(streamId => this._shimmedLocalStreams[streamId][0]);
    };

  const origAddTrack = window.RTCPeerConnection.prototype.addTrack;
  window.RTCPeerConnection.prototype.addTrack =
    function addTrack(track, stream) {
      if (!stream) {
        return origAddTrack.apply(this, arguments);
      }
      this._shimmedLocalStreams = this._shimmedLocalStreams || {};

      const sender = origAddTrack.apply(this, arguments);
      if (!this._shimmedLocalStreams[stream.id]) {
        this._shimmedLocalStreams[stream.id] = [stream, sender];
      } else if (this._shimmedLocalStreams[stream.id].indexOf(sender) === -1) {
        this._shimmedLocalStreams[stream.id].push(sender);
      }
      return sender;
    };

  const origAddStream = window.RTCPeerConnection.prototype.addStream;
  window.RTCPeerConnection.prototype.addStream = function addStream(stream) {
    this._shimmedLocalStreams = this._shimmedLocalStreams || {};

    stream.getTracks().forEach(track => {
      const alreadyExists = this.getSenders().find(s => s.track === track);
      if (alreadyExists) {
        throw new DOMException('Track already exists.',
            'InvalidAccessError');
      }
    });
    const existingSenders = this.getSenders();
    origAddStream.apply(this, arguments);
    const newSenders = this.getSenders()
      .filter(newSender => existingSenders.indexOf(newSender) === -1);
    this._shimmedLocalStreams[stream.id] = [stream].concat(newSenders);
  };

  const origRemoveStream = window.RTCPeerConnection.prototype.removeStream;
  window.RTCPeerConnection.prototype.removeStream =
    function removeStream(stream) {
      this._shimmedLocalStreams = this._shimmedLocalStreams || {};
      delete this._shimmedLocalStreams[stream.id];
      return origRemoveStream.apply(this, arguments);
    };

  const origRemoveTrack = window.RTCPeerConnection.prototype.removeTrack;
  window.RTCPeerConnection.prototype.removeTrack =
    function removeTrack(sender) {
      this._shimmedLocalStreams = this._shimmedLocalStreams || {};
      if (sender) {
        Object.keys(this._shimmedLocalStreams).forEach(streamId => {
          const idx = this._shimmedLocalStreams[streamId].indexOf(sender);
          if (idx !== -1) {
            this._shimmedLocalStreams[streamId].splice(idx, 1);
          }
          if (this._shimmedLocalStreams[streamId].length === 1) {
            delete this._shimmedLocalStreams[streamId];
          }
        });
      }
      return origRemoveTrack.apply(this, arguments);
    };
}

function shimAddTrackRemoveTrack(window) {
  if (!window.RTCPeerConnection) {
    return;
  }
  const browserDetails = detectBrowser(window);
  // shim addTrack and removeTrack.
  if (window.RTCPeerConnection.prototype.addTrack &&
      browserDetails.version >= 65) {
    return shimAddTrackRemoveTrackWithNative(window);
  }

  // also shim pc.getLocalStreams when addTrack is shimmed
  // to return the original streams.
  const origGetLocalStreams = window.RTCPeerConnection.prototype
      .getLocalStreams;
  window.RTCPeerConnection.prototype.getLocalStreams =
    function getLocalStreams() {
      const nativeStreams = origGetLocalStreams.apply(this);
      this._reverseStreams = this._reverseStreams || {};
      return nativeStreams.map(stream => this._reverseStreams[stream.id]);
    };

  const origAddStream = window.RTCPeerConnection.prototype.addStream;
  window.RTCPeerConnection.prototype.addStream = function addStream(stream) {
    this._streams = this._streams || {};
    this._reverseStreams = this._reverseStreams || {};

    stream.getTracks().forEach(track => {
      const alreadyExists = this.getSenders().find(s => s.track === track);
      if (alreadyExists) {
        throw new DOMException('Track already exists.',
            'InvalidAccessError');
      }
    });
    // Add identity mapping for consistency with addTrack.
    // Unless this is being used with a stream from addTrack.
    if (!this._reverseStreams[stream.id]) {
      const newStream = new window.MediaStream(stream.getTracks());
      this._streams[stream.id] = newStream;
      this._reverseStreams[newStream.id] = stream;
      stream = newStream;
    }
    origAddStream.apply(this, [stream]);
  };

  const origRemoveStream = window.RTCPeerConnection.prototype.removeStream;
  window.RTCPeerConnection.prototype.removeStream =
    function removeStream(stream) {
      this._streams = this._streams || {};
      this._reverseStreams = this._reverseStreams || {};

      origRemoveStream.apply(this, [(this._streams[stream.id] || stream)]);
      delete this._reverseStreams[(this._streams[stream.id] ?
          this._streams[stream.id].id : stream.id)];
      delete this._streams[stream.id];
    };

  window.RTCPeerConnection.prototype.addTrack =
    function addTrack(track, stream) {
      if (this.signalingState === 'closed') {
        throw new DOMException(
          'The RTCPeerConnection\'s signalingState is \'closed\'.',
          'InvalidStateError');
      }
      const streams = [].slice.call(arguments, 1);
      if (streams.length !== 1 ||
          !streams[0].getTracks().find(t => t === track)) {
        // this is not fully correct but all we can manage without
        // [[associated MediaStreams]] internal slot.
        throw new DOMException(
          'The adapter.js addTrack polyfill only supports a single ' +
          ' stream which is associated with the specified track.',
          'NotSupportedError');
      }

      const alreadyExists = this.getSenders().find(s => s.track === track);
      if (alreadyExists) {
        throw new DOMException('Track already exists.',
            'InvalidAccessError');
      }

      this._streams = this._streams || {};
      this._reverseStreams = this._reverseStreams || {};
      const oldStream = this._streams[stream.id];
      if (oldStream) {
        // this is using odd Chrome behaviour, use with caution:
        // https://bugs.chromium.org/p/webrtc/issues/detail?id=7815
        // Note: we rely on the high-level addTrack/dtmf shim to
        // create the sender with a dtmf sender.
        oldStream.addTrack(track);

        // Trigger ONN async.
        Promise.resolve().then(() => {
          this.dispatchEvent(new Event('negotiationneeded'));
        });
      } else {
        const newStream = new window.MediaStream([track]);
        this._streams[stream.id] = newStream;
        this._reverseStreams[newStream.id] = stream;
        this.addStream(newStream);
      }
      return this.getSenders().find(s => s.track === track);
    };

  // replace the internal stream id with the external one and
  // vice versa.
  function replaceInternalStreamId(pc, description) {
    let sdp = description.sdp;
    Object.keys(pc._reverseStreams || []).forEach(internalId => {
      const externalStream = pc._reverseStreams[internalId];
      const internalStream = pc._streams[externalStream.id];
      sdp = sdp.replace(new RegExp(internalStream.id, 'g'),
          externalStream.id);
    });
    return new RTCSessionDescription({
      type: description.type,
      sdp
    });
  }
  function replaceExternalStreamId(pc, description) {
    let sdp = description.sdp;
    Object.keys(pc._reverseStreams || []).forEach(internalId => {
      const externalStream = pc._reverseStreams[internalId];
      const internalStream = pc._streams[externalStream.id];
      sdp = sdp.replace(new RegExp(externalStream.id, 'g'),
          internalStream.id);
    });
    return new RTCSessionDescription({
      type: description.type,
      sdp
    });
  }
  ['createOffer', 'createAnswer'].forEach(function(method) {
    const nativeMethod = window.RTCPeerConnection.prototype[method];
    const methodObj = {[method]() {
      const args = arguments;
      const isLegacyCall = arguments.length &&
          typeof arguments[0] === 'function';
      if (isLegacyCall) {
        return nativeMethod.apply(this, [
          (description) => {
            const desc = replaceInternalStreamId(this, description);
            args[0].apply(null, [desc]);
          },
          (err) => {
            if (args[1]) {
              args[1].apply(null, err);
            }
          }, arguments[2]
        ]);
      }
      return nativeMethod.apply(this, arguments)
      .then(description => replaceInternalStreamId(this, description));
    }};
    window.RTCPeerConnection.prototype[method] = methodObj[method];
  });

  const origSetLocalDescription =
      window.RTCPeerConnection.prototype.setLocalDescription;
  window.RTCPeerConnection.prototype.setLocalDescription =
    function setLocalDescription() {
      if (!arguments.length || !arguments[0].type) {
        return origSetLocalDescription.apply(this, arguments);
      }
      arguments[0] = replaceExternalStreamId(this, arguments[0]);
      return origSetLocalDescription.apply(this, arguments);
    };

  // TODO: mangle getStats: https://w3c.github.io/webrtc-stats/#dom-rtcmediastreamstats-streamidentifier

  const origLocalDescription = Object.getOwnPropertyDescriptor(
      window.RTCPeerConnection.prototype, 'localDescription');
  Object.defineProperty(window.RTCPeerConnection.prototype,
      'localDescription', {
        get() {
          const description = origLocalDescription.get.apply(this);
          if (description.type === '') {
            return description;
          }
          return replaceInternalStreamId(this, description);
        }
      });

  window.RTCPeerConnection.prototype.removeTrack =
    function removeTrack(sender) {
      if (this.signalingState === 'closed') {
        throw new DOMException(
          'The RTCPeerConnection\'s signalingState is \'closed\'.',
          'InvalidStateError');
      }
      // We can not yet check for sender instanceof RTCRtpSender
      // since we shim RTPSender. So we check if sender._pc is set.
      if (!sender._pc) {
        throw new DOMException('Argument 1 of RTCPeerConnection.removeTrack ' +
            'does not implement interface RTCRtpSender.', 'TypeError');
      }
      const isLocal = sender._pc === this;
      if (!isLocal) {
        throw new DOMException('Sender was not created by this connection.',
            'InvalidAccessError');
      }

      // Search for the native stream the senders track belongs to.
      this._streams = this._streams || {};
      let stream;
      Object.keys(this._streams).forEach(streamid => {
        const hasTrack = this._streams[streamid].getTracks()
          .find(track => sender.track === track);
        if (hasTrack) {
          stream = this._streams[streamid];
        }
      });

      if (stream) {
        if (stream.getTracks().length === 1) {
          // if this is the last track of the stream, remove the stream. This
          // takes care of any shimmed _senders.
          this.removeStream(this._reverseStreams[stream.id]);
        } else {
          // relying on the same odd chrome behaviour as above.
          stream.removeTrack(sender.track);
        }
        this.dispatchEvent(new Event('negotiationneeded'));
      }
    };
}

function shimPeerConnection(window) {
  const browserDetails = detectBrowser(window);

  if (!window.RTCPeerConnection && window.webkitRTCPeerConnection) {
    // very basic support for old versions.
    window.RTCPeerConnection = window.webkitRTCPeerConnection;
  }
  if (!window.RTCPeerConnection) {
    return;
  }

  // shim implicit creation of RTCSessionDescription/RTCIceCandidate
  if (browserDetails.version < 53) {
    ['setLocalDescription', 'setRemoteDescription', 'addIceCandidate']
        .forEach(function(method) {
          const nativeMethod = window.RTCPeerConnection.prototype[method];
          const methodObj = {[method]() {
            arguments[0] = new ((method === 'addIceCandidate') ?
                window.RTCIceCandidate :
                window.RTCSessionDescription)(arguments[0]);
            return nativeMethod.apply(this, arguments);
          }};
          window.RTCPeerConnection.prototype[method] = methodObj[method];
        });
  }

  // support for addIceCandidate(null or undefined)
  const nativeAddIceCandidate =
      window.RTCPeerConnection.prototype.addIceCandidate;
  window.RTCPeerConnection.prototype.addIceCandidate =
    function addIceCandidate() {
      if (!arguments[0]) {
        if (arguments[1]) {
          arguments[1].apply(null);
        }
        return Promise.resolve();
      }
      // Firefox 68+ emits and processes {candidate: "", ...}, ignore
      // in older versions. Native support planned for Chrome M77.
      if (browserDetails.version < 78 &&
        arguments[0] && arguments[0].candidate === '') {
        return Promise.resolve();
      }
      return nativeAddIceCandidate.apply(this, arguments);
    };
}

function fixNegotiationNeeded(window) {
  wrapPeerConnectionEvent(window, 'negotiationneeded', e => {
    const pc = e.target;
    if (pc.signalingState !== 'stable') {
      return;
    }
    return e;
  });
}

var chromeShim = /*#__PURE__*/Object.freeze({
  __proto__: null,
  shimMediaStream: shimMediaStream,
  shimOnTrack: shimOnTrack,
  shimGetSendersWithDtmf: shimGetSendersWithDtmf,
  shimGetStats: shimGetStats,
  shimSenderReceiverGetStats: shimSenderReceiverGetStats,
  shimAddTrackRemoveTrackWithNative: shimAddTrackRemoveTrackWithNative,
  shimAddTrackRemoveTrack: shimAddTrackRemoveTrack,
  shimPeerConnection: shimPeerConnection,
  fixNegotiationNeeded: fixNegotiationNeeded,
  shimGetUserMedia: shimGetUserMedia,
  shimGetDisplayMedia: shimGetDisplayMedia
});

/*
 *  Copyright (c) 2018 The WebRTC project authors. All Rights Reserved.
 *
 *  Use of this source code is governed by a BSD-style license
 *  that can be found in the LICENSE file in the root of the source
 *  tree.
 */
// Edge does not like
// 1) stun: filtered after 14393 unless ?transport=udp is present
// 2) turn: that does not have all of turn:host:port?transport=udp
// 3) turn: with ipv6 addresses
// 4) turn: occurring muliple times
function filterIceServers(iceServers, edgeVersion) {
  let hasTurn = false;
  iceServers = JSON.parse(JSON.stringify(iceServers));
  return iceServers.filter(server => {
    if (server && (server.urls || server.url)) {
      var urls = server.urls || server.url;
      if (server.url && !server.urls) {
        deprecated('RTCIceServer.url', 'RTCIceServer.urls');
      }
      const isString = typeof urls === 'string';
      if (isString) {
        urls = [urls];
      }
      urls = urls.filter(url => {
        // filter STUN unconditionally.
        if (url.indexOf('stun:') === 0) {
          return false;
        }

        const validTurn = url.startsWith('turn') &&
            !url.startsWith('turn:[') &&
            url.includes('transport=udp');
        if (validTurn && !hasTurn) {
          hasTurn = true;
          return true;
        }
        return validTurn && !hasTurn;
      });

      delete server.url;
      server.urls = isString ? urls[0] : urls;
      return !!urls.length;
    }
  });
}

function createCommonjsModule(fn, module) {
	return module = { exports: {} }, fn(module, module.exports), module.exports;
}

var sdp = createCommonjsModule(function (module) {

// SDP helpers.
var SDPUtils = {};

// Generate an alphanumeric identifier for cname or mids.
// TODO: use UUIDs instead? https://gist.github.com/jed/982883
SDPUtils.generateIdentifier = function() {
  return Math.random().toString(36).substr(2, 10);
};

// The RTCP CNAME used by all peerconnections from the same JS.
SDPUtils.localCName = SDPUtils.generateIdentifier();

// Splits SDP into lines, dealing with both CRLF and LF.
SDPUtils.splitLines = function(blob) {
  return blob.trim().split('\n').map(function(line) {
    return line.trim();
  });
};
// Splits SDP into sessionpart and mediasections. Ensures CRLF.
SDPUtils.splitSections = function(blob) {
  var parts = blob.split('\nm=');
  return parts.map(function(part, index) {
    return (index > 0 ? 'm=' + part : part).trim() + '\r\n';
  });
};

// returns the session description.
SDPUtils.getDescription = function(blob) {
  var sections = SDPUtils.splitSections(blob);
  return sections && sections[0];
};

// returns the individual media sections.
SDPUtils.getMediaSections = function(blob) {
  var sections = SDPUtils.splitSections(blob);
  sections.shift();
  return sections;
};

// Returns lines that start with a certain prefix.
SDPUtils.matchPrefix = function(blob, prefix) {
  return SDPUtils.splitLines(blob).filter(function(line) {
    return line.indexOf(prefix) === 0;
  });
};

// Parses an ICE candidate line. Sample input:
// candidate:702786350 2 udp 41819902 8.8.8.8 60769 typ relay raddr 8.8.8.8
// rport 55996"
SDPUtils.parseCandidate = function(line) {
  var parts;
  // Parse both variants.
  if (line.indexOf('a=candidate:') === 0) {
    parts = line.substring(12).split(' ');
  } else {
    parts = line.substring(10).split(' ');
  }

  var candidate = {
    foundation: parts[0],
    component: parseInt(parts[1], 10),
    protocol: parts[2].toLowerCase(),
    priority: parseInt(parts[3], 10),
    ip: parts[4],
    address: parts[4], // address is an alias for ip.
    port: parseInt(parts[5], 10),
    // skip parts[6] == 'typ'
    type: parts[7]
  };

  for (var i = 8; i < parts.length; i += 2) {
    switch (parts[i]) {
      case 'raddr':
        candidate.relatedAddress = parts[i + 1];
        break;
      case 'rport':
        candidate.relatedPort = parseInt(parts[i + 1], 10);
        break;
      case 'tcptype':
        candidate.tcpType = parts[i + 1];
        break;
      case 'ufrag':
        candidate.ufrag = parts[i + 1]; // for backward compability.
        candidate.usernameFragment = parts[i + 1];
        break;
      default: // extension handling, in particular ufrag
        candidate[parts[i]] = parts[i + 1];
        break;
    }
  }
  return candidate;
};

// Translates a candidate object into SDP candidate attribute.
SDPUtils.writeCandidate = function(candidate) {
  var sdp = [];
  sdp.push(candidate.foundation);
  sdp.push(candidate.component);
  sdp.push(candidate.protocol.toUpperCase());
  sdp.push(candidate.priority);
  sdp.push(candidate.address || candidate.ip);
  sdp.push(candidate.port);

  var type = candidate.type;
  sdp.push('typ');
  sdp.push(type);
  if (type !== 'host' && candidate.relatedAddress &&
      candidate.relatedPort) {
    sdp.push('raddr');
    sdp.push(candidate.relatedAddress);
    sdp.push('rport');
    sdp.push(candidate.relatedPort);
  }
  if (candidate.tcpType && candidate.protocol.toLowerCase() === 'tcp') {
    sdp.push('tcptype');
    sdp.push(candidate.tcpType);
  }
  if (candidate.usernameFragment || candidate.ufrag) {
    sdp.push('ufrag');
    sdp.push(candidate.usernameFragment || candidate.ufrag);
  }
  return 'candidate:' + sdp.join(' ');
};

// Parses an ice-options line, returns an array of option tags.
// a=ice-options:foo bar
SDPUtils.parseIceOptions = function(line) {
  return line.substr(14).split(' ');
};

// Parses an rtpmap line, returns RTCRtpCoddecParameters. Sample input:
// a=rtpmap:111 opus/48000/2
SDPUtils.parseRtpMap = function(line) {
  var parts = line.substr(9).split(' ');
  var parsed = {
    payloadType: parseInt(parts.shift(), 10) // was: id
  };

  parts = parts[0].split('/');

  parsed.name = parts[0];
  parsed.clockRate = parseInt(parts[1], 10); // was: clockrate
  parsed.channels = parts.length === 3 ? parseInt(parts[2], 10) : 1;
  // legacy alias, got renamed back to channels in ORTC.
  parsed.numChannels = parsed.channels;
  return parsed;
};

// Generate an a=rtpmap line from RTCRtpCodecCapability or
// RTCRtpCodecParameters.
SDPUtils.writeRtpMap = function(codec) {
  var pt = codec.payloadType;
  if (codec.preferredPayloadType !== undefined) {
    pt = codec.preferredPayloadType;
  }
  var channels = codec.channels || codec.numChannels || 1;
  return 'a=rtpmap:' + pt + ' ' + codec.name + '/' + codec.clockRate +
      (channels !== 1 ? '/' + channels : '') + '\r\n';
};

// Parses an a=extmap line (headerextension from RFC 5285). Sample input:
// a=extmap:2 urn:ietf:params:rtp-hdrext:toffset
// a=extmap:2/sendonly urn:ietf:params:rtp-hdrext:toffset
SDPUtils.parseExtmap = function(line) {
  var parts = line.substr(9).split(' ');
  return {
    id: parseInt(parts[0], 10),
    direction: parts[0].indexOf('/') > 0 ? parts[0].split('/')[1] : 'sendrecv',
    uri: parts[1]
  };
};

// Generates a=extmap line from RTCRtpHeaderExtensionParameters or
// RTCRtpHeaderExtension.
SDPUtils.writeExtmap = function(headerExtension) {
  return 'a=extmap:' + (headerExtension.id || headerExtension.preferredId) +
      (headerExtension.direction && headerExtension.direction !== 'sendrecv'
        ? '/' + headerExtension.direction
        : '') +
      ' ' + headerExtension.uri + '\r\n';
};

// Parses an ftmp line, returns dictionary. Sample input:
// a=fmtp:96 vbr=on;cng=on
// Also deals with vbr=on; cng=on
SDPUtils.parseFmtp = function(line) {
  var parsed = {};
  var kv;
  var parts = line.substr(line.indexOf(' ') + 1).split(';');
  for (var j = 0; j < parts.length; j++) {
    kv = parts[j].trim().split('=');
    parsed[kv[0].trim()] = kv[1];
  }
  return parsed;
};

// Generates an a=ftmp line from RTCRtpCodecCapability or RTCRtpCodecParameters.
SDPUtils.writeFmtp = function(codec) {
  var line = '';
  var pt = codec.payloadType;
  if (codec.preferredPayloadType !== undefined) {
    pt = codec.preferredPayloadType;
  }
  if (codec.parameters && Object.keys(codec.parameters).length) {
    var params = [];
    Object.keys(codec.parameters).forEach(function(param) {
      if (codec.parameters[param]) {
        params.push(param + '=' + codec.parameters[param]);
      } else {
        params.push(param);
      }
    });
    line += 'a=fmtp:' + pt + ' ' + params.join(';') + '\r\n';
  }
  return line;
};

// Parses an rtcp-fb line, returns RTCPRtcpFeedback object. Sample input:
// a=rtcp-fb:98 nack rpsi
SDPUtils.parseRtcpFb = function(line) {
  var parts = line.substr(line.indexOf(' ') + 1).split(' ');
  return {
    type: parts.shift(),
    parameter: parts.join(' ')
  };
};
// Generate a=rtcp-fb lines from RTCRtpCodecCapability or RTCRtpCodecParameters.
SDPUtils.writeRtcpFb = function(codec) {
  var lines = '';
  var pt = codec.payloadType;
  if (codec.preferredPayloadType !== undefined) {
    pt = codec.preferredPayloadType;
  }
  if (codec.rtcpFeedback && codec.rtcpFeedback.length) {
    // FIXME: special handling for trr-int?
    codec.rtcpFeedback.forEach(function(fb) {
      lines += 'a=rtcp-fb:' + pt + ' ' + fb.type +
      (fb.parameter && fb.parameter.length ? ' ' + fb.parameter : '') +
          '\r\n';
    });
  }
  return lines;
};

// Parses an RFC 5576 ssrc media attribute. Sample input:
// a=ssrc:3735928559 cname:something
SDPUtils.parseSsrcMedia = function(line) {
  var sp = line.indexOf(' ');
  var parts = {
    ssrc: parseInt(line.substr(7, sp - 7), 10)
  };
  var colon = line.indexOf(':', sp);
  if (colon > -1) {
    parts.attribute = line.substr(sp + 1, colon - sp - 1);
    parts.value = line.substr(colon + 1);
  } else {
    parts.attribute = line.substr(sp + 1);
  }
  return parts;
};

SDPUtils.parseSsrcGroup = function(line) {
  var parts = line.substr(13).split(' ');
  return {
    semantics: parts.shift(),
    ssrcs: parts.map(function(ssrc) {
      return parseInt(ssrc, 10);
    })
  };
};

// Extracts the MID (RFC 5888) from a media section.
// returns the MID or undefined if no mid line was found.
SDPUtils.getMid = function(mediaSection) {
  var mid = SDPUtils.matchPrefix(mediaSection, 'a=mid:')[0];
  if (mid) {
    return mid.substr(6);
  }
};

SDPUtils.parseFingerprint = function(line) {
  var parts = line.substr(14).split(' ');
  return {
    algorithm: parts[0].toLowerCase(), // algorithm is case-sensitive in Edge.
    value: parts[1]
  };
};

// Extracts DTLS parameters from SDP media section or sessionpart.
// FIXME: for consistency with other functions this should only
//   get the fingerprint line as input. See also getIceParameters.
SDPUtils.getDtlsParameters = function(mediaSection, sessionpart) {
  var lines = SDPUtils.matchPrefix(mediaSection + sessionpart,
    'a=fingerprint:');
  // Note: a=setup line is ignored since we use the 'auto' role.
  // Note2: 'algorithm' is not case sensitive except in Edge.
  return {
    role: 'auto',
    fingerprints: lines.map(SDPUtils.parseFingerprint)
  };
};

// Serializes DTLS parameters to SDP.
SDPUtils.writeDtlsParameters = function(params, setupType) {
  var sdp = 'a=setup:' + setupType + '\r\n';
  params.fingerprints.forEach(function(fp) {
    sdp += 'a=fingerprint:' + fp.algorithm + ' ' + fp.value + '\r\n';
  });
  return sdp;
};

// Parses a=crypto lines into
//   https://rawgit.com/aboba/edgertc/master/msortc-rs4.html#dictionary-rtcsrtpsdesparameters-members
SDPUtils.parseCryptoLine = function(line) {
  var parts = line.substr(9).split(' ');
  return {
    tag: parseInt(parts[0], 10),
    cryptoSuite: parts[1],
    keyParams: parts[2],
    sessionParams: parts.slice(3),
  };
};

SDPUtils.writeCryptoLine = function(parameters) {
  return 'a=crypto:' + parameters.tag + ' ' +
    parameters.cryptoSuite + ' ' +
    (typeof parameters.keyParams === 'object'
      ? SDPUtils.writeCryptoKeyParams(parameters.keyParams)
      : parameters.keyParams) +
    (parameters.sessionParams ? ' ' + parameters.sessionParams.join(' ') : '') +
    '\r\n';
};

// Parses the crypto key parameters into
//   https://rawgit.com/aboba/edgertc/master/msortc-rs4.html#rtcsrtpkeyparam*
SDPUtils.parseCryptoKeyParams = function(keyParams) {
  if (keyParams.indexOf('inline:') !== 0) {
    return null;
  }
  var parts = keyParams.substr(7).split('|');
  return {
    keyMethod: 'inline',
    keySalt: parts[0],
    lifeTime: parts[1],
    mkiValue: parts[2] ? parts[2].split(':')[0] : undefined,
    mkiLength: parts[2] ? parts[2].split(':')[1] : undefined,
  };
};

SDPUtils.writeCryptoKeyParams = function(keyParams) {
  return keyParams.keyMethod + ':'
    + keyParams.keySalt +
    (keyParams.lifeTime ? '|' + keyParams.lifeTime : '') +
    (keyParams.mkiValue && keyParams.mkiLength
      ? '|' + keyParams.mkiValue + ':' + keyParams.mkiLength
      : '');
};

// Extracts all SDES paramters.
SDPUtils.getCryptoParameters = function(mediaSection, sessionpart) {
  var lines = SDPUtils.matchPrefix(mediaSection + sessionpart,
    'a=crypto:');
  return lines.map(SDPUtils.parseCryptoLine);
};

// Parses ICE information from SDP media section or sessionpart.
// FIXME: for consistency with other functions this should only
//   get the ice-ufrag and ice-pwd lines as input.
SDPUtils.getIceParameters = function(mediaSection, sessionpart) {
  var lines = SDPUtils.splitLines(mediaSection);
  // Search in session part, too.
  lines = lines.concat(SDPUtils.splitLines(sessionpart));
  var iceParameters = {
    usernameFragment: lines.filter(function(line) {
      return line.indexOf('a=ice-ufrag:') === 0;
    })[0].substr(12),
    password: lines.filter(function(line) {
      return line.indexOf('a=ice-pwd:') === 0;
    })[0].substr(10)
  };
  return iceParameters;
};

// Serializes ICE parameters to SDP.
SDPUtils.writeIceParameters = function(params) {
  return 'a=ice-ufrag:' + params.usernameFragment + '\r\n' +
      'a=ice-pwd:' + params.password + '\r\n';
};

// Parses the SDP media section and returns RTCRtpParameters.
SDPUtils.parseRtpParameters = function(mediaSection) {
  var description = {
    codecs: [],
    headerExtensions: [],
    fecMechanisms: [],
    rtcp: []
  };
  var lines = SDPUtils.splitLines(mediaSection);
  var mline = lines[0].split(' ');
  for (var i = 3; i < mline.length; i++) { // find all codecs from mline[3..]
    var pt = mline[i];
    var rtpmapline = SDPUtils.matchPrefix(
      mediaSection, 'a=rtpmap:' + pt + ' ')[0];
    if (rtpmapline) {
      var codec = SDPUtils.parseRtpMap(rtpmapline);
      var fmtps = SDPUtils.matchPrefix(
        mediaSection, 'a=fmtp:' + pt + ' ');
      // Only the first a=fmtp:<pt> is considered.
      codec.parameters = fmtps.length ? SDPUtils.parseFmtp(fmtps[0]) : {};
      codec.rtcpFeedback = SDPUtils.matchPrefix(
        mediaSection, 'a=rtcp-fb:' + pt + ' ')
        .map(SDPUtils.parseRtcpFb);
      description.codecs.push(codec);
      // parse FEC mechanisms from rtpmap lines.
      switch (codec.name.toUpperCase()) {
        case 'RED':
        case 'ULPFEC':
          description.fecMechanisms.push(codec.name.toUpperCase());
          break;
      }
    }
  }
  SDPUtils.matchPrefix(mediaSection, 'a=extmap:').forEach(function(line) {
    description.headerExtensions.push(SDPUtils.parseExtmap(line));
  });
  // FIXME: parse rtcp.
  return description;
};

// Generates parts of the SDP media section describing the capabilities /
// parameters.
SDPUtils.writeRtpDescription = function(kind, caps) {
  var sdp = '';

  // Build the mline.
  sdp += 'm=' + kind + ' ';
  sdp += caps.codecs.length > 0 ? '9' : '0'; // reject if no codecs.
  sdp += ' UDP/TLS/RTP/SAVPF ';
  sdp += caps.codecs.map(function(codec) {
    if (codec.preferredPayloadType !== undefined) {
      return codec.preferredPayloadType;
    }
    return codec.payloadType;
  }).join(' ') + '\r\n';

  sdp += 'c=IN IP4 0.0.0.0\r\n';
  sdp += 'a=rtcp:9 IN IP4 0.0.0.0\r\n';

  // Add a=rtpmap lines for each codec. Also fmtp and rtcp-fb.
  caps.codecs.forEach(function(codec) {
    sdp += SDPUtils.writeRtpMap(codec);
    sdp += SDPUtils.writeFmtp(codec);
    sdp += SDPUtils.writeRtcpFb(codec);
  });
  var maxptime = 0;
  caps.codecs.forEach(function(codec) {
    if (codec.maxptime > maxptime) {
      maxptime = codec.maxptime;
    }
  });
  if (maxptime > 0) {
    sdp += 'a=maxptime:' + maxptime + '\r\n';
  }
  sdp += 'a=rtcp-mux\r\n';

  if (caps.headerExtensions) {
    caps.headerExtensions.forEach(function(extension) {
      sdp += SDPUtils.writeExtmap(extension);
    });
  }
  // FIXME: write fecMechanisms.
  return sdp;
};

// Parses the SDP media section and returns an array of
// RTCRtpEncodingParameters.
SDPUtils.parseRtpEncodingParameters = function(mediaSection) {
  var encodingParameters = [];
  var description = SDPUtils.parseRtpParameters(mediaSection);
  var hasRed = description.fecMechanisms.indexOf('RED') !== -1;
  var hasUlpfec = description.fecMechanisms.indexOf('ULPFEC') !== -1;

  // filter a=ssrc:... cname:, ignore PlanB-msid
  var ssrcs = SDPUtils.matchPrefix(mediaSection, 'a=ssrc:')
    .map(function(line) {
      return SDPUtils.parseSsrcMedia(line);
    })
    .filter(function(parts) {
      return parts.attribute === 'cname';
    });
  var primarySsrc = ssrcs.length > 0 && ssrcs[0].ssrc;
  var secondarySsrc;

  var flows = SDPUtils.matchPrefix(mediaSection, 'a=ssrc-group:FID')
    .map(function(line) {
      var parts = line.substr(17).split(' ');
      return parts.map(function(part) {
        return parseInt(part, 10);
      });
    });
  if (flows.length > 0 && flows[0].length > 1 && flows[0][0] === primarySsrc) {
    secondarySsrc = flows[0][1];
  }

  description.codecs.forEach(function(codec) {
    if (codec.name.toUpperCase() === 'RTX' && codec.parameters.apt) {
      var encParam = {
        ssrc: primarySsrc,
        codecPayloadType: parseInt(codec.parameters.apt, 10)
      };
      if (primarySsrc && secondarySsrc) {
        encParam.rtx = {ssrc: secondarySsrc};
      }
      encodingParameters.push(encParam);
      if (hasRed) {
        encParam = JSON.parse(JSON.stringify(encParam));
        encParam.fec = {
          ssrc: primarySsrc,
          mechanism: hasUlpfec ? 'red+ulpfec' : 'red'
        };
        encodingParameters.push(encParam);
      }
    }
  });
  if (encodingParameters.length === 0 && primarySsrc) {
    encodingParameters.push({
      ssrc: primarySsrc
    });
  }

  // we support both b=AS and b=TIAS but interpret AS as TIAS.
  var bandwidth = SDPUtils.matchPrefix(mediaSection, 'b=');
  if (bandwidth.length) {
    if (bandwidth[0].indexOf('b=TIAS:') === 0) {
      bandwidth = parseInt(bandwidth[0].substr(7), 10);
    } else if (bandwidth[0].indexOf('b=AS:') === 0) {
      // use formula from JSEP to convert b=AS to TIAS value.
      bandwidth = parseInt(bandwidth[0].substr(5), 10) * 1000 * 0.95
          - (50 * 40 * 8);
    } else {
      bandwidth = undefined;
    }
    encodingParameters.forEach(function(params) {
      params.maxBitrate = bandwidth;
    });
  }
  return encodingParameters;
};

// parses http://draft.ortc.org/#rtcrtcpparameters*
SDPUtils.parseRtcpParameters = function(mediaSection) {
  var rtcpParameters = {};

  // Gets the first SSRC. Note tha with RTX there might be multiple
  // SSRCs.
  var remoteSsrc = SDPUtils.matchPrefix(mediaSection, 'a=ssrc:')
    .map(function(line) {
      return SDPUtils.parseSsrcMedia(line);
    })
    .filter(function(obj) {
      return obj.attribute === 'cname';
    })[0];
  if (remoteSsrc) {
    rtcpParameters.cname = remoteSsrc.value;
    rtcpParameters.ssrc = remoteSsrc.ssrc;
  }

  // Edge uses the compound attribute instead of reducedSize
  // compound is !reducedSize
  var rsize = SDPUtils.matchPrefix(mediaSection, 'a=rtcp-rsize');
  rtcpParameters.reducedSize = rsize.length > 0;
  rtcpParameters.compound = rsize.length === 0;

  // parses the rtcp-mux attrіbute.
  // Note that Edge does not support unmuxed RTCP.
  var mux = SDPUtils.matchPrefix(mediaSection, 'a=rtcp-mux');
  rtcpParameters.mux = mux.length > 0;

  return rtcpParameters;
};

// parses either a=msid: or a=ssrc:... msid lines and returns
// the id of the MediaStream and MediaStreamTrack.
SDPUtils.parseMsid = function(mediaSection) {
  var parts;
  var spec = SDPUtils.matchPrefix(mediaSection, 'a=msid:');
  if (spec.length === 1) {
    parts = spec[0].substr(7).split(' ');
    return {stream: parts[0], track: parts[1]};
  }
  var planB = SDPUtils.matchPrefix(mediaSection, 'a=ssrc:')
    .map(function(line) {
      return SDPUtils.parseSsrcMedia(line);
    })
    .filter(function(msidParts) {
      return msidParts.attribute === 'msid';
    });
  if (planB.length > 0) {
    parts = planB[0].value.split(' ');
    return {stream: parts[0], track: parts[1]};
  }
};

// SCTP
// parses draft-ietf-mmusic-sctp-sdp-26 first and falls back
// to draft-ietf-mmusic-sctp-sdp-05
SDPUtils.parseSctpDescription = function(mediaSection) {
  var mline = SDPUtils.parseMLine(mediaSection);
  var maxSizeLine = SDPUtils.matchPrefix(mediaSection, 'a=max-message-size:');
  var maxMessageSize;
  if (maxSizeLine.length > 0) {
    maxMessageSize = parseInt(maxSizeLine[0].substr(19), 10);
  }
  if (isNaN(maxMessageSize)) {
    maxMessageSize = 65536;
  }
  var sctpPort = SDPUtils.matchPrefix(mediaSection, 'a=sctp-port:');
  if (sctpPort.length > 0) {
    return {
      port: parseInt(sctpPort[0].substr(12), 10),
      protocol: mline.fmt,
      maxMessageSize: maxMessageSize
    };
  }
  var sctpMapLines = SDPUtils.matchPrefix(mediaSection, 'a=sctpmap:');
  if (sctpMapLines.length > 0) {
    var parts = SDPUtils.matchPrefix(mediaSection, 'a=sctpmap:')[0]
      .substr(10)
      .split(' ');
    return {
      port: parseInt(parts[0], 10),
      protocol: parts[1],
      maxMessageSize: maxMessageSize
    };
  }
};

// SCTP
// outputs the draft-ietf-mmusic-sctp-sdp-26 version that all browsers
// support by now receiving in this format, unless we originally parsed
// as the draft-ietf-mmusic-sctp-sdp-05 format (indicated by the m-line
// protocol of DTLS/SCTP -- without UDP/ or TCP/)
SDPUtils.writeSctpDescription = function(media, sctp) {
  var output = [];
  if (media.protocol !== 'DTLS/SCTP') {
    output = [
      'm=' + media.kind + ' 9 ' + media.protocol + ' ' + sctp.protocol + '\r\n',
      'c=IN IP4 0.0.0.0\r\n',
      'a=sctp-port:' + sctp.port + '\r\n'
    ];
  } else {
    output = [
      'm=' + media.kind + ' 9 ' + media.protocol + ' ' + sctp.port + '\r\n',
      'c=IN IP4 0.0.0.0\r\n',
      'a=sctpmap:' + sctp.port + ' ' + sctp.protocol + ' 65535\r\n'
    ];
  }
  if (sctp.maxMessageSize !== undefined) {
    output.push('a=max-message-size:' + sctp.maxMessageSize + '\r\n');
  }
  return output.join('');
};

// Generate a session ID for SDP.
// https://tools.ietf.org/html/draft-ietf-rtcweb-jsep-20#section-5.2.1
// recommends using a cryptographically random +ve 64-bit value
// but right now this should be acceptable and within the right range
SDPUtils.generateSessionId = function() {
  return Math.random().toString().substr(2, 21);
};

// Write boilder plate for start of SDP
// sessId argument is optional - if not supplied it will
// be generated randomly
// sessVersion is optional and defaults to 2
// sessUser is optional and defaults to 'thisisadapterortc'
SDPUtils.writeSessionBoilerplate = function(sessId, sessVer, sessUser) {
  var sessionId;
  var version = sessVer !== undefined ? sessVer : 2;
  if (sessId) {
    sessionId = sessId;
  } else {
    sessionId = SDPUtils.generateSessionId();
  }
  var user = sessUser || 'thisisadapterortc';
  // FIXME: sess-id should be an NTP timestamp.
  return 'v=0\r\n' +
      'o=' + user + ' ' + sessionId + ' ' + version +
        ' IN IP4 127.0.0.1\r\n' +
      's=-\r\n' +
      't=0 0\r\n';
};

SDPUtils.writeMediaSection = function(transceiver, caps, type, stream) {
  var sdp = SDPUtils.writeRtpDescription(transceiver.kind, caps);

  // Map ICE parameters (ufrag, pwd) to SDP.
  sdp += SDPUtils.writeIceParameters(
    transceiver.iceGatherer.getLocalParameters());

  // Map DTLS parameters to SDP.
  sdp += SDPUtils.writeDtlsParameters(
    transceiver.dtlsTransport.getLocalParameters(),
    type === 'offer' ? 'actpass' : 'active');

  sdp += 'a=mid:' + transceiver.mid + '\r\n';

  if (transceiver.direction) {
    sdp += 'a=' + transceiver.direction + '\r\n';
  } else if (transceiver.rtpSender && transceiver.rtpReceiver) {
    sdp += 'a=sendrecv\r\n';
  } else if (transceiver.rtpSender) {
    sdp += 'a=sendonly\r\n';
  } else if (transceiver.rtpReceiver) {
    sdp += 'a=recvonly\r\n';
  } else {
    sdp += 'a=inactive\r\n';
  }

  if (transceiver.rtpSender) {
    // spec.
    var msid = 'msid:' + stream.id + ' ' +
        transceiver.rtpSender.track.id + '\r\n';
    sdp += 'a=' + msid;

    // for Chrome.
    sdp += 'a=ssrc:' + transceiver.sendEncodingParameters[0].ssrc +
        ' ' + msid;
    if (transceiver.sendEncodingParameters[0].rtx) {
      sdp += 'a=ssrc:' + transceiver.sendEncodingParameters[0].rtx.ssrc +
          ' ' + msid;
      sdp += 'a=ssrc-group:FID ' +
          transceiver.sendEncodingParameters[0].ssrc + ' ' +
          transceiver.sendEncodingParameters[0].rtx.ssrc +
          '\r\n';
    }
  }
  // FIXME: this should be written by writeRtpDescription.
  sdp += 'a=ssrc:' + transceiver.sendEncodingParameters[0].ssrc +
      ' cname:' + SDPUtils.localCName + '\r\n';
  if (transceiver.rtpSender && transceiver.sendEncodingParameters[0].rtx) {
    sdp += 'a=ssrc:' + transceiver.sendEncodingParameters[0].rtx.ssrc +
        ' cname:' + SDPUtils.localCName + '\r\n';
  }
  return sdp;
};

// Gets the direction from the mediaSection or the sessionpart.
SDPUtils.getDirection = function(mediaSection, sessionpart) {
  // Look for sendrecv, sendonly, recvonly, inactive, default to sendrecv.
  var lines = SDPUtils.splitLines(mediaSection);
  for (var i = 0; i < lines.length; i++) {
    switch (lines[i]) {
      case 'a=sendrecv':
      case 'a=sendonly':
      case 'a=recvonly':
      case 'a=inactive':
        return lines[i].substr(2);
        // FIXME: What should happen here?
    }
  }
  if (sessionpart) {
    return SDPUtils.getDirection(sessionpart);
  }
  return 'sendrecv';
};

SDPUtils.getKind = function(mediaSection) {
  var lines = SDPUtils.splitLines(mediaSection);
  var mline = lines[0].split(' ');
  return mline[0].substr(2);
};

SDPUtils.isRejected = function(mediaSection) {
  return mediaSection.split(' ', 2)[1] === '0';
};

SDPUtils.parseMLine = function(mediaSection) {
  var lines = SDPUtils.splitLines(mediaSection);
  var parts = lines[0].substr(2).split(' ');
  return {
    kind: parts[0],
    port: parseInt(parts[1], 10),
    protocol: parts[2],
    fmt: parts.slice(3).join(' ')
  };
};

SDPUtils.parseOLine = function(mediaSection) {
  var line = SDPUtils.matchPrefix(mediaSection, 'o=')[0];
  var parts = line.substr(2).split(' ');
  return {
    username: parts[0],
    sessionId: parts[1],
    sessionVersion: parseInt(parts[2], 10),
    netType: parts[3],
    addressType: parts[4],
    address: parts[5]
  };
};

// a very naive interpretation of a valid SDP.
SDPUtils.isValidSDP = function(blob) {
  if (typeof blob !== 'string' || blob.length === 0) {
    return false;
  }
  var lines = SDPUtils.splitLines(blob);
  for (var i = 0; i < lines.length; i++) {
    if (lines[i].length < 2 || lines[i].charAt(1) !== '=') {
      return false;
    }
    // TODO: check the modifier a bit more.
  }
  return true;
};

// Expose public methods.
{
  module.exports = SDPUtils;
}
});

function fixStatsType(stat) {
  return {
    inboundrtp: 'inbound-rtp',
    outboundrtp: 'outbound-rtp',
    candidatepair: 'candidate-pair',
    localcandidate: 'local-candidate',
    remotecandidate: 'remote-candidate'
  }[stat.type] || stat.type;
}

function writeMediaSection(transceiver, caps, type, stream, dtlsRole) {
  var sdp$1 = sdp.writeRtpDescription(transceiver.kind, caps);

  // Map ICE parameters (ufrag, pwd) to SDP.
  sdp$1 += sdp.writeIceParameters(
      transceiver.iceGatherer.getLocalParameters());

  // Map DTLS parameters to SDP.
  sdp$1 += sdp.writeDtlsParameters(
      transceiver.dtlsTransport.getLocalParameters(),
      type === 'offer' ? 'actpass' : dtlsRole || 'active');

  sdp$1 += 'a=mid:' + transceiver.mid + '\r\n';

  if (transceiver.rtpSender && transceiver.rtpReceiver) {
    sdp$1 += 'a=sendrecv\r\n';
  } else if (transceiver.rtpSender) {
    sdp$1 += 'a=sendonly\r\n';
  } else if (transceiver.rtpReceiver) {
    sdp$1 += 'a=recvonly\r\n';
  } else {
    sdp$1 += 'a=inactive\r\n';
  }

  if (transceiver.rtpSender) {
    var trackId = transceiver.rtpSender._initialTrackId ||
        transceiver.rtpSender.track.id;
    transceiver.rtpSender._initialTrackId = trackId;
    // spec.
    var msid = 'msid:' + (stream ? stream.id : '-') + ' ' +
        trackId + '\r\n';
    sdp$1 += 'a=' + msid;
    // for Chrome. Legacy should no longer be required.
    sdp$1 += 'a=ssrc:' + transceiver.sendEncodingParameters[0].ssrc +
        ' ' + msid;

    // RTX
    if (transceiver.sendEncodingParameters[0].rtx) {
      sdp$1 += 'a=ssrc:' + transceiver.sendEncodingParameters[0].rtx.ssrc +
          ' ' + msid;
      sdp$1 += 'a=ssrc-group:FID ' +
          transceiver.sendEncodingParameters[0].ssrc + ' ' +
          transceiver.sendEncodingParameters[0].rtx.ssrc +
          '\r\n';
    }
  }
  // FIXME: this should be written by writeRtpDescription.
  sdp$1 += 'a=ssrc:' + transceiver.sendEncodingParameters[0].ssrc +
      ' cname:' + sdp.localCName + '\r\n';
  if (transceiver.rtpSender && transceiver.sendEncodingParameters[0].rtx) {
    sdp$1 += 'a=ssrc:' + transceiver.sendEncodingParameters[0].rtx.ssrc +
        ' cname:' + sdp.localCName + '\r\n';
  }
  return sdp$1;
}

// Edge does not like
// 1) stun: filtered after 14393 unless ?transport=udp is present
// 2) turn: that does not have all of turn:host:port?transport=udp
// 3) turn: with ipv6 addresses
// 4) turn: occurring muliple times
function filterIceServers$1(iceServers, edgeVersion) {
  var hasTurn = false;
  iceServers = JSON.parse(JSON.stringify(iceServers));
  return iceServers.filter(function(server) {
    if (server && (server.urls || server.url)) {
      var urls = server.urls || server.url;
      if (server.url && !server.urls) {
        console.warn('RTCIceServer.url is deprecated! Use urls instead.');
      }
      var isString = typeof urls === 'string';
      if (isString) {
        urls = [urls];
      }
      urls = urls.filter(function(url) {
        var validTurn = url.indexOf('turn:') === 0 &&
            url.indexOf('transport=udp') !== -1 &&
            url.indexOf('turn:[') === -1 &&
            !hasTurn;

        if (validTurn) {
          hasTurn = true;
          return true;
        }
        return url.indexOf('stun:') === 0 && edgeVersion >= 14393 &&
            url.indexOf('?transport=udp') === -1;
      });

      delete server.url;
      server.urls = isString ? urls[0] : urls;
      return !!urls.length;
    }
  });
}

// Determines the intersection of local and remote capabilities.
function getCommonCapabilities(localCapabilities, remoteCapabilities) {
  var commonCapabilities = {
    codecs: [],
    headerExtensions: [],
    fecMechanisms: []
  };

  var findCodecByPayloadType = function(pt, codecs) {
    pt = parseInt(pt, 10);
    for (var i = 0; i < codecs.length; i++) {
      if (codecs[i].payloadType === pt ||
          codecs[i].preferredPayloadType === pt) {
        return codecs[i];
      }
    }
  };

  var rtxCapabilityMatches = function(lRtx, rRtx, lCodecs, rCodecs) {
    var lCodec = findCodecByPayloadType(lRtx.parameters.apt, lCodecs);
    var rCodec = findCodecByPayloadType(rRtx.parameters.apt, rCodecs);
    return lCodec && rCodec &&
        lCodec.name.toLowerCase() === rCodec.name.toLowerCase();
  };

  localCapabilities.codecs.forEach(function(lCodec) {
    for (var i = 0; i < remoteCapabilities.codecs.length; i++) {
      var rCodec = remoteCapabilities.codecs[i];
      if (lCodec.name.toLowerCase() === rCodec.name.toLowerCase() &&
          lCodec.clockRate === rCodec.clockRate) {
        if (lCodec.name.toLowerCase() === 'rtx' &&
            lCodec.parameters && rCodec.parameters.apt) {
          // for RTX we need to find the local rtx that has a apt
          // which points to the same local codec as the remote one.
          if (!rtxCapabilityMatches(lCodec, rCodec,
              localCapabilities.codecs, remoteCapabilities.codecs)) {
            continue;
          }
        }
        rCodec = JSON.parse(JSON.stringify(rCodec)); // deepcopy
        // number of channels is the highest common number of channels
        rCodec.numChannels = Math.min(lCodec.numChannels,
            rCodec.numChannels);
        // push rCodec so we reply with offerer payload type
        commonCapabilities.codecs.push(rCodec);

        // determine common feedback mechanisms
        rCodec.rtcpFeedback = rCodec.rtcpFeedback.filter(function(fb) {
          for (var j = 0; j < lCodec.rtcpFeedback.length; j++) {
            if (lCodec.rtcpFeedback[j].type === fb.type &&
                lCodec.rtcpFeedback[j].parameter === fb.parameter) {
              return true;
            }
          }
          return false;
        });
        // FIXME: also need to determine .parameters
        //  see https://github.com/openpeer/ortc/issues/569
        break;
      }
    }
  });

  localCapabilities.headerExtensions.forEach(function(lHeaderExtension) {
    for (var i = 0; i < remoteCapabilities.headerExtensions.length;
         i++) {
      var rHeaderExtension = remoteCapabilities.headerExtensions[i];
      if (lHeaderExtension.uri === rHeaderExtension.uri) {
        commonCapabilities.headerExtensions.push(rHeaderExtension);
        break;
      }
    }
  });

  // FIXME: fecMechanisms
  return commonCapabilities;
}

// is action=setLocalDescription with type allowed in signalingState
function isActionAllowedInSignalingState(action, type, signalingState) {
  return {
    offer: {
      setLocalDescription: ['stable', 'have-local-offer'],
      setRemoteDescription: ['stable', 'have-remote-offer']
    },
    answer: {
      setLocalDescription: ['have-remote-offer', 'have-local-pranswer'],
      setRemoteDescription: ['have-local-offer', 'have-remote-pranswer']
    }
  }[type][action].indexOf(signalingState) !== -1;
}

function maybeAddCandidate(iceTransport, candidate) {
  // Edge's internal representation adds some fields therefore
  // not all fieldѕ are taken into account.
  var alreadyAdded = iceTransport.getRemoteCandidates()
      .find(function(remoteCandidate) {
        return candidate.foundation === remoteCandidate.foundation &&
            candidate.ip === remoteCandidate.ip &&
            candidate.port === remoteCandidate.port &&
            candidate.priority === remoteCandidate.priority &&
            candidate.protocol === remoteCandidate.protocol &&
            candidate.type === remoteCandidate.type;
      });
  if (!alreadyAdded) {
    iceTransport.addRemoteCandidate(candidate);
  }
  return !alreadyAdded;
}


function makeError(name, description) {
  var e = new Error(description);
  e.name = name;
  // legacy error codes from https://heycam.github.io/webidl/#idl-DOMException-error-names
  e.code = {
    NotSupportedError: 9,
    InvalidStateError: 11,
    InvalidAccessError: 15,
    TypeError: undefined,
    OperationError: undefined
  }[name];
  return e;
}

var rtcpeerconnection = function(window, edgeVersion) {
  // https://w3c.github.io/mediacapture-main/#mediastream
  // Helper function to add the track to the stream and
  // dispatch the event ourselves.
  function addTrackToStreamAndFireEvent(track, stream) {
    stream.addTrack(track);
    stream.dispatchEvent(new window.MediaStreamTrackEvent('addtrack',
        {track: track}));
  }

  function removeTrackFromStreamAndFireEvent(track, stream) {
    stream.removeTrack(track);
    stream.dispatchEvent(new window.MediaStreamTrackEvent('removetrack',
        {track: track}));
  }

  function fireAddTrack(pc, track, receiver, streams) {
    var trackEvent = new Event('track');
    trackEvent.track = track;
    trackEvent.receiver = receiver;
    trackEvent.transceiver = {receiver: receiver};
    trackEvent.streams = streams;
    window.setTimeout(function() {
      pc._dispatchEvent('track', trackEvent);
    });
  }

  var RTCPeerConnection = function(config) {
    var pc = this;

    var _eventTarget = document.createDocumentFragment();
    ['addEventListener', 'removeEventListener', 'dispatchEvent']
        .forEach(function(method) {
          pc[method] = _eventTarget[method].bind(_eventTarget);
        });

    this.canTrickleIceCandidates = null;

    this.needNegotiation = false;

    this.localStreams = [];
    this.remoteStreams = [];

    this._localDescription = null;
    this._remoteDescription = null;

    this.signalingState = 'stable';
    this.iceConnectionState = 'new';
    this.connectionState = 'new';
    this.iceGatheringState = 'new';

    config = JSON.parse(JSON.stringify(config || {}));

    this.usingBundle = config.bundlePolicy === 'max-bundle';
    if (config.rtcpMuxPolicy === 'negotiate') {
      throw(makeError('NotSupportedError',
          'rtcpMuxPolicy \'negotiate\' is not supported'));
    } else if (!config.rtcpMuxPolicy) {
      config.rtcpMuxPolicy = 'require';
    }

    switch (config.iceTransportPolicy) {
      case 'all':
      case 'relay':
        break;
      default:
        config.iceTransportPolicy = 'all';
        break;
    }

    switch (config.bundlePolicy) {
      case 'balanced':
      case 'max-compat':
      case 'max-bundle':
        break;
      default:
        config.bundlePolicy = 'balanced';
        break;
    }

    config.iceServers = filterIceServers$1(config.iceServers || [], edgeVersion);

    this._iceGatherers = [];
    if (config.iceCandidatePoolSize) {
      for (var i = config.iceCandidatePoolSize; i > 0; i--) {
        this._iceGatherers.push(new window.RTCIceGatherer({
          iceServers: config.iceServers,
          gatherPolicy: config.iceTransportPolicy
        }));
      }
    } else {
      config.iceCandidatePoolSize = 0;
    }

    this._config = config;

    // per-track iceGathers, iceTransports, dtlsTransports, rtpSenders, ...
    // everything that is needed to describe a SDP m-line.
    this.transceivers = [];

    this._sdpSessionId = sdp.generateSessionId();
    this._sdpSessionVersion = 0;

    this._dtlsRole = undefined; // role for a=setup to use in answers.

    this._isClosed = false;
  };

  Object.defineProperty(RTCPeerConnection.prototype, 'localDescription', {
    configurable: true,
    get: function() {
      return this._localDescription;
    }
  });
  Object.defineProperty(RTCPeerConnection.prototype, 'remoteDescription', {
    configurable: true,
    get: function() {
      return this._remoteDescription;
    }
  });

  // set up event handlers on prototype
  RTCPeerConnection.prototype.onicecandidate = null;
  RTCPeerConnection.prototype.onaddstream = null;
  RTCPeerConnection.prototype.ontrack = null;
  RTCPeerConnection.prototype.onremovestream = null;
  RTCPeerConnection.prototype.onsignalingstatechange = null;
  RTCPeerConnection.prototype.oniceconnectionstatechange = null;
  RTCPeerConnection.prototype.onconnectionstatechange = null;
  RTCPeerConnection.prototype.onicegatheringstatechange = null;
  RTCPeerConnection.prototype.onnegotiationneeded = null;
  RTCPeerConnection.prototype.ondatachannel = null;

  RTCPeerConnection.prototype._dispatchEvent = function(name, event) {
    if (this._isClosed) {
      return;
    }
    this.dispatchEvent(event);
    if (typeof this['on' + name] === 'function') {
      this['on' + name](event);
    }
  };

  RTCPeerConnection.prototype._emitGatheringStateChange = function() {
    var event = new Event('icegatheringstatechange');
    this._dispatchEvent('icegatheringstatechange', event);
  };

  RTCPeerConnection.prototype.getConfiguration = function() {
    return this._config;
  };

  RTCPeerConnection.prototype.getLocalStreams = function() {
    return this.localStreams;
  };

  RTCPeerConnection.prototype.getRemoteStreams = function() {
    return this.remoteStreams;
  };

  // internal helper to create a transceiver object.
  // (which is not yet the same as the WebRTC 1.0 transceiver)
  RTCPeerConnection.prototype._createTransceiver = function(kind, doNotAdd) {
    var hasBundleTransport = this.transceivers.length > 0;
    var transceiver = {
      track: null,
      iceGatherer: null,
      iceTransport: null,
      dtlsTransport: null,
      localCapabilities: null,
      remoteCapabilities: null,
      rtpSender: null,
      rtpReceiver: null,
      kind: kind,
      mid: null,
      sendEncodingParameters: null,
      recvEncodingParameters: null,
      stream: null,
      associatedRemoteMediaStreams: [],
      wantReceive: true
    };
    if (this.usingBundle && hasBundleTransport) {
      transceiver.iceTransport = this.transceivers[0].iceTransport;
      transceiver.dtlsTransport = this.transceivers[0].dtlsTransport;
    } else {
      var transports = this._createIceAndDtlsTransports();
      transceiver.iceTransport = transports.iceTransport;
      transceiver.dtlsTransport = transports.dtlsTransport;
    }
    if (!doNotAdd) {
      this.transceivers.push(transceiver);
    }
    return transceiver;
  };

  RTCPeerConnection.prototype.addTrack = function(track, stream) {
    if (this._isClosed) {
      throw makeError('InvalidStateError',
          'Attempted to call addTrack on a closed peerconnection.');
    }

    var alreadyExists = this.transceivers.find(function(s) {
      return s.track === track;
    });

    if (alreadyExists) {
      throw makeError('InvalidAccessError', 'Track already exists.');
    }

    var transceiver;
    for (var i = 0; i < this.transceivers.length; i++) {
      if (!this.transceivers[i].track &&
          this.transceivers[i].kind === track.kind) {
        transceiver = this.transceivers[i];
      }
    }
    if (!transceiver) {
      transceiver = this._createTransceiver(track.kind);
    }

    this._maybeFireNegotiationNeeded();

    if (this.localStreams.indexOf(stream) === -1) {
      this.localStreams.push(stream);
    }

    transceiver.track = track;
    transceiver.stream = stream;
    transceiver.rtpSender = new window.RTCRtpSender(track,
        transceiver.dtlsTransport);
    return transceiver.rtpSender;
  };

  RTCPeerConnection.prototype.addStream = function(stream) {
    var pc = this;
    if (edgeVersion >= 15025) {
      stream.getTracks().forEach(function(track) {
        pc.addTrack(track, stream);
      });
    } else {
      // Clone is necessary for local demos mostly, attaching directly
      // to two different senders does not work (build 10547).
      // Fixed in 15025 (or earlier)
      var clonedStream = stream.clone();
      stream.getTracks().forEach(function(track, idx) {
        var clonedTrack = clonedStream.getTracks()[idx];
        track.addEventListener('enabled', function(event) {
          clonedTrack.enabled = event.enabled;
        });
      });
      clonedStream.getTracks().forEach(function(track) {
        pc.addTrack(track, clonedStream);
      });
    }
  };

  RTCPeerConnection.prototype.removeTrack = function(sender) {
    if (this._isClosed) {
      throw makeError('InvalidStateError',
          'Attempted to call removeTrack on a closed peerconnection.');
    }

    if (!(sender instanceof window.RTCRtpSender)) {
      throw new TypeError('Argument 1 of RTCPeerConnection.removeTrack ' +
          'does not implement interface RTCRtpSender.');
    }

    var transceiver = this.transceivers.find(function(t) {
      return t.rtpSender === sender;
    });

    if (!transceiver) {
      throw makeError('InvalidAccessError',
          'Sender was not created by this connection.');
    }
    var stream = transceiver.stream;

    transceiver.rtpSender.stop();
    transceiver.rtpSender = null;
    transceiver.track = null;
    transceiver.stream = null;

    // remove the stream from the set of local streams
    var localStreams = this.transceivers.map(function(t) {
      return t.stream;
    });
    if (localStreams.indexOf(stream) === -1 &&
        this.localStreams.indexOf(stream) > -1) {
      this.localStreams.splice(this.localStreams.indexOf(stream), 1);
    }

    this._maybeFireNegotiationNeeded();
  };

  RTCPeerConnection.prototype.removeStream = function(stream) {
    var pc = this;
    stream.getTracks().forEach(function(track) {
      var sender = pc.getSenders().find(function(s) {
        return s.track === track;
      });
      if (sender) {
        pc.removeTrack(sender);
      }
    });
  };

  RTCPeerConnection.prototype.getSenders = function() {
    return this.transceivers.filter(function(transceiver) {
      return !!transceiver.rtpSender;
    })
    .map(function(transceiver) {
      return transceiver.rtpSender;
    });
  };

  RTCPeerConnection.prototype.getReceivers = function() {
    return this.transceivers.filter(function(transceiver) {
      return !!transceiver.rtpReceiver;
    })
    .map(function(transceiver) {
      return transceiver.rtpReceiver;
    });
  };


  RTCPeerConnection.prototype._createIceGatherer = function(sdpMLineIndex,
      usingBundle) {
    var pc = this;
    if (usingBundle && sdpMLineIndex > 0) {
      return this.transceivers[0].iceGatherer;
    } else if (this._iceGatherers.length) {
      return this._iceGatherers.shift();
    }
    var iceGatherer = new window.RTCIceGatherer({
      iceServers: this._config.iceServers,
      gatherPolicy: this._config.iceTransportPolicy
    });
    Object.defineProperty(iceGatherer, 'state',
        {value: 'new', writable: true}
    );

    this.transceivers[sdpMLineIndex].bufferedCandidateEvents = [];
    this.transceivers[sdpMLineIndex].bufferCandidates = function(event) {
      var end = !event.candidate || Object.keys(event.candidate).length === 0;
      // polyfill since RTCIceGatherer.state is not implemented in
      // Edge 10547 yet.
      iceGatherer.state = end ? 'completed' : 'gathering';
      if (pc.transceivers[sdpMLineIndex].bufferedCandidateEvents !== null) {
        pc.transceivers[sdpMLineIndex].bufferedCandidateEvents.push(event);
      }
    };
    iceGatherer.addEventListener('localcandidate',
      this.transceivers[sdpMLineIndex].bufferCandidates);
    return iceGatherer;
  };

  // start gathering from an RTCIceGatherer.
  RTCPeerConnection.prototype._gather = function(mid, sdpMLineIndex) {
    var pc = this;
    var iceGatherer = this.transceivers[sdpMLineIndex].iceGatherer;
    if (iceGatherer.onlocalcandidate) {
      return;
    }
    var bufferedCandidateEvents =
      this.transceivers[sdpMLineIndex].bufferedCandidateEvents;
    this.transceivers[sdpMLineIndex].bufferedCandidateEvents = null;
    iceGatherer.removeEventListener('localcandidate',
      this.transceivers[sdpMLineIndex].bufferCandidates);
    iceGatherer.onlocalcandidate = function(evt) {
      if (pc.usingBundle && sdpMLineIndex > 0) {
        // if we know that we use bundle we can drop candidates with
        // ѕdpMLineIndex > 0. If we don't do this then our state gets
        // confused since we dispose the extra ice gatherer.
        return;
      }
      var event = new Event('icecandidate');
      event.candidate = {sdpMid: mid, sdpMLineIndex: sdpMLineIndex};

      var cand = evt.candidate;
      // Edge emits an empty object for RTCIceCandidateComplete‥
      var end = !cand || Object.keys(cand).length === 0;
      if (end) {
        // polyfill since RTCIceGatherer.state is not implemented in
        // Edge 10547 yet.
        if (iceGatherer.state === 'new' || iceGatherer.state === 'gathering') {
          iceGatherer.state = 'completed';
        }
      } else {
        if (iceGatherer.state === 'new') {
          iceGatherer.state = 'gathering';
        }
        // RTCIceCandidate doesn't have a component, needs to be added
        cand.component = 1;
        // also the usernameFragment. TODO: update SDP to take both variants.
        cand.ufrag = iceGatherer.getLocalParameters().usernameFragment;

        var serializedCandidate = sdp.writeCandidate(cand);
        event.candidate = Object.assign(event.candidate,
            sdp.parseCandidate(serializedCandidate));

        event.candidate.candidate = serializedCandidate;
        event.candidate.toJSON = function() {
          return {
            candidate: event.candidate.candidate,
            sdpMid: event.candidate.sdpMid,
            sdpMLineIndex: event.candidate.sdpMLineIndex,
            usernameFragment: event.candidate.usernameFragment
          };
        };
      }

      // update local description.
      var sections = sdp.getMediaSections(pc._localDescription.sdp);
      if (!end) {
        sections[event.candidate.sdpMLineIndex] +=
            'a=' + event.candidate.candidate + '\r\n';
      } else {
        sections[event.candidate.sdpMLineIndex] +=
            'a=end-of-candidates\r\n';
      }
      pc._localDescription.sdp =
          sdp.getDescription(pc._localDescription.sdp) +
          sections.join('');
      var complete = pc.transceivers.every(function(transceiver) {
        return transceiver.iceGatherer &&
            transceiver.iceGatherer.state === 'completed';
      });

      if (pc.iceGatheringState !== 'gathering') {
        pc.iceGatheringState = 'gathering';
        pc._emitGatheringStateChange();
      }

      // Emit candidate. Also emit null candidate when all gatherers are
      // complete.
      if (!end) {
        pc._dispatchEvent('icecandidate', event);
      }
      if (complete) {
        pc._dispatchEvent('icecandidate', new Event('icecandidate'));
        pc.iceGatheringState = 'complete';
        pc._emitGatheringStateChange();
      }
    };

    // emit already gathered candidates.
    window.setTimeout(function() {
      bufferedCandidateEvents.forEach(function(e) {
        iceGatherer.onlocalcandidate(e);
      });
    }, 0);
  };

  // Create ICE transport and DTLS transport.
  RTCPeerConnection.prototype._createIceAndDtlsTransports = function() {
    var pc = this;
    var iceTransport = new window.RTCIceTransport(null);
    iceTransport.onicestatechange = function() {
      pc._updateIceConnectionState();
      pc._updateConnectionState();
    };

    var dtlsTransport = new window.RTCDtlsTransport(iceTransport);
    dtlsTransport.ondtlsstatechange = function() {
      pc._updateConnectionState();
    };
    dtlsTransport.onerror = function() {
      // onerror does not set state to failed by itself.
      Object.defineProperty(dtlsTransport, 'state',
          {value: 'failed', writable: true});
      pc._updateConnectionState();
    };

    return {
      iceTransport: iceTransport,
      dtlsTransport: dtlsTransport
    };
  };

  // Destroy ICE gatherer, ICE transport and DTLS transport.
  // Without triggering the callbacks.
  RTCPeerConnection.prototype._disposeIceAndDtlsTransports = function(
      sdpMLineIndex) {
    var iceGatherer = this.transceivers[sdpMLineIndex].iceGatherer;
    if (iceGatherer) {
      delete iceGatherer.onlocalcandidate;
      delete this.transceivers[sdpMLineIndex].iceGatherer;
    }
    var iceTransport = this.transceivers[sdpMLineIndex].iceTransport;
    if (iceTransport) {
      delete iceTransport.onicestatechange;
      delete this.transceivers[sdpMLineIndex].iceTransport;
    }
    var dtlsTransport = this.transceivers[sdpMLineIndex].dtlsTransport;
    if (dtlsTransport) {
      delete dtlsTransport.ondtlsstatechange;
      delete dtlsTransport.onerror;
      delete this.transceivers[sdpMLineIndex].dtlsTransport;
    }
  };

  // Start the RTP Sender and Receiver for a transceiver.
  RTCPeerConnection.prototype._transceive = function(transceiver,
      send, recv) {
    var params = getCommonCapabilities(transceiver.localCapabilities,
        transceiver.remoteCapabilities);
    if (send && transceiver.rtpSender) {
      params.encodings = transceiver.sendEncodingParameters;
      params.rtcp = {
        cname: sdp.localCName,
        compound: transceiver.rtcpParameters.compound
      };
      if (transceiver.recvEncodingParameters.length) {
        params.rtcp.ssrc = transceiver.recvEncodingParameters[0].ssrc;
      }
      transceiver.rtpSender.send(params);
    }
    if (recv && transceiver.rtpReceiver && params.codecs.length > 0) {
      // remove RTX field in Edge 14942
      if (transceiver.kind === 'video'
          && transceiver.recvEncodingParameters
          && edgeVersion < 15019) {
        transceiver.recvEncodingParameters.forEach(function(p) {
          delete p.rtx;
        });
      }
      if (transceiver.recvEncodingParameters.length) {
        params.encodings = transceiver.recvEncodingParameters;
      } else {
        params.encodings = [{}];
      }
      params.rtcp = {
        compound: transceiver.rtcpParameters.compound
      };
      if (transceiver.rtcpParameters.cname) {
        params.rtcp.cname = transceiver.rtcpParameters.cname;
      }
      if (transceiver.sendEncodingParameters.length) {
        params.rtcp.ssrc = transceiver.sendEncodingParameters[0].ssrc;
      }
      transceiver.rtpReceiver.receive(params);
    }
  };

  RTCPeerConnection.prototype.setLocalDescription = function(description) {
    var pc = this;

    // Note: pranswer is not supported.
    if (['offer', 'answer'].indexOf(description.type) === -1) {
      return Promise.reject(makeError('TypeError',
          'Unsupported type "' + description.type + '"'));
    }

    if (!isActionAllowedInSignalingState('setLocalDescription',
        description.type, pc.signalingState) || pc._isClosed) {
      return Promise.reject(makeError('InvalidStateError',
          'Can not set local ' + description.type +
          ' in state ' + pc.signalingState));
    }

    var sections;
    var sessionpart;
    if (description.type === 'offer') {
      // VERY limited support for SDP munging. Limited to:
      // * changing the order of codecs
      sections = sdp.splitSections(description.sdp);
      sessionpart = sections.shift();
      sections.forEach(function(mediaSection, sdpMLineIndex) {
        var caps = sdp.parseRtpParameters(mediaSection);
        pc.transceivers[sdpMLineIndex].localCapabilities = caps;
      });

      pc.transceivers.forEach(function(transceiver, sdpMLineIndex) {
        pc._gather(transceiver.mid, sdpMLineIndex);
      });
    } else if (description.type === 'answer') {
      sections = sdp.splitSections(pc._remoteDescription.sdp);
      sessionpart = sections.shift();
      var isIceLite = sdp.matchPrefix(sessionpart,
          'a=ice-lite').length > 0;
      sections.forEach(function(mediaSection, sdpMLineIndex) {
        var transceiver = pc.transceivers[sdpMLineIndex];
        var iceGatherer = transceiver.iceGatherer;
        var iceTransport = transceiver.iceTransport;
        var dtlsTransport = transceiver.dtlsTransport;
        var localCapabilities = transceiver.localCapabilities;
        var remoteCapabilities = transceiver.remoteCapabilities;

        // treat bundle-only as not-rejected.
        var rejected = sdp.isRejected(mediaSection) &&
            sdp.matchPrefix(mediaSection, 'a=bundle-only').length === 0;

        if (!rejected && !transceiver.rejected) {
          var remoteIceParameters = sdp.getIceParameters(
              mediaSection, sessionpart);
          var remoteDtlsParameters = sdp.getDtlsParameters(
              mediaSection, sessionpart);
          if (isIceLite) {
            remoteDtlsParameters.role = 'server';
          }

          if (!pc.usingBundle || sdpMLineIndex === 0) {
            pc._gather(transceiver.mid, sdpMLineIndex);
            if (iceTransport.state === 'new') {
              iceTransport.start(iceGatherer, remoteIceParameters,
                  isIceLite ? 'controlling' : 'controlled');
            }
            if (dtlsTransport.state === 'new') {
              dtlsTransport.start(remoteDtlsParameters);
            }
          }

          // Calculate intersection of capabilities.
          var params = getCommonCapabilities(localCapabilities,
              remoteCapabilities);

          // Start the RTCRtpSender. The RTCRtpReceiver for this
          // transceiver has already been started in setRemoteDescription.
          pc._transceive(transceiver,
              params.codecs.length > 0,
              false);
        }
      });
    }

    pc._localDescription = {
      type: description.type,
      sdp: description.sdp
    };
    if (description.type === 'offer') {
      pc._updateSignalingState('have-local-offer');
    } else {
      pc._updateSignalingState('stable');
    }

    return Promise.resolve();
  };

  RTCPeerConnection.prototype.setRemoteDescription = function(description) {
    var pc = this;

    // Note: pranswer is not supported.
    if (['offer', 'answer'].indexOf(description.type) === -1) {
      return Promise.reject(makeError('TypeError',
          'Unsupported type "' + description.type + '"'));
    }

    if (!isActionAllowedInSignalingState('setRemoteDescription',
        description.type, pc.signalingState) || pc._isClosed) {
      return Promise.reject(makeError('InvalidStateError',
          'Can not set remote ' + description.type +
          ' in state ' + pc.signalingState));
    }

    var streams = {};
    pc.remoteStreams.forEach(function(stream) {
      streams[stream.id] = stream;
    });
    var receiverList = [];
    var sections = sdp.splitSections(description.sdp);
    var sessionpart = sections.shift();
    var isIceLite = sdp.matchPrefix(sessionpart,
        'a=ice-lite').length > 0;
    var usingBundle = sdp.matchPrefix(sessionpart,
        'a=group:BUNDLE ').length > 0;
    pc.usingBundle = usingBundle;
    var iceOptions = sdp.matchPrefix(sessionpart,
        'a=ice-options:')[0];
    if (iceOptions) {
      pc.canTrickleIceCandidates = iceOptions.substr(14).split(' ')
          .indexOf('trickle') >= 0;
    } else {
      pc.canTrickleIceCandidates = false;
    }

    sections.forEach(function(mediaSection, sdpMLineIndex) {
      var lines = sdp.splitLines(mediaSection);
      var kind = sdp.getKind(mediaSection);
      // treat bundle-only as not-rejected.
      var rejected = sdp.isRejected(mediaSection) &&
          sdp.matchPrefix(mediaSection, 'a=bundle-only').length === 0;
      var protocol = lines[0].substr(2).split(' ')[2];

      var direction = sdp.getDirection(mediaSection, sessionpart);
      var remoteMsid = sdp.parseMsid(mediaSection);

      var mid = sdp.getMid(mediaSection) || sdp.generateIdentifier();

      // Reject datachannels which are not implemented yet.
      if (rejected || (kind === 'application' && (protocol === 'DTLS/SCTP' ||
          protocol === 'UDP/DTLS/SCTP'))) {
        // TODO: this is dangerous in the case where a non-rejected m-line
        //     becomes rejected.
        pc.transceivers[sdpMLineIndex] = {
          mid: mid,
          kind: kind,
          protocol: protocol,
          rejected: true
        };
        return;
      }

      if (!rejected && pc.transceivers[sdpMLineIndex] &&
          pc.transceivers[sdpMLineIndex].rejected) {
        // recycle a rejected transceiver.
        pc.transceivers[sdpMLineIndex] = pc._createTransceiver(kind, true);
      }

      var transceiver;
      var iceGatherer;
      var iceTransport;
      var dtlsTransport;
      var rtpReceiver;
      var sendEncodingParameters;
      var recvEncodingParameters;
      var localCapabilities;

      var track;
      // FIXME: ensure the mediaSection has rtcp-mux set.
      var remoteCapabilities = sdp.parseRtpParameters(mediaSection);
      var remoteIceParameters;
      var remoteDtlsParameters;
      if (!rejected) {
        remoteIceParameters = sdp.getIceParameters(mediaSection,
            sessionpart);
        remoteDtlsParameters = sdp.getDtlsParameters(mediaSection,
            sessionpart);
        remoteDtlsParameters.role = 'client';
      }
      recvEncodingParameters =
          sdp.parseRtpEncodingParameters(mediaSection);

      var rtcpParameters = sdp.parseRtcpParameters(mediaSection);

      var isComplete = sdp.matchPrefix(mediaSection,
          'a=end-of-candidates', sessionpart).length > 0;
      var cands = sdp.matchPrefix(mediaSection, 'a=candidate:')
          .map(function(cand) {
            return sdp.parseCandidate(cand);
          })
          .filter(function(cand) {
            return cand.component === 1;
          });

      // Check if we can use BUNDLE and dispose transports.
      if ((description.type === 'offer' || description.type === 'answer') &&
          !rejected && usingBundle && sdpMLineIndex > 0 &&
          pc.transceivers[sdpMLineIndex]) {
        pc._disposeIceAndDtlsTransports(sdpMLineIndex);
        pc.transceivers[sdpMLineIndex].iceGatherer =
            pc.transceivers[0].iceGatherer;
        pc.transceivers[sdpMLineIndex].iceTransport =
            pc.transceivers[0].iceTransport;
        pc.transceivers[sdpMLineIndex].dtlsTransport =
            pc.transceivers[0].dtlsTransport;
        if (pc.transceivers[sdpMLineIndex].rtpSender) {
          pc.transceivers[sdpMLineIndex].rtpSender.setTransport(
              pc.transceivers[0].dtlsTransport);
        }
        if (pc.transceivers[sdpMLineIndex].rtpReceiver) {
          pc.transceivers[sdpMLineIndex].rtpReceiver.setTransport(
              pc.transceivers[0].dtlsTransport);
        }
      }
      if (description.type === 'offer' && !rejected) {
        transceiver = pc.transceivers[sdpMLineIndex] ||
            pc._createTransceiver(kind);
        transceiver.mid = mid;

        if (!transceiver.iceGatherer) {
          transceiver.iceGatherer = pc._createIceGatherer(sdpMLineIndex,
              usingBundle);
        }

        if (cands.length && transceiver.iceTransport.state === 'new') {
          if (isComplete && (!usingBundle || sdpMLineIndex === 0)) {
            transceiver.iceTransport.setRemoteCandidates(cands);
          } else {
            cands.forEach(function(candidate) {
              maybeAddCandidate(transceiver.iceTransport, candidate);
            });
          }
        }

        localCapabilities = window.RTCRtpReceiver.getCapabilities(kind);

        // filter RTX until additional stuff needed for RTX is implemented
        // in adapter.js
        if (edgeVersion < 15019) {
          localCapabilities.codecs = localCapabilities.codecs.filter(
              function(codec) {
                return codec.name !== 'rtx';
              });
        }

        sendEncodingParameters = transceiver.sendEncodingParameters || [{
          ssrc: (2 * sdpMLineIndex + 2) * 1001
        }];

        // TODO: rewrite to use http://w3c.github.io/webrtc-pc/#set-associated-remote-streams
        var isNewTrack = false;
        if (direction === 'sendrecv' || direction === 'sendonly') {
          isNewTrack = !transceiver.rtpReceiver;
          rtpReceiver = transceiver.rtpReceiver ||
              new window.RTCRtpReceiver(transceiver.dtlsTransport, kind);

          if (isNewTrack) {
            var stream;
            track = rtpReceiver.track;
            // FIXME: does not work with Plan B.
            if (remoteMsid && remoteMsid.stream === '-') ; else if (remoteMsid) {
              if (!streams[remoteMsid.stream]) {
                streams[remoteMsid.stream] = new window.MediaStream();
                Object.defineProperty(streams[remoteMsid.stream], 'id', {
                  get: function() {
                    return remoteMsid.stream;
                  }
                });
              }
              Object.defineProperty(track, 'id', {
                get: function() {
                  return remoteMsid.track;
                }
              });
              stream = streams[remoteMsid.stream];
            } else {
              if (!streams.default) {
                streams.default = new window.MediaStream();
              }
              stream = streams.default;
            }
            if (stream) {
              addTrackToStreamAndFireEvent(track, stream);
              transceiver.associatedRemoteMediaStreams.push(stream);
            }
            receiverList.push([track, rtpReceiver, stream]);
          }
        } else if (transceiver.rtpReceiver && transceiver.rtpReceiver.track) {
          transceiver.associatedRemoteMediaStreams.forEach(function(s) {
            var nativeTrack = s.getTracks().find(function(t) {
              return t.id === transceiver.rtpReceiver.track.id;
            });
            if (nativeTrack) {
              removeTrackFromStreamAndFireEvent(nativeTrack, s);
            }
          });
          transceiver.associatedRemoteMediaStreams = [];
        }

        transceiver.localCapabilities = localCapabilities;
        transceiver.remoteCapabilities = remoteCapabilities;
        transceiver.rtpReceiver = rtpReceiver;
        transceiver.rtcpParameters = rtcpParameters;
        transceiver.sendEncodingParameters = sendEncodingParameters;
        transceiver.recvEncodingParameters = recvEncodingParameters;

        // Start the RTCRtpReceiver now. The RTPSender is started in
        // setLocalDescription.
        pc._transceive(pc.transceivers[sdpMLineIndex],
            false,
            isNewTrack);
      } else if (description.type === 'answer' && !rejected) {
        transceiver = pc.transceivers[sdpMLineIndex];
        iceGatherer = transceiver.iceGatherer;
        iceTransport = transceiver.iceTransport;
        dtlsTransport = transceiver.dtlsTransport;
        rtpReceiver = transceiver.rtpReceiver;
        sendEncodingParameters = transceiver.sendEncodingParameters;
        localCapabilities = transceiver.localCapabilities;

        pc.transceivers[sdpMLineIndex].recvEncodingParameters =
            recvEncodingParameters;
        pc.transceivers[sdpMLineIndex].remoteCapabilities =
            remoteCapabilities;
        pc.transceivers[sdpMLineIndex].rtcpParameters = rtcpParameters;

        if (cands.length && iceTransport.state === 'new') {
          if ((isIceLite || isComplete) &&
              (!usingBundle || sdpMLineIndex === 0)) {
            iceTransport.setRemoteCandidates(cands);
          } else {
            cands.forEach(function(candidate) {
              maybeAddCandidate(transceiver.iceTransport, candidate);
            });
          }
        }

        if (!usingBundle || sdpMLineIndex === 0) {
          if (iceTransport.state === 'new') {
            iceTransport.start(iceGatherer, remoteIceParameters,
                'controlling');
          }
          if (dtlsTransport.state === 'new') {
            dtlsTransport.start(remoteDtlsParameters);
          }
        }

        // If the offer contained RTX but the answer did not,
        // remove RTX from sendEncodingParameters.
        var commonCapabilities = getCommonCapabilities(
          transceiver.localCapabilities,
          transceiver.remoteCapabilities);

        var hasRtx = commonCapabilities.codecs.filter(function(c) {
          return c.name.toLowerCase() === 'rtx';
        }).length;
        if (!hasRtx && transceiver.sendEncodingParameters[0].rtx) {
          delete transceiver.sendEncodingParameters[0].rtx;
        }

        pc._transceive(transceiver,
            direction === 'sendrecv' || direction === 'recvonly',
            direction === 'sendrecv' || direction === 'sendonly');

        // TODO: rewrite to use http://w3c.github.io/webrtc-pc/#set-associated-remote-streams
        if (rtpReceiver &&
            (direction === 'sendrecv' || direction === 'sendonly')) {
          track = rtpReceiver.track;
          if (remoteMsid) {
            if (!streams[remoteMsid.stream]) {
              streams[remoteMsid.stream] = new window.MediaStream();
            }
            addTrackToStreamAndFireEvent(track, streams[remoteMsid.stream]);
            receiverList.push([track, rtpReceiver, streams[remoteMsid.stream]]);
          } else {
            if (!streams.default) {
              streams.default = new window.MediaStream();
            }
            addTrackToStreamAndFireEvent(track, streams.default);
            receiverList.push([track, rtpReceiver, streams.default]);
          }
        } else {
          // FIXME: actually the receiver should be created later.
          delete transceiver.rtpReceiver;
        }
      }
    });

    if (pc._dtlsRole === undefined) {
      pc._dtlsRole = description.type === 'offer' ? 'active' : 'passive';
    }

    pc._remoteDescription = {
      type: description.type,
      sdp: description.sdp
    };
    if (description.type === 'offer') {
      pc._updateSignalingState('have-remote-offer');
    } else {
      pc._updateSignalingState('stable');
    }
    Object.keys(streams).forEach(function(sid) {
      var stream = streams[sid];
      if (stream.getTracks().length) {
        if (pc.remoteStreams.indexOf(stream) === -1) {
          pc.remoteStreams.push(stream);
          var event = new Event('addstream');
          event.stream = stream;
          window.setTimeout(function() {
            pc._dispatchEvent('addstream', event);
          });
        }

        receiverList.forEach(function(item) {
          var track = item[0];
          var receiver = item[1];
          if (stream.id !== item[2].id) {
            return;
          }
          fireAddTrack(pc, track, receiver, [stream]);
        });
      }
    });
    receiverList.forEach(function(item) {
      if (item[2]) {
        return;
      }
      fireAddTrack(pc, item[0], item[1], []);
    });

    // check whether addIceCandidate({}) was called within four seconds after
    // setRemoteDescription.
    window.setTimeout(function() {
      if (!(pc && pc.transceivers)) {
        return;
      }
      pc.transceivers.forEach(function(transceiver) {
        if (transceiver.iceTransport &&
            transceiver.iceTransport.state === 'new' &&
            transceiver.iceTransport.getRemoteCandidates().length > 0) {
          console.warn('Timeout for addRemoteCandidate. Consider sending ' +
              'an end-of-candidates notification');
          transceiver.iceTransport.addRemoteCandidate({});
        }
      });
    }, 4000);

    return Promise.resolve();
  };

  RTCPeerConnection.prototype.close = function() {
    this.transceivers.forEach(function(transceiver) {
      /* not yet
      if (transceiver.iceGatherer) {
        transceiver.iceGatherer.close();
      }
      */
      if (transceiver.iceTransport) {
        transceiver.iceTransport.stop();
      }
      if (transceiver.dtlsTransport) {
        transceiver.dtlsTransport.stop();
      }
      if (transceiver.rtpSender) {
        transceiver.rtpSender.stop();
      }
      if (transceiver.rtpReceiver) {
        transceiver.rtpReceiver.stop();
      }
    });
    // FIXME: clean up tracks, local streams, remote streams, etc
    this._isClosed = true;
    this._updateSignalingState('closed');
  };

  // Update the signaling state.
  RTCPeerConnection.prototype._updateSignalingState = function(newState) {
    this.signalingState = newState;
    var event = new Event('signalingstatechange');
    this._dispatchEvent('signalingstatechange', event);
  };

  // Determine whether to fire the negotiationneeded event.
  RTCPeerConnection.prototype._maybeFireNegotiationNeeded = function() {
    var pc = this;
    if (this.signalingState !== 'stable' || this.needNegotiation === true) {
      return;
    }
    this.needNegotiation = true;
    window.setTimeout(function() {
      if (pc.needNegotiation) {
        pc.needNegotiation = false;
        var event = new Event('negotiationneeded');
        pc._dispatchEvent('negotiationneeded', event);
      }
    }, 0);
  };

  // Update the ice connection state.
  RTCPeerConnection.prototype._updateIceConnectionState = function() {
    var newState;
    var states = {
      'new': 0,
      closed: 0,
      checking: 0,
      connected: 0,
      completed: 0,
      disconnected: 0,
      failed: 0
    };
    this.transceivers.forEach(function(transceiver) {
      if (transceiver.iceTransport && !transceiver.rejected) {
        states[transceiver.iceTransport.state]++;
      }
    });

    newState = 'new';
    if (states.failed > 0) {
      newState = 'failed';
    } else if (states.checking > 0) {
      newState = 'checking';
    } else if (states.disconnected > 0) {
      newState = 'disconnected';
    } else if (states.new > 0) {
      newState = 'new';
    } else if (states.connected > 0) {
      newState = 'connected';
    } else if (states.completed > 0) {
      newState = 'completed';
    }

    if (newState !== this.iceConnectionState) {
      this.iceConnectionState = newState;
      var event = new Event('iceconnectionstatechange');
      this._dispatchEvent('iceconnectionstatechange', event);
    }
  };

  // Update the connection state.
  RTCPeerConnection.prototype._updateConnectionState = function() {
    var newState;
    var states = {
      'new': 0,
      closed: 0,
      connecting: 0,
      connected: 0,
      completed: 0,
      disconnected: 0,
      failed: 0
    };
    this.transceivers.forEach(function(transceiver) {
      if (transceiver.iceTransport && transceiver.dtlsTransport &&
          !transceiver.rejected) {
        states[transceiver.iceTransport.state]++;
        states[transceiver.dtlsTransport.state]++;
      }
    });
    // ICETransport.completed and connected are the same for this purpose.
    states.connected += states.completed;

    newState = 'new';
    if (states.failed > 0) {
      newState = 'failed';
    } else if (states.connecting > 0) {
      newState = 'connecting';
    } else if (states.disconnected > 0) {
      newState = 'disconnected';
    } else if (states.new > 0) {
      newState = 'new';
    } else if (states.connected > 0) {
      newState = 'connected';
    }

    if (newState !== this.connectionState) {
      this.connectionState = newState;
      var event = new Event('connectionstatechange');
      this._dispatchEvent('connectionstatechange', event);
    }
  };

  RTCPeerConnection.prototype.createOffer = function() {
    var pc = this;

    if (pc._isClosed) {
      return Promise.reject(makeError('InvalidStateError',
          'Can not call createOffer after close'));
    }

    var numAudioTracks = pc.transceivers.filter(function(t) {
      return t.kind === 'audio';
    }).length;
    var numVideoTracks = pc.transceivers.filter(function(t) {
      return t.kind === 'video';
    }).length;

    // Determine number of audio and video tracks we need to send/recv.
    var offerOptions = arguments[0];
    if (offerOptions) {
      // Reject Chrome legacy constraints.
      if (offerOptions.mandatory || offerOptions.optional) {
        throw new TypeError(
            'Legacy mandatory/optional constraints not supported.');
      }
      if (offerOptions.offerToReceiveAudio !== undefined) {
        if (offerOptions.offerToReceiveAudio === true) {
          numAudioTracks = 1;
        } else if (offerOptions.offerToReceiveAudio === false) {
          numAudioTracks = 0;
        } else {
          numAudioTracks = offerOptions.offerToReceiveAudio;
        }
      }
      if (offerOptions.offerToReceiveVideo !== undefined) {
        if (offerOptions.offerToReceiveVideo === true) {
          numVideoTracks = 1;
        } else if (offerOptions.offerToReceiveVideo === false) {
          numVideoTracks = 0;
        } else {
          numVideoTracks = offerOptions.offerToReceiveVideo;
        }
      }
    }

    pc.transceivers.forEach(function(transceiver) {
      if (transceiver.kind === 'audio') {
        numAudioTracks--;
        if (numAudioTracks < 0) {
          transceiver.wantReceive = false;
        }
      } else if (transceiver.kind === 'video') {
        numVideoTracks--;
        if (numVideoTracks < 0) {
          transceiver.wantReceive = false;
        }
      }
    });

    // Create M-lines for recvonly streams.
    while (numAudioTracks > 0 || numVideoTracks > 0) {
      if (numAudioTracks > 0) {
        pc._createTransceiver('audio');
        numAudioTracks--;
      }
      if (numVideoTracks > 0) {
        pc._createTransceiver('video');
        numVideoTracks--;
      }
    }

    var sdp$1 = sdp.writeSessionBoilerplate(pc._sdpSessionId,
        pc._sdpSessionVersion++);
    pc.transceivers.forEach(function(transceiver, sdpMLineIndex) {
      // For each track, create an ice gatherer, ice transport,
      // dtls transport, potentially rtpsender and rtpreceiver.
      var track = transceiver.track;
      var kind = transceiver.kind;
      var mid = transceiver.mid || sdp.generateIdentifier();
      transceiver.mid = mid;

      if (!transceiver.iceGatherer) {
        transceiver.iceGatherer = pc._createIceGatherer(sdpMLineIndex,
            pc.usingBundle);
      }

      var localCapabilities = window.RTCRtpSender.getCapabilities(kind);
      // filter RTX until additional stuff needed for RTX is implemented
      // in adapter.js
      if (edgeVersion < 15019) {
        localCapabilities.codecs = localCapabilities.codecs.filter(
            function(codec) {
              return codec.name !== 'rtx';
            });
      }
      localCapabilities.codecs.forEach(function(codec) {
        // work around https://bugs.chromium.org/p/webrtc/issues/detail?id=6552
        // by adding level-asymmetry-allowed=1
        if (codec.name === 'H264' &&
            codec.parameters['level-asymmetry-allowed'] === undefined) {
          codec.parameters['level-asymmetry-allowed'] = '1';
        }

        // for subsequent offers, we might have to re-use the payload
        // type of the last offer.
        if (transceiver.remoteCapabilities &&
            transceiver.remoteCapabilities.codecs) {
          transceiver.remoteCapabilities.codecs.forEach(function(remoteCodec) {
            if (codec.name.toLowerCase() === remoteCodec.name.toLowerCase() &&
                codec.clockRate === remoteCodec.clockRate) {
              codec.preferredPayloadType = remoteCodec.payloadType;
            }
          });
        }
      });
      localCapabilities.headerExtensions.forEach(function(hdrExt) {
        var remoteExtensions = transceiver.remoteCapabilities &&
            transceiver.remoteCapabilities.headerExtensions || [];
        remoteExtensions.forEach(function(rHdrExt) {
          if (hdrExt.uri === rHdrExt.uri) {
            hdrExt.id = rHdrExt.id;
          }
        });
      });

      // generate an ssrc now, to be used later in rtpSender.send
      var sendEncodingParameters = transceiver.sendEncodingParameters || [{
        ssrc: (2 * sdpMLineIndex + 1) * 1001
      }];
      if (track) {
        // add RTX
        if (edgeVersion >= 15019 && kind === 'video' &&
            !sendEncodingParameters[0].rtx) {
          sendEncodingParameters[0].rtx = {
            ssrc: sendEncodingParameters[0].ssrc + 1
          };
        }
      }

      if (transceiver.wantReceive) {
        transceiver.rtpReceiver = new window.RTCRtpReceiver(
            transceiver.dtlsTransport, kind);
      }

      transceiver.localCapabilities = localCapabilities;
      transceiver.sendEncodingParameters = sendEncodingParameters;
    });

    // always offer BUNDLE and dispose on return if not supported.
    if (pc._config.bundlePolicy !== 'max-compat') {
      sdp$1 += 'a=group:BUNDLE ' + pc.transceivers.map(function(t) {
        return t.mid;
      }).join(' ') + '\r\n';
    }
    sdp$1 += 'a=ice-options:trickle\r\n';

    pc.transceivers.forEach(function(transceiver, sdpMLineIndex) {
      sdp$1 += writeMediaSection(transceiver, transceiver.localCapabilities,
          'offer', transceiver.stream, pc._dtlsRole);
      sdp$1 += 'a=rtcp-rsize\r\n';

      if (transceiver.iceGatherer && pc.iceGatheringState !== 'new' &&
          (sdpMLineIndex === 0 || !pc.usingBundle)) {
        transceiver.iceGatherer.getLocalCandidates().forEach(function(cand) {
          cand.component = 1;
          sdp$1 += 'a=' + sdp.writeCandidate(cand) + '\r\n';
        });

        if (transceiver.iceGatherer.state === 'completed') {
          sdp$1 += 'a=end-of-candidates\r\n';
        }
      }
    });

    var desc = new window.RTCSessionDescription({
      type: 'offer',
      sdp: sdp$1
    });
    return Promise.resolve(desc);
  };

  RTCPeerConnection.prototype.createAnswer = function() {
    var pc = this;

    if (pc._isClosed) {
      return Promise.reject(makeError('InvalidStateError',
          'Can not call createAnswer after close'));
    }

    if (!(pc.signalingState === 'have-remote-offer' ||
        pc.signalingState === 'have-local-pranswer')) {
      return Promise.reject(makeError('InvalidStateError',
          'Can not call createAnswer in signalingState ' + pc.signalingState));
    }

    var sdp$1 = sdp.writeSessionBoilerplate(pc._sdpSessionId,
        pc._sdpSessionVersion++);
    if (pc.usingBundle) {
      sdp$1 += 'a=group:BUNDLE ' + pc.transceivers.map(function(t) {
        return t.mid;
      }).join(' ') + '\r\n';
    }
    sdp$1 += 'a=ice-options:trickle\r\n';

    var mediaSectionsInOffer = sdp.getMediaSections(
        pc._remoteDescription.sdp).length;
    pc.transceivers.forEach(function(transceiver, sdpMLineIndex) {
      if (sdpMLineIndex + 1 > mediaSectionsInOffer) {
        return;
      }
      if (transceiver.rejected) {
        if (transceiver.kind === 'application') {
          if (transceiver.protocol === 'DTLS/SCTP') { // legacy fmt
            sdp$1 += 'm=application 0 DTLS/SCTP 5000\r\n';
          } else {
            sdp$1 += 'm=application 0 ' + transceiver.protocol +
                ' webrtc-datachannel\r\n';
          }
        } else if (transceiver.kind === 'audio') {
          sdp$1 += 'm=audio 0 UDP/TLS/RTP/SAVPF 0\r\n' +
              'a=rtpmap:0 PCMU/8000\r\n';
        } else if (transceiver.kind === 'video') {
          sdp$1 += 'm=video 0 UDP/TLS/RTP/SAVPF 120\r\n' +
              'a=rtpmap:120 VP8/90000\r\n';
        }
        sdp$1 += 'c=IN IP4 0.0.0.0\r\n' +
            'a=inactive\r\n' +
            'a=mid:' + transceiver.mid + '\r\n';
        return;
      }

      // FIXME: look at direction.
      if (transceiver.stream) {
        var localTrack;
        if (transceiver.kind === 'audio') {
          localTrack = transceiver.stream.getAudioTracks()[0];
        } else if (transceiver.kind === 'video') {
          localTrack = transceiver.stream.getVideoTracks()[0];
        }
        if (localTrack) {
          // add RTX
          if (edgeVersion >= 15019 && transceiver.kind === 'video' &&
              !transceiver.sendEncodingParameters[0].rtx) {
            transceiver.sendEncodingParameters[0].rtx = {
              ssrc: transceiver.sendEncodingParameters[0].ssrc + 1
            };
          }
        }
      }

      // Calculate intersection of capabilities.
      var commonCapabilities = getCommonCapabilities(
          transceiver.localCapabilities,
          transceiver.remoteCapabilities);

      var hasRtx = commonCapabilities.codecs.filter(function(c) {
        return c.name.toLowerCase() === 'rtx';
      }).length;
      if (!hasRtx && transceiver.sendEncodingParameters[0].rtx) {
        delete transceiver.sendEncodingParameters[0].rtx;
      }

      sdp$1 += writeMediaSection(transceiver, commonCapabilities,
          'answer', transceiver.stream, pc._dtlsRole);
      if (transceiver.rtcpParameters &&
          transceiver.rtcpParameters.reducedSize) {
        sdp$1 += 'a=rtcp-rsize\r\n';
      }
    });

    var desc = new window.RTCSessionDescription({
      type: 'answer',
      sdp: sdp$1
    });
    return Promise.resolve(desc);
  };

  RTCPeerConnection.prototype.addIceCandidate = function(candidate) {
    var pc = this;
    var sections;
    if (candidate && !(candidate.sdpMLineIndex !== undefined ||
        candidate.sdpMid)) {
      return Promise.reject(new TypeError('sdpMLineIndex or sdpMid required'));
    }

    // TODO: needs to go into ops queue.
    return new Promise(function(resolve, reject) {
      if (!pc._remoteDescription) {
        return reject(makeError('InvalidStateError',
            'Can not add ICE candidate without a remote description'));
      } else if (!candidate || candidate.candidate === '') {
        for (var j = 0; j < pc.transceivers.length; j++) {
          if (pc.transceivers[j].rejected) {
            continue;
          }
          pc.transceivers[j].iceTransport.addRemoteCandidate({});
          sections = sdp.getMediaSections(pc._remoteDescription.sdp);
          sections[j] += 'a=end-of-candidates\r\n';
          pc._remoteDescription.sdp =
              sdp.getDescription(pc._remoteDescription.sdp) +
              sections.join('');
          if (pc.usingBundle) {
            break;
          }
        }
      } else {
        var sdpMLineIndex = candidate.sdpMLineIndex;
        if (candidate.sdpMid) {
          for (var i = 0; i < pc.transceivers.length; i++) {
            if (pc.transceivers[i].mid === candidate.sdpMid) {
              sdpMLineIndex = i;
              break;
            }
          }
        }
        var transceiver = pc.transceivers[sdpMLineIndex];
        if (transceiver) {
          if (transceiver.rejected) {
            return resolve();
          }
          var cand = Object.keys(candidate.candidate).length > 0 ?
              sdp.parseCandidate(candidate.candidate) : {};
          // Ignore Chrome's invalid candidates since Edge does not like them.
          if (cand.protocol === 'tcp' && (cand.port === 0 || cand.port === 9)) {
            return resolve();
          }
          // Ignore RTCP candidates, we assume RTCP-MUX.
          if (cand.component && cand.component !== 1) {
            return resolve();
          }
          // when using bundle, avoid adding candidates to the wrong
          // ice transport. And avoid adding candidates added in the SDP.
          if (sdpMLineIndex === 0 || (sdpMLineIndex > 0 &&
              transceiver.iceTransport !== pc.transceivers[0].iceTransport)) {
            if (!maybeAddCandidate(transceiver.iceTransport, cand)) {
              return reject(makeError('OperationError',
                  'Can not add ICE candidate'));
            }
          }

          // update the remoteDescription.
          var candidateString = candidate.candidate.trim();
          if (candidateString.indexOf('a=') === 0) {
            candidateString = candidateString.substr(2);
          }
          sections = sdp.getMediaSections(pc._remoteDescription.sdp);
          sections[sdpMLineIndex] += 'a=' +
              (cand.type ? candidateString : 'end-of-candidates')
              + '\r\n';
          pc._remoteDescription.sdp =
              sdp.getDescription(pc._remoteDescription.sdp) +
              sections.join('');
        } else {
          return reject(makeError('OperationError',
              'Can not add ICE candidate'));
        }
      }
      resolve();
    });
  };

  RTCPeerConnection.prototype.getStats = function(selector) {
    if (selector && selector instanceof window.MediaStreamTrack) {
      var senderOrReceiver = null;
      this.transceivers.forEach(function(transceiver) {
        if (transceiver.rtpSender &&
            transceiver.rtpSender.track === selector) {
          senderOrReceiver = transceiver.rtpSender;
        } else if (transceiver.rtpReceiver &&
            transceiver.rtpReceiver.track === selector) {
          senderOrReceiver = transceiver.rtpReceiver;
        }
      });
      if (!senderOrReceiver) {
        throw makeError('InvalidAccessError', 'Invalid selector.');
      }
      return senderOrReceiver.getStats();
    }

    var promises = [];
    this.transceivers.forEach(function(transceiver) {
      ['rtpSender', 'rtpReceiver', 'iceGatherer', 'iceTransport',
          'dtlsTransport'].forEach(function(method) {
            if (transceiver[method]) {
              promises.push(transceiver[method].getStats());
            }
          });
    });
    return Promise.all(promises).then(function(allStats) {
      var results = new Map();
      allStats.forEach(function(stats) {
        stats.forEach(function(stat) {
          results.set(stat.id, stat);
        });
      });
      return results;
    });
  };

  // fix low-level stat names and return Map instead of object.
  var ortcObjects = ['RTCRtpSender', 'RTCRtpReceiver', 'RTCIceGatherer',
    'RTCIceTransport', 'RTCDtlsTransport'];
  ortcObjects.forEach(function(ortcObjectName) {
    var obj = window[ortcObjectName];
    if (obj && obj.prototype && obj.prototype.getStats) {
      var nativeGetstats = obj.prototype.getStats;
      obj.prototype.getStats = function() {
        return nativeGetstats.apply(this)
        .then(function(nativeStats) {
          var mapStats = new Map();
          Object.keys(nativeStats).forEach(function(id) {
            nativeStats[id].type = fixStatsType(nativeStats[id]);
            mapStats.set(id, nativeStats[id]);
          });
          return mapStats;
        });
      };
    }
  });

  // legacy callback shims. Should be moved to adapter.js some days.
  var methods = ['createOffer', 'createAnswer'];
  methods.forEach(function(method) {
    var nativeMethod = RTCPeerConnection.prototype[method];
    RTCPeerConnection.prototype[method] = function() {
      var args = arguments;
      if (typeof args[0] === 'function' ||
          typeof args[1] === 'function') { // legacy
        return nativeMethod.apply(this, [arguments[2]])
        .then(function(description) {
          if (typeof args[0] === 'function') {
            args[0].apply(null, [description]);
          }
        }, function(error) {
          if (typeof args[1] === 'function') {
            args[1].apply(null, [error]);
          }
        });
      }
      return nativeMethod.apply(this, arguments);
    };
  });

  methods = ['setLocalDescription', 'setRemoteDescription', 'addIceCandidate'];
  methods.forEach(function(method) {
    var nativeMethod = RTCPeerConnection.prototype[method];
    RTCPeerConnection.prototype[method] = function() {
      var args = arguments;
      if (typeof args[1] === 'function' ||
          typeof args[2] === 'function') { // legacy
        return nativeMethod.apply(this, arguments)
        .then(function() {
          if (typeof args[1] === 'function') {
            args[1].apply(null);
          }
        }, function(error) {
          if (typeof args[2] === 'function') {
            args[2].apply(null, [error]);
          }
        });
      }
      return nativeMethod.apply(this, arguments);
    };
  });

  // getStats is special. It doesn't have a spec legacy method yet we support
  // getStats(something, cb) without error callbacks.
  ['getStats'].forEach(function(method) {
    var nativeMethod = RTCPeerConnection.prototype[method];
    RTCPeerConnection.prototype[method] = function() {
      var args = arguments;
      if (typeof args[1] === 'function') {
        return nativeMethod.apply(this, arguments)
        .then(function() {
          if (typeof args[1] === 'function') {
            args[1].apply(null);
          }
        });
      }
      return nativeMethod.apply(this, arguments);
    };
  });

  return RTCPeerConnection;
};

/*
 *  Copyright (c) 2016 The WebRTC project authors. All Rights Reserved.
 *
 *  Use of this source code is governed by a BSD-style license
 *  that can be found in the LICENSE file in the root of the source
 *  tree.
 */

function shimGetUserMedia$1(window) {
  const navigator = window && window.navigator;

  const shimError_ = function(e) {
    return {
      name: {PermissionDeniedError: 'NotAllowedError'}[e.name] || e.name,
      message: e.message,
      constraint: e.constraint,
      toString() {
        return this.name;
      }
    };
  };

  // getUserMedia error shim.
  const origGetUserMedia = navigator.mediaDevices.getUserMedia.
      bind(navigator.mediaDevices);
  navigator.mediaDevices.getUserMedia = function(c) {
    return origGetUserMedia(c).catch(e => Promise.reject(shimError_(e)));
  };
}

/*
 *  Copyright (c) 2018 The adapter.js project authors. All Rights Reserved.
 *
 *  Use of this source code is governed by a BSD-style license
 *  that can be found in the LICENSE file in the root of the source
 *  tree.
 */

function shimGetDisplayMedia$1(window) {
  if (!('getDisplayMedia' in window.navigator)) {
    return;
  }
  if (!(window.navigator.mediaDevices)) {
    return;
  }
  if (window.navigator.mediaDevices &&
    'getDisplayMedia' in window.navigator.mediaDevices) {
    return;
  }
  window.navigator.mediaDevices.getDisplayMedia =
    window.navigator.getDisplayMedia.bind(window.navigator);
}

/*
 *  Copyright (c) 2016 The WebRTC project authors. All Rights Reserved.
 *
 *  Use of this source code is governed by a BSD-style license
 *  that can be found in the LICENSE file in the root of the source
 *  tree.
 */

function shimPeerConnection$1(window) {
  const browserDetails = detectBrowser(window);

  if (window.RTCIceGatherer) {
    if (!window.RTCIceCandidate) {
      window.RTCIceCandidate = function RTCIceCandidate(args) {
        return args;
      };
    }
    if (!window.RTCSessionDescription) {
      window.RTCSessionDescription = function RTCSessionDescription(args) {
        return args;
      };
    }
    // this adds an additional event listener to MediaStrackTrack that signals
    // when a tracks enabled property was changed. Workaround for a bug in
    // addStream, see below. No longer required in 15025+
    if (browserDetails.version < 15025) {
      const origMSTEnabled = Object.getOwnPropertyDescriptor(
          window.MediaStreamTrack.prototype, 'enabled');
      Object.defineProperty(window.MediaStreamTrack.prototype, 'enabled', {
        set(value) {
          origMSTEnabled.set.call(this, value);
          const ev = new Event('enabled');
          ev.enabled = value;
          this.dispatchEvent(ev);
        }
      });
    }
  }

  // ORTC defines the DTMF sender a bit different.
  // https://github.com/w3c/ortc/issues/714
  if (window.RTCRtpSender && !('dtmf' in window.RTCRtpSender.prototype)) {
    Object.defineProperty(window.RTCRtpSender.prototype, 'dtmf', {
      get() {
        if (this._dtmf === undefined) {
          if (this.track.kind === 'audio') {
            this._dtmf = new window.RTCDtmfSender(this);
          } else if (this.track.kind === 'video') {
            this._dtmf = null;
          }
        }
        return this._dtmf;
      }
    });
  }
  // Edge currently only implements the RTCDtmfSender, not the
  // RTCDTMFSender alias. See http://draft.ortc.org/#rtcdtmfsender2*
  if (window.RTCDtmfSender && !window.RTCDTMFSender) {
    window.RTCDTMFSender = window.RTCDtmfSender;
  }

  const RTCPeerConnectionShim = rtcpeerconnection(window,
      browserDetails.version);
  window.RTCPeerConnection = function RTCPeerConnection(config) {
    if (config && config.iceServers) {
      config.iceServers = filterIceServers(config.iceServers,
        browserDetails.version);
      log('ICE servers after filtering:', config.iceServers);
    }
    return new RTCPeerConnectionShim(config);
  };
  window.RTCPeerConnection.prototype = RTCPeerConnectionShim.prototype;
}

function shimReplaceTrack(window) {
  // ORTC has replaceTrack -- https://github.com/w3c/ortc/issues/614
  if (window.RTCRtpSender &&
      !('replaceTrack' in window.RTCRtpSender.prototype)) {
    window.RTCRtpSender.prototype.replaceTrack =
        window.RTCRtpSender.prototype.setTrack;
  }
}

var edgeShim = /*#__PURE__*/Object.freeze({
  __proto__: null,
  shimPeerConnection: shimPeerConnection$1,
  shimReplaceTrack: shimReplaceTrack,
  shimGetUserMedia: shimGetUserMedia$1,
  shimGetDisplayMedia: shimGetDisplayMedia$1
});

/*
 *  Copyright (c) 2016 The WebRTC project authors. All Rights Reserved.
 *
 *  Use of this source code is governed by a BSD-style license
 *  that can be found in the LICENSE file in the root of the source
 *  tree.
 */

function shimGetUserMedia$2(window) {
  const browserDetails = detectBrowser(window);
  const navigator = window && window.navigator;
  const MediaStreamTrack = window && window.MediaStreamTrack;

  navigator.getUserMedia = function(constraints, onSuccess, onError) {
    // Replace Firefox 44+'s deprecation warning with unprefixed version.
    deprecated('navigator.getUserMedia',
        'navigator.mediaDevices.getUserMedia');
    navigator.mediaDevices.getUserMedia(constraints).then(onSuccess, onError);
  };

  if (!(browserDetails.version > 55 &&
      'autoGainControl' in navigator.mediaDevices.getSupportedConstraints())) {
    const remap = function(obj, a, b) {
      if (a in obj && !(b in obj)) {
        obj[b] = obj[a];
        delete obj[a];
      }
    };

    const nativeGetUserMedia = navigator.mediaDevices.getUserMedia.
        bind(navigator.mediaDevices);
    navigator.mediaDevices.getUserMedia = function(c) {
      if (typeof c === 'object' && typeof c.audio === 'object') {
        c = JSON.parse(JSON.stringify(c));
        remap(c.audio, 'autoGainControl', 'mozAutoGainControl');
        remap(c.audio, 'noiseSuppression', 'mozNoiseSuppression');
      }
      return nativeGetUserMedia(c);
    };

    if (MediaStreamTrack && MediaStreamTrack.prototype.getSettings) {
      const nativeGetSettings = MediaStreamTrack.prototype.getSettings;
      MediaStreamTrack.prototype.getSettings = function() {
        const obj = nativeGetSettings.apply(this, arguments);
        remap(obj, 'mozAutoGainControl', 'autoGainControl');
        remap(obj, 'mozNoiseSuppression', 'noiseSuppression');
        return obj;
      };
    }

    if (MediaStreamTrack && MediaStreamTrack.prototype.applyConstraints) {
      const nativeApplyConstraints =
        MediaStreamTrack.prototype.applyConstraints;
      MediaStreamTrack.prototype.applyConstraints = function(c) {
        if (this.kind === 'audio' && typeof c === 'object') {
          c = JSON.parse(JSON.stringify(c));
          remap(c, 'autoGainControl', 'mozAutoGainControl');
          remap(c, 'noiseSuppression', 'mozNoiseSuppression');
        }
        return nativeApplyConstraints.apply(this, [c]);
      };
    }
  }
}

/*
 *  Copyright (c) 2018 The adapter.js project authors. All Rights Reserved.
 *
 *  Use of this source code is governed by a BSD-style license
 *  that can be found in the LICENSE file in the root of the source
 *  tree.
 */

function shimGetDisplayMedia$2(window, preferredMediaSource) {
  if (window.navigator.mediaDevices &&
    'getDisplayMedia' in window.navigator.mediaDevices) {
    return;
  }
  if (!(window.navigator.mediaDevices)) {
    return;
  }
  window.navigator.mediaDevices.getDisplayMedia =
    function getDisplayMedia(constraints) {
      if (!(constraints && constraints.video)) {
        const err = new DOMException('getDisplayMedia without video ' +
            'constraints is undefined');
        err.name = 'NotFoundError';
        // from https://heycam.github.io/webidl/#idl-DOMException-error-names
        err.code = 8;
        return Promise.reject(err);
      }
      if (constraints.video === true) {
        constraints.video = {mediaSource: preferredMediaSource};
      } else {
        constraints.video.mediaSource = preferredMediaSource;
      }
      return window.navigator.mediaDevices.getUserMedia(constraints);
    };
}

/*
 *  Copyright (c) 2016 The WebRTC project authors. All Rights Reserved.
 *
 *  Use of this source code is governed by a BSD-style license
 *  that can be found in the LICENSE file in the root of the source
 *  tree.
 */

function shimOnTrack$1(window) {
  if (typeof window === 'object' && window.RTCTrackEvent &&
      ('receiver' in window.RTCTrackEvent.prototype) &&
      !('transceiver' in window.RTCTrackEvent.prototype)) {
    Object.defineProperty(window.RTCTrackEvent.prototype, 'transceiver', {
      get() {
        return {receiver: this.receiver};
      }
    });
  }
}

function shimPeerConnection$2(window) {
  const browserDetails = detectBrowser(window);

  if (typeof window !== 'object' ||
      !(window.RTCPeerConnection || window.mozRTCPeerConnection)) {
    return; // probably media.peerconnection.enabled=false in about:config
  }
  if (!window.RTCPeerConnection && window.mozRTCPeerConnection) {
    // very basic support for old versions.
    window.RTCPeerConnection = window.mozRTCPeerConnection;
  }

  if (browserDetails.version < 53) {
    // shim away need for obsolete RTCIceCandidate/RTCSessionDescription.
    ['setLocalDescription', 'setRemoteDescription', 'addIceCandidate']
        .forEach(function(method) {
          const nativeMethod = window.RTCPeerConnection.prototype[method];
          const methodObj = {[method]() {
            arguments[0] = new ((method === 'addIceCandidate') ?
                window.RTCIceCandidate :
                window.RTCSessionDescription)(arguments[0]);
            return nativeMethod.apply(this, arguments);
          }};
          window.RTCPeerConnection.prototype[method] = methodObj[method];
        });
  }

  // support for addIceCandidate(null or undefined)
  // as well as ignoring {sdpMid, candidate: ""}
  if (browserDetails.version < 68) {
    const nativeAddIceCandidate =
        window.RTCPeerConnection.prototype.addIceCandidate;
    window.RTCPeerConnection.prototype.addIceCandidate =
    function addIceCandidate() {
      if (!arguments[0]) {
        if (arguments[1]) {
          arguments[1].apply(null);
        }
        return Promise.resolve();
      }
      // Firefox 68+ emits and processes {candidate: "", ...}, ignore
      // in older versions.
      if (arguments[0] && arguments[0].candidate === '') {
        return Promise.resolve();
      }
      return nativeAddIceCandidate.apply(this, arguments);
    };
  }

  const modernStatsTypes = {
    inboundrtp: 'inbound-rtp',
    outboundrtp: 'outbound-rtp',
    candidatepair: 'candidate-pair',
    localcandidate: 'local-candidate',
    remotecandidate: 'remote-candidate'
  };

  const nativeGetStats = window.RTCPeerConnection.prototype.getStats;
  window.RTCPeerConnection.prototype.getStats = function getStats() {
    const [selector, onSucc, onErr] = arguments;
    return nativeGetStats.apply(this, [selector || null])
      .then(stats => {
        if (browserDetails.version < 53 && !onSucc) {
          // Shim only promise getStats with spec-hyphens in type names
          // Leave callback version alone; misc old uses of forEach before Map
          try {
            stats.forEach(stat => {
              stat.type = modernStatsTypes[stat.type] || stat.type;
            });
          } catch (e) {
            if (e.name !== 'TypeError') {
              throw e;
            }
            // Avoid TypeError: "type" is read-only, in old versions. 34-43ish
            stats.forEach((stat, i) => {
              stats.set(i, Object.assign({}, stat, {
                type: modernStatsTypes[stat.type] || stat.type
              }));
            });
          }
        }
        return stats;
      })
      .then(onSucc, onErr);
  };
}

function shimSenderGetStats(window) {
  if (!(typeof window === 'object' && window.RTCPeerConnection &&
      window.RTCRtpSender)) {
    return;
  }
  if (window.RTCRtpSender && 'getStats' in window.RTCRtpSender.prototype) {
    return;
  }
  const origGetSenders = window.RTCPeerConnection.prototype.getSenders;
  if (origGetSenders) {
    window.RTCPeerConnection.prototype.getSenders = function getSenders() {
      const senders = origGetSenders.apply(this, []);
      senders.forEach(sender => sender._pc = this);
      return senders;
    };
  }

  const origAddTrack = window.RTCPeerConnection.prototype.addTrack;
  if (origAddTrack) {
    window.RTCPeerConnection.prototype.addTrack = function addTrack() {
      const sender = origAddTrack.apply(this, arguments);
      sender._pc = this;
      return sender;
    };
  }
  window.RTCRtpSender.prototype.getStats = function getStats() {
    return this.track ? this._pc.getStats(this.track) :
        Promise.resolve(new Map());
  };
}

function shimReceiverGetStats(window) {
  if (!(typeof window === 'object' && window.RTCPeerConnection &&
      window.RTCRtpSender)) {
    return;
  }
  if (window.RTCRtpSender && 'getStats' in window.RTCRtpReceiver.prototype) {
    return;
  }
  const origGetReceivers = window.RTCPeerConnection.prototype.getReceivers;
  if (origGetReceivers) {
    window.RTCPeerConnection.prototype.getReceivers = function getReceivers() {
      const receivers = origGetReceivers.apply(this, []);
      receivers.forEach(receiver => receiver._pc = this);
      return receivers;
    };
  }
  wrapPeerConnectionEvent(window, 'track', e => {
    e.receiver._pc = e.srcElement;
    return e;
  });
  window.RTCRtpReceiver.prototype.getStats = function getStats() {
    return this._pc.getStats(this.track);
  };
}

function shimRemoveStream(window) {
  if (!window.RTCPeerConnection ||
      'removeStream' in window.RTCPeerConnection.prototype) {
    return;
  }
  window.RTCPeerConnection.prototype.removeStream =
    function removeStream(stream) {
      deprecated('removeStream', 'removeTrack');
      this.getSenders().forEach(sender => {
        if (sender.track && stream.getTracks().includes(sender.track)) {
          this.removeTrack(sender);
        }
      });
    };
}

function shimRTCDataChannel(window) {
  // rename DataChannel to RTCDataChannel (native fix in FF60):
  // https://bugzilla.mozilla.org/show_bug.cgi?id=1173851
  if (window.DataChannel && !window.RTCDataChannel) {
    window.RTCDataChannel = window.DataChannel;
  }
}

function shimAddTransceiver(window) {
  // https://github.com/webrtcHacks/adapter/issues/998#issuecomment-516921647
  // Firefox ignores the init sendEncodings options passed to addTransceiver
  // https://bugzilla.mozilla.org/show_bug.cgi?id=1396918
  if (!(typeof window === 'object' && window.RTCPeerConnection)) {
    return;
  }
  const origAddTransceiver = window.RTCPeerConnection.prototype.addTransceiver;
  if (origAddTransceiver) {
    window.RTCPeerConnection.prototype.addTransceiver =
      function addTransceiver() {
        this.setParametersPromises = [];
        const initParameters = arguments[1];
        const shouldPerformCheck = initParameters &&
                                  'sendEncodings' in initParameters;
        if (shouldPerformCheck) {
          // If sendEncodings params are provided, validate grammar
          initParameters.sendEncodings.forEach((encodingParam) => {
            if ('rid' in encodingParam) {
              const ridRegex = /^[a-z0-9]{0,16}$/i;
              if (!ridRegex.test(encodingParam.rid)) {
                throw new TypeError('Invalid RID value provided.');
              }
            }
            if ('scaleResolutionDownBy' in encodingParam) {
              if (!(parseFloat(encodingParam.scaleResolutionDownBy) >= 1.0)) {
                throw new RangeError('scale_resolution_down_by must be >= 1.0');
              }
            }
            if ('maxFramerate' in encodingParam) {
              if (!(parseFloat(encodingParam.maxFramerate) >= 0)) {
                throw new RangeError('max_framerate must be >= 0.0');
              }
            }
          });
        }
        const transceiver = origAddTransceiver.apply(this, arguments);
        if (shouldPerformCheck) {
          // Check if the init options were applied. If not we do this in an
          // asynchronous way and save the promise reference in a global object.
          // This is an ugly hack, but at the same time is way more robust than
          // checking the sender parameters before and after the createOffer
          // Also note that after the createoffer we are not 100% sure that
          // the params were asynchronously applied so we might miss the
          // opportunity to recreate offer.
          const {sender} = transceiver;
          const params = sender.getParameters();
          if (!('encodings' in params)) {
            params.encodings = initParameters.sendEncodings;
            this.setParametersPromises.push(
              sender.setParameters(params)
              .catch(() => {})
            );
          }
        }
        return transceiver;
      };
  }
}

function shimCreateOffer(window) {
  // https://github.com/webrtcHacks/adapter/issues/998#issuecomment-516921647
  // Firefox ignores the init sendEncodings options passed to addTransceiver
  // https://bugzilla.mozilla.org/show_bug.cgi?id=1396918
  if (!(typeof window === 'object' && window.RTCPeerConnection)) {
    return;
  }
  const origCreateOffer = window.RTCPeerConnection.prototype.createOffer;
  window.RTCPeerConnection.prototype.createOffer = function createOffer() {
    if (this.setParametersPromises && this.setParametersPromises.length) {
      return Promise.all(this.setParametersPromises)
      .then(() => {
        return origCreateOffer.apply(this, arguments);
      })
      .finally(() => {
        this.setParametersPromises = [];
      });
    }
    return origCreateOffer.apply(this, arguments);
  };
}

function shimCreateAnswer(window) {
  // https://github.com/webrtcHacks/adapter/issues/998#issuecomment-516921647
  // Firefox ignores the init sendEncodings options passed to addTransceiver
  // https://bugzilla.mozilla.org/show_bug.cgi?id=1396918
  if (!(typeof window === 'object' && window.RTCPeerConnection)) {
    return;
  }
  const origCreateAnswer = window.RTCPeerConnection.prototype.createAnswer;
  window.RTCPeerConnection.prototype.createAnswer = function createAnswer() {
    if (this.setParametersPromises && this.setParametersPromises.length) {
      return Promise.all(this.setParametersPromises)
      .then(() => {
        return origCreateAnswer.apply(this, arguments);
      })
      .finally(() => {
        this.setParametersPromises = [];
      });
    }
    return origCreateAnswer.apply(this, arguments);
  };
}

var firefoxShim = /*#__PURE__*/Object.freeze({
  __proto__: null,
  shimOnTrack: shimOnTrack$1,
  shimPeerConnection: shimPeerConnection$2,
  shimSenderGetStats: shimSenderGetStats,
  shimReceiverGetStats: shimReceiverGetStats,
  shimRemoveStream: shimRemoveStream,
  shimRTCDataChannel: shimRTCDataChannel,
  shimAddTransceiver: shimAddTransceiver,
  shimCreateOffer: shimCreateOffer,
  shimCreateAnswer: shimCreateAnswer,
  shimGetUserMedia: shimGetUserMedia$2,
  shimGetDisplayMedia: shimGetDisplayMedia$2
});

/*
 *  Copyright (c) 2016 The WebRTC project authors. All Rights Reserved.
 *
 *  Use of this source code is governed by a BSD-style license
 *  that can be found in the LICENSE file in the root of the source
 *  tree.
 */

function shimLocalStreamsAPI(window) {
  if (typeof window !== 'object' || !window.RTCPeerConnection) {
    return;
  }
  if (!('getLocalStreams' in window.RTCPeerConnection.prototype)) {
    window.RTCPeerConnection.prototype.getLocalStreams =
      function getLocalStreams() {
        if (!this._localStreams) {
          this._localStreams = [];
        }
        return this._localStreams;
      };
  }
  if (!('addStream' in window.RTCPeerConnection.prototype)) {
    const _addTrack = window.RTCPeerConnection.prototype.addTrack;
    window.RTCPeerConnection.prototype.addStream = function addStream(stream) {
      if (!this._localStreams) {
        this._localStreams = [];
      }
      if (!this._localStreams.includes(stream)) {
        this._localStreams.push(stream);
      }
      // Try to emulate Chrome's behaviour of adding in audio-video order.
      // Safari orders by track id.
      stream.getAudioTracks().forEach(track => _addTrack.call(this, track,
        stream));
      stream.getVideoTracks().forEach(track => _addTrack.call(this, track,
        stream));
    };

    window.RTCPeerConnection.prototype.addTrack =
      function addTrack(track) {
        const stream = arguments[1];
        if (stream) {
          if (!this._localStreams) {
            this._localStreams = [stream];
          } else if (!this._localStreams.includes(stream)) {
            this._localStreams.push(stream);
          }
        }
        return _addTrack.apply(this, arguments);
      };
  }
  if (!('removeStream' in window.RTCPeerConnection.prototype)) {
    window.RTCPeerConnection.prototype.removeStream =
      function removeStream(stream) {
        if (!this._localStreams) {
          this._localStreams = [];
        }
        const index = this._localStreams.indexOf(stream);
        if (index === -1) {
          return;
        }
        this._localStreams.splice(index, 1);
        const tracks = stream.getTracks();
        this.getSenders().forEach(sender => {
          if (tracks.includes(sender.track)) {
            this.removeTrack(sender);
          }
        });
      };
  }
}

function shimRemoteStreamsAPI(window) {
  if (typeof window !== 'object' || !window.RTCPeerConnection) {
    return;
  }
  if (!('getRemoteStreams' in window.RTCPeerConnection.prototype)) {
    window.RTCPeerConnection.prototype.getRemoteStreams =
      function getRemoteStreams() {
        return this._remoteStreams ? this._remoteStreams : [];
      };
  }
  if (!('onaddstream' in window.RTCPeerConnection.prototype)) {
    Object.defineProperty(window.RTCPeerConnection.prototype, 'onaddstream', {
      get() {
        return this._onaddstream;
      },
      set(f) {
        if (this._onaddstream) {
          this.removeEventListener('addstream', this._onaddstream);
          this.removeEventListener('track', this._onaddstreampoly);
        }
        this.addEventListener('addstream', this._onaddstream = f);
        this.addEventListener('track', this._onaddstreampoly = (e) => {
          e.streams.forEach(stream => {
            if (!this._remoteStreams) {
              this._remoteStreams = [];
            }
            if (this._remoteStreams.includes(stream)) {
              return;
            }
            this._remoteStreams.push(stream);
            const event = new Event('addstream');
            event.stream = stream;
            this.dispatchEvent(event);
          });
        });
      }
    });
    const origSetRemoteDescription =
      window.RTCPeerConnection.prototype.setRemoteDescription;
    window.RTCPeerConnection.prototype.setRemoteDescription =
      function setRemoteDescription() {
        const pc = this;
        if (!this._onaddstreampoly) {
          this.addEventListener('track', this._onaddstreampoly = function(e) {
            e.streams.forEach(stream => {
              if (!pc._remoteStreams) {
                pc._remoteStreams = [];
              }
              if (pc._remoteStreams.indexOf(stream) >= 0) {
                return;
              }
              pc._remoteStreams.push(stream);
              const event = new Event('addstream');
              event.stream = stream;
              pc.dispatchEvent(event);
            });
          });
        }
        return origSetRemoteDescription.apply(pc, arguments);
      };
  }
}

function shimCallbacksAPI(window) {
  if (typeof window !== 'object' || !window.RTCPeerConnection) {
    return;
  }
  const prototype = window.RTCPeerConnection.prototype;
  const origCreateOffer = prototype.createOffer;
  const origCreateAnswer = prototype.createAnswer;
  const setLocalDescription = prototype.setLocalDescription;
  const setRemoteDescription = prototype.setRemoteDescription;
  const addIceCandidate = prototype.addIceCandidate;

  prototype.createOffer =
    function createOffer(successCallback, failureCallback) {
      const options = (arguments.length >= 2) ? arguments[2] : arguments[0];
      const promise = origCreateOffer.apply(this, [options]);
      if (!failureCallback) {
        return promise;
      }
      promise.then(successCallback, failureCallback);
      return Promise.resolve();
    };

  prototype.createAnswer =
    function createAnswer(successCallback, failureCallback) {
      const options = (arguments.length >= 2) ? arguments[2] : arguments[0];
      const promise = origCreateAnswer.apply(this, [options]);
      if (!failureCallback) {
        return promise;
      }
      promise.then(successCallback, failureCallback);
      return Promise.resolve();
    };

  let withCallback = function(description, successCallback, failureCallback) {
    const promise = setLocalDescription.apply(this, [description]);
    if (!failureCallback) {
      return promise;
    }
    promise.then(successCallback, failureCallback);
    return Promise.resolve();
  };
  prototype.setLocalDescription = withCallback;

  withCallback = function(description, successCallback, failureCallback) {
    const promise = setRemoteDescription.apply(this, [description]);
    if (!failureCallback) {
      return promise;
    }
    promise.then(successCallback, failureCallback);
    return Promise.resolve();
  };
  prototype.setRemoteDescription = withCallback;

  withCallback = function(candidate, successCallback, failureCallback) {
    const promise = addIceCandidate.apply(this, [candidate]);
    if (!failureCallback) {
      return promise;
    }
    promise.then(successCallback, failureCallback);
    return Promise.resolve();
  };
  prototype.addIceCandidate = withCallback;
}

function shimGetUserMedia$3(window) {
  const navigator = window && window.navigator;

  if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
    // shim not needed in Safari 12.1
    const mediaDevices = navigator.mediaDevices;
    const _getUserMedia = mediaDevices.getUserMedia.bind(mediaDevices);
    navigator.mediaDevices.getUserMedia = (constraints) => {
      return _getUserMedia(shimConstraints(constraints));
    };
  }

  if (!navigator.getUserMedia && navigator.mediaDevices &&
    navigator.mediaDevices.getUserMedia) {
    navigator.getUserMedia = function getUserMedia(constraints, cb, errcb) {
      navigator.mediaDevices.getUserMedia(constraints)
      .then(cb, errcb);
    }.bind(navigator);
  }
}

function shimConstraints(constraints) {
  if (constraints && constraints.video !== undefined) {
    return Object.assign({},
      constraints,
      {video: compactObject(constraints.video)}
    );
  }

  return constraints;
}

function shimRTCIceServerUrls(window) {
  // migrate from non-spec RTCIceServer.url to RTCIceServer.urls
  const OrigPeerConnection = window.RTCPeerConnection;
  window.RTCPeerConnection =
    function RTCPeerConnection(pcConfig, pcConstraints) {
      if (pcConfig && pcConfig.iceServers) {
        const newIceServers = [];
        for (let i = 0; i < pcConfig.iceServers.length; i++) {
          let server = pcConfig.iceServers[i];
          if (!server.hasOwnProperty('urls') &&
              server.hasOwnProperty('url')) {
            deprecated('RTCIceServer.url', 'RTCIceServer.urls');
            server = JSON.parse(JSON.stringify(server));
            server.urls = server.url;
            delete server.url;
            newIceServers.push(server);
          } else {
            newIceServers.push(pcConfig.iceServers[i]);
          }
        }
        pcConfig.iceServers = newIceServers;
      }
      return new OrigPeerConnection(pcConfig, pcConstraints);
    };
  window.RTCPeerConnection.prototype = OrigPeerConnection.prototype;
  // wrap static methods. Currently just generateCertificate.
  if ('generateCertificate' in window.RTCPeerConnection) {
    Object.defineProperty(window.RTCPeerConnection, 'generateCertificate', {
      get() {
        return OrigPeerConnection.generateCertificate;
      }
    });
  }
}

function shimTrackEventTransceiver(window) {
  // Add event.transceiver member over deprecated event.receiver
  if (typeof window === 'object' && window.RTCTrackEvent &&
      'receiver' in window.RTCTrackEvent.prototype &&
      !('transceiver' in window.RTCTrackEvent.prototype)) {
    Object.defineProperty(window.RTCTrackEvent.prototype, 'transceiver', {
      get() {
        return {receiver: this.receiver};
      }
    });
  }
}

function shimCreateOfferLegacy(window) {
  const origCreateOffer = window.RTCPeerConnection.prototype.createOffer;
  window.RTCPeerConnection.prototype.createOffer =
    function createOffer(offerOptions) {
      if (offerOptions) {
        if (typeof offerOptions.offerToReceiveAudio !== 'undefined') {
          // support bit values
          offerOptions.offerToReceiveAudio =
            !!offerOptions.offerToReceiveAudio;
        }
        const audioTransceiver = this.getTransceivers().find(transceiver =>
          transceiver.receiver.track.kind === 'audio');
        if (offerOptions.offerToReceiveAudio === false && audioTransceiver) {
          if (audioTransceiver.direction === 'sendrecv') {
            if (audioTransceiver.setDirection) {
              audioTransceiver.setDirection('sendonly');
            } else {
              audioTransceiver.direction = 'sendonly';
            }
          } else if (audioTransceiver.direction === 'recvonly') {
            if (audioTransceiver.setDirection) {
              audioTransceiver.setDirection('inactive');
            } else {
              audioTransceiver.direction = 'inactive';
            }
          }
        } else if (offerOptions.offerToReceiveAudio === true &&
            !audioTransceiver) {
          this.addTransceiver('audio');
        }

        if (typeof offerOptions.offerToReceiveVideo !== 'undefined') {
          // support bit values
          offerOptions.offerToReceiveVideo =
            !!offerOptions.offerToReceiveVideo;
        }
        const videoTransceiver = this.getTransceivers().find(transceiver =>
          transceiver.receiver.track.kind === 'video');
        if (offerOptions.offerToReceiveVideo === false && videoTransceiver) {
          if (videoTransceiver.direction === 'sendrecv') {
            if (videoTransceiver.setDirection) {
              videoTransceiver.setDirection('sendonly');
            } else {
              videoTransceiver.direction = 'sendonly';
            }
          } else if (videoTransceiver.direction === 'recvonly') {
            if (videoTransceiver.setDirection) {
              videoTransceiver.setDirection('inactive');
            } else {
              videoTransceiver.direction = 'inactive';
            }
          }
        } else if (offerOptions.offerToReceiveVideo === true &&
            !videoTransceiver) {
          this.addTransceiver('video');
        }
      }
      return origCreateOffer.apply(this, arguments);
    };
}

var safariShim = /*#__PURE__*/Object.freeze({
  __proto__: null,
  shimLocalStreamsAPI: shimLocalStreamsAPI,
  shimRemoteStreamsAPI: shimRemoteStreamsAPI,
  shimCallbacksAPI: shimCallbacksAPI,
  shimGetUserMedia: shimGetUserMedia$3,
  shimConstraints: shimConstraints,
  shimRTCIceServerUrls: shimRTCIceServerUrls,
  shimTrackEventTransceiver: shimTrackEventTransceiver,
  shimCreateOfferLegacy: shimCreateOfferLegacy
});

/*
 *  Copyright (c) 2017 The WebRTC project authors. All Rights Reserved.
 *
 *  Use of this source code is governed by a BSD-style license
 *  that can be found in the LICENSE file in the root of the source
 *  tree.
 */

function shimRTCIceCandidate(window) {
  // foundation is arbitrarily chosen as an indicator for full support for
  // https://w3c.github.io/webrtc-pc/#rtcicecandidate-interface
  if (!window.RTCIceCandidate || (window.RTCIceCandidate && 'foundation' in
      window.RTCIceCandidate.prototype)) {
    return;
  }

  const NativeRTCIceCandidate = window.RTCIceCandidate;
  window.RTCIceCandidate = function RTCIceCandidate(args) {
    // Remove the a= which shouldn't be part of the candidate string.
    if (typeof args === 'object' && args.candidate &&
        args.candidate.indexOf('a=') === 0) {
      args = JSON.parse(JSON.stringify(args));
      args.candidate = args.candidate.substr(2);
    }

    if (args.candidate && args.candidate.length) {
      // Augment the native candidate with the parsed fields.
      const nativeCandidate = new NativeRTCIceCandidate(args);
      const parsedCandidate = sdp.parseCandidate(args.candidate);
      const augmentedCandidate = Object.assign(nativeCandidate,
          parsedCandidate);

      // Add a serializer that does not serialize the extra attributes.
      augmentedCandidate.toJSON = function toJSON() {
        return {
          candidate: augmentedCandidate.candidate,
          sdpMid: augmentedCandidate.sdpMid,
          sdpMLineIndex: augmentedCandidate.sdpMLineIndex,
          usernameFragment: augmentedCandidate.usernameFragment,
        };
      };
      return augmentedCandidate;
    }
    return new NativeRTCIceCandidate(args);
  };
  window.RTCIceCandidate.prototype = NativeRTCIceCandidate.prototype;

  // Hook up the augmented candidate in onicecandidate and
  // addEventListener('icecandidate', ...)
  wrapPeerConnectionEvent(window, 'icecandidate', e => {
    if (e.candidate) {
      Object.defineProperty(e, 'candidate', {
        value: new window.RTCIceCandidate(e.candidate),
        writable: 'false'
      });
    }
    return e;
  });
}

function shimMaxMessageSize(window) {
  if (!window.RTCPeerConnection) {
    return;
  }
  const browserDetails = detectBrowser(window);

  if (!('sctp' in window.RTCPeerConnection.prototype)) {
    Object.defineProperty(window.RTCPeerConnection.prototype, 'sctp', {
      get() {
        return typeof this._sctp === 'undefined' ? null : this._sctp;
      }
    });
  }

  const sctpInDescription = function(description) {
    if (!description || !description.sdp) {
      return false;
    }
    const sections = sdp.splitSections(description.sdp);
    sections.shift();
    return sections.some(mediaSection => {
      const mLine = sdp.parseMLine(mediaSection);
      return mLine && mLine.kind === 'application'
          && mLine.protocol.indexOf('SCTP') !== -1;
    });
  };

  const getRemoteFirefoxVersion = function(description) {
    // TODO: Is there a better solution for detecting Firefox?
    const match = description.sdp.match(/mozilla...THIS_IS_SDPARTA-(\d+)/);
    if (match === null || match.length < 2) {
      return -1;
    }
    const version = parseInt(match[1], 10);
    // Test for NaN (yes, this is ugly)
    return version !== version ? -1 : version;
  };

  const getCanSendMaxMessageSize = function(remoteIsFirefox) {
    // Every implementation we know can send at least 64 KiB.
    // Note: Although Chrome is technically able to send up to 256 KiB, the
    //       data does not reach the other peer reliably.
    //       See: https://bugs.chromium.org/p/webrtc/issues/detail?id=8419
    let canSendMaxMessageSize = 65536;
    if (browserDetails.browser === 'firefox') {
      if (browserDetails.version < 57) {
        if (remoteIsFirefox === -1) {
          // FF < 57 will send in 16 KiB chunks using the deprecated PPID
          // fragmentation.
          canSendMaxMessageSize = 16384;
        } else {
          // However, other FF (and RAWRTC) can reassemble PPID-fragmented
          // messages. Thus, supporting ~2 GiB when sending.
          canSendMaxMessageSize = 2147483637;
        }
      } else if (browserDetails.version < 60) {
        // Currently, all FF >= 57 will reset the remote maximum message size
        // to the default value when a data channel is created at a later
        // stage. :(
        // See: https://bugzilla.mozilla.org/show_bug.cgi?id=1426831
        canSendMaxMessageSize =
          browserDetails.version === 57 ? 65535 : 65536;
      } else {
        // FF >= 60 supports sending ~2 GiB
        canSendMaxMessageSize = 2147483637;
      }
    }
    return canSendMaxMessageSize;
  };

  const getMaxMessageSize = function(description, remoteIsFirefox) {
    // Note: 65536 bytes is the default value from the SDP spec. Also,
    //       every implementation we know supports receiving 65536 bytes.
    let maxMessageSize = 65536;

    // FF 57 has a slightly incorrect default remote max message size, so
    // we need to adjust it here to avoid a failure when sending.
    // See: https://bugzilla.mozilla.org/show_bug.cgi?id=1425697
    if (browserDetails.browser === 'firefox'
         && browserDetails.version === 57) {
      maxMessageSize = 65535;
    }

    const match = sdp.matchPrefix(description.sdp,
      'a=max-message-size:');
    if (match.length > 0) {
      maxMessageSize = parseInt(match[0].substr(19), 10);
    } else if (browserDetails.browser === 'firefox' &&
                remoteIsFirefox !== -1) {
      // If the maximum message size is not present in the remote SDP and
      // both local and remote are Firefox, the remote peer can receive
      // ~2 GiB.
      maxMessageSize = 2147483637;
    }
    return maxMessageSize;
  };

  const origSetRemoteDescription =
      window.RTCPeerConnection.prototype.setRemoteDescription;
  window.RTCPeerConnection.prototype.setRemoteDescription =
    function setRemoteDescription() {
      this._sctp = null;
      // Chrome decided to not expose .sctp in plan-b mode.
      // As usual, adapter.js has to do an 'ugly worakaround'
      // to cover up the mess.
      if (browserDetails.browser === 'chrome' && browserDetails.version >= 76) {
        const {sdpSemantics} = this.getConfiguration();
        if (sdpSemantics === 'plan-b') {
          Object.defineProperty(this, 'sctp', {
            get() {
              return typeof this._sctp === 'undefined' ? null : this._sctp;
            },
            enumerable: true,
            configurable: true,
          });
        }
      }

      if (sctpInDescription(arguments[0])) {
        // Check if the remote is FF.
        const isFirefox = getRemoteFirefoxVersion(arguments[0]);

        // Get the maximum message size the local peer is capable of sending
        const canSendMMS = getCanSendMaxMessageSize(isFirefox);

        // Get the maximum message size of the remote peer.
        const remoteMMS = getMaxMessageSize(arguments[0], isFirefox);

        // Determine final maximum message size
        let maxMessageSize;
        if (canSendMMS === 0 && remoteMMS === 0) {
          maxMessageSize = Number.POSITIVE_INFINITY;
        } else if (canSendMMS === 0 || remoteMMS === 0) {
          maxMessageSize = Math.max(canSendMMS, remoteMMS);
        } else {
          maxMessageSize = Math.min(canSendMMS, remoteMMS);
        }

        // Create a dummy RTCSctpTransport object and the 'maxMessageSize'
        // attribute.
        const sctp = {};
        Object.defineProperty(sctp, 'maxMessageSize', {
          get() {
            return maxMessageSize;
          }
        });
        this._sctp = sctp;
      }

      return origSetRemoteDescription.apply(this, arguments);
    };
}

function shimSendThrowTypeError(window) {
  if (!(window.RTCPeerConnection &&
      'createDataChannel' in window.RTCPeerConnection.prototype)) {
    return;
  }

  // Note: Although Firefox >= 57 has a native implementation, the maximum
  //       message size can be reset for all data channels at a later stage.
  //       See: https://bugzilla.mozilla.org/show_bug.cgi?id=1426831

  function wrapDcSend(dc, pc) {
    const origDataChannelSend = dc.send;
    dc.send = function send() {
      const data = arguments[0];
      const length = data.length || data.size || data.byteLength;
      if (dc.readyState === 'open' &&
          pc.sctp && length > pc.sctp.maxMessageSize) {
        throw new TypeError('Message too large (can send a maximum of ' +
          pc.sctp.maxMessageSize + ' bytes)');
      }
      return origDataChannelSend.apply(dc, arguments);
    };
  }
  const origCreateDataChannel =
    window.RTCPeerConnection.prototype.createDataChannel;
  window.RTCPeerConnection.prototype.createDataChannel =
    function createDataChannel() {
      const dataChannel = origCreateDataChannel.apply(this, arguments);
      wrapDcSend(dataChannel, this);
      return dataChannel;
    };
  wrapPeerConnectionEvent(window, 'datachannel', e => {
    wrapDcSend(e.channel, e.target);
    return e;
  });
}


/* shims RTCConnectionState by pretending it is the same as iceConnectionState.
 * See https://bugs.chromium.org/p/webrtc/issues/detail?id=6145#c12
 * for why this is a valid hack in Chrome. In Firefox it is slightly incorrect
 * since DTLS failures would be hidden. See
 * https://bugzilla.mozilla.org/show_bug.cgi?id=1265827
 * for the Firefox tracking bug.
 */
function shimConnectionState(window) {
  if (!window.RTCPeerConnection ||
      'connectionState' in window.RTCPeerConnection.prototype) {
    return;
  }
  const proto = window.RTCPeerConnection.prototype;
  Object.defineProperty(proto, 'connectionState', {
    get() {
      return {
        completed: 'connected',
        checking: 'connecting'
      }[this.iceConnectionState] || this.iceConnectionState;
    },
    enumerable: true,
    configurable: true
  });
  Object.defineProperty(proto, 'onconnectionstatechange', {
    get() {
      return this._onconnectionstatechange || null;
    },
    set(cb) {
      if (this._onconnectionstatechange) {
        this.removeEventListener('connectionstatechange',
            this._onconnectionstatechange);
        delete this._onconnectionstatechange;
      }
      if (cb) {
        this.addEventListener('connectionstatechange',
            this._onconnectionstatechange = cb);
      }
    },
    enumerable: true,
    configurable: true
  });

  ['setLocalDescription', 'setRemoteDescription'].forEach((method) => {
    const origMethod = proto[method];
    proto[method] = function() {
      if (!this._connectionstatechangepoly) {
        this._connectionstatechangepoly = e => {
          const pc = e.target;
          if (pc._lastConnectionState !== pc.connectionState) {
            pc._lastConnectionState = pc.connectionState;
            const newEvent = new Event('connectionstatechange', e);
            pc.dispatchEvent(newEvent);
          }
          return e;
        };
        this.addEventListener('iceconnectionstatechange',
          this._connectionstatechangepoly);
      }
      return origMethod.apply(this, arguments);
    };
  });
}

function removeAllowExtmapMixed(window) {
  /* remove a=extmap-allow-mixed for Chrome < M71 */
  if (!window.RTCPeerConnection) {
    return;
  }
  const browserDetails = detectBrowser(window);
  if (browserDetails.browser === 'chrome' && browserDetails.version >= 71) {
    return;
  }
  const nativeSRD = window.RTCPeerConnection.prototype.setRemoteDescription;
  window.RTCPeerConnection.prototype.setRemoteDescription =
  function setRemoteDescription(desc) {
    if (desc && desc.sdp && desc.sdp.indexOf('\na=extmap-allow-mixed') !== -1) {
      desc.sdp = desc.sdp.split('\n').filter((line) => {
        return line.trim() !== 'a=extmap-allow-mixed';
      }).join('\n');
    }
    return nativeSRD.apply(this, arguments);
  };
}

var commonShim = /*#__PURE__*/Object.freeze({
  __proto__: null,
  shimRTCIceCandidate: shimRTCIceCandidate,
  shimMaxMessageSize: shimMaxMessageSize,
  shimSendThrowTypeError: shimSendThrowTypeError,
  shimConnectionState: shimConnectionState,
  removeAllowExtmapMixed: removeAllowExtmapMixed
});

/*
 *  Copyright (c) 2016 The WebRTC project authors. All Rights Reserved.
 *
 *  Use of this source code is governed by a BSD-style license
 *  that can be found in the LICENSE file in the root of the source
 *  tree.
 */

// Shimming starts here.
function adapterFactory({window} = {}, options = {
  shimChrome: true,
  shimFirefox: true,
  shimEdge: true,
  shimSafari: true,
}) {
  // Utils.
  const logging = log;
  const browserDetails = detectBrowser(window);

  const adapter = {
    browserDetails,
    commonShim,
    extractVersion: extractVersion,
    disableLog: disableLog,
    disableWarnings: disableWarnings
  };

  // Shim browser if found.
  switch (browserDetails.browser) {
    case 'chrome':
      if (!chromeShim || !shimPeerConnection ||
          !options.shimChrome) {
        logging('Chrome shim is not included in this adapter release.');
        return adapter;
      }
      logging('adapter.js shimming chrome.');
      // Export to the adapter global object visible in the browser.
      adapter.browserShim = chromeShim;

      shimGetUserMedia(window);
      shimMediaStream(window);
      shimPeerConnection(window);
      shimOnTrack(window);
      shimAddTrackRemoveTrack(window);
      shimGetSendersWithDtmf(window);
      shimGetStats(window);
      shimSenderReceiverGetStats(window);
      fixNegotiationNeeded(window);

      shimRTCIceCandidate(window);
      shimConnectionState(window);
      shimMaxMessageSize(window);
      shimSendThrowTypeError(window);
      removeAllowExtmapMixed(window);
      break;
    case 'firefox':
      if (!firefoxShim || !shimPeerConnection$2 ||
          !options.shimFirefox) {
        logging('Firefox shim is not included in this adapter release.');
        return adapter;
      }
      logging('adapter.js shimming firefox.');
      // Export to the adapter global object visible in the browser.
      adapter.browserShim = firefoxShim;

      shimGetUserMedia$2(window);
      shimPeerConnection$2(window);
      shimOnTrack$1(window);
      shimRemoveStream(window);
      shimSenderGetStats(window);
      shimReceiverGetStats(window);
      shimRTCDataChannel(window);
      shimAddTransceiver(window);
      shimCreateOffer(window);
      shimCreateAnswer(window);

      shimRTCIceCandidate(window);
      shimConnectionState(window);
      shimMaxMessageSize(window);
      shimSendThrowTypeError(window);
      break;
    case 'edge':
      if (!edgeShim || !shimPeerConnection$1 || !options.shimEdge) {
        logging('MS edge shim is not included in this adapter release.');
        return adapter;
      }
      logging('adapter.js shimming edge.');
      // Export to the adapter global object visible in the browser.
      adapter.browserShim = edgeShim;

      shimGetUserMedia$1(window);
      shimGetDisplayMedia$1(window);
      shimPeerConnection$1(window);
      shimReplaceTrack(window);

      // the edge shim implements the full RTCIceCandidate object.

      shimMaxMessageSize(window);
      shimSendThrowTypeError(window);
      break;
    case 'safari':
      if (!safariShim || !options.shimSafari) {
        logging('Safari shim is not included in this adapter release.');
        return adapter;
      }
      logging('adapter.js shimming safari.');
      // Export to the adapter global object visible in the browser.
      adapter.browserShim = safariShim;

      shimRTCIceServerUrls(window);
      shimCreateOfferLegacy(window);
      shimCallbacksAPI(window);
      shimLocalStreamsAPI(window);
      shimRemoteStreamsAPI(window);
      shimTrackEventTransceiver(window);
      shimGetUserMedia$3(window);

      shimRTCIceCandidate(window);
      shimMaxMessageSize(window);
      shimSendThrowTypeError(window);
      removeAllowExtmapMixed(window);
      break;
    default:
      logging('Unsupported browser!');
      break;
  }

  return adapter;
}

/*
 *  Copyright (c) 2016 The WebRTC project authors. All Rights Reserved.
 *
 *  Use of this source code is governed by a BSD-style license
 *  that can be found in the LICENSE file in the root of the source
 *  tree.
 */

const adapter = adapterFactory({window});

/**
 * Helpers.
 */

var s = 1000;
var m = s * 60;
var h = m * 60;
var d = h * 24;
var w = d * 7;
var y = d * 365.25;

/**
 * Parse or format the given `val`.
 *
 * Options:
 *
 *  - `long` verbose formatting [false]
 *
 * @param {String|Number} val
 * @param {Object} [options]
 * @throws {Error} throw an error if val is not a non-empty string or a number
 * @return {String|Number}
 * @api public
 */

var ms = function(val, options) {
  options = options || {};
  var type = typeof val;
  if (type === 'string' && val.length > 0) {
    return parse(val);
  } else if (type === 'number' && isFinite(val)) {
    return options.long ? fmtLong(val) : fmtShort(val);
  }
  throw new Error(
    'val is not a non-empty string or a valid number. val=' +
      JSON.stringify(val)
  );
};

/**
 * Parse the given `str` and return milliseconds.
 *
 * @param {String} str
 * @return {Number}
 * @api private
 */

function parse(str) {
  str = String(str);
  if (str.length > 100) {
    return;
  }
  var match = /^(-?(?:\d+)?\.?\d+) *(milliseconds?|msecs?|ms|seconds?|secs?|s|minutes?|mins?|m|hours?|hrs?|h|days?|d|weeks?|w|years?|yrs?|y)?$/i.exec(
    str
  );
  if (!match) {
    return;
  }
  var n = parseFloat(match[1]);
  var type = (match[2] || 'ms').toLowerCase();
  switch (type) {
    case 'years':
    case 'year':
    case 'yrs':
    case 'yr':
    case 'y':
      return n * y;
    case 'weeks':
    case 'week':
    case 'w':
      return n * w;
    case 'days':
    case 'day':
    case 'd':
      return n * d;
    case 'hours':
    case 'hour':
    case 'hrs':
    case 'hr':
    case 'h':
      return n * h;
    case 'minutes':
    case 'minute':
    case 'mins':
    case 'min':
    case 'm':
      return n * m;
    case 'seconds':
    case 'second':
    case 'secs':
    case 'sec':
    case 's':
      return n * s;
    case 'milliseconds':
    case 'millisecond':
    case 'msecs':
    case 'msec':
    case 'ms':
      return n;
    default:
      return undefined;
  }
}

/**
 * Short format for `ms`.
 *
 * @param {Number} ms
 * @return {String}
 * @api private
 */

function fmtShort(ms) {
  var msAbs = Math.abs(ms);
  if (msAbs >= d) {
    return Math.round(ms / d) + 'd';
  }
  if (msAbs >= h) {
    return Math.round(ms / h) + 'h';
  }
  if (msAbs >= m) {
    return Math.round(ms / m) + 'm';
  }
  if (msAbs >= s) {
    return Math.round(ms / s) + 's';
  }
  return ms + 'ms';
}

/**
 * Long format for `ms`.
 *
 * @param {Number} ms
 * @return {String}
 * @api private
 */

function fmtLong(ms) {
  var msAbs = Math.abs(ms);
  if (msAbs >= d) {
    return plural(ms, msAbs, d, 'day');
  }
  if (msAbs >= h) {
    return plural(ms, msAbs, h, 'hour');
  }
  if (msAbs >= m) {
    return plural(ms, msAbs, m, 'minute');
  }
  if (msAbs >= s) {
    return plural(ms, msAbs, s, 'second');
  }
  return ms + ' ms';
}

/**
 * Pluralization helper.
 */

function plural(ms, msAbs, n, name) {
  var isPlural = msAbs >= n * 1.5;
  return Math.round(ms / n) + ' ' + name + (isPlural ? 's' : '');
}

/**
 * This is the common logic for both the Node.js and web browser
 * implementations of `debug()`.
 */

function setup(env) {
	createDebug.debug = createDebug;
	createDebug.default = createDebug;
	createDebug.coerce = coerce;
	createDebug.disable = disable;
	createDebug.enable = enable;
	createDebug.enabled = enabled;
	createDebug.humanize = ms;

	Object.keys(env).forEach(key => {
		createDebug[key] = env[key];
	});

	/**
	* Active `debug` instances.
	*/
	createDebug.instances = [];

	/**
	* The currently active debug mode names, and names to skip.
	*/

	createDebug.names = [];
	createDebug.skips = [];

	/**
	* Map of special "%n" handling functions, for the debug "format" argument.
	*
	* Valid key names are a single, lower or upper-case letter, i.e. "n" and "N".
	*/
	createDebug.formatters = {};

	/**
	* Selects a color for a debug namespace
	* @param {String} namespace The namespace string for the for the debug instance to be colored
	* @return {Number|String} An ANSI color code for the given namespace
	* @api private
	*/
	function selectColor(namespace) {
		let hash = 0;

		for (let i = 0; i < namespace.length; i++) {
			hash = ((hash << 5) - hash) + namespace.charCodeAt(i);
			hash |= 0; // Convert to 32bit integer
		}

		return createDebug.colors[Math.abs(hash) % createDebug.colors.length];
	}
	createDebug.selectColor = selectColor;

	/**
	* Create a debugger with the given `namespace`.
	*
	* @param {String} namespace
	* @return {Function}
	* @api public
	*/
	function createDebug(namespace) {
		let prevTime;

		function debug(...args) {
			// Disabled?
			if (!debug.enabled) {
				return;
			}

			const self = debug;

			// Set `diff` timestamp
			const curr = Number(new Date());
			const ms = curr - (prevTime || curr);
			self.diff = ms;
			self.prev = prevTime;
			self.curr = curr;
			prevTime = curr;

			args[0] = createDebug.coerce(args[0]);

			if (typeof args[0] !== 'string') {
				// Anything else let's inspect with %O
				args.unshift('%O');
			}

			// Apply any `formatters` transformations
			let index = 0;
			args[0] = args[0].replace(/%([a-zA-Z%])/g, (match, format) => {
				// If we encounter an escaped % then don't increase the array index
				if (match === '%%') {
					return match;
				}
				index++;
				const formatter = createDebug.formatters[format];
				if (typeof formatter === 'function') {
					const val = args[index];
					match = formatter.call(self, val);

					// Now we need to remove `args[index]` since it's inlined in the `format`
					args.splice(index, 1);
					index--;
				}
				return match;
			});

			// Apply env-specific formatting (colors, etc.)
			createDebug.formatArgs.call(self, args);

			const logFn = self.log || createDebug.log;
			logFn.apply(self, args);
		}

		debug.namespace = namespace;
		debug.enabled = createDebug.enabled(namespace);
		debug.useColors = createDebug.useColors();
		debug.color = selectColor(namespace);
		debug.destroy = destroy;
		debug.extend = extend;
		// Debug.formatArgs = formatArgs;
		// debug.rawLog = rawLog;

		// env-specific initialization logic for debug instances
		if (typeof createDebug.init === 'function') {
			createDebug.init(debug);
		}

		createDebug.instances.push(debug);

		return debug;
	}

	function destroy() {
		const index = createDebug.instances.indexOf(this);
		if (index !== -1) {
			createDebug.instances.splice(index, 1);
			return true;
		}
		return false;
	}

	function extend(namespace, delimiter) {
		const newDebug = createDebug(this.namespace + (typeof delimiter === 'undefined' ? ':' : delimiter) + namespace);
		newDebug.log = this.log;
		return newDebug;
	}

	/**
	* Enables a debug mode by namespaces. This can include modes
	* separated by a colon and wildcards.
	*
	* @param {String} namespaces
	* @api public
	*/
	function enable(namespaces) {
		createDebug.save(namespaces);

		createDebug.names = [];
		createDebug.skips = [];

		let i;
		const split = (typeof namespaces === 'string' ? namespaces : '').split(/[\s,]+/);
		const len = split.length;

		for (i = 0; i < len; i++) {
			if (!split[i]) {
				// ignore empty strings
				continue;
			}

			namespaces = split[i].replace(/\*/g, '.*?');

			if (namespaces[0] === '-') {
				createDebug.skips.push(new RegExp('^' + namespaces.substr(1) + '$'));
			} else {
				createDebug.names.push(new RegExp('^' + namespaces + '$'));
			}
		}

		for (i = 0; i < createDebug.instances.length; i++) {
			const instance = createDebug.instances[i];
			instance.enabled = createDebug.enabled(instance.namespace);
		}
	}

	/**
	* Disable debug output.
	*
	* @return {String} namespaces
	* @api public
	*/
	function disable() {
		const namespaces = [
			...createDebug.names.map(toNamespace),
			...createDebug.skips.map(toNamespace).map(namespace => '-' + namespace)
		].join(',');
		createDebug.enable('');
		return namespaces;
	}

	/**
	* Returns true if the given mode name is enabled, false otherwise.
	*
	* @param {String} name
	* @return {Boolean}
	* @api public
	*/
	function enabled(name) {
		if (name[name.length - 1] === '*') {
			return true;
		}

		let i;
		let len;

		for (i = 0, len = createDebug.skips.length; i < len; i++) {
			if (createDebug.skips[i].test(name)) {
				return false;
			}
		}

		for (i = 0, len = createDebug.names.length; i < len; i++) {
			if (createDebug.names[i].test(name)) {
				return true;
			}
		}

		return false;
	}

	/**
	* Convert regexp to namespace
	*
	* @param {RegExp} regxep
	* @return {String} namespace
	* @api private
	*/
	function toNamespace(regexp) {
		return regexp.toString()
			.substring(2, regexp.toString().length - 2)
			.replace(/\.\*\?$/, '*');
	}

	/**
	* Coerce `val`.
	*
	* @param {Mixed} val
	* @return {Mixed}
	* @api private
	*/
	function coerce(val) {
		if (val instanceof Error) {
			return val.stack || val.message;
		}
		return val;
	}

	createDebug.enable(createDebug.load());

	return createDebug;
}

var common = setup;

var browser = createCommonjsModule(function (module, exports) {
/* eslint-env browser */

/**
 * This is the web browser implementation of `debug()`.
 */

exports.log = log;
exports.formatArgs = formatArgs;
exports.save = save;
exports.load = load;
exports.useColors = useColors;
exports.storage = localstorage();

/**
 * Colors.
 */

exports.colors = [
	'#0000CC',
	'#0000FF',
	'#0033CC',
	'#0033FF',
	'#0066CC',
	'#0066FF',
	'#0099CC',
	'#0099FF',
	'#00CC00',
	'#00CC33',
	'#00CC66',
	'#00CC99',
	'#00CCCC',
	'#00CCFF',
	'#3300CC',
	'#3300FF',
	'#3333CC',
	'#3333FF',
	'#3366CC',
	'#3366FF',
	'#3399CC',
	'#3399FF',
	'#33CC00',
	'#33CC33',
	'#33CC66',
	'#33CC99',
	'#33CCCC',
	'#33CCFF',
	'#6600CC',
	'#6600FF',
	'#6633CC',
	'#6633FF',
	'#66CC00',
	'#66CC33',
	'#9900CC',
	'#9900FF',
	'#9933CC',
	'#9933FF',
	'#99CC00',
	'#99CC33',
	'#CC0000',
	'#CC0033',
	'#CC0066',
	'#CC0099',
	'#CC00CC',
	'#CC00FF',
	'#CC3300',
	'#CC3333',
	'#CC3366',
	'#CC3399',
	'#CC33CC',
	'#CC33FF',
	'#CC6600',
	'#CC6633',
	'#CC9900',
	'#CC9933',
	'#CCCC00',
	'#CCCC33',
	'#FF0000',
	'#FF0033',
	'#FF0066',
	'#FF0099',
	'#FF00CC',
	'#FF00FF',
	'#FF3300',
	'#FF3333',
	'#FF3366',
	'#FF3399',
	'#FF33CC',
	'#FF33FF',
	'#FF6600',
	'#FF6633',
	'#FF9900',
	'#FF9933',
	'#FFCC00',
	'#FFCC33'
];

/**
 * Currently only WebKit-based Web Inspectors, Firefox >= v31,
 * and the Firebug extension (any Firefox version) are known
 * to support "%c" CSS customizations.
 *
 * TODO: add a `localStorage` variable to explicitly enable/disable colors
 */

// eslint-disable-next-line complexity
function useColors() {
	// NB: In an Electron preload script, document will be defined but not fully
	// initialized. Since we know we're in Chrome, we'll just detect this case
	// explicitly
	if (typeof window !== 'undefined' && window.process && (window.process.type === 'renderer' || window.process.__nwjs)) {
		return true;
	}

	// Internet Explorer and Edge do not support colors.
	if (typeof navigator !== 'undefined' && navigator.userAgent && navigator.userAgent.toLowerCase().match(/(edge|trident)\/(\d+)/)) {
		return false;
	}

	// Is webkit? http://stackoverflow.com/a/16459606/376773
	// document is undefined in react-native: https://github.com/facebook/react-native/pull/1632
	return (typeof document !== 'undefined' && document.documentElement && document.documentElement.style && document.documentElement.style.WebkitAppearance) ||
		// Is firebug? http://stackoverflow.com/a/398120/376773
		(typeof window !== 'undefined' && window.console && (window.console.firebug || (window.console.exception && window.console.table))) ||
		// Is firefox >= v31?
		// https://developer.mozilla.org/en-US/docs/Tools/Web_Console#Styling_messages
		(typeof navigator !== 'undefined' && navigator.userAgent && navigator.userAgent.toLowerCase().match(/firefox\/(\d+)/) && parseInt(RegExp.$1, 10) >= 31) ||
		// Double check webkit in userAgent just in case we are in a worker
		(typeof navigator !== 'undefined' && navigator.userAgent && navigator.userAgent.toLowerCase().match(/applewebkit\/(\d+)/));
}

/**
 * Colorize log arguments if enabled.
 *
 * @api public
 */

function formatArgs(args) {
	args[0] = (this.useColors ? '%c' : '') +
		this.namespace +
		(this.useColors ? ' %c' : ' ') +
		args[0] +
		(this.useColors ? '%c ' : ' ') +
		'+' + module.exports.humanize(this.diff);

	if (!this.useColors) {
		return;
	}

	const c = 'color: ' + this.color;
	args.splice(1, 0, c, 'color: inherit');

	// The final "%c" is somewhat tricky, because there could be other
	// arguments passed either before or after the %c, so we need to
	// figure out the correct index to insert the CSS into
	let index = 0;
	let lastC = 0;
	args[0].replace(/%[a-zA-Z%]/g, match => {
		if (match === '%%') {
			return;
		}
		index++;
		if (match === '%c') {
			// We only are interested in the *last* %c
			// (the user may have provided their own)
			lastC = index;
		}
	});

	args.splice(lastC, 0, c);
}

/**
 * Invokes `console.log()` when available.
 * No-op when `console.log` is not a "function".
 *
 * @api public
 */
function log(...args) {
	// This hackery is required for IE8/9, where
	// the `console.log` function doesn't have 'apply'
	return typeof console === 'object' &&
		console.log &&
		console.log(...args);
}

/**
 * Save `namespaces`.
 *
 * @param {String} namespaces
 * @api private
 */
function save(namespaces) {
	try {
		if (namespaces) {
			exports.storage.setItem('debug', namespaces);
		} else {
			exports.storage.removeItem('debug');
		}
	} catch (error) {
		// Swallow
		// XXX (@Qix-) should we be logging these?
	}
}

/**
 * Load `namespaces`.
 *
 * @return {String} returns the previously persisted debug modes
 * @api private
 */
function load() {
	let r;
	try {
		r = exports.storage.getItem('debug');
	} catch (error) {
		// Swallow
		// XXX (@Qix-) should we be logging these?
	}

	// If debug isn't set in LS, and we're in Electron, try to load $DEBUG
	if (!r && typeof process !== 'undefined' && 'env' in process) {
		r = process.env.DEBUG;
	}

	return r;
}

/**
 * Localstorage attempts to return the localstorage.
 *
 * This is necessary because safari throws
 * when a user disables cookies/localstorage
 * and you attempt to access it.
 *
 * @return {LocalStorage}
 * @api private
 */

function localstorage() {
	try {
		// TVMLKit (Apple TV JS Runtime) does not have a window object, just localStorage in the global context
		// The Browser also has localStorage in the global context.
		return localStorage;
	} catch (error) {
		// Swallow
		// XXX (@Qix-) should we be logging these?
	}
}

module.exports = common(exports);

const {formatters} = module.exports;

/**
 * Map %j to `JSON.stringify()`, since no Web Inspectors do that by default.
 */

formatters.j = function (v) {
	try {
		return JSON.stringify(v);
	} catch (error) {
		return '[UnexpectedJSONParseError]: ' + error.message;
	}
};
});
var browser_1 = browser.log;
var browser_2 = browser.formatArgs;
var browser_3 = browser.save;
var browser_4 = browser.load;
var browser_5 = browser.useColors;
var browser_6 = browser.storage;
var browser_7 = browser.colors;

var bind = function bind(fn, thisArg) {
  return function wrap() {
    var args = new Array(arguments.length);
    for (var i = 0; i < args.length; i++) {
      args[i] = arguments[i];
    }
    return fn.apply(thisArg, args);
  };
};

/*!
 * Determine if an object is a Buffer
 *
 * @author   Feross Aboukhadijeh <https://feross.org>
 * @license  MIT
 */

var isBuffer = function isBuffer (obj) {
  return obj != null && obj.constructor != null &&
    typeof obj.constructor.isBuffer === 'function' && obj.constructor.isBuffer(obj)
};

/*global toString:true*/

// utils is a library of generic helper functions non-specific to axios

var toString = Object.prototype.toString;

/**
 * Determine if a value is an Array
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is an Array, otherwise false
 */
function isArray(val) {
  return toString.call(val) === '[object Array]';
}

/**
 * Determine if a value is an ArrayBuffer
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is an ArrayBuffer, otherwise false
 */
function isArrayBuffer(val) {
  return toString.call(val) === '[object ArrayBuffer]';
}

/**
 * Determine if a value is a FormData
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is an FormData, otherwise false
 */
function isFormData(val) {
  return (typeof FormData !== 'undefined') && (val instanceof FormData);
}

/**
 * Determine if a value is a view on an ArrayBuffer
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a view on an ArrayBuffer, otherwise false
 */
function isArrayBufferView(val) {
  var result;
  if ((typeof ArrayBuffer !== 'undefined') && (ArrayBuffer.isView)) {
    result = ArrayBuffer.isView(val);
  } else {
    result = (val) && (val.buffer) && (val.buffer instanceof ArrayBuffer);
  }
  return result;
}

/**
 * Determine if a value is a String
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a String, otherwise false
 */
function isString(val) {
  return typeof val === 'string';
}

/**
 * Determine if a value is a Number
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a Number, otherwise false
 */
function isNumber(val) {
  return typeof val === 'number';
}

/**
 * Determine if a value is undefined
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if the value is undefined, otherwise false
 */
function isUndefined(val) {
  return typeof val === 'undefined';
}

/**
 * Determine if a value is an Object
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is an Object, otherwise false
 */
function isObject$1(val) {
  return val !== null && typeof val === 'object';
}

/**
 * Determine if a value is a Date
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a Date, otherwise false
 */
function isDate(val) {
  return toString.call(val) === '[object Date]';
}

/**
 * Determine if a value is a File
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a File, otherwise false
 */
function isFile(val) {
  return toString.call(val) === '[object File]';
}

/**
 * Determine if a value is a Blob
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a Blob, otherwise false
 */
function isBlob(val) {
  return toString.call(val) === '[object Blob]';
}

/**
 * Determine if a value is a Function
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a Function, otherwise false
 */
function isFunction(val) {
  return toString.call(val) === '[object Function]';
}

/**
 * Determine if a value is a Stream
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a Stream, otherwise false
 */
function isStream(val) {
  return isObject$1(val) && isFunction(val.pipe);
}

/**
 * Determine if a value is a URLSearchParams object
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a URLSearchParams object, otherwise false
 */
function isURLSearchParams(val) {
  return typeof URLSearchParams !== 'undefined' && val instanceof URLSearchParams;
}

/**
 * Trim excess whitespace off the beginning and end of a string
 *
 * @param {String} str The String to trim
 * @returns {String} The String freed of excess whitespace
 */
function trim(str) {
  return str.replace(/^\s*/, '').replace(/\s*$/, '');
}

/**
 * Determine if we're running in a standard browser environment
 *
 * This allows axios to run in a web worker, and react-native.
 * Both environments support XMLHttpRequest, but not fully standard globals.
 *
 * web workers:
 *  typeof window -> undefined
 *  typeof document -> undefined
 *
 * react-native:
 *  navigator.product -> 'ReactNative'
 * nativescript
 *  navigator.product -> 'NativeScript' or 'NS'
 */
function isStandardBrowserEnv() {
  if (typeof navigator !== 'undefined' && (navigator.product === 'ReactNative' ||
                                           navigator.product === 'NativeScript' ||
                                           navigator.product === 'NS')) {
    return false;
  }
  return (
    typeof window !== 'undefined' &&
    typeof document !== 'undefined'
  );
}

/**
 * Iterate over an Array or an Object invoking a function for each item.
 *
 * If `obj` is an Array callback will be called passing
 * the value, index, and complete array for each item.
 *
 * If 'obj' is an Object callback will be called passing
 * the value, key, and complete object for each property.
 *
 * @param {Object|Array} obj The object to iterate
 * @param {Function} fn The callback to invoke for each item
 */
function forEach(obj, fn) {
  // Don't bother if no value provided
  if (obj === null || typeof obj === 'undefined') {
    return;
  }

  // Force an array if not already something iterable
  if (typeof obj !== 'object') {
    /*eslint no-param-reassign:0*/
    obj = [obj];
  }

  if (isArray(obj)) {
    // Iterate over array values
    for (var i = 0, l = obj.length; i < l; i++) {
      fn.call(null, obj[i], i, obj);
    }
  } else {
    // Iterate over object keys
    for (var key in obj) {
      if (Object.prototype.hasOwnProperty.call(obj, key)) {
        fn.call(null, obj[key], key, obj);
      }
    }
  }
}

/**
 * Accepts varargs expecting each argument to be an object, then
 * immutably merges the properties of each object and returns result.
 *
 * When multiple objects contain the same key the later object in
 * the arguments list will take precedence.
 *
 * Example:
 *
 * ```js
 * var result = merge({foo: 123}, {foo: 456});
 * console.log(result.foo); // outputs 456
 * ```
 *
 * @param {Object} obj1 Object to merge
 * @returns {Object} Result of all merge properties
 */
function merge(/* obj1, obj2, obj3, ... */) {
  var result = {};
  function assignValue(val, key) {
    if (typeof result[key] === 'object' && typeof val === 'object') {
      result[key] = merge(result[key], val);
    } else {
      result[key] = val;
    }
  }

  for (var i = 0, l = arguments.length; i < l; i++) {
    forEach(arguments[i], assignValue);
  }
  return result;
}

/**
 * Function equal to merge with the difference being that no reference
 * to original objects is kept.
 *
 * @see merge
 * @param {Object} obj1 Object to merge
 * @returns {Object} Result of all merge properties
 */
function deepMerge(/* obj1, obj2, obj3, ... */) {
  var result = {};
  function assignValue(val, key) {
    if (typeof result[key] === 'object' && typeof val === 'object') {
      result[key] = deepMerge(result[key], val);
    } else if (typeof val === 'object') {
      result[key] = deepMerge({}, val);
    } else {
      result[key] = val;
    }
  }

  for (var i = 0, l = arguments.length; i < l; i++) {
    forEach(arguments[i], assignValue);
  }
  return result;
}

/**
 * Extends object a by mutably adding to it the properties of object b.
 *
 * @param {Object} a The object to be extended
 * @param {Object} b The object to copy properties from
 * @param {Object} thisArg The object to bind function to
 * @return {Object} The resulting value of object a
 */
function extend(a, b, thisArg) {
  forEach(b, function assignValue(val, key) {
    if (thisArg && typeof val === 'function') {
      a[key] = bind(val, thisArg);
    } else {
      a[key] = val;
    }
  });
  return a;
}

var utils = {
  isArray: isArray,
  isArrayBuffer: isArrayBuffer,
  isBuffer: isBuffer,
  isFormData: isFormData,
  isArrayBufferView: isArrayBufferView,
  isString: isString,
  isNumber: isNumber,
  isObject: isObject$1,
  isUndefined: isUndefined,
  isDate: isDate,
  isFile: isFile,
  isBlob: isBlob,
  isFunction: isFunction,
  isStream: isStream,
  isURLSearchParams: isURLSearchParams,
  isStandardBrowserEnv: isStandardBrowserEnv,
  forEach: forEach,
  merge: merge,
  deepMerge: deepMerge,
  extend: extend,
  trim: trim
};

function encode(val) {
  return encodeURIComponent(val).
    replace(/%40/gi, '@').
    replace(/%3A/gi, ':').
    replace(/%24/g, '$').
    replace(/%2C/gi, ',').
    replace(/%20/g, '+').
    replace(/%5B/gi, '[').
    replace(/%5D/gi, ']');
}

/**
 * Build a URL by appending params to the end
 *
 * @param {string} url The base of the url (e.g., http://www.google.com)
 * @param {object} [params] The params to be appended
 * @returns {string} The formatted url
 */
var buildURL = function buildURL(url, params, paramsSerializer) {
  /*eslint no-param-reassign:0*/
  if (!params) {
    return url;
  }

  var serializedParams;
  if (paramsSerializer) {
    serializedParams = paramsSerializer(params);
  } else if (utils.isURLSearchParams(params)) {
    serializedParams = params.toString();
  } else {
    var parts = [];

    utils.forEach(params, function serialize(val, key) {
      if (val === null || typeof val === 'undefined') {
        return;
      }

      if (utils.isArray(val)) {
        key = key + '[]';
      } else {
        val = [val];
      }

      utils.forEach(val, function parseValue(v) {
        if (utils.isDate(v)) {
          v = v.toISOString();
        } else if (utils.isObject(v)) {
          v = JSON.stringify(v);
        }
        parts.push(encode(key) + '=' + encode(v));
      });
    });

    serializedParams = parts.join('&');
  }

  if (serializedParams) {
    var hashmarkIndex = url.indexOf('#');
    if (hashmarkIndex !== -1) {
      url = url.slice(0, hashmarkIndex);
    }

    url += (url.indexOf('?') === -1 ? '?' : '&') + serializedParams;
  }

  return url;
};

function InterceptorManager() {
  this.handlers = [];
}

/**
 * Add a new interceptor to the stack
 *
 * @param {Function} fulfilled The function to handle `then` for a `Promise`
 * @param {Function} rejected The function to handle `reject` for a `Promise`
 *
 * @return {Number} An ID used to remove interceptor later
 */
InterceptorManager.prototype.use = function use(fulfilled, rejected) {
  this.handlers.push({
    fulfilled: fulfilled,
    rejected: rejected
  });
  return this.handlers.length - 1;
};

/**
 * Remove an interceptor from the stack
 *
 * @param {Number} id The ID that was returned by `use`
 */
InterceptorManager.prototype.eject = function eject(id) {
  if (this.handlers[id]) {
    this.handlers[id] = null;
  }
};

/**
 * Iterate over all the registered interceptors
 *
 * This method is particularly useful for skipping over any
 * interceptors that may have become `null` calling `eject`.
 *
 * @param {Function} fn The function to call for each interceptor
 */
InterceptorManager.prototype.forEach = function forEach(fn) {
  utils.forEach(this.handlers, function forEachHandler(h) {
    if (h !== null) {
      fn(h);
    }
  });
};

var InterceptorManager_1 = InterceptorManager;

/**
 * Transform the data for a request or a response
 *
 * @param {Object|String} data The data to be transformed
 * @param {Array} headers The headers for the request or response
 * @param {Array|Function} fns A single function or Array of functions
 * @returns {*} The resulting transformed data
 */
var transformData = function transformData(data, headers, fns) {
  /*eslint no-param-reassign:0*/
  utils.forEach(fns, function transform(fn) {
    data = fn(data, headers);
  });

  return data;
};

var isCancel = function isCancel(value) {
  return !!(value && value.__CANCEL__);
};

var normalizeHeaderName = function normalizeHeaderName(headers, normalizedName) {
  utils.forEach(headers, function processHeader(value, name) {
    if (name !== normalizedName && name.toUpperCase() === normalizedName.toUpperCase()) {
      headers[normalizedName] = value;
      delete headers[name];
    }
  });
};

/**
 * Update an Error with the specified config, error code, and response.
 *
 * @param {Error} error The error to update.
 * @param {Object} config The config.
 * @param {string} [code] The error code (for example, 'ECONNABORTED').
 * @param {Object} [request] The request.
 * @param {Object} [response] The response.
 * @returns {Error} The error.
 */
var enhanceError = function enhanceError(error, config, code, request, response) {
  error.config = config;
  if (code) {
    error.code = code;
  }

  error.request = request;
  error.response = response;
  error.isAxiosError = true;

  error.toJSON = function() {
    return {
      // Standard
      message: this.message,
      name: this.name,
      // Microsoft
      description: this.description,
      number: this.number,
      // Mozilla
      fileName: this.fileName,
      lineNumber: this.lineNumber,
      columnNumber: this.columnNumber,
      stack: this.stack,
      // Axios
      config: this.config,
      code: this.code
    };
  };
  return error;
};

/**
 * Create an Error with the specified message, config, error code, request and response.
 *
 * @param {string} message The error message.
 * @param {Object} config The config.
 * @param {string} [code] The error code (for example, 'ECONNABORTED').
 * @param {Object} [request] The request.
 * @param {Object} [response] The response.
 * @returns {Error} The created error.
 */
var createError = function createError(message, config, code, request, response) {
  var error = new Error(message);
  return enhanceError(error, config, code, request, response);
};

/**
 * Resolve or reject a Promise based on response status.
 *
 * @param {Function} resolve A function that resolves the promise.
 * @param {Function} reject A function that rejects the promise.
 * @param {object} response The response.
 */
var settle = function settle(resolve, reject, response) {
  var validateStatus = response.config.validateStatus;
  if (!validateStatus || validateStatus(response.status)) {
    resolve(response);
  } else {
    reject(createError(
      'Request failed with status code ' + response.status,
      response.config,
      null,
      response.request,
      response
    ));
  }
};

// Headers whose duplicates are ignored by node
// c.f. https://nodejs.org/api/http.html#http_message_headers
var ignoreDuplicateOf = [
  'age', 'authorization', 'content-length', 'content-type', 'etag',
  'expires', 'from', 'host', 'if-modified-since', 'if-unmodified-since',
  'last-modified', 'location', 'max-forwards', 'proxy-authorization',
  'referer', 'retry-after', 'user-agent'
];

/**
 * Parse headers into an object
 *
 * ```
 * Date: Wed, 27 Aug 2014 08:58:49 GMT
 * Content-Type: application/json
 * Connection: keep-alive
 * Transfer-Encoding: chunked
 * ```
 *
 * @param {String} headers Headers needing to be parsed
 * @returns {Object} Headers parsed into an object
 */
var parseHeaders = function parseHeaders(headers) {
  var parsed = {};
  var key;
  var val;
  var i;

  if (!headers) { return parsed; }

  utils.forEach(headers.split('\n'), function parser(line) {
    i = line.indexOf(':');
    key = utils.trim(line.substr(0, i)).toLowerCase();
    val = utils.trim(line.substr(i + 1));

    if (key) {
      if (parsed[key] && ignoreDuplicateOf.indexOf(key) >= 0) {
        return;
      }
      if (key === 'set-cookie') {
        parsed[key] = (parsed[key] ? parsed[key] : []).concat([val]);
      } else {
        parsed[key] = parsed[key] ? parsed[key] + ', ' + val : val;
      }
    }
  });

  return parsed;
};

var isURLSameOrigin = (
  utils.isStandardBrowserEnv() ?

  // Standard browser envs have full support of the APIs needed to test
  // whether the request URL is of the same origin as current location.
    (function standardBrowserEnv() {
      var msie = /(msie|trident)/i.test(navigator.userAgent);
      var urlParsingNode = document.createElement('a');
      var originURL;

      /**
    * Parse a URL to discover it's components
    *
    * @param {String} url The URL to be parsed
    * @returns {Object}
    */
      function resolveURL(url) {
        var href = url;

        if (msie) {
        // IE needs attribute set twice to normalize properties
          urlParsingNode.setAttribute('href', href);
          href = urlParsingNode.href;
        }

        urlParsingNode.setAttribute('href', href);

        // urlParsingNode provides the UrlUtils interface - http://url.spec.whatwg.org/#urlutils
        return {
          href: urlParsingNode.href,
          protocol: urlParsingNode.protocol ? urlParsingNode.protocol.replace(/:$/, '') : '',
          host: urlParsingNode.host,
          search: urlParsingNode.search ? urlParsingNode.search.replace(/^\?/, '') : '',
          hash: urlParsingNode.hash ? urlParsingNode.hash.replace(/^#/, '') : '',
          hostname: urlParsingNode.hostname,
          port: urlParsingNode.port,
          pathname: (urlParsingNode.pathname.charAt(0) === '/') ?
            urlParsingNode.pathname :
            '/' + urlParsingNode.pathname
        };
      }

      originURL = resolveURL(window.location.href);

      /**
    * Determine if a URL shares the same origin as the current location
    *
    * @param {String} requestURL The URL to test
    * @returns {boolean} True if URL shares the same origin, otherwise false
    */
      return function isURLSameOrigin(requestURL) {
        var parsed = (utils.isString(requestURL)) ? resolveURL(requestURL) : requestURL;
        return (parsed.protocol === originURL.protocol &&
            parsed.host === originURL.host);
      };
    })() :

  // Non standard browser envs (web workers, react-native) lack needed support.
    (function nonStandardBrowserEnv() {
      return function isURLSameOrigin() {
        return true;
      };
    })()
);

var cookies = (
  utils.isStandardBrowserEnv() ?

  // Standard browser envs support document.cookie
    (function standardBrowserEnv() {
      return {
        write: function write(name, value, expires, path, domain, secure) {
          var cookie = [];
          cookie.push(name + '=' + encodeURIComponent(value));

          if (utils.isNumber(expires)) {
            cookie.push('expires=' + new Date(expires).toGMTString());
          }

          if (utils.isString(path)) {
            cookie.push('path=' + path);
          }

          if (utils.isString(domain)) {
            cookie.push('domain=' + domain);
          }

          if (secure === true) {
            cookie.push('secure');
          }

          document.cookie = cookie.join('; ');
        },

        read: function read(name) {
          var match = document.cookie.match(new RegExp('(^|;\\s*)(' + name + ')=([^;]*)'));
          return (match ? decodeURIComponent(match[3]) : null);
        },

        remove: function remove(name) {
          this.write(name, '', Date.now() - 86400000);
        }
      };
    })() :

  // Non standard browser env (web workers, react-native) lack needed support.
    (function nonStandardBrowserEnv() {
      return {
        write: function write() {},
        read: function read() { return null; },
        remove: function remove() {}
      };
    })()
);

var xhr = function xhrAdapter(config) {
  return new Promise(function dispatchXhrRequest(resolve, reject) {
    var requestData = config.data;
    var requestHeaders = config.headers;

    if (utils.isFormData(requestData)) {
      delete requestHeaders['Content-Type']; // Let the browser set it
    }

    var request = new XMLHttpRequest();

    // HTTP basic authentication
    if (config.auth) {
      var username = config.auth.username || '';
      var password = config.auth.password || '';
      requestHeaders.Authorization = 'Basic ' + btoa(username + ':' + password);
    }

    request.open(config.method.toUpperCase(), buildURL(config.url, config.params, config.paramsSerializer), true);

    // Set the request timeout in MS
    request.timeout = config.timeout;

    // Listen for ready state
    request.onreadystatechange = function handleLoad() {
      if (!request || request.readyState !== 4) {
        return;
      }

      // The request errored out and we didn't get a response, this will be
      // handled by onerror instead
      // With one exception: request that using file: protocol, most browsers
      // will return status as 0 even though it's a successful request
      if (request.status === 0 && !(request.responseURL && request.responseURL.indexOf('file:') === 0)) {
        return;
      }

      // Prepare the response
      var responseHeaders = 'getAllResponseHeaders' in request ? parseHeaders(request.getAllResponseHeaders()) : null;
      var responseData = !config.responseType || config.responseType === 'text' ? request.responseText : request.response;
      var response = {
        data: responseData,
        status: request.status,
        statusText: request.statusText,
        headers: responseHeaders,
        config: config,
        request: request
      };

      settle(resolve, reject, response);

      // Clean up request
      request = null;
    };

    // Handle browser request cancellation (as opposed to a manual cancellation)
    request.onabort = function handleAbort() {
      if (!request) {
        return;
      }

      reject(createError('Request aborted', config, 'ECONNABORTED', request));

      // Clean up request
      request = null;
    };

    // Handle low level network errors
    request.onerror = function handleError() {
      // Real errors are hidden from us by the browser
      // onerror should only fire if it's a network error
      reject(createError('Network Error', config, null, request));

      // Clean up request
      request = null;
    };

    // Handle timeout
    request.ontimeout = function handleTimeout() {
      reject(createError('timeout of ' + config.timeout + 'ms exceeded', config, 'ECONNABORTED',
        request));

      // Clean up request
      request = null;
    };

    // Add xsrf header
    // This is only done if running in a standard browser environment.
    // Specifically not if we're in a web worker, or react-native.
    if (utils.isStandardBrowserEnv()) {
      var cookies$1 = cookies;

      // Add xsrf header
      var xsrfValue = (config.withCredentials || isURLSameOrigin(config.url)) && config.xsrfCookieName ?
        cookies$1.read(config.xsrfCookieName) :
        undefined;

      if (xsrfValue) {
        requestHeaders[config.xsrfHeaderName] = xsrfValue;
      }
    }

    // Add headers to the request
    if ('setRequestHeader' in request) {
      utils.forEach(requestHeaders, function setRequestHeader(val, key) {
        if (typeof requestData === 'undefined' && key.toLowerCase() === 'content-type') {
          // Remove Content-Type if data is undefined
          delete requestHeaders[key];
        } else {
          // Otherwise add header to the request
          request.setRequestHeader(key, val);
        }
      });
    }

    // Add withCredentials to request if needed
    if (config.withCredentials) {
      request.withCredentials = true;
    }

    // Add responseType to request if needed
    if (config.responseType) {
      try {
        request.responseType = config.responseType;
      } catch (e) {
        // Expected DOMException thrown by browsers not compatible XMLHttpRequest Level 2.
        // But, this can be suppressed for 'json' type as it can be parsed by default 'transformResponse' function.
        if (config.responseType !== 'json') {
          throw e;
        }
      }
    }

    // Handle progress if needed
    if (typeof config.onDownloadProgress === 'function') {
      request.addEventListener('progress', config.onDownloadProgress);
    }

    // Not all browsers support upload events
    if (typeof config.onUploadProgress === 'function' && request.upload) {
      request.upload.addEventListener('progress', config.onUploadProgress);
    }

    if (config.cancelToken) {
      // Handle cancellation
      config.cancelToken.promise.then(function onCanceled(cancel) {
        if (!request) {
          return;
        }

        request.abort();
        reject(cancel);
        // Clean up request
        request = null;
      });
    }

    if (requestData === undefined) {
      requestData = null;
    }

    // Send the request
    request.send(requestData);
  });
};

var DEFAULT_CONTENT_TYPE = {
  'Content-Type': 'application/x-www-form-urlencoded'
};

function setContentTypeIfUnset(headers, value) {
  if (!utils.isUndefined(headers) && utils.isUndefined(headers['Content-Type'])) {
    headers['Content-Type'] = value;
  }
}

function getDefaultAdapter() {
  var adapter;
  // Only Node.JS has a process variable that is of [[Class]] process
  if (typeof process !== 'undefined' && Object.prototype.toString.call(process) === '[object process]') {
    // For node use HTTP adapter
    adapter = xhr;
  } else if (typeof XMLHttpRequest !== 'undefined') {
    // For browsers use XHR adapter
    adapter = xhr;
  }
  return adapter;
}

var defaults = {
  adapter: getDefaultAdapter(),

  transformRequest: [function transformRequest(data, headers) {
    normalizeHeaderName(headers, 'Accept');
    normalizeHeaderName(headers, 'Content-Type');
    if (utils.isFormData(data) ||
      utils.isArrayBuffer(data) ||
      utils.isBuffer(data) ||
      utils.isStream(data) ||
      utils.isFile(data) ||
      utils.isBlob(data)
    ) {
      return data;
    }
    if (utils.isArrayBufferView(data)) {
      return data.buffer;
    }
    if (utils.isURLSearchParams(data)) {
      setContentTypeIfUnset(headers, 'application/x-www-form-urlencoded;charset=utf-8');
      return data.toString();
    }
    if (utils.isObject(data)) {
      setContentTypeIfUnset(headers, 'application/json;charset=utf-8');
      return JSON.stringify(data);
    }
    return data;
  }],

  transformResponse: [function transformResponse(data) {
    /*eslint no-param-reassign:0*/
    if (typeof data === 'string') {
      try {
        data = JSON.parse(data);
      } catch (e) { /* Ignore */ }
    }
    return data;
  }],

  /**
   * A timeout in milliseconds to abort a request. If set to 0 (default) a
   * timeout is not created.
   */
  timeout: 0,

  xsrfCookieName: 'XSRF-TOKEN',
  xsrfHeaderName: 'X-XSRF-TOKEN',

  maxContentLength: -1,

  validateStatus: function validateStatus(status) {
    return status >= 200 && status < 300;
  }
};

defaults.headers = {
  common: {
    'Accept': 'application/json, text/plain, */*'
  }
};

utils.forEach(['delete', 'get', 'head'], function forEachMethodNoData(method) {
  defaults.headers[method] = {};
});

utils.forEach(['post', 'put', 'patch'], function forEachMethodWithData(method) {
  defaults.headers[method] = utils.merge(DEFAULT_CONTENT_TYPE);
});

var defaults_1 = defaults;

/**
 * Determines whether the specified URL is absolute
 *
 * @param {string} url The URL to test
 * @returns {boolean} True if the specified URL is absolute, otherwise false
 */
var isAbsoluteURL = function isAbsoluteURL(url) {
  // A URL is considered absolute if it begins with "<scheme>://" or "//" (protocol-relative URL).
  // RFC 3986 defines scheme name as a sequence of characters beginning with a letter and followed
  // by any combination of letters, digits, plus, period, or hyphen.
  return /^([a-z][a-z\d\+\-\.]*:)?\/\//i.test(url);
};

/**
 * Creates a new URL by combining the specified URLs
 *
 * @param {string} baseURL The base URL
 * @param {string} relativeURL The relative URL
 * @returns {string} The combined URL
 */
var combineURLs = function combineURLs(baseURL, relativeURL) {
  return relativeURL
    ? baseURL.replace(/\/+$/, '') + '/' + relativeURL.replace(/^\/+/, '')
    : baseURL;
};

/**
 * Throws a `Cancel` if cancellation has been requested.
 */
function throwIfCancellationRequested(config) {
  if (config.cancelToken) {
    config.cancelToken.throwIfRequested();
  }
}

/**
 * Dispatch a request to the server using the configured adapter.
 *
 * @param {object} config The config that is to be used for the request
 * @returns {Promise} The Promise to be fulfilled
 */
var dispatchRequest = function dispatchRequest(config) {
  throwIfCancellationRequested(config);

  // Support baseURL config
  if (config.baseURL && !isAbsoluteURL(config.url)) {
    config.url = combineURLs(config.baseURL, config.url);
  }

  // Ensure headers exist
  config.headers = config.headers || {};

  // Transform request data
  config.data = transformData(
    config.data,
    config.headers,
    config.transformRequest
  );

  // Flatten headers
  config.headers = utils.merge(
    config.headers.common || {},
    config.headers[config.method] || {},
    config.headers || {}
  );

  utils.forEach(
    ['delete', 'get', 'head', 'post', 'put', 'patch', 'common'],
    function cleanHeaderConfig(method) {
      delete config.headers[method];
    }
  );

  var adapter = config.adapter || defaults_1.adapter;

  return adapter(config).then(function onAdapterResolution(response) {
    throwIfCancellationRequested(config);

    // Transform response data
    response.data = transformData(
      response.data,
      response.headers,
      config.transformResponse
    );

    return response;
  }, function onAdapterRejection(reason) {
    if (!isCancel(reason)) {
      throwIfCancellationRequested(config);

      // Transform response data
      if (reason && reason.response) {
        reason.response.data = transformData(
          reason.response.data,
          reason.response.headers,
          config.transformResponse
        );
      }
    }

    return Promise.reject(reason);
  });
};

/**
 * Config-specific merge-function which creates a new config-object
 * by merging two configuration objects together.
 *
 * @param {Object} config1
 * @param {Object} config2
 * @returns {Object} New object resulting from merging config2 to config1
 */
var mergeConfig = function mergeConfig(config1, config2) {
  // eslint-disable-next-line no-param-reassign
  config2 = config2 || {};
  var config = {};

  utils.forEach(['url', 'method', 'params', 'data'], function valueFromConfig2(prop) {
    if (typeof config2[prop] !== 'undefined') {
      config[prop] = config2[prop];
    }
  });

  utils.forEach(['headers', 'auth', 'proxy'], function mergeDeepProperties(prop) {
    if (utils.isObject(config2[prop])) {
      config[prop] = utils.deepMerge(config1[prop], config2[prop]);
    } else if (typeof config2[prop] !== 'undefined') {
      config[prop] = config2[prop];
    } else if (utils.isObject(config1[prop])) {
      config[prop] = utils.deepMerge(config1[prop]);
    } else if (typeof config1[prop] !== 'undefined') {
      config[prop] = config1[prop];
    }
  });

  utils.forEach([
    'baseURL', 'transformRequest', 'transformResponse', 'paramsSerializer',
    'timeout', 'withCredentials', 'adapter', 'responseType', 'xsrfCookieName',
    'xsrfHeaderName', 'onUploadProgress', 'onDownloadProgress', 'maxContentLength',
    'validateStatus', 'maxRedirects', 'httpAgent', 'httpsAgent', 'cancelToken',
    'socketPath'
  ], function defaultToConfig2(prop) {
    if (typeof config2[prop] !== 'undefined') {
      config[prop] = config2[prop];
    } else if (typeof config1[prop] !== 'undefined') {
      config[prop] = config1[prop];
    }
  });

  return config;
};

/**
 * Create a new instance of Axios
 *
 * @param {Object} instanceConfig The default config for the instance
 */
function Axios(instanceConfig) {
  this.defaults = instanceConfig;
  this.interceptors = {
    request: new InterceptorManager_1(),
    response: new InterceptorManager_1()
  };
}

/**
 * Dispatch a request
 *
 * @param {Object} config The config specific for this request (merged with this.defaults)
 */
Axios.prototype.request = function request(config) {
  /*eslint no-param-reassign:0*/
  // Allow for axios('example/url'[, config]) a la fetch API
  if (typeof config === 'string') {
    config = arguments[1] || {};
    config.url = arguments[0];
  } else {
    config = config || {};
  }

  config = mergeConfig(this.defaults, config);
  config.method = config.method ? config.method.toLowerCase() : 'get';

  // Hook up interceptors middleware
  var chain = [dispatchRequest, undefined];
  var promise = Promise.resolve(config);

  this.interceptors.request.forEach(function unshiftRequestInterceptors(interceptor) {
    chain.unshift(interceptor.fulfilled, interceptor.rejected);
  });

  this.interceptors.response.forEach(function pushResponseInterceptors(interceptor) {
    chain.push(interceptor.fulfilled, interceptor.rejected);
  });

  while (chain.length) {
    promise = promise.then(chain.shift(), chain.shift());
  }

  return promise;
};

Axios.prototype.getUri = function getUri(config) {
  config = mergeConfig(this.defaults, config);
  return buildURL(config.url, config.params, config.paramsSerializer).replace(/^\?/, '');
};

// Provide aliases for supported request methods
utils.forEach(['delete', 'get', 'head', 'options'], function forEachMethodNoData(method) {
  /*eslint func-names:0*/
  Axios.prototype[method] = function(url, config) {
    return this.request(utils.merge(config || {}, {
      method: method,
      url: url
    }));
  };
});

utils.forEach(['post', 'put', 'patch'], function forEachMethodWithData(method) {
  /*eslint func-names:0*/
  Axios.prototype[method] = function(url, data, config) {
    return this.request(utils.merge(config || {}, {
      method: method,
      url: url,
      data: data
    }));
  };
});

var Axios_1 = Axios;

/**
 * A `Cancel` is an object that is thrown when an operation is canceled.
 *
 * @class
 * @param {string=} message The message.
 */
function Cancel(message) {
  this.message = message;
}

Cancel.prototype.toString = function toString() {
  return 'Cancel' + (this.message ? ': ' + this.message : '');
};

Cancel.prototype.__CANCEL__ = true;

var Cancel_1 = Cancel;

/**
 * A `CancelToken` is an object that can be used to request cancellation of an operation.
 *
 * @class
 * @param {Function} executor The executor function.
 */
function CancelToken(executor) {
  if (typeof executor !== 'function') {
    throw new TypeError('executor must be a function.');
  }

  var resolvePromise;
  this.promise = new Promise(function promiseExecutor(resolve) {
    resolvePromise = resolve;
  });

  var token = this;
  executor(function cancel(message) {
    if (token.reason) {
      // Cancellation has already been requested
      return;
    }

    token.reason = new Cancel_1(message);
    resolvePromise(token.reason);
  });
}

/**
 * Throws a `Cancel` if cancellation has been requested.
 */
CancelToken.prototype.throwIfRequested = function throwIfRequested() {
  if (this.reason) {
    throw this.reason;
  }
};

/**
 * Returns an object that contains a new `CancelToken` and a function that, when called,
 * cancels the `CancelToken`.
 */
CancelToken.source = function source() {
  var cancel;
  var token = new CancelToken(function executor(c) {
    cancel = c;
  });
  return {
    token: token,
    cancel: cancel
  };
};

var CancelToken_1 = CancelToken;

/**
 * Syntactic sugar for invoking a function and expanding an array for arguments.
 *
 * Common use case would be to use `Function.prototype.apply`.
 *
 *  ```js
 *  function f(x, y, z) {}
 *  var args = [1, 2, 3];
 *  f.apply(null, args);
 *  ```
 *
 * With `spread` this example can be re-written.
 *
 *  ```js
 *  spread(function(x, y, z) {})([1, 2, 3]);
 *  ```
 *
 * @param {Function} callback
 * @returns {Function}
 */
var spread = function spread(callback) {
  return function wrap(arr) {
    return callback.apply(null, arr);
  };
};

/**
 * Create an instance of Axios
 *
 * @param {Object} defaultConfig The default config for the instance
 * @return {Axios} A new instance of Axios
 */
function createInstance(defaultConfig) {
  var context = new Axios_1(defaultConfig);
  var instance = bind(Axios_1.prototype.request, context);

  // Copy axios.prototype to instance
  utils.extend(instance, Axios_1.prototype, context);

  // Copy context to instance
  utils.extend(instance, context);

  return instance;
}

// Create the default instance to be exported
var axios = createInstance(defaults_1);

// Expose Axios class to allow class inheritance
axios.Axios = Axios_1;

// Factory for creating new instances
axios.create = function create(instanceConfig) {
  return createInstance(mergeConfig(axios.defaults, instanceConfig));
};

// Expose Cancel & CancelToken
axios.Cancel = Cancel_1;
axios.CancelToken = CancelToken_1;
axios.isCancel = isCancel;

// Expose all/spread
axios.all = function all(promises) {
  return Promise.all(promises);
};
axios.spread = spread;

var axios_1 = axios;

// Allow use of default import syntax in TypeScript
var default_1 = axios;
axios_1.default = default_1;

var axios$1 = axios_1;

const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=';
// btoa
function btoa$1(input) {
    const str = String(input);
    // initialize result and counter
    let block;
    let charCode;
    let idx = 0;
    let map = chars;
    let output = '';
    /* eslint-disable no-cond-assign, no-bitwise, no-mixed-operators */
    for (; 
    // if the next str index does not exist:
    //   change the mapping table to "="
    //   check if d has no fractional digits
    str.charAt(idx | 0) || (map = '=', idx % 1); 
    // "8 - idx % 1 * 8" generates the sequence 2, 4, 6, 8
    output += map.charAt(63 & block >> 8 - idx % 1 * 8)) {
        charCode = str.charCodeAt(idx += 3 / 4);
        if (charCode > 0xFF) {
            throw new Error('"btoa" failed: The string to be encoded contains characters outside of the Latin1 range.');
        }
        block = block << 8 | charCode;
    }
    return output;
}

var PLATFORM;
(function (PLATFORM) {
    PLATFORM[PLATFORM["kUnknown"] = 0] = "kUnknown";
    PLATFORM[PLATFORM["kWechat"] = 1] = "kWechat";
    PLATFORM[PLATFORM["kAlipay"] = 2] = "kAlipay";
    PLATFORM[PLATFORM["kBaidu"] = 3] = "kBaidu";
})(PLATFORM || (PLATFORM = {}));
function getPlatform() {
    switch (true) {
        case typeof wx === 'object':
            return PLATFORM.kWechat;
        case typeof swan === 'object':
            return PLATFORM.kBaidu;
        case typeof my === 'object':
            return PLATFORM.kAlipay;
        default:
            return PLATFORM.kUnknown;
    }
}
const platform = getPlatform();
const delegate = platform === PLATFORM.kWechat
    ? wx.request.bind(wx)
    : platform === PLATFORM.kAlipay
        ? (my.request || my.httpRequest).bind(my)
        : platform === PLATFORM.kBaidu
            ? swan.request.bind(swan)
            : undefined;
function createRequestDelegate() {
    let task;
    return {
        send(options) {
            if (!delegate)
                { return; }
            task = delegate(options);
        },
        abort() {
            task && task.abort();
        },
    };
}

function createRequest(config) {
    let timer;
    let timeout;
    let onabort;
    let onerror;
    let ontimeout;
    let onsuccess;
    const delegate = createRequestDelegate();
    return {
        send(options) {
            delegate.send(Object.spread({}, options,
                {success: (response) => {
                    // normalize data
                    const headers = response.header || response.headers;
                    const status = response.statusCode || response.status || 200;
                    const statusText = status === 200 ? 'OK' : status === 400 ? 'Bad Request' : '';
                    onsuccess && onsuccess({
                        data: response.data,
                        status,
                        statusText,
                        headers,
                        config,
                        request: options,
                    });
                },
                fail: (data) => {
                    let isAbort = false;
                    let isTimeout = false;
                    // error or timeout
                    switch (platform) {
                        case PLATFORM.kWechat:
                            if (data.errMsg.indexOf('request:fail abort') !== -1) {
                                isAbort = true;
                            }
                            else if (data.errMsg.indexOf('timeout') !== -1) {
                                isTimeout = true;
                            }
                            break;
                        case PLATFORM.kAlipay:
                            // https://docs.alipay.com/mini/api/network
                            if ([14, 19].includes(data.error)) {
                                isAbort = true;
                            }
                            else if ([13].includes(data.error)) {
                                isTimeout = true;
                            }
                            break;
                    }
                    const error = isAbort
                        ? createError('Request aborted', config, 'ECONNABORTED', '')
                        : isTimeout
                            ? createError('Request Timeout', config, 'ECONNABORTED', '')
                            : createError('Network Error', config, null, '');
                    if (isAbort) {
                        onabort && onabort(error);
                    }
                    if (isTimeout) {
                        ontimeout && ontimeout(error);
                    }
                    onerror && onerror(error);
                },
                complete: () => {
                    if (timer) {
                        clearTimeout(timer);
                        timer = undefined;
                    }
                }}));
            if (timeout) {
                timer = setTimeout(() => {
                    ontimeout && ontimeout(createError(`timeout of ${config.timeout || 0}ms exceeded`, config, 'ECONNABORTED', ''));
                    timer = undefined;
                }, timeout);
            }
        },
        abort() {
            delegate.abort();
        },
        set timeout(val) {
            timeout = val;
        },
        set onabort(val) {
            onabort = val;
        },
        set onerror(val) {
            onerror = val;
        },
        set ontimeout(val) {
            ontimeout = val;
        },
        set onsuccess(val) {
            onsuccess = val;
        },
    };
}

const isString$1 = (val) => typeof val === 'string';
function mpAdapter(config) {
    /* eslint-disable-next-line prefer-arrow-callback */
    return new Promise(function dispatchMpRequest(resolve, reject) {
        const { url, data, headers, method, params, paramsSerializer, responseType, timeout, cancelToken, } = config;
        // HTTP basic authentication
        if (config.auth) {
            const [username, password] = [config.auth.username || '', config.auth.password || ''];
            headers.Authorization = `Basic ${btoa$1(`${username}:${password}`)}`;
        }
        // Add headers to the request
        utils.forEach(headers, (val, key) => {
            const header = key.toLowerCase();
            if ((typeof data === 'undefined' && header === 'content-type') || header === 'referer') {
                delete headers[key];
            }
        });
        let request = createRequest(config);
        const options = {
            url: buildURL(url, params, paramsSerializer),
            header: headers,
            method: method && method.toUpperCase(),
            data: isString$1(data) ? JSON.parse(data) : data,
            responseType,
        };
        if (cancelToken) {
            // Handle cancellation
            cancelToken.promise.then((cancel) => {
                if (!request)
                    { return; }
                request.abort();
                reject(cancel);
                request = null;
            });
        }
        request.timeout = timeout;
        request.onsuccess = function handleLoad(response) {
            settle(resolve, reject, response);
            request = null;
        };
        request.onabort = function handleAbort(error) {
            if (!request)
                { return; }
            reject(error);
            request = null;
        };
        request.onerror = function handleError(error) {
            if (!request)
                { return; }
            reject(error);
            request = null;
        };
        request.ontimeout = function handleTimeout(error) {
            reject(error);
            request = null;
        };
        request.send(options);
    });
}

/* eslint-disable prefer-spread, prefer-rest-params */
function ownKeys(object, enumerableOnly) {
    const keys = Object.keys(object);
    if (Object.getOwnPropertySymbols) {
        let symbols = Object.getOwnPropertySymbols(object);
        if (enumerableOnly) {
            symbols = symbols.filter((sym) => {
                return Object.getOwnPropertyDescriptor(object, sym).enumerable;
            });
        }
        keys.push.apply(keys, symbols);
    }
    return keys;
}
function objectSpread(target) {
    for (let index = 1; index < arguments.length; index++) {
        const nextSource = arguments[index];
        if (nextSource !== null && nextSource !== undefined) {
            if (Object.getOwnPropertyDescriptors) {
                Object.defineProperties(target, Object.getOwnPropertyDescriptors(nextSource));
            }
            else {
                ownKeys(Object(nextSource)).forEach((key) => {
                    Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(nextSource, key));
                });
            }
        }
    }
    return target;
}
function polyfill() {
    if (typeof Object.spread !== 'function') {
        Object.defineProperty(Object, 'spread', {
            value: objectSpread,
            writable: true,
            configurable: true,
        });
    }
}

const commonVersionIdentifier = /version\/(\d+(\.?_?\d+)+)/i;
function getFirstMatch(regexp, ua) {
    const match = ua.match(regexp);
    return (match && match.length > 0 && match[1]) || '';
}
function getSecondMatch(regexp, ua) {
    const match = ua.match(regexp);
    return (match && match.length > 1 && match[2]) || '';
}
function browser$1(name, version) {
    return {
        name,
        version,
        firefox: name === 'firefox',
        chrome: name === 'chrome' || name === 'chromium',
        wechet: name === 'wechat',
        toString() {
            return `${name.toUpperCase()} ${version}`;
        },
    };
}
const browsersList = [
    {
        test: [/micromessenger/i],
        describe(ua) {
            return browser$1('wechat', getFirstMatch(/(?:micromessenger)[\s/](\d+(\.?_?\d+)+)/i, ua) || getFirstMatch(commonVersionIdentifier, ua));
        },
    },
    {
        test: [/\sedg\//i],
        describe(ua) {
            return browser$1('edge', getFirstMatch(/\sedg\/(\d+(\.?_?\d+)+)/i, ua));
        },
    },
    {
        test: [/edg([ea]|ios)/i],
        describe(ua) {
            return browser$1('edge', getSecondMatch(/edg([ea]|ios)\/(\d+(\.?_?\d+)+)/i, ua));
        },
    },
    {
        test: [/firefox|iceweasel|fxios/i],
        describe(ua) {
            return browser$1('firefox', getFirstMatch(/(?:firefox|iceweasel|fxios)[\s/](\d+(\.?_?\d+)+)/i, ua));
        },
    },
    {
        test: [/chromium/i],
        describe(ua) {
            return browser$1('chromium', getFirstMatch(/(?:chromium)[\s/](\d+(\.?_?\d+)+)/i, ua) || getFirstMatch(commonVersionIdentifier, ua));
        },
    },
    {
        test: [/chrome|crios|crmo/i],
        describe(ua) {
            return browser$1('chrome', getFirstMatch(/(?:chrome|crios|crmo)\/(\d+(\.?_?\d+)+)/i, ua));
        },
    },
    {
        test: [/safari|applewebkit/i],
        describe(ua) {
            return browser$1('safari', getFirstMatch(commonVersionIdentifier, ua));
        },
    },
    /* Something else */
    {
        test: [/.*/i],
        describe(ua) {
            /* Here we try to make sure that there are explicit details about the device
             * in order to decide what regexp exactly we want to apply
             * (as there is a specific decision based on that conclusion)
             */
            const regexpWithoutDeviceSpec = /^(.*)\/(.*) /;
            const regexpWithDeviceSpec = /^(.*)\/(.*)[ \t]\((.*)/;
            const hasDeviceSpec = ua.search('\\(') !== -1;
            const regexp = hasDeviceSpec ? regexpWithDeviceSpec : regexpWithoutDeviceSpec;
            return browser$1(getFirstMatch(regexp, ua), getSecondMatch(regexp, ua));
        },
    },
];

const parsed = {};
function isMiniProgram() {
    return (typeof wx === 'object') || (typeof swan === 'object') || (typeof my === 'object')
        || /miniprogram/i.test(navigator.userAgent)
        || (window && window.__wxjs_environment === 'miniprogram');
}
function parseBrowser(ua) {
    if (!parsed.browser) {
        ua = ua || (isMiniProgram() ? 'miniprogram' : navigator.userAgent);
        const descriptor = browsersList.find((browser) => {
            return browser.test.some(condition => condition.test(ua));
        });
        if (descriptor) {
            parsed.browser = descriptor.describe(ua);
        }
    }
    return parsed.browser;
}
function getBrowser() {
    return parseBrowser();
}
const BROWSER = parseBrowser();
const MINIPROGRAM = isMiniProgram();

const startsWith = (input, search) => {
    return input.substr(0, search.length) === search;
};
const MEETNOW_PREFIX = 'meetnow:';
const MEETNOW_SESSION_KEY = 'meetnow-persist-config';
class Config {
    constructor() {
        this.m = new Map();
    }
    reset(configObj) {
        this.m = new Map(Object.entries(configObj));
    }
    get(key, fallback) {
        const value = this.m.get(key);
        return (value !== undefined) ? value : fallback;
    }
    getBoolean(key, fallback = false) {
        const val = this.m.get(key);
        if (val === undefined) {
            return fallback;
        }
        if (typeof val === 'string') {
            return val === 'true';
        }
        return !!val;
    }
    getNumber(key, fallback) {
        const val = parseFloat(this.m.get(key));
        return Number.isNaN(val) ? (fallback !== undefined ? fallback : NaN) : val;
    }
    set(key, value) {
        this.m.set(key, value);
    }
}
const CONFIG = new Config();
const configFromSession = (win) => {
    try {
        const configStr = win.sessionStorage.getItem(MEETNOW_SESSION_KEY);
        return configStr !== null ? JSON.parse(configStr) : {};
    }
    catch (e) {
        return {};
    }
};
const saveConfig = (win, c) => {
    try {
        win.sessionStorage.setItem(MEETNOW_SESSION_KEY, JSON.stringify(c));
    }
    catch (e) {
        /* eslint-disable-next-line */
        return;
    }
};
const configFromURL = (win) => {
    const configObj = {};
    try {
        win.location.search.slice(1)
            .split('&')
            .map(entry => entry.split('='))
            .map(([key, value]) => [decodeURIComponent(key), decodeURIComponent(value)])
            .filter(([key]) => startsWith(key, MEETNOW_PREFIX))
            .map(([key, value]) => [key.slice(MEETNOW_PREFIX.length), value])
            .forEach(([key, value]) => {
            configObj[key] = value;
        });
    }
    catch (e) {
        return configObj;
    }
    return configObj;
};

function setupConfig(config) {
    const win = isMiniProgram() ? wx : window;
    const MeetNow = win.MeetNow = win.MeetNow || {};
    // create the Meetnow.config from raw config object (if it exists)
    // and convert Meetnow.config into a ConfigApi that has a get() fn
    const configObj = Object.spread({}, configFromSession(win),
        {persistent: false},
        (config || MeetNow.config),
        configFromURL(win));
    CONFIG.reset(configObj);
    if (CONFIG.getBoolean('persistent')) {
        saveConfig(win, configObj);
    }
    MeetNow.config = CONFIG;
    if (CONFIG.getBoolean('testing')) {
        CONFIG.set('debug', 'MN:*');
    }
}

var crypt = createCommonjsModule(function (module) {
(function() {
  var base64map
      = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/',

  crypt = {
    // Bit-wise rotation left
    rotl: function(n, b) {
      return (n << b) | (n >>> (32 - b));
    },

    // Bit-wise rotation right
    rotr: function(n, b) {
      return (n << (32 - b)) | (n >>> b);
    },

    // Swap big-endian to little-endian and vice versa
    endian: function(n) {
      // If number given, swap endian
      if (n.constructor == Number) {
        return crypt.rotl(n, 8) & 0x00FF00FF | crypt.rotl(n, 24) & 0xFF00FF00;
      }

      // Else, assume array and swap all items
      for (var i = 0; i < n.length; i++)
        { n[i] = crypt.endian(n[i]); }
      return n;
    },

    // Generate an array of any length of random bytes
    randomBytes: function(n) {
      for (var bytes = []; n > 0; n--)
        { bytes.push(Math.floor(Math.random() * 256)); }
      return bytes;
    },

    // Convert a byte array to big-endian 32-bit words
    bytesToWords: function(bytes) {
      for (var words = [], i = 0, b = 0; i < bytes.length; i++, b += 8)
        { words[b >>> 5] |= bytes[i] << (24 - b % 32); }
      return words;
    },

    // Convert big-endian 32-bit words to a byte array
    wordsToBytes: function(words) {
      for (var bytes = [], b = 0; b < words.length * 32; b += 8)
        { bytes.push((words[b >>> 5] >>> (24 - b % 32)) & 0xFF); }
      return bytes;
    },

    // Convert a byte array to a hex string
    bytesToHex: function(bytes) {
      for (var hex = [], i = 0; i < bytes.length; i++) {
        hex.push((bytes[i] >>> 4).toString(16));
        hex.push((bytes[i] & 0xF).toString(16));
      }
      return hex.join('');
    },

    // Convert a hex string to a byte array
    hexToBytes: function(hex) {
      for (var bytes = [], c = 0; c < hex.length; c += 2)
        { bytes.push(parseInt(hex.substr(c, 2), 16)); }
      return bytes;
    },

    // Convert a byte array to a base-64 string
    bytesToBase64: function(bytes) {
      for (var base64 = [], i = 0; i < bytes.length; i += 3) {
        var triplet = (bytes[i] << 16) | (bytes[i + 1] << 8) | bytes[i + 2];
        for (var j = 0; j < 4; j++)
          { if (i * 8 + j * 6 <= bytes.length * 8)
            { base64.push(base64map.charAt((triplet >>> 6 * (3 - j)) & 0x3F)); }
          else
            { base64.push('='); } }
      }
      return base64.join('');
    },

    // Convert a base-64 string to a byte array
    base64ToBytes: function(base64) {
      // Remove non-base-64 characters
      base64 = base64.replace(/[^A-Z0-9+\/]/ig, '');

      for (var bytes = [], i = 0, imod4 = 0; i < base64.length;
          imod4 = ++i % 4) {
        if (imod4 == 0) { continue; }
        bytes.push(((base64map.indexOf(base64.charAt(i - 1))
            & (Math.pow(2, -2 * imod4 + 8) - 1)) << (imod4 * 2))
            | (base64map.indexOf(base64.charAt(i)) >>> (6 - imod4 * 2)));
      }
      return bytes;
    }
  };

  module.exports = crypt;
})();
});

var charenc = {
  // UTF-8 encoding
  utf8: {
    // Convert a string to a byte array
    stringToBytes: function(str) {
      return charenc.bin.stringToBytes(unescape(encodeURIComponent(str)));
    },

    // Convert a byte array to a string
    bytesToString: function(bytes) {
      return decodeURIComponent(escape(charenc.bin.bytesToString(bytes)));
    }
  },

  // Binary encoding
  bin: {
    // Convert a string to a byte array
    stringToBytes: function(str) {
      for (var bytes = [], i = 0; i < str.length; i++)
        { bytes.push(str.charCodeAt(i) & 0xFF); }
      return bytes;
    },

    // Convert a byte array to a string
    bytesToString: function(bytes) {
      for (var str = [], i = 0; i < bytes.length; i++)
        { str.push(String.fromCharCode(bytes[i])); }
      return str.join('');
    }
  }
};

var charenc_1 = charenc;

/*!
 * Determine if an object is a Buffer
 *
 * @author   Feross Aboukhadijeh <https://feross.org>
 * @license  MIT
 */

// The _isBuffer check is for Safari 5-7 support, because it's missing
// Object.prototype.constructor. Remove this eventually
var isBuffer_1 = function (obj) {
  return obj != null && (isBuffer$1(obj) || isSlowBuffer(obj) || !!obj._isBuffer)
};

function isBuffer$1 (obj) {
  return !!obj.constructor && typeof obj.constructor.isBuffer === 'function' && obj.constructor.isBuffer(obj)
}

// For Node v0.10 support. Remove this eventually.
function isSlowBuffer (obj) {
  return typeof obj.readFloatLE === 'function' && typeof obj.slice === 'function' && isBuffer$1(obj.slice(0, 0))
}

var md5 = createCommonjsModule(function (module) {
(function(){
  var crypt$1 = crypt,
      utf8 = charenc_1.utf8,
      isBuffer = isBuffer_1,
      bin = charenc_1.bin,

  // The core
  md5 = function (message, options) {
    // Convert to byte array
    if (message.constructor == String)
      { if (options && options.encoding === 'binary')
        { message = bin.stringToBytes(message); }
      else
        { message = utf8.stringToBytes(message); } }
    else if (isBuffer(message))
      { message = Array.prototype.slice.call(message, 0); }
    else if (!Array.isArray(message))
      { message = message.toString(); }
    // else, assume byte array already

    var m = crypt$1.bytesToWords(message),
        l = message.length * 8,
        a =  1732584193,
        b = -271733879,
        c = -1732584194,
        d =  271733878;

    // Swap endian
    for (var i = 0; i < m.length; i++) {
      m[i] = ((m[i] <<  8) | (m[i] >>> 24)) & 0x00FF00FF |
             ((m[i] << 24) | (m[i] >>>  8)) & 0xFF00FF00;
    }

    // Padding
    m[l >>> 5] |= 0x80 << (l % 32);
    m[(((l + 64) >>> 9) << 4) + 14] = l;

    // Method shortcuts
    var FF = md5._ff,
        GG = md5._gg,
        HH = md5._hh,
        II = md5._ii;

    for (var i = 0; i < m.length; i += 16) {

      var aa = a,
          bb = b,
          cc = c,
          dd = d;

      a = FF(a, b, c, d, m[i+ 0],  7, -680876936);
      d = FF(d, a, b, c, m[i+ 1], 12, -389564586);
      c = FF(c, d, a, b, m[i+ 2], 17,  606105819);
      b = FF(b, c, d, a, m[i+ 3], 22, -1044525330);
      a = FF(a, b, c, d, m[i+ 4],  7, -176418897);
      d = FF(d, a, b, c, m[i+ 5], 12,  1200080426);
      c = FF(c, d, a, b, m[i+ 6], 17, -1473231341);
      b = FF(b, c, d, a, m[i+ 7], 22, -45705983);
      a = FF(a, b, c, d, m[i+ 8],  7,  1770035416);
      d = FF(d, a, b, c, m[i+ 9], 12, -1958414417);
      c = FF(c, d, a, b, m[i+10], 17, -42063);
      b = FF(b, c, d, a, m[i+11], 22, -1990404162);
      a = FF(a, b, c, d, m[i+12],  7,  1804603682);
      d = FF(d, a, b, c, m[i+13], 12, -40341101);
      c = FF(c, d, a, b, m[i+14], 17, -1502002290);
      b = FF(b, c, d, a, m[i+15], 22,  1236535329);

      a = GG(a, b, c, d, m[i+ 1],  5, -165796510);
      d = GG(d, a, b, c, m[i+ 6],  9, -1069501632);
      c = GG(c, d, a, b, m[i+11], 14,  643717713);
      b = GG(b, c, d, a, m[i+ 0], 20, -373897302);
      a = GG(a, b, c, d, m[i+ 5],  5, -701558691);
      d = GG(d, a, b, c, m[i+10],  9,  38016083);
      c = GG(c, d, a, b, m[i+15], 14, -660478335);
      b = GG(b, c, d, a, m[i+ 4], 20, -405537848);
      a = GG(a, b, c, d, m[i+ 9],  5,  568446438);
      d = GG(d, a, b, c, m[i+14],  9, -1019803690);
      c = GG(c, d, a, b, m[i+ 3], 14, -187363961);
      b = GG(b, c, d, a, m[i+ 8], 20,  1163531501);
      a = GG(a, b, c, d, m[i+13],  5, -1444681467);
      d = GG(d, a, b, c, m[i+ 2],  9, -51403784);
      c = GG(c, d, a, b, m[i+ 7], 14,  1735328473);
      b = GG(b, c, d, a, m[i+12], 20, -1926607734);

      a = HH(a, b, c, d, m[i+ 5],  4, -378558);
      d = HH(d, a, b, c, m[i+ 8], 11, -2022574463);
      c = HH(c, d, a, b, m[i+11], 16,  1839030562);
      b = HH(b, c, d, a, m[i+14], 23, -35309556);
      a = HH(a, b, c, d, m[i+ 1],  4, -1530992060);
      d = HH(d, a, b, c, m[i+ 4], 11,  1272893353);
      c = HH(c, d, a, b, m[i+ 7], 16, -155497632);
      b = HH(b, c, d, a, m[i+10], 23, -1094730640);
      a = HH(a, b, c, d, m[i+13],  4,  681279174);
      d = HH(d, a, b, c, m[i+ 0], 11, -358537222);
      c = HH(c, d, a, b, m[i+ 3], 16, -722521979);
      b = HH(b, c, d, a, m[i+ 6], 23,  76029189);
      a = HH(a, b, c, d, m[i+ 9],  4, -640364487);
      d = HH(d, a, b, c, m[i+12], 11, -421815835);
      c = HH(c, d, a, b, m[i+15], 16,  530742520);
      b = HH(b, c, d, a, m[i+ 2], 23, -995338651);

      a = II(a, b, c, d, m[i+ 0],  6, -198630844);
      d = II(d, a, b, c, m[i+ 7], 10,  1126891415);
      c = II(c, d, a, b, m[i+14], 15, -1416354905);
      b = II(b, c, d, a, m[i+ 5], 21, -57434055);
      a = II(a, b, c, d, m[i+12],  6,  1700485571);
      d = II(d, a, b, c, m[i+ 3], 10, -1894986606);
      c = II(c, d, a, b, m[i+10], 15, -1051523);
      b = II(b, c, d, a, m[i+ 1], 21, -2054922799);
      a = II(a, b, c, d, m[i+ 8],  6,  1873313359);
      d = II(d, a, b, c, m[i+15], 10, -30611744);
      c = II(c, d, a, b, m[i+ 6], 15, -1560198380);
      b = II(b, c, d, a, m[i+13], 21,  1309151649);
      a = II(a, b, c, d, m[i+ 4],  6, -145523070);
      d = II(d, a, b, c, m[i+11], 10, -1120210379);
      c = II(c, d, a, b, m[i+ 2], 15,  718787259);
      b = II(b, c, d, a, m[i+ 9], 21, -343485551);

      a = (a + aa) >>> 0;
      b = (b + bb) >>> 0;
      c = (c + cc) >>> 0;
      d = (d + dd) >>> 0;
    }

    return crypt$1.endian([a, b, c, d]);
  };

  // Auxiliary functions
  md5._ff  = function (a, b, c, d, x, s, t) {
    var n = a + (b & c | ~b & d) + (x >>> 0) + t;
    return ((n << s) | (n >>> (32 - s))) + b;
  };
  md5._gg  = function (a, b, c, d, x, s, t) {
    var n = a + (b & d | c & ~d) + (x >>> 0) + t;
    return ((n << s) | (n >>> (32 - s))) + b;
  };
  md5._hh  = function (a, b, c, d, x, s, t) {
    var n = a + (b ^ c ^ d) + (x >>> 0) + t;
    return ((n << s) | (n >>> (32 - s))) + b;
  };
  md5._ii  = function (a, b, c, d, x, s, t) {
    var n = a + (c ^ (b | ~d)) + (x >>> 0) + t;
    return ((n << s) | (n >>> (32 - s))) + b;
  };

  // Package private blocksize
  md5._blocksize = 16;
  md5._digestsize = 16;

  module.exports = function (message, options) {
    if (message === undefined || message === null)
      { throw new Error('Illegal argument ' + message); }

    var digestbytes = crypt$1.wordsToBytes(md5(message, options));
    return options && options.asBytes ? digestbytes :
        options && options.asString ? bin.bytesToString(digestbytes) :
        crypt$1.bytesToHex(digestbytes);
  };

})();
});

const RequestMethod = {
    GET: 'get',
    POST: 'post',
};

const baseURL = {
    ctrl: '/conference-ctrl/api/v1/ctrl/',
    usermgr: '/user-manager/api/v1/',
    confmgr: '/conference-manager/api/v1/',
};
const configs = {
    // user manager
    getVirtualJWT: {
        method: RequestMethod.GET,
        url: `${baseURL.usermgr}external/virtualJwt/party`,
    },
    login: {
        method: RequestMethod.POST,
        url: `${baseURL.usermgr}login`,
    },
    selectAccount: {
        method: RequestMethod.POST,
        url: `${baseURL.usermgr}login/selectAccount`,
    },
    logout: {
        method: RequestMethod.POST,
        url: `${baseURL.usermgr}logout`,
    },
    refreshToken: {
        method: RequestMethod.GET,
        url: `${baseURL.usermgr}current/user/refreshToken`,
    },
    sendMobileLoginVerifyCode: {
        method: RequestMethod.POST,
        url: `${baseURL.usermgr}sendMobileLoginVerifyCode`,
    },
    // conference manager
    getConferenceInfo: {
        method: RequestMethod.GET,
        url: `${baseURL.confmgr}external/conference/info`,
    },
    // info
    getURL: {
        method: RequestMethod.POST,
        url: `${baseURL.ctrl}get-url-by-long-num`,
    },
    getFullInfo: {
        method: RequestMethod.POST,
        url: `${baseURL.ctrl}get-conference-info`,
    },
    getBasicInfo: {
        method: RequestMethod.POST,
        url: `${baseURL.ctrl}get-short-info`,
    },
    getBasicInfoOffline: {
        method: RequestMethod.POST,
        url: `${baseURL.ctrl}get-short-info-offline`,
    },
    getStats: {
        method: RequestMethod.POST,
        url: `${baseURL.ctrl}get-call-stats`,
    },
    // lifecycle
    polling: {
        method: RequestMethod.POST,
        url: `${baseURL.ctrl}polling`,
    },
    keepalive: {
        method: RequestMethod.POST,
        url: `${baseURL.ctrl}user-keepalive`,
    },
    // focus
    joinFocus: {
        method: RequestMethod.POST,
        url: `${baseURL.ctrl}join-focus`,
    },
    joinWechat: {
        method: RequestMethod.POST,
        url: `${baseURL.ctrl}join-wechat`,
    },
    // media
    joinMedia: {
        method: RequestMethod.POST,
        url: `${baseURL.ctrl}join-audio-video`,
    },
    renegMedia: {
        method: RequestMethod.POST,
        url: `${baseURL.ctrl}av-reneg`,
    },
    // share
    joinShare: {
        method: RequestMethod.POST,
        url: `${baseURL.ctrl}join-applicationsharing-v2`,
    },
    leaveShare: {
        method: RequestMethod.POST,
        url: `${baseURL.ctrl}bye-applicationsharing`,
    },
    switchShare: {
        method: RequestMethod.POST,
        url: `${baseURL.ctrl}applicationsharing-switch`,
    },
    renegShare: {
        method: RequestMethod.POST,
        url: `${baseURL.ctrl}applicationsharing-reneg`,
    },
    // im
    pushMessage: {
        method: RequestMethod.POST,
        url: `${baseURL.ctrl}im-info`,
    },
    pullMessage: {
        method: RequestMethod.POST,
        url: `${baseURL.ctrl}get-all-im-info`,
    },
    // ctrl
    muteAll: {
        method: RequestMethod.POST,
        url: `${baseURL.ctrl}mute-all`,
    },
    unmuteAll: {
        method: RequestMethod.POST,
        url: `${baseURL.ctrl}unmute-all`,
    },
    acceptLobbyUser: {
        method: RequestMethod.POST,
        url: `${baseURL.ctrl}grant-lobby-user`,
    },
    acceptLobbyUserAll: {
        method: RequestMethod.POST,
        url: `${baseURL.ctrl}grant-lobby-all`,
    },
    rejectLobbyUserAll: {
        method: RequestMethod.POST,
        url: `${baseURL.ctrl}del-lobby-all`,
    },
    waitLobbyUser: {
        method: RequestMethod.POST,
        url: `${baseURL.ctrl}wait-lobby-user`,
    },
    waitLobbyUserAll: {
        method: RequestMethod.POST,
        url: `${baseURL.ctrl}wait-lobby-all`,
    },
    rejectHandupAll: {
        method: RequestMethod.POST,
        url: `${baseURL.ctrl}reject-all-hand-up`,
    },
    deleteUser: {
        method: RequestMethod.POST,
        url: `${baseURL.ctrl}delete-user`,
    },
    setUserMedia: {
        method: RequestMethod.POST,
        url: `${baseURL.ctrl}modify-user-media`,
    },
    setUserRole: {
        method: RequestMethod.POST,
        url: `${baseURL.ctrl}modify-user-role`,
    },
    setUserDisplayText: {
        method: RequestMethod.POST,
        url: `${baseURL.ctrl}edit-user-display-text`,
    },
    holdUser: {
        method: RequestMethod.POST,
        url: `${baseURL.ctrl}wait-lobby-user`,
    },
    inviteUser: {
        method: RequestMethod.POST,
        url: `${baseURL.ctrl}invite-user`,
    },
    setFocusVideo: {
        method: RequestMethod.POST,
        url: `${baseURL.ctrl}set-focus-video`,
    },
    setSpeakMode: {
        method: RequestMethod.POST,
        url: `${baseURL.ctrl}set-speak-mode`,
    },
    setFreeLayout: {
        method: RequestMethod.POST,
        url: `${baseURL.ctrl}set-free-layout`,
    },
    setCustomizeLayout: {
        method: RequestMethod.POST,
        url: `${baseURL.ctrl}set-customize-layout`,
    },
    setGlobalLayout: {
        method: RequestMethod.POST,
        url: `${baseURL.ctrl}set-global-layout`,
    },
    setFecc: {
        method: RequestMethod.POST,
        url: `${baseURL.ctrl}set-fecc`,
    },
    setTitle: {
        method: RequestMethod.POST,
        url: `${baseURL.ctrl}set-title`,
    },
    sendTitle: {
        method: RequestMethod.POST,
        url: `${baseURL.ctrl}send-title`,
    },
    setRecord: {
        method: RequestMethod.POST,
        url: `${baseURL.ctrl}record-operate`,
    },
    setRTMP: {
        method: RequestMethod.POST,
        url: `${baseURL.ctrl}rtmp-operate`,
    },
    setLock: {
        method: RequestMethod.POST,
        url: `${baseURL.ctrl}lock-conference`,
    },
    leave: {
        method: RequestMethod.POST,
        url: `${baseURL.ctrl}quit-conference`,
    },
    end: {
        method: RequestMethod.POST,
        url: `${baseURL.ctrl}end-conference`,
    },
};
const CONFIGS = configs;

const DEFAULT_ERROR = {
    msg: 'Unknown Error',
    errorCode: -1,
};
class ApiError extends Error {
    constructor(bizCode, error = DEFAULT_ERROR) {
        super();
        this.name = 'ApiError';
        this.message = error.msg;
        this.errCode = error.errorCode;
        this.bizCode = bizCode;
    }
}
// TODO
// api error type checker

const log$1 = browser('MN:Api:Request');
const { isCancel: isCancel$1 } = axios$1;
function createRequest$1(config, delegate = axios$1) {
    let source;
    let request;
    function header(header) {
        config.headers = header;
        return request;
    }
    function params(params) {
        config.params = params;
        return request;
    }
    function data(data) {
        config.data = data;
        return request;
    }
    function send() {
        log$1('send()');
        source = axios$1.CancelToken.source();
        config.cancelToken = source.token;
        return delegate(config);
    }
    function cancel(reason = 'canceled') {
        log$1('cancel()');
        return source && source.cancel(reason);
    }
    return request = {
        config,
        header,
        params,
        data,
        send,
        cancel,
    };
}
// export type Request<T, B, D> = ReturnType<typeof createRequest<T, B, D>>;

const log$2 = browser('MN:Api');
function createApi(config = {}) {
    log$2('createApi()');
    const delegate = axios$1.create(Object.spread({}, {baseURL: '/'},
        config));
    delegate.interceptors.response.use((response) => {
        const { ret, bizCode, error, data, } = response.data;
        if (ret < 0)
            { throw new ApiError(bizCode, error); }
        // should not go here
        // server impl error
        if (ret === 0 && error)
            { throw new ApiError(bizCode, error); }
        log$2('request success: %o', data);
        // TBD
        // replace response data with actual data. eg. response.data = data;
        // TODO
        // normalize error
        return response;
    }, (error) => {
        log$2('request error: %o', error);
        throw error;
    });
    function request(apiName) {
        log$2(`request() "${apiName}"`);
        return createRequest$1(Object.spread({}, CONFIGS[apiName]), delegate);
    }
    return {
        get interceptors() {
            return delegate.interceptors;
        },
        request,
        delegate,
    };
}

const isDef = (value) => {
    return value !== undefined && value !== null;
};
const { isArray: isArray$1 } = Array;
const isFunction$1 = (val) => typeof val === 'function';
const isObject$2 = (val) => typeof val === 'object' && val !== null;
const { hasOwnProperty } = Object.prototype;
const hasOwn = (val, key) => hasOwnProperty.call(val, key);
const camelizeRE = /-(\w)/g;
const camelize = (str) => {
    return str.replace(camelizeRE, (_, c) => (c ? c.toUpperCase() : ''));
};
// compare whether a value has changed, accounting for NaN.
const hasChanged = (value, oldValue) => {
    /* eslint-disable-next-line no-self-compare */
    return value !== oldValue && (value === value || oldValue === oldValue);
};

function createUserApi(token) {
    const api = createApi({
        baseURL: CONFIG.get('baseurl', (process.env.NODE_ENV === 'test') ? '/webapp/' : 'https://meetings.ylyun.com/webapp/'),
        timeout: CONFIG.get('timeout', 0),
    });
    api.interceptors.request.use((config) => {
        if (token) {
            config.headers = config.headers || {};
            config.headers.token = isFunction$1(token) ? token() : token;
        }
        return config;
    });
    return api;
}

const log$3 = browser('MN:Worker');
function createWorker(config) {
    let running = false;
    let working = false;
    let interval = 0;
    let times = 0;
    let timeout;
    const { interval: nextInterval = interval, work, cancel, } = config;
    async function job(immediate = true) {
        if (work && immediate) {
            working = true;
            await work(times++);
            working = false;
        }
        if (!running)
            { return; }
        interval = isFunction$1(nextInterval) ? nextInterval() : nextInterval;
        // schedule next
        timeout = setTimeout(job, interval);
    }
    async function start(immediate = true) {
        log$3('start()');
        if (running)
            { return; }
        running = true;
        await job(immediate);
    }
    function stop() {
        log$3('stop()');
        if (!running)
            { return; }
        if (timeout) {
            clearTimeout(timeout);
            timeout = undefined;
        }
        if (working) {
            cancel && cancel();
        }
        running = false;
    }
    return {
        config,
        get running() {
            return running;
        },
        start,
        stop,
    };
}

async function createDigestAuth(selection) {
    let token = selection;
    // create api
    const api = createUserApi(() => token);
    // try auth
    const response = await api.request('selectAccount').send();
    ({ token } = response.data.data);
    // creat auth() worker
    const worker = createWorker({
        interval: 5 * 60 * 1000,
        work: async () => {
            await api.request('refreshToken').send();
        },
    });
    // start worker
    worker.start(false);
    async function invalid() {
        await api.request('logout')
            .send()
            // ignore error anyway
            .catch(() => { });
        worker.stop();
        token = undefined;
    }
    return {
        get token() {
            return token;
        },
        api,
        worker,
        invalid,
    };
}

/* eslint-disable no-use-before-define */
async function createTempAuth(partyId) {
    let token;
    // create api
    const api = createUserApi(() => token);
    // try auth
    await auth();
    // creat auth() worker
    const worker = createWorker({
        interval: 5 * 60 * 1000,
        work: auth,
    });
    // start worker
    worker.start(false);
    async function auth() {
        const response = await api
            .request('getVirtualJWT')
            .params({ id: partyId })
            .send();
        ({ token } = response.data.data);
        if (!token) {
            throw new Error('Authorization Error');
        }
    }
    async function invalid() {
        worker.stop();
        token = undefined;
    }
    return {
        get token() {
            return token;
        },
        api,
        worker,
        invalid,
    };
}

var AuthType;
(function (AuthType) {
    AuthType["email"] = "0";
    AuthType["mobile"] = "1";
    AuthType["verifycode"] = "9";
})(AuthType || (AuthType = {}));
async function bootstrap(auth) {
    const api = createUserApi();
    const response = await api.request('login')
        .data({
        principle: auth.principle,
        credential: md5(auth.credential),
        number: auth.enterprise,
        mobileCode: auth.areacode,
        accountType: auth.authtype,
    })
        .send();
    const { account, tokens } = response.data.data;
    const identities = tokens.map(token => {
        const identityToken = token.token;
        let identityAuth;
        return Object.spread({}, token,
            {get account() {
                return account;
            },
            get auth() {
                return identityAuth;
            },
            async confirm() {
                if (!identityAuth) {
                    identityAuth = await createDigestAuth(identityToken);
                }
                return identityAuth;
            }});
    });
    return {
        account,
        identities,
    };
}
async function fetchControlUrl(identity, number, baseurl) {
    // check identity
    if (!identity.auth) {
        await identity.confirm();
    }
    const { auth, party } = identity;
    const { api, token } = auth;
    const { number: partyNumber } = party;
    const response = await api.request('getConferenceInfo')
        .params({
        conferenceNo: number,
        searchNotStartedScheduledConference: false,
    })
        .send();
    const { conferenceNo, domain, vmr, scheduledConference, } = response.data.data;
    const shortNo = conferenceNo.split('.')[1];
    let planId = '';
    let sequence = 1;
    if (vmr) {
        ({ vmrId: planId } = vmr);
    }
    if (scheduledConference) {
        ({ planId, sequence } = scheduledConference);
    }
    const encode = btoa$1;
    const source = 'WEBUSER';
    const parts = [
        `source=${source}`,
        // TODO base64
        `conference=${encode(`${shortNo}@${domain}`)}`,
        `sequence=${sequence}`,
        `id=${planId}`,
        // TODO base64
        `client=${encode(`${partyNumber}@${domain}`)}`,
        `t=${encode(token)}`,
    ];
    baseurl = baseurl || api.delegate.defaults.baseURL;
    baseurl = baseurl.replace('webapp', 'control');
    const url = `${baseurl}?${parts.join('&')}`;
    return url;
}

function createContext(delegate) {
    return new Proxy({}, {
        get(target, key) {
            return key in target ? target[key] : Reflect.get(delegate, key);
        },
    });
}
// export function createMessageSender(delegate: any) {
//   return new Proxy({}, {
//     get(target: object, key: string) {
//       return Reflect.get(delegate, hyphenate(key));
//     },
//   }) as Context;
// }

const log$4 = browser('MN:Events');
function createEvents(scopedlog = log$4) {
    let instance;
    const events = {};
    function on(event, fn) {
        if (isArray$1(event)) {
            event.forEach((ev) => on(ev, fn));
            return instance;
        }
        (events[event] || (events[event] = [])).push(fn);
        return instance;
    }
    function off(event, fn) {
        if (isArray$1(event)) {
            event.forEach((e) => off(e, fn));
            return instance;
        }
        const callbacks = events[event];
        if (!callbacks) {
            return instance;
        }
        if (!fn) {
            events[event] = null;
            return instance;
        }
        let callback;
        let index = callbacks.length;
        while (index--) {
            callback = callbacks[index];
            if (callback === fn || callback.fn === fn) {
                callbacks.splice(index, 1);
                break;
            }
        }
        return instance;
    }
    function once(event, fn) {
        function wrapper(...args) {
            off(event, wrapper);
            fn.apply(this, args);
        }
        wrapper.fn = fn;
        on(event, wrapper);
        return instance;
    }
    function toArray(list, start) {
        start = start || 0;
        let i = list.length - start;
        const ret = new Array(i);
        while (i--) {
            ret[i] = list[i + start];
        }
        return ret;
    }
    function emit(event, ...args) {
        scopedlog(`emit() "${event}"`);
        let callbacks = events[event];
        if (!callbacks)
            { return instance; }
        callbacks = callbacks.length > 1 ? toArray(callbacks) : callbacks;
        for (const callback of callbacks) {
            try {
                callback(...args);
            }
            catch (error) {
                scopedlog(`invoke "${event}" callback failed: %o`, error);
            }
        }
        return instance;
    }
    return instance = {
        on,
        off,
        once,
        emit,
    };
}

const log$5 = browser('MN:Keepalive');
const DEFAULT_INTERVAL = 30 * 1000;
const MIN_INTERVAL = 2;
const MAX_INTERVAL = 30;
const MAX_ATTEMPTS = 15;
function computeNextTimeout(attempts) {
    log$5(`computeNextTimeout() attempts: ${attempts}`);
    /* eslint-disable-next-line no-restricted-properties */
    let k = Math.floor((Math.random() * Math.pow(2, attempts)) + 1);
    if (k < MIN_INTERVAL) {
        k = MIN_INTERVAL;
    }
    if (k > MAX_INTERVAL) {
        k = MAX_INTERVAL;
    }
    return k * 1000;
}
function createKeepAlive(config) {
    const { api } = config;
    let request;
    let canceled = false;
    let interval = config.interval || DEFAULT_INTERVAL;
    let attempts = 0;
    async function keepalive() {
        log$5('keepalive()');
        let response;
        let error;
        try {
            canceled = false;
            request = api.request('keepalive');
            response = await request.send();
        }
        catch (e) {
            error = e;
            canceled = isCancel$1(e);
            if (canceled)
                { return; }
            // if request failed by network or server error,
            // increase next request timeout
            attempts++;
            interval = computeNextTimeout(attempts);
            log$5('keepalive error: %o', error);
            config.onError && config.onError(error, attempts);
        }
        if (attempts > MAX_ATTEMPTS) {
            config.onError && config.onError(new Error('Max Attempts'), attempts);
        }
        if (error)
            { return; }
        const { bizCode, data = {
            interval,
        }, } = response.data;
        const { interval: expectedInterval, } = data;
        // TODO
        // check bizCode
        interval = Math.min(expectedInterval * 1000, interval);
    }
    const worker = createWorker({
        work: () => keepalive(),
        interval: () => interval,
        cancel: () => request.cancel(),
    });
    return Object.spread({}, worker,
        {keepalive});
}

const log$6 = browser('MN:Polling');
const DEFAULT_INTERVAL$1 = 100;
const MIN_INTERVAL$1 = 2;
const MAX_INTERVAL$1 = 30;
const MAX_ATTEMPTS$1 = 5;
function computeNextTimeout$1(attempts) {
    log$6(`computeNextTimeout() attempts: ${attempts}`);
    /* eslint-disable-next-line no-restricted-properties */
    let k = Math.floor((Math.random() * Math.pow(2, attempts)) + 1);
    if (k < MIN_INTERVAL$1) {
        k = MIN_INTERVAL$1;
    }
    if (k > MAX_INTERVAL$1) {
        k = MAX_INTERVAL$1;
    }
    return k * 1000;
}
function createPolling(config) {
    const { api } = config;
    let request;
    let interval = DEFAULT_INTERVAL$1;
    let attempts = 0;
    let version = 0;
    function analyze(data) {
        if (!data)
            { return; }
        const { version: newVersion, category, body } = data;
        if (!isDef(newVersion) || newVersion <= version) {
            log$6(`illegal version: ${newVersion}, current version: ${version}.`);
            return;
        }
        switch (category) {
            case 'conference-info':
                config.onInformation && config.onInformation(body);
                break;
            case 'im-record':
                config.onMessage && config.onMessage(body);
                break;
            case 'port-change':
                config.onRenegotiate && config.onRenegotiate(body);
                break;
            case 'quit-conference':
                config.onQuit && config.onQuit(body);
                break;
            default:
                log$6(`unsupported category: ${category}`);
                break;
        }
        version = newVersion;
    }
    async function poll() {
        log$6('poll()');
        let response;
        let error;
        let canceled = false;
        let timeouted = false;
        try {
            request = api.request('polling').data({ version });
            response = await request.send();
        }
        catch (e) {
            error = e;
            canceled = isCancel$1(e);
            if (canceled)
                { return; }
            // polling timeout
            timeouted = !!error && [900408, 901323].includes(error.bizCode);
            if (timeouted)
                { return; }
            // if request failed by network or server error,
            // increase next polling timeout
            attempts++;
            interval = computeNextTimeout$1(attempts);
            log$6('polling error: %o', error);
            config.onError && config.onError(error, attempts);
        }
        if (attempts > MAX_ATTEMPTS$1) {
            config.onError && config.onError(new Error('Max Attempts'), attempts);
        }
        if (error)
            { return; }
        const { bizCode, data } = response.data;
        // TODO
        // check bizCode
        try {
            analyze(data);
        }
        catch (error) {
            log$6('process data failed. %o', error);
        }
        attempts = 0;
    }
    const worker = createWorker({
        work: () => poll(),
        interval: () => interval,
        cancel: () => request.cancel(),
    });
    return Object.spread({}, worker,
        {poll,
        analyze});
}

const log$7 = browser('MN:Reactive');
function createReactive(data, events) {
    events = events || createEvents(log$7);
    return new Proxy(data, {
        set(target, prop, value, receiver) {
            const oldValue = target[prop];
            const hadKey = hasOwn(target, prop);
            const result = Reflect.set(target, prop, value, receiver);
            if (!hadKey) {
                events.emit(`${camelize(prop)}Added`, value);
            }
            if (hasChanged(value, oldValue)) {
                events.emit(`${camelize(prop)}Changed`, value, oldValue);
            }
            return result;
        },
    });
}

const log$8 = browser('MN:Information:Description');
function createDescription(data, context) {
    const { api } = context;
    const events = createEvents(log$8);
    /* eslint-disable-next-line no-use-before-define */
    const reactive = createReactive(watch({}), events);
    let description;
    function watch(target) {
        /* eslint-disable no-use-before-define */
        target.locked = isLocked();
        /* eslint-enable no-use-before-define */
        return target;
    }
    function update(diff) {
        // fire status change events
        watch(reactive);
        events.emit('updated', description);
    }
    function getLock() {
        return {
            admissionPolicy: data['admission-policy'],
            attendeeByPass: data['attendee-by-pass'],
        };
    }
    async function setLock(options) {
        log$8('setLock()');
        const { admissionPolicy, attendeeByPass = true } = options;
        await api
            .request('setLock')
            .data({
            'admission-policy': admissionPolicy,
            'attendee-lobby-bypass': attendeeByPass,
        })
            .send();
    }
    async function lock(attendeeByPass = false, presenterOnly = true) {
        log$8('lock()');
        await setLock({
            admissionPolicy: presenterOnly ? 'closedAuthenticated' : 'openAuthenticated',
            attendeeByPass,
        });
    }
    async function unlock() {
        log$8('unlock()');
        await setLock({
            admissionPolicy: 'anonymous',
        });
    }
    function isLocked() {
        return getLock().admissionPolicy !== 'anonymous';
    }
    return description = Object.spread({}, events,
        {get data() {
            return data;
        },
        get subject() {
            return data.subject;
        },
        get(key) {
            return data[key];
        },
        update,
        getLock,
        setLock,
        lock,
        unlock,
        isLocked});
}

const log$9 = browser('MN:Information:State');
function createState(data, context) {
    const events = createEvents(log$9);
    /* eslint-disable-next-line no-use-before-define */
    const reactive = createReactive(watch({}), events);
    let description;
    function watch(target) {
        const { active, locked, } = data;
        /* eslint-disable no-use-before-define */
        target.active = active;
        target.locked = locked;
        target.sharingUserEntity = getSharingUserEntity();
        target.speechUserEntity = getSpeechUserEntity();
        /* eslint-enable no-use-before-define */
        return target;
    }
    function update(diff) {
        // fire status change events
        watch(reactive);
        events.emit('updated', description);
    }
    function getSharingUserEntity() {
        const { applicationsharer } = data;
        return applicationsharer.user && applicationsharer.user.entity;
    }
    function getSpeechUserEntity() {
        const { 'speech-user-entity': speechUserEntity } = data;
        return speechUserEntity;
    }
    function getSharingType() {
        const { applicationsharer } = data;
        return applicationsharer.user && applicationsharer.user['share-type'];
    }
    return description = Object.spread({}, events,
        {get data() {
            return data;
        },
        get(key) {
            return data[key];
        },
        update,
        getSharingUserEntity,
        getSpeechUserEntity,
        getSharingType});
}

const log$a = browser('MN:Information:Layout');
function createLayoutCtrl(api) {
    async function setLayout(options) {
        log$a('setLayout()');
        await api
            .request('setFreeLayout')
            .data(options)
            .send();
    }
    async function setCustomizeLayout(options) {
        log$a('setCustomizeLayout()');
        options.viewer = options.viewer || 'attendee';
        await api
            .request('setCustomizeLayout')
            .data(options)
            .send();
    }
    async function setPresenterLayout(options) {
        log$a('setPresenterLayout()');
        options.viewer = 'presenter';
        await setCustomizeLayout(options);
    }
    async function setAttendeeLayout(options) {
        log$a('setAttendeeLayout()');
        options.viewer = 'attendee';
        await setCustomizeLayout(options);
    }
    async function setCastViewerLayout(options) {
        log$a('setCastViewerLayout()');
        options.viewer = 'castviewer';
        await setCustomizeLayout(options);
    }
    async function setOSD(options = { name: true, icon: true }) {
        log$a('setOSD()');
        const { name, icon } = options;
        await api
            .request('setGlobalLayout')
            .data({
            'hide-osd-site-icon': icon,
            'hide-osd-site-name': name,
        })
            .send();
    }
    async function setSpeakMode(mode) {
        log$a('setSpeakMode()');
        await api
            .request('setSpeakMode')
            .data({ 'speak-mode': mode })
            .send();
    }
    return {
        setLayout,
        setCustomizeLayout,
        setPresenterLayout,
        setAttendeeLayout,
        setCastViewerLayout,
        setOSD,
        setSpeakMode,
    };
}

const log$b = browser('MN:Information:Danmaku');
const DANMAKU_CONFIGS = {
    position: 'top',
    type: 'static',
    displayTime: 30,
    repeatCount: 2,
    repeatInterval: 5,
    rollDirection: 'R2L',
};
function createDanmakuCtrl(api) {
    let lastConfig = DANMAKU_CONFIGS;
    async function setDanmaku(config) {
        log$b('setDanmaku()');
        const finalConfig = Object.spread({}, lastConfig,
            {config});
        const { type, position, displayTime, repeatCount, repeatInterval, rollDirection, } = finalConfig;
        await api
            .request('setTitle')
            .data({
            type,
            position,
            'display-time': displayTime,
            'repeat-count': repeatCount,
            'repeat-interval': repeatInterval,
            'roll-direction': rollDirection,
        })
            .send();
        lastConfig = finalConfig;
    }
    async function sendDanmaku(msg, options) {
        log$b('sendDanmaku()');
        const { attendee = true, castviewer = true, presenter = true, } = options || {};
        await api
            .request('sendTitle')
            .data({
            'display-text': msg,
            'all-attendee': attendee,
            'all-castviewer': castviewer,
            'all-presenter': presenter,
        });
    }
    return {
        setDanmaku,
        sendDanmaku,
    };
}

const log$c = browser('MN:Information:View');
function createView(data, context) {
    const { api } = context;
    const events = createEvents(log$c);
    /* eslint-disable-next-line no-use-before-define */
    const reactive = createReactive(watch({}), events);
    const layout = createLayoutCtrl(api);
    const danmaku = createDanmakuCtrl(api);
    let view;
    function watch(target) {
        /* eslint-disable no-use-before-define */
        target.focusUserEntity = getFocusUserEntity();
        /* eslint-enable no-use-before-define */
        return target;
    }
    function update(diff) {
        // fire status change events
        watch(reactive);
        events.emit('updated', view);
    }
    function getVideoView() {
        return data['entity-view'].find((view) => view.entity === 'audio-video');
    }
    function getLayout() {
        return getVideoView()['entity-state'];
    }
    function getFocusUserEntity() {
        return getLayout()['focus-video-user-entity'];
    }
    function getDanmaku() {
        return getVideoView().title;
    }
    return view = Object.spread({}, events,
        {get data() {
            return data;
        },
        get(key) {
            return data[key];
        }},
        layout,
        danmaku,
        {update,
        getVideoView,
        getLayout,
        getFocusUserEntity,
        getDanmaku});
}

const log$d = browser('MN:Information:Camera');
var ActionTypes;
(function (ActionTypes) {
    ActionTypes["LEFT"] = "PanLeft";
    ActionTypes["RIGHT"] = "PanRight";
    ActionTypes["DOWN"] = "TiltDown";
    ActionTypes["UP"] = "TiltUp";
    ActionTypes["ZOOMOUT"] = "ZoomOut";
    ActionTypes["ZOOMIN"] = "ZoomIn";
    ActionTypes["FOCUSOUT"] = "FocusOut";
    ActionTypes["FOCUSIN"] = "FocusIn";
})(ActionTypes || (ActionTypes = {}));
function createCameraCtrl(api, entity) {
    async function action(type) {
        log$d('action()');
        await api
            .request('setFecc')
            .data({
            'user-entity': entity,
            action: type,
        })
            .send();
    }
    function left() {
        log$d('left()');
        return action(ActionTypes.LEFT);
    }
    function right() {
        log$d('right()');
        return action(ActionTypes.RIGHT);
    }
    function down() {
        log$d('down()');
        return action(ActionTypes.DOWN);
    }
    function up() {
        log$d('up()');
        return action(ActionTypes.UP);
    }
    function zoomout() {
        log$d('zoomout()');
        return action(ActionTypes.ZOOMOUT);
    }
    function zoomin() {
        log$d('zoomin()');
        return action(ActionTypes.ZOOMIN);
    }
    function focusout() {
        log$d('focusout()');
        return action(ActionTypes.FOCUSOUT);
    }
    function focusin() {
        log$d('focusin()');
        return action(ActionTypes.FOCUSIN);
    }
    return {
        action,
        left,
        right,
        down,
        up,
        zoomout,
        zoomin,
        focusout,
        focusin,
    };
}

const log$e = browser('MN:Information:User');
function createUser(data, context) {
    const { api, userId } = context;
    const events = createEvents(log$e);
    /* eslint-disable-next-line no-use-before-define */
    const reactive = createReactive(watch({}), events);
    /* eslint-disable-next-line no-use-before-define */
    const entity = getEntity();
    const camera = createCameraCtrl(api, entity);
    let user;
    function watch(target) {
        /* eslint-disable no-use-before-define */
        target.displayText = data['display-text'];
        target.role = getRole();
        target.hold = isOnHold();
        target.audio = !isAudioBlocked();
        target.video = !isVideoBlocked();
        target.handup = isHandup();
        target.media = hasMedia();
        target.sharing = isSharing();
        /* eslint-enable no-use-before-define */
        return target;
    }
    function update(diff) {
        if (diff && (diff.state === 'full' || !data)) {
            data = diff;
        }
        // fire status change events
        watch(reactive);
        events.emit('updated', user);
    }
    function getEntity() {
        return data.entity;
    }
    function getUID() {
        return data['subject-id'];
    }
    function getDisplayText() {
        return data['display-text'];
    }
    function getRole() {
        return data.roles && data.roles.role;
    }
    function isCurrent() {
        return entity === userId;
    }
    function isAttendee() {
        return getRole() === 'attendee';
    }
    function isPresenter() {
        return getRole() === 'presenter';
    }
    function isCastviewer() {
        return getRole() === 'castviewer';
    }
    function isOrganizer() {
        return getRole() === 'organizer';
    }
    function getEndpoint(type) {
        return data.endpoint.find((ep) => ep['session-type'] === type);
    }
    function isOnHold() {
        const endpoint = getEndpoint('audio-video');
        return !!endpoint && endpoint.status === 'on-hold';
    }
    function hasFocus() {
        return !!getEndpoint('focus');
    }
    function hasMedia() {
        return !!getEndpoint('audio-video');
    }
    function hasSharing() {
        return !!getEndpoint('applicationsharing');
    }
    function hasFECC() {
        return !!getEndpoint('fecc');
    }
    function getMedia(label) {
        const mediaList = data.endpoint.reduce((previous, current) => {
            return previous.concat(current.media || []);
        }, []);
        return mediaList.find((m) => m.label === label);
    }
    function getMediaFilter(label) {
        const media = getMedia(label);
        const { 'media-ingress-filter': ingress = { type: 'unblock' }, 'media-egress-filter': egress = { type: 'unblock' }, } = media || {};
        return {
            ingress: ingress.type,
            egress: egress.type,
        };
    }
    function getAudioFilter() {
        return getMediaFilter('main-audio');
    }
    function getVideoFilter() {
        return getMediaFilter('main-video');
    }
    function isAudioBlocked() {
        const { ingress } = getAudioFilter();
        return ingress === 'block';
    }
    function isVideoBlocked() {
        const { ingress } = getVideoFilter();
        return ingress === 'block';
    }
    function isHandup() {
        const { ingress } = getAudioFilter();
        return ingress === 'unblocking';
    }
    function isSharing() {
        const media = getMedia('applicationsharing');
        return !!media && media.status === 'sendonly';
    }
    function isSIP() {
        return data.protocol.toLowerCase() === 'sip';
    }
    function isHTTP() {
        return data.protocol.toLowerCase() === 'http';
    }
    function isRTMP() {
        return data.protocol.toLowerCase() === 'rtmp';
    }
    // user ctrl
    async function setFilter(options) {
        log$e('setFilter()');
        const { label, enable } = options;
        const endpoint = user.getEndpoint('audio-video');
        const media = user.getMedia(label);
        await api
            .request('setUserMedia')
            .data({
            'user-entity': entity,
            'endpoint-entity': endpoint.entity,
            'media-id': media.id,
            'media-ingress-filter': enable ? 'unblock' : 'block',
        })
            .send();
    }
    async function setAudioFilter(enable) {
        log$e('setAudioFilter()');
        await setFilter({ label: 'main-audio', enable });
    }
    async function setVideoFilter(enable) {
        log$e('setVideoFilter()');
        await setFilter({ label: 'main-video', enable });
    }
    async function setDisplayText(displayText) {
        log$e('setDisplayText()');
        await api
            .request('setUserDisplayText')
            .data({
            'user-entity': entity,
            'display-text': displayText,
        })
            .send();
    }
    async function setRole(role) {
        log$e('setRole()');
        await api
            .request('setUserRole')
            .data({
            'user-entity': entity,
            role,
        })
            .send();
    }
    async function setFocus(enable = true) {
        log$e('setFocus()');
        await api
            .request('setFocusVideo')
            .data({
            'user-entity': enable ? entity : '',
        })
            .send();
    }
    async function getStats() {
        log$e('getStats()');
        const { data } = await api
            .request('getStats')
            .data({ 'user-entity-list': [entity] })
            .send();
        return data;
    }
    async function kick() {
        log$e('kick()');
        await api
            .request('deleteUser')
            .data({ 'user-entity': entity })
            .send();
    }
    async function hold() {
        log$e('hold()');
        await api
            .request('waitLobbyUser')
            .data({ 'user-entity': entity })
            .send();
    }
    async function unhold() {
        log$e('unhold()');
        await api
            .request('acceptLobbyUser')
            .data({ 'user-entity': entity })
            .send();
    }
    async function allow() {
        log$e('allow()');
        await api
            .request('acceptLobbyUser')
            .data({ 'user-entity': entity })
            .send();
    }
    async function accept() {
        log$e('accept()');
        await setAudioFilter(true);
    }
    async function reject() {
        log$e('reject()');
        await setAudioFilter(false);
    }
    async function sendMessage(msg) {
        log$e('sendMessage()');
        const { chatChannel } = context;
        if (chatChannel && chatChannel.ready) {
            await chatChannel.sendMessage(msg, [entity]);
        }
    }
    return user = Object.spread({}, events,
        {get data() {
            return data;
        },
        get(key) {
            return data[key];
        },
        update,
        getEntity,
        getUID,
        getDisplayText,
        getRole,
        isCurrent,
        isAttendee,
        isPresenter,
        isCastviewer,
        isOrganizer,
        getEndpoint,
        isOnHold,
        hasFocus,
        hasMedia,
        hasSharing,
        hasFECC,
        getMedia,
        getAudioFilter,
        getVideoFilter,
        isAudioBlocked,
        isVideoBlocked,
        isHandup,
        isSharing,
        isSIP,
        isHTTP,
        isRTMP,
        // user ctrl
        setFilter,
        setAudioFilter,
        setVideoFilter,
        setDisplayText,
        setRole,
        setFocus,
        getStats,
        kick,
        hold,
        unhold,
        allow,
        accept,
        reject,
        sendMessage,
        // camera ctrl
        camera});
}

const log$f = browser('MN:Information:Lobby');
function createLobbyCtrl(api) {
    async function remove(entity) {
        log$f('remove()');
        const apiName = entity ? 'deleteUser' : 'rejectLobbyUserAll';
        await api
            .request(apiName)
            .data({ 'user-entity': entity })
            .send();
    }
    async function unhold(entity) {
        log$f('unhold()');
        const apiName = entity ? 'acceptLobbyUser' : 'acceptLobbyUserAll';
        await api
            .request(apiName)
            .data({ 'user-entity': entity })
            .send();
    }
    async function allow(entity) {
        log$f('allow()');
        await unhold(entity);
    }
    async function hold(entity) {
        log$f('hold()');
        const apiName = entity ? 'waitLobbyUser' : 'waitLobbyUserAll';
        await api
            .request(apiName)
            .data({ 'user-entity': entity })
            .send();
    }
    return {
        remove,
        unhold,
        hold,
        allow,
    };
}

const log$g = browser('MN:Information:Users');
function createUsers(data, context) {
    const { api } = context;
    const events = createEvents(log$g);
    const userMap = new Map();
    let userList;
    let users;
    /* eslint-disable-next-line no-use-before-define */
    const reactive = createReactive(watch({}), events);
    const lobby = createLobbyCtrl(api);
    function watch(target) {
        /* eslint-disable no-use-before-define */
        // update user list
        userList = data.user.map((userdata) => {
            const { entity } = userdata;
            let user = userMap.get(entity);
            if (!user) {
                user = createUser(userdata, context);
                userMap.set(entity, user);
            }
            return user;
        });
        /* eslint-enable no-use-before-define */
        return target;
    }
    function update(diff) {
        const added = [];
        const updated = [];
        const deleted = [];
        if (diff) {
            const { user } = diff;
            /* eslint-disable no-use-before-define */
            user.forEach((userdata) => {
                const { entity, state } = userdata;
                hasUser(entity)
                    ? state === 'deleted'
                        ? deleted.push(userdata)
                        : updated.push(userdata)
                    : added.push(userdata);
            });
            /* eslint-enable no-use-before-define */
        }
        // fire status change events
        watch(reactive);
        added.forEach((userdata) => {
            const { entity } = userdata;
            const user = userMap.get(entity);
            log$g('added user:\n\n %s(%s) \n', user.getDisplayText(), user.getEntity());
            users.emit('user:added', user);
        });
        updated.forEach((userdata) => {
            const { entity } = userdata;
            const user = userMap.get(entity);
            // user data is not proxied, so update it here
            // if user data is 'full', it will replace the old one
            user.update(userdata);
            log$g('updated user:\n\n %s(%s)  \n', user.getDisplayText(), user.getEntity());
            users.emit('user:updated', user);
        });
        deleted.forEach((userdata) => {
            const { entity } = userdata;
            const user = userMap.get(entity);
            log$g('deleted user:\n\n %s(%s)  \n', user.getDisplayText(), user.getEntity());
            users.emit('user:deleted', user);
            userMap.delete(entity);
        });
        // updated event must come after watch()
        // as user can access userlit via updated event
        events.emit('updated', users);
    }
    function getUserList(filter) {
        return filter ? userList.filter(filter) : userList;
    }
    function getUser(entity) {
        return userMap.get(entity);
    }
    function hasUser(entity) {
        return userMap.has(entity);
    }
    function getCurrent() {
        return userList.find((user) => user.isCurrent());
    }
    function getAttendee() {
        return userList.filter((user) => user.isAttendee() && !user.isOnHold());
    }
    function getPresenter() {
        return userList.filter((user) => user.isPresenter());
    }
    function getCastviewer() {
        return userList.filter((user) => user.isCastviewer());
    }
    function getOrganizer() {
        return userList.filter((user) => user.isOrganizer());
    }
    function getOnhold() {
        return userList.filter((user) => user.isOnHold());
    }
    function getHandup() {
        return userList.filter((user) => user.isHandup());
    }
    function getSharing() {
        return userList.filter((user) => user.isSharing());
    }
    function getAudioBlocked() {
        return userList.filter((user) => user.isAudioBlocked());
    }
    function getVideoBlocked() {
        return userList.filter((user) => user.isVideoBlocked());
    }
    function getSIP() {
        return userList.filter((user) => user.isSIP());
    }
    function getHTTP() {
        return userList.filter((user) => user.isHTTP());
    }
    function getRTMP() {
        return userList.filter((user) => user.isRTMP());
    }
    async function invite(option) {
        log$g('invite');
        await api
            .request('inviteUser')
            .data({
            uid: option.uid,
            'sip-url': option.sipURL,
            'h323-url': option.h323URL,
        })
            .send();
    }
    async function kick(entity) {
        log$g('kick');
        await api
            .request('deleteUser')
            .data({ 'user-entity': entity })
            .send();
    }
    async function mute() {
        log$g('mute');
        await api
            .request('muteAll')
            .send();
    }
    async function unmute() {
        log$g('unmute');
        await api
            .request('unmuteAll')
            .send();
    }
    async function reject() {
        log$g('reject');
        await api
            .request('rejectHandupAll')
            .send();
    }
    return users = Object.spread({}, events,
        {get data() {
            return data;
        },
        get(key) {
            return data[key];
        }},
        lobby,
        {update,
        getUserList,
        getUser,
        hasUser,
        getCurrent,
        getAttendee,
        getPresenter,
        getCastviewer,
        getOrganizer,
        getOnhold,
        getHandup,
        getSharing,
        getAudioBlocked,
        getVideoBlocked,
        getSIP,
        getHTTP,
        getRTMP,
        invite,
        kick,
        mute,
        unmute,
        reject});
}

const log$h = browser('MN:Information:RTMP');
var RTMPOperationTypes;
(function (RTMPOperationTypes) {
    RTMPOperationTypes["START"] = "start";
    RTMPOperationTypes["STOP"] = "stop";
    RTMPOperationTypes["PAUSE"] = "pause";
    RTMPOperationTypes["RESUME"] = "resume";
})(RTMPOperationTypes || (RTMPOperationTypes = {}));
function createRTMPCtrl(api) {
    async function operation(type) {
        log$h('operation');
        await api
            .request('setRTMP')
            .data({ operate: type })
            .send();
    }
    function start() {
        log$h('start');
        return operation(RTMPOperationTypes.START);
    }
    function stop() {
        log$h('stop');
        return operation(RTMPOperationTypes.STOP);
    }
    function pause() {
        log$h('pause');
        return operation(RTMPOperationTypes.PAUSE);
    }
    function resume() {
        log$h('resume');
        return operation(RTMPOperationTypes.RESUME);
    }
    return {
        operation,
        start,
        stop,
        pause,
        resume,
    };
}

const log$i = browser('MN:Information:RTMP');
function createRTMP(data, context) {
    const { api } = context;
    const events = createEvents(log$i);
    /* eslint-disable-next-line no-use-before-define */
    const reactive = createReactive(watch({}), events);
    const ctrl = createRTMPCtrl(api);
    let rtmp;
    function watch(target) {
        /* eslint-disable no-use-before-define */
        target.enable = getEnable();
        target.status = getStatus();
        /* eslint-enable no-use-before-define */
        return target;
    }
    function update(diff) {
        // fire status change events
        watch(reactive);
        events.emit('updated', rtmp);
    }
    function getUser(entity) {
        return entity
            ? data.users.find((userdata) => userdata.entity === entity)
            : data.users.find((userdata) => userdata.default) || data.users[0];
    }
    function getEnable() {
        return data['rtmp-enable'];
    }
    function getStatus(entity) {
        const userdata = getUser(entity);
        return userdata && userdata['rtmp-status'];
    }
    function getReason(entity) {
        const userdata = getUser(entity);
        return userdata && userdata.reason;
    }
    function getDetail(entity) {
        const userdata = getUser(entity);
        if (!userdata)
            { return undefined; }
        const { 'rtmp-status': status, 'rtmp-last-start-time': lastStartTime, 'rtmp-last-stop-duration': lastStopDuration, reason, } = userdata;
        return {
            reason,
            status,
            lastStartTime,
            lastStopDuration,
        };
    }
    return rtmp = Object.spread({}, events,
        {get data() {
            return data;
        },
        get(key) {
            return data[key];
        },
        update,
        getEnable,
        getStatus,
        getReason,
        getDetail},
        // rtmp ctrl
        ctrl);
}

const log$j = browser('MN:Information:Record');
var RecordOperationTypes;
(function (RecordOperationTypes) {
    RecordOperationTypes["START"] = "start";
    RecordOperationTypes["STOP"] = "stop";
    RecordOperationTypes["PAUSE"] = "pause";
    RecordOperationTypes["RESUME"] = "resume";
})(RecordOperationTypes || (RecordOperationTypes = {}));
function createRecordCtrl(api) {
    async function operation(type) {
        await api
            .request('setRecord')
            .data({ operate: type })
            .send();
    }
    function start() {
        log$j('start()');
        return operation(RecordOperationTypes.START);
    }
    function stop() {
        log$j('stop()');
        return operation(RecordOperationTypes.STOP);
    }
    function pause() {
        log$j('pause()');
        return operation(RecordOperationTypes.PAUSE);
    }
    function resume() {
        log$j('resume()');
        return operation(RecordOperationTypes.RESUME);
    }
    return {
        operation,
        start,
        stop,
        pause,
        resume,
    };
}

const log$k = browser('MN:Information:Record');
function createRecord(data, context) {
    const { api } = context;
    const events = createEvents(log$k);
    /* eslint-disable-next-line no-use-before-define */
    const reactive = createReactive(watch({}), events);
    const ctrl = createRecordCtrl(api);
    let record;
    function watch(target) {
        /* eslint-disable no-use-before-define */
        target.status = getStatus();
        /* eslint-enable no-use-before-define */
        return target;
    }
    function update(diff) {
        // fire status change events
        watch(reactive);
        events.emit('updated', record);
    }
    function getUser() {
        return data.user;
    }
    function getStatus() {
        return getUser()['record-status'];
    }
    function getReason() {
        return getUser().reason;
    }
    function getDetail() {
        const userdata = getUser();
        const { 'record-status': status, 'record-last-start-time': lastStartTime, 'record-last-stop-duration': lastStopDuration, reason, } = userdata;
        return {
            reason,
            status,
            lastStartTime,
            lastStopDuration,
        };
    }
    return record = Object.spread({}, events,
        {get data() {
            return data;
        },
        get(key) {
            return data[key];
        },
        update,
        getStatus,
        getReason,
        getDetail},
        // record ctrl
        ctrl);
}

const log$l = browser('MN:Information:Item');
function isItem(item) {
    return isDef(item) && isObject$2(item) && !isArray$1(item);
}
function isPartialableItem(item) {
    return isItem(item) && hasOwn(item, 'state');
}
function mergeItemList(rhys, items) {
    log$l('mergelist()');
    for (const item of items) {
        if (!isPartialableItem(item)) {
            log$l('we don not know how to process a non-partialable item in a list, because it is undocumented');
            log$l('treat it as full state item');
        }
        const { id, entity, state = 'full' } = item;
        const key = entity || id;
        if (!key) {
            log$l('missing item identity(entity or id).');
            continue;
        }
        const index = rhys
            .findIndex((it) => it.entity === key || it.id === key);
        log$l('item identity: %o', key);
        // not find
        if (index === -1) {
            if (state === 'deleted') {
                log$l('can not delete item not exist.');
                continue;
            }
            log$l('item added');
            rhys.push(item);
            continue;
        }
        // finded
        // this is weird as we don't know whether the item list is partial or not
        if (state === 'full') {
            rhys.splice(index, 1, item);
            continue;
        }
        // wanna delete
        if (state === 'deleted') {
            log$l('item deleted');
            rhys.splice(index, 1);
            continue;
        }
        // wanna update
        /* eslint-disable-next-line no-use-before-define */
        mergeItem(rhys[index], item);
    }
    return rhys;
}
function mergeItem(rhys, item) {
    log$l('merge()');
    if (rhys === item) {
        return rhys;
    }
    if (!isPartialableItem(item)) {
        return item;
    }
    const { state } = item;
    if (state === 'full') {
        return item;
    }
    if (state === 'deleted') {
        return null;
    }
    if (state !== 'partial') {
        log$l(`Error: unknown item state. ${state}`);
        log$l('use merge policy as "partial"');
    }
    for (const key in item) {
        if (hasOwn(item, key)) {
            const value = item[key];
            const current = rhys[key];
            log$l('item key: %s value: %o -> %o', key, current, value);
            rhys[key] = isArray$1(value)
                ? mergeItemList(current, value)
                : isItem(value)
                    ? mergeItem(current, value)
                    : value;
        }
    }
    return rhys;
}

const log$m = browser('MN:Information');
function createInformation(data, context) {
    const events = createEvents(log$m);
    const { api } = context;
    function createdata(datakey) {
        return new Proxy({}, {
            get(target, key) {
                const delegate = data[datakey];
                return delegate && Reflect.get(delegate, key);
            },
        });
    }
    // create information parts
    const description = createDescription(createdata('conference-description'), context);
    const state = createState(createdata('conference-state'));
    const view = createView(createdata('conference-view'), context);
    const users = createUsers(createdata('users'), context);
    const rtmp = createRTMP(createdata('rtmp-state'), context);
    const record = createRecord(createdata('record-users'), context);
    let information;
    function update(val) {
        log$m('update()');
        const { version } = data;
        const { version: newVersion, state: newState } = val;
        if (!newVersion) {
            log$m('receive information without version.');
            return;
        }
        if (newVersion <= version) {
            log$m('receive information with invalid version.');
            return;
        }
        if (newVersion - version > 1) {
            log$m('information version jumped.');
            api
                .request('getFullInfo')
                .send()
                .then((response) => update(response.data.data))
                .catch((error) => log$m('get full information failed: %o', error));
            return;
        }
        if (newState === 'deleted') {
            log$m('can not delete root information.');
            return;
        }
        if (newState === 'full') {
            // hack item state
            // as we want to keep 'data' reference to the same object
            // otherwise we need to re-create all information parts
            Object.assign(data, val);
        }
        else {
            mergeItem(data, val);
        }
        // update & prepare all parts
        [
            {
                key: 'conference-description',
                part: description,
            },
            {
                key: 'conference-state',
                part: state,
            },
            {
                key: 'conference-view',
                part: view,
            },
            {
                key: 'users',
                part: users,
            },
            {
                key: 'rtmp-state',
                part: rtmp,
            },
            {
                key: 'record-users',
                part: record,
            },
        ].forEach((parts) => {
            const { key, part } = parts;
            if (hasOwn(val, key)) {
                part.update(val[key]);
            }
        });
        events.emit('updated', information);
    }
    return information = Object.spread({}, events,
        {get data() {
            return data;
        },
        get version() {
            return data && data.version;
        },
        get(key) {
            return data[key];
        },
        get description() {
            return description;
        },
        get state() {
            return state;
        },
        get view() {
            return view;
        },
        get users() {
            return users;
        },
        get rtmp() {
            return rtmp;
        },
        get record() {
            return record;
        },
        update});
}

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
function parse$1(sdp) {
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

function closeMediaStream(stream) {
    if (!stream)
        { return; }
    // Latest spec states that MediaStream has no stop() method and instead must
    // call stop() on every MediaStreamTrack.
    try {
        if (stream.getTracks) {
            stream.getTracks().forEach(track => track.stop());
        }
        else {
            stream.getAudioTracks().forEach(track => track.stop());
            stream.getVideoTracks().forEach(track => track.stop());
        }
    }
    catch (error) {
        // Deprecated by the spec, but still in use.
        // NOTE: In Temasys IE plugin stream.stop is a callable 'object'.
        if (typeof stream.stop === 'function' || typeof stream.stop === 'object') {
            stream.stop();
        }
    }
}

function setup$1(stream) {
    stream.close = stream.stop = function close() {
        closeMediaStream(this);
    };
    stream.pause = function pause() {
        this.getTracks().forEach(track => track.enabled = false);
    };
    stream.play = function play() {
        this.getTracks().forEach(track => track.enabled = true);
    };
    stream.muteAudio = function muteAudio(mute = true) {
        this.getAudioTracks().forEach(track => track.enabled = !mute);
    };
    stream.muteVideo = function muteVideo(mute = true) {
        this.getVideoTracks().forEach(track => track.enabled = !mute);
    };
    return stream;
}

async function getUserMedia(constraints) {
    let stream;
    if (navigator.mediaDevices.getUserMedia) {
        stream = await navigator.mediaDevices.getUserMedia(constraints);
    }
    else if (navigator.getUserMedia) {
        // support chrome 52
        stream = await new Promise((resolve, reject) => {
            navigator.getUserMedia(constraints, resolve, reject);
        });
    }
    else {
        throw new Error('Not Supported');
    }
    return setup$1(stream);
}

const MAX_ARCHIVE_SIZE = 10;
function createRTCStats() {
    let quality = -1;
    let inbound = {};
    let outbound = {};
    let archives = [];
    const maxArchiveSize = MAX_ARCHIVE_SIZE;
    let rtcstats;
    function clear() {
        quality = -1;
        inbound = {};
        outbound = {};
        archives = [];
    }
    function update(report) {
        const latestInbound = {};
        const latestOutbound = {};
        let isLegacyStats = false;
        report.forEach((stats) => {
            if (typeof stats.stat === 'function') {
                isLegacyStats = true;
            }
            switch (stats.type) {
                case 'codec':
                    break;
                case 'inbound-rtp':
                    if (!stats.isRemote || stats.isRemote === false) {
                        /* eslint-disable-next-line no-use-before-define */
                        latestInbound[stats.mediaType] = parseRTPStats(report, stats);
                    }
                    break;
                case 'outbound-rtp':
                    if (!stats.isRemote || stats.isRemote === false) {
                        /* eslint-disable-next-line no-use-before-define */
                        latestOutbound[stats.mediaType] = parseRTPStats(report, stats);
                    }
                    break;
                // case 'remote-inbound-rtp':
                //   break;
                // case 'remote-outbound-rtp':
                //   break;
                // case 'csrc':
                //   break;
                // case 'peer-connection':
                //   break;
                // case 'data-channel':
                //   break;
                // case 'stream':
                //   break;
                // case 'track':
                //   break;
                // case 'sender':
                //   break;
                // case 'receiver':
                //   break;
                // case 'transport':
                //   break;
                // case 'candidate-pair':
                //   break;
                // case 'local-candidate':
                //   break;
                // case 'remote-candidate':
                //   break;
                // case 'certificate':
                //   break;
                case 'ssrc':
                    /* eslint-disable-next-line no-use-before-define */
                    parseSSRCStats(report, stats, isLegacyStats);
                    if (/recv/g.test(stats.id)) {
                        latestInbound[stats.mediaType] = stats;
                    }
                    if (/send/g.test(stats.id)) {
                        latestOutbound[stats.mediaType] = stats;
                    }
                    break;
            }
        });
        /* eslint-disable-next-line no-use-before-define */
        updateRTPStats(latestInbound.audio, 'inbound');
        /* eslint-disable-next-line no-use-before-define */
        updateRTPStats(latestInbound.video, 'inbound');
        /* eslint-disable-next-line no-use-before-define */
        updateRTPStats(latestOutbound.audio, 'outbound');
        /* eslint-disable-next-line no-use-before-define */
        updateRTPStats(latestOutbound.video, 'outbound');
        let totalPacketsLostRate = 0;
        let totalChannel = 0;
        if (inbound.audio) {
            totalChannel++;
            totalPacketsLostRate += inbound.audio.packetsLostRate || 0;
        }
        if (inbound.video) {
            totalChannel++;
            totalPacketsLostRate += inbound.video.packetsLostRate || 0;
        }
        if (totalChannel) {
            const average = totalPacketsLostRate / totalChannel;
            quality = average >= 12 ? 0
                : average >= 5 ? 1
                    : average >= 3 ? 2
                        : average >= 2 ? 3
                            : 4;
        }
        /* eslint-disable-next-line no-use-before-define */
        archive();
    }
    function parseRTPStats(report, stats) {
        const codec = report.get(stats.codecId);
        const track = report.get(stats.trackId);
        const transport = report.get(stats.transportId);
        const remote = report.get(stats.remoteId);
        if (codec) {
            codec.name = codec.mimeType.split('/')[1];
        }
        if (!stats.codecId || !stats.trackId || !stats.transportId) ;
        if (transport) {
            const localCertificate = report.get(transport.localCertificateId);
            const remoteCertificate = report.get(transport.remoteCertificateId);
            const selectedCandidatePair = report.get(transport.selectedCandidatePairId);
            transport.localCertificate = localCertificate;
            transport.remoteCertificate = remoteCertificate;
            transport.selectedCandidatePair = selectedCandidatePair;
        }
        if (remote) {
            stats.packetsLost = remote.packetsLost || stats.packetsLost;
        }
        stats.codec = codec;
        stats.track = track;
        stats.transport = transport;
        return stats;
    }
    function parseSSRCStats(report, stats, isLegacyStats = false) {
        if (isLegacyStats) {
            stats.mediaType = stats.stat('mediaType');
            stats.googCodecName = stats.stat('googCodecName');
            stats.codecImplementationName = stats.stat('codecImplementationName');
            stats.googFrameHeightReceived = stats.stat('googFrameHeightReceived');
            stats.googFrameHeightSent = stats.stat('googFrameHeightSent');
            stats.googFrameWidthReceived = stats.stat('googFrameWidthReceived');
            stats.googFrameWidthSent = stats.stat('googFrameWidthSent');
            stats.googFrameRateReceived = stats.stat('googFrameRateReceived');
            stats.googFrameRateSent = stats.stat('googFrameRateSent');
            stats.packetsLost = stats.stat('packetsLost');
            stats.packetsSent = stats.stat('packetsSent');
            stats.packetsReceived = stats.stat('packetsReceived');
            stats.bytesSent = stats.stat('bytesSent');
            stats.bytesReceived = stats.stat('bytesReceived');
        }
        const codec = {
            name: stats.googCodecName,
            implementationName: stats.codecImplementationName,
        };
        const track = {
            frameHeight: stats.googFrameHeightReceived || stats.googFrameHeightSent,
            frameWidth: stats.googFrameWidthReceived || stats.googFrameWidthSent,
            frameRate: stats.googFrameRateReceived || stats.googFrameRateSent,
        };
        stats.codec = codec;
        stats.track = track;
        return stats;
    }
    function updateRTPStats(stats, direction) {
        if (!stats) {
            return;
        }
        const prestats = rtcstats[direction][stats.mediaType];
        const diff = (x = {}, y = {}, key) => {
            if (typeof x[key] !== 'undefined' && typeof y[key] !== 'undefined') {
                return Math.abs(x[key] - y[key]);
            }
            return 0;
        };
        const safe = (x) => {
            if (!Number.isFinite(x)) {
                return 0;
            }
            if (Number.isNaN(x)) {
                return 0;
            }
            return x;
        };
        if (prestats) {
            if (prestats.trackId ? Boolean(stats.trackId) : true) {
                const timeDiff = diff(stats, prestats, 'timestamp');
                let valueDiff;
                // calc packetsLostRate
                if (direction === 'outbound' && !stats.packetsLostRate) {
                    /* eslint-disable-next-line no-use-before-define */
                    const archived = getArchive()[direction][stats.mediaType];
                    const lostDiff = diff(stats, archived, 'packetsLost');
                    const sentDiff = diff(stats, archived, 'packetsSent');
                    const totalPackets = lostDiff + sentDiff;
                    stats.packetsLostRate = totalPackets === 0 ? 0 : safe(lostDiff / totalPackets);
                    stats.packetsLostRate *= 100;
                }
                if (direction === 'inbound' && !stats.packetsLostRate) {
                    /* eslint-disable-next-line no-use-before-define */
                    const archived = getArchive()[direction][stats.mediaType];
                    const lostDiff = diff(stats, archived, 'packetsLost');
                    const receivedDiff = diff(stats, archived, 'packetsReceived');
                    const totalPackets = lostDiff + receivedDiff;
                    stats.packetsLostRate = totalPackets === 0 ? 0 : safe(lostDiff / totalPackets);
                    stats.packetsLostRate *= 100;
                }
                // calc outgoingBitrate
                if (direction === 'outbound' && !stats.outgoingBitrate) {
                    valueDiff = diff(stats, prestats, 'bytesSent');
                    stats.outgoingBitrate = safe(valueDiff * 8 / timeDiff);
                }
                // calc incomingBitrate
                if (direction === 'inbound' && !stats.incomingBitrate) {
                    valueDiff = diff(stats, prestats, 'bytesReceived');
                    stats.incomingBitrate = safe(valueDiff * 8 / timeDiff);
                }
                // calc transport outgoingBitrate
                if (stats.transport && prestats.transport && !stats.transport.outgoingBitrate) {
                    valueDiff = diff(stats.transport, prestats.transport, 'bytesSent');
                    stats.transport.outgoingBitrate = safe(valueDiff * 8 / timeDiff);
                }
                // calc transport incomingBitrate
                if (stats.transport && prestats.transport && !stats.transport.incomingBitrate) {
                    valueDiff = diff(stats.transport, prestats.transport, 'bytesReceived');
                    stats.transport.incomingBitrate = safe(valueDiff * 8 / timeDiff);
                }
                // calc frameRate
                if (stats.mediaType === 'video' && stats.track && prestats.track && !stats.track.frameRate) {
                    if (direction === 'inbound') {
                        valueDiff = diff(stats.track, prestats.track, 'framesReceived');
                    }
                    if (direction === 'outbound') {
                        valueDiff = diff(stats.track, prestats.track, 'framesSent');
                    }
                    stats.track.frameRate = valueDiff ? safe(valueDiff / timeDiff * 1000) : 0;
                }
                rtcstats[direction][stats.mediaType] = stats;
            }
        }
        else {
            rtcstats[direction][stats.mediaType] = stats;
        }
    }
    function archive() {
        if (archives.length === maxArchiveSize) {
            archives.shift();
        }
        archives.push({
            quality,
            inbound,
            outbound,
        });
    }
    function getArchive(index = 0) {
        const { length } = archives;
        index = Math.max(index, 0);
        index = Math.min(index, length - 1);
        return archives[index];
    }
    return rtcstats = {
        get quality() {
            return quality;
        },
        get inbound() {
            return inbound;
        },
        get outbound() {
            return outbound;
        },
        update,
        clear,
    };
}

const log$n = browser('MN:Channel');
const browser$2 = getBrowser();
var STATUS;
(function (STATUS) {
    STATUS[STATUS["kNull"] = 0] = "kNull";
    STATUS[STATUS["kProgress"] = 1] = "kProgress";
    STATUS[STATUS["kOffered"] = 2] = "kOffered";
    STATUS[STATUS["kAnswered"] = 3] = "kAnswered";
    STATUS[STATUS["kAccepted"] = 4] = "kAccepted";
    STATUS[STATUS["kCanceled"] = 5] = "kCanceled";
    STATUS[STATUS["kTerminated"] = 6] = "kTerminated";
})(STATUS || (STATUS = {}));
/**
 * Local variables.
 */
const holdMediaTypes = ['audio', 'video'];
function createChannel(config) {
    const { invite, confirm, cancel, bye, localstream, } = config;
    const events = createEvents(log$n);
    // The RTCPeerConnection instance (public attribute).
    let connection;
    let status = STATUS.kNull;
    let canceled = false;
    const rtcStats = createRTCStats();
    // Default rtcOfferConstraints(passed in connect()).
    let rtcConstraints;
    let rtcOfferConstraints;
    // Local MediaStream.
    let localMediaStream;
    let localMediaStreamLocallyGenerated = false;
    // Flag to indicate PeerConnection ready for new actions.
    let rtcReady = false;
    let startTime;
    let endTime;
    // Mute/Hold state.
    let audioMuted = false;
    let videoMuted = false;
    let localHold = false;
    // there is no in dialog sdp offer, so remote hold is alway false
    const remoteHold = false;
    function throwIfStatus(condition, message) {
        if (status !== condition)
            { return; }
        throw new Error(message || 'Invalid State');
    }
    function throwIfTerminated() {
        const message = 'Terminated';
        if (canceled)
            { throw new Error(message); }
        throwIfStatus(STATUS.kTerminated, message);
    }
    function isInProgress() {
        switch (status) {
            case STATUS.kProgress:
            case STATUS.kOffered:
            case STATUS.kAnswered:
                return true;
            default:
                return false;
        }
    }
    function isEstablished() {
        return status === STATUS.kAccepted;
    }
    function isEnded() {
        switch (status) {
            case STATUS.kCanceled:
            case STATUS.kTerminated:
                return true;
            default:
                return false;
        }
    }
    function getMute() {
        return {
            audio: audioMuted,
            video: videoMuted,
        };
    }
    function getHold() {
        return {
            local: localHold,
            remote: remoteHold,
        };
    }
    function createRTCConnection(rtcConstraints) {
        log$n('createRTCConnection()');
        /* tslint:disable */
        connection = new RTCPeerConnection(rtcConstraints);
        connection.addEventListener('iceconnectionstatechange', () => {
            if (!connection)
                { return; }
            const { iceConnectionState: state, } = connection;
            if (state === 'failed') {
                events.emit('peerconnection:connectionfailed');
                /* eslint-disable-next-line no-use-before-define */
                terminate('RTP Timeout');
            }
        });
        events.emit('peerconnection', connection);
    }
    async function createLocalDescription(type, constraints) {
        log$n('createLocalDescription()');
        rtcReady = false;
        let desc;
        if (type === 'offer') {
            try {
                desc = await connection.createOffer(constraints);
            }
            catch (error) {
                log$n('createOffer failed: %o', error);
                events.emit('peerconnection:createofferfailed', error);
                throw error;
            }
        }
        else if (type === 'answer') {
            try {
                desc = await connection.createAnswer(constraints);
            }
            catch (error) {
                log$n('createAnswer failed: %o', error);
                events.emit('peerconnection:createanswerfailed', error);
                throw error;
            }
        }
        else {
            throw new TypeError('Invalid Type');
        }
        try {
            await connection.setLocalDescription(desc);
        }
        catch (error) {
            log$n('setLocalDescription failed: %o', error);
            rtcReady = true;
            events.emit('peerconnection:setlocaldescriptionfailed', error);
            throw error;
        }
        await new Promise((resolve) => {
            // When remote fingerprint is changed, setRemoteDescription will not restart ice immediately,
            // and iceGatheringState stay complete for a while.
            // We will get a local sdp without ip candidates, if resolve right away.
            // if (type === 'offer' && connection.iceGatheringState === 'complete')
            // Resolve right away if 'pc.iceGatheringState' is 'complete'.
            if (connection.iceGatheringState === 'complete') {
                resolve();
                return;
            }
            let finished = false;
            let listener;
            const ready = () => {
                connection.removeEventListener('icecandidate', listener);
                finished = true;
                resolve();
            };
            connection.addEventListener('icecandidate', listener = (event) => {
                const { candidate } = event;
                if (candidate) {
                    events.emit('icecandidate', {
                        candidate,
                        ready,
                    });
                }
                else if (!finished) {
                    ready();
                }
            });
        });
        rtcReady = true;
        const { sdp } = connection.localDescription;
        desc = {
            originator: 'local',
            type,
            sdp,
        };
        events.emit('sdp', desc);
        return desc.sdp;
    }
    async function connect(options = {}) {
        log$n('connect()');
        throwIfStatus(STATUS.kProgress);
        throwIfStatus(STATUS.kOffered);
        throwIfStatus(STATUS.kAnswered);
        throwIfStatus(STATUS.kAccepted);
        if (!window.RTCPeerConnection) {
            throw new Error('WebRTC not supported');
        }
        status = STATUS.kProgress;
        /* eslint-disable-next-line no-use-before-define */
        onProgress('local');
        events.emit('connecting');
        ({
            rtcConstraints = {
                sdpSemantics: 'plan-b',
                iceServers: [{ urls: 'stun:stun.l.google.com:19302' }],
            },
            rtcOfferConstraints = {
                offerToReceiveAudio: true,
                offerToReceiveVideo: true,
            },
        } = options);
        const { mediaStream, mediaConstraints = {
            audio: true,
            video: true,
        }, } = options;
        createRTCConnection(rtcConstraints);
        if (mediaStream) {
            localMediaStream = mediaStream;
            localMediaStreamLocallyGenerated = false;
        }
        else if (mediaConstraints.audio || mediaConstraints.video) {
            localMediaStream = await getUserMedia(mediaConstraints)
                .catch((error) => {
                /* eslint-disable-next-line no-use-before-define */
                onFailed('local', 'User Denied Media Access');
                log$n('getusermedia failed: %o', error);
                throw error;
            });
            localMediaStreamLocallyGenerated = true;
        }
        throwIfTerminated();
        if (localMediaStream) {
            localMediaStream.getTracks().forEach((track) => {
                connection.addTrack(track, localMediaStream);
            });
            try {
                await localstream(localMediaStream);
            }
            catch (error) {
                // ignore error
            }
        }
        const localSDP = await createLocalDescription('offer', rtcOfferConstraints)
            .catch((error) => {
            /* eslint-disable-next-line no-use-before-define */
            onFailed('local', 'WebRTC Error');
            log$n('createOff|setLocalDescription failed: %o', error);
            throw error;
        });
        throwIfTerminated();
        status = STATUS.kOffered;
        let answer;
        try {
            answer = await invite({ sdp: localSDP, renegotiate: false });
        }
        catch (error) {
            /* eslint-disable-next-line no-use-before-define */
            onFailed('local', 'Request Error');
            log$n('invite failed: %o', error);
            throw error;
        }
        throwIfTerminated();
        status = STATUS.kAnswered;
        const { sdp: remoteSDP, } = answer;
        const desc = {
            originator: 'remote',
            type: 'answer',
            sdp: remoteSDP,
        };
        events.emit('sdp', desc);
        if (connection.signalingState === 'stable') {
            try {
                const offer = await connection.createOffer();
                await connection.setLocalDescription(offer);
            }
            catch (error) {
                /* eslint-disable-next-line no-use-before-define */
                onFailed('local', 'WebRTC Error');
                log$n('createOff|setLocalDescription failed: %o', error);
                await bye();
                throw error;
            }
        }
        try {
            await connection.setRemoteDescription({
                type: 'answer',
                sdp: desc.sdp,
            });
        }
        catch (error) {
            /* eslint-disable-next-line no-use-before-define */
            onFailed('remote', 'Bad Media Description');
            events.emit('peerconnection:setremotedescriptionfailed', error);
            log$n('setRemoteDescription failed: %o', error);
            await bye();
            throw error;
        }
        try {
            await confirm();
        }
        catch (error) {
            /* eslint-disable-next-line no-use-before-define */
            onFailed('local', 'Request Error');
            log$n('confirm failed: %o', error);
            throw error;
        }
        status = STATUS.kAccepted;
        /* eslint-disable-next-line no-use-before-define */
        onAccepted('local');
        events.emit('connected');
    }
    async function terminate(reason) {
        log$n('terminate()');
        switch (status) {
            case STATUS.kNull:
            case STATUS.kTerminated:
                // nothing to do
                break;
            case STATUS.kProgress:
            case STATUS.kOffered:
                log$n('canceling channel');
                if (status === STATUS.kOffered) {
                    await cancel(reason);
                }
                else {
                    canceled = true;
                }
                status = STATUS.kCanceled;
                /* eslint-disable-next-line no-use-before-define */
                onFailed('local', reason || 'Canceled');
                break;
            case STATUS.kAnswered:
            case STATUS.kAccepted:
                await bye(reason);
                /* eslint-disable-next-line no-use-before-define */
                onEnded('local', reason || 'Terminated');
                break;
        }
    }
    function close() {
        log$n('close()');
        if (status === STATUS.kTerminated)
            { return; }
        if (connection) {
            try {
                connection.close();
                connection = undefined;
            }
            catch (error) {
                log$n('error closing RTCPeerConnection %o', error);
            }
        }
        /* eslint-disable-next-line no-use-before-define */
        maybeCloseLocalMediaStream();
        localMediaStream = undefined;
        localMediaStreamLocallyGenerated = false;
        rtcStats.clear();
        status = STATUS.kTerminated;
    }
    function toggleMuteAudio(mute) {
        connection.getSenders().forEach((sender) => {
            if (sender.track && sender.track.kind === 'audio') {
                sender.track.enabled = !mute;
            }
        });
    }
    function toggleMuteVideo(mute) {
        connection.getSenders().forEach((sender) => {
            if (sender.track && sender.track.kind === 'video') {
                sender.track.enabled = !mute;
            }
        });
    }
    function setLocalMediaStatus() {
        let enableAudio = true;
        let enableVideo = true;
        if (localHold || (remoteHold )) {
            enableAudio = false;
            enableVideo = false;
        }
        if (audioMuted) {
            enableAudio = false;
        }
        if (videoMuted) {
            enableVideo = false;
        }
        toggleMuteAudio(!enableAudio);
        toggleMuteVideo(!enableVideo);
    }
    function maybeCloseLocalMediaStream() {
        if (localMediaStream && localMediaStreamLocallyGenerated) {
            closeMediaStream(localMediaStream);
            localMediaStream = undefined;
            localMediaStreamLocallyGenerated = false;
        }
    }
    function onProgress(originator, message) {
        log$n('channel progress');
        events.emit('progress', {
            originator,
            message,
        });
    }
    function onAccepted(originator, message) {
        log$n('channel accepted');
        events.emit('accepted', {
            originator,
            message,
        });
        startTime = new Date();
    }
    function onEnded(originator, message) {
        log$n('channel ended');
        endTime = new Date();
        close();
        events.emit('ended', {
            originator,
            message,
        });
    }
    function onFailed(originator, message) {
        log$n('channel failed');
        close();
        events.emit('failed', {
            originator,
            message,
        });
    }
    function onMute() {
        setLocalMediaStatus();
        events.emit('mute', {
            audio: audioMuted,
            video: videoMuted,
        });
    }
    function onUnMute() {
        setLocalMediaStatus();
        events.emit('unmute', {
            audio: !audioMuted,
            video: !videoMuted,
        });
    }
    function onHold(originator) {
        setLocalMediaStatus();
        events.emit('hold', {
            originator,
            localHold,
            remoteHold,
        });
    }
    function onUnHold(originator) {
        setLocalMediaStatus();
        events.emit('unhold', {
            originator,
            localHold,
            remoteHold,
        });
    }
    function mute(options = { audio: true, video: false }) {
        log$n('mute()');
        let changed = false;
        if (audioMuted === false && options.audio) {
            changed = true;
            audioMuted = true;
        }
        if (videoMuted === false && options.video) {
            changed = true;
            videoMuted = true;
        }
        if (changed) {
            onMute();
        }
    }
    function unmute(options = { audio: true, video: true }) {
        log$n('unmute()');
        let changed = false;
        if (audioMuted === true && options.audio) {
            changed = true;
            audioMuted = false;
        }
        if (videoMuted === true && options.video) {
            changed = true;
            videoMuted = false;
        }
        if (changed) {
            onUnMute();
        }
    }
    async function hold() {
        log$n('unhold()');
        if (localHold) {
            log$n('Already hold');
            return;
        }
        localHold = true;
        onHold('local');
        /* eslint-disable-next-line no-use-before-define */
        await renegotiate();
    }
    async function unhold() {
        log$n('unhold()');
        if (!localHold) {
            log$n('Already unhold');
            return;
        }
        localHold = false;
        onUnHold('local');
        /* eslint-disable-next-line no-use-before-define */
        await renegotiate();
    }
    async function renegotiate(options = {}) {
        log$n('renegotiate()');
        if (!rtcReady) {
            log$n('RTC not ready');
            return;
        }
        const localSDP = await createLocalDescription('offer', rtcOfferConstraints);
        /* eslint-disable-next-line no-use-before-define */
        const answer = await invite({ sdp: mangleOffer(localSDP), renegotiate: true });
        const desc = {
            originator: 'remote',
            type: 'answer',
            sdp: answer.sdp,
        };
        events.emit('sdp', desc);
        try {
            connection.setRemoteDescription({
                type: 'answer',
                sdp: desc.sdp,
            });
        }
        catch (error) {
            events.emit('peerconnection:setremotedescriptionfailed', error);
            throw error;
        }
        try {
            await confirm();
        }
        catch (error) {
            /* eslint-disable-next-line no-use-before-define */
            onFailed('local', 'Request Error');
            log$n('confirm failed: %o', error);
            throw error;
        }
    }
    function mangleOffer(offer) {
        log$n('mangleOffer()');
        // nothing to do
        if (!localHold && !remoteHold)
            { return offer; }
        const sdp = parse$1(offer);
        // Local hold.
        if (localHold && !remoteHold) {
            for (const m of sdp.media) {
                if (holdMediaTypes.indexOf(m.type) === -1) {
                    continue;
                }
                if (!m.direction) {
                    m.direction = 'sendonly';
                }
                else if (m.direction === 'sendrecv') {
                    m.direction = 'sendonly';
                }
                else if (m.direction === 'recvonly') {
                    m.direction = 'inactive';
                }
            }
            // Local and remote hold.
        }
        else if (localHold && remoteHold) {
            for (const m of sdp.media) {
                if (holdMediaTypes.indexOf(m.type) === -1) {
                    continue;
                }
                m.direction = 'inactive';
            }
            // Remote hold.
        }
        return write(sdp);
    }
    function getRemoteStream() {
        log$n('getRemoteStream()');
        let stream;
        // @ts-ignore
        if (connection.getReceivers) {
            stream = new window.MediaStream();
            connection
                .getReceivers()
                .forEach((receiver) => {
                const { track } = receiver;
                if (track) {
                    stream.addTrack(track);
                }
            });
        }
        else if (connection.getRemoteStreams) {
            stream = connection.getRemoteStreams()[0];
        }
        return stream;
    }
    function getLocalStream() {
        log$n('getLocalStream()');
        let stream;
        // @ts-ignore
        if (connection.getSenders) {
            stream = new window.MediaStream();
            connection
                .getSenders()
                .forEach((sender) => {
                const { track } = sender;
                if (track) {
                    stream.addTrack(track);
                }
            });
        }
        else if (connection.getLocalStreams) {
            stream = connection.getLocalStreams()[0];
        }
        return stream;
    }
    function addLocalStream(stream) {
        log$n('addLocalStream()');
        if (!stream)
            { return; }
        // @ts-ignore
        if (connection.addTrack) {
            stream
                .getTracks()
                .forEach((track) => {
                connection.addTrack(track, stream);
            });
        }
        else if (connection.addStream) {
            connection.addStream(stream);
        }
    }
    function removeLocalStream() {
        log$n('removeLocalStream()');
        if (connection.getSenders && connection.removeTrack) {
            connection.getSenders().forEach((sender) => {
                connection.removeTrack(sender);
            });
        }
        else if (connection.getLocalStreams && connection.removeStream) {
            connection
                .getLocalStreams()
                .forEach((stream) => {
                connection.removeStream(stream);
            });
        }
    }
    async function replaceLocalStream(stream, renegotiation = false) {
        log$n('replaceLocalStream()');
        const audioTrack = stream ? stream.getAudioTracks()[0] : null;
        const videoTrack = stream ? stream.getVideoTracks()[0] : null;
        const queue = [];
        let renegotiationNeeded = false;
        let peerHasAudio = false;
        let peerHasVideo = false;
        // @ts-ignore
        if (connection.getSenders) {
            connection.getSenders().forEach((sender) => {
                if (!sender.track)
                    { return; }
                peerHasAudio = sender.track.kind === 'audio' || peerHasAudio;
                peerHasVideo = sender.track.kind === 'video' || peerHasVideo;
            });
            renegotiationNeeded = (Boolean(audioTrack) !== peerHasAudio)
                || (Boolean(videoTrack) !== peerHasVideo)
                || renegotiation;
            /* eslint-disable-next-line no-use-before-define */
            maybeCloseLocalMediaStream();
            if (renegotiationNeeded) {
                removeLocalStream();
                addLocalStream(stream);
                queue.push(renegotiate());
            }
            else {
                connection.getSenders().forEach((sender) => {
                    if (!sender.track)
                        { return; }
                    if (!sender.replaceTrack
                        && !(sender.prototype && sender.prototype.replaceTrack)) {
                        /* eslint-disable-next-line no-use-before-define */
                        shimReplaceTrack(sender);
                    }
                    if (audioTrack && sender.track.kind === 'audio') {
                        queue.push(sender.replaceTrack(audioTrack)
                            .catch((e) => {
                            log$n('replace audio track error: %o', e);
                        }));
                    }
                    if (videoTrack && sender.track.kind === 'video') {
                        queue.push(sender.replaceTrack(videoTrack)
                            .catch((e) => {
                            log$n('replace video track error: %o', e);
                        }));
                    }
                });
            }
        }
        function shimReplaceTrack(sender) {
            sender.replaceTrack = async function replaceTrack(newTrack) {
                connection.removeTrack(sender);
                connection.addTrack(newTrack, stream);
                const offer = await connection.createOffer();
                offer.type = connection.localDescription.type;
                /* eslint-disable-next-line no-use-before-define */
                offer.sdp = replaceSSRCs(connection.localDescription.sdp, offer.sdp);
                await connection.setLocalDescription(offer);
                await connection.setRemoteDescription(connection.remoteDescription);
            };
        }
        await Promise.all(queue)
            .finally(async () => {
            localMediaStream = getLocalStream();
            localMediaStreamLocallyGenerated = false;
        });
        try {
            await localstream(localMediaStream);
        }
        catch (error) {
            // ignore error
        }
    }
    function replaceSSRCs(currentDescription, newDescription) {
        let ssrcs = currentDescription.match(/a=ssrc-group:FID (\d+) (\d+)\r\n/);
        let newssrcs = newDescription.match(/a=ssrc-group:FID (\d+) (\d+)\r\n/);
        if (!ssrcs) { // Firefox offers wont have FID yet
            ssrcs = currentDescription.match(/a=ssrc:(\d+) cname:(.*)\r\n/g)[1]
                .match(/a=ssrc:(\d+)/);
            newssrcs = newDescription.match(/a=ssrc:(\d+) cname:(.*)\r\n/g)[1]
                .match(/a=ssrc:(\d+)/);
        }
        for (let i = 1; i < ssrcs.length; i++) {
            newDescription = newDescription.replace(new RegExp(newssrcs[i], 'g'), ssrcs[i]);
        }
        return newDescription;
    }
    async function adjustBandWidth(options) {
        log$n('adjustBandWidth()');
        const { audio, video } = options;
        const queue = [];
        if ('RTCRtpSender' in window
            && 'setParameters' in window.RTCRtpSender.prototype) {
            connection.getSenders().forEach((sender) => {
                if (sender.track)
                    { return; }
                const parameters = sender.getParameters();
                if (typeof audio !== 'undefined' && sender.track.kind === 'audio') {
                    if (audio === 0) {
                        delete parameters.encodings[0].maxBitrate;
                    }
                    else {
                        parameters.encodings[0].maxBitrate = audio * 1024;
                    }
                    queue.push(sender.setParameters(parameters)
                        .catch((e) => {
                        log$n('apply audio parameters error: %o', e);
                    }));
                }
                if (typeof video !== 'undefined' && sender.track.kind === 'video') {
                    if (video === 0) {
                        delete parameters.encodings[0].maxBitrate;
                    }
                    else {
                        parameters.encodings[0].maxBitrate = video * 1024;
                    }
                    queue.push(sender.setParameters(parameters)
                        .catch((e) => {
                        log$n('apply video parameters error: %o', e);
                    }));
                }
            });
        }
        else {
            // Fallback to the SDP munging with local renegotiation way of limiting
            // the bandwidth.
            queue.push(connection.createOffer()
                .then((offer) => connection.setLocalDescription(offer))
                .then(() => {
                const sdp = parse$1(connection.remoteDescription.sdp);
                for (const m of sdp.media) {
                    if (typeof audio !== 'undefined' && m.type === 'audio') {
                        if (audio === 0) {
                            m.bandwidth = [];
                        }
                        else {
                            m.bandwidth = [
                                {
                                    type: 'TIAS',
                                    limit: Math.ceil(audio * 1024),
                                },
                            ];
                        }
                    }
                    if (typeof video !== 'undefined' && m.type === 'video') {
                        if (video === 0) {
                            m.bandwidth = [];
                        }
                        else {
                            m.bandwidth = [
                                {
                                    type: 'TIAS',
                                    limit: Math.ceil(video * 1024),
                                },
                            ];
                        }
                    }
                }
                const desc = {
                    type: connection.remoteDescription.type,
                    sdp: write(sdp),
                };
                return connection.setRemoteDescription(desc);
            })
                .catch((e) => {
                log$n('applying bandwidth restriction to setRemoteDescription error: %o', e);
            }));
        }
        await Promise.all(queue);
    }
    async function applyConstraints(options) {
        log$n('applyConstraints()');
        const { audio, video } = options;
        const queue = [];
        if (connection.getSenders && window.MediaStreamTrack.prototype.applyConstraints) {
            connection.getSenders().forEach((sender) => {
                if (audio && sender.track && sender.track.kind === 'audio') {
                    queue.push(sender.track.applyConstraints(audio)
                        .catch((e) => {
                        log$n('apply audio constraints error: %o', e);
                    }));
                }
                if (video && sender.track && sender.track.kind === 'video') {
                    queue.push(sender.track.applyConstraints(video)
                        .catch((e) => {
                        log$n('apply video constraints error: %o', e);
                    }));
                }
            });
        }
        await Promise.all(queue);
    }
    async function getStats() {
        log$n('getStats()');
        if (connection.signalingState === 'stable') {
            let stats;
            // use legacy getStats()
            // the new getStats() won't report 'packetsLost' in 'outbound-rtp'
            if (browser$2.chrome) {
                stats = await new Promise((resolve) => {
                    connection.getStats((stats) => {
                        resolve(stats.result());
                    });
                });
            }
            else {
                stats = await connection.getStats();
            }
            rtcStats.update(stats);
        }
        else {
            log$n('update rtc stats failed since connection is unstable.');
        }
        return rtcStats;
    }
    const getConnectOptions = () => {
        return {
            rtcConstraints,
            rtcOfferConstraints,
            localMediaStream,
            localMediaStreamLocallyGenerated,
        };
    };
    return Object.spread({}, events,
        {get status() {
            return status;
        },
        get connection() {
            return connection;
        },
        get startTime() {
            return startTime;
        },
        get endTime() {
            return endTime;
        },
        getConnectOptions,
        isInProgress,
        isEstablished,
        isEnded,
        getMute,
        getHold,
        connect,
        terminate,
        renegotiate,
        mute,
        unmute,
        hold,
        unhold,
        getRemoteStream,
        getLocalStream,
        replaceLocalStream,
        adjustBandWidth,
        applyConstraints,
        getStats});
}

const log$o = browser('MN:SDP');
const browser$3 = getBrowser();
function createModifier() {
    let content = 'main';
    let width = 1920;
    let height = 1080;
    let frameRate = 30;
    let highFrameRate = false;
    let prefer;
    let unsupport;
    let modifier;
    function build() {
        return (data) => {
            const { originator, type } = data;
            const sdp = parse$1(data.sdp);
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
            for (const m of sdp.media) {
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
                            type: 'TIAS',
                            limit: Math.ceil(bandwidth * 1024),
                        },
                    ];
                    const vp8Payloads = new Set();
                    const h264Payloads = new Set();
                    const vp8Config = [`max-fr=${maxFrameRate}`, `max-fs=${maxFrameSize}`];
                    const h264Config = [`max-mbps=${maxMbps}`, `max-fs=${maxFrameSize}`];
                    // find codec payload
                    for (const r of m.rtp) {
                        const codec = r.codec.toUpperCase();
                        let fmtp;
                        switch (codec) {
                            case 'VP8':
                            case 'VP9':
                                vp8Payloads.add(Number(r.payload));
                                fmtp = m.fmtp.find((f) => (f.payload === r.payload));
                                if (fmtp) {
                                    fmtp.config = fmtp.config.split(';')
                                        .filter((p) => { return !(/^max-fr/.test(p) || /^max-fs/.test(p)); })
                                        .concat(vp8Config)
                                        .join(';');
                                }
                                else {
                                    m.fmtp.push({
                                        payload: r.payload,
                                        config: vp8Config.join(';'),
                                    });
                                }
                                break;
                            case 'H264':
                                h264Payloads.add(Number(r.payload));
                                fmtp = m.fmtp.find((f) => (f.payload === r.payload));
                                if (fmtp) {
                                    if (highFrameRate
                                        && fmtp.config.indexOf('profile-level-id=42e01f') !== -1
                                        && originator === 'local'
                                        && type === 'offer') {
                                        fmtp.config = fmtp.config.split(';')
                                            .filter((p) => { return !(/^max-mbps/.test(p) || /^max-fs/.test(p) || /^profile-level-id/.test(p)); })
                                            .concat(['profile-level-id=64001f'])
                                            .concat(h264Config)
                                            .join(';');
                                    }
                                    else if (highFrameRate
                                        && fmtp.config.indexOf('profile-level-id=64001f') !== -1
                                        && originator === 'remote'
                                        && type === 'answer') {
                                        fmtp.config = fmtp.config.split(';')
                                            .filter((p) => { return !(/^max-mbps/.test(p) || /^max-fs/.test(p) || /^profile-level-id/.test(p)); })
                                            .concat(['profile-level-id=42e01f'])
                                            .concat(h264Config)
                                            .join(';');
                                    }
                                    else {
                                        fmtp.config = fmtp.config.split(';')
                                            .filter((p) => { return !(/^max-mbps/.test(p) || /^max-fs/.test(p)); })
                                            .concat(h264Config)
                                            .join(';');
                                    }
                                }
                                else {
                                    m.fmtp.push({
                                        payload: r.payload,
                                        config: h264Config.join(';'),
                                    });
                                }
                                break;
                        }
                    }
                    for (const f of m.fmtp) {
                        const aptConfig = f.config
                            .split(';')
                            .find((p) => { return /^apt=/.test(p); });
                        if (!aptConfig) {
                            continue;
                        }
                        const apt = aptConfig.split('=')[1];
                        if (vp8Payloads.has(Number(apt))) {
                            vp8Payloads.add(Number(f.payload));
                        }
                        else if (h264Payloads.has(Number(apt))) {
                            h264Payloads.add(Number(f.payload));
                        }
                    }
                    let preferCodec = prefer === 'vp8'
                        ? vp8Payloads
                        : prefer === 'h264'
                            ? h264Payloads
                            : new Set();
                    const unsupportCodec = unsupport === 'vp8'
                        ? vp8Payloads
                        : unsupport === 'h264'
                            ? h264Payloads
                            : new Set();
                    // firefox do not support multiple h264 codec/decode insts
                    // when content sharing or using multiple tab, codec/decode might be error.
                    // and chrome ver58 has a really low resolution in h264 codec when content sharing.
                    // use VP8/VP9 first
                    if (browser$3.firefox
                        || (browser$3.chrome && parseInt(browser$3.version, 10) < 63 && content === 'slides')) {
                        preferCodec = vp8Payloads;
                    }
                    if (!preferCodec.size || !unsupportCodec.size) {
                        let payloads = String(m.payloads).split(' ');
                        payloads = payloads.filter((p) => { return !preferCodec.has(Number(p)); });
                        payloads = payloads.filter((p) => { return !unsupportCodec.has(Number(p)); });
                        payloads = Array.from(preferCodec)
                            .sort((x, y) => (x - y))
                            .concat(payloads);
                        m.rtp = m.rtp.filter((r) => !unsupportCodec.has(Number(r.payload)));
                        m.fmtp = m.fmtp.filter((r) => !unsupportCodec.has(Number(r.payload)));
                        const rtps = [];
                        const fmtps = [];
                        payloads.forEach((p) => {
                            const rtp = m.rtp.find((r) => r.payload === Number(p));
                            const fmtp = m.fmtp.find((f) => f.payload === Number(p));
                            if (rtp)
                                { rtps.push(rtp); }
                            if (fmtp)
                                { fmtps.push(fmtp); }
                        });
                        m.rtp = rtps;
                        m.fmtp = fmtps;
                        m.payloads = payloads.join(' ');
                    }
                }
                if (m.type === 'audio') {
                    m.bandwidth = [
                        {
                            type: 'TIAS',
                            limit: Math.ceil(128 * 1024),
                        },
                    ];
                }
            }
            // filter out unsupported application media
            sdp.media = sdp.media.filter((m) => m.type !== 'application' || /TLS/.test(m.protocol));
            if (originator === 'remote') {
                sdp.media.forEach((m) => {
                    const payloads = String(m.payloads).split(' ');
                    if (m.rtcpFb) {
                        const rtcpFb = [];
                        m.rtcpFb.forEach((fb) => {
                            if (fb.payload === '*' || payloads.includes(`${fb.payload}`)) {
                                rtcpFb.push(fb);
                            }
                        });
                        m.rtcpFb = rtcpFb;
                    }
                    if (m.fmtp) {
                        const fmtp = [];
                        m.fmtp.forEach((fm) => {
                            if (fm.payload === '*' || payloads.includes(`${fm.payload}`)) {
                                fmtp.push(fm);
                            }
                        });
                        m.fmtp = fmtp;
                    }
                    if (m.rtp) {
                        const rtp = [];
                        m.rtp.forEach((r) => {
                            if (r.payload === '*' || payloads.includes(`${r.payload}`)) {
                                rtp.push(r);
                            }
                        });
                        m.rtp = rtp;
                    }
                });
                if (type === 'offer' && browser$3.firefox) {
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
            log$o(`${originator} sdp: \n\n %s \n`, data.sdp);
        };
    }
    return modifier = {
        content(val) {
            content = val;
            return modifier;
        },
        width(val) {
            width = val;
            return modifier;
        },
        height(val) {
            height = val;
            return modifier;
        },
        frameRate(val) {
            frameRate = val;
            return modifier;
        },
        highFrameRate(val) {
            highFrameRate = val;
            return modifier;
        },
        prefer(val) {
            prefer = val;
            return modifier;
        },
        unsupport(val) {
            unsupport = val;
            return modifier;
        },
        build,
    };
}

const log$p = browser('MN:MediaChannel');
function createMediaChannel(config) {
    const { api, type = 'main' } = config;
    let mediaVersion;
    let callId;
    let request;
    let icetimmeout;
    let localstream;
    let remotestream;
    const channel = createChannel({
        invite: async (offer) => {
            log$p('invite()');
            let { sdp } = offer;
            const apiName = offer.renegotiate
                ? type === 'main'
                    ? 'renegMedia'
                    : 'renegShare'
                : type === 'main'
                    ? 'joinMedia'
                    : 'joinShare';
            request = api
                .request(apiName)
                .data({
                sdp,
                'media-version': mediaVersion,
            });
            const response = await request.send();
            ({
                sdp,
                'media-version': mediaVersion = mediaVersion,
                'mcu-callid': callId = callId,
            } = response.data.data);
            log$p('MCU call-id: %s', callId);
            return { sdp };
        },
        confirm: () => {
            log$p('confirm()');
            request = undefined;
            // send confirm
        },
        cancel: () => {
            log$p('cancel()');
            request && request.cancel();
            request = undefined;
            mediaVersion = undefined;
        },
        bye: () => {
            log$p('bye()');
            request = undefined;
            mediaVersion = undefined;
        },
        localstream: (stream) => {
            localstream = stream;
            channel.emit('localstream', localstream);
        },
    });
    channel.on('sdp', (data) => {
        if (data.originator === 'local') {
            createModifier()
                .content(type)
                .prefer('h264')
                .build()(data);
            return;
        }
        log$p(`${data.originator} sdp: \n\n %s \n`, data.sdp);
    });
    channel.on('peerconnection', (pc) => {
        pc.addEventListener('connectionstatechange', () => {
            log$p('peerconnection:connectionstatechange : %s', pc.connectionState);
        });
        pc.addEventListener('iceconnectionstatechange', () => {
            log$p('peerconnection:iceconnectionstatechange : %s', pc.iceConnectionState);
        });
        pc.addEventListener('icegatheringstatechange', () => {
            log$p('peerconnection:icegatheringstatechange : %s', pc.iceGatheringState);
        });
        pc.addEventListener('negotiationneeded', () => {
            log$p('peerconnection:negotiationneeded');
            channel.emit('negotiationneeded');
        });
        pc.addEventListener('track', (event) => {
            log$p('peerconnection:track: %o', event);
            remotestream = event.streams[0];
            channel.emit('remotestream', remotestream);
        });
        // for old browser(firefox)
        pc.addEventListener('addstream', (event) => {
            log$p('peerconnection:addstream: %o', event);
            remotestream = event.stream;
            channel.emit('remotestream', remotestream);
        });
        pc.addEventListener('removestream', (event) => {
            log$p('peerconnection:removestream: %o', event);
            remotestream = channel.getRemoteStream();
            channel.emit('removestream', remotestream);
        });
    });
    channel.on('icecandidate', (data) => {
        const { candidate, ready } = data;
        if (icetimmeout) {
            clearTimeout(icetimmeout);
            icetimmeout = undefined;
        }
        if (candidate) {
            icetimmeout = setTimeout(() => {
                log$p('ICE gathering timeout in 3 seconds');
                ready();
            }, 3000);
        }
    });
    return Object.spread({}, channel,
        {get status() {
            return channel.status;
        },
        get connection() {
            return channel.connection;
        },
        get startTime() {
            return channel.startTime;
        },
        get endTime() {
            return channel.endTime;
        },
        get version() {
            return mediaVersion;
        },
        get callId() {
            return callId;
        }});
}

var MessageStatus;
(function (MessageStatus) {
    MessageStatus[MessageStatus["kNull"] = 0] = "kNull";
    MessageStatus[MessageStatus["kSending"] = 1] = "kSending";
    MessageStatus[MessageStatus["kSuccess"] = 2] = "kSuccess";
    MessageStatus[MessageStatus["kFailed"] = 3] = "kFailed";
})(MessageStatus || (MessageStatus = {}));
const log$q = browser('MN:Message');
function createMessage(config) {
    const { api } = config;
    const events = createEvents(log$q);
    let status = MessageStatus.kNull;
    let direction = 'outgoing';
    let timestamp;
    let version;
    /* eslint-disable-next-line prefer-destructuring */
    let content = config.content;
    /* eslint-disable-next-line prefer-destructuring */
    let sender = config.sender;
    let receiver;
    let isPrivate = false;
    let message;
    let request;
    async function send(target) {
        log$q('send()');
        if (direction === 'incoming')
            { throw new Error('Invalid Status'); }
        status = MessageStatus.kSending;
        events.emit('sending', message);
        request = api
            .request('pushMessage')
            .data({
            'im-context': message.content,
            'user-entity-list': target,
        });
        let response;
        try {
            response = await request.send();
        }
        catch (error) {
            status = MessageStatus.kFailed;
            events.emit('failed', message);
            throw error;
        }
        const { data } = response;
        receiver = target;
        ({
            'im-version': version,
            'im-timestamp': timestamp,
        } = data.data);
        status = MessageStatus.kSuccess;
        events.emit('succeeded', message);
    }
    async function retry() {
        log$q('retry()');
        if (!content)
            { throw new Error('Invalid Message'); }
        await send(receiver);
    }
    function cancel() {
        log$q('cancel()');
        if (request) {
            request.cancel();
            request = undefined;
        }
    }
    function incoming(data) {
        direction = 'incoming';
        content = data['im-context'];
        timestamp = data['im-timestamp'];
        version = data['im-version'];
        isPrivate = data['is-private'];
        sender = {
            entity: data['sender-entity'],
            subjectId: data['sender-subject-id'],
            displayText: data['sender-display-text'],
        };
        return message;
    }
    return message = Object.spread({}, events,
        {get status() {
            return status;
        },
        get direction() {
            return direction;
        },
        get content() {
            return content;
        },
        get timestamp() {
            return timestamp;
        },
        get version() {
            return version;
        },
        get sender() {
            return sender;
        },
        get receiver() {
            return receiver;
        },
        get private() {
            return (receiver && receiver.length > 0) || isPrivate;
        },
        send,
        retry,
        cancel,
        incoming});
}

const log$r = browser('MN:ChatChannel');
function createChatChannel(config) {
    const { api, sender } = config;
    const events = createEvents(log$r);
    let messages = [];
    let request;
    let ready = false;
    async function connect(count = 2000) {
        log$r('connect()');
        if (ready)
            { return; }
        request = api.request('pullMessage').data({ count });
        const response = await request.send();
        const { data } = response.data;
        messages = data.imInfos
            .map((msg) => {
            return createMessage({ api }).incoming(msg);
        });
        ready = true;
        events.emit('ready');
        events.emit('connected');
    }
    async function terminate() {
        log$r('terminate()');
        messages = [];
        ready = false;
        if (request) {
            request.cancel();
            request = undefined;
        }
        events.emit('disconnected');
    }
    async function sendMessage(content, target) {
        log$r('sendMessage()');
        const message = createMessage({ api, content, sender });
        events.emit('message', {
            originator: 'local',
            message,
        });
        await message.send(target);
        messages.push(message);
        return message;
    }
    function incoming(data) {
        log$r('incoming()');
        const message = createMessage({ api }).incoming(data);
        events.emit('message', {
            originator: 'remote',
            message,
        });
        messages.push(message);
        return message;
    }
    return Object.spread({}, events,
        {get ready() {
            return ready;
        },
        get messages() {
            return messages;
        },
        connect,
        terminate,
        sendMessage,
        incoming});
}

const log$s = browser('MN:Conference');
const miniprogram = isMiniProgram();
const browser$4 = getBrowser();
var STATUS$1;
(function (STATUS) {
    STATUS[STATUS["kNull"] = 0] = "kNull";
    STATUS[STATUS["kConnecting"] = 1] = "kConnecting";
    STATUS[STATUS["kConnected"] = 2] = "kConnected";
    STATUS[STATUS["kDisconnecting"] = 3] = "kDisconnecting";
    STATUS[STATUS["kDisconnected"] = 4] = "kDisconnected";
})(STATUS$1 || (STATUS$1 = {}));
function createConference(config) {
    const { api } = config;
    const events = createEvents(log$s);
    let keepalive;
    let polling;
    let information;
    let interceptor;
    let conference;
    let mediaChannel;
    let shareChannel;
    let chatChannel;
    let user; // current user
    let status = STATUS$1.kNull;
    let uuid;
    let userId; // as conference entity
    let url;
    let request; // request chain
    let trtc;
    function getCurrentUser() {
        if (!user) {
            // try to get current user
            user = information.users.getCurrent();
            if (user) {
                events.emit('user', user);
                /* eslint-disable-next-line no-use-before-define */
                user.on('holdChanged', maybeChat);
            }
        }
        return user;
    }
    function throwIfStatus(condition, message) {
        if (status !== condition)
            { return; }
        throw new Error(message || 'Invalid State');
    }
    function throwIfNotStatus(condition, message) {
        if (status === condition)
            { return; }
        throw new Error(message || 'Invalid State');
    }
    function onConnecting() {
        log$s('conference connecting');
        status = STATUS$1.kConnecting;
        events.emit('connecting');
    }
    function onConnected() {
        log$s('conference connected');
        /* eslint-disable-next-line no-use-before-define */
        setup();
        status = STATUS$1.kConnected;
        events.emit('connected');
    }
    function onDisconnecting() {
        log$s('conference disconnecting');
        status = STATUS$1.kDisconnecting;
        events.emit('disconnecting');
    }
    function onDisconnected(data) {
        log$s('conference disconnected');
        /* eslint-disable-next-line no-use-before-define */
        cleanup();
        status = STATUS$1.kDisconnected;
        events.emit('disconnected', data);
    }
    function onAccepted() {
        log$s('conference accepted');
        events.emit('accepted');
    }
    async function maybeChat() {
        if (!chatChannel)
            { return; }
        if (chatChannel.ready)
            { return; }
        await chatChannel.connect().catch(() => { });
    }
    async function retryChannel(channel) {
        if (status !== STATUS$1.kConnected) {
            log$s('retry channel in wrong conference status: %s', status);
            return;
        }
        const { localMediaStream, rtcConstraints, rtcOfferConstraints } = channel.getConnectOptions();
        await channel.terminate('Retry');
        await channel.connect({ rtcConstraints, rtcOfferConstraints, mediaStream: localMediaStream });
    }
    async function join(options = {}) {
        log$s('join()');
        throwIfNotStatus(STATUS$1.kNull);
        if (!options.url && !options.number) {
            throw new TypeError('Invalid Number');
        }
        status = STATUS$1.kConnecting;
        onConnecting();
        let response;
        let data;
        const hasMedia = true;
        if (!options.url && options.number) {
            request = api
                .request('getURL')
                .data({ 'long-number': options.number });
            response = await request.send();
            ({ data } = response);
            // extract url
            ({ url: options.url } = data.data);
        }
        const useragent = CONFIG.get('useragent', `Yealink ${miniprogram ? 'WECHAT' : 'WEB-APP'} ${"1.0.2"}`);
        const clientinfo = CONFIG.get('clientinfo', `${miniprogram ? 'Apollo_WeChat' : 'Apollo_WebRTC'} ${"1.0.2"}`);
        // join focus
        const apiName = miniprogram ? 'joinWechat' : 'joinFocus';
        request = api
            .request(apiName)
            .data({
            // 'conference-uuid'     : null,
            // 'conference-user-id'  : null,
            'conference-url': options.url,
            'conference-pwd': options.password,
            'user-agent': useragent,
            'client-url': options.url.replace(/\w+@/g, miniprogram ? 'wechat@' : 'webrtc@'),
            'client-display-text': options.displayName || `${browser$4}`,
            'client-type': 'http',
            'client-info': clientinfo,
            'pure-ctrl-channel': !hasMedia,
            // if join with media
            'is-webrtc': !miniprogram && hasMedia,
            'is-wechat': miniprogram,
            'video-session-info': miniprogram && {
                bitrate: 600 * 1024,
                'video-width': 640,
                'video-height': 360,
                'frame-rate': 15,
            },
        });
        try {
            response = await request.send();
        }
        catch (error) {
            events.emit('failed', error);
            throw error;
        }
        ({ data } = response);
        ({
            'conference-user-id': userId,
            'conference-uuid': uuid,
        } = data.data);
        trtc = miniprogram ? data.data : {};
        onAccepted();
        if (!userId || !uuid) {
            log$s('internal error');
            throw new Error('Internal Error');
        }
        // save url
        ({ url } = options);
        // setup request interceptor for ctrl api
        interceptor = api
            .interceptors
            .request
            .use((config) => {
            if (/conference-ctrl/.test(config.url) && config.method === 'post') {
                config.data = Object.spread({}, {'conference-user-id': userId,
                    'conference-uuid': uuid},
                    config.data);
            }
            return config;
        });
        // get full info
        request = api
            .request('getFullInfo');
        try {
            response = await request.send();
        }
        catch (error) {
            events.emit('failed', error);
            throw error;
        }
        ({ data } = response);
        const info = data.data;
        // create context
        const context = createContext(conference);
        // create information
        information = createInformation(info, context);
        onConnected();
        return conference;
    }
    async function leave() {
        throwIfStatus(STATUS$1.kDisconnecting);
        throwIfStatus(STATUS$1.kDisconnected);
        switch (status) {
            case STATUS$1.kNull:
                // nothing to do
                break;
            case STATUS$1.kConnecting:
            case STATUS$1.kConnected:
                if (status === STATUS$1.kConnected) {
                    onDisconnecting();
                    await api
                        .request('leave')
                        .send()
                        .catch(error => {
                        log$s('leave error: ', error);
                    });
                    onDisconnected();
                }
                else if (request) {
                    request.cancel();
                    onDisconnected();
                }
                break;
            case STATUS$1.kDisconnecting:
            case STATUS$1.kDisconnected:
        }
        return conference;
    }
    async function end() {
        throwIfNotStatus(STATUS$1.kConnected);
        await Promise.all([
            leave(),
            api
                .request('end')
                .data({ 'conference-url': url })
                .send(),
        ]);
        return conference;
    }
    function setup() {
        getCurrentUser();
        const { state, users } = information;
        state.on('sharingUserEntityChanged', (val) => {
            // in some cases, eg. whitebord sharing
            // sharing use entity is an new unique id, which can not be finded in user list
            // use the second param the help making sharing detection strategy
            // 1. no user & no entity => no sharing
            // 2. no user & has entity => sharing(whitebord)
            // 3. has user => sharing
            events.emit('sharinguser', users.getUser(val), val);
        });
        state.on('speechUserEntityChanged', (val) => {
            // just in case, for the same reason with sharing use entity
            events.emit('speechuser', users.getUser(val), val);
        });
        users.on('user:added', (...args) => events.emit('user:added', ...args));
        users.on('user:updated', (...args) => events.emit('user:updated', ...args));
        users.on('user:deleted', (...args) => events.emit('user:deleted', ...args));
        // create keepalive worker
        keepalive = createKeepAlive({ api });
        // create polling worker
        polling = createPolling({
            api,
            onInformation: (data) => {
                log$s('receive information: %o', data);
                information.update(data);
                events.emit('information', information);
                getCurrentUser();
            },
            onMessage: (data) => {
                log$s('receive message: %o', data);
                chatChannel.incoming(data);
            },
            onRenegotiate: (data) => {
                log$s('receive renegotiate: %o', data);
                retryChannel(mediaChannel);
                retryChannel(shareChannel);
            },
            onQuit: (data) => {
                log$s('receive quit: %o', data);
                if (status === STATUS$1.kDisconnecting || status === STATUS$1.kDisconnected) {
                    log$s('receive quit while disconnecting, ignore it');
                    return;
                }
                // bizCode = 901314 ended by presenter
                // bizCode = 901320 kicked by presenter
                onDisconnected(data);
            },
            onError: (data) => {
                log$s('polling error: %o', data);
                if (status === STATUS$1.kDisconnecting || status === STATUS$1.kDisconnected) {
                    log$s('polling error while disconnecting, ignore it');
                    return;
                }
                if (data.message === 'Network Error') {
                    log$s('polling error while network error');
                    return;
                }
                events.emit('error', data);
                // there are some problems with polling
                // leave conference
                //
                onDisconnected(data);
            },
        });
        // start keepalive & polling
        keepalive.start();
        polling.start();
        // create channels
        mediaChannel = createMediaChannel({ api, type: 'main' });
        shareChannel = createMediaChannel({ api, type: 'slides' });
        chatChannel = createChatChannel({ api });
        chatChannel.on('message', (...args) => events.emit('message', ...args));
        chatChannel.on('ready', (...args) => events.emit('chatready', ...args));
        maybeChat();
    }
    function cleanup() {
        if (keepalive) {
            keepalive.stop();
        }
        if (polling) {
            polling.stop();
        }
        if (interceptor) {
            api.interceptors.request.eject(interceptor);
        }
        if (mediaChannel) {
            mediaChannel.terminate();
        }
        if (shareChannel) {
            shareChannel.terminate();
        }
        if (chatChannel) {
            chatChannel.terminate();
        }
        request = undefined;
    }
    async function share(options) {
        throwIfNotStatus(STATUS$1.kConnected);
        if (!shareChannel.isInProgress() && !shareChannel.isEstablished()) {
            await shareChannel.connect(options);
        }
        await api
            .request('switchShare')
            .data({ share: true })
            .send();
    }
    async function setSharing(enable = true) {
        throwIfNotStatus(STATUS$1.kConnected);
        await api
            .request('switchShare')
            .data({ share: enable })
            .send();
    }
    async function sendMessage(msg, target) {
        throwIfNotStatus(STATUS$1.kConnected);
        if (!chatChannel || !chatChannel.ready)
            { throw new Error('Not Ready'); }
        await chatChannel.sendMessage(msg, target);
    }
    return conference = Object.spread({}, events,
        {get api() {
            return api;
        },
        get url() {
            return url;
        },
        get uuid() {
            return uuid;
        },
        // in conference info
        // user entity is string type
        // while we may receive number type
        // cast to string type
        get userId() {
            return `${userId}`;
        },
        get user() {
            return user;
        },
        get information() {
            return information;
        },
        get description() {
            return information && information.description;
        },
        get state() {
            return information && information.state;
        },
        get view() {
            return information && information.view;
        },
        get users() {
            return information && information.users;
        },
        get rtmp() {
            return information && information.rtmp;
        },
        get record() {
            return information && information.record;
        },
        get mediaChannel() {
            return mediaChannel;
        },
        get shareChannel() {
            return shareChannel;
        },
        get chatChannel() {
            return chatChannel;
        },
        get trtc() {
            return trtc;
        },
        join,
        leave,
        end,
        share,
        setSharing,
        sendMessage});
}

const log$t = browser('MN:UA');
function createUA(config = {}) {
    let { auth } = config;
    let api;
    if (auth) {
        ({ api } = auth);
    }
    // fetch conference basic info
    async function fetch(number) {
        log$t('fetch()');
        let response;
        let data;
        let info;
        let partyId;
        let url;
        if (!api) {
            api = createUserApi();
        }
        // get conference url
        response = await api
            .request('getURL')
            .data({ 'long-number': number })
            .send();
        ({ data } = response);
        /* eslint-disable-next-line prefer-const */
        ({ 'party-id': partyId, url } = data.data);
        // get conference info
        try {
            response = await api
                .request('getBasicInfo')
                .data({ 'conference-url': url })
                .send();
            ({ data } = response);
            info = data.data;
        }
        catch (error) {
            log$t('Conference not started.');
            try {
                response = await api
                    .request('getBasicInfoOffline')
                    .data({ 'long-number': number })
                    .send();
                ({ data } = response);
                info = data.data;
            }
            catch (error) {
                log$t('Conference not exist.');
            }
        }
        if (!info) {
            throw new Error('Not Exist');
        }
        return {
            partyId,
            number,
            url,
            info,
        };
    }
    async function connect(options) {
        log$t('connect()');
        let partyId;
        let url;
        // create user api
        if (!api) {
            api = createUserApi();
        }
        if (!options.number) {
            throw new TypeError('Invalid Number');
        }
        const { number } = options;
        // get conference url
        const response = await api
            .request('getURL')
            .data({ 'long-number': number })
            .send();
        const { data } = response;
        /* eslint-disable-next-line prefer-const */
        ({ 'party-id': partyId, url } = data.data);
        if (!partyId) {
            throw new TypeError('Invalid Number');
        }
        let isTempAuthLocallyGenerated = false;
        // temp auth
        if (!auth || !auth.token) {
            auth = await createTempAuth(partyId);
            ({ api } = auth);
            isTempAuthLocallyGenerated = true;
        }
        // create stand alone user api for conference.
        // auth is required
        const conference = createConference({ api });
        // hack join method
        const { join } = conference;
        conference.join = (additional) => {
            return join(Object.spread({}, {url},
                options,
                additional));
        };
        if (isTempAuthLocallyGenerated) {
            conference.once('disconnected', auth.invalid);
        }
        return conference;
    }
    return {
        fetch,
        connect,
    };
}

{
    polyfill();
}
const log$u = browser('MN');
const version = "1.0.2";
// global setup
function setup$2(config) {
    setupConfig(config);
    if (isMiniProgram()) {
        axios$1.defaults.adapter = mpAdapter;
    }
    browser.enable(CONFIG.get('debug', 'MN*,-MN:Api*,-MN:Information:Item,-MN:Worker'));
    log$u('setup() [version]: %s', version);
}
async function connect(options) {
    const ua = createUA();
    const conference = await ua.connect(options);
    return conference;
}

var mod = /*#__PURE__*/Object.freeze({
  __proto__: null,
  debug: browser,
  axios: axios$1,
  adapter: mpAdapter,
  version: version,
  setup: setup$2,
  get AuthType () { return AuthType; },
  bootstrap: bootstrap,
  createUserApi: createUserApi,
  createUA: createUA,
  fetchControlUrl: fetchControlUrl,
  connect: connect
});

export default mod;
export { AuthType, mpAdapter as adapter, axios$1 as axios, bootstrap, connect, createUA, createUserApi, browser as debug, fetchControlUrl, setup$2 as setup, version };
