
angular.module("app")

.controller('MockTransferCtrl', function($scope, $rootScope, $location, AuthService, TicketSrvc) {

  $scope.info = {
    account: '123456789/2010',
    uid: null,
    amount: 100
  };

  $scope.process = function() {
    TicketSrvc.creditincrease($scope.info)
    .success(function(change) {
      $rootScope.loggedUser.credit += change.amount;
    })
    .error(function(err) {
      $scope.error = err;
    });
  };

});
