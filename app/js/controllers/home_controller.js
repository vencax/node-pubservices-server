

var _err_handler = function(err){
  alert('request failed: ' + err.statusText + '\n\n' + err.data);
};

angular.module("app").controller('HomeCtrl', function($scope, $rootScope, $location, AuthService, TicketSrvc) {

  $scope.data = [];
  TicketSrvc.list().success(function(data) {
    $scope.data = data;
  });

  TicketSrvc.validtickets().success(function(tickets) {
    $scope.tickets = tickets;
  });

  $scope.buy = function(ticket) {
    if (AuthService.isLoggedIn()) {
      TicketSrvc.buy(ticket).success(function(data) {
        $rootScope.credit -= ticket.amount;
        $scope.tickets.push(data);
      }).error(function(err){
        if (err.status === 400) {
          alert('Not enough money!');
        }
      });
    } else {
      $location.path('/login');
    }
  };

});
