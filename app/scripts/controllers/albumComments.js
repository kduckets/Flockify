'use strict';

app.controller('AlbumCommentsCtrl', function ($scope, $routeParams, Post, Auth, $firebase, Profile, $http, $filter, $sce, $uibModal, Action) {
  var ref = new Firebase("https://flockify.firebaseio.com");
  $scope.user = Auth.user;
  $scope.signedIn = Auth.signedIn;
  $scope.logout = Auth.logout;
  $scope.posts = Post.all;
  $scope.post = Post.get($routeParams.postId);
  $scope.comments = Post.comments($routeParams.postId);
  $scope.gifSearchText = '';
  // $scope.embed_link = $sce.trustAsResourceUrl("https://embed.spotify.com/?uri=spotify:album:6SwMUCcHLfZjji3MAFODMv"); 
  

  $scope.gifsearch = function(){

    var body = {'search': $scope.gifSearchText};
    $http.post('/api/giphysearch', body)

    .success(function(data) {
      
      $scope.gifs = data.data;
      
    })
    .error(function(data) {
      console.log('Error: ' + data);
    });

  };
  

  $scope.deletePost = function (post) {
    //Post.delete(post.$id);
    var postsRef = new Firebase('https://flockify.firebaseio.com/posts/'+post.$id);
    postsRef.remove();
  };


  $scope.addComment = function (gif) {
    // if(!$scope.commentText || $scope.commentText === '') {
    //   return;
    // }
    var today = $filter('date')(new Date(),'yyyy-MM-dd HH:mm:ss');
    var comment = {
      // text: $scope.commentText,
      text: gif,
      creator: $scope.user.profile.username,
      creatorUID: $scope.user.uid,
      votes: 0,
      datetime_ts: today
    };
    $scope.comments.$add(comment);

    $scope.commentText = '';
    $scope.gifSearchText = '';

    ref.once("value", function(snapshot) {
      $scope.comments_count = snapshot.child("comments").child($scope.post.$id).numChildren();
      ref.child("posts").child($scope.post.$id).update({'comments': $scope.comments_count});
      
      var date = new Date();
      date.setMinutes(date.getTimezoneOffset());
      var today = $filter('date')(new Date(),'yyyy-MM-dd HH:mm:ss Z');
      ref.child("posts").child($scope.post.$id).update({'latest_comment': today});

      
    });


  };


  $scope.deleteComment = function (comment) {
    $scope.comments.$remove(comment);
    ref.once("value", function(snapshot) {
      $scope.comments_count = snapshot.child("comments").child($scope.post.$id).numChildren();
      console.log($scope.comments_count);
      ref.child("posts").child($scope.post.$id).update({'comments': $scope.comments_count});
      
    });
  };

  $scope.getNumber = function(num) {
    return new Array(num);   
  };

  $scope.save = function(post) {
    if($scope.signedIn() && $scope.user.uid != post.creatorUID){

      Profile.savePost($scope.user.uid, post.$id, 'yes');
      
    };
    
  };


  $scope.upvote = function(post) {
    Action.upvote(post, post.media_type);

  };

  $scope.downvote = function(post) {
    Action.downvote(post, post.media_type);

  };

  $scope.starPost = function(post){
    Action.starPost(post, post.media_type);

  };


});