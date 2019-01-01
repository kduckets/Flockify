module.exports = function ($scope, $location, $routeParams, Auth, $cookieStore, $window,
  $rootScope, Profile, FIREBASE_URL, $route, Users, $timeout) {
var authCtrl = this;
$scope.hideRegistration = false;
$scope.regLoading = false;
$scope.showContact = false;

var auth = Auth;
$scope.auth = Auth;
$scope.auth.$onAuthStateChanged(function(firebaseUser) {
  $scope.firebaseUser = firebaseUser;
  if (firebaseUser) {
  $location.path('/');
}
});

var ref = firebase.database().ref();
var groupsRef = firebase.database().ref("/groups");
$scope.beta_group_name = $routeParams.groupName;
groupsRef.once("value", function(snapshot) {
  if(!snapshot.val()[$scope.beta_group_name]){
    $scope.hideRegistration = true;
    $scope.showContact = true;
  }
});
    $scope.user = {
      email: '',
      password: ''
    };

  $scope.login = function (){
     // $scope.loginLoading = true;
     //   $scope.hideLogin = true;
    $scope.firebaseUser = null;
    auth.$signInWithEmailAndPassword($scope.user.email, $scope.user.password).then(function (firebaseUser){
      $scope.firebaseUser = firebaseUser;
      Users.set_group_to_default(firebaseUser.uid);
      localStorage.setItem('current_group', 'firsttoflock');
      location.reload();
    }).catch(function(error) {
        $scope.error = error.message;
          });
        };

  $scope.resetPassword = function(){
    auth.$sendPasswordResetEmail($scope.user.email);
    $scope.sent = true;
  };

  $scope.register = function (){
    $scope.regLoading = true;
    $scope.hideRegistration = true;
    Auth.$createUserWithEmailAndPassword($scope.user.email, $scope.user.password).then(function (user){

      var groups = {};
      groups[$scope.beta_group_name] = true;

      var profile = {
        username: $scope.user.username,
        groups: groups
      };

       var week = moment().startOf('isoweek').format('MM_DD_YYYY');
          var current_week = 'weekly_score_'+week;
       var scores = {};
       scores[current_week] = {album_score:0};
       scores['album_score'] = 0;
       scores['stars'] = 0;

      ref.child('users').child(user.uid).set(profile);
      ref.child('user_scores').child($scope.beta_group_name).child(user.uid).set(scores);
      Auth.$signInWithEmailAndPassword($scope.user.email, $scope.user.password).then(function (auth){
      Users.set_group_to_registered(auth.uid,$scope.beta_group_name).then(function(current_group){
        location.reload();
      });
    })
      //  $timeout(function () {
      //   $window.location.reload();
      // }, 3000);
    }, function (error){
    $scope.error = error;
  });
};

};
