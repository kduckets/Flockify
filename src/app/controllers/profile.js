module.exports = function ($scope, $routeParams, Profile, Post, Auth, $firebase, $uibModal, FIREBASE_URL, $location,$mdToast) {
  var ref = new Firebase(FIREBASE_URL);
  $scope.sorter = '-';
  $scope.user = Auth.user;
  $scope.signedIn = Auth.signedIn;
  $scope.logout = Auth.logout;
  $scope.posts = Post.all;
  $scope.loading = true;

  var uid = $routeParams.userId;
  $scope.profile = Profile.get(uid);
  $scope.view_tab = 'tabA';

  //get likes
  Profile.getLikes(uid).then(function(posts) {
    $scope.likes = posts;
    // $scope.loading = false;
  });

  // get posts
  Profile.getPosts(uid).then(function(posts) {

    $scope.user_posts = posts;
  
    ref.child('user_scores').child($scope.profile.username).child('weekly_scores').child('album_score').on("value", function(snapshot) {
      $scope.score = snapshot.val();

    });
    ref.child('user_scores').child($scope.profile.username).child('stars').on("value", function(snapshot) {
      $scope.stars = snapshot.val();

    });

      $scope.loading = false;
  });

  Profile.getQueue(uid).then(function(posts) {
    $scope.queue = posts;
  
  });

  $scope.showRatio = function(){
    var monday = moment().startOf('isoweek');
    $scope.postsNumber = Object.keys($scope.user_posts).length;
     var i = 0;

    angular.forEach($scope.user_posts, function(post, key) {
     
    if(post.date && moment(post.date).isAfter(monday)){
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
    Profile.savePost($scope.user.uid, post.$id, 'no');
             $mdToast.show(
        $mdToast.simple()
        .textContent(post.album + ' removed from your queue')
        .position('bottom right' )
        .hideDelay(3000)
    );
  };

};