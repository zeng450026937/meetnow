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
};

module.exports.defaultModes = {
  'build:meetnow' : 'production',
  'build:adapter' : 'production',
};
