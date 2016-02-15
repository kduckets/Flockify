'use strict';

app.controller('NavCtrl', function ($scope, $location, Post, Auth, $cookieStore) {
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
   

});