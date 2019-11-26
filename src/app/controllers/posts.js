module.exports = function($scope, $route, $location, $window, Post, Auth, Spotify,$uibModal, Profile, $firebaseArray, $firebaseAuth,
                          $filter, FIREBASE_URL, Action, Users, $mdToast, $mdDialog, $mdMedia, $timeout,
                          $anchorScroll, $mdConstant, $rootScope,$cookieStore, Trophy, $http,
                          bandsintownFactory, $firebaseObject, Concert, Util, Notification){

  var auth = $firebaseAuth();
  auth.$onAuthStateChanged(function(user) {
  // var firebaseUser = $scope.authObj.$getAuth();
  if (user) {
    var ref = firebase.database().ref();
    $scope.posts = [];
    $scope.showSearch = false;


$scope.user = Users.getProfile(user.uid);
$scope.username = $scope.user.username;
$scope.showAlert = false;


  $scope.filteredItems = [];
  if(user && 'firsttoflock'){
    $scope.loadingCircle = true;
  $firebaseArray(ref.child('posts').child('firsttoflock')).$loaded(function(data){
     $scope.posts = data;
     $scope.loadingCircle = false;
  });
 }
  $scope.post = {score: 0, comments: 0, stars:0};
  $scope.same_label = 0;

  $scope.load = function(){
    $scope.loadingCircle = true;
    $timeout(function () { $scope.loadingCircle = false; }, 2000);
    // $scope.loadingBar = true;
    // $timeout(function () { $scope.loadingBar = false; }, 2000);

  };

  // $scope.loadingCircle = true;
  // $timeout(function () { $scope.loadingCircle = false; }, 3000);

  if($scope.user){

  // chatRef.limitToLast(1).on("child_added", function(snap) {
  //   if($scope.user){
  //     if($cookieStore.get('last_chat_'+'firsttoflock') == snap.key()) {
  //       return;
  //     }
  //     else {
  //       $cookieStore.put('last_chat_'+'firsttoflock', snap.key());
  //       if(authData.uid != snap.val().creator_id){
  //         $mdToast.show(
  //           $mdToast.simple()
  //             .textContent('New chat message from ' + snap.val().creator_name)
  //             .highlightAction(true)
  //             .position('bottom right')
  //             .hideDelay(3000)
  //         )
  //       }
  //     };
  //   };
  // });


  $scope.totalDisplayed = 14;
  $scope.loadMore = function () {
    $scope.totalDisplayed += 14;
  };


  var tags = $firebaseArray(ref.child('tags').child('firsttoflock'));


  $scope.sorter = '-';
  $scope.tagText = '';
  $scope.tagFilters = [];
  $scope.label_filter = '';

  $scope.week = false;
  $scope.last = false;
  $scope.month = false;
  $scope.allPosts = true;
  $scope.albumContest = false;

  // $scope.filter_start_date = moment().startOf('isoweek');
  $scope.filter_start_date = moment().subtract(12, 'months').startOf('day');
  $scope.filter_end_date = moment.utc();

  $scope.loadingBar = false;

  $scope.isFaotd = function(tags){
    if(tags){
    for (var i=0; i < tags.length; i++) {
      if (tags[i].name == "FAOTD" || tags[i].name == "faotd"){
          return true;
      }
  }
  }
}

  $scope.filterByTag = function(tag){
    $scope.allTime();
    $scope.tagFilters.push(tag);
    $scope.tagText += tag + " ";
    $window.scrollTo(0,0);

  };

  $scope.filterByLabel = function(label){
    $scope.allTime();
    $scope.tagFilters.push(label);
    $scope.label_filter =label;
    $window.scrollTo(0,0);
  };

  $scope.removeTag = function(tag){
    var index = $scope.tagFilters.indexOf(tag);
    if (index > -1) {
      $scope.tagFilters.splice(index, 1);
    }
    $scope.tagText = $scope.tagText.replace(tag," ");
    $scope.label_filter = '';
    $scope.allTime();
    $scope.sorter = '-';

  };

  // $scope.thisWeek = function(){
  //   $scope.filter_start_date = moment().startOf('isoweek');
  //   $scope.filter_end_date = moment.utc();
  //   $scope.sorter = '-';
  //   $scope.week = true;
  //   $scope.month = false;
  //   $scope.last = false;
  //   $scope.allPosts = false;
  //   $scope.totalDisplayed = 14;
  // };

  $scope.thisMonth = function(){
    var month_start = moment().subtract(30, 'days').startOf('day');
    var today = moment.utc();
    $scope.filter_start_date = month_start;
    $scope.filter_end_date = today;
    $scope.tagText = '';
    $scope.sorter = ['-score','-stars'];
    $scope.last = false;
    $scope.month = true;
    $scope.all = false;
    $scope.allPosts = false;
    $scope.faotd_contest = false;

    $scope.totalDisplayed = 14;
  };

  $scope.thisYear = function(){
    var year_start = moment().subtract(12, 'months').startOf('day');
    var today = moment.utc();
    $scope.filter_start_date = year_start;
    $scope.filter_end_date = today;
    $scope.tagText = '';
    $scope.sorter = ['-score','-stars'];
    $scope.last = true;
    $scope.month = false;
    $scope.week = false;
    $scope.all = false;
    $scope.allPosts = false;
    $scope.faotd_contest = false;

    $scope.totalDisplayed = 14;
  };

  // $scope.lastWeek = function(){
  //   var last_monday = GetLastWeekStart();
  //   // var month_start = moment().startOf('month');
  //   var this_monday = moment().startOf('isoweek');
  //   $scope.filter_start_date = last_monday;
  //   $scope.filter_end_date = this_monday;
  //   $scope.sorter = ['-score','-stars'];
  //   $scope.last = true;
  //   $scope.month = false;
  //   $scope.week = false;
  //   $scope.allPosts = false;
  //   $scope.totalDisplayed = 14;
  // };

  $scope.year = moment().year();


  $scope.showMonth = function(month){
    //if month is in this scope.year return true
    if($scope.year == moment().year() && (month-1) > moment().month())
    {
      return false;
    }
    else {
      return true;
    }

  };

  $scope.byMonth = function(month){
    // var last_monday = GetLastWeekStart();
    // var month_start = moment().startOf('month');
    var month_start = moment($scope.year+"-"+month+"-1");
    var month_end = moment($scope.year+"-"+month+"-1").endOf('month');
    $scope.tagText = '';
    $scope.filter_start_date = month_start;
    $scope.filter_end_date = month_end;
    $scope.sorter = ['-score','-stars'];
    $scope.last = false;
    $scope.month = month;
    $scope.week = false;
    $scope.allPosts = false;
    $scope.faotd_contest = false;

    $scope.totalDisplayed = 14;
    $scope.albumContest = false;
  };

  $scope.byYear = function(year){
    // var last_monday = GetLastWeekStart();
    // var month_start = moment().startOf('month');
    var year_start = moment(year+"-"+"01-01");
    var year_end = moment(year+"-"+"12-31");
    $scope.tagText = '';
    $scope.filter_start_date = year_start;
    $scope.filter_end_date = year_end;
    $scope.sorter = ['-score','-stars'];
    $scope.year = year;
    $scope.last = false;
    $scope.month = false;
    $scope.week = false;
    $scope.allPosts = false;
    $scope.faotd_contest = false;

    $scope.totalDisplayed = 14;
    $scope.albumContest = false;
  };

  $scope.allTime = function(){
    $scope.filter_start_date = moment('2016-01-01 16:07:35')
    $scope.filter_end_date = moment.utc();
    $scope.tagText = '';
    $scope.sorter = ['-score','-stars'];
    $scope.allPosts = true;
    $scope.week = false;
    $scope.month = false;
    $scope.last = false;
    $scope.albumContest = false;
    $scope.faotd_contest = false;

    $scope.totalDisplayed = 14;
  };

  $scope.topAlbum = function(){
    $scope.filter_start_date = moment('2016-12-01 16:07:35')
    $scope.filter_end_date = moment.utc();
    $scope.sorter = ['-score','-stars'];
    $scope.tagText = 'topalbum2016';
    $scope.albumContest = true;
    $scope.allPosts = false;
    $scope.week = false;
    $scope.month = false;
    $scope.last = false;
    $scope.totalDisplayed = 14;
  };
//todo: use current year from scope
  $scope.topAlbum2017 = function(){
    $scope.filter_start_date = moment('2017-12-01 16:07:35')
    $scope.filter_end_date = moment('2018-01-01 16:07:35');
    $scope.sorter = ['-score','-stars'];
    $scope.tagText = 'best';
    $scope.albumContest = true;
    $scope.allPosts = false;
    $scope.week = false;
    $scope.month = false;
    $scope.last = false;
    $scope.totalDisplayed = 14;
  };

  $scope.faotd = function(){
    $scope.filter_start_date = moment('2017-12-01 16:07:35')
    $scope.filter_end_date = moment.utc();
    $scope.sorter = ['-score','-stars'];
    $scope.tagText = 'faotd';
    $scope.faotd_contest = true;
    $scope.allPosts = false;
    $scope.week = false;
    $scope.month = false;
    $scope.last = false;
    $scope.totalDisplayed = 14;
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

  $scope.albumsOnLabel = function(label){
     $scope.same_label = -1;
    angular.forEach($scope.posts, function (post, key){
      if(post.labels){
      if(post.labels.indexOf(label) !== -1){
        $scope.same_label +=1;
      }
    }
    })
  }

// $scope.spotify_login = function(){
//   Spotify.login().then(function(login){
//     Spotify.getCurrentUser().then(function (data) {
//       console.log(data);
//     });
//        });
  //   console.log(data);
    // Spotify
    // .createPlaylist('123037893', { name: 'Flockify Mixtape' })
    // .then(function (playlist_data) {
    //  console.log('playlist', playlist_data);
    // });
// };

  $scope.search = function(){

    Spotify.search($scope.post.search + '*', 'artist,album').then(function (data) {
      $scope.no_results = false;

      $scope.results = data.data.albums.items;
      var post_names = $.map($scope.posts, function(post, idx){
        if(post.media_info) {
          return   {album:post.media_info.album, link:post.$id};
        }
      });

      if (data.data.albums.total == 0) {
        $scope.no_results = true;
        return;
      }

      angular.forEach($scope.results, function(result, key) {
         post_names.findIndex(function(obj) {if(obj.album === result.name){
           result.name += ' **already been posted**';
           result.link = obj.link;
           console.log (obj.link)
           ;}});

        // if(post_names.findIndex(i => i.album === result.name) != -1){
        //    result.name += ' **already been posted**';
        // }
      });

    });

  };

  $scope.getDiscogsData = function (post) {
     var apiKey = 'NkGkQmxCMALmQCBYYdnZ';
     var apiSecret = 'npMAgZwCuvfselUUpysRCqyXdQUrqcZh';
     // angular.forEach($scope.posts, function(post, key) {
     //  if(post.media_info){
      $http({
  method: 'GET',
  url : 'https://api.discogs.com/database/search?' + 'artist=' + post.media_info.artist + '&release_title=' + post.media_info.album +
  '&key=' + apiKey + '&secret=' + apiSecret + '&country=us' + "&type=release"
   }).then(function successCallback(response) {
  if(response.data.results[0]){
     console.log(response.data);
  Post.label(post.$id, response.data.results[0].label);
  Post.genre(post.$id, response.data.results[0].genre);

    }
  })
 }
 // });
// }

  $scope.save = function(post) {
    if($scope.user && Auth.$getAuth().uid != post.creator_id){
      console.log(post);
      Profile.savePost(Auth.$getAuth().uid, post.$id, true);
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



  // var init = function () {
  //
    // if($scope.user){
    //   chatRef.limitToLast(1).on("child_added", function(snap) {
    //     if($cookieStore.get('last_chat_'+'firsttoflock') == snap.key()){
    //       return;
    //     }
    //     if(!$cookieStore.get('last_chat_'+'firsttoflock')){
    //       $cookieStore.put('last_chat_'+'firsttoflock', snap.key());
    //       return;
    //     }
    //
    //   });
    //
    // };
  // };
  //
  // init();

  $scope.trophy = function(user_id){
      return Trophy.is_last_week_winner(user_id);
  }
  $scope.crown = function(user_id){
      return Trophy.is_last_month_winner(user_id);
  }
  $scope.poop = function(user_id){
      return Trophy.is_last_week_loser(user_id);
  }
};
  // $scope.batchUpdate = function(){

  //   var today = $filter('date')(new Date(),'yyyy-MM-dd HH:mm:ss');

  //   angular.forEach($scope.posts, function(post) {
  //    ref.child("posts").child(post.$id).update({'media_type': 'spotify'});
  // });


  // }

} else {
  console.log("Logged out");
  $location.path('/login');
}
})
};
