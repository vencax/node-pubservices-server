var app = angular.module("app");


app.controller('LoginController', function($scope, $rootScope, $location, $cookies, AuthService, TicketSrvc) {

  $scope.credentials = { username: "", password: "" };
  $scope.errors = [];

  var _onLoggedIn = function(user) {
    $location.path("/");
    $rootScope.loggedUser = user;
    TicketSrvc.credit(user).success(function(credit){
      user.credit = credit;
    });
  };

  if ($cookies.authinfo) {
    var user = JSON.parse($cookies.authinfo);
    AuthService.setUser(user);
    _onLoggedIn(user);
  }

  var _authServiceHandler = function(err, user) {
    if (err) {
      $scope.errors.push(err);
      return alert(err);
    }
    _onLoggedIn(user);
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
