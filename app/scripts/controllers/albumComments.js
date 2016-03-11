'use strict';

app.controller('AlbumCommentsCtrl', function ($scope, $routeParams, Post, Auth, $firebase, Profile, $http, $filter, $sce, $uibModal) {
  var ref = new Firebase("https://flockify.firebaseio.com");
    $scope.user = Auth.user;
  $scope.signedIn = Auth.signedIn;
  $scope.logout = Auth.logout;
   $scope.posts = Post.all;
    $scope.user = Auth.user;
  $scope.post = Post.get($routeParams.postId);
  $scope.comments = Post.comments($routeParams.postId);
  $scope.gifSearchText = '';
  // $scope.embed_link = $sce.trustAsResourceUrl("https://embed.spotify.com/?uri=spotify:album:6SwMUCcHLfZjji3MAFODMv"); 
  

   $scope.gifsearch = function(){

  var body = {'search': $scope.gifSearchText};
     $http.post('/api/giphysearch', body)

            .success(function(data) {
                
                $scope.gifs = data.data;
           
            })
            .error(function(data) {
                console.log('Error: ' + data);
            });

   };   

     $scope.deletePost = function (post) {
    //Post.delete(post.$id);
    var postsRef = new Firebase('https://flockify.firebaseio.com/posts/'+post.$id);
    postsRef.remove();
    };


  $scope.addComment = function (gif) {
    // if(!$scope.commentText || $scope.commentText === '') {
    //   return;
    // }

    var comment = {
      // text: $scope.commentText,
      text: gif,
      creator: $scope.user.profile.username,
      creatorUID: $scope.user.uid,
      votes: 0
    };
    $scope.comments.$add(comment);

    $scope.commentText = '';
    $scope.gifSearchText = '';

    ref.once("value", function(snapshot) {
  $scope.comments_count = snapshot.child("comments").child($scope.post.$id).numChildren();
   ref.child("posts").child($scope.post.$id).update({'comments': $scope.comments_count});
  
   var date = new Date();
   date.setMinutes(date.getTimezoneOffset());
    var today = $filter('date')(new Date(),'yyyy-MM-dd HH:mm:ss Z');
    ref.child("posts").child($scope.post.$id).update({'latest_comment': today});

   
  });


  };


  $scope.deleteComment = function (comment) {
  $scope.comments.$remove(comment);
     ref.once("value", function(snapshot) {
  $scope.comments_count = snapshot.child("comments").child($scope.post.$id).numChildren();
  console.log($scope.comments_count);
   ref.child("posts").child($scope.post.$id).update({'comments': $scope.comments_count});
   
  });
};

 $scope.getNumber = function(num) {
    return new Array(num);   
};

  $scope.save = function(post) {
    if($scope.signedIn() && $scope.user.uid != post.creatorUID){

        Profile.savePost($scope.user.uid, post.$id, 'yes');
  
    };
    
};


  $scope.upvote = function(post) {
    if($scope.signedIn() && $scope.user.uid != post.creatorUID){

ref.child('user_scores').child(post.creator).child('album_score').on("value", function(snapshot) {
  $scope.score = snapshot.val();
});

ref.child('user_scores').child(post.creator).child('weekly_scores').child('album_score').on("value", function(snapshot) {
  $scope.weekly_score = snapshot.val();
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
      $scope.weekly_score = $scope.weekly_score + 1;
        ref.child("user_scores").child(post.creator).update({'album_score': $scope.score});
        ref.child("user_scores").child(post.creator).child('weekly_scores').update({'album_score': $scope.weekly_score});
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

   ref.child('user_scores').child(post.creator).child('weekly_scores').child('album_score').on("value", function(snapshot) {
  $scope.weekly_score = snapshot.val();
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
        $scope.weekly_score = $scope.weekly_score - 1;
        ref.child("user_scores").child(post.creator).update({'album_score': $scope.score});
        ref.child("user_scores").child(post.creator).child('weekly_scores').update({'album_score': $scope.weekly_score});
        // ref.child("user_scores").child(post.creatorUID).update({'score': $scope.score});

    };


    
});
};
  
};


$scope.starPost = function(post){
      if($scope.signedIn() && $scope.user.uid != post.creatorUID){

        ref.child('user_scores').child(post.creator).child('album_score').on("value", function(snapshot) {
  $scope.score = snapshot.val();
});

        ref.child('user_scores').child(post.creator).child('stars').on("value", function(snapshot) {
  $scope.user_stars = snapshot.val();
});

        ref.child('user_scores').child(post.creator).child('weekly_scores').child('album_score').on("value", function(snapshot) {
  $scope.weekly_score = snapshot.val();
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
            $scope.weekly_score = $scope.weekly_score + 2;
        ref.child("user_scores").child(post.creator).update({'album_score': $scope.score});
        ref.child("user_scores").child(post.creator).update({'stars': $scope.user_stars});
        ref.child("user_scores").child(post.creator).child('weekly_scores').update({'album_score': $scope.weekly_score});
       
    };
    
});
};

 };


});