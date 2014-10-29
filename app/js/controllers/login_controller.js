var app = angular.module("app");


app.controller('LoginController', function($scope, $rootScope, $location, $cookies, AuthService) {

  $scope.credentials = { uname: "", passwd: "" };
  $scope.errors = [];

  var _onLoggedIn = function() {
    $location.path("/");
    $rootScope.loggedUser = user;
    $rootScope.logout = function() {
      return AuthService.logout(function() {
        $rootScope.loggedUser = '';
        return $location.path("/login");
      });
    };
  };

  if ($cookies.authinfo) {
    var user = JSON.parse($cookies.authinfo);
    AuthService.setUser(user);
    _onLoggedIn();
  }

  var _authServiceHandler = function(err, user) {
    if (err) {
      $scope.errors.push(err);
      return alert(err);
    }
    _onLoggedIn();
  };

  $scope.login = function() {
    AuthService.login($scope.credentials, _authServiceHandler);
  };

  $scope.socialLogin = function(provider) {
    AuthService.socialLogin(provider, _authServiceHandler);
  };

  $scope.register = function() {
    $location.path("/register");
  };

});
