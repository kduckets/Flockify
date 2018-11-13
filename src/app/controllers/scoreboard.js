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
  $scope.current_group = Users.current_group;
  $scope.users = $firebaseArray(ref.child('user_scores').child(Users.current_group));



  $scope.getUsername = function(userId){
    return Users.getUsername(userId);
  }
};
