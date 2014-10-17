
var app = angular.module("app");


// add authentication
app.run(function($rootScope, $location, AuthenticationService) {

  // enumerate routes that don't need authentication
  var routesNoRequiringAuth = ['/login'];

  // check if current location matches route
  routeClean = function(route) {
    return route in routesNoRequiringAuth;
  };


  $rootScope.$on("$routeChangeStart", function(event, next, current) {

    // if route requires auth and user is not logged in
    if ((! routeClean($location.url())) &&
      (! AuthenticationService.isLoggedIn())) {
      // redirect back to login
      $location.path("/login");
    }
  });
});


// automatic redirect to login page when 401 from REST service
app.config(function($httpProvider) {

  logsOutUserOn401 = function($q, $location) {
    return function(promise) {
      return promise.then(
        // Success: just return the response
        function(response){
          return response;
        },
        // Error: check the error status to get only the 401
        function(response) {
          if (response.status === 401) {
            $location.url('/login');
          }
          return $q.reject(response);
        }
      );
    };
  };

  $httpProvider.responseInterceptors.push(logsOutUserOn401);
});
