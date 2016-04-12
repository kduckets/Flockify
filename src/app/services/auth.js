module.exports = function ($firebaseAuth, FIREBASE_URL, $rootScope, $firebase, $cookieStore) {
    var ref = new Firebase(FIREBASE_URL);
    var auth = $firebaseAuth(ref);

    return auth;
};
