'use strict';
app.controller('PostsCtrl', function($scope, $route, $location, $window, Post, Auth, Spotify,$uibModal, Profile, $firebase, $filter){

 $scope.posts = Post.all;
 $scope.user = Auth.user;

  $scope.post = {artist: '', album: '', votes: 0, comments: 0, stars:0};
  $scope.user = Auth.user;
  $scope.signedIn = Auth.signedIn;
  $scope.logout = Auth.logout;
  var ref = new Firebase("https://flockify.firebaseio.com");
  $scope.categories = $firebase(ref.child('categories')).$asArray();
  $scope.selectedCat = 'all albums';
  $scope.sorter = '-';
  



  $scope.selectCat = function(selectedCat){
      if(selectedCat == 'all albums'){
    $scope.catFilter = '';
    $scope.selectedCat = 'all albums';
     $scope.sorter = '-';
  }else{
  $scope.selectedCat = selectedCat;
  $scope.catFilter = $scope.selectedCat;
  $scope.sorter = '-votes';
};

};
 
 $scope.getNumber = function(num) {
    return new Array(num);   
};

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

  $scope.starPost = function(post){
     if($scope.signedIn() && $scope.user.uid != post.creatorUID){
 var modalInstance = $uibModal.open({
    templateUrl: 'views/star.html',
    scope: $scope,
    controller: 'StarCtrl',
    resolve: {
      post: function () {
        return post;
      }
    }
});
}
 };

 $scope.addCategory = function(){
  ref.child("categories").child($scope.new_category).update({'description': $scope.new_description});

 };

$scope.clearResults = function(){

  $route.reload();
};

  $scope.deletePost = function (post) {
    Post.delete(post);
  	};
	
  $scope.upvote = function(post) {
    if($scope.signedIn() && $scope.user.uid != post.creatorUID){

ref.child('user_scores').child(post.creator).child('score').on("value", function(snapshot) {
  $scope.score = snapshot.val();
});

      $scope.current_vote = $firebase(ref.child('user_votes').child($scope.user.uid).child(post.$id).child('vote')).$asObject();
    $scope.current_vote.$loaded().then(function(res) {

    if(res.$value == 'up'){
      //do nothing
    };
    if(res.$value == 'down' || !res.$value){
        post.votes +=1;
        Post.vote(post.$id, post.votes);
        Profile.setVote($scope.user.uid, post.$id, 'up');
      $scope.score = $scope.score + 1;
        ref.child("user_scores").child(post.creator).update({'score': $scope.score});
        // ref.child("user_scores").child(post.creatorUID).update({'score': $scope.score});
    };
    
});
};
  
};

  $scope.downvote = function(post) {

    if($scope.signedIn() && $scope.user.uid != post.creatorUID){
      
   ref.child('user_scores').child(post.creator).child('score').on("value", function(snapshot) {
  $scope.score = snapshot.val();
});

    $scope.current_vote = $firebase(ref.child('user_votes').child($scope.user.uid).child(post.$id).child('vote')).$asObject();
    $scope.current_vote.$loaded().then(function(res) {
    if(res.$value == 'down'){
      //do nothing
    };

    if(res.$value == 'up' || !res.$value){
        post.votes -=1;
        Post.vote(post.$id, post.votes);
        Profile.setVote($scope.user.uid, post.$id, 'down');
        $scope.score = $scope.score - 1;
        ref.child("user_scores").child(post.creator).update({'score': $scope.score});
        // ref.child("user_scores").child(post.creatorUID).update({'score': $scope.score});

    };
    
});
};
  
};

// $scope.batchUpdate = function(){

//    var today = $filter('date')(new Date(),'yyyy-MM-dd HH:mm:ss');

//    angular.forEach($scope.posts, function(post) {
//     ref.child("posts").child(post.$id).update({'latest_comment': today});
// });

  
// }



});




  
