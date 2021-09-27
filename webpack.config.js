var webpack = require('webpack');
var path = require('path')

module.exports = {
  context: path.join(__dirname, "src", "app"),
  entry: [
    './index.js'
  ],
  output: {
    path: path.join(__dirname, "app"),
    publicPath: '/',
    filename: 'bundle.js'
  },
  devtool: '#source-map',
  plugins: [
    new webpack.ProvidePlugin({
        $: "jquery",
        jQuery: "jquery",
        "window.jQuery": "jquery"
    }),
    new webpack.optimize.OccurenceOrderPlugin(),
    new webpack.NoErrorsPlugin()
  ],
};
