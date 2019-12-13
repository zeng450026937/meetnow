module.exports = {
  context : __dirname,
  target  : 'web',
  entry   : ['./index.js'],
  output  : {
    filename      : 'meetnow-sdk.bundle.js',
    library       : 'meetnow',
    libraryTarget : 'umd',
  },
  mode   : 'development',
  module : {
    rules : [
      {
        test    : /\.js$/,
        exclude : /(node_modules)/,
        use     : {
          loader  : 'babel-loader',
          options : {
            presets : ['@babel/env'],
            plugins : ['@babel/plugin-syntax-dynamic-import'],
          },
        },
      },
    ],
  },
};
