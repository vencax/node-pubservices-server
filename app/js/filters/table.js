
angular.module('app').filter('nicedate', function(){
  return function(date) {
    var m = moment(date)
    return m.format('l') + ', ' + m.format('LT');
  };
});
