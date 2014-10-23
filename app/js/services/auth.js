
var app = angular.module("app");


var _adaptUser = function(user) {
  if (! ('name' in user)) {
    user.name = user.first_name + ' ' + user.last_name || user.username;
  }
  return user;
};


app.factory('AuthService', function($http, $window, SessionService) {
  // these routes map to stubbed API endpoints in config/server.js
  return {
    login: function(credentials, done) {
      $http.post('/api/login', credentials)
        .success(function(user){
          SessionService.currentUser = _adaptUser(user);
          $window.sessionStorage.token = user.token;
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

    socialLogin: function(provider, cb) {
      $window.location.href = '/api/auth/' + provider + '/';
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
