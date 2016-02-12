'use strict';

app.factory('Post', function ($firebase, FIREBASE_URL) {
  var ref = new Firebase(FIREBASE_URL);
  var posts = $firebase(ref.child('posts')).$asArray();

  var Post = {
    all: posts,
    create: function (post) {
    return posts.$add(post).then(function(postRef) {
      $firebase(ref.child('user_posts').child(post.creatorUID))
                        .$push(postRef.name());


      return postRef;
    });
  },

    vote: function(postId, votes){
      return ref.child('posts').child(postId).update({'votes': votes});
     },



    comments: function (postId) {
      return $firebase(ref.child('comments').child(postId)).$asArray();
    },

      commentVote: function(postId, commentId, votes){
      return ref.child('comments').child(postId).child(commentId).update({'votes': votes});
     },

    get: function (postId) {
      return $firebase(ref.child('posts').child(postId)).$asObject();
    },
    delete: function (post) {
      return posts.$remove(post);
    }
  };

  return Post;

});