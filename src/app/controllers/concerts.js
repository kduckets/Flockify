module.exports = function ($scope, $routeParams, Profile, Post, Auth, $firebaseArray, FIREBASE_URL, Users,
  $location, $filter, Concert, Notification, $http, bandsintownFactory, $route, $firebaseObject, $window, $firebaseAuth) {

var auth = $firebaseAuth();

auth.$onAuthStateChanged(function(user) {
  var ref = firebase.database().ref();
  Notification.page_view("/shows/");
  var user_id = user.uid;
  var authData = Auth.$getAuth();
  $scope.filter_start_date = moment().subtract(1, 'days');
  $scope.only_upvoted = false;
  $scope.user = Users.getProfile(authData.uid);
  $scope.username = $scope.user.username;

  $scope.getUsername = function(userId){
    return Users.getUsername(userId);
  }

  $scope.goToAlbum = function(url){
    $location.path('/albums/'+url);
  }


  $scope.toggleSearch = false;
  $scope.headers = [
    {
      name:'',
      field:'thumb_url'
    },
    {
      name: 'Band',
      field: 'artist_name'
    },{
      name: 'Date',
      field: 'formatted_datetime'
    },
    {
      name:'Venue',
      field: 'venue_name'
    },{
      name: 'Location',
      field: 'formatted_location'
    },
    {
      name: 'Tickets',
      field: 'ticket_status'
    }
  ];

  $scope.headers_mobile = [
    {
      name:'',
      field:'thumb_url'
    },
    {
      name: 'Band',
      field: 'artist_name'
    },{
      name: 'Date',
      field: 'formatted_datetime'
    },
    {
      name:'Venue',
      field: 'venue_name'
    }
  ];

 ref.child('concerts').child(user_id).on('value', function(dataSnapshot) {
  //todo: check for posts with same artists and combine
  //todo: show groups that posts are in
  //todo: add to calendar button
  //todo: notifications for concerts coming up

   var dataObj = dataSnapshot.val();
   $scope.content = $.map(dataObj, function(value, index) {
    return [value];
});
});

 $scope.removeConcert = function(concert){
   ref.child('concerts').child(user_id).child(concert.bit_id).update({'removed':true});
 };

$scope.getConcertsFromLikes = function(){

  Profile.getPosts(user.uid).then(function(posts) {

  $scope.getConcerts(posts);
  Profile.getLikes(user.uid).then(function(likes) {

  $scope.getConcerts(likes);

});

});
};

 $scope.getConcerts = function(posts){
    $scope.queue = [];


// //todo: clean this shit up
// //todo: don't call api if show is already in concerts content
//
//
//    // ************ get concerts *****************************
//    //todo: move to server side; nightly run for all users?
//
//
  var promises = [];

$http.get("https://ipinfo.io/").then(function (resp){
    $scope.loading = true;
    setTimeout(function(){
    $scope.loading = false;

    }, 30000);
    $scope.ip = resp.data.ip;
 angular.forEach(posts, function(post, key) {
  if (post.media_info && post.media_info.artist) {
     var song_kick_body = {'artist': post.media_info.artist, 'ip':$scope.ip};

     $http.post('/api/songkick', song_kick_body).success(function(resp) {

     if(resp.resultsPage.results !== undefined && resp.resultsPage.results.event != undefined){
     var concert = {};
     concert.artist = resp.resultsPage.results.event[0].performance[0].displayName;
     concert.artist_name = resp.resultsPage.results.event[0].performance[0].displayName;
     concert.thumb_url = post.image_small;
     concert.tickets_url = resp.resultsPage.results.event[0].uri;
     concert.show_date = resp.resultsPage.results.event[0].start.datetime;
     concert.venue_name = resp.resultsPage.results.event[0].venue.displayName;
     concert.venue_city = resp.resultsPage.results.event[0].location.city;
     // concert.venue_region = resp.venue.region;
     concert.ticket_status = 'Tickets';
     concert.group = 'firsttoflock';
     concert.formatted_location = resp.resultsPage.results.event[0].location.city;
     concert.formatted_datetime = resp.resultsPage.results.event[0].start.datetime;
     concert.post_id = post.$id;
     //TODO: use bandsintown concert ID for key in DB and go through all respnoses (multiple concerts for same artist)
     concert.bit_id = resp.resultsPage.results.event[0].id;

     var actions_ref = ref.child('user_actions').child(user.uid).child(post.$id);

     var current_actions = $firebaseObject(actions_ref);

     current_actions.$loaded().then(function(res) {

     if(res.up || res.star || user.uid === post.creator_id) {
      concert.upvoted = true;
     }
     ref.child('concerts').child(user.uid).child(concert.bit_id).update(concert);
   });

 }
}).catch(function (response) {
  console.log('error, adding to queue', response);
  console.log('length',$scope.queue.length);
    if(post.media_info && post.media_info.artist){
     $scope.loadingCircle = true;
     $scope.queue.push(post);
      console.log('length',$scope.queue.length);
    }
});
    console.log('queue',$scope.queue);
    // setTimeout(function(){
    //
    // if($scope.queue.length > 1){
    //   $scope.getConcerts($scope.queue);
    // }
    //
    // if($scope.queue.length == 1)
    //   {$scope.loadingCircle = false;}
    //
    // }, 70000);
};
})


  $scope.custom = {band: 'bold'};
  $scope.sortable = ['formatted_datetime'];
  $scope.thumbs = 'thumb_url';

})

}})
};
