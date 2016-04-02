module.exports = function ($firebase, FIREBASE_URL) {
  var ref = new Firebase(FIREBASE_URL);
  var posts = $firebase(ref.child('posts')).$asArray();

  var Post = {
    all: posts,

    create: function (post) {
      return posts.$add(post).then(function(postRef) {
        $firebase(ref.child('user_posts').child(post.creatorUID)).$push(postRef.name());
        return postRef;
      });
    },

    vote: function(postId, votes){
      return ref.child('posts').child(postId).update({'votes': votes});
    },

    tag: function(postId, tag){
      // $firebase(ref.child('posts').child(postId).child('tags').child(tag)).$push(tag);
      // return;
      return ref.child('posts').child(postId).child('tags').child(tag).update({'name': tag});
    },

    star: function(postId, stars){
      return ref.child('posts').child(postId).update({'stars': stars});
    },

    // unused
    commentVote: function(postId, commentId, votes){
      return ref.child('comments').child(postId).child(commentId).update({'votes': votes});
    },

    get: function (postId) {
      return $firebase(ref.child('posts').child(postId)).$asObject();
    },

    get_reference: function(postId){
      return $firebase(ref.child('posts').child(postId));
    },

    delete: function (post) {
      ref.child('posts').child(post.$id).remove();
    }
  };

  return Post;
};
