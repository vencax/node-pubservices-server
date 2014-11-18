
angular.module("app")

.controller('MockTransferCtrl', function($scope, $rootScope, $location, $translate, AuthService, TicketSrvc) {

  $scope.info = {
    account: '123456789/2010',
    uid: null,
    amount: 100
  };

  $scope.process = function() {
    TicketSrvc.creditincrease($scope.info)
    .success(function(change) {
      incr = parseInt(change.amount, 10);
      if(isNaN(incr)) {
        $scope.error = 'Not a number came: ' + change.toString();
      } else {
        $rootScope.loggedUser.credit += incr;
      }
    })
    .error(function(err) {
      $scope.error = $translate.instant(err);
    });
  };

});
