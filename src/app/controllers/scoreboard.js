module.exports = function ($scope, $routeParams, Profile, Post, Auth, $firebaseArray, FIREBASE_URL, Users, $filter, Trophy) {
  var ref = new Firebase(FIREBASE_URL);
  var authData = Auth.$getAuth();
  if (authData) {
     $scope.user = Users.getProfile(authData.uid);
     $scope.username = $scope.user.username;
  } else {
    $scope.user = null;
    $scope.username = null;
    $location.path('/login');
    console.log("User is logged out");
  }

  $scope.trophy = function(user_id){
      return Trophy.is_last_week_winner(user_id);
  }
  $scope.poop = function(user_id){
      return Trophy.is_last_week_loser(user_id);
  }

  $scope.display_week = moment().startOf('isoweek').format('MM/DD/YYYY');
  $scope.week = moment().startOf('isoweek').format('MM_DD_YYYY');

//i know this is bad, but it works...love, kev
  $scope.two_week = moment().startOf('isoweek').day(-6).format('MM_DD_YYYY');
  $scope.three_week = moment().startOf('isoweek').day(-13).format('MM_DD_YYYY');
  $scope.four_week = moment().startOf('isoweek').day(-20).format('MM_DD_YYYY');

  $scope.current_week = 'weekly_score_'+$scope.week;
  $scope.week_two = 'weekly_score_'+$scope.two_week;
  $scope.week_three = 'weekly_score_'+$scope.three_week;
  $scope.week_four = 'weekly_score_'+$scope.four_week;
  console.log($scope.week_three);
  $scope.orderby_string = "-"+ $scope.current_week + ".album_score";
  $scope.sorter = '-album_score';
  $scope.current_group = Users.current_group;
  $scope.users = $firebaseArray(ref.child('user_scores').child(Users.current_group));



  $scope.getUsername = function(userId){
    return Users.getUsername(userId);
  }
};
