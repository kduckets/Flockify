module.exports = function ($firebaseArray, FIREBASE_URL, Auth, Post, Notification, $filter, Users, Util, $firebaseObject) {
  var ref = new Firebase(FIREBASE_URL);
  var comments = $firebaseArray(ref.child('comments').child(Users.current_group));
  var commentsRef = new Firebase(FIREBASE_URL + "/comments");
  var id = Users.current_user_id;
  return {
    all: comments,

    get_comments_for_post: function(post_id) {
      return $firebaseArray(ref.child('comments').child(post_id));
    },

    add_comment: function(comments_scope_array, post_id, comment) {
      var user = Users.current_user;
      // TODO: figure out how we want to store dates
      // var date = new Date();
      // date.setMinutes(date.getTimezoneOffset());
      // var today = $filter('date')(new Date(),'yyyy-MM-dd HH:mm:ss Z');
      var type = comment.indexOf('http') != -1 ? 'gif' : 'text';
      var new_comment = {
        text: comment,
        type: type,
        creator_name: Users.getUsername(Auth.$getAuth().uid) || null,
        creator_id: Auth.$getAuth().uid,
        datetime_ts: moment.utc().format()
      };
      comments_scope_array.$add(new_comment);

      var post = Post.get(post_id);
      post.$loaded().then(function(){
        post.latest_comment = moment.utc().format();
        post.comments = (post.comments || 0) + 1;
        post.$save();

        if (Users.current_user_id != post.creator_id) {
          Notification.add_action(post.creator_id, {
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
          return commentsRef.child(post_id).child(comment.$id).update({'likes': likes});
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
