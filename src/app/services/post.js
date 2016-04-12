module.exports = function ($firebaseArray, $firebaseObject, FIREBASE_URL) {
  var ref = new Firebase(FIREBASE_URL);
  var posts = $firebaseArray(ref.child('posts'));

  var Post = {
    all: posts,

    create: function (post) {
      return posts.$add(post).then(function(postRef) {
        ref.child('user_posts').child(post.creatorUID).push(postRef.name());
        return postRef;
      });
    },

    vote: function(postId, votes){
      return ref.child('posts').child(postId).update({'votes': votes});
    },

    tag: function(postId, tag){
     ref.once("value", function(snapshot) {
     var numTags = snapshot.child('posts').child(postId).child('tags').numChildren();
     return ref.child('posts').child(postId).child('tags').child(numTags).update({'name': tag});
      });   
    },

    star: function(postId, stars){
      return ref.child('posts').child(postId).update({'stars': stars});
    },

    // unused
    commentVote: function(postId, commentId, votes){
      return ref.child('comments').child(postId).child(commentId).update({'votes': votes});
    },

    get: function (postId) {
      return $firebaseObject(ref.child('posts').child(postId));
    },

    get_reference: function(postId){
     return ref.child('posts').child(postId);
    },

    delete: function (post) {
      ref.child('posts').child(post.$id).remove();
    }
  };

  return Post;
};
