'use strict';

if (process.env.NODE_ENV === 'production') {
  module.exports = require('./dist/browser.umd.min.js');
} else {
  module.exports = require('./dist/browser.umd.js');
}
