
angular.module('app').filter('formattedmac', function(){
  return function(mac) {
     var parts = [
      mac.slice(0, 2),
      mac.slice(2, 4),
      mac.slice(4, 6),
      mac.slice(6, 8),
      mac.slice(8, 10),
      mac.slice(10, 12)
    ];
    return parts.join(":");
  }
});
