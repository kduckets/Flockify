module.exports = function ($scope, $location, Post, Auth, $cookieStore, $rootScope, $timeout, $mdSidenav,
                           $anchorScroll, $window, $mdToast, $mdDialog, FIREBASE_URL, $rootScope, Users, $firebaseArray) {

  var ref = new Firebase(FIREBASE_URL);
  var usersRef = new Firebase(FIREBASE_URL+'/users');
  // var notificationRef = new Firebase(FIREBASE_URL+"/notifications");
  $scope.post = {artist: '', album: ''};
  var postsRef = new Firebase(FIREBASE_URL+"/posts/");
  $scope.toggleMenu = buildToggler('right');
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

    $scope.closeToast = function () {
    if (isDlgOpen) return;
    $mdToast
      .hide()
      .then(function () {
        isDlgOpen = false;
      });
  };

  // notificationRef.on('child_added', function(childSnapshot, prevChildKey) {

  //   //new notification for current user

  // });

  ref.onAuth(function (authData) {
    if (authData && Users.current_group) {
      $scope.subscribed_groups = Users.subscribed_groups.groups;
      $scope.current_group = Users.current_group;
      $scope.current_group_name = Users.current_group_name;
      $scope.user = Users.getProfile(authData.uid);
      $scope.notifications = $firebaseArray(ref.child('notifications').child(Users.current_user_id).child($scope.current_group).child('actions'));
  console.log($scope.notifications);

      // $scope.username = Users.getUsername(authData.uid);
    } else {
      $scope.user = null;
      // $scope.username = null;
      console.log("User is logged out");
    }
  });

  $scope.look_for_new_posts = function(){

  if($scope.user){

    $scope.new_posts = [];

     usersRef.child($scope.user.$id).child('groups').once('value', function(groups) {
       $scope.groups = groups.val();

    $.each($scope.groups, function(key, value) {

   postsRef.child(key).limitToLast(2).on("child_added", function(snap) {

     if(snap.key() != 'flock_groupchat'){
      if(value == snap.key()) {
        $scope.new_posts[key] = false;
        return;
      }
      if(key == Users.current_group) {
        var last_post_id = {};
          last_post_id[key] = snap.key();

        usersRef.child($scope.user.$id).child('groups').update(last_post_id);
         $scope.new_posts[key] = false;
        return;

      }if(value != snap.key()){
      $scope.new_posts[key] = 'New post!';
      console.log('new post', value, snap.key());
      }
       }
      });
      })

  });
     }
   };

  $scope.change_group = function() {
    console.log("change group", $scope.current_group);
    Users.set_current_group($scope.current_group);
  };

  $scope.toTop = function () {
    $window.scrollTo(0, 0);
    $location.path("/#/");
  };

  $scope.openNotifications = function($mdOpenMenu, ev) {
      originatorEv = ev;
      $mdOpenMenu(ev);
      $scope.notifications.length == 0;
    };

  $scope.close = function () {

  };

  $scope.logout = function () {
    ref.unauth();
    window.location.reload();
  };

  var history = [];

  // $rootScope.$on('$routeChangeSuccess', function () {
  //   history.push($location.$$path);
  // });

  // $rootScope.back = function () {
  //   var prevUrl = history.length > 1 ? history.splice(-2)[0] : "/";
  //   $location.path(prevUrl);
  // };


};
