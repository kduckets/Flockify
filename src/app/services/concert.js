module.exports = function ($firebaseArray, $firebaseObject, FIREBASE_URL, Users) {
  var ref = new Firebase(FIREBASE_URL);
  var user_id = Users.current_user_id;
  if(Users.current_group){
  var concerts = $firebaseArray(ref.child('concerts').child(user_id));
  }

  var Concert = {
    all: concerts,

    add: function (concert, post_id) {
      return ref.child('concerts').child(user_id).child(post_id).update(concert);
    },

    get: function () {
      return concerts;
    },

    // get_reference: function(postId){
    //   return ref.child('posts').child(Users.current_group).child(postId);
    // },

    delete: function (concert) {
      ref.child('concerts').child(user_id).child(concert.post_id).remove();
    }
  };
  return Concert;
};