var angular = require('angular');
require('bootstrap');

require('angular-animate');
require('angular-cookies');
require('angular-material');
require('angular-resource');
require('angular-route');
require('angular-sanitize');
require('angular-material-icons');
require('firebase');
require('angularfire');

require('./../../app/bower_components/angular-spotify/dist/angular-spotify.min');
require('./../../app/bower_components/angular-bootstrap/ui-bootstrap-tpls.min');
require('./../../app/bower_components/angular-timeago/angular-timeago.min');

//var pluginManager = require('./../plugins/pluginManager');


var app = angular.module('flockifyApp', [
  'ngAnimate',
  'ngCookies',
  'ngMaterial',
  'ngResource',
  'ngRoute',
  'ngSanitize',
  'firebase',
  'spotify',
  'ui.bootstrap',
  'yaru22.angular-timeago',
  'ngMdIcons'
]);
app.config(function($mdThemingProvider) {
  $mdThemingProvider.theme('default').primaryPalette('grey', {
        'default': '900',
        'hue-2': '500',
        'hue-3': '200'
            }).backgroundPalette('grey', {
                'default': '200'
            })
});
app.config(function($routeProvider) { //TODO: move to routes module
  $routeProvider
    .when('/', {
      templateUrl: 'views/posts.html',
      controller: 'PostsCtrl'
    })
    .when('/chat', {
      templateUrl: 'views/chat.html',
      controller: 'ChatCtrl'
    })
    .when('/posts/:postId', {
      templateUrl: 'views/comments.html',
      controller: 'CommentsCtrl'
    })
    .when('/albums/:postId', {
      templateUrl: 'views/albumComments.html',
      controller: 'AlbumCommentsCtrl'
    })
    .when('/scoreboard', {
      templateUrl: 'views/scoreboard.html',
      controller: 'ScoreCtrl'
    })
    .when('/history', {
      templateUrl: 'views/scoreboardHistory.html',
      controller: 'ScoreCtrl'
    })
    // .when('/movies', {
    //   templateUrl: 'views/movies.html',
    //   controller: 'MoviesCtrl'
    // })
    // .when('/books', {
    //   templateUrl: 'views/books.html',
    //   controller: 'BooksCtrl'
    // })
    // .when('/podcasts', {
    //   templateUrl: 'views/podcasts.html',
    //   controller: 'PodcastsCtrl'
    // })
    .when('/register/:groupName', {
      templateUrl: 'views/register.html',
      controller: 'AuthCtrl',
    //   resolve: {
    //       requireNoAuth: function($location, Auth){
    //        return Auth.$requireAuth().then(function(auth){
    //          $location.path('/');
    //     }, function(error){
    //   return;
    //     });
    //   }
    // }
    })
    .when('/login', {
      templateUrl: 'views/login.html',
      controller: 'AuthCtrl',
    //   resolve: {
    //       requireNoAuth: function($location, Auth){
    //        return Auth.$requireAuth().then(function(auth){
    //          $location.path('/');
    //     }, function(error){
    //   return;
    //     });
    //   }
    // }
    })
    .when('/users/:userId', {
      templateUrl: 'views/profile.html',
      controller: 'ProfileCtrl'
  //     resolve: {
  //         auth: function($location, Users, Auth){
  //         return Auth.$requireAuth().catch(function(){
  //           location.path('/');
  //     });
  //   },
  //         profile: function(Users, Auth){
  //           return Auth.$requireAuth().then(function(auth){
  //           return Users.getProfile(auth.uid).$loaded();
  //     });
  //   }
  // }
    })
    .otherwise({
      redirectTo: '/'
    });
});
//test
//
app.factory('Action', require('./services/action'));
app.factory('Auth', require('./services/auth'));
app.factory('Comment', require('./services/comments'));
app.factory('Post', require('./services/post'));
app.factory('Profile', require('./services/profile'));
app.factory('Users', require('./services/users'));

app.filter('isAfter', require('./services/dateFilter'));
app.filter('byText', require('./services/textFilter'));
app.filter('byTags', require('./services/tagFilter'));
app.filter('emptyToEnd', require('./directives/emptyToEnd'));

app.directive("keepScroll", require('./directives/keepScroll'));
app.directive("scrollItem", require('./directives/scrollItem'));
app.directive("backTop", require('./directives/backtop'));
app.directive("focus", require('./directives/focus'));

app.controller('AlbumCommentsCtrl', require('./controllers/albumComments'));
app.controller('AlbumCtrl', require('./controllers/albumPost'));
app.controller('AuthCtrl', require('./controllers/auth'));

// app.controller('BooksCtrl', require('./controllers/books'));
// app.controller('BookCtrl', require('./controllers/bookPost'));

app.controller('ChatCtrl', require('./controllers/chat'));
app.controller('CommentsCtrl', require('./controllers/comments'));
// app.controller('MoviesCtrl', require('./controllers/movies'));
app.controller('NavCtrl', require('./controllers/nav'));
// app.controller('PodcastsCtrl', require('./controllers/podcasts'));
app.controller('PostsCtrl', require('./controllers/posts'));
app.controller('ProfileCtrl', require('./controllers/profile'));
app.controller('ScoreCtrl', require('./controllers/scoreboard'));

// var plugins = pluginManager.getPlugins();
// angular.forEach(plugins, function(plugin, key){
//   pluginManager.loadPlugin(app, plugin);
// });

app.constant('FIREBASE_URL', globals.firebase_url);
// app.run(function($cookieStore, Auth) {
//     if ($cookieStore.get('login')) {
//         var user = $cookieStore.get('login');
//  Auth.login(user);
//     }
//     else {
//         //do nothing
//     }
// });


//hot loader refresh
if (module.hot) {
  module.hot.accept();
  module.hot.dispose(function() {
    location.reload();
  });
}
