module.exports = function($scope, $route, $location, $window, Post, Auth, $http, $cookies, $modalInstance, book, User) {
  if(Auth.$getAuth()){
    $scope.user = Users.getProfile(Auth.$getAuth().uid);
    $scope.username = Users.getUsername(Auth.$getAuth().uid);
    };
    $scope.book = book;
    $scope.date = new Date();


    $scope.cancel = function() {
      $modalInstance.close();


    };

    $scope.submitPost = function() {
      $scope.post.creator = $scope.username;
      $scope.post.summary = $scope.summary;
      $scope.post.creatorUID = $scope.user.$id;
      $scope.post.title = $scope.book.trackName;
      $scope.post.album = $scope.book.trackName;
      $scope.post.artist = $scope.book.artistName;
      $scope.post.image_medium = $scope.book.artworkUrl100;
      $scope.post.image_small = $scope.book.artworkUrl60;
      $scope.post.link = $scope.book.trackViewUrl
      $scope.post.comments = 0;
      $scope.post.media_type = 'ebook';
      $scope.post.date = $scope.date;
      $scope.post.release_date = $scope.book.releaseDate;
      $scope.post.latest_comment = 9999;
      //$scope.post.genre = $scope.movie.primaryGenreName;


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

    $scope.openInItunes = function() {
      $window.open($scope.movie.trackViewUrl, '_blank');
    };
  };
