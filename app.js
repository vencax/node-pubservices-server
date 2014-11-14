var express = require('express')
  , bodyParser = require('body-parser')
  , nassa = require('node-angular-server-side-auth')
  , app = express();
var Credit = require('subscriber-credit-rest');


module.exports = function(db) {

  var authapp = express();
  nassa.init(authapp, nassa.sequelizeManip(db), bodyParser);
  app.use('/auth', authapp);

  // create API app ------------------------------------------------------------

  var api = express();

  var expressJwt = require('express-jwt');

  // We are going to protect /api routes with JWT
  api.use(expressJwt({secret: process.env.SERVER_SECRET}));

  if (! ('FRONTEND_APP' in process.env)) {
    api.use(require('cors')({maxAge: 86400}));
  }

  var stateCtrls = require('./controllers/state')(db, Credit);
  api.get('/tickets', stateCtrls.tickets);
  api.post('/buy/:id', stateCtrls.buy);
  api.get('/valid', stateCtrls.getValids);
  api.get('/valid/:id', stateCtrls.isValid);

  // credit updating (bank account checking)
  var FIOAccessor = require('./fioaccessor');
  Credit.startUpdating(db, FIOAccessor);

  api.use('/credit', Credit.app(db));

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
