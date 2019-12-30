module.exports = (api, options) => {
  api.registerCommand(
    'build:meetnow',
    {
      description : 'build meetnow(library)',
      usage       : 'vue-cli-service build:meetnow',
      details     : 'TBD',
    },
    (args, rawArgs) => {
      args.entry = './packages/meetnow/src/index.ts';
      args.name = 'meetnow';
      args.dest = './packages/meetnow/dist';
      args.target = 'lib';
      api.service.run('build', args);
    },
  );
};

module.exports.defaultModes = {
  'build:meetnow' : 'production',
};
