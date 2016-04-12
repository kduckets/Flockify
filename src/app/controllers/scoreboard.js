module.exports = function ($scope, $routeParams, Profile, Post, Auth, $firebaseArray, FIREBASE_URL, Users) {
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
  $scope.sorter = '-album_score';
  $scope.users = $firebaseArray(ref.child('user_scores'));
  var monday = moment().startOf('isoweek');
  $scope.week_start = monday.format('YYYY-MM-DD');
};

