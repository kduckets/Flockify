module.exports = function ($scope, $routeParams, Post, Auth, Comment, Profile, $location, $http, $filter, $sce,
  $uibModal, FIREBASE_URL, Users) {
  var ref = firebase.database().ref();
  var post_id = $routeParams.postId;
  ref.onAuth(function(authData) {
  if (authData) {
    //set login cookie
     console.log("User " + authData.uid + " is logged in with " + authData.provider);
     $scope.user = Users.getProfile(Auth.$getAuth().uid);
     $scope.username = Users.getUsername(Auth.$getAuth().uid);
  } else {
    $scope.user = null;
    $scope.username = null;
    console.log("User is logged out");
  }
});
  $scope.posts = Post.all;
  $scope.post = Post.get(post_id);
  $scope.comments = Comment.get_comments_for_post(post_id);
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
    Post.delete(post);
    $location.path('/#');
  };

  $scope.addComment = function (gif) {
    var new_comment = Comment.add_comment($scope.comments, post_id, gif);
    $scope.commentText = '';
    $scope.gifSearchText = '';
  };

  $scope.deleteComment = function (comment) {
    debugger;
    Comment.delete_comment($scope.comments, post_id, comment);
  };

  $scope.getNumber = function(num) {
    return new Array(num);
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

};
