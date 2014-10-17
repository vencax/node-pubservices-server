var app = angular.module("app");


app.controller('LoginController', function($scope, $rootScope, $location, AuthenticationService) {

  $scope.credentials = { uname: "", passwd: "" };

  $scope.login = function() {
    AuthenticationService.login($scope.credentials, function(err, user) {
      if (err) {
        return alert(err);
      }
      $location.path("/");
      $rootScope.loggedUser = user;
      return $rootScope.logout = function() {
        return AuthenticationService.logout(function() {
          $rootScope.loggedUser = '';
          return $location.path("/login");
        });
      };
    });
  };

});
