var expect = require('chai').expect;

describe('plugins', function(){

  describe('pluginManager', function(){

    describe('getPlugins()', function(){

      it('returns more than 0 plugins', function(done){
        var pluginManager = require('./../src/plugins/pluginManager');
        var plugins = pluginManager.getPlugins();

        expect(plugins).to.not.be.null
          .and.to.not.be.empty;
        done();
      });

    });

    describe('loadPlugin()', function(){

      it('does not throw error', function(done){
          var pluginManager = require('./../src/plugins/pluginManager');
          var mockApp = {
            controller: function(){}
          }
          var mockPlugin = {
            path: 'src/plugins/books',
            config: {
              "name": "books",
              "displayName": "Books",
              "description": "Books!",
              "settings": {
                "maxPostsPerDay": 1
              },
              "clientControllers": [
                { "controllerName": "BooksCtrl", "controllerModulePath": "/client/controllers/books" },
                { "controllerName": "BookCtrl", "controllerModulePath": "/client/controllers/bookPost" }
              ],
              "clientRouteHandlers": [
                { "path": "/books", "controllerName":"BooksCtrl", "view": "views/books.html" }
              ],
              "apiRouteHandlers": []
            }

          }

          pluginManager.loadPlugin(mockApp, mockPlugin);
          done();
      });

    });
  });
});
