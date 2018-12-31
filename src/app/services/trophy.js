module.exports = function($firebaseArray, $firebaseObject, FIREBASE_URL, Users, $q, Auth) {
var authData = firebase.auth().currentUser;
  if (authData && Users.current_group) {
var ref = firebase.database().ref();
       var lastMonday = moment().subtract(1, 'weeks').startOf('isoWeek');
       var monday_formatted = lastMonday.format('MM_DD_YYYY');
       var last_week = 'weekly_score_'+monday_formatted;
       var last_month = 'monthly_score_'+moment().subtract(1,'months').startOf('month').format('MM_DD_YYYY');
       console.log(last_month);
       var scores = [];
       var high_score;
       var low_score;
       var month_scores = [];
       var high_score_month;
       var low_score_month;
       var users_in_group = $firebaseArray(ref.child('user_scores').child(Users.current_group)).$loaded(function(users){
    angular.forEach(users, function(user, key) {
        if(user[last_week]){
        scores.push(user[last_week].album_score);
        }
        });
    angular.forEach(users, function(user, key) {
        if(user[last_month]){
        month_scores.push(user[last_month].album_score);
        }
        });

       high_score_month = Math.max.apply(Math, month_scores);
       low_score_month = Math.min.apply(Math, month_scores);
       high_score = Math.max.apply(Math, scores);
       low_score = Math.min.apply(Math, scores);
       });
     }

var Trophy = {
  is_last_week_winner:function(user_id){
    if(Users.current_group){
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
  }
  },
  is_last_month_winner:function(user_id){
    if(Users.current_group){
    var result = false;
    ref.child('user_scores').child(Users.current_group).child(user_id).child(last_month).once("value", function(snapshot) {
      if(snapshot.val()){
      var user_score = snapshot.val().album_score;
      if(user_score == high_score_month){
        result = true;
      }
    }
    });
    return result;
  }
  },
    is_last_week_loser:function(user_id){
       if(Users.current_group){
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
  }
};
  return Trophy;
  };
