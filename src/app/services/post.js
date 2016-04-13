module.exports = function ($firebaseArray, $firebaseObject, FIREBASE_URL, Users) {
  var ref = new Firebase(FIREBASE_URL);// + "/posts");
  var posts = $firebaseArray(ref.child('posts').child(Users.current_group));

  var Post = {
    all: posts,

    create: function (post) {
      return posts.$add(post);
    },

    vote: function(postId, score){
      return ref.child('posts').child(Users.current_group).child(postId).update({'score': score});
    },

    tag: function(postId, tag){
      ref.once("value", function(snapshot) {
        var numTags = snapshot.child('posts').child(postId).child('tags').numChildren();
        return ref.child('posts').child(postId).child('tags').child(numTags).update({'name': tag});
      });
    },

    star: function(postId, stars){
      return ref.child('posts').child(Users.current_group).child(postId).update({'stars': stars});
    },

    // unused
    commentVote: function(postId, commentId, votes){
      return ref.child('comments').child(postId).child(commentId).update({'votes': votes});
    },

    get: function (postId) {
      return $firebaseObject(ref.child('posts').child(Users.current_group).child(postId));
    },

    get_reference: function(postId){
      return ref.child('posts').child(postId);
    },

    delete: function (post) {
      ref.child('posts').child(Users.current_group).child(post.$id).remove();
    }
  };
  return Post;
};
