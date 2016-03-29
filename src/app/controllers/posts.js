module.exports = function($scope, $route, $location, $window, Post, Auth, Spotify,$uibModal, Profile, $firebase, 
  $filter, FIREBASE_URL, Action, $mdToast){
 $scope.signedIn = Auth.signedIn;
 $scope.user = Auth.user;
 $scope.posts = Post.all;
 $scope.post = {artist: '', album: '', votes: 0, comments: 0, stars:0};
 $scope.logout = Auth.logout;

 var ref = new Firebase(FIREBASE_URL);

 $scope.filter_date = moment().startOf('isoweek');

 $scope.sorter = '-';
 $scope.week = true;
 $scope.last = false;
 $scope.allPosts = false;
 $scope.albumPosts = {};
 angular.forEach($scope.posts, function(item, key) {
  if ($scope.post.media_type == 'spotify') { $scope.albumPosts[key] = item; };
});

 $scope.getPostLink = function(post){
  if($scope.user.profile.group_id == 1){
    var link = '#/albums/' + post.$id
    return link;
  }else return post.spotify_uri;

 };

 $scope.thisWeek = function(){
   $scope.filter_date = moment().startOf('isoweek');
   $scope.sorter = '-';
   $scope.week = true;
   $scope.last = false;
   $scope.allPosts = false;
 };

  $scope.lastWeek = function(){
    var last_monday = GetLastWeekStart(); 
    var this_monday = moment().startOf('isoweek');
    //TODO: use moment().range
   $scope.filter_date =  last_monday;
   $scope.sorter = '-votes';
   $scope.last = true;
   $scope.week = false;
   $scope.allPosts = false;
 };

 $scope.allTime = function(){
  $scope.filter_date = moment('2016-01-01 16:07:35');
  $scope.sorter = '-votes';
  $scope.allPosts = true;
  $scope.week = false;
  $scope.last = false;

};

  function GetLastWeekStart() {
    var today = moment();
    var daystoLastMonday = 0 - (1 - today.isoWeekday()) + 8;

    var lastMonday = today.subtract(daystoLastMonday, 'days');
    console.log(lastMonday);

     return lastMonday;
};

$scope.getNumber = function(num) {
  return new Array(num);
};


$scope.search = function(){
 Spotify.search($scope.post.search + '*', 'artist,album').then(function (data) {

  $scope.results = data.albums.items;

  var post_names = $.map($scope.posts, function(post, idx){ return post.album;})

  angular.forEach($scope.results, function(result, key) {
    if(post_names.indexOf(result.name) != -1){
          //console.log(result, key);
          result.name += ' **already been posted**';
        }
      });

});

};

  $scope.save = function(post) {
  if($scope.signedIn() && $scope.user.uid != post.creatorUID){

    Profile.savePost($scope.user.uid, post.$id, 'yes');
          // $scope.post.saveButtonText = 'saved';
          $mdToast.show(
            $mdToast.simple()
            .textContent('Saved "' + post.album + '" to your queue')
            .position('bottom right' )
            .hideDelay(3000)
            );

        };

      };

  $scope.viewAlbum = function(album){
    var modalInstance = $uibModal.open({
        templateUrl: 'views/albumPost.html',
        scope: $scope,
        controller: 'AlbumCtrl',
        resolve: {
          album: function () {
            return album;
          }
        }
      });

     };




  $scope.clearResults = function(){
      $route.reload();
    };

  $scope.deletePost = function (post) {
      Post.delete(post);
    };

    $scope.upvote = function(post) {
      Action.upvote(post, 'spotify').then(function(msg){
        console.log(msg);
        $mdToast.show(
          $mdToast.simple()
          .textContent(msg)
          .position('bottom right' )
          .hideDelay(3000)
          );
      });
    };

    $scope.downvote = function(post) {
      Action.downvote(post, 'spotify').then(function(msg){
        console.log(msg);
        $mdToast.show(
          $mdToast.simple()
          .textContent(msg)
          .position('bottom right' )
          .hideDelay(3000)
          );
      });

    };

    $scope.starPost = function(post){
      Action.starPost(post, 'spotify').then(function(msg){
        console.log(msg);
        $mdToast.show(
          $mdToast.simple()
          .textContent(msg)
          .position('bottom right' )
          .hideDelay(3000)
          );
      });

          };


   // $scope.batchUpdate = function(){

   //   var today = $filter('date')(new Date(),'yyyy-MM-dd HH:mm:ss');

   //   angular.forEach($scope.posts, function(post) {
   //    ref.child("posts").child(post.$id).update({'media_type': 'spotify'});
   // });


   // }



 };
