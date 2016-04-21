module.exports = function ($scope, $routeParams, Post, Auth, Comment, $firebaseArray, Profile, $http, $filter, $sce, $location,
                           $uibModal, Action, $mdToast, FIREBASE_URL, $mdConstant, $mdDialog, Users) {
  var post_id = $routeParams.postId;
  var postRef = new Firebase(FIREBASE_URL+"/posts");
  var ref = new Firebase(FIREBASE_URL);


  $scope.user = Users.current_user;
  $scope.username = $scope.user.username;
  $scope.post = Post.get(post_id);

  $scope.post.$loaded().then(function(res){
    $scope.iframeUrl = $sce.trustAsResourceUrl("https://embed.spotify.com/?uri="+res.media_info.share_uri);
     $firebaseArray(postRef.child(Users.current_group)).$loaded(function(data){
     $scope.tagFilter(data);
     $scope.loadingCircleRelated = false;
  });
  });

    $scope.related_albums = [];
    $scope.loadingCircleRelated = true;

 

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
    //   if(post.tags){
    //     var tags = [];
    //     for (var i=0 ; i < post.tags.length ; i++)
    //       {
    //          tags.push(post.tags[i]);
    //       }
    //       console.log('tag array',tags);
    //   if(tags.indexOf(tag.name.toLowerCase())){
    //     if ($scope.related_albums.indexOf(post) == -1 && post.media_info.album != $scope.post.media_info.album) {
    //       //todo:order by best match
    //      //post.match = post.media_info.summary.toLowerCase().indexOf(tag.name.toLowerCase());
    //     $scope.related_albums.push(post);
    //   }
    //   }
    // }
      //todo: get albums by same artists and albums with the same tags
     });  
  }
    });
  };

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
