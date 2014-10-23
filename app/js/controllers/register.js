var app = angular.module("app");


app.controller('RegisterCtrl', function($scope, $rootScope, $location, AuthService) {

  $scope.user = { name: "", email: "", passwd: "" };
  $scope.pwdVerif = "";

  var _logout = function() {
    return AuthService.logout(function() {
      $rootScope.loggedUser = '';
      return $location.path("/login");
    });
  };

  $scope.register = function() {
    AuthService.register($scope.user, function(err, user) {
      if (err) {
        return alert(err);
      }
      $location.path("/");
    });
  };

});
