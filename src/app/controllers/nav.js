module.exports = function ($scope, $location, Post, Auth, $cookieStore, $rootScope, $timeout, $mdSidenav, 
  $anchorScroll, $window, $mdToast, FIREBASE_URL, $rootScope, Users) {

  var ref = new Firebase(FIREBASE_URL);
  $scope.post = {artist: '', album: ''};
  ref.onAuth(function(authData) {
  if (authData) {
    //set login cookie
     $scope.user = Users.getProfile(authData.uid);
     // $scope.username = Users.getUsername(authData.uid);
  } else {
    $scope.user = null;
    // $scope.username = null;
    console.log("User is logged out");
  }
});
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
      
    $scope.logout = function(){
      ref.unauth();
    };

    var history = [];

    $rootScope.$on('$routeChangeSuccess', function() {
        history.push($location.$$path);
    });

    $rootScope.back = function () {
        var prevUrl = history.length > 1 ? history.splice(-2)[0] : "/";
        $location.path(prevUrl);
    };

};
