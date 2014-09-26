angular.module("app").factory("DHCPDHost", function($resource) {

  return $resource('dhcphosts/:dhcphost', {}, {
      'update': { method:'PUT' }
  });

});
