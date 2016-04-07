module.exports = function ($scope, $location, Post, Auth, $cookieStore, $rootScope, $timeout, $mdSidenav, 
  $anchorScroll, $window, $mdToast, FIREBASE_URL, $rootScope) {

  $scope.post = {artist: '', album: ''};
  $scope.user = Auth.user;
  $scope.signedIn = Auth.signedIn;
  $scope.toggleMenu = buildToggler('right');
  // var postsRef = new Firebase(FIREBASE_URL+"/posts");

  $scope.closeToast = function() {
    if (isDlgOpen) return;
    $mdToast
    .hide()
    .then(function() {
      isDlgOpen = false;
        });
      };

  $scope.toTop = function(){
  $window.scrollTo(0,0);
  $location.path("/#/");
  };

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
