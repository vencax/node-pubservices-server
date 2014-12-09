var express = require('express')
  , bodyParser = require('body-parser')
  , nassa = require('node-angular-server-side-auth')
  , app = express();
var Credit = require('subscriber-credit');


module.exports = function(db, sendMail) {

  if (! ('FRONTEND_APP' in process.env)) {
    console.log('Using CORS ...');
    app.use(require('cors')({maxAge: 86400}));
  }

  var authapp = express();
  nassa.init(authapp, nassa.manips.sequelize(db), bodyParser, sendMail);
  app.use('/auth', authapp);

  // create API app ------------------------------------------------------------

  var api = express();

  var expressJwt = require('express-jwt');

  // We are going to protect /api routes with JWT
  api.use(expressJwt({secret: process.env.SERVER_SECRET}));

  var stateCtrls = require('./controllers/state')(db, Credit);
  api.get('/tickets', stateCtrls.tickets);
  api.post('/buy/:id', stateCtrls.buy);
  api.get('/valid', stateCtrls.getValids);
  api.get('/valid/:id', stateCtrls.isValid);

  // credit updating (bank account checking)
  var FIOAccessor = require('./fioaccessor');
  Credit.startUpdating(db, FIOAccessor);

  var creditapp = express();
  api.use('/credit', Credit.hookTo(express(), db));

  // create main app ------------------------------------------------------------

  app.use(bodyParser.urlencoded({ extended: false }));
  app.use(bodyParser.json());

  var prefix = '/api';
  app.use(prefix, api);

  if ('FRONTEND_APP' in process.env) {
    require('lineman-express')(app, express.static, function(err) {
      if(err) { console.log(err); }
    });
  }

  return app;
};
