
var app = angular.module("app");


// add authentication
app.run(function($rootScope, $location, AuthService) {

  // enumerate routes that don't need authentication
  var routesNoRequiringAuth = ['/login'];

  // check if current location matches route
  routeClean = function(route) {
    return route in routesNoRequiringAuth;
  };


  $rootScope.$on("$routeChangeStart", function(event, next, current) {

    // if route requires auth and user is not logged in
    if ((! routeClean($location.url())) && (! AuthService.isLoggedIn())) {
      // redirect back to login
      $location.path("/login");
    }
  });
});


// automatic redirect to login page when 401 from REST service
// inject authorization header into outgoing reqs
app.config(function($httpProvider) {

  $httpProvider.interceptors.push(function($q, $location, $window) {
    return {
      request: function(config) {
        config.headers = config.headers || {};
        if ($window.sessionStorage.token) {
          config.headers.Authorization = 'Bearer ' + $window.sessionStorage.token;
        }
        return config;
      },

      response: function(response) {
        if (response.status === 401) {
          $location.url('/login');
        }
        return response || $q.when(response);
      },

      responseError: function(rejection) {
        if (response.status === 401) {
          $location.url('/login');
        }
        alert('Request rejected: ' + rejection);
        return rejection;
      }
    };
  });

});
