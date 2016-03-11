'use strict';

app.controller('ChatCtrl', function ($scope, $routeParams, Post, Auth, $firebase, Profile, $http, $filter, $sce, $uibModal, FIREBASE_URL) {
  var ref = new Firebase(FIREBASE_URL);
    $scope.user = Auth.user;
  $scope.signedIn = Auth.signedIn;
  $scope.logout = Auth.logout;
   $scope.posts = Post.all;
    $scope.user = Auth.user;
  $scope.gifSearchText = '';
  
    $scope.viewby = 12;

  $scope.itemsPerPage = $scope.viewby;
  $scope.maxSize = 5; //Number of pager buttons to show
  

        ref.once("value", function(snapshot) {
  $scope.totalItems = snapshot.child("comments").child("flock_groupchat").numChildren();
  $scope.currentPage = Math.ceil($scope.totalItems / $scope.itemsPerPage);
  $scope.comments = Post.comments('flock_groupchat');
  //console.log($scope.totalItems);
 
});
  







  

  $scope.setPage = function (pageNo) {
    $scope.currentPage = pageNo;
  };

  $scope.pageChanged = function() {
    //console.log('Page changed to: ' + $scope.currentPage);
  };

$scope.setItemsPerPage = function(num) {
  $scope.itemsPerPage = num;
  $scope.currentPage = 1; //reset to first paghe
};

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


  $scope.addComment = function (text) {
    if(!$scope.commentText || $scope.commentText === '') {
      return;
    }
    var today = $filter('date')(new Date(),'MM/dd/yy h:mma');

    var comment = {
      // text: $scope.commentText,
      text: text,
      type: 'text',
      creator: $scope.user.profile.username,
      creatorUID: $scope.user.uid,
      datetime_ts: today,
      votes: 0
    };
    $scope.comments.$add(comment);

    $scope.commentText = '';
 

  };

    $scope.addGif = function (gif) {
    // if(!$scope.commentText || $scope.commentText === '') {
    //   return;
    // }
    var today = $filter('date')(new Date(),'MM/dd/yy h:mma');

    var comment = {
      // text: $scope.commentText,
      text: '<img src="'+ gif+ '" height="80" class="gif" />',
      type: 'gif',
      creator: $scope.user.profile.username,
      creatorUID: $scope.user.uid,
      datetime_ts: today,
      votes: 0
    };
    $scope.comments.$add(comment);

    $scope.gifSearchText = '';

  };


  $scope.deleteComment = function (comment) {
  $scope.comments.$remove(comment);
     ref.once("value", function(snapshot) {
  $scope.comments_count = snapshot.child("comments").child($scope.post.$id).numChildren();
  console.log($scope.comments_count);
   ref.child("posts").child($scope.post.$id).update({'comments': $scope.comments_count});

  });
};



});
