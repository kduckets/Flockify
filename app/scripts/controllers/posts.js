'use strict';
app.controller('PostsCtrl', function($scope, $route, $location, $window, Post, Auth, Spotify,$uibModal, Profile, $firebase){

 $scope.posts = Post.all;
 $scope.user = Auth.user;

  $scope.post = {artist: '', album: '', votes: 0, comments: 0};
  $scope.user = Auth.user;
  $scope.signedIn = Auth.signedIn;
  $scope.logout = Auth.logout;
  var ref = new Firebase("https://flockify.firebaseio.com");

  // console.log('score', $scope.user_score);
   

  $scope.sorter = '-votes';

    $scope.$watch('sorter', function(){
      $scope.timer && $window.clearTimeout($scope.timer);
      $scope.timer = $window.setTimeout(rearrange, 80);
    });

    function rearrange(){
      var currNewTop = $('.container')[0].scrollTop;
      $('.post').each(function(index, el){
        var $el = $(el);
        var currHeight = parseInt($el.css('height'));

        if (currNewTop != parseInt($el.css('top'))) {
          $el.css({
            'top': currNewTop
          })
          .one('webkitTransitionEnd', function (evt){
            $(evt.target).removeClass('moving');
          })
          .addClass('moving');  
        }
        currNewTop += currHeight;
      });
    }
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

    };
    
});
};
  
};




});




  
