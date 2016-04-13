module.exports = function ($scope, $location, Auth, $cookieStore, $rootScope) {
var authCtrl = this;

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
      //todo: choose group, add to profile
      var profile = {
        username: user.username,
        md5_hash: user.md5_hash
      };
      var profileRef = $firebase(ref.child('users'));
      return profileRef.$set(user.uid, profile);
    $scope.login();
  }, function (error){
    $scope.error = error;
  });
};

};
