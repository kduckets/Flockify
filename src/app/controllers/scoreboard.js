module.exports = function ($scope, $timeout, $routeParams, Profile, Post, Auth, $firebaseArray, FIREBASE_URL, Users, $filter, Trophy, $firebaseAuth) {
  var ref = firebase.database().ref();
  var authData = Auth.$getAuth();
  var auth = $firebaseAuth();
  auth.$onAuthStateChanged(function(user) {
  if (authData) {
     $scope.user = Users.getProfile(user.uid);
     $scope.username = $scope.user.username;
  } else {
    $scope.user = null;
    $scope.username = null;
    $location.path('/login');
    console.log("User is logged out");
  }

    $scope.loadingCircle = true;
    $timeout(function () { $scope.loadingCircle = false; }, 2000);

  $scope.trophy = function(user_id){
      return Trophy.is_last_week_winner(user_id);
  }
  $scope.crown = function(user_id){
      return Trophy.is_last_month_winner(user_id);
  }
  $scope.poop = function(user_id){
      return Trophy.is_last_week_loser(user_id);
  }

  $scope.display_week = moment().startOf('isoweek').format('MM/DD/YYYY');
  $scope.week = moment().startOf('isoweek').format('MM_DD_YYYY');

  $scope.display_month = moment().startOf('month').format('MMMM');
  $scope.month = moment().startOf('month').format('MM_DD_YYYY');


  $scope.current_week = 'weekly_score_'+$scope.week;
  $scope.current_month = 'monthly_score_'+$scope.month;

  $scope.orderby_string = "-"+ $scope.current_week + ".album_score";
  $scope.orderby_string_month = "-"+ $scope.current_month + ".album_score";
  $scope.sorter = '-album_score';
  $scope.current_group = 'firsttoflock';
  $scope.users = $firebaseArray(ref.child('user_scores').child('firsttoflock'));
 
  $scope.users.$loaded()
    .then(function(){
  angular.forEach($scope.users, function (user, key){
  Profile.getPosts(user.$id).then(function(posts) {
    $scope.user_posts = posts;
    $scope.postsNumber = Object.keys($scope.user_posts).length;
    ref.child('user_scores').child('firsttoflock').child(user.$id).child('album_score').on("value", function(snapshot) {
      $scope.total_score = snapshot.val();
      var ratio = $scope.total_score/$scope.postsNumber;
      if(Number.isNaN(ratio)){
      $scope.users[key].ratio = 0;
      }else{
      $scope.users[key].ratio = ratio.toFixed(1);
      }
    })
  })
})
    });
  



  $scope.getUsername = function(userId){
    return Users.getUsername(userId);
  }
})
};
