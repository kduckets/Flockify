module.exports = function ($scope, $routeParams, Post, Auth, Comment, $firebase, Profile, $http, $filter, $sce, $location, 
  $uibModal, Action, $mdToast) {
  var post_id = $routeParams.postId;
  $scope.user = Auth.user;
  $scope.signedIn = Auth.signedIn;
  $scope.logout = Auth.logout;
  $scope.posts = Post.all;
  $scope.post = Post.get(post_id);
  $scope.comments = Comment.get_comments_for_post(post_id);
  $scope.gifSearchText = '';

  $scope.gifsearch = function(){
    var body = {'search': $scope.gifSearchText};
    $http.post('/api/giphysearch', body).success(function(data) {
      $scope.gifs = data.data;
    }).error(function(data) {
      console.log('Error: ' + data);
    });
  };

  $scope.deletePost = function (post) {
    Post.delete(post);
    $location.path('/#');
  };

  $scope.addComment = function (gif) {
    $scope.commentText = '';
    $scope.gifSearchText = '';
    var new_comment = Comment.add_comment($scope.comments, post_id, gif);
  };

  $scope.deleteComment = function (comment) {
    Comment.delete_comment($scope.comments, post_id, comment);
  };

  $scope.getNumber = function(num) {
    return new Array(num);
  };

  $scope.save = function(post) {
    if($scope.signedIn() && $scope.user.uid != post.creatorUID){
      Profile.savePost($scope.user.uid, post.$id, 'yes');
         $mdToast.show(
            $mdToast.simple()
            .textContent('Saved "' + post.album + '" to your queue')
            .position('bottom right' )
            .hideDelay(3000)
            );
    };
  };

  $scope.upvote = function(post) {
    Action.upvote(post, post.media_type).then(function(msg){
        console.log(msg);
        $mdToast.show(
          $mdToast.simple()
          .textContent(msg)
          .position('bottom right' )
          .hideDelay(3000)
          );
      });
  };

  $scope.downvote = function(post) {
    Action.downvote(post, post.media_type).then(function(msg){
        console.log(msg);
        $mdToast.show(
          $mdToast.simple()
          .textContent(msg)
          .position('bottom right' )
          .hideDelay(3000)
          );
      });
  };

  $scope.starPost = function(post){
    Action.starPost(post, post.media_type).then(function(msg){
        console.log(msg);
        $mdToast.show(
          $mdToast.simple()
          .textContent(msg)
          .position('bottom right' )
          .hideDelay(3000)
          );
      });
  };

};
