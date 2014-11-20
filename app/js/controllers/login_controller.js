angular.module("app")

.controller('LoginController', function($scope, $rootScope, $location, $translate, AuthService, TicketSrvc) {

  $scope.credentials = { username: "", password: "" };

  var _onLoggedIn = function(user) {
    $location.path("/");
    $rootScope.loggedUser = user;
    TicketSrvc.credit(user).success(function(credit){
      user.credit = credit;
    });
  };

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

})

.controller('SocialLoginCallbackCtrl', function($scope, $rootScope, $location, AuthService) {

  AuthService.getUserAfterSocialLogin()
  .success(function(user) {
    $location.path("/");
    $rootScope.loggedUser = user;
    user.credit = 117;
  })
  .error(function(err) {
    alert(err);
  });

});
