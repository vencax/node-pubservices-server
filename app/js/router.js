angular.module("app").config(function($routeProvider, $locationProvider) {

  $locationProvider.html5Mode(true);

  $routeProvider.when('/login', {
    templateUrl: 'login.html',
    controller: 'LoginController'
  });

  $routeProvider.when('/history', {
    templateUrl: 'history.html',
    controller: 'HistoryCtrl'
  });

  $routeProvider.when('/register', {
    templateUrl: 'register.html',
    controller: 'RegisterCtrl'
  });

  $routeProvider.when('/buy', {
    templateUrl: 'buy.html',
    controller: 'BuyCtrl'
  });

  $routeProvider.when('/mocktransfer', {
    templateUrl: 'mocktransfer.html',
    controller: 'MockTransferCtrl'
  });

  $routeProvider.when('/terms', {
    templateUrl: 'terms.html',
    controller: 'TermsCtrl'
  });

  $routeProvider.when('/', {
    templateUrl: 'home.html',
    controller: 'HomeCtrl'
  });

  $routeProvider.otherwise({ redirectTo: '/' });

});
