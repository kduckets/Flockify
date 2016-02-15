'use strict';

app.controller('ScoreCtrl', function ($scope, $routeParams, Profile, Post, Auth, $firebase) {
	var ref = new Firebase("https://flockify.firebaseio.com");

 //$scope.posts = Post.all;
 $scope.user = Auth.user;
  $scope.user = Auth.user;
  $scope.signedIn = Auth.signedIn;
  $scope.logout = Auth.logout;

   
  $scope.users = $firebase(ref.child('user_scores')).$asArray();
  console.log($scope.users);


});




  
