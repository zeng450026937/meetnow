/* eslint-disable */
'use strict';

if (process.env.NODE_ENV === 'production') {
  module.exports = require('./dist/meetnow.umd.min.js');
} else {
  module.exports = require('./dist/meetnow.umd.js');
}
