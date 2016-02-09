'use strict';
app.controller('PostsCtrl', function($scope, $route, $location, Post, Auth, Spotify,$uibModal, Profile, $firebase){

 $scope.posts = Post.all;
 $scope.user = Auth.user;

  $scope.post = {artist: '', album: '', votes: 0};
  $scope.user = Auth.user;
  $scope.signedIn = Auth.signedIn;
  $scope.logout = Auth.logout;
  var ref = new Firebase("https://flockify.firebaseio.com");

 // console.log('upvotes' + $scope.post.upvotes);

 $scope.search = function(){
   Spotify.search($scope.post.search, 'artist,album').then(function (data) {
    
  $scope.results = data.albums.items;

});

 };

 $scope.viewAlbum = function(album){
 var modalInstance = $uibModal.open({
    templateUrl: 'views/album.html',
    scope: $scope,
    controller: 'AlbumCtrl',
    resolve: {
      album: function () {
        return album;
      }
    }
});

 };

$scope.clearResults = function(){

  $route.reload();
};

 $scope.submitPost = function (album) {
  $scope.post.creator = $scope.user.profile.username;
  $scope.post.creatorUID = $scope.user.uid;
  $scope.post.album = album;
  Post.create($scope.post).then(function (ref) {
    $location.path('/posts/' + ref.name());
    $scope.post = {artist: '', album: ''};
  });
};

  $scope.post = {artist: '', album: '', votes: 0};

  $scope.deletePost = function (post) {
    Post.delete(post);
  	};
	
  $scope.upvote = function(post) {
    if($scope.signedIn()){

    $scope.current_vote = $firebase(ref.child('user_votes').child($scope.user.uid).child(post.$id).child('vote')).$asObject();
    $scope.current_vote.$loaded().then(function(res) {

    if(res.$value == 'up'){
      //do nothing
    };
    if(res.$value == 'down' || !res.$value){
        post.votes +=1;
        Post.vote(post.$id, post.votes);
        Profile.setVote($scope.user.uid, post.$id, 'up');
    };
    
});
};
  
};

  $scope.downvote = function(post) {

    if($scope.signedIn()){
    $scope.current_vote = $firebase(ref.child('user_votes').child($scope.user.uid).child(post.$id).child('vote')).$asObject();
    $scope.current_vote.$loaded().then(function(res) {
    if(res.$value == 'down'){
      //do nothing
    };

    if(res.$value == 'up' || !res.$value){
        post.votes -=1;
        Post.vote(post.$id, post.votes);
        Profile.setVote($scope.user.uid, post.$id, 'down');
    };
    
});
};
  
};

});


  
