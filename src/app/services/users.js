module.exports = function($firebaseArray, $firebaseObject, Auth, FIREBASE_URL){
  var usersRef = new Firebase(FIREBASE_URL+'/users');
  var users = $firebaseArray(usersRef);
  var current_group = 'firsttoflock';
  var current_user_auth_data = Auth.$getAuth();
  var current_user_id = (current_user_auth_data) ? current_user_auth_data.uid : null;
  var current_user_ref = (current_user_auth_data) ? usersRef.child(current_user_id) : null;
  var current_user = (current_user_auth_data) ? $firebaseObject(current_user_ref) : null;

  var Users = {
    // todo remove getProfile and getUsername
    getProfile: function(uid) {
      return $firebaseObject(usersRef.child(uid));
    },
    getUsername: function(uid) {
      return users.$getRecord(uid).username;
    },

    all: users,
    current_group: current_group,
    current_user: current_user,
    current_user_ref: current_user_ref,
    current_user_id: current_user_id
  };
  return Users;
};
