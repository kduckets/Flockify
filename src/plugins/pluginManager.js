var fs = require('fs');
var path = require('path');

module.exports = (function(){
  const pluginRootPath = './src/plugins'

  //public
  var getPlugins = function(){
    var plugins = getPluginPaths();
    for (var i = 0; i < plugins.length; i++) {
      if (!plugins[i] || !plugins[i].path) continue;
      var config = loadPluginConfig(plugins[i].path);
      if (!config) {
        delete plugins[i];
        continue;
      }
      plugins[i].config = config;
    }
    return plugins;
  };

  var loadPlugin = function(app, plugin){
    if (!plugin || !plugin.config) throw new Error('no plugin found ');

    //bind angular controllers to plugin's client controllers
    var clientControllers = plugin.config.clientControllers;
    for (var i = 0; i < clientControllers.length; i++) {
      bindControllers(app,
        clientControllers[i].controllerName,
        getPluginComponentPath(plugin.path, clientControllers[i].controllerModulePath),
        function(err){
          if (err) console.log(err); //TODO: handle error here
      });
    }
  }

  //private
  var loadPluginConfig = function(pluginPath){

    var data = fs.readFileSync(path.join('.', pluginPath, 'flockify.plugin.json'), 'utf8');
    if (!data) return null;
    return JSON.parse(data);
  };

  var getPluginPaths = function() {
    var pluginPaths = [];
    fs.readdirSync(pluginRootPath).filter(function(file) {

      var pluginPath = path.join(pluginRootPath, file)
      if (fs.statSync(pluginPath).isDirectory()){
        pluginPaths.push({path:pluginPath});
      }
    });
    return pluginPaths;
  };

  var bindControllers = function(app, controllerName, controllerModulePath){
    app.controller(controllerName, require(path.join('.', controllerModulePath)));
  }

  var getPluginComponentPath = function(pluginPath, componentPath){
    return path.join('./', '/../../', pluginPath, componentPath);
  };

  return {
    getPlugins:getPlugins,
    loadPlugin:loadPlugin
  }
})()
