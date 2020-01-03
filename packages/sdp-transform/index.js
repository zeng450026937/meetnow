'use strict';

if (process.env.NODE_ENV === 'production') {
  module.exports = require('./dist/sdp-transform.umd.min.js');
} else {
  module.exports = require('./dist/sdp-transform.umd.js');
}
