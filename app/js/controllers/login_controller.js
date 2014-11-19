var app = angular.module("app");


app.controller('LoginController', function($scope, $rootScope, $location, $cookies, $translate, AuthService, TicketSrvc) {

  $scope.credentials = { username: "", password: "" };

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
      $scope.error = $translate.instant(err);
    } else {
      _onLoggedIn(user);
    }
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
