module.exports = function($firebase, FIREBASE_URL, Auth, Post, Profile, $q) {
  var ref = new Firebase(FIREBASE_URL);
  var posts = $firebase(ref.child('posts')).$asArray();
  var signedIn = Auth.signedIn;
  var user = Auth.user;


  var actionResult = {
    upvote: function(post, media_type) {
        var defer = $q.defer();

      if (signedIn() && user.uid != post.creatorUID) {

       

        ref.child('user_scores').child(post.creator).once("value", function(snapshot) {
          //TODO: use media_type
          var score = snapshot.val().album_score;
          var weekly_score = snapshot.val().weekly_scores.album_score;


          var current_vote = $firebase(ref.child('user_votes').child(user.uid).child(post.$id).child('vote')).$asObject();
          current_vote.$loaded().then(function(res) {
            if (res.$value == 'up') {
              //already upvoted
              var msg = 'Already upvoted "' + post.album + '"';
              defer.resolve(msg);
          
            };
            if (res.$value == 'down' || !res.$value) {
              post.votes += 1;
              Post.vote(post.$id, post.votes);
              Profile.setVote(user.uid, post.$id, 'up');
              score = score + 1;
              weekly_score = weekly_score + 1;

              //todo: use media_type
              ref.child("user_scores").child(post.creator).update({
                'album_score': score
              });

              var monday = moment().startOf('isoweek');
              console.log(monday.format('YYYY-MM-DD'));
              if (moment(post.date) > monday) {
                //todo: use media_type
                ref.child("user_scores").child(post.creator).child('weekly_scores').update({
                  'album_score': weekly_score
                });
              };

              var msg = 'Gave "' + post.album + '" an upvote!';
              defer.resolve(msg);

            };

          })
        })

      }
          return defer.promise;
    },

    downvote: function(post, media_type) {
        var defer = $q.defer();

      if (signedIn() && user.uid != post.creatorUID) {

        ref.child('user_scores').child(post.creator).once("value", function(snapshot) {
          var score = snapshot.val().album_score;
          var weekly_score = snapshot.val().weekly_scores.album_score;
          var current_vote = $firebase(ref.child('user_votes').child(user.uid).child(post.$id).child('vote')).$asObject();
          current_vote.$loaded().then(function(res) {
            if (res.$value == 'down') {
              //already downvoted
              var msg = 'Already downvoted "' + post.album + '"';
              defer.resolve(msg);
            };
            if (res.$value == 'up' || !res.$value) {
              post.votes -= 1;
              Post.vote(post.$id, post.votes);
              Profile.setVote(user.uid, post.$id, 'down');
              score = score - 1;
              weekly_score = weekly_score - 1;
              ref.child("user_scores").child(post.creator).update({
                'album_score': score
              });

              var monday = moment().startOf('isoweek');

              if (moment(post.date) > monday) {
                ref.child("user_scores").child(post.creator).child('weekly_scores').update({
                  'album_score': weekly_score
                });
              };

              var msg = 'Gave "' + post.album + '" a downvote';
              defer.resolve(msg);

            };

          })
        })

      }
        return defer.promise;
    },

    starPost: function(post, media_type) {
      var defer = $q.defer();
      if (signedIn() && user.uid != post.creatorUID) {

        ref.child('user_scores').child(post.creator).once("value", function(snapshot) {

          //todo use media_type
          var score = snapshot.val().album_score;
          var user_stars = snapshot.val().stars;
          var weekly_score = snapshot.val().weekly_scores.album_score;


          var current_vote = $firebase(ref.child('user_votes').child(user.uid).child(post.$id).child('star')).$asObject();
          current_vote.$loaded().then(function(res) {

            if (res.$value == 'gold') {
              var msg = 'Already gave "' + post.album + '" a star';
              defer.resolve(msg);
            };

            if (!res.$value) {
              post.votes += 2;
              Post.vote(post.$id, post.votes);
              post.stars += 1;
              Post.star(post.$id, post.stars);
              Profile.setStar(user.uid, post.$id, 'gold');
              score = score + 2;
              user_stars = user_stars + 1;
              weekly_score = weekly_score + 2;
              ref.child("user_scores").child(post.creator).update({
                'album_score': score
              });
              ref.child("user_scores").child(post.creator).update({
                'stars': user_stars
              });
              var monday = moment().startOf('isoweek');

              if (moment(post.date) > monday) {
                ref.child("user_scores").child(post.creator).child('weekly_scores').update({
                  'album_score': weekly_score
                });
              };

              var msg = 'Gave "' + post.album + '" a star!';
              defer.resolve(msg);
            };

          });


        });


      };
        return defer.promise;

    }



  }

  return actionResult;

};
