module.exports = function ($firebase, FIREBASE_URL, Auth, Post, $filter) {
  var ref = new Firebase(FIREBASE_URL);
  var user = Auth.user;
  //var group_id = user.current_group;
  //var comments = $firebase(ref.child('comments').child(group_id));
  var comments = $firebase(ref.child('comments')).$asArray();

  return {

    all: comments,

    get_comments_for_post: function(post_id) {
      return $firebase(ref.child('comments').child(post_id)).$asArray();
    },

    add_comment: function(comments_scope_array, post_id, comment) {
      // TODO: figure out how we want to store dates
      var date = new Date();
      date.setMinutes(date.getTimezoneOffset());
      var today = $filter('date')(new Date(),'yyyy-MM-dd HH:mm:ss Z');
      var type = comment.indexOf('http') != -1 ? 'gif' : 'text';
      var new_comment = {
        text: comment,
        type: type,
        creator: user.profile.username || null,
        creatorUID: user.uid,
        datetime_ts: today
      };
      comments_scope_array.$add(new_comment);

      var post = Post.get(post_id);
      post.$loaded().then(function(){
        post.latest_comment = today;
        post.comments = (post.comments || 0) + 1;
        post.$save()
      });
    },

    delete_comment: function(comments_scope_array, post_id, comment){
      comments_scope_array.$remove(comment);
      comments_scope_array.$loaded().then(function(comments){
        Post.get_reference(post_id).$update({'comments': comments.length - 1});
      });
    }

  };

};
