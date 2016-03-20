'use strict';

app.factory('Comment', function ($firebase, FIREBASE_URL, Auth, Post) {
  var ref = new Firebase(FIREBASE_URL);
  var user = Auth.user;
  var group_id = user.current_group;
  var comments = $firebase(ref.child('comments').child(group_id));

  return {
    all: comments,

    get_comments: function(post_id) {
      // maybe we should just be grabbing comments by id from the post object?
      return comments.orderByValue('post_id').equalTo(post_id);
    },

    add_comment: function(post_id, comment) {
      var new_comment = {
        text: comment,
        creator_name: $scope.user.profile.username,
        creator_id: $scope.user.uid
      };

      var comment_id = comments.push(new_comment);
      // TODO: db_change
      var post = Post.all.child(post_id);
      post.update({'last_comment_ts': new Date()});
      var comment_entry = {};
      comment_entry[comment_id] = true;
      post.child('comments').push(comment_entry);
      return new_comment;
    }
  };

});
