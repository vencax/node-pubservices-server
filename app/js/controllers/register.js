angular.module("app")

.controller('RegisterCtrl', function($scope, $rootScope, $location, AuthService) {

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

})

.controller('RequestpwdCtrl', function($scope, $location, $translate, AuthService) {
  $scope.email = "";
  $scope.error = $scope.message = null;

  $scope.submit = function() {
    AuthService.requestForgottenPwd($scope.email, function(err, data) {
      if(err) {
        $scope.error = $translate.instant(err);
      } else {
        $scope.error = null;
        $scope.message = "Ok, password reset request sent";
      }
    });
  };
})

.controller('ChangepwdCtrl', function($scope, $rootScope, AuthService) {
  $scope.pwd = "";
  $scope.pwdVerif = "";
  $scope.error = $scope.message = null;

  $scope.submit = function() {
    AuthService.changePwd($scope.pwd, function(err, data) {
      if(err) {
        $scope.error = err;
      } else {
        $scope.error = null;
        $scope.message = data;
      }
    });
  };
});
