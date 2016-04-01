module.exports = function($scope, $route, $location, $window, Post, Auth, $http, $cookies, album, $sce, $filter,
  $timeout, $q, $mdDialog, FIREBASE_URL, $firebase) {

   var ref = new $window.Firebase(FIREBASE_URL);
   var tags = $firebase(ref.child('tags')).$asArray();

    $scope.readonly = false;
    $scope.selectedItem = null;
    $scope.searchText = null;
    $scope.selectedTags = [];
    $scope.requireMatch = true;
    $scope.tags = tags;
    $scope.querySearch = querySearch;
    $scope.transformChip = transformChip;

  $scope.user = Auth.user;
  $scope.signedIn = Auth.signedIn;
  $scope.logout = Auth.logout;
  $scope.album = album;
  // $scope.posts = Post.all;


  function transformChip(chip) {
      
      // If it is an object, it's already a known chip
      if (angular.isObject(chip)) {
        return {name: chip.$value};
      }
      // Otherwise, create a new one
      tags.$add(chip)
      console.log('selected',$scope.selectedTags);
      return { name: chip };

    };

    /**
     * Search for tags.
     */
   function querySearch (query) {
      var results = query ? $scope.tags.filter($scope.createFilterFor(query)) : query;
      return results;
    };

    /**
     * Create filter function for a query string
     */
    $scope.createFilterFor = function(query) {
      var lowercaseQuery = angular.lowercase(query);
      return function filterFn(tag) {
        return (tag.$value.indexOf(lowercaseQuery) === 0)
      };
    };

  $http({
    method: 'GET',
    url: $scope.album
  }).then(function successCallback(album) {
    // console.log(album);
    $scope.spotify_result = album.data;
    $scope.artist = album.data.artists[0].name;
    $scope.album = album.data.name;
    $scope.image_large = album.data.images[0].url;
    $scope.image_medium = album.data.images[1].url;
    $scope.image_small = album.data.images[2].url;
    $scope.spotify_uri = album.data.external_urls.spotify;
    $scope.release_date = album.data.release_date;
    $scope.embed_uri = album.data.uri;

    // $scope.embed_link = $sce.trustAsResourceUrl("https://embed.spotify.com/?uri=spotify:album:6SwMUCcHLfZjji3MAFODMv");


  }, function errorCallback(response) {
    console.log(response);
  });



  $scope.cancel = function() {
       $mdDialog.hide();
       $location.path('/');

  };

  $scope.submitPost = function() {
    // angular.forEach($scope.posts, function(item, key) {
    //   if item.

    // });
    $scope.post.creator = $scope.user.profile.username || null,
    $scope.post.summary = $scope.summary;
    $scope.post.creatorUID = $scope.user.uid;
    $scope.post.album = $scope.album;
    $scope.post.artist = $scope.artist;
    //$scope.post.image_large= $scope.image_large;
    //var genres= $.map($scope.posts, function(post, idx){ return post.album;})
    $scope.post.tags = $scope.selectedTags;
    $scope.post.image_medium = $scope.image_large;
    $scope.post.image_small = $scope.image_small;
    $scope.post.spotify_uri = $scope.spotify_uri;
    $scope.post.embed_uri = $scope.embed_uri;
    $scope.post.comments = 0;
    $scope.post.date = $filter('date')(new Date(), 'yyyy-MM-dd HH:mm:ss');
    $scope.post.release_date = $scope.release_date;
    $scope.post.latest_comment = 9999;


    Post.create($scope.post).then(function(ref) {
      //$location.path('/posts/' + ref.name());
      $mdDialog.hide();

      $route.reload();
      $scope.post = {
        artist: '',
        album: ''
      };
    });
  };

  $scope.openInSpotify = function() {
    $window.open($scope.spotify_uri, '_blank');
  };

};
