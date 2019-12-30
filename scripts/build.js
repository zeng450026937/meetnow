module.exports = (api, options) => {
  api.registerCommand(
    'build:meetnow',
    {
      description : 'build meetnow(library)',
      usage       : 'vue-cli-service build:meetnow',
      details     : 'TBD',
    },
    async (args, rawArgs) => {
      args.name = 'meetnow';
      args.target = 'lib';
      args.entry = './packages/meetnow/src/index.ts';
      args.dest = './packages/meetnow/dist';
      await api.service.run('build', args);
    },
  );
};

module.exports.defaultModes = {
  'build:meetnow' : 'production',
};
