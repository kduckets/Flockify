module.exports = function($scope, $route, $location, $window, Post, Auth, $http, $cookies, album, $sce, $filter,
  $timeout, $q, $mdDialog, FIREBASE_URL, $mdConstant, Users, $firebaseArray) {

   var ref = new Firebase(FIREBASE_URL);
   var tagsRef = new Firebase(FIREBASE_URL+"/tags");
   var tags = $firebaseArray(ref.child('tags').child(Users.current_group));

    $scope.readonly = false;
    $scope.selectedItem = null;
    $scope.searchText = null;
    $scope.selectedTags = [];
    $scope.requireMatch = true;
    $scope.tags = tags;
    $scope.querySearch = querySearch;
    $scope.transformChip = transformChip;
    $scope.keys = [$mdConstant.KEY_CODE.COMMA, $mdConstant.KEY_CODE.ENTER];

    if (Auth.$getAuth()) {
     $scope.user = Users.getProfile(Auth.$getAuth().uid);
     $scope.username = Users.getUsername(Auth.$getAuth().uid);
    } else {
    $scope.user = null;
    console.log("User is logged out");
  };
  $scope.album = album;
  // $scope.posts = Post.all;


  function transformChip(chip) {
        var match = false;
      // If it is an object, it's already a known chip   
      if (angular.isObject(chip)) {
        return {name: chip.$value};
      }else{
      angular.forEach(tags, function(value, key) {
          if(chip === value.$value){
            match = true;
          }
          });
      }
          if(!match){
            tags.$add(chip)
            return { name: chip };  
            }
          if(match){
            return { name: chip };  
          } 
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
    $scope.loadingBar = true;
    $timeout(function () { $scope.loadingBar = false; }, 2000); 
    $scope.post.media_info = {};

    $scope.post.creator_name = $scope.username || null,
    $scope.post.media_info.summary = $scope.summary;
    $scope.post.creator_id = $scope.user.$id;
    $scope.post.media_info.album = $scope.album;
    $scope.post.media_info.artist = $scope.artist;
    //$scope.post.image_large= $scope.image_large;
    //var genres= $.map($scope.posts, function(post, idx){ return post.album;})
    $scope.post.tags = $scope.selectedTags;
    $scope.post.image_medium = $scope.image_large;
    $scope.post.image_small = $scope.image_small;
    $scope.post.media_info.share_uri = $scope.spotify_uri;
    $scope.post.media_info.embed_uri = $scope.embed_uri;
    $scope.post.comments = 0;
    $scope.post.created_ts = moment.utc().format();
    $scope.post.media_info.release_date = $scope.release_date;
    $scope.post.latest_comment = 9999;


    Post.create($scope.post).then(function(postRef) {
      //$location.path('/posts/' + ref.name());
      $mdDialog.hide();

      console.log('group ',Users.current_group);

      ref.child('user_scores').child(Users.current_group).child($scope.user.$id).once("value", function(snapshot) {
          var val = snapshot.val();
          if (!val){
            console.error("No snapshot found for ", $scope.user.$id);
            return;
          }
        
          var week = moment().startOf('isoweek').format('MM_DD_YYYY');
          var current_week = 'weekly_score_'+week;
           
           if(!val[current_week]){
              var scores = {};
               scores[current_week] = {album_score:0}; 
            ref.child('user_scores').child(Users.current_group).child($scope.user.$id).update(scores);       
           }
         });

      $route.reload();

    });
  };

  $scope.openInSpotify = function() {
    $window.open($scope.spotify_uri, '_blank');
  };

};
