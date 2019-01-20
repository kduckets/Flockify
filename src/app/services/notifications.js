module.exports = function($firebaseArray, $firebaseObject, FIREBASE_URL, Users, $q, Auth) {
   var authData = firebase.auth().currentUser;
   if(authData){
   var notificationRef = firebase.database().ref("notifications");
   var userNotifications = $firebaseObject(notificationRef.child(Users.current_user_id));
   }
  var result = {
    add_action: function (creator_id, notification) {
      if(authData){
      notificationRef.child(creator_id).child(Users.current_group).child('actions').push(notification);
      notificationRef.child(creator_id).child(Users.current_group).child('actions').update({ new:true });
    }
    },
    page_view: function (url) {
      // pass in the url of the page to check for in the current group
      if(authData){
      var obj = $firebaseObject(notificationRef.child(Users.current_user_id).child(Users.current_group).child('actions'));
      obj.$remove().then(function(ref) {
      }, function(error) {
          console.log("Error:", error);
          });
    }
  }
  };

  return result;

};
