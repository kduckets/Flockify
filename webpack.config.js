var webpack = require('webpack');
var path = require('path')

module.exports = {
  context: path.join(__dirname, "src", "app"),
  entry: [
    // Add the client which connects to our middleware
    // You can use full urls like 'webpack-hot-middleware/client?path=http://localhost:3000/__webpack_hmr'
    // useful if you run your app from another point like django
    'webpack-hot-middleware/client?path=/__webpack_hmr&timeout=20000',
    // And then the actual application
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
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoErrorsPlugin()
  ],
};
