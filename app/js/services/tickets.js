
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

    isvalid: function(id) {
      return $http.get('/api/valid/' + id);
    },

    validtickets: function() {
      return $http.get('/api/valid');
    },

    credithistory: function() {
      return $http.get('/api/credit/history');
    },

    credit: function(user) {
      return $http.get('/api/credit/current/' + user.id);
    },

    creditincrease: function(info) {
      return $http.post('/api/credit/increase', info);
    }
  };
});


app.factory('SessionService', function() {
  return {
    currentUser: null
  };
});
