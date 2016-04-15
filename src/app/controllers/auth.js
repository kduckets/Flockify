module.exports = function ($scope, $location, $routeParams, Auth, $cookieStore, $rootScope, Profile, FIREBASE_URL) {
var authCtrl = this;
$scope.showRegistration = false;
$scope.showContact = false;
var ref = new Firebase(FIREBASE_URL);
var groupsRef = new Firebase(FIREBASE_URL+"/groups");
$scope.beta_group_name = $routeParams.groupName;
groupsRef.once("value", function(snapshot) {
  if(snapshot.val()[$scope.beta_group_name]){
    $scope.showRegistration = true;
    console.log('valid group name');
  }else{
    $scope.showContact = true;
  }
});


    $scope.user = {
      email: '',
      password: ''
    };

  $scope.login = function (){
    Auth.$authWithPassword($scope.user).then(function (auth){
      $location.path('/');
  }, function (error){
    $scope.error = error;
  });
};

  $scope.register = function (){
    Auth.$createUser($scope.user).then(function (user){

      var groups = {};
      groups[$scope.beta_group_name] = true;

      var profile = {
        username: $scope.user.username,
        groups: groups
      };

       var current_week = moment().startOf('isoweek').format('MM_DD_YYYY');
       var scores = {}; 
       scores[current_week] = {album_score:0}; 
       scores['album_score'] = 0;
       scores['stars'] = 0;
  
      ref.child('users').child(user.uid).set(profile);
      ref.child('user_scores').child($scope.beta_group_name).child(user.uid).set(scores);

    $scope.login();
  }, function (error){
    $scope.error = error;
  });
};

};
