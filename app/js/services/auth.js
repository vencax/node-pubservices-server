
var app = angular.module("app");


var _adaptUser = function(user) {
  if (! ('name' in user)) {
    user.name = user.first_name + ' ' + user.last_name || user.username;
  }
  return user;
};


app.factory('AuthService', function($http, $window, $rootScope, $localStorage, Conf) {

  var _setUser = function(user) {
    $localStorage.currentUser = _adaptUser(user);
    $localStorage.token = user.token;
  };

  // these routes map to stubbed API endpoints in config/server.js
  return {
    login: function(credentials, done) {
      $http.post(Conf.host + '/auth/login', credentials)
        .success(function(user){
          _setUser(user);
          return done(null, user);
        })
        .error(function(err){
          return done(err);
        });
    },

    setUser: _setUser,

    logout: function(done) {
      delete $localStorage.currentUser;
      delete $localStorage.token;
      return done();
    },

    socialLogin: function(provider, cb) {
      $window.location.href = Conf.host + '/auth/' + provider + '/';
    },

    getUserAfterSocialLogin: function() {
      return $http.get(Conf.host + '/auth/userinfo');
    },

    getCurrentUser: function() {
      return $localStorage.currentUser || null;
    },

    isLoggedIn: function() {
      return $localStorage.hasOwnProperty('currentUser');
    },

    register: function(user, cb) {
      $http.post(Conf.host + '/auth/register', user)
        .success(function(user) {
          return cb(null, user);
        })
        .error(function(err) {
          return cb(err);
        });
    },

    changePwd: function(pwd, cb) {
      $http.post(Conf.host + '/auth/setpasswd', {'passwd': pwd})
        .success(function(data) {
          return cb(null, data);
        })
        .error(function(err) {
          return cb(err);
        });
    },

    requestForgottenPwd: function(email, cb) {
      $http.post(Conf.host + '/auth/requestforgotten', {'email': email})
        .success(function(data) {
          return cb(null, data);
        })
        .error(function(err) {
          return cb(err);
        });
    }
  };
});
