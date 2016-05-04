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
  $scope.current_week = 'weekly_score_'+$scope.week;

  $scope.rank = function(week){
  return "-"+ week + ".album_score";
 };
 
  $scope.sorter = '-album_score';
  $scope.current_group = Users.current_group;
  $scope.users = $firebaseArray(ref.child('user_scores').child(Users.current_group));

  $scope.scoreboards = [];

  //for each user, get weekly score nodes
  //add to array of weekly scoreboards if doesn't already exist in weekly scoreboards
ref.child('user_scores').child(Users.current_group).once("value", function(snapshot) {
  snapshot.forEach(function(childSnapshot) {
    // var key = childSnapshot.key();
    var childData = childSnapshot.val();
    for( child in childData ) {
    if($scope.scoreboards.indexOf(child) == -1 && child.indexOf( "weekly" ) > -1) {
        $scope.scoreboards.push(child);
      }
    }
 
  });
    console.log('scoreboards:', $scope.scoreboards);
});


  $scope.getUsername = function(userId){
    return Users.getUsername(userId);
  }
};

