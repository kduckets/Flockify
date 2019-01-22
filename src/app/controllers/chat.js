module.exports = function ($scope, $routeParams, Post, Auth, Comment, Profile, $http, $filter, $sce,
  $route, $uibModal, FIREBASE_URL, Users, $firebaseArray, $window, $location, $anchorScroll, Notification) {
  Notification.page_view("/chat/");
  $scope.loadingCircle = true;
  var ref = firebase.database().ref();
  var authData = Auth.$getAuth();
  if (authData) {
     console.log("User " + authData.uid + " is logged in with " + authData.provider);
     $scope.user = Users.getProfile(authData.uid);
     $scope.username = $scope.user.username;
  } else {
    $scope.user = null;
    $scope.username = null;
    $location.path('/login');
    console.log("User is logged out");
  }

  $scope.getIframeSrc = function(src) {
  return 'https://www.youtube.com/embed/' + src;
  };

  $scope.isYouTube = function(url) {
      var p = /(?:https?:\/\/)?(?:www\.)?(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))((\w|-){11})(?:\S+)?/;
      return (url.match(p)) ? RegExp.$1 : false;
  }

  $scope.trustAsHtml = $sce.trustAsHtml;
  $scope.gifSearchText = '';
  $scope.viewby = 12;
  $scope.itemsPerPage = $scope.viewby;
  $scope.maxSize = 5; // Number of pager buttons to show

  // don't load scope.comments with comments until we know total #
  var comments = $firebaseArray(ref.child('chats').child('firsttoflock'));
  comments.$loaded().then(function(comments) {
      $scope.totalItems = comments.length;
      $scope.comments = comments;
      $scope.currentPage = Math.ceil($scope.totalItems / $scope.itemsPerPage);
      $scope.loadingCircle = false;
  });

  $scope.setPage = function (pageNo) {
    $scope.currentPage = pageNo;
  };

  $scope.pageChanged = function() {
    $location.hash("top");
    $anchorScroll();
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
    // if($scope.totalItems % $scope.viewby === 0){
    $route.reload();
  // };
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

  $scope.likeComment = function (comment) {
    Comment.like_chat($scope.comments, 'flock_groupchat', comment);
  };

};
