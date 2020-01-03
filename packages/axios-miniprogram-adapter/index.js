'use strict';

if (process.env.NODE_ENV === 'production') {
  module.exports = require('./dist/axios-miniprogram-adapter.umd.min.js');
} else {
  module.exports = require('./dist/axios-miniprogram-adapter.umd.js');
}
