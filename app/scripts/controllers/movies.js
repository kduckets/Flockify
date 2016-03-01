'use strict';
app.controller('MoviesCtrl', function($scope, $route, $location, $window, Post, Auth, Spotify,$uibModal, 
  Profile, $firebase, $filter, $http){

 $scope.posts = Post.all;
 $scope.user = Auth.user;

  $scope.post = {artist: '', album: '', votes: 0, comments: 0, stars:0};
  $scope.user = Auth.user;
  $scope.signedIn = Auth.signedIn;
  $scope.logout = Auth.logout;
  var ref = new Firebase("https://flockify.firebaseio.com");
  $scope.sorter = '-';
  
 
 $scope.getNumber = function(num) {
    return new Array(num);   
};



      $scope.search = function () {
       $http({
        method: 'GET',
        url: 'http://www.omdbapi.com/?s=' + $scope.searchTerm + "&r=json&tomatoes=true&apikey=973fea0"
          }).then(function successCallback(response) {
          $scope.results = response.data.Search; 
            
         }, function errorCallback(response) {
        });

        // $scope.mediaResults = [];
        //  $scope.searching = true;
        //  var type = "movie";
        //  $http
        //    .jsonp('https://itunes.apple.com/search', { params: { term: $scope.searchTerm, entity: type, limit: 10, callback: 'JSON_CALLBACK' } })
        //    .success(function (resp) { 

        //      $scope.itunes_data = resp.results[0];
        //      $scope.movie.image = $scope.itunes_data.artworkUrl100; 
         


        //    })
        //   .finally(function () { $scope.searching = false; });
         
      };

 $scope.viewMovie = function(movie){
 var modalInstance = $uibModal.open({
    templateUrl: 'views/moviePost.html',
    scope: $scope,
    controller: 'MovieCtrl',
    resolve: {
      movie: function () {
        return movie;
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



});




  
