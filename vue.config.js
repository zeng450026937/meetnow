const path = require('path');

module.exports = {

  chainWebpack : (config) => {
    config.module
      .noParse(/^(vue|vue-router|vue-core|dist)$/);

    config.module
      .rule('js')
      .exclude
      .add(/(vue-core|dist)/);

    // config.module
    //   .rule('js')
    //   .exclude
    //   .add(/(vue-core)/);

    config.module
      .rule('eslint')
      .exclude
      .add(/(vue-core|dist)/);

    config.resolve
      .alias
      .set('package', path.resolve(__dirname, 'package.json'));
  },

  devServer : {
    proxy : {
      '^/webapp' : {
        target       : 'https://meetings.pre.onyealink.com/', // 'https://meetings.ylyun.com/', // http://meeting.10.200.112.39.xip.io/
        ws           : true,
        changeOrigin : true,
      },
    },
  },

};
