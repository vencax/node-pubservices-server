var app = angular.module("app");


app.controller('LoginController', function($scope, $rootScope, $location, AuthService) {

  $scope.credentials = { uname: "", passwd: "" };
  $scope.errors = [];

  var _logout = function() {
    return AuthService.logout(function() {
      $rootScope.loggedUser = '';
      return $location.path("/login");
    });
  };

  var _authServiceHandler = function(err, user) {
    if (err) {
      $scope.errors.push(err);
      return alert(err);
    }
    $location.path("/");
    $rootScope.loggedUser = user;
    $rootScope.logout = _logout;
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
