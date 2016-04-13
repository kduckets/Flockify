module.exports = function($firebaseArray, $firebaseObject, FIREBASE_URL, Auth, Post, Users, Profile, $q) {
  var ref = new Firebase(FIREBASE_URL);
  var posts = $firebaseArray(ref.child('posts'));

  var actionResult = {

    upvote: function(post, media_type) {
      var id = Users.current_user_id;
      var defer = $q.defer();
      if (id != post.creator_id) {

        ref.child('user_scores').child(Users.current_group).child(post.creator_id).once("value", function(snapshot) {
          var val = snapshot.val();
          if (!val){
            console.error("No snapshot found for ", post.creator_id);
            return;
          }
          var total_score = val.album_score;
          var weekly_score = val.weekly_scores.album_score;

          var actions_ref = ref.child('user_actions').child(id).child(post.$id);
          var current_actions = $firebaseObject(actions_ref);

          current_actions.$loaded().then(function(res) {
            if (res.up) {
              var msg = 'Already upvoted "' + post.media_info.album + '"';
              defer.resolve(msg);
              return;
            }

            var score_mod = 1;
            if (res.down) {
              actions_ref.child('down').remove();
            } else {
              actions_ref.update({
                'up': true
              });
            }

            post.score += score_mod;
            total_score += score_mod;
            weekly_score += score_mod;
            Post.vote(post.$id, post.score);

            ref.child("user_scores").child(post.creator_id).update({
              'album_score': total_score
            });

            var monday = moment().startOf('isoweek');
            if (moment(post.date) > monday) {
              ref.child("user_scores").child(post.creator_id).child('weekly_scores').update({
                'album_score': weekly_score
              });
            }

            var msg = 'Gave "' + post.media_info.album + '" an upvote!';
            defer.resolve(msg);

          });
        });

      }
      return defer.promise;
    },

    downvote: function(post, media_type) {
      var id = Users.current_user_id;
      var defer = $q.defer();
      if (id != post.creatorUID) {
        ref.child('user_scores').child(Users.current_group).child(post.creator_id).once("value", function(snapshot) {
          var val = snapshot.val();
          if (!val){
            console.error("No snapshot found for ", post.creator_id);
            return;
          }
          var total_score = val.album_score;
          var weekly_score = val.weekly_scores.album_score;
          var actions_ref = ref.child('user_actions').child(id).child(post.$id);
          var current_actions = $firebaseObject(actions_ref);
          current_actions.$loaded().then(function(res) {
            if (res.down) {
              var msg = 'Already downvoted "' + post.media_info.album + '"';
              defer.resolve(msg);
              return;
            }

            var score_mod = -1;
            if (res.up) {
              actions_ref.child('up').remove();
            } else {
              actions_ref.update({
                'down': true
              });
            }

            post.score += score_mod;
            total_score += score_mod;
            weekly_score += score_mod;
            Post.vote(post.$id, post.score);

            ref.child("user_scores").child(post.creator_id).update({
              'album_score': total_score
            });

            var monday = moment().startOf('isoweek');
            if (moment(post.date) > monday) {
              ref.child("user_scores").child(post.creator_id).child('weekly_scores').update({
                'album_score': weekly_score
              });
            }

            var msg = 'Gave "' + post.media_info.album + '" a downvote';
            defer.resolve(msg);
          });
        });
      }
      return defer.promise;
    },

    starPost: function(post, media_type) {
      var id = Users.current_user_id;
      var defer = $q.defer();
      if (id != post.creatorUID) {
        ref.child('user_scores').child(Users.current_group).child(post.creator_id).once("value", function(snapshot) {

          var val = snapshot.val();
          if (!val){
            console.error("No snapshot found for ", post.creator_id);
            return;
          }
          var total_score = val.album_score;
          var user_stars = val.stars;
          var weekly_score = val.weekly_scores.album_score;

          var actions_ref = ref.child('user_actions').child(id).child(post.$id);
          var current_actions = $firebaseObject(actions_ref);
          current_actions.$loaded().then(function(res) {
            if (res.star) {
              var msg = 'Already gave "' + post.media_info.album + '" a star';
              defer.resolve(msg);
              return;
            }

            actions_ref.update({
              'star': true
            });

            post.score += 2;
            Post.vote(post.$id, post.score);
            post.stars += 1;
            Post.star(post.$id, post.stars);

            total_score = total_score + 2;
            user_stars = user_stars + 1;
            weekly_score = weekly_score + 2;
            ref.child("user_scores").child(post.creator_id).update({
              'album_score': total_score
            });
            ref.child("user_scores").child(post.creator_id).update({
              'stars': user_stars
            });

            var monday = moment().startOf('isoweek');
            if (moment(post.date) > monday) {
              ref.child("user_scores").child(post.creator_id).child('weekly_scores').update({
                'album_score': weekly_score
              });
            }

            var msg = 'Gave "' + post.media_info.album + '" a star!';
            defer.resolve(msg);
          });
        });
      }
      return defer.promise;
    }

  };
  return actionResult;
};
