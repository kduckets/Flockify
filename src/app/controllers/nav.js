module.exports = function ($scope, $location, Post, Auth, $cookieStore, $rootScope, $timeout, $mdSidenav) {

  $scope.post = {artist: '', album: ''};
  $scope.user = Auth.user;
  $scope.signedIn = Auth.signedIn;
  $scope.toggleMenu = buildToggler('right');

  $scope.$on('$routeChangeStart', function(next, current) { 
       $mdSidenav('right').close()
        .then(function () {
         //done
        });
 });


     function buildToggler(navID) {
      return function() {
        $mdSidenav(navID)
          .toggle()
          .then(function () {
        //done
          });
      }
    }

    $scope.close = function () {
  
      };
//   $scope.logout = function(){
//    Auth.logout;
//    console.log('got here');
//      if($cookieStore.get('login')){
//        $cookieStore.remove('login');
//    };
    
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
   

};
