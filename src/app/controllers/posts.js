module.exports = function($scope, $route, $location, $window, Post, Auth, Spotify, $uibModal, Profile, $firebase,
  $filter, FIREBASE_URL, Action) {


  $scope.posts = Post.all;
  $scope.user = Auth.user;
  $scope.post = {
    artist: '',
    album: '',
    votes: 0,
    comments: 0,
    stars: 0
  };
  $scope.signedIn = Auth.signedIn;
  $scope.logout = Auth.logout;

  var ref = new Firebase(FIREBASE_URL);

  $scope.filter_date = moment().startOf('isoweek');

  $scope.sorter = '-';
  $scope.week = 'true';
  $scope.allTime = 'false';
  $scope.albumPosts = {};
  angular.forEach($scope.posts, function(item, key) {
    if ($scope.post.media_type == 'spotify') {
      $scope.albumPosts[key] = item;
    };
  });


  $scope.thisWeek = function() {
    $scope.filter_date = moment().startOf('isoweek');
    $scope.week = true;


  }
  $scope.allTime = function() {
    $scope.filter_date = moment('2016-01-01 16:07:35');

    $scope.week = false;
  }
  $scope.getNumber = function(num) {
    return new Array(num);
  };


  $scope.search = function() {
    Spotify.search($scope.post.search + '*', 'artist,album').then(function(data) {

      $scope.results = data.albums.items;

      var post_names = $.map($scope.posts, function(post, idx) {
        return post.album;
      })

      angular.forEach($scope.results, function(result, key) {
        if (post_names.indexOf(result.name) != -1) {
          //console.log(result, key);
          result.name += ' **already been posted**';
        }
      });

    });

  };

  $scope.save = function(post) {
    if ($scope.signedIn() && $scope.user.uid != post.creatorUID) {

      Profile.savePost($scope.user.uid, post.$id, 'yes');
      // $scope.post.saveButtonText = 'saved';

    };

  };

  $scope.viewAlbum = function(album) {
    var modalInstance = $uibModal.open({
      templateUrl: 'views/albumPost.html',
      scope: $scope,
      controller: 'AlbumCtrl',
      resolve: {
        album: function() {
          return album;
        }
      }
    });

  };




  $scope.clearResults = function() {
    $route.reload();
  };

  $scope.deletePost = function(post) {
    Post.delete(post);
  };

  $scope.upvote = function(post) {
    Action.upvote(post, 'spotify');

  };

  $scope.downvote = function(post) {
    Action.downvote(post, 'spotify');

  };

  $scope.starPost = function(post) {
    Action.starPost(post, 'spotify');

  };


  // $scope.batchUpdate = function(){

  //   var today = $filter('date')(new Date(),'yyyy-MM-dd HH:mm:ss');

  //   angular.forEach($scope.posts, function(post) {
  //    ref.child("posts").child(post.$id).update({'media_type': 'spotify'});
  // });


  // }



};
