

angular.module("app").controller('HomeCtrl',
  function($scope, $rootScope, TicketSrvc) {

  TicketSrvc.validtickets().success(function(tickets) {
    $scope.tickets = tickets;
  });

});
