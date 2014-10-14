angular.module("app").factory('HostStateSrvc', function($http) {

  return {
    get: function(mac) {
      return $http.get('/api/hoststate/' + mac);
    },
    wake: function(mac) {
      return $http.put('/api/hoststate/' + mac, {state: 1});
    }
  };

});
