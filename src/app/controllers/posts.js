module.exports = function($scope, $route, $location, $window, Post, Auth, Spotify,$uibModal, Profile, $firebaseArray, $firebaseAuth,
                          $filter, FIREBASE_URL, Action, Users, $mdToast, $mdDialog, $mdMedia, $timeout,
                          $anchorScroll, $mdConstant, $rootScope,$cookieStore, Trophy){

  var ref = new Firebase(FIREBASE_URL);
  $scope.posts = [];
  $scope.showSearch = false;
  var authData = Auth.$getAuth();
    if (authData) {
    var chatRef = new Firebase(FIREBASE_URL+"/chats/"+Users.current_group);
    $scope.user = Users.getProfile(authData.uid);
    $scope.username = $scope.user.username;
    console.log("Logged in as:", authData.uid);
  }

  Auth.$onAuth(function(authData) {
  if (authData) {
    $scope.user = Users.getProfile(authData.uid);
    $scope.username = $scope.user.username;
    console.log("Logged in as:", authData.uid);
  } else {
    console.log("Logged out");
    $location.path('/login');
  }
});
  $scope.filteredItems = [];
  if(authData){
    $scope.loadingCircle = true;
  $firebaseArray(ref.child('posts').child(Users.current_group)).$loaded(function(data){
     $scope.posts = data;
     $scope.loadingCircle = false;
  });
 }
  $scope.post = {score: 0, comments: 0, stars:0};

  // $scope.loadingCircle = true;
  // $timeout(function () { $scope.loadingCircle = false; }, 3000);

  if($scope.user){

  chatRef.limitToLast(1).on("child_added", function(snap) {
    if($scope.user){
      if($cookieStore.get('last_chat_'+Users.current_group) == snap.key()) {
        return;
      }
      else {
        $cookieStore.put('last_chat_'+Users.current_group, snap.key());
        if(authData.uid != snap.val().creator_id){
          $mdToast.show(
            $mdToast.simple()
              .textContent('New chat message from ' + snap.val().creator_name)
              .highlightAction(true)
              .position('bottom right')
              .hideDelay(3000)
          )
        }
      };
    };
  });


  $scope.totalDisplayed = 10;
  $scope.loadMore = function () {
    $scope.totalDisplayed += 10;
  };


  var tags = $firebaseArray(ref.child('tags').child(Users.current_group));


  $scope.sorter = '-';
  $scope.tagText = '';
  $scope.tagFilters = [];

  $scope.week = true;
  $scope.last = false;
  $scope.month = false;
  $scope.allPosts = false;

  $scope.filter_start_date = moment().startOf('isoweek');
  $scope.filter_end_date = moment.utc();

  $scope.loadingBar = false;

//  $scope.albumPosts = {};
//  angular.forEach($scope.posts, function(item, key) {
//   if ($scope.post.media_type == 'spotify') { $scope.albumPosts[key] = item; };
// });

  $scope.filterByTag = function(tag){
    $scope.loadingCircle = true;
    $scope.allTime();
    $scope.tagFilters.push(tag);
    $scope.tagText += tag + " ";
    $timeout(function () { $scope.loadingCircle = false; }, 2000);
    $scope.loadingBar = true;
    $timeout(function () { $scope.loadingBar = false; }, 2000);
    $window.scrollTo(0,0);

  };

  $scope.removeTag = function(tag){
    $scope.loadingCircle = true;
    $timeout(function () { $scope.loadingCircle = false; }, 2000);
    $scope.loadingBar = true;
    $timeout(function () { $scope.loadingBar = false; }, 2000);
    var index = $scope.tagFilters.indexOf(tag);
    if (index > -1) {
      $scope.tagFilters.splice(index, 1);
    }
    $scope.tagText = $scope.tagText.replace(tag," ");
    $scope.thisWeek();
  };

  $scope.thisWeek = function(){
    $scope.loadingCircle = true;
    $timeout(function () { $scope.loadingCircle = false; }, 2000);
    $scope.loadingBar = true;
    $timeout(function () { $scope.loadingBar = false; }, 2000);
    $scope.filter_start_date = moment().startOf('isoweek');
    $scope.filter_end_date = moment.utc();
    $scope.sorter = '-';
    $scope.week = true;
    $scope.month = false;
    $scope.last = false;
    $scope.allPosts = false;
    $scope.totalDisplayed = 10;
  };

  $scope.thisMonth = function(){
    $scope.loadingCircle = true;
    $timeout(function () { $scope.loadingCircle = false; }, 2000);
    $scope.loadingBar = true;
    $timeout(function () { $scope.loadingBar = false; }, 2000);
    // var last_monday = GetLastWeekStart();
    // var month_start = moment().startOf('month');
    var month_start = moment().subtract(30, 'days').startOf('day');
    var this_monday = moment().startOf('isoweek');
    $scope.filter_start_date = month_start;
    $scope.filter_end_date = this_monday;
    $scope.sorter = ['-score','-stars'];
    $scope.last = false;
    $scope.month = true;
    $scope.week = false;
    $scope.allPosts = false;
    $scope.totalDisplayed = 10;
  };

  $scope.lastWeek = function(){
    $scope.loadingCircle = true;
    $timeout(function () { $scope.loadingCircle = false; }, 2000);
    $scope.loadingBar = true;
    $timeout(function () { $scope.loadingBar = false; }, 2000);
    var last_monday = GetLastWeekStart();
    // var month_start = moment().startOf('month');
    var this_monday = moment().startOf('isoweek');
    $scope.filter_start_date = last_monday;
    $scope.filter_end_date = this_monday;
    $scope.sorter = ['-score','-stars'];
    $scope.last = true;
    $scope.month = false;
    $scope.week = false;
    $scope.allPosts = false;
    $scope.totalDisplayed = 10;
  };

  $scope.allTime = function(){
    $scope.loadingCircle = true;
    $timeout(function () { $scope.loadingCircle = false; }, 2000);
    $scope.loadingBar = true;
    $timeout(function () { $scope.loadingBar = false; }, 2000);
    $scope.filter_start_date = moment('2016-01-01 16:07:35')
    $scope.filter_end_date = moment.utc();
    $scope.sorter = ['-score','-stars'];
    $scope.allPosts = true;
    $scope.week = false;
    $scope.month = false;
    $scope.last = false;
    $scope.totalDisplayed = 10;
  };

  function GetLastWeekStart() {
    var lastMonday = moment().subtract(1, 'weeks').startOf('isoWeek');
    return lastMonday;
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


  $scope.search = function(){
    Spotify.search($scope.post.search + '*', 'artist,album').then(function (data) {
      $scope.no_results = false;

      $scope.results = data.albums.items;
      var post_names = $.map($scope.posts, function(post, idx){
        if(post.media_info) {
          return post.media_info.album;
        }
      });

      if (data.albums.total == 0) {
        $scope.no_results = true;
        return;
      }

      angular.forEach($scope.results, function(result, key) {
        if(post_names.indexOf(result.name) != -1){
          result.name += ' **already been posted**';
        }
      });

    });

  };

  $scope.save = function(post) {
    if($scope.user && Users.current_user_id != post.creator_id){
      console.log(post);
      Profile.savePost(Users.current_user_id, post.$id, true);
      // $scope.post.saveButtonText = 'saved';
      $mdToast.show(
        $mdToast.simple()
          .textContent('Saved "' + post.media_info.album + '" to your queue')
          .position('bottom right' )
          .hideDelay(3000)
      );

    };

  };

  $scope.viewAlbum = function(album, ev){
    $mdDialog.show({
        templateUrl: 'views/albumPost.html',
        scope: $scope,
        controller: 'AlbumCtrl',
        parent: angular.element(document.body),
        targetEvent: ev,
        clickOutsideToClose:true,
        preserveScope : true,
        resolve: {
          album: function () {
            return album;
          }
        }
      })
      .then(function() {
        // $route.reload();
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
      $mdToast.show(
        $mdToast.simple()
          .textContent(msg)
          .position('bottom right' )
          .hideDelay(3000)
      );
    });

  };

  $scope.trophy = function(user_id){
      return Trophy.is_last_week_winner(user_id);
  }
  $scope.poop = function(user_id){
      return Trophy.is_last_week_loser(user_id);
  }

  var init = function () {
    if($scope.user){
      chatRef.limitToLast(1).on("child_added", function(snap) {
        if($cookieStore.get('last_chat_'+Users.current_group) == snap.key()){
          return;
        }
        if(!$cookieStore.get('last_chat_'+Users.current_group)){
          $cookieStore.put('last_chat_'+Users.current_group, snap.key());
          return;
        }

      });
    };
  };

  init();

};
  // $scope.batchUpdate = function(){

  //   var today = $filter('date')(new Date(),'yyyy-MM-dd HH:mm:ss');

  //   angular.forEach($scope.posts, function(post) {
  //    ref.child("posts").child(post.$id).update({'media_type': 'spotify'});
  // });


  // }



};
