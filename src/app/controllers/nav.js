module.exports = function ($scope, $location, Post, Auth, $cookieStore, $rootScope, $timeout, $mdSidenav, 
  $anchorScroll, $window, $mdToast, FIREBASE_URL, $rootScope) {

  $scope.post = {artist: '', album: ''};
  $scope.user = Auth.user;
  $scope.signedIn = Auth.signedIn;
  $scope.toggleMenu = buildToggler('right');
  // var postsRef = new Firebase(FIREBASE_URL+"/posts");
  var chatRef = new Firebase(FIREBASE_URL+"/comments/flock_groupchat");
  
// postsRef.limitToLast(1).on("child_added", function(snap) {
//    if($cookieStore.get('last_post') == snap.key()) {
//        return;
//    } 
//    // if($cookieStore.get('last_post') > 0) {
//    //        $mdToast.show(
//    //        $mdToast.simple()
//    //        .textContent('There are ' + $cookieStore.get('last_post') + " new posts since your last visit.")
//    //        .position('bottom right' )
//    //        .hideDelay(3000)
//    //        );
//    //     return;
//    // } 
//    else{
//     $cookieStore.put('last_post', snap.key());
//      $mdToast.show(
//           $mdToast.simple()
//           .textContent('New post by ' + snap.val().creator)
//           .position('bottom right' )
//           .hideDelay(3000)
//           );
//    }
//   });

 chatRef.limitToLast(1).on("child_added", function(snap) {
  if($scope.signedIn()){
   if($cookieStore.get('last_chat') == snap.key()) {
       return;
   }
   else {
    $cookieStore.put('last_chat', snap.key());
     $mdToast.show(
          $mdToast.simple()
          .textContent('New chat message from ' + snap.val().creator)
          .position('bottom right')
          .hideDelay(3000)
          );
   }
   };
  });


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
   
     var init = function () {
    //  postsRef.limitToLast(1).on("child_added", function(snap) {
    //   if($cookieStore.get('last_post') == snap.key()){
    //     return;
    //   }
    //   if(!$cookieStore.get('last_post')){
    //       $cookieStore.put('last_post', snap.key());
    //       return;
    //   }
    // });
    if($scope.signedIn()){
      chatRef.limitToLast(1).on("child_added", function(snap) {
      if($cookieStore.get('last_chat') == snap.key()){
        return;
      }
       if(!$cookieStore.get('last_chat')){
          $cookieStore.put('last_chat', snap.key());
          return;
      }

  });
    };
    };



 init();

};
