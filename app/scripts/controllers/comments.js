'use strict';

app.controller('CommentsCtrl', function ($scope, $routeParams, Post, Auth, $firebase, Profile, $http) {
  var ref = new Firebase("https://flockify.firebaseio.com");
    $scope.user = Auth.user;
  $scope.signedIn = Auth.signedIn;
  $scope.logout = Auth.logout;
   $scope.posts = Post.all;
    $scope.user = Auth.user;
  $scope.post = Post.get($routeParams.postId);
  $scope.comments = Post.comments($routeParams.postId);
  $scope.gifSearchText = '';
  

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

  $scope.comment_upvote = function(comment) {
  comment.votes +=1;
  Post.commentVote($routeParams.postId, comment.$id, comment.votes);

};

  $scope.comment_downvote = function(comment) {
  comment.votes -=1;
  Post.commentVote($routeParams.postId, comment.$id, comment.votes);

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