
var app = angular.module("app");


app.factory('AuthenticationService', function($http, SessionService) {
  // these routes map to stubbed API endpoints in config/server.js
  return {
    login: function(credentials, done) {
      $http.post('/api/login', credentials)
        .success(function(user){
          SessionService.currentUser = user;
          return done(null, user);
        })
        .error(function(err){
          return done(err);
        });
    },
    logout: function(done) {
      SessionService.currentUser = '';
      return done();
    },
    isLoggedIn: function() {
      return SessionService.currentUser !== null;
    }
  };
});


app.factory('SessionService', function() {
  return {
    currentUser: null
  };
});
