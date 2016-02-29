'use strict';

app.controller('MovieCtrl', function ($scope, $route, $location, $window, Post, Auth, $http, $cookies, $modalInstance, movie) {

  $scope.user = Auth.user;
  $scope.signedIn = Auth.signedIn;
  $scope.logout = Auth.logout;
  $scope.movie = movie;
  $scope.date = new Date();

  //TODO: call netflix API

//   $http({
//   method: 'GET',
//   url: "http://netflixroulette.net/api/api.php?title="
// }).then(function successCallback(album) {


//   }, function errorCallback(response) {
//     console.log(response);
//   });



  $scope.cancel = function(){
     $modalInstance.close();

    
  };

   $scope.submitPost = function () {
  $scope.post.creator = $scope.user.profile.username;
  $scope.post.summary = $scope.summary;
  $scope.post.creatorUID = $scope.user.uid;
  $scope.post.title = $scope.movie.trackName;
  $scope.post.artist = $scope.movie.artistName;
  $scope.post.image_medium = $scope.movie.artworkUrl100;
  $scope.post.image_small = $scope.movie.artworkUrl60;
  $scope.post.link = $scope.movie.trackViewUrl
  $scope.post.comments = 0;
  $scope.post.media_type = 'movie/film';
  $scope.post.date = $scope.date;
  $scope.post.release_date = $scope.movie.releaseDate;
  $scope.post.latest_comment = 9999;
  $scope.post.genre = $scope.movie.primaryGenreName;


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