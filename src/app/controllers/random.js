module.exports = function ($scope, $routeParams, Profile, Post, Auth, $firebaseArray, FIREBASE_URL, Users,
  $location, $filter, Concert, Notification, $http, bandsintownFactory, $route, $firebaseObject, $window, $firebaseAuth) {
  var ref = firebase.database().ref();
  var auth = $firebaseAuth();
  auth.$onAuthStateChanged(function(user) {
  var user_id = user.uid;
  var authData = Auth.$getAuth();
  $scope.allAlbums = [];

  if (authData) {
     $scope.user = Users.getProfile(authData.uid);
     $scope.username = $scope.user.username;
     // Profile.getPosts(authData.uid).then(function(posts) {
     //  //add posts to array
     //  angular.forEach(posts, function(post, key) {
     //    $scope.allAlbums.push(post.$id);
     //  });
     // Profile.getLikes(authData.uid).then(function(likes) {
     //  //add likes to array
     //  angular.forEach(likes, function(like, key) {
     //    $scope.allAlbums.push(like.$id);
     //  });
     $firebaseArray(ref.child('posts').child('firsttoflock')).$loaded(function(data){
       angular.forEach(data, function(album, key) {
         if(album.media_info){
         $scope.allAlbums.push(album.$id);
       }
     })
     $scope.randomAlbum = $scope.allAlbums[Math.floor(Math.random() * $scope.allAlbums.length)];
     $window.location.href = '/#/albums/' + $scope.randomAlbum;
     });
      //get random from array

    } else {
    $scope.user = null;
    $scope.username = null;
    $location.path('/login');
    console.log("User is logged out");
  }

  $scope.getUsername = function(userId){
    return Users.getUsername(userId);
  }
})
};
