angular.module("app").controller('HomeController', ['$scope', '$filter', 'ngTableParams', 'DHCPDHost', function($scope, $filter, NgTableParams, DHCPDHost) {

  $scope.data = DHCPDHost.query();


  $scope.tableParams = new NgTableParams({
    page: 1,            // show first page
    count: 10,          // count per page
    filter: {
      name: ''       // initial filter
    },
    sorting: {
      ip: 'asc'     // initial sorting
    }
  }, {
    total: $scope.data.length, // length of data
    getData: function($defer, params) {
      // use build-in angular filter
      var filteredData = params.filter() ?
              $filter('filter')($scope.data, params.filter()) :
              $scope.data;
      var orderedData = params.sorting() ?
              $filter('orderBy')(filteredData, params.orderBy()) :
              $scope.data;

      params.total(orderedData.length); // set total for recalc pagination
      $defer.resolve(orderedData.slice((params.page() - 1) * params.count(), params.page() * params.count()));
    }
  });

  $scope.newItem = new DHCPDHost({res: true});
  $scope.createFormVisible = false;

  $scope.showCreateForm = function() {
    $scope.createFormVisible = true;
  };

  $scope.hideCreateForm = function() {
    $scope.createFormVisible = false;
  };

  $scope.create = function($event) {
    $scope.newItem.$save(function(data){
      console.log('success, got data: ', data);
      $scope.data.push($scope.newItem);
      $scope.tableParams.reload();
      $scope.hideCreateForm();
      // $scope.newItem = new DHCPDHost({res: true});
    }, function(err){
      alert('request failed ' + err);
    });
  };

  $scope.makeReservation = function($event, host){
    host.$save(function(data){
      console.log('success, got data: ', data);
    });
  };

  $scope.wakeHost = function($event, host){
    alert('waking ' + host.name + '@' + host.mac);
  };

  $scope.remove = function($event, host){
    if (confirm('Are you sure you want to remove reservation for ' + host.name)) {
      host.$remove({dhcphost: host.mac});
    } else {
      // Do nothing!
    }
  };

}]);
