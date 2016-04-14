module.exports = function($scope, $route, $location, $window, Post, Auth, Spotify,$uibModal, Profile, $firebaseArray, $firebaseAuth,
                          $filter, FIREBASE_URL, Action, Users, $mdToast, $mdDialog, $mdMedia, $timeout, $anchorScroll, $mdConstant, $rootScope,$cookieStore){

  var ref = new Firebase(FIREBASE_URL);
  var chatRef = new Firebase(FIREBASE_URL+"/chats/"+Users.current_group);
  var authData = Auth.$getAuth();
    if (authData) {
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

    console.log(Users.current_user);
  $scope.filteredItems = [];
  $scope.posts = Post.all;
  $scope.post = {score: 0, comments: 0, stars:0};

  $scope.loadingCircle = true;
  $timeout(function () { $scope.loadingCircle = false; }, 3000);

  chatRef.limitToLast(1).on("child_added", function(snap) {
    if($scope.user){
      if($cookieStore.get('last_chat') == snap.key()) {
        return;
      }
      else {
        $cookieStore.put('last_chat', snap.key());
        if(Users.current_user_id != snap.val().creator_id){   
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


  var tags = $firebaseArray(ref.child('tags'));


  $scope.sorter = '-';
  $scope.tagText = '';
  $scope.tagFilters = [];

  $scope.week = true;
  $scope.last = false;
  $scope.month = false;
  $scope.allPosts = false;

  $scope.filter_start_date = moment().startOf('isoweek')
  $scope.filter_end_date = moment.utc();

  $scope.loadingBar = false;

//  $scope.albumPosts = {};
//  angular.forEach($scope.posts, function(item, key) {
//   if ($scope.post.media_type == 'spotify') { $scope.albumPosts[key] = item; };
// });

  $scope.filterByTag = function(tag){
    $scope.loadingBar = true;
    $scope.allTime();
    $scope.tagFilters.push(tag);
    $scope.tagText += tag + " ";
    $timeout(function () { $scope.loadingBar = false; }, 3000);
    $window.scrollTo(0,0);

  };

  $scope.removeTag = function(tag){
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
    $scope.loadingBar = true;
    $timeout(function () { $scope.loadingBar = false; }, 2000);
    $scope.filter_start_date = moment().startOf('isoweek');
    $scope.filter_end_date = moment.utc();
    $scope.sorter = '-';
    $scope.week = true;
    $scope.last = false;
    $scope.allPosts = false;
    $scope.totalDisplayed = 10;
  };

  $scope.thisMonth = function(){
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
    $scope.loadingBar = true;
    $timeout(function () { $scope.loadingBar = false; }, 3000);
    $scope.filter_start_date = moment('2016-01-01 16:07:35')
    $scope.filter_end_date = moment.utc();
    $scope.sorter = ['-score','-stars'];
    $scope.allPosts = true;
    $scope.week = false;
    $scope.last = false;
    $scope.last = false;
    $scope.totalDisplayed = 10;


  };

  function GetLastWeekStart() {
    var today = moment();
    var daystoLastMonday = 0 - (1 - today.isoWeekday()) + 8;

    var lastMonday = today.subtract(daystoLastMonday, 'days');
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

      $scope.results = data.albums.items;
      var post_names = $.map($scope.posts, function(post, idx){
        if(post.media_info){
        return post.media_info.album;
      }
      })

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

  var init = function () {
    if($scope.user){
      chatRef.limitToLast(1).on("child_added", function(snap) {
        if($cookieStore.get('last_chat') == snap.key()){
          return;
        }
        if(!$cookieStore.get('last_chat')){
          $cookieStore.put('last_chat', snap.key());
          return;
        }

      });
    };
  };

  init();


  // $scope.batchUpdate = function(){

  //   var today = $filter('date')(new Date(),'yyyy-MM-dd HH:mm:ss');

  //   angular.forEach($scope.posts, function(post) {
  //    ref.child("posts").child(post.$id).update({'media_type': 'spotify'});
  // });


  // }



};
