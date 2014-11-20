var Sequelize = require('sequelize');
var extend = require('util')._extend

if(process.env.DATABASE_URL) {
  var sequelize = new Sequelize(process.env.DATABASE_URL);
} else {
  var sequelize = new Sequelize('sqlite://', {storage: 'db.sqlite'});
}

module.exports.init = function(modelModules, cb) {

  var db = {sequelize: sequelize};

  modelModules.forEach(function(mod) {
    extend(db, mod(sequelize, Sequelize));
  });

  var migrator = sequelize.getMigrator({
    path:        __dirname + '/migrations',
    filesFilter: /\.coffee$/
  });
  migrator.migrate({ method: 'up' }).then(function() {
    cb(null, db);
  }).catch(function(err) {
    cb('Unable to sync database: ' + err);
  });

};
