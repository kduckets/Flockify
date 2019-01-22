module.exports = function ($scope, $location, Post, Auth, $cookieStore, $rootScope, $timeout, $mdSidenav,
                           $anchorScroll, $window, $mdToast, $mdDialog, FIREBASE_URL, $rootScope, Users, $firebaseArray, $firebaseObject) {

  var ref = firebase.database().ref();
  var usersRef = firebase.database().ref("users");
  // var notificationRef = new Firebase(FIREBASE_URL+"/notifications");
  $scope.post = {artist: '', album: ''};
  var postsRef = firebase.database().ref("posts");
  var notificationRef = firebase.database().ref("notifications");
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

  $scope.auth = Auth;
  $scope.auth.$onAuthStateChanged(function(firebaseUser) {
    if (firebaseUser) {
      // $scope.subscribed_groups = Users.subscribed_groups.groups;
      // $scope.current_group = Users.current_group;
      // $scope.current_group_name = Users.current_group_name;
      // $scope.user = Users.getProfile(firebaseUser.uid);
      var subscribed_groups = {'groups': [{id:'firsttoflock', group_name: 'The Flock'}]};
      $scope.subscribed_groups = subscribed_groups.groups;

      $scope.user = $firebaseObject(usersRef.child(firebaseUser.uid));
      //$scope.subscribed_groups = Users.subscribed_groups.groups;
      $scope.current_group = 'firsttoflock';
      $scope.current_group_name = 'firsttoflock'
      $scope.notifications = $firebaseArray(ref.child('notifications').child(firebaseUser.uid).child($scope.current_group).child('actions'));
      $scope.show_notifications = $firebaseObject(ref.child('notifications').child(firebaseUser.uid).child($scope.current_group).child('actions').child('new'));
      $scope.show_notifications.$loaded().then(function(data) {
      $scope.new_notifications = data.$value;
          console.log($scope.new_notifications);
    })

    } else {
      //$scope.user = null;
      // $scope.username = null;
      console.log("User is logged out");
    }
  });

  // $scope.look_for_new_posts = function(){
  //
  // if(firebaseUser){
  //
  //   $scope.new_posts = [];
  //
  //    usersRef.child(firebaseUser.uid).child('groups').once('value', function(groups) {
  //      $scope.groups = groups.val();
  //
  //   $.each($scope.groups, function(key, value) {

   // postsRef.child(key).limitToLast(2).on("child_added", function(snap) {
   //
   //   if(snap.key() != 'flock_groupchat'){
   //    if(value == snap.key()) {
   //      $scope.new_posts[key] = false;
   //      return;
   //    }
   //    if(key == Users.current_group) {
   //      var last_post_id = {};
   //        last_post_id[key] = snap.key();
   //
   //      usersRef.child($scope.user.$id).child('groups').update(last_post_id);
   //       $scope.new_posts[key] = false;
   //      return;
   //
   //    }if(value != snap.key()){
   //    $scope.new_posts[key] = 'New post!';
   //    console.log('new post', value, snap.key());
   //    }
   //     }
   //    });
  //     })
  //
  // });
  //    }
  //  };

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
      notificationRef.child($scope.firebaseUser.uid).child('firsttoflock').child('actions').update({ new: false });
      $scope.new_notifications = false;
    };

  $scope.close = function () {

  };

  $scope.logout = function () {
    Auth.$signOut();
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
