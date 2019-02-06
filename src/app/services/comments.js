module.exports = function ($firebaseArray, FIREBASE_URL, Auth, Post, Notification, $filter, Users, Util, $firebaseObject, $firebaseAuth) {
  var ref = firebase.database().ref();
  var comments = $firebaseArray(ref.child('comments').child('firsttoflock'));
  var commentsRef = firebase.database().ref("/comments");
  var chatRef = firebase.database().ref("/chats/" + 'firsttoflock');
  var auth = $firebaseAuth();
  var id = firebase.auth().currentUser.uid;
  return {
    all: comments,

    get_comments_for_post: function(post_id) {
      return $firebaseArray(ref.child('comments').child(post_id));
    },

    add_comment: function(comments_scope_array, post_id, comment) {
      var user = firebase.auth().currentUser;
      // TODO: figure out how we want to store dates
      // var date = new Date();
      // date.setMinutes(date.getTimezoneOffset());
      // var today = $filter('date')(new Date(),'yyyy-MM-dd HH:mm:ss Z');
      var type = comment.indexOf('http') != -1 ? 'gif' : 'text';
      var new_comment = {
        text: comment,
        type: type,
        creator_name: Users.getUsername(firebase.auth().currentUser.uid) || null,
        creator_id: firebase.auth().currentUser.uid,
        datetime_ts: moment.utc().format()
      };
      comments_scope_array.$add(new_comment);

      var post = Post.get(post_id);
      post.$loaded().then(function(){
        post.latest_comment = moment.utc().format();
        post.comments = (post.comments || 0) + 1;
        post.$save();

        if (firebase.auth().currentUser.uid != comment.creator_id && post_id != 'flock_groupchat') {
          Notification.add_action(comment.creator_id, {
            url: "/albums/" + post_id,
            msg: "'" + Util.trim(post.media_info.album) + "' was commented on by " + new_comment.creator_name
          });
        }

      });
    },

    delete_comment: function(comments_scope_array, post_id, comment){
      comments_scope_array.$remove(comment);
      comments_scope_array.$loaded().then(function(comments){
        Post.get_reference(post_id).update({'comments': comments.length});
      });
    },
    like_comment: function(comments_scope_array, post_id, comment){
      if(comment.creator_id != id){
      commentsRef.child(post_id).child(comment.$id).once('value', function(dataSnapshot) {
        console.log(comment);
          var post = Post.get(post_id);
          var actions_ref = ref.child('user_actions').child(id).child(post_id).child(comment.$id);
          var current_actions = $firebaseObject(actions_ref);
           current_actions.$loaded().then(function(res) {
            if (!res.like) {
          if(dataSnapshot.val().likes){
          var likes = dataSnapshot.val().likes;
          likes += 1;
            actions_ref.update({
                'like': true
              });

              Notification.add_action(comment.creator_id, {
              url: "/albums/" + post_id,
              msg: "Your comment on '" + Util.trim(post.media_info.album, 25) + "' was liked."
            });
        ref.child('user_scores').child('firsttoflock').child(comment.creator_id).once("value", function(snapshot) {
          var val = snapshot.val();
          if (!val){
            console.error("No snapshot found for ", comment.creator_id);
          }
                 if(val.comments_score){
             var comments_score = val.comments_score;
                }else{
                var comments_score = 0;
                }
             var new_score = comments_score + 1;
             ref.child("user_scores").child('firsttoflock').child(comment.creator_id).update({
              'comments_score': new_score
            });
        })
          return commentsRef.child(post_id).child(comment.$id).update({'likes': likes});

        }else{
          likes = 1;
            actions_ref.update({
                'like': true
              });

              Notification.add_action(comment.creator_id, {
              url: "/albums/" + post_id,
              msg: "Your comment on '" + Util.trim(post.media_info.album, 25) + "' was liked."
            });
          ref.child('user_scores').child('firsttoflock').child(comment.creator_id).once("value", function(snapshot) {
          var val = snapshot.val();
          if (!val){
            console.error("No snapshot found for ", comment.creator_id);
          }
                 if(val.comments_score){
             var comments_score = val.comments_score;
                }else{
                var comments_score = 0;
                }
             var new_score = comments_score + 1;
             ref.child("user_scores").child('firsttoflock').child(comment.creator_id).update({
              'comments_score': new_score
            });
        })
          return commentsRef.child(post_id).child(comment.$id).update({'likes': likes});
        }
          }else{
            //TODO: msg: you already liked this comment
            return;
          }

          });
     });
  }
    },
  //     dislike_comment: function(comments_scope_array, post_id, comment){
  //     if(comment.creator_id != id){
  //     commentsRef.child(post_id).child(comment.$id).once('value', function(dataSnapshot) {
  //         var post = Post.get(post_id);
  //         var actions_ref = ref.child('user_actions').child(id).child(post_id).child(comment.$id);
  //         var current_actions = $firebaseObject(actions_ref);
  //          current_actions.$loaded().then(function(res) {
  //           if (!res.dislike) {
  //         if(dataSnapshot.val().dislikes){
  //         var dislikes = dataSnapshot.val().dislikes;
  //         dislikes += 1;
  //           actions_ref.update({
  //               'dislike': true
  //             });

  //             Notification.add_action(comment.creator_id, {
  //             url: "/albums/" + post_id,
  //             msg: "Your comment on '" + Util.trim(post.media_info.album, 25) + "' was disliked."
  //           });
  //       ref.child('user_scores').child('firsttoflock').child(comment.creator_id).once("value", function(snapshot) {
  //         var val = snapshot.val();
  //         if (!val){
  //           console.error("No snapshot found for ", comment.creator_id);
  //         }
  //                if(val.comments_score){
  //            var comments_score = val.comments_score;
  //               }else{
  //               var comments_score = 0;
  //               }
  //            var new_score = comments_score - 1;
  //            ref.child("user_scores").child('firsttoflock').child(comment.creator_id).update({
  //             'comments_score': new_score
  //           });
  //       })
  //         return commentsRef.child(post_id).child(comment.$id).update({'dislikes': dislikes});

  //       }else{
  //         dislikes = 1;
  //           actions_ref.update({
  //               'dislike': true
  //             });

  //             Notification.add_action(comment.creator_id, {
  //             url: "/albums/" + post_id,
  //             msg: "Your comment on '" + Util.trim(post.media_info.album, 25) + "' was disliked."
  //           });
  //         ref.child('user_scores').child('firsttoflock').child(comment.creator_id).once("value", function(snapshot) {
  //         var val = snapshot.val();
  //         if (!val){
  //           console.error("No snapshot found for ", comment.creator_id);
  //         }
  //                if(val.comments_score){
  //            var comments_score = val.comments_score;
  //               }else{
  //               var comments_score = 0;
  //               }
  //            var new_score = comments_score - 1;
  //            ref.child("user_scores").child('firsttoflock').child(comment.creator_id).update({
  //             'comments_score': new_score
  //           });
  //       })
  //         return commentsRef.child(post_id).child(comment.$id).update({'dislikes': dislikes});
  //       }
  //         }else{
  //           //TODO: msg: you already liked this comment
  //           return;
  //         }

  //         });
  //    });
  // }
  //   },
        like_chat: function(comments_scope_array, post_id, comment){
      if(comment.creator_id != id){
      chatRef.child(comment.$id).once('value', function(dataSnapshot) {
        console.log(comment);
          var post = Post.get(post_id);
          var actions_ref = ref.child('user_actions').child(id).child(post_id).child(comment.$id);
          var current_actions = $firebaseObject(actions_ref);
           current_actions.$loaded().then(function(res) {
            if (!res.like) {
          if(dataSnapshot.val().likes){
          var likes = dataSnapshot.val().likes;
          likes += 1;
            actions_ref.update({
                'like': true
              });

              Notification.add_action(comment.creator_id, {
              url: "/chat/",
              msg: "Your chat '"+ Util.trim(comment.text, 25)+ "' was liked."
            });
          ref.child('user_scores').child('firsttoflock').child(comment.creator_id).once("value", function(snapshot) {
          var val = snapshot.val();
          if (!val){
            console.error("No snapshot found for ", comment.creator_id);
          }
              if(val.comments_score){
             var comments_score = val.comments_score;
                }else{
                var comments_score = 0;
                }
             var new_score = comments_score + 1;
             ref.child("user_scores").child('firsttoflock').child(comment.creator_id).update({
              'comments_score': new_score
            });
        })
          return chatRef.child(comment.$id).update({'likes': likes});

        }else{
          likes = 1;
            actions_ref.update({
                'like': true
              });

              Notification.add_action(comment.creator_id, {
              url: "/chat/",
              msg: "Your chat '"+ Util.trim(comment.text, 25)+ "' was liked."
            });
          ref.child('user_scores').child('firsttoflock').child(comment.creator_id).once("value", function(snapshot) {
          var val = snapshot.val();
          if (!val){
            console.error("No snapshot found for ", comment.creator_id);
          }
            if(val.comments_score){
             var comments_score = val.comments_score;
                }else{
                var comments_score = 0;
                }
             var new_score = comments_score + 1;
             ref.child("user_scores").child('firsttoflock').child(comment.creator_id).update({
              'comments_score': new_score
            });
        })
          return chatRef.child(comment.$id).update({'likes': likes});
        }
          }else{
            //TODO: msg: you already liked this comment
            return;
          }

          });
     });
  }
    }

  };

};
