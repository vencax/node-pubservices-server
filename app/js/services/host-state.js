angular.module("app").factory('HostStateSrvc', function($http) {

  return {
    get: function(mac) {
      return $http.get('/hoststate/' + mac);
    },
    wake: function(mac) {
      return $http.put('/hoststate/' + mac, {state: 1});
    }
  };

});