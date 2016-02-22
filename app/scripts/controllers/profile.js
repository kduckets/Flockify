'use strict';

app.controller('ProfileCtrl', function ($scope, $routeParams, Profile, Post, Auth, $firebase, $uibModal) {
	var ref = new Firebase("https://flockify.firebaseio.com");
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
    //console.log($scope.likes);
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

 
  
    $scope.view_tab = 'tabA';

  $scope.changeTab = function(tab) {
    $scope.view_tab = tab;
};

   
  $scope.starPost = function(post){
     if($scope.signedIn() && $scope.user.uid != post.creatorUID){
 var modalInstance = $uibModal.open({
    templateUrl: 'views/star.html',
    scope: $scope,
    controller: 'StarCtrl',
    resolve: {
      post: function () {
        return post;
      }
    }
});
}
 };

 $scope.getNumber = function(num) {
    return new Array(num);   
}; 

  $scope.deletePost = function (post) {
    //Post.delete(post.$id);
    var postsRef = new Firebase('https://flockify.firebaseio.com/posts/'+post.$id);
    postsRef.remove();
  	};


  $scope.upvote = function(post) {
    if($scope.signedIn() && $scope.user.uid != post.creatorUID){

        ref.child('user_scores').child(post.creator).child('score').on("value", function(snapshot) {
  $scope.score = snapshot.val();
});

    $scope.current_vote = $firebase(ref.child('user_votes').child($scope.user.uid).child(post.$id).child('vote')).$asObject();
    $scope.current_vote.$loaded().then(function(res) {

    if(res.$value == 'up'){
      //do nothing
    };
    if(res.$value == 'down' || !res.$value){
        post.votes +=1;
        Post.vote(post.$id, post.votes);
        Profile.setVote($scope.user.uid, post.$id, 'up');
            $scope.score = $scope.score + 1;
        ref.child("user_scores").child(post.creator).update({'score': $scope.score});
    };
    
});
};
  
};

  $scope.downvote = function(post) {

    if($scope.signedIn() && $scope.user.uid != post.creatorUID){

        ref.child('user_scores').child(post.creator).child('score').on("value", function(snapshot) {
  $scope.score = snapshot.val();
});

    $scope.current_vote = $firebase(ref.child('user_votes').child($scope.user.uid).child(post.$id).child('vote')).$asObject();
    $scope.current_vote.$loaded().then(function(res) {
    if(res.$value == 'down'){
      //do nothing
    };

    if(res.$value == 'up' || !res.$value){
        post.votes -=1;
        Post.vote(post.$id, post.votes);
        Profile.setVote($scope.user.uid, post.$id, 'down');
        $scope.score = $scope.score - 1;
        ref.child("user_scores").child(post.creator).update({'score': $scope.score});

    };
    
});
};
  
};

});