module.exports = function ($scope, $routeParams, Post, Auth, Comment, $firebase, Profile, $http, $filter, $sce, 
  $route, $uibModal, FIREBASE_URL) {
  var ref = new Firebase(FIREBASE_URL);
  $scope.user = Auth.user;
  $scope.signedIn = Auth.signedIn;
  $scope.logout = Auth.logout;
  $scope.posts = Post.all;
  $scope.gifSearchText = '';
  $scope.viewby = 12;
  $scope.itemsPerPage = $scope.viewby;
  $scope.maxSize = 5; // Number of pager buttons to show

  // don't load scope.comments with comments until we know total #
  var comments = Comment.get_comments_for_post('flock_groupchat');
  comments.$loaded().then(function(comments) {
      $scope.totalItems = comments.length;
      $scope.comments = comments;
      $scope.currentPage = Math.ceil($scope.totalItems / $scope.itemsPerPage);
  });

  $scope.setPage = function (pageNo) {
    $scope.currentPage = pageNo;
  };

  $scope.pageChanged = function() {
    //console.log('Page changed to: ' + $scope.currentPage);
  };

  $scope.setItemsPerPage = function(num) {
    $scope.itemsPerPage = num;
    $scope.currentPage = 1; //reset to first paghe
  };

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

  $scope.addComment = function (text) {
    if(!$scope.commentText || $scope.commentText === '') { return; }
    Comment.add_comment($scope.comments, 'flock_groupchat', text);
    $scope.commentText = '';
    $route.reload();
  };

  $scope.addGif = function (gif) {
    var text = '<img src="'+ gif+ '" height="80" class="gif" />';
    Comment.add_comment($scope.comments, 'flock_groupchat', text);
    $scope.gifSearchText = '';
    $route.reload();
  };

  $scope.deleteComment = function (comment) {
    Comment.delete_comment($scope.comments, 'flock_groupchat', comment);
  };

};
