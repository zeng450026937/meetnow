'use strict';

if (process.env.NODE_ENV === 'production') {
  module.exports = require('./dist/axios-miniprogram-adapter.cjs.prod.js');
} else {
  module.exports = require('./dist/axios-miniprogram-adapter.cjs.js');
}
