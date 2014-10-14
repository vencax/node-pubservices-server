
// form zavrit az po uspechu
// formatovat mac

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

  $scope.newItem = new DHCPDHost({res: true});

  var _copyHost = function(src, dest) {
    dest.ip = src.ip;
    dest.desc = src.desc;
    dest.mac = src.mac;
    dest.name = src.name;
  };

  var _err_handler = function(err){
    alert('request failed: ' + err.statusText + '\n\n' + err.data);
  };

  $scope.editForm = function (host) {

    var modalInstance = $modal.open({
      templateUrl: 'editForm.html',
      controller: 'ModalInstanceCtrl',
      resolve: {
        item: function () {
          return host ? new DHCPDHost(host) : $scope.newItem;
        }
      }
    });

    modalInstance.result.then(function (item) {

      if(host) {

        if (host.res === false) {
          item.$save(function(data){
            console.log('success, got data: ', data);
            _copyHost(item, host);
          }, _err_handler);
          return;
        }

        if(item.mac !== host.mac) {
          // we have chaged primary ID, so remove the old item and add a newone
          host.$remove({dhcphost: host.mac}, function(data){
            item.$save(function(data){
              console.log('success, got data: ', data);
              _copyHost(item, host);
            });
          });
        } else {
          item.$update({dhcphost:item.mac}, function(data){
            console.log('success, got data: ', data);
            _copyHost(item, host);
          }, _err_handler);
        }

      } else {

        item.$save(function(data){
          console.log('success, got data: ', data);
          $scope.data.push($scope.newItem);
          $scope.tableParams.reload();
          $scope.newItem = new DHCPDHost({res: true});
        }, _err_handler);

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


// Please note that $modalInstance represents a modal window (instance) dependency.
// It is not the same as the $modal service used above.

angular.module('app').controller('ModalInstanceCtrl', function ($scope, $modalInstance, item) {

  $scope.item = item;

  $scope.ok = function () {
    $modalInstance.close($scope.item);
  };

  $scope.cancel = function () {
    $modalInstance.dismiss('cancel');
  };
});
