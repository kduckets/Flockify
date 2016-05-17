module.exports = function ($scope, $routeParams, Profile, Post, Auth, $firebaseArray, FIREBASE_URL, Users, $filter, Concert) {
  var ref = new Firebase(FIREBASE_URL);
  var user_id = Users.current_user_id;
  var authData = Auth.$getAuth();
  $scope.filter_start_date = moment().subtract(1, 'days');
  $scope.only_upvoted = true;

  if (authData) {
     $scope.user = Users.getProfile(authData.uid);
     $scope.username = $scope.user.username;
  } else {
    $scope.user = null;
    $scope.username = null;
    $location.path('/login');
    console.log("User is logged out");
  }

  $scope.getUsername = function(userId){
    return Users.getUsername(userId);
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
  


  $scope.custom = {band: 'bold'};
  $scope.sortable = ['formatted_datetime'];
  $scope.thumbs = 'thumb_url';

};

