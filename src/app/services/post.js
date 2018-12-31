module.exports = function ($firebaseArray, $firebaseObject, FIREBASE_URL, Users) {
  var ref = firebase.database().ref();

  if(Users.current_group){
  var posts = $firebaseArray(ref.child('posts').child(Users.current_group));
}

  var Post = {
    all: posts,

    create: function (post) {
      return posts.$add(post).then(function(postRef) {
        var postId = {};
        postId[postRef.$id] = true;
        ref.child('users').child(post.creator_id).child('posts').update(postId);
        return postRef;
    })
    },

    vote: function(postId, score){
      return ref.child('posts').child(Users.current_group).child(postId).update({'score': score});
    },

    tag: function(postId, tag){
      ref.once("value", function(snapshot) {
        var numTags = snapshot.child('posts').child(Users.current_group).child(postId).child('tags').numChildren();
        return ref.child('posts').child(Users.current_group).child(postId).child('tags').child(numTags).update({'name': tag});
      });
    },

   label: function(postId, tag){
      ref.once("value", function(snapshot) {
        // var numTags = snapshot.child('posts').child(Users.current_group).child(postId).child('labels').numChildren();
        //remove duplicate labels
        var result = [];
        $.each(tag, function(i, e) {
        if ($.inArray(e, result) == -1) result.push(e);
        });
        return ref.child('posts').child(Users.current_group).child(postId).update({'labels': result});
      });
    },

    genre: function(postId, tag){
      ref.once("value", function(snapshot) {
        // var numTags = snapshot.child('posts').child(Users.current_group).child(postId).child('labels').numChildren();
        //remove duplicate labels
        var result = [];
        $.each(tag, function(i, e) {
        if ($.inArray(e, result) == -1) result.push(e);
        });
        return ref.child('posts').child(Users.current_group).child(postId).update({'genre': result});
      });
    },

    star: function(postId, stars){
      return ref.child('posts').child(Users.current_group).child(postId).update({'stars': stars});
    },

    get: function (postId) {
      return $firebaseObject(ref.child('posts').child(Users.current_group).child(postId));
    },

    get_reference: function(postId){
      return ref.child('posts').child(Users.current_group).child(postId);
    },

    delete: function (post) {
      ref.child('posts').child(Users.current_group).child(post.$id).remove();
      ref.child('users').child(post.creator_id).child('posts').child(post.$id).remove();

    }
  };
  return Post;
};
