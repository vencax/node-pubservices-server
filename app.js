var express = require('express')
  , bodyParser = require('body-parser')
  , app = express();


module.exports = function(db) {
  // // create auth API -----------------------------------------------------------
  // var manip = {
  //   find: function(uname, done) {
  //     return done(null, {id: 111, uname: uname, name: uname});
  //   },
  //
  //   create: function(props, done) {
  //     return User(props);
  //   },
  //
  //   save: function(user, done) {
  //     return done(null, user);
  //   },
  //
  //   validPassword: function(user, passwd) {
  //     return true;
  //   }
  // };
  var sqlManip = {
    find: function(uname, done) {
      db.User.find({where: {email: uname}}).success(function(found) {
        return done(null, found.dataValues);
      });
    },

    create: function(props, done) {
      return db.User.create(props).success(function(created) {
        done(null, created);
      });
    },

    save: function(user, done) {
      user.save().success(function(saved) {
        return done(null, saved);
      });
    },

    validPassword: function(user, passwd) {
      return user.passwd === passwd;
    }
  };
  app.use('/auth', require('./auth.js')(sqlManip));


  // create API app ------------------------------------------------------------

  var api = express();

  var expressJwt = require('express-jwt');

  // We are going to protect /api routes with JWT
  api.use(expressJwt({secret: process.env.SERVER_SECRET}));

  if (! ('FRONTEND_APP' in process.env)) {
    api.use(require('cors')({maxAge: 86400}));
  }

  var stateCtrls = require('./controllers/state')(db);
  api.get('/tickets', stateCtrls.tickets);
  api.post('/buy/:id', stateCtrls.buy);
  api.get('/valid', stateCtrls.getValids);
  api.get('/valid/:id', stateCtrls.isValid);

  // create main app ------------------------------------------------------------

  if ('FRONTEND_APP' in process.env) {
    // mount angular frontend -> no need for CORS
    console.log("mounting angular frontend ...");
    app.use(express.static(process.env.FRONTEND_APP));
  }

  app.use(bodyParser.urlencoded({ extended: false }));
  app.use(bodyParser.json());

  var prefix = '/api';
  app.use(prefix, api);

  if ('FRONTEND_APP' in process.env) {
    app.get('*', function(req, res) {
      res.sendfile(process.env.FRONTEND_APP + '/index.html');
    });
  }

  return app;
};
