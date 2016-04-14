module.exports = function ($scope, $routeParams, Profile, Post, Auth, $firebaseArray, FIREBASE_URL, Users, $filter) {
  var ref = new Firebase(FIREBASE_URL);
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
  var week = moment().startOf('isoweek').format('MM_DD_YYYY');
  $scope.current_week = 'weekly_score_'+week;

  $scope.orderby_string = "-"+ $scope.current_week + ".album_score";
  $scope.sorter = '-album_score';
  $scope.users = $firebaseArray(ref.child('user_scores').child(Users.current_group));

  $scope.getUsername = function(userId){
    return Users.getUsername(userId);
  }
};

