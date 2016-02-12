'use strict';

app.controller('CommentsCtrl', function ($scope, $routeParams, Post, Auth, $firebase, Profile) {
  var ref = new Firebase("https://flockify.firebaseio.com");
    $scope.user = Auth.user;
  $scope.signedIn = Auth.signedIn;
  $scope.logout = Auth.logout;
   $scope.posts = Post.all;
    $scope.user = Auth.user;
  $scope.post = Post.get($routeParams.postId);
  $scope.comments = Post.comments($routeParams.postId);


  $scope.addComment = function () {
    if(!$scope.commentText || $scope.commentText === '') {
      return;
    }

    var comment = {
      text: $scope.commentText,
      creator: $scope.user.profile.username,
      creatorUID: $scope.user.uid,
      votes: 0
    };
    $scope.comments.$add(comment);

    $scope.commentText = '';

    ref.once("value", function(snapshot) {
  $scope.comments_count = snapshot.child("comments").child($scope.post.$id).numChildren();
   ref.child("posts").child($scope.post.$id).update({'comments': $scope.comments_count});
   
  });


  };


  $scope.deleteComment = function (comment) {
  $scope.comments.$remove(comment);
};

  $scope.comment_upvote = function(comment) {
  comment.votes +=1;
  Post.commentVote($routeParams.postId, comment.$id, comment.votes);

};

  $scope.comment_downvote = function(comment) {
  comment.votes -=1;
  Post.commentVote($routeParams.postId, comment.$id, comment.votes);

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