

angular.module("app").directive('match', [function () {
  return {
    require: 'ngModel',
    link: function (scope, elem, attrs, ctrl) {

      scope.$watch('[' + attrs.ngModel + ', ' + attrs.match + ']', function(value){
        ctrl.$setValidity('match', value[0] === value[1] );
      }, true);

    }
  };
}]);

angular.module("app").directive('unique', ['$http', function($http) {
  return {
    require: 'ngModel',
    link: function(scope, elem, attrs, ctrl) {
      scope.busy = false;
      scope.$watch(attrs.ngModel, function(value) {

        // hide old error messages
        ctrl.$setValidity('unique', true);

        if (!value) {
          // don't send undefined to the server during dirty check
          // empty username is caught by required directive
          return;
        }

        scope.busy = true;
        var data = {};
        data[attrs['name']] = value;
        $http.post(attrs.unique, data)
          .success(function(data) {
            ctrl.$setValidity('unique', data.length === 0);
            scope.busy = false;
          })
          .error(function(data) {
            ctrl.$setValidity('unique', false);
            scope.busy = false;
          });
      });
    }
  };
}]);
