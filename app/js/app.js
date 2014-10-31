var app = angular.module("app", [
  "ngResource", "ngRoute", "ngTable", "ngCookies", "ui.bootstrap", "ngStorage"
]);

app.run(function($rootScope, $location, AuthService, TicketSrvc) {

  moment.locale(navigator.language);

  if(AuthService.getCurrentUser()) {
    $rootScope.loggedUser = AuthService.getCurrentUser();
    TicketSrvc.credit($rootScope.loggedUser).success(function(credit){
      $rootScope.loggedUser.credit = credit;
    });
  }

  $rootScope.logout = function() {
    return AuthService.logout(function() {
      $rootScope.loggedUser = '';
      return $location.path("/login");
    });
  };

  // adds some basic utilities to the $rootScope for debugging purposes
  $rootScope.log = function(thing) {
    console.log(thing);
  };

  $rootScope.alert = function(thing) {
    alert(thing);
  };
});
