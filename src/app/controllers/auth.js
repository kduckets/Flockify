module.exports = function ($scope, $location, Auth, $cookieStore, $rootScope, Profile, FIREBASE_URL) {
var authCtrl = this;
var ref = new Firebase(FIREBASE_URL);

    $scope.user = {
      email: '',
      password: ''
    };

  $scope.login = function (){
    Auth.$authWithPassword($scope.user).then(function (auth){
      //todo:use auth token instead of id
      $location.path('/');
  }, function (error){
    $scope.error = error;
  });
};

  $scope.register = function (){
    Auth.$createUser($scope.user).then(function (user){
      console.log(user);

      var profile = {
        username: $scope.user.username,
        //todo: get group name from registration form
        groups: {firsttoflock : true}
      };
      var scores = {
        album_score: 0,
        weekly_scores: {album_score : 0}
      };
      ref.child('users').child(user.uid).set(profile);
      //todo: get group name from registration form
      ref.child('user_scores').child('firsttoflock').child(user.uid).set(scores);
    $scope.login();
  }, function (error){
    $scope.error = error;
  });
};

};
