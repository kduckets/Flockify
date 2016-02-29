'use strict';

app.controller('NavCtrl', function ($scope, $location, Post, Auth, $cookieStore, $rootScope) {
  $scope.post = {artist: '', album: ''};
  $scope.user = Auth.user;
  $scope.signedIn = Auth.signedIn;
//   $scope.logout = function(){
//   	Auth.logout;
//   	console.log('got here');
//   	  if($cookieStore.get('login')){
//   	    $cookieStore.remove('login');
//   	};
  	
// };
$scope.logout = Auth.logout;

    var history = [];

    $rootScope.$on('$routeChangeSuccess', function() {
        history.push($location.$$path);
    });

    $rootScope.back = function () {
        var prevUrl = history.length > 1 ? history.splice(-2)[0] : "/";
        $location.path(prevUrl);
    };
   

});