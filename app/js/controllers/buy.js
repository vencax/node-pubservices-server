

angular.module("app").controller('BuyCtrl',
  function($scope, $rootScope, $location, TicketSrvc) {

  $scope.data = [];
  TicketSrvc.list().success(function(data) {
    $scope.data = data;
  });

  $scope.buy = function(ticket) {
    TicketSrvc.buy(ticket).success(function(data) {
      $rootScope.loggedUser.credit -= ticket.amount;
      $location.path('/');
    }).error(function(err, status){
      if (status === 400) {
        alert('Not enough money!');
      }
    });
  };

});
