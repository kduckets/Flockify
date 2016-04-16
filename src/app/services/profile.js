module.exports = function ($window, FIREBASE_URL, $firebaseArray, $firebaseObject, Post, $q, Users) {
  var ref = new $window.Firebase(FIREBASE_URL);

  var profile = {
    get: function (userId) {
      return $firebaseObject(ref.child('users').child(userId));
    },

    savePost: function(userId, postId, save){
      return ref.child('user_actions').child(userId).child(postId).update({'saved': save});
    },

    setStar: function(userId, postId, vote){
      return ref.child('user_actions').child(userId).child(postId).update({'star': true});
    },

    getPosts: function(userId) {
      var defer = $q.defer();
      $firebaseArray(ref.child('posts').child(Users.current_group))
        .$loaded()
        .then(function(data) {
          var posts = {};
          data.reverse();

          for(var i = 0; i<data.length; i++) {
            var id = data[i].$id;
            var creator = data[i].creator_id;
            if(creator == userId){
            posts[id] = Post.get(id);
          }
          }
          defer.resolve(posts);
        });

      return defer.promise;
    },
    getLikes: function(userId) {
      var defer = $q.defer();
      $firebaseArray(ref.child('user_actions').child(userId))
        .$loaded()
        .then(function(data) {
          data.reverse();

          var posts = {};

          for(var i = 0; i<data.length; i++) {
            var id = data[i].$id;
            var up = data[i].up;
            var star = data[i].star;

            if(id && up || id && star){
              var post_info = Post.get(id);
              posts[id] = post_info;
          
            }
          }
          defer.resolve(posts);
        });

      return defer.promise;
    },

    getQueue: function(userId) {
      var defer = $q.defer();
      $firebaseArray(ref.child('user_actions').child(userId))
        .$loaded()
        .then(function(data) {

          var posts = {};

          for(var i = 0; i<data.length; i++) {
            var id = data[i].$id;
            var saved = data[i].saved;
            
            if(id && saved){
              var post_info = Post.get(id);
              posts[id] = post_info;           
            }
          }
          defer.resolve(posts);
        });

      return defer.promise;
    }
  };

  return profile;
};
