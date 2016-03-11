'use strict';

app.controller('ProfileCtrl', function ($scope, $routeParams, Profile, Post, Auth, $firebase, $uibModal, FIREBASE_URL) {
	var ref = new Firebase(FIREBASE_URL);
        $scope.sorter = '-';
	  $scope.user = Auth.user;
  $scope.signedIn = Auth.signedIn;
  $scope.logout = Auth.logout;
	 $scope.posts = Post.all;
 		$scope.user = Auth.user;

  var uid = $routeParams.userId;
  $scope.profile = Profile.get(uid);
  //get likes
     Profile.getLikes(uid).then(function(posts) {
    $scope.likes = posts;
   });

     //get posts
  Profile.getPosts(uid).then(function(posts) {
    $scope.user_posts = posts;
    ref.child('user_scores').child($scope.profile.username).child('score').on("value", function(snapshot) {
  $scope.score = snapshot.val();
});
  ref.child('user_scores').child($scope.profile.username).child('stars').on("value", function(snapshot) {
  $scope.stars = snapshot.val();
});
  $scope.postsNumber = Object.keys($scope.user_posts).length;

  });

     Profile.getQueue(uid).then(function(posts) {
    $scope.queue = posts;
   });


    $scope.view_tab = 'tabA';

  $scope.changeTab = function(tab) {
    $scope.view_tab = tab;
};



 $scope.getNumber = function(num) {
    return new Array(num);
};

  $scope.deletePost = function (post) {
    //Post.delete(post.$id);
    var postsRef = new Firebase('https://flockify.firebaseio.com/posts/'+post.$id);
    postsRef.remove();
  	};

  $scope.removeSaved = function(post){
 Profile.savePost($scope.user.uid, post.$id, 'no');

  };

  

});
