module.exports = function ($scope, $routeParams, Profile, Post, Auth, Users, $uibModal, FIREBASE_URL, $location,$mdToast,$http) {
  var ref = firebase.database().ref();
  var authData = Auth.$getAuth();

  if (Users.current_user) {
    console.log("User " + authData.uid + " is logged in with " + authData.provider);
    $scope.user = Users.getProfile(authData.uid);
    $scope.username = $scope.user.username;
  } else {
    $scope.user = null;
    $scope.username = null;
    $location.path('/login');
    console.log("User is logged out");
  }

  $scope.getNumKeys = function(obj) {
    if (!obj){
      return 0;
    }
    return Object.keys(obj).length;
  };

  $scope.sorter = '-';
  $scope.loading = true;

  var uid = $routeParams.userId;
  $scope.profile = Profile.get(uid);
  $scope.view_tab = 'tabA';

  //get likes
  $scope.getLikes = function(){
    $scope.loading = true;
    Profile.getLikes(uid).then(function(posts) {
    $scope.likes = posts;
    $scope.loading = false;
  });
}

  // get posts
  Profile.getPosts(uid).then(function(posts) {
    $scope.user_posts = posts;
    var week = moment().startOf('isoweek').format('MM_DD_YYYY');
    var current_week = 'weekly_score_'+week;
    $scope.postsNumber = Object.keys($scope.user_posts).length;
    ref.child('user_scores').child(Users.current_group).child($scope.profile.$id).child('album_score').on("value", function(snapshot) {
      $scope.total_score = snapshot.val();
      $scope.ratio = $scope.total_score/$scope.postsNumber;
    });
    ref.child('user_scores').child(Users.current_group).child($scope.profile.$id).child(current_week).child('album_score').on("value", function(snapshot) {
      $scope.score = snapshot.val();
    });
    ref.child('user_scores').child(Users.current_group).child($scope.profile.$id).child('comments_score').on("value", function(snapshot) {
      $scope.comments_score = snapshot.val();
    });
    ref.child('user_scores').child(Users.current_group).child($scope.profile.$id).child('stars').on("value", function(snapshot) {
      $scope.stars = snapshot.val();
    });
      $scope.loading = false;
  });

   $scope.getQueue = function(){
  Profile.getQueue(uid).then(function(posts) {
    $scope.queue = posts;
    console.log('queue', $scope.queue);
  });

  };

  $scope.showRatio = function(){
    var monday = moment().startOf('isoweek');
    $scope.postsNumber = Object.keys($scope.user_posts).length;
     var i = 0;

    angular.forEach($scope.user_posts, function(post, key) {

    if(post.created_ts && moment(post.created_ts).isAfter(monday)){
      i++;
    }
    console.log(i);
    $scope.ratio = $scope.score / i;
});
  };

  $scope.changeTab = function(tab) {
    $scope.view_tab = tab;
  };

  $scope.getNumber = function(num) {
    return new Array(num);
  };

  $scope.deletePost = function (post) {
    Post.delete(post);
  };

  $scope.removeSaved = function(post){
    Profile.savePost(Users.current_user_id, post.$id, false);
             $mdToast.show(
        $mdToast.simple()
        .textContent(post.media_info.album + ' removed from your queue')
        .position('bottom right' )
        .hideDelay(3000)
    );
  };

};
