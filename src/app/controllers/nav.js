module.exports = function ($scope, $location, Post, Auth, $cookieStore, $rootScope, $timeout, $mdSidenav,
                           $anchorScroll, $window, $mdToast, $mdDialog, FIREBASE_URL, $rootScope, Users) {

  var ref = new Firebase(FIREBASE_URL);
  // var notificationRef = new Firebase(FIREBASE_URL+"/notifications");
  $scope.post = {artist: '', album: ''};

  // notificationRef.on('child_added', function(childSnapshot, prevChildKey) {
    
  //   //new notification for current user

  // });

  $scope.subscribed_groups = Users.subscribed_groups.groups;
  $scope.current_group = Users.current_group;
  $scope.current_group_name = Users.current_group_name;

  ref.onAuth(function (authData) {
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

  $scope.change_group = function() {
    console.log("change group", $scope.current_group);
    Users.set_current_group($scope.current_group);
  };

  $scope.closeToast = function () {
    if (isDlgOpen) return;
    $mdToast
      .hide()
      .then(function () {
        isDlgOpen = false;
      });
  };

  $scope.toTop = function () {
    $window.scrollTo(0, 0);
    $location.path("/#/");
  };

  $scope.$on('$routeChangeStart', function (next, current) {
    $mdSidenav('right').close()
      .then(function () {
        //done
      });
  });
  function buildToggler(navID) {
    return function () {
      $mdSidenav(navID)
        .toggle()
        .then(function () {
          //done
        });
    }
  }

  $scope.close = function () {

  };

  $scope.logout = function () {
    ref.unauth();
    window.location.reload();
  };

  var history = [];

  $rootScope.$on('$routeChangeSuccess', function () {
    history.push($location.$$path);
  });

  $rootScope.back = function () {
    var prevUrl = history.length > 1 ? history.splice(-2)[0] : "/";
    $location.path(prevUrl);
  };

};
