
var app = angular.module("app");


// add authentication
app.run(function($rootScope, $location, AuthService) {

  // enumerate routes that don't need authentication
  var routesNoRequiringAuth = ['/', '/login', '/register', '/changepwd', '/requestpwd', '/terms', '/_socialcallback'];

  // check if current location matches route
  routeClean = function(route) {
    return routesNoRequiringAuth.indexOf(route) >= 0;
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

  $httpProvider.interceptors.push(function($q, $location, $localStorage, $rootScope) {
    return {
      request: function(config) {
        config.headers = config.headers || {};
        if ($localStorage.token) {
          config.headers.Authorization = 'Bearer ' + $localStorage.token;
        }
        return config;
      },

      responseError: function(rejection) {
        if (rejection.status === 401) {
          $rootScope.loggedUser = null;
          $location.url('/login');
        }
        return $q.reject(rejection);
      }
    };
  });

});
