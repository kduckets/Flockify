'use strict';

app.controller('ScoreCtrl', function ($scope, $routeParams, Profile, Post, Auth, $firebase) {
	var ref = new Firebase("https://flockify.firebaseio.com");

 //$scope.posts = Post.all;
 $scope.user = Auth.user;
  $scope.user = Auth.user;
  $scope.signedIn = Auth.signedIn;
  $scope.logout = Auth.logout;
    $scope.comments = Post.comments('scoreboard');

   
  $scope.users = $firebase(ref.child('user_scores')).$asArray();

//   var uid = $routeParams.userId;
//   $scope.profile = Profile.get(uid);

//  Profile.getPosts(uid).then(function(posts) {
//     $scope.user_posts = posts;
//     ref.child('user_scores').child($scope.profile.username).child('score').on("value", function(snapshot) {
//   $scope.score = snapshot.val();
// });
//   ref.child('user_scores').child($scope.profile.username).child('stars').on("value", function(snapshot) {
//   $scope.stars = snapshot.val();
// });
//   $scope.postsNumber = Object.keys($scope.user_posts).length;

//   });



});




  
