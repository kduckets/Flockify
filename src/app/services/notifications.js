module.exports = function($firebaseArray, $firebaseObject, FIREBASE_URL, Users, $q) {
  console.log(Users.current_user_id);
  var notificationRef = new Firebase(FIREBASE_URL).child("notifications");
  var userNotifications = $firebaseObject(notificationRef.child(Users.current_user_id));

  var result = {
    add_action: function (creator_id, notification) {
      notificationRef.child(creator_id).child(Users.current_group).child('actions').push(notification);
    },
    page_view: function (url) {
      // pass in the url of the page to check for in the current group
      notificationRef.child(Users.current_user_id).child(Users.current_group).child('actions').orderByChild('url').equalTo(url).on('child_added', function(snapshot){
        snapshot.ref().remove();
      });
    }
  };

  return result;
};
