module.exports = function($scope, $route, $location, $window, Post, Auth, $http, $cookies, $modalInstance, podcast) {

  $scope.user = Auth.user;
  $scope.signedIn = Auth.signedIn;
  $scope.logout = Auth.logout;
  $scope.podcast = podcast;
  $scope.feedUrl = $scope.podcast.feedUrl;
  $scope.date = new Date();


  var body = {
    'feed': $scope.feedUrl
  };
  $http.post('/api/podcastfeed', body)

  .success(function(data) {

      $scope.podcastFeed = data;
      //console.log($scope.podcastFeed);

    })
    .error(function(data) {
      console.log('Error: ' + data);
    });



  $scope.cancel = function() {
    $modalInstance.close();


  };

  $scope.submitPost = function(episode) {
    $scope.post.creator = $scope.user.profile.username;
    $scope.post.summary = episode.user_description
    $scope.post.creatorUID = $scope.user.uid;
    $scope.post.title = episode.title;
    $scope.post.album = $scope.podcast.trackName;
    $scope.post.artist = $scope.podcast.artistName;
    if (episode.image.url) {
      $scope.post.image_medium = episode.image.url;
    } else {
      $scope.post.image_medium = $scope.podcast.artworkUrl100;
    }
    $scope.post.external_link = episode.link;
    $scope.post.comments = 0;
    $scope.post.date = $scope.date;
    $scope.post.release_date = episode.date;
    $scope.post.description = episode.description;
    $scope.post.media_type = 'podcast';
    $scope.post.latest_comment = 9999;
    $scope.post.link = $scope.podcast.collectionViewUrl;


    Post.create($scope.post).then(function(ref) {
      //$location.path('/posts/' + ref.name());
      $modalInstance.close();

      $route.reload();
      $scope.post = {
        artist: '',
        album: ''
      };
    });
  };

  $scope.viewInItunes = function() {
    $window.open($scope.podcast.collectionViewUrl, '_blank');
  };

};
