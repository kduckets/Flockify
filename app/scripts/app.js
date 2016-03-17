 /* global app:true */
/* exported app */

'use strict';

/**
 * @ngdoc overview
 * @name debateMateApp
 * @description
 * # debateMateApp
 *
 * Main module of the application.
 */

var app = angular
  .module('flockifyApp', [
    'ngAnimate',
    'ngCookies',
    'ngResource',
    'ngRoute',
    'ngSanitize',
    'ngTouch',
    'firebase',
    'spotify',
    'ui.bootstrap',
    'ngLoadingSpinner',
    'angular.backtop'
  ])
  .config(function ($routeProvider) {
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
      .when('/movies', {
  templateUrl: 'views/movies.html',
  controller: 'MoviesCtrl'
      })
      .when('/books', {
  templateUrl: 'views/books.html',
  controller: 'BooksCtrl'
      })
      .when('/podcasts', {
  templateUrl: 'views/podcasts.html',
  controller: 'PodcastsCtrl'
      })
      .when('/register', {
  templateUrl: 'views/register.html',
  controller: 'AuthCtrl',
  resolve: {
    user: function(Auth) {
      return Auth.resolveUser();
       }
      }
      })
     .when('/login', {
  templateUrl: 'views/login.html',
  controller: 'AuthCtrl',
  resolve: {
    user: function(Auth) {
      return Auth.resolveUser();
    }
  }
})
    .when('/users/:userId', {
  templateUrl: 'views/profile.html',
  controller: 'ProfileCtrl'
})
      .otherwise({
        redirectTo: '/'
      });
  });
app.constant('FIREBASE_URL', globals.firebase_url);
app.run(function($cookieStore, Auth) {
    if ($cookieStore.get('login')) {
        var user = $cookieStore.get('login');
 Auth.login(user);
    }
    else {
        //do nothing
    }
});
