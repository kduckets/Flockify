module.exports = function($scope, $route, $location, $window, Post, Auth, $http, $cookies, album, $sce, $filter, Spotify,
                          $timeout, $q, $mdDialog, FIREBASE_URL, $mdConstant, Users, $firebaseArray, bandsintownFactory, Concert, $firebaseObject) {

//$window.??
  var ref = firebase.database().ref();
  var usersRef = firebase.database().ref("users");

  // var tags = $firebaseArray(ref.child('tags').child('firsttoflock'));
  var tags = $firebaseArray(ref.child('tags').child('firsttoflock'));


  $scope.readonly = false;
  $scope.selectedItem = null;
  $scope.searchText = null;
  $scope.selectedTags = [];
  $scope.requireMatch = true;
  $scope.tags = tags;
  $scope.querySearch = querySearch;
  $scope.transformChip = transformChip;
  $scope.keys = [$mdConstant.KEY_CODE.COMMA, $mdConstant.KEY_CODE.ENTER];


    var current_user_ref = usersRef.child(firebase.auth().currentUser.uid);
    var user = $firebaseObject(current_user_ref);
    user.$loaded().then(function() {
    $scope.user = user;
    $scope.username = user.username;
  })



  $scope.album = album;
  // $scope.posts = Post.all;

  function transformChip(chip) {
    var match = false;
    // If it is an object, it's already a known chip
    if (angular.isObject(chip)) {
      return {name: chip.$value};
    } else {
      angular.forEach(tags, function (value, key) {
        if (chip === value.$value) {
          match = true;
        }
      });
    }
    if (!match) {
      tags.$add(chip)
      return {name: chip};
    }
    if (match) {
      return {name: chip};
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
  // $http({
  //   method: 'GET',
  //   url: $scope.album

  //})
  Spotify.getAlbum($scope.album).then(function successCallback(album) {
    $scope.spotify_result = album.data;
    $scope.artist = album.data.artists[0].name;
    $scope.album = album.data.name;
    $scope.image_large = album.data.images[0].url;
    $scope.image_medium = album.data.images[1].url;
    $scope.image_small = album.data.images[2].url;
    $scope.spotify_uri = album.data.external_urls.spotify;
    $scope.release_date = album.data.release_date;
    $scope.embed_uri = album.data.uri;
    var copyright = album.data.copyrights[0].text;
    // $scope.label = [];
    // $scope.label.push(copyright.replace(/\b\d{4}\b/,'').replace('(C)','').trim());
    // console.log($scope.label);
    var apiKey = 'NkGkQmxCMALmQCBYYdnZ';
    var apiSecret = 'npMAgZwCuvfselUUpysRCqyXdQUrqcZh';
      $http({
  method: 'GET',
  url : 'https://api.discogs.com/database/search?' + 'artist=' + $scope.artist + '&release_title=' + $scope.album +
  '&key=' + apiKey + '&secret=' + apiSecret + '&country=us' + "&type=release"
   }).then(function successCallback(response) {
  if(response.data.results[0]){
  $scope.label = response.data.results[0].label.slice(0,2);
  $scope.genre = response.data.results[0].genre;
  angular.forEach($scope.genre, function(value, key) {
      var newChip = {'name': value};
      $scope.selectedTags.push(newChip);
    });
    }
  })

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
    if($scope.label){
    $scope.post.labels = $scope.label;
    };
    // $scope.post.genre = $scope.genre;


    Post.create($scope.post).then(function(postRef) {
      //$location.path('/posts/' + ref.name());
      $mdDialog.hide();
}).catch(function (response) {
  console.log('error', response);
    //on error
});

      ref.child('user_scores').child('firsttoflock').child(firebase.auth().currentUser.uid).once("value", function(snapshot) {

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
            ref.child('user_scores').child('firsttoflock').child(firebase.auth().currentUser.uid).update(scores);
           }


           var month = moment().startOf('month').format('MM_DD_YYYY');
           var current_month = 'monthly_score_'+month;

            if(!val[current_month]){
               var scores = {};
                scores[current_month] = {album_score:0};
             ref.child('user_scores').child('firsttoflock').child(firebase.auth().currentUser.uid).update(scores);
            }
         });
        // send Whatsapp notification
         // var wabody = {'user': $scope.username};
         // $http.post('/api/wanotification', wabody).success(function(data) {
         //   console.log("WA notification sent");
         // }).error(function(data) {
         //   console.log('Error: ' + data);
         // });


         //send email notification via mailchimp
         var ebody = {'user': $scope.username};
         $http.post('/api/emailnotification', ebody).success(function(data) {
           console.log("email notification sent");
         }).error(function(data) {
           console.log('Error: ' + data);
         });

      $route.reload();


  };

  $scope.openInSpotify = function() {
    $window.open($scope.spotify_uri, '_blank');
  };

};
