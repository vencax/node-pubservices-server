

var _hexdigit = [
  'a', 'b', 'c', 'd', 'e', 'f', 'A', 'B', 'C', 'D', 'E', 'F',
  '0', '1', '2', '3', '4', '5', '6', '7', '8', '9'
];

var _normalize = function(mac) {
  var validated = [];
  for(var i=0, len=mac.length; i<len; i++) {
    if (_hexdigit.indexOf(mac[i]) >= 0) {
      validated.push(mac[i]);
    }
  }
  return validated.join('');
};

var _validMac = function(mac) {
  if (mac && _normalize(mac).length === 12) {
    return true;
  } else {
    return false;
  }
};

angular.module("app").directive('macAddress', [function() {
  return {
    restrict: 'A',
    require: 'ngModel',
    link: function(scope, element, attrs, ctrl) {
      scope.$watch(attrs.ngModel, function(newData) {
        var valid = _validMac(newData);
        ctrl.$setValidity('mac', valid);
      });
    }
  };
}]);
