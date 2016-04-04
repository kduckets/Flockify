module.exports = function ($scope, $routeParams, Profile, Post, Auth, $firebase, FIREBASE_URL) {
  var ref = new Firebase(FIREBASE_URL);
  $scope.user = Auth.user;
  $scope.signedIn = Auth.signedIn;
  $scope.logout = Auth.logout;
  $scope.sorter = '-album_score';
  $scope.users = $firebase(ref.child('user_scores')).$asArray();
  var monday = moment().startOf('isoweek');
  $scope.week_start = monday.format('YYYY-MM-DD');
};
