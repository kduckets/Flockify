module.exports = function($firebaseArray, $firebaseObject, FIREBASE_URL, Notification, Auth, Post, Users, Profile, Util, $q) {
  var ref = new Firebase(FIREBASE_URL);
  var posts = $firebaseArray(ref.child('posts'));

  var actionResult = {

    upvote: function(post, media_type) {
      var defer = $q.defer();
      var id = Users.current_user_id;
      console.log('id:', id);
      console.log('post creator:',post.creator_id);
      // if(id == post.creator_id){
      //   var msg = 'You cannot vote on your own post';
      //         defer.resolve(msg);
      //         return;
      // }

      if (id != post.creator_id) {

        ref.child('user_scores').child(Users.current_group).child(post.creator_id).once("value", function(snapshot) {
          var val = snapshot.val();
          if (!val){
            console.error("No snapshot found for ", post.creator_id);
            return;
          }

           // if(!val[current_week]){
           //    var scores = {};
           //     scores[current_week] = {album_score:0};
           //  ref.child('user_scores').child(Users.current_group).child(post.creator_id).update(scores);
           // }

          var total_score = val.album_score;


          var actions_ref = ref.child('user_actions').child(id).child(post.$id);
          console.log(id);
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
            Post.vote(post.$id, post.score);

            ref.child("user_scores").child(Users.current_group).child(post.creator_id).update({
              'album_score': total_score
            });

            var monday = moment().startOf('isoweek');
            if (moment(post.created_ts) > monday) {
                  var week = moment().startOf('isoweek').format('MM_DD_YYYY');
                  var current_week = 'weekly_score_'+week;
                  var weekly_score = val[current_week].album_score;
                      weekly_score += score_mod;
              ref.child("user_scores").child(Users.current_group).child(post.creator_id).child(current_week).update({
                'album_score': weekly_score
              });
            }

            var month_start = moment().startOf('month');
            if (moment(post.created_ts) > month_start) {
                  var month = moment().startOf('month').format('MM_DD_YYYY');
                  var current_month = 'monthly_score_'+month;
                  var monthly_score = val[current_month].album_score;
                      monthly_score += score_mod;
              ref.child("user_scores").child(Users.current_group).child(post.creator_id).child(current_month).update({
                'album_score': monthly_score
              });
            }

            var msg = 'Gave "' + post.media_info.album + '" an upvote!';
            Notification.add_action(post.creator_id, {
              url: "/albums/" + post.$id,
              msg: "'" + Util.trim(post.media_info.album, 25) + "' was given an upvote."
            });
            defer.resolve(msg);

          });
        });

      }
      return defer.promise;
    },

    downvote: function(post, media_type) {
      var defer = $q.defer();
      var id = Users.current_user_id;
      console.log('id:', id);
      console.log('post creator:',post.creator_id);
      // if(id == post.creator_id){
      //   var msg = 'You cannot vote on your own post';
      //         defer.resolve(msg);
      //         return;
      // }

      if (id != post.creator_id) {
        ref.child('user_scores').child(Users.current_group).child(post.creator_id).once("value", function(snapshot) {
          var val = snapshot.val();
          if (!val){
            console.error("No snapshot found for ", post.creator_id);
            return;
          }
           // if(!val[current_week]){
           //    var scores = {};
           //     scores[current_week] = {album_score:0};
           //  ref.child('user_scores').child(Users.current_group).child(post.creator_id).update(scores);
           // }
          var total_score = val.album_score;
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
            Post.vote(post.$id, post.score);

            ref.child("user_scores").child(Users.current_group).child(post.creator_id).update({
              'album_score': total_score
            });

            var monday = moment().startOf('isoweek');
            if (moment(post.created_ts) > monday) {
              var week = moment().startOf('isoweek').format('MM_DD_YYYY');
              var current_week = 'weekly_score_'+week;
              var weekly_score = val[current_week].album_score;
                    weekly_score += score_mod;
              ref.child("user_scores").child(Users.current_group).child(post.creator_id).child(current_week).update({
                'album_score': weekly_score
              });
            }

            var month_start = moment().startOf('month');
            if (moment(post.created_ts) > month_start) {
                  var month = moment().startOf('month').format('MM_DD_YYYY');
                  var current_month = 'monthly_score_'+month;
                  var monthly_score = val[current_month].album_score;
                      monthly_score += score_mod;
              ref.child("user_scores").child(Users.current_group).child(post.creator_id).child(current_month).update({
                'album_score': monthly_score
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
      var defer = $q.defer();
      var id = Users.current_user_id;
      console.log('id:', id);
      console.log('post creator:',post.creator_id);
      // if(id == post.creator_id){
      //   var msg = 'You cannot vote on your own post';
      //         defer.resolve(msg);
      //         return;
      // }

      if (id != post.creator_id) {
        ref.child('user_scores').child(Users.current_group).child(post.creator_id).once("value", function(snapshot) {

          var val = snapshot.val();
          if (!val){
            console.error("No snapshot found for ", post.creator_id);
            return;
          }
           // if(!val[current_week]){
           //    var scores = {};
           //     scores[current_week] = {album_score:0};
           //  ref.child('user_scores').child(Users.current_group).child(post.creator_id).update(scores);
           // }

          var total_score = val.album_score;
          var user_stars = val.stars;

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

            ref.child("user_scores").child(Users.current_group).child(post.creator_id).update({
              'album_score': total_score
            });
            ref.child("user_scores").child(Users.current_group).child(post.creator_id).update({
              'stars': user_stars
            });

            var monday = moment().startOf('isoweek');
            if (moment(post.created_ts) > monday) {
               var week = moment().startOf('isoweek').format('MM_DD_YYYY');
               var current_week = 'weekly_score_'+week;
               var weekly_score = val[current_week].album_score;
                      weekly_score = weekly_score + 2;
              ref.child("user_scores").child(Users.current_group).child(post.creator_id).child(current_week).update({
                'album_score': weekly_score
              });
            }

            var month_start = moment().startOf('month');
            if (moment(post.created_ts) > month_start) {
                  var month = moment().startOf('month').format('MM_DD_YYYY');
                  var current_month = 'monthly_score_'+month;
                  var monthly_score = val[current_month].album_score;
                      monthly_score = monthly_score + 2;
              ref.child("user_scores").child(Users.current_group).child(post.creator_id).child(current_month).update({
                'album_score': monthly_score
              });
            }

            var msg = 'Gave "' + post.media_info.album + '" a star!';
            Notification.add_action(post.creator_id, {
              url: "/albums/" + post.$id,
              msg: "'" + Util.trim(post.media_info.album, 25) + "' was given an star."
            });
            defer.resolve(msg);
          });
        });
      }
      return defer.promise;
    }

  };
  return actionResult;
};
