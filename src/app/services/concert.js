module.exports = function ($firebaseArray, $firebaseObject, FIREBASE_URL, Users, Notification, Util) {
  // var ref = firebase.database().ref();
  // var user_id = Users.current_user_id;
  // if(Users.current_group && user_id){
  // var concerts = $firebaseArray(ref.child('concerts').child(user_id));
  // }
  //
  // var Concert = {
  //   all: concerts,
  //
  //   add: function (concert, bit_id) {
  //     ref.child('concerts').child(user_id).child(bit_id).once("value", function(snapshot) {
  //         if(!snapshot.exists()){
  //            Notification.add_action(user_id, {
  //             url: "/shows/",
  //             msg: "Upcoming concert for " + Util.trim(concert.artist_name, 25) + "."
  //           });
  //   }
  //   return ref.child('concerts').child(user_id).child(bit_id).update(concert);
  // })
  //   },
  //
  //   get: function () {
  //     return concerts;
  //   },
  //
  //   // get_reference: function(postId){
  //   //   return ref.child('posts').child(Users.current_group).child(postId);
  //   // },
  //
  //   delete: function (concert) {
  //     // ref.child('concerts').child(user_id).child(concert.post_id).remove();
  //     return ref.child('concerts').child(user_id).child(concert.bit_id).update({'removed':true});
  //   }
  // };
  var Concert = {};
  return Concert;
};
