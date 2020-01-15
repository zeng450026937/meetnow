module.exports = (api, options) => {
  api.registerCommand(
    'build:meetnow',
    {
      description : 'build meetnow',
      usage       : 'vue-cli-service build:meetnow',
      details     : 'TBD',
    },
    async (args, rawArgs) => {
      args.name = 'MeetNow';
      args.filename = 'meetnow';
      args.target = 'lib';
      args.entry = './packages/meetnow/src/index.ts';
      args.dest = './packages/meetnow/dist';

      api.chainWebpack((config) => {
        /* eslint-disable-next-line */
        const masterVersion = require(api.resolve('./package.json')).version;

        config.plugin('define')
          .tap((opts) => {
            opts[0].__DEV__ = process.env.NODE_ENV === 'development';
            opts[0].__VERSION__ = `"${ masterVersion }"`;
            return opts;
          });
      });

      await api.service.run('build', args);
    },
  );

  api.registerCommand(
    'build:adapter',
    {
      description : 'build axios-miniprogram-adapter',
      usage       : 'vue-cli-service build:adapter',
      details     : 'TBD',
    },
    async (args, rawArgs) => {
      args.name = 'AxiosMiniprogramAdapter';
      args.filename = 'axios-miniprogram-adapter';
      args.target = 'lib';
      args.entry = './packages/axios-miniprogram-adapter/src/index.ts';
      args.dest = './packages/axios-miniprogram-adapter/dist';
      await api.service.run('build', args);
    },
  );

  api.registerCommand(
    'build:sdp',
    {
      description : 'build sdp',
      usage       : 'vue-cli-service build:sdp',
      details     : 'TBD',
    },
    async (args, rawArgs) => {
      args.name = 'SDPTransform';
      args.filename = 'sdp-transform';
      args.target = 'lib';
      args.entry = './packages/sdp-transform/src/index.ts';
      args.dest = './packages/sdp-transform/dist';
      await api.service.run('build', args);
    },
  );

  api.registerCommand(
    'build:browser',
    {
      description : 'build browser',
      usage       : 'vue-cli-service build:browser',
      details     : 'TBD',
    },
    async (args, rawArgs) => {
      args.name = 'Browser';
      args.filename = 'browser';
      args.target = 'lib';
      args.entry = './packages/browser/src/index.ts';
      args.dest = './packages/browser/dist';
      await api.service.run('build', args);
    },
  );
};

module.exports.defaultModes = {
  'build:meetnow' : 'production',
  'build:adapter' : 'production',
  'build:sdp'     : 'production',
  'build:browser' : 'production',
};
