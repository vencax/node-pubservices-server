var app = angular.module("app");


app.controller('LoginController', function($scope, $rootScope, $location, AuthService) {

  $scope.credentials = { uname: "", passwd: "" };

  $scope.login = function() {
    AuthService.login($scope.credentials, function(err, user) {
      if (err) {
        return alert(err);
      }
      $location.path("/");
      $rootScope.loggedUser = user;
      return $rootScope.logout = function() {
        return AuthService.logout(function() {
          $rootScope.loggedUser = '';
          return $location.path("/login");
        });
      };
    });
  };

});
