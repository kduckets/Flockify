module.exports = function($firebaseArray, $firebaseObject, FIREBASE_URL, Users, $q, Auth) {
   var authData = firebase.auth().currentUser;
   var notificationRef = firebase.database().ref("notifications");
  var result = {
    add_action: function (creator_id, notification) {
      notificationRef.child(creator_id).child('firsttoflock').child('actions').push(notification);
      notificationRef.child(creator_id).child('firsttoflock').child('actions').update({ new:true });
    },
    page_view: function (url) {
      // pass in the url of the page to check for in the current group
      if(authData){
      var obj = $firebaseObject(notificationRef.child(authData.uid).child('firsttoflock').child('actions'));
      obj.$remove().then(function(ref) {
      }, function(error) {
          console.log("Error:", error);
          });
    }
  }
  };

  return result;

};
