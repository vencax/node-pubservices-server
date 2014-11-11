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

  sequelize.sync()
    .on('success', function() {
      console.log('DB synced successfully.');
      cb(null, db);
    })
    .on('failure', function(err) {
      cb('Unable to sync database: ' + err);
    });

};
