
var app = angular.module("app");


app.factory('TicketSrvc', function($http) {
  // these routes map to stubbed API endpoints in config/server.js
  return {
    list: function() {
      return $http.get('/api/tickets');
    },

    buy: function(ticket) {
      return $http.post('/api/buy/' + ticket.id);
    },

    valid: function(id) {
      return $http.get('/api/valid/' + id);
    }
  };
});


app.factory('SessionService', function() {
  return {
    currentUser: null
  };
});
