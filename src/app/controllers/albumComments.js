module.exports = function ($scope, $routeParams, Post, Auth, Comment, Notification, Concert, $firebaseArray, Profile, $http, $filter, $sce, $location,
                           $uibModal, Action, $mdToast, FIREBASE_URL, $mdConstant, $mdDialog, Users,
                           Spotify, $firebaseObject, $firebaseAuth) {
  var post_id = $routeParams.postId;
  var postRef = firebase.database().ref("/posts");
  var usersRef = firebase.database().ref("users");

  var ref = firebase.database().ref();
  var authData = Auth.$getAuth();
  var auth = $firebaseAuth();


auth.$onAuthStateChanged(function(user) {


Notification.page_view("/albums/" + post_id);


  // $scope.login = function(){
  //   Spotify.login();
  // };
  var current_user_ref = usersRef.child(user.uid);
  $scope.user = $firebaseObject(current_user_ref);
  $scope.username = $scope.user.username;
  $scope.post = Post.get(post_id);

  $scope.post.$loaded().then(function(res){
    $scope.iframeUrl = $sce.trustAsResourceUrl("https://embed.spotify.com/?uri="+res.media_info.share_uri);
    $scope.songLinkUrl = $sce.trustAsResourceUrl("https://song.link/embed?url="+res.media_info.share_uri);
     $firebaseArray(postRef.child('firsttoflock')).$loaded(function(data){
     $scope.tagFilter(data);
     $scope.albumsBySameArtist(data);
     $scope.matchingTags(data);
     $scope.loadingCircleRelated = false;
     $http.get("https://ipinfo.io/").then(function (resp)
		  {
			$scope.ip = resp.data.ip;
      var song_kick_body = {'artist': $scope.post.media_info.artist, 'ip':$scope.ip};
      $http.post('/api/songkick', song_kick_body).success(function(response) {
          if(response.resultsPage.results.event !== undefined){
           $scope.concert = {};
           $scope.concert.displayName = response.resultsPage.results.event[0].displayName;
           $scope.concert.artist = response.resultsPage.results.event[0].performance[0].displayName;
           $scope.concert.artist_name = response.resultsPage.results.event[0].performance[0].displayName;
           $scope.concert.tickets_url = response.resultsPage.results.event[0].uri;
           $scope.concert.show_date = response.resultsPage.results.event[0].start.datetime;
           $scope.concert.venue_url = response.resultsPage.results.event[0].venue.uri;
           $scope.concert.venue_name = response.resultsPage.results.event[0].venue.displayName;
           $scope.concert.venue_city = response.resultsPage.results.event[0].location.city;
           $scope.concert.group = 'firsttoflock';
           $scope.concert.formatted_location = response.resultsPage.results.event[0].location.city;
           $scope.concert.formatted_datetime = response.resultsPage.results.event[0].start.datetime;
           $scope.concert.post_id = post_id;
           $scope.concert.bit_id = response.resultsPage.results.event[0].id;
           $scope.concert.thumb_url = $scope.post.image_small;
           $scope.concert.ticket_status  = "Tickets";

           var actions_ref = ref.child('user_actions').child($scope.user.$id).child(post_id);

           var current_actions = $firebaseObject(actions_ref);

           current_actions.$loaded().then(function(res) {
           if(res.up || res.star || $scope.user.$id === $scope.post.creator_id) {
            $scope.concert.upvoted = true;
           }
           // Concert.add($scope.concert, $scope.concert.bit_id);
           ref.child('concerts').child($scope.user.$id).child($scope.concert.bit_id).update($scope.concert);
         });
          }
      }).catch(function (response) {
        console.log('error', response);
      });
		  });


  });
  });

    $scope.related_albums = [];
    $scope.loadingCircleRelated = true;



  $scope.showZip = function(ev) {
    $scope.show_zip_notification = true;
};


  $scope.comments = Comment.get_comments_for_post(post_id);
  $scope.gifSearchText = '';
  $scope.loadingCircle = false;
  $scope.readonly = false;
  $scope.selectedItem = null;
  $scope.searchText = null;
  $scope.selectedTags = [];
  $scope.requireMatch = true;
  $scope.tags = $firebaseArray(ref.child('tags').child('firsttoflock'));
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

})

};
