'use strict';

if (process.env.NODE_ENV === 'production') {
  module.exports = require('./dist/adapter.umd.min.js');
} else {
  module.exports = require('./dist/adapter.umd.js');
}
