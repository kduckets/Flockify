'use strict';

app.controller('CommentsCtrl', function ($scope, $routeParams, Post, Auth, $firebase, Profile, $http, $filter, $sce, $uibModal, FIREBASE_URL) {
  var ref = new Firebase(FIREBASE_URL);
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
        Post.delete(post.$id);
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
   var today = $filter('date')(new Date(),'yyyy-MM-dd HH:mm:ss');
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


});
