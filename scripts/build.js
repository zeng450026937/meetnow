module.exports = (api, options) => {
  api.registerCommand(
    'build:meetnow',
    {
      description : 'build meetnow(library)',
      usage       : 'vue-cli-service build:meetnow',
      details     : 'TBD',
    },
    (args, rawArgs) => {
      api.chainWebpack(config => {
        config.entry('app')
          .clear()
          .add(api.resolve('./packages/meetnow/src/index.ts'));
      });
      args.target = 'lib';
      api.service.run('build', args);
    },
  );
};

module.exports.defaultModes = {
  'build:meetnow' : 'production',
};
