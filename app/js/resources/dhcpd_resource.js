angular.module("app").factory("DHCPDHost", function($resource) {

  return $resource('/api/dhcphosts/:dhcphost', {}, {
      'update': { method:'PUT' }
  });

});
