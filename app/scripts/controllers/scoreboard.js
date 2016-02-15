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


  $scope.addComment = function () {
     if(!$scope.commentText || $scope.commentText === '') {
       return;
    }

    var comment = {
      // text: $scope.commentText,
      text: $scope.commentText,
      creator: $scope.user.profile.username,
      creatorUID: $scope.user.uid,
      votes: 0
    };
    $scope.comments.$add(comment);

    $scope.commentText = '';
    $scope.gifSearchText = '';

    ref.once("value", function(snapshot) {
  $scope.comments_count = snapshot.child("comments").child('scoreboard').numChildren();
   ref.child("posts").child('scoreboard').update({'comments': $scope.comments_count});
   
  });


  };

   $scope.deleteComment = function (comment) {
  $scope.comments.$remove(comment);
     ref.once("value", function(snapshot) {
  $scope.comments_count = snapshot.child("comments").child('scoreboard').numChildren();
   ref.child("posts").child('scoreboard').update({'comments': $scope.comments_count});
   
  });
};

  $scope.comment_upvote = function(comment) {
  comment.votes +=1;
  Post.commentVote('scoreboard', comment.$id, comment.votes);

};

  $scope.comment_downvote = function(comment) {
  comment.votes -=1;
  Post.commentVote('scoreboard', comment.$id, comment.votes);

};


});




  
