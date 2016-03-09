'use strict';

app.controller('StarCtrl', function ($scope, $route, $location, $window, Post, Auth, $http, $cookies, $modalInstance, $firebase, post, Profile, FIREBASE_URL) {

  $scope.user = Auth.user;
  $scope.signedIn = Auth.signedIn;
  $scope.logout = Auth.logout;
  $scope.post = post;
   var ref = new Firebase(FIREBASE_URL);

      $scope.current_vote = $firebase(ref.child('user_votes').child($scope.user.uid).child(post.$id).child('star')).$asObject();
    $scope.current_vote.$loaded().then(function(res) {

    if(res.$value == 'gold'){
      $scope.hideButtons = false;
      $scope.text = "Looks like you already gave this post a star";
    }

    else
    {
         $scope.hideButtons = true;
      $scope.text = "Are you sure you want to give this post a star?";
    };
  });

    $scope.cancel = function(){
     $modalInstance.close();

  };

  $scope.addStar = function(post){
      if($scope.signedIn() && $scope.user.uid != post.creatorUID){

        ref.child('user_scores').child(post.creator).child('score').on("value", function(snapshot) {
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
        ref.child("user_scores").child(post.creator).update({'score': $scope.score});
        ref.child("user_scores").child(post.creator).update({'stars': $scope.user_stars});
        $modalInstance.close();
    };

});
};

 };



 $scope.getNumber = function(num) {
    return new Array(num);
};


});
