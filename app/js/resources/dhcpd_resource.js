angular.module("app").factory("DHCPDHost", function($resource) {

  return $resource('/api/dhcpdcfg/dhcphosts/:dhcphost', {}, {
      'update': { method:'PUT' }
  });

});
