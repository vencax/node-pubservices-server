

angular.module("app")

.controller('HomeCtrl', function($scope, $rootScope, $timeout, TicketSrvc, AuthService) {

  $scope.tickets = [];

  $scope.updateRemains = function() {
    var now = moment();
    $scope.tickets.forEach(function(t){
      t.remains = (((t.expires - now) / 60000) | 0) + 1;
    });

    $timeout($scope.updateRemains, 60000);
  };

  if(AuthService.isLoggedIn()) {
    TicketSrvc.validtickets().success(function(tickets) {
      $scope.tickets = tickets;
      $scope.tickets.forEach(function(t) {
        t.expires = moment(t.expires);
      });
      $scope.updateRemains();
    });
  }

});
