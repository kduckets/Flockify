module.exports = function ($firebaseAuth, FIREBASE_URL, $rootScope, $firebase, $cookieStore) {
    var ref = firebase.database().ref();
    var auth = $firebaseAuth();

    return auth;
};
