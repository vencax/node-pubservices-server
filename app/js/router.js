angular.module("app").config(function($routeProvider, $locationProvider) {

  $locationProvider.html5Mode(true);

  $routeProvider.when('/login', {
    templateUrl: 'login.html',
    controller: 'LoginController'
  });

  $routeProvider.when('/register', {
    templateUrl: 'register.html',
    controller: 'RegisterCtrl'
  });

  $routeProvider.when('/', {
    templateUrl: 'home.html',
    controller: 'HomeCtrl'
  });

  $routeProvider.otherwise({ redirectTo: '/' });

});
