'use strict';

app.controller('ProfileCtrl', function ($scope, $routeParams, Profile, Post, Auth, $firebase) {
	var ref = new Firebase("https://flockify.firebaseio.com");
	  $scope.user = Auth.user;
  $scope.signedIn = Auth.signedIn;
  $scope.logout = Auth.logout;
	 $scope.posts = Post.all;
 		$scope.user = Auth.user;
  var uid = $routeParams.userId;
  $scope.profile = Profile.get(uid);
  Profile.getPosts(uid).then(function(posts) {
    $scope.user_posts = posts;
  });

  $scope.deletePost = function (post) {
    Post.delete(post);
  	};


  $scope.upvote = function(post) {
    if($scope.signedIn()){

    $scope.current_vote = $firebase(ref.child('user_votes').child($scope.user.uid).child(post.$id).child('vote')).$asObject();
    $scope.current_vote.$loaded().then(function(res) {

    if(res.$value == 'up'){
      //do nothing
    };
    if(res.$value == 'down' || !res.$value){
        post.votes +=1;
        Post.vote(post.$id, post.votes);
        Profile.setVote($scope.user.uid, post.$id, 'up');
    };
    
});
};
  
};

  $scope.downvote = function(post) {

    if($scope.signedIn()){
    $scope.current_vote = $firebase(ref.child('user_votes').child($scope.user.uid).child(post.$id).child('vote')).$asObject();
    $scope.current_vote.$loaded().then(function(res) {
    if(res.$value == 'down'){
      //do nothing
    };

    if(res.$value == 'up' || !res.$value){
        post.votes -=1;
        Post.vote(post.$id, post.votes);
        Profile.setVote($scope.user.uid, post.$id, 'down');
    };
    
});
};
  
};

});