

var _err_handler = function(err){
  alert('request failed: ' + err.statusText + '\n\n' + err.data);
};

angular.module("app").controller('HistoryCtrl', function($scope, $rootScope, $location, AuthService, TicketSrvc) {

  $scope.items = [];

  TicketSrvc.credithistory().success(function(items) {
    $scope.items = items;
  });

});
