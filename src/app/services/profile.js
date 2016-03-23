module.exports = function ($window, FIREBASE_URL, $firebase, Post, $q) {
  var ref = new $window.Firebase(FIREBASE_URL);

  var profile = {
    get: function (userId) {
      return $firebase(ref.child('profile').child(userId)).$asObject();
    },

    setVote: function(userId, postId, vote){
     return ref.child('user_votes').child(userId).child(postId).update({'vote': vote});


   },

   savePost: function(userId, postId, save){
     return ref.child('user_votes').child(userId).child(postId).update({'saved': save});


   },

   setStar: function(userId, postId, vote){
     return ref.child('user_votes').child(userId).child(postId).update({'star': vote});


   },

   getPosts: function(userId) {
    var defer = $q.defer();

    $firebase(ref.child('user_posts').child(userId))
    .$asArray()
    .$loaded()
    .then(function(data) {
      var posts = {};
      data.reverse();

      for(var i = 0; i<data.length; i++) {
        var value = data[i].$value;
        posts[value] = Post.get(value);
      }


      defer.resolve(posts);
    });

    return defer.promise;
  },
  getLikes: function(userId) {
    var defer = $q.defer();
    $firebase(ref.child('user_votes').child(userId))
    .$asArray()
    .$loaded()
    .then(function(data) {
        data.reverse();

      var posts = {};

      for(var i = 0; i<data.length; i++) {
        var value = data[i].$id;
        var vote = data[i].vote;
        var star = data[i].star;

        if(value && vote=='up' || value && star=='gold'){
          posts[value] = Post.get(value);
        }
      }
      defer.resolve(posts);
    });

    return defer.promise;
  },

  getQueue: function(userId) {
    var defer = $q.defer();
    $firebase(ref.child('user_votes').child(userId))
    .$asArray()
    .$loaded()
    .then(function(data) {


      var posts = {};

      for(var i = 0; i<data.length; i++) {
        var value = data[i].$id;
        var saved = data[i].saved;
        if(value && saved=='yes'){
          posts[value] = Post.get(value);
        }
      }
      defer.resolve(posts);
    });

    return defer.promise;
  }
};

return profile;
};
