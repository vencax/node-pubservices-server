

angular.module("app").controller('BuyCtrl',
  function($scope, $rootScope, $location, $translate, TicketSrvc) {

  $scope.data = [];
  TicketSrvc.list().success(function(data) {
    $scope.data = data;
  });

  $scope.buy = function(ticket) {
    TicketSrvc.buy(ticket).success(function(data) {
      $rootScope.loggedUser.credit -= ticket.amount;
      $location.path('/');
    }).error(function(err){
      $scope.error = $translate.instant(err);
    });
  };

});
