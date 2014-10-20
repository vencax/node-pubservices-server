
var app = angular.module("app");


app.factory('AuthenticationService', function($http, $window, SessionService) {
  // these routes map to stubbed API endpoints in config/server.js
  return {
    login: function(credentials, done) {
      $http.post('/api/login', credentials)
        .success(function(user){
          SessionService.currentUser = user;
          $window.sessionStorage.token = user.token;
          if (! ('name' in user)) {
            user.name = user.first_name + ' ' + user.last_name || user.username;
          }
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
