'use strict';
app.controller('PostsCtrl', function($scope, $route, $location, $window, Post, Auth, Spotify,$uibModal, Profile, $firebase, $filter){

 $scope.posts = Post.all;
 $scope.user = Auth.user;

  $scope.post = {artist: '', album: '', votes: 0, comments: 0, stars:0};
  $scope.user = Auth.user;
  $scope.signedIn = Auth.signedIn;
  $scope.logout = Auth.logout;
  var ref = new Firebase("https://flockify.firebaseio.com");
  $scope.sorter = '-';
  

  $scope.albumPosts = {};
angular.forEach($scope.posts, function(item, key) {
    if ($scope.post.media_type == 'spotify') { $scope.albumPosts[key] = item; };
});
 
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
    templateUrl: 'views/albumPost.html',
    scope: $scope,
    controller: 'AlbumCtrl',
    resolve: {
      album: function () {
        return album;
      }
    }
});

 };

//   $scope.starPost = function(post){
//      if($scope.signedIn() && $scope.user.uid != post.creatorUID){
//  var modalInstance = $uibModal.open({
//     templateUrl: 'views/star.html',
//     scope: $scope,
//     controller: 'StarCtrl',
//     resolve: {
//       post: function () {
//         return post;
//       }
//     }
// });
// }
//  };

  $scope.starPost = function(post){
      if($scope.signedIn() && $scope.user.uid != post.creatorUID){

        ref.child('user_scores').child(post.creator).child('album_score').on("value", function(snapshot) {
  $scope.score = snapshot.val();
});

        ref.child('user_scores').child(post.creator).child('stars').on("value", function(snapshot) {
  $scope.user_stars = snapshot.val();
});

    $scope.current_vote = $firebase(ref.child('user_votes').child($scope.user.uid).child(post.$id).child('star')).$asObject();
    $scope.current_vote.$loaded().then(function(res) {

    if(res.$value == 'gold'){
      $scope.text = "looks like you already gave this album a star";
    };
    if(!res.$value){
       post.stars +=1;
      Post.star(post.$id, post.stars);
        Profile.setStar($scope.user.uid, post.$id, 'gold');
            $scope.score = $scope.score + 2;
            $scope.user_stars = $scope.user_stars + 1;
        ref.child("user_scores").child(post.creator).update({'album_score': $scope.score});
        ref.child("user_scores").child(post.creator).update({'stars': $scope.user_stars});
       
    };
    
});
};

 };


$scope.clearResults = function(){

  $route.reload();
};

  $scope.deletePost = function (post) {
    Post.delete(post);
  	};
	
  $scope.upvote = function(post) {
    if($scope.signedIn() && $scope.user.uid != post.creatorUID){

ref.child('user_scores').child(post.creator).child('album_score').on("value", function(snapshot) {
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
        ref.child("user_scores").child(post.creator).update({'album_score': $scope.score});
        // ref.child("user_scores").child(post.creatorUID).update({'score': $scope.score});
    };
    
});
};
  
};

  $scope.downvote = function(post) {

    if($scope.signedIn() && $scope.user.uid != post.creatorUID){
      
   ref.child('user_scores').child(post.creator).child('album_score').on("value", function(snapshot) {
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
        ref.child("user_scores").child(post.creator).update({'album_score': $scope.score});
        // ref.child("user_scores").child(post.creatorUID).update({'score': $scope.score});

    };


    
});
};
  
};

//   $scope.meh = function(post) {

//     if($scope.signedIn() && $scope.user.uid != post.creatorUID){
      
//    ref.child('user_scores').child(post.creator).child('score').on("value", function(snapshot) {
//   $scope.score = snapshot.val();
// });

//     $scope.current_vote = $firebase(ref.child('user_votes').child($scope.user.uid).child(post.$id).child('vote')).$asObject();
//     $scope.current_vote.$loaded().then(function(res) {
//     if(res.$value == 'meh' ){
//       //do nothing
//     };

//     if(res.$value == 'up'){
//         post.votes -=1;
//         Post.vote(post.$id, post.votes);
//         Profile.setVote($scope.user.uid, post.$id, 'meh');
//         $scope.score = $scope.score - 1;
//         ref.child("user_scores").child(post.creator).update({'score': $scope.score});
//         // ref.child("user_scores").child(post.creatorUID).update({'score': $scope.score});

//     };

//         if(res.$value == 'down' ){
//         post.votes +=1;
//         Post.vote(post.$id, post.votes);
//         Profile.setVote($scope.user.uid, post.$id, 'meh');
//       $scope.score = $scope.score + 1;
//         ref.child("user_scores").child(post.creator).update({'score': $scope.score});
//         // ref.child("user_scores").child(post.creatorUID).update({'score': $scope.score});
//     };
    
// });
// };
  
// };

 // $scope.batchUpdate = function(){

 //   var today = $filter('date')(new Date(),'yyyy-MM-dd HH:mm:ss');

 //   angular.forEach($scope.posts, function(post) {
 //    ref.child("posts").child(post.$id).update({'media_type': 'spotify'});
 // });

  
 // }



});




  
