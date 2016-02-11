'use strict';

app.controller('NavCtrl', function ($scope, $location, Post, Auth) {
  $scope.post = {artist: '', album: ''};
  $scope.user = Auth.user;
  $scope.signedIn = Auth.signedIn;
  $scope.logout = Auth.logout;

  console.log($scope.user);
   

});