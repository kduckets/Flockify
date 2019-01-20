module.exports = function ($scope, $routeParams, Profile, Post, Auth, $firebaseArray, FIREBASE_URL, Users,
  $location, $filter, Concert, Notification, $http, bandsintownFactory, $route, $firebaseObject, $window) {
  //var ref = firebase.database().ref();
  //Notification.page_view("/shows/");
  //var user_id = Users.current_user_id;
  //var authData = Auth.$getAuth();
  $scope.filter_start_date = moment().subtract(1, 'days');
  $scope.only_upvoted = true;
  $scope.show_zip = false;

//   if (authData) {
//      $scope.user = Users.getProfile(authData.uid);
//      $scope.username = $scope.user.username;
//       Users.get_zip(authData.uid).then(function(zip){
//       $scope.user_zip = zip;
//       if(!$scope.user_zip){
//       $scope.show_zip_notification = true;
//     }
//
//       $http({
//       method: 'GET',
//       url: 'https://maps.googleapis.com/maps/api/geocode/json?address='+ zip +'&sensor=true' + '&key=AIzaSyDJpVexqRWzN_q9XnNg2kRa0HxkuK15Hk0'
//     }).then(function successCallback(response) {
//       console.log(response);
//       var formatted_address = response.data.results[0].formatted_address;
//       var city_state = formatted_address.replace(/[0-9].*$/,"");
//     // var city = response.data.results[0].address_components[1].long_name;
//     // var state = response.data.results[0].address_components[3].short_name;
//     // var city_state = city+', '+state;
//     $scope.location = ($scope.user_zip ? city_state: "use_geoip");
//         var flag = localStorage.getItem('flag');
//     setTimeout(function(){ localStorage.setItem('flag', moment().startOf('hour').format("hA")); }, 30000);
//
//  // if(flag != moment().startOf('hour').format("hA")){
//      $scope.getConcertsFromLikes();
//     // }
//         });
//        });
//
//
//
//   } else {
//     $scope.user = null;
//     $scope.username = null;
//     $location.path('/login');
//     console.log("User is logged out");
//   }
//
//   $scope.getUsername = function(userId){
//     return Users.getUsername(userId);
//   }
//
//   $scope.goToTickets = function(url){
//     $window.open(url, "_blank");
//   }
//
//   $scope.updateZip =function(zip_code){
// if(zip_code){
//   Users.set_zip(authData.uid,zip_code);
//   $scope.show_zip_notification = false;
//   $scope.show_zip = false;
//   $scope.user_zip = zip_code;
//       $http({
//       method: 'GET',
//       url: 'https://maps.googleapis.com/maps/api/geocode/json?address='+ zip_code +'&sensor=true'
//     }).then(function successCallback(response) {
//       console.log(response);
//       var formatted_address = response.data.results[0].formatted_address;
//       var city_state = formatted_address.replace(/[0-9].*$/,"");
//     // var city = response.data.results[0].address_components[1].long_name;
//     // var state = response.data.results[0].address_components[3].short_name;
//     // var city_state = city+', '+state;
//     $scope.location = ($scope.user_zip ? city_state: "use_geoip");
//     $scope.getConcertsFromLikes();
//         });
//     }
//   }
//
//
//
//   $scope.toggleSearch = false;
//   $scope.headers = [
//     {
//       name:'',
//       field:'thumb_url'
//     },
//     {
//       name: 'Band',
//       field: 'artist_name'
//     },{
//       name: 'Date',
//       field: 'formatted_datetime'
//     },
//     {
//       name:'Venue',
//       field: 'venue_name'
//     },{
//       name: 'Location',
//       field: 'formatted_location'
//     },
//     {
//       name: 'Tickets',
//       field: 'ticket_status'
//     }
//   ];
//
//  ref.child('concerts').child(user_id).on('value', function(dataSnapshot) {
//   //todo: check for posts with same artists and combine
//   //todo: show groups that posts are in
//   //todo: add to calendar botton
//   //todo: notifications for concerts coming up
//
//    var dataObj = dataSnapshot.val();
//    $scope.content = $.map(dataObj, function(value, index) {
//     return [value];
// });
//      console.log($scope.content);
// });
//
//  $scope.removeConcert = function(concert){
//   Concert.delete(concert);
//  }
//
// $scope.getConcertsFromLikes = function(){
//
// Profile.getPosts(authData.uid).then(function(posts) {
//
//   $scope.getConcerts(posts);
//   Profile.getLikes(authData.uid).then(function(likes) {
//
//   $scope.getConcerts(likes);
//
// });
//
// });
// };
//
//  $scope.getConcerts = function(posts){
//     $scope.queue = [];
//
//
// //todo: clean this shit up
// //todo: don't call api if show is already in concerts content
//
//
//    // ************ get concerts *****************************
//    //todo: move to server side; nightly run for all users?
//
//
//  angular.forEach(posts, function(post, key) {
//   if (post.media_info && post.media_info.artist) {
//     bandsintownFactory.getEventsFromArtistByLocation({
//     artist:post.media_info.artist, // ? and / characters must be double escaped. Artists such as "AC/DC" will end up as "AC%252FDC"
//     location:$scope.location, // city,state (US or CA) || city,country || lat,lon || ip address
//     // radius:"<RADIUS">, // (optional) (default: 25) in miles. valid values: 0-150
//     app_id:"Flockify", //The application ID can be anything, but should be a word that describes your application or company.
// }).then(function (response) {
//     if(response.data[0]){
//      console.log(response);
//      angular.forEach(response.data, function(resp, key) {
//      // $scope.concert_obj = response.data[0];
//      var concert = {};
//      concert.artist = resp.artists;
//      concert.artist_name = resp.artists[0].name;
//      concert.thumb_url = resp.artists[0].thumb_url;
//      concert.tickets_url = resp.ticket_url;
//      concert.show_date = resp.datetime;
//      // $scope.concert.venue_url = response.data[0].venue.url;
//      concert.venue_name = resp.venue.name;
//      concert.venue_city = resp.venue.city;
//      concert.venue_region = resp.venue.region;
//      concert.ticket_status = resp.ticket_type;
//      concert.group = Users.current_group;
//      concert.formatted_location = resp.formatted_location;
//      concert.formatted_datetime = resp.formatted_datetime;
//      concert.post_id = post.$id;
//      //TODO: use bandsintown concert ID for key in DB and go through all respnoses (multiple concerts for same artist)
//      concert.bit_id = resp.id;
//
//      var actions_ref = ref.child('user_actions').child(authData.uid).child(post.$id);
//
//      var current_actions = $firebaseObject(actions_ref);
//
//      current_actions.$loaded().then(function(res) {
//
//      if(res.up || res.star || authData.uid === post.creator_id) {
//       concert.upvoted = true;
//      }
//      Concert.add(concert, concert.bit_id);
//    });
//     });
//     }
// }).catch(function (response) {
//   console.log('error, adding to queue', response);
//   console.log('length',$scope.queue.length);
//     if(post.media_info && post.media_info.artist){
//       $scope.loadingCircle = true;
//      $scope.queue.push(post);
//       console.log('length',$scope.queue.length);
//     }
// });
// }
//
//    });
//     console.log('queue',$scope.queue);
//     setTimeout(function(){
//
//     if($scope.queue.length > 1){
//       $scope.getConcerts($scope.queue);
//     }
//
//     if($scope.queue.length == 1)
//       {$scope.loadingCircle = false;}
//
//     }, 70000);
//
//
// };
//
//
//
//   $scope.custom = {band: 'bold'};
//   $scope.sortable = ['formatted_datetime'];
//   $scope.thumbs = 'thumb_url';

};
