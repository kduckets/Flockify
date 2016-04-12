module.exports = function($firebaseArray, $firebaseObject, FIREBASE_URL){
    var usersRef = new Firebase(FIREBASE_URL+'/profile');
    var users = $firebaseArray(usersRef);

    var Users = {
  		getProfile: function(uid){
   			 return $firebaseObject(usersRef.child(uid));
  		},
  		getUsername: function(uid){
    		 return users.$getRecord(uid).username;
  		},
  			all: users
		};

    return Users;
  };