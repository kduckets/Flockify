'use strict';

app.controller('AlbumCtrl', function ($scope, $route, $location, $window, Post, Auth, $http, $cookies, $modalInstance, album) {

  $scope.user = Auth.user;
  $scope.signedIn = Auth.signedIn;
  $scope.logout = Auth.logout;
  $scope.album = album;
  $scope.date = new Date();

  $http({
  method: 'GET',
  url: $scope.album
}).then(function successCallback(album) {
  

    $scope.spotify_result = album.data;
    $scope.artist = album.data.artists[0].name;
    $scope.album = album.data.name;
    $scope.image_medium = album.data.images[1].url;
    $scope.image_small = album.data.images[2].url;
    $scope.spotify_uri = album.data.external_urls.spotify;
    $scope.release_date = album.data.release_date;


  }, function errorCallback(response) {
    console.log(response);
  });



  $scope.cancel = function(){
     $modalInstance.close();


      $location.path('/');

    
  };

   $scope.submitPost = function () {
  $scope.post.creator = $scope.user.profile.username;
  $scope.post.summary = $scope.summary;
  $scope.post.creatorUID = $scope.user.uid;
  $scope.post.album = $scope.album;
  $scope.post.artist = $scope.artist;
  $scope.post.image_medium = $scope.image_medium;
  $scope.post.image_small = $scope.image_small;
  $scope.post.spotify_uri = $scope.spotify_uri;
  $scope.post.comments = 0;
  $scope.post.date = $scope.date;
  $scope.post.release_date = $scope.release_date;

  Post.create($scope.post).then(function (ref) {
    //$location.path('/posts/' + ref.name());
     $modalInstance.close();

      $route.reload();
    $scope.post = {artist: '', album: ''};
  });
};

        $scope.openInSpotify = function(){
            $window.open($scope.spotify_uri, '_blank');
        };

});