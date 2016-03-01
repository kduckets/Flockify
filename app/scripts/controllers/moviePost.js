'use strict';

app.controller('MovieCtrl', function ($scope, $route, $location, $window, Post, Auth, $http, $cookies, $modalInstance, movie) {

  $scope.user = Auth.user;
  $scope.signedIn = Auth.signedIn;
  $scope.logout = Auth.logout;
  $scope.movie = movie;
  $scope.date = new Date();

      $http({
        method: 'GET',
        url: 'http://www.omdbapi.com/?t=' + $scope.movie.Title + "&r=json&tomatoes=true&apikey=973fea0"
          }).then(function successCallback(response) {
          $scope.omdb = response.data; 
            console.log($scope.omdb);
            $scope.post.tomato_meter = $scope.omdb.tomatoMeter;
            $scope.post.tomato_url = $scope.omdb.tomatoURL;
            $scope.post.tomato_image = $scope.omdb.tomatoImage;
            $scope.post.imdb_rating = $scope.omdb.imdbRating;
         }, function errorCallback(response) {
        });




  $scope.cancel = function(){
     $modalInstance.close();

    
  };

   $scope.submitPost = function () {
  $scope.post.creator = $scope.user.profile.username;
  $scope.post.summary = $scope.summary;
  $scope.post.creatorUID = $scope.user.uid;
  $scope.post.title = $scope.omdb.Title;
  $scope.post.album = $scope.omdb.Title;
  $scope.post.artist = $scope.omdb.Director;
  $scope.post.image_medium = "http://img.omdbapi.com/?i="+ $scope.movie.imdbID + "&apikey=973fea0"
  $scope.post.image_small = "http://img.omdbapi.com/?i="+ $scope.movie.imdbID + "&apikey=973fea0"
  $scope.post.imdb_id = $scope.movie.imdbID
  $scope.post.link = "http://www.canistream.it/search/movie/" + encodeURI($scope.movie.Title);
  $scope.post.comments = 0;
  $scope.post.media_type = 'movie/film';
  $scope.post.date = $scope.date;
  $scope.post.release_date = $scope.movie.Year;
  $scope.post.latest_comment = 9999;
  $scope.post.genre = $scope.omdb.Genre;


  Post.create($scope.post).then(function (ref) {
    //$location.path('/posts/' + ref.name());
     $modalInstance.close();

      $route.reload();
    $scope.post = {artist: '', album: ''};
  });
};

        $scope.openInItunes = function(){
            $window.open($scope.movie.trackViewUrl, '_blank');
        };

});