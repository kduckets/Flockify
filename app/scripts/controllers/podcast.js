'use strict';

app.controller('PodcastCtrl', function ($scope, $route, $location, $window, Post, Auth, $http, $cookies, $modalInstance, podcast) {

  $scope.user = Auth.user;
  $scope.signedIn = Auth.signedIn;
  $scope.logout = Auth.logout;
  $scope.podcast = podcast;
  $scope.feedUrl = $scope.podcast.feedUrl;
  $scope.date = new Date();


          var body = {'feed': $scope.feedUrl};
      $http.post('/api/podcastfeed', body)

             .success(function(data) {
                
                 $scope.podcastFeed = data;
              
           
             })
             .error(function(data) {
                 console.log('Error: ' + data);
             });



  $scope.cancel = function(){
     $modalInstance.close();

    
  };

   $scope.submitPost = function (episode) {
  $scope.post.creator = $scope.user.profile.username;
  $scope.post.summary = episode.user_description
  $scope.post.creatorUID = $scope.user.uid;
  $scope.post.title = episode.title;
  $scope.post.album = episode.title;
  $scope.post.artist = $scope.podcast.artistName;
  $scope.post.image_medium = episode.image.url;
  $scope.post.link = episode.link;
  $scope.post.comments = 0;
  $scope.post.date = $scope.date;
  $scope.post.release_date = episode.date;
  $scope.post.description = episode.description;
  $scope.post.media_type = 'podcast';


  Post.create($scope.post).then(function (ref) {
    //$location.path('/posts/' + ref.name());
     $modalInstance.close();

      $route.reload();
    $scope.post = {artist: '', album: ''};
  });
};

        $scope.viewInItunes = function(){
            $window.open($scope.podcast.collectionViewUrl, '_blank');
        };

});