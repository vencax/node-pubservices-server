
// formatovat mac

var _err_handler = function(err){
  alert('request failed: ' + err.statusText + '\n\n' + err.data);
};

angular.module("app").controller('HomeController', ['$scope', '$filter', '$modal', 'ngTableParams', 'DHCPDHost', 'HostStateSrvc', function($scope, $filter, $modal, NgTableParams, DHCPDHost, HostStateSrvc) {

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

  $scope.newItem = new DHCPDHost();

  $scope.editForm = function (host) {

    var modalInstance = $modal.open({
      templateUrl: 'editForm.html',
      controller: 'ModalInstanceCtrl',
      resolve: {
        item: function () {
          return host ? new DHCPDHost(host) : $scope.newItem;
        },
        host: function () {
          return host;
        }
      }
    });

    var _copyHost = function(src, dest) {
      dest.ip = src.ip;
      dest.desc = src.desc;
      dest.mac = src.mac;
      dest.name = src.name;
      dest.res = src.res;
    };

    modalInstance.result.then(function (item) {
      if (! host) {
        $scope.data.push($scope.newItem);
        $scope.tableParams.reload();
        $scope.newItem = new DHCPDHost();
      } else {
        _copyHost(item, host);
      }
    });

  };

  $scope.wakeHost = function($event, host){
    HostStateSrvc.wake(host.mac, function(data){
      alert('waking ' + host.name + '@' + host.mac);
    }, _err_handler);
  };

  $scope.remove = function($event, host){
    if (confirm('Are you sure you want to remove reservation for ' + host.name)) {
      host.$remove({dhcphost: host.mac});
    } else {
      // Do nothing!
    }
  };

}]);


// edit form instance
angular.module('app')
.controller('ModalInstanceCtrl', function ($scope, $modalInstance, item, host) {

  $scope.item = item;

  $scope.ok = function () {

    if('res' in item && host.res === true) {

      if(item.mac !== host.mac) {

        // we have chaged primary ID, so remove the old item and add a newone
        host.$remove({dhcphost: host.mac}, function(data){
          item.$save(function(data){
            $modalInstance.close(data);
          }, _err_handler);
        }, _err_handler);

      } else {

        item.$update({dhcphost:item.mac}, function(data){
          $modalInstance.close(data);
        }, _err_handler);
      }

    } else {

      item.$save(function(data){
        $modalInstance.close(data);
      }, _err_handler);

    }

  };

  $scope.cancel = function () {
    $modalInstance.dismiss('cancel');
  };
});
