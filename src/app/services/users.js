module.exports = function($firebaseArray, $firebaseObject, $route, Auth, FIREBASE_URL){
  var usersRef = new Firebase(FIREBASE_URL+'/users');
  var users = $firebaseArray(usersRef);
  var current_group = localStorage.getItem('current_group');
  var current_group_name = '';
  var current_user_auth_data = Auth.$getAuth();
  var current_user_id = (current_user_auth_data) ? current_user_auth_data.uid : null;
  var current_user_ref = (current_user_auth_data) ? usersRef.child(current_user_id) : null;
  var current_user = (current_user_auth_data) ? $firebaseObject(current_user_ref) : null;
  var subscribed_groups = {'groups': []};

  if (current_user) {
    current_user.$loaded().then(function() {
      var group_ref = new Firebase(FIREBASE_URL + "/groups");
      $.each(Object.keys(current_user.groups), function (idx, group_id) {
        var group = $firebaseObject(group_ref.child(group_id));
        group.$loaded().then(function (snapshot) {
          if (group_id == current_group) {
            current_group_name = snapshot.group_name;
          }
          subscribed_groups.groups.push({id: group_id, group_name: snapshot.group_name})
        });
      });
    });
  }


  var Users = {
    // todo remove getProfile and getUsername
    getProfile: function(uid) {
      return $firebaseObject(usersRef.child(uid));
    },
    getUsername: function(uid) {
      return users.$getRecord(uid).username;
    },
    set_current_group: function(group_id) {
      current_group = group_id;
      localStorage.setItem('current_group', group_id);
      window.location.reload();
    },

    all: users,
    subscribed_groups: subscribed_groups,
    current_group: current_group,
    current_group_name: current_group_name,
    current_user: current_user,
    current_user_ref: current_user_ref,
    current_user_id: current_user_id

  };
  return Users;
};
