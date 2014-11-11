
var port = process.env.PORT || 8080;

var modelModules = [
  require('subscriber-credit-rest').models,
  require('./models')
];

require('./db').init(modelModules, function(err, sequelize) {
  require('./app')(sequelize).listen(port, function() {
    console.log('gandalf do magic on ' + port);
  });
});
