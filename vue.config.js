const path = require('path');

module.exports = {
  chainWebpack : (config) => {
    config.module
      .noParse(/^(vue|vue-router|vue-core)$/);

    // config.module
    //   .rule('js')
    //   .exclude
    //   .add(/(vue-core)/);

    config.module
      .rule('eslint')
      .exclude
      .add(/(vue-core)/);

    config.resolve.alias
      .set('package', path.resolve(__dirname, 'package.json'));
  },

  devServer : {
    proxy : {
      '^/webapp' : {
        target       : 'https://meetings.ylyun.com/',
        ws           : true,
        changeOrigin : true,
      },
    },
  },
};
