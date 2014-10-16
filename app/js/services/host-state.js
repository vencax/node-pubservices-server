angular.module("app").factory('HostStateSrvc', function($http) {

  return {
    get: function(mac) {
      return $http.get('/api/dhcpdcfg/hoststate/' + mac);
    },
    wake: function(mac) {
      return $http.put('/api/dhcpdcfg/hoststate/' + mac, {state: 1});
    }
  };

});
