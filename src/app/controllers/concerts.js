module.exports = function ($scope, $routeParams, Profile, Post, Auth, $firebaseArray, FIREBASE_URL, Users, 
  $location, $filter, Concert, Notification, $http, bandsintownFactory, $route, $firebaseObject, $window) {
  var ref = new Firebase(FIREBASE_URL);
  Notification.page_view("/shows/");
  var user_id = Users.current_user_id;
  var authData = Auth.$getAuth();
  $scope.filter_start_date = moment().subtract(1, 'days');
  $scope.only_upvoted = true;
  $scope.show_zip = false;
  if (authData) {
     $scope.user = Users.getProfile(authData.uid);
     $scope.username = $scope.user.username;   
      Users.get_zip(authData.uid).then(function(zip){
      $scope.user_zip = zip;
      if(!$scope.user_zip){
      $scope.show_zip_notification = true;
    }
      
      $http({
      method: 'GET',
      url: 'https://maps.googleapis.com/maps/api/geocode/json?address='+ zip +'&sensor=true'
    }).then(function successCallback(response) {
      console.log(response);
      var formatted_address = response.data.results[0].formatted_address;
      var city_state = formatted_address.replace(/[0-9].*$/,"");
    // var city = response.data.results[0].address_components[1].long_name;
    // var state = response.data.results[0].address_components[3].short_name;
    // var city_state = city+', '+state;
    $scope.location = ($scope.user_zip ? city_state: "use_geoip");
    $scope.getConcerts();
        });
       });
    var flag = localStorage.getItem('flag');
    setTimeout(function(){ localStorage.setItem('flag', moment().startOf('hour').format("hA")); }, 30000);
    console.log('flag:', flag);
  
// if(flag != moment().startOf('hour').format("hA")){
     
   // }


  } else {
    $scope.user = null;
    $scope.username = null;
    $location.path('/login');
    console.log("User is logged out");
  }

  $scope.getUsername = function(userId){
    return Users.getUsername(userId);
  }

  $scope.goToAlbum = function(postid){
    console.log(postid);
    $location.path("/#/albums/" + postid);
  }

  $scope.updateZip =function(zip_code){
if(zip_code){
  Users.set_zip(authData.uid,zip_code);
  $scope.show_zip_notification = false;
  $scope.show_zip = false;
  $scope.user_zip = zip;
      $http({
      method: 'GET',
      url: 'https://maps.googleapis.com/maps/api/geocode/json?address='+ zip +'&sensor=true'
    }).then(function successCallback(response) {
      console.log(response);
      var formatted_address = response.data.results[0].formatted_address;
      var city_state = formatted_address.replace(/[0-9].*$/,"");
    // var city = response.data.results[0].address_components[1].long_name;
    // var state = response.data.results[0].address_components[3].short_name;
    // var city_state = city+', '+state;
    $scope.location = ($scope.user_zip ? city_state: "use_geoip");
    $scope.getConcerts();
        });
    }
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

 ref.child('concerts').child(user_id).on('value', function(dataSnapshot) {
  //todo: check for posts with same artists and combine
  //todo: show groups that posts are in
  //todo: add to calendar botton
  //todo: notifications for concerts coming up

   var dataObj = dataSnapshot.val();
   $scope.content = $.map(dataObj, function(value, index) {
    return [value];
});
     console.log($scope.content);
});

 $scope.removeConcert = function(concert){
  Concert.delete(concert);
 }

 $scope.getConcerts = function(){


  
  
   // ************temporary for past concerts*****************************
   Profile.getPosts(authData.uid).then(function(posts) {

 angular.forEach(posts, function(post, key) {
  if (post.media_info && post.media_info.artist) {
    bandsintownFactory.getEventsFromArtistByLocation({
    artist:post.media_info.artist, // ? and / characters must be double escaped. Artists such as "AC/DC" will end up as "AC%252FDC"
    location:$scope.location, // city,state (US or CA) || city,country || lat,lon || ip address
    // radius:"<RADIUS">, // (optional) (default: 25) in miles. valid values: 0-150
    app_id:"Flockify", //The application ID can be anything, but should be a word that describes your application or company.
}).then(function (response) {
    if(response.data[0]){
     console.log(response);
     // $scope.concert_obj = response.data[0];
     var concert = {};
     concert.artist = response.data[0].artists;
     concert.artist_name = response.data[0].artists[0].name;
     concert.thumb_url = response.data[0].artists[0].thumb_url;
     concert.tickets_url = response.data[0].ticket_url;
     concert.show_date = response.data[0].datetime;
     // $scope.concert.venue_url = response.data[0].venue.url;
     concert.venue_name = response.data[0].venue.name;
     concert.venue_city = response.data[0].venue.city;
     concert.venue_region = response.data[0].venue.region;
     concert.ticket_status = response.data[0].ticket_type;
     concert.group = Users.current_group;
     concert.formatted_location = response.data[0].formatted_location;
     concert.formatted_datetime = response.data[0].formatted_datetime;
     concert.post_id = post.$id;

     var actions_ref = ref.child('user_actions').child(authData.uid).child(post.$id);

     var current_actions = $firebaseObject(actions_ref);

     current_actions.$loaded().then(function(res) {

     if(res.up || authData.uid === post.creator_id) {
      concert.upvoted = true;
     }
     Concert.add(concert, post.$id);
   });

    }

}).catch(function (response) {
  console.log('error', response);
    //on error
});
}

   })

  });
   

// ************temporary for past concerts*****************************
 
};
  


  $scope.custom = {band: 'bold'};
  $scope.sortable = ['formatted_datetime'];
  $scope.thumbs = 'thumb_url';

};

