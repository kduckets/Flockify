'use strict';

app.controller('CommentsCtrl', function ($scope, $routeParams, Post, Auth) {
  $scope.post = Post.get($routeParams.postId);
  $scope.comments = Post.comments($routeParams.postId);

  $scope.user = Auth.user;
  $scope.signedIn = Auth.signedIn;


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
  };


  $scope.deleteComment = function (comment) {
  $scope.comments.$remove(comment);
};

  $scope.upvote = function(comment) {
  comment.votes +=1;
  Post.commentVote($routeParams.postId, comment.$id, comment.votes);

};

  $scope.downvote = function(comment) {
  comment.votes -=1;
  Post.commentVote($routeParams.postId, comment.$id, comment.votes);

};


});