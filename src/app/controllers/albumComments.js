module.exports = function ($scope, $routeParams, Post, Auth, Comment, Notification, $firebaseArray, Profile, $http, $filter, $sce, $location,
                           $uibModal, Action, $mdToast, FIREBASE_URL, $mdConstant, $mdDialog, Users, Spotify, bandsintownFactory) {
  var post_id = $routeParams.postId;
  var postRef = new Firebase(FIREBASE_URL+"/posts");
  var ref = new Firebase(FIREBASE_URL);


  Notification.page_view("/albums/" + post_id);


  // $scope.login = function(){
  //   Spotify.login();
  // };

  $scope.user = Users.current_user;
  $scope.username = $scope.user.username;
  $scope.post = Post.get(post_id);

  $scope.post.$loaded().then(function(res){
    $scope.iframeUrl = $sce.trustAsResourceUrl("https://embed.spotify.com/?uri="+res.media_info.share_uri);
     $firebaseArray(postRef.child(Users.current_group)).$loaded(function(data){
     $scope.tagFilter(data);
     $scope.albumsBySameArtist(data);
     $scope.matchingTags(data);
     $scope.loadingCircleRelated = false;
     bandsintown($scope.post);
  });
  });

    $scope.related_albums = [];
    $scope.loadingCircleRelated = true;

var bandsintown = function(post){

  bandsintownFactory.getEventsFromArtistByLocation({
    artist:post.media_info.artist, // ? and / characters must be double escaped. Artists such as "AC/DC" will end up as "AC%252FDC"
    location:"use_geoip", // city,state (US or CA) || city,country || lat,lon || ip address
    // radius:"<RADIUS">, // (optional) (default: 25) in miles. valid values: 0-150
    app_id:"Flockify", //The application ID can be anything, but should be a word that describes your application or company.
}).then(function (response) {
    if(response.data[0]){
     console.log(response);
     $scope.tickets_url = response.data[0].ticket_url;
     $scope.show_date = response.data[0].datetime;
     $scope.venue_url = response.data[0].venue.url;
     $scope.venue_name = response.data[0].venue.name;
     $scope.venue_city = response.data[0].venue.city;
     $scope.venue_region = response.data[0].venue.region;
     $scope.ticket_status = response.data[0].ticket_status;

    }
    //on success
}).catch(function (response) {
  console.log('error', response);
    //on error
});

};





  $scope.comments = Comment.get_comments_for_post(post_id);
  $scope.gifSearchText = '';
  $scope.loadingCircle = false;
  $scope.readonly = false;
  $scope.selectedItem = null;
  $scope.searchText = null;
  $scope.selectedTags = [];
  $scope.requireMatch = true;
  $scope.tags = $firebaseArray(ref.child('tags').child(Users.current_group));
  $scope.keys = [$mdConstant.KEY_CODE.COMMA, $mdConstant.KEY_CODE.ENTER];


  $scope.tagFilter = function (posts) {

     angular.forEach(posts, function(post, key) {
       if(post.media_info){
    angular.forEach($scope.post.tags, function(tag, key) {
      if (post.media_info.summary && post.media_info.summary.toLowerCase().indexOf(tag.name.toLowerCase()) > -1) {
        if ($scope.related_albums.indexOf(post) == -1 && post.media_info.album != $scope.post.media_info.album) {
          //todo:order by best match
         //post.match = post.media_info.summary.toLowerCase().indexOf(tag.name.toLowerCase());
        $scope.related_albums.push(post);
      }
      }
     });
  }
  });
  };

$scope.matchingTags = function(posts){

      angular.forEach(posts, function(post, key) {
       if(post.tags){
         var tags = [];
          for (var i=0 ; i < post.tags.length ; i++)
          {
             tags.push(post.tags[i].name.toLowerCase());
          }
    angular.forEach($scope.post.tags, function(tag, key) {
      if (tags.indexOf(tag.name.toLowerCase()) > -1) {
        if ($scope.related_albums.indexOf(post) == -1 && post.media_info.album != $scope.post.media_info.album) {
          //todo:order by best match
         //post.match = post.media_info.summary.toLowerCase().indexOf(tag.name.toLowerCase());
        $scope.related_albums.push(post);
      }
      }
     });
  }
  });

   };

  $scope.albumsBySameArtist = function(posts){
     angular.forEach(posts, function(post, key) {
      if(post.media_info){
    if(post.media_info.artist === $scope.post.media_info.artist){
      if ($scope.related_albums.indexOf(post) == -1 && post.media_info.album != $scope.post.media_info.album){
         post.relevance_score += 10;
         $scope.related_albums.push(post);
      }
      }
    }
    });
  }

  $scope.goToAlbum = function(post_id){
    var link = "/albums/" + post_id;
      $location.path(link);

  }

     $scope.transformChip = function(post, chip)  {
        var match = false;
      // If it is an object, it's already a known chip
      if (angular.isObject(chip)) {
        Post.tag(post.$id,chip.$value);
        return {name: chip.$value};
      }else{
      angular.forEach($scope.tags, function(value, key) {
          if(chip === value.$value){
            match = true;
          }
          });
      }
          if(!match){
             $scope.tags.$add(chip);
              Post.tag(post.$id, chip);
            return { name: chip };
            }
          if(match){
            Post.tag(post.$id, chip);
            return { name: chip };
          }
    };

  $scope.query_search = function(query) {
    var results = query ? $scope.tags.filter($scope.createFilterFor(query)) : query;
    return results;
  };

  $scope.createFilterFor = function(query) {
    var lowercaseQuery = angular.lowercase(query);
    return function filterFn(tag) {
      return (tag.$value.indexOf(lowercaseQuery) === 0)
    };
  };

  $scope.gifsearch = function(){
    var body = {'search': $scope.gifSearchText};
    $scope.loadingCircle = true;
    $http.post('/api/giphysearch', body).success(function(data) {
      $scope.gifs = data.data;
      $scope.loadingCircle = false;
    }).error(function(data) {
      console.log('Error: ' + data);
    });
  };

  $scope.deletePost = function (post) {
    Post.delete(post);
    $location.path('/#');
  };

  $scope.addComment = function (gif) {
    $scope.commentText = '';
    $scope.gifSearchText = '';
    var new_comment = Comment.add_comment($scope.comments, post_id, gif);
  };

  $scope.deleteComment = function (comment) {
    Comment.delete_comment($scope.comments, post_id, comment);
  };

   $scope.likeComment = function (comment) {
    Comment.like_comment($scope.comments, post_id, comment);
  };

    $scope.dislikeComment = function (comment) {
    Comment.dislike_comment($scope.comments, post_id, comment);
  };

  $scope.getNumber = function(num) {
    return new Array(num);
  };

  $scope.getNumKeys = function(obj) {
    if (!obj){
      return 0;
    }
    return Object.keys(obj).length;
  };

  $scope.save = function(post) {
    if($scope.user && Auth.$getAuth().uid != post.creatorUID){
      Profile.savePost($scope.user.uid, post.$id, 'yes');
      $mdToast.show(
        $mdToast.simple()
          .textContent('Saved "' + post.album + '" to your queue')
          .position('bottom right' )
          .hideDelay(3000)
      );
    };
  };

  $scope.upvote = function(post) {
    Action.upvote(post, post.media_type).then(function(msg){
      $mdToast.show(
        $mdToast.simple()
          .textContent(msg)
          .position('bottom right' )
          .hideDelay(3000)
      );
    });
  };

  $scope.downvote = function(post) {
    Action.downvote(post, post.media_type).then(function(msg){
      $mdToast.show(
        $mdToast.simple()
          .textContent(msg)
          .position('bottom right' )
          .hideDelay(3000)
      );
    });
  };

  $scope.starPost = function(post){
    Action.starPost(post, post.media_type).then(function(msg){
      $mdToast.show(
        $mdToast.simple()
          .textContent(msg)
          .position('bottom right' )
          .hideDelay(3000)
      );
    });
  };



};
