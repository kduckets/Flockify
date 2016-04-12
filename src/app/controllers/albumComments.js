module.exports = function ($scope, $routeParams, Post, Auth, Comment, $firebaseArray, Profile, $http, $filter, $sce, $location, 
  $uibModal, Action, $mdToast, FIREBASE_URL, $mdConstant, $mdDialog, Users) {
  var post_id = $routeParams.postId;
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
  $scope.post = Post.get(post_id);
  var postRef = new Firebase(FIREBASE_URL+"/posts/"+ post_id);
  postRef.once('value', function(dataSnapshot) {
  $scope.iframeUrl = $sce.trustAsResourceUrl("https://embed.spotify.com/?uri="+dataSnapshot.val().embed_uri);
  });
  $scope.comments = Comment.get_comments_for_post(post_id);
  $scope.gifSearchText = '';
  $scope.loadingCircle = false;

  var ref = new Firebase(FIREBASE_URL);
  var tags = $firebaseArray(ref.child('tags'));


    $scope.readonly = false;
    $scope.selectedItem = null;
    $scope.searchText = null;
    $scope.selectedTags = [];
    $scope.requireMatch = true;
    $scope.tags = tags;
    $scope.querySearch = querySearch;
    $scope.transformChip = transformChip;
    $scope.keys = [$mdConstant.KEY_CODE.COMMA, $mdConstant.KEY_CODE.ENTER];

  function transformChip(post, chip) {
      
      // If it is an object, it's already a known chip
      if (angular.isObject(chip)) {
        //TODO: if tag already exists don't add it to the database
        Post.tag(post.$id,chip.$value);
        return {name: chip.$value};
      }
      // Otherwise, create a new one
      tags.$add(chip)
      Post.tag(post.$id,chip);
      return { name: chip };

    };
   function querySearch (query) {
      var results = query ? $scope.tags.filter($scope.createFilterFor(query)) : query;
      return results;
    };

   $scope.createFilterFor = function(query) {
      var lowercaseQuery = angular.lowercase(query);
      return function filterFn(tag) {
        return (tag.$value.indexOf(lowercaseQuery) === 0)
      };
    };

  $scope.gifsearch = function(){
    var body = {'search': $scope.gifSearchText};
    $scope.loadingCircle = true;
    $http.post('/api/giphysearch', body).success(function(data) {
    //   $mdDialog.show(
    //   $mdDialog.alert()
    //     .parent(angular.element(document.querySelector('#popupContainer')))
    //     .clickOutsideToClose(true)
    //     .title('This is an alert title')
    //     .textContent('You can specify some description text in here.')
    //     .ariaLabel('Search for gif')
    //     .ok('Close')
    //     .targetEvent(ev)
    // );
      $scope.gifs = data.data;
      $scope.loadingCircle = false;
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
    if($scope.user && Auth.$getAuth().uid != post.creatorUID){
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
