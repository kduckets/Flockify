'use strict';
app.controller('PodcastsCtrl', function($scope, $route, $location, $window, Post, Auth, Spotify,$uibModal, 
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
         $scope.mediaResults = [];
         $scope.searching = true;
         var type = "podcast";
         $http
           .jsonp('https://itunes.apple.com/search', { params: { term: $scope.searchTerm, entity: type, limit: 15, callback: 'JSON_CALLBACK' } })
           .success(function (response) { 

             $scope.results = response.results; 
             console.log($scope.results);


           })
          .finally(function () { $scope.searching = false; });

     //     var body = {'search': $scope.searchTerm};
     // $http.post('/api/podcastsearch', body)

     //        .success(function(data) {
                
     //            $scope.results = data.results;
     //            console.log($scope.results);
           
     //        })
     //        .error(function(data) {
     //            console.log('Error: ' + data);
     //        });

      };

 $scope.viewPodcast = function(podcast){
 var modalInstance = $uibModal.open({
    templateUrl: 'views/podcastPost.html',
    scope: $scope,
    controller: 'PodcastCtrl',
    resolve: {
      podcast: function () {
        return podcast;
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

        ref.child('user_scores').child(post.creator).child('podcast_score').on("value", function(snapshot) {
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
       post.votes +=2;
        Post.vote(post.$id, post.votes);
       post.stars +=1;
      Post.star(post.$id, post.stars);
        Profile.setStar($scope.user.uid, post.$id, 'gold');
            $scope.score = $scope.score + 2;
            $scope.user_stars = $scope.user_stars + 1;
        ref.child("user_scores").child(post.creator).update({'podcast_score': $scope.score});
        ref.child("user_scores").child(post.creator).update({'stars': $scope.user_stars});
      
    };
    
});
};

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

ref.child('user_scores').child(post.creator).child('podcast_score').on("value", function(snapshot) {
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
        ref.child("user_scores").child(post.creator).update({'podcast_score': $scope.score});
        // ref.child("user_scores").child(post.creatorUID).update({'score': $scope.score});
    };
    
});
};
  
};

  $scope.downvote = function(post) {

    if($scope.signedIn() && $scope.user.uid != post.creatorUID){
      
   ref.child('user_scores').child(post.creator).child('podcast_score').on("value", function(snapshot) {
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
        ref.child("user_scores").child(post.creator).update({'podcast_score': $scope.score});
        // ref.child("user_scores").child(post.creatorUID).update({'score': $scope.score});

    };
    
});
};
  
};



});




  
