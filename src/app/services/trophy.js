module.exports = function($firebaseArray, $firebaseObject, FIREBASE_URL, Users, $q, Auth) {
var authData = Auth.$getAuth();
  if (authData) {
var ref = new Firebase(FIREBASE_URL);
       var lastMonday = moment().subtract(1, 'weeks').startOf('isoWeek');
       var monday_formatted = lastMonday.format('MM_DD_YYYY');
       var last_week = 'weekly_score_'+monday_formatted;
       var scores = [];
       var high_score;
       var users_in_group = $firebaseArray(ref.child('user_scores').child(Users.current_group)).$loaded(function(users){
    angular.forEach(users, function(user, key) {
        if(user[last_week]){
        scores.push(user[last_week].album_score);
        }
        });
       high_score = Math.max.apply(Math, scores); 
       low_score = Math.min.apply(Math, scores); 
       });
     }

var Trophy = {
  is_last_week_winner:function(user_id){
    var result = false;
    ref.child('user_scores').child(Users.current_group).child(user_id).child(last_week).once("value", function(snapshot) {
      if(snapshot.val()){
      var user_score = snapshot.val().album_score;
      if(user_score == high_score){
        result = true;
      }
    }
    });
    return result;
  },
    is_last_week_loser:function(user_id){
    var result = false;
    ref.child('user_scores').child(Users.current_group).child(user_id).child(last_week).once("value", function(snapshot) {
      if(snapshot.val()){
      var user_score = snapshot.val().album_score;
      if(user_score == low_score){
        result = true;
      }
    }
    });
    return result;
  }
};
  return Trophy;
  };