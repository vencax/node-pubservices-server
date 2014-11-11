var pbkdf2 = require('pbkdf2-sha256');
var express = require('express');
var bodyParser = require('body-parser');
var jwt = require('jsonwebtoken');
var passport = require('passport');


var tokenValidInMinutes = process.env.TOKEN_VALIDITY_IN_MINS || 60;

var _embedToken = function(user) {
  var token = jwt.sign(user, process.env.SERVER_SECRET, {
    expiresInMinutes: tokenValidInMinutes
  });
  user.token = token;
};


module.exports = function(usermanip) {

  var api = express();

  api.use(passport.initialize());

  if ('FBCLIENTID' in process.env) {

    var FacebookStrategy = require('passport-facebook').Strategy;

    passport.use(new FacebookStrategy({
      clientID: process.env.FBCLIENTID,
      clientSecret: process.env.FBCLIENTSECRET,
      callbackURL: 'http://mhd.vxk.cz/auth/facebook/callback'
    }, function(accessToken, refreshToken, profile, done) {
      email = profile.username + '@facebook.com';
      usermanip.find(email, function(err, user) {
        if (!user) {
          user = usermanip.create({email: email, name: profile.displayName});
        }
        usermanip.save(user, function(err, user) {
          return done(null, user);
        })
      });
    }));

    api.get('/facebook', passport.authenticate('facebook'));

    api.get('/facebook/callback',
      passport.authenticate('facebook', {session: false}),
      function(req, res) {
        _embedToken(req.user);
        res.cookie('mysetuser', JSON.stringify(req.user), { maxAge: 9000 });
        res.redirect('/login');
      });

  }

  if ('TWITTERCONSUMERKEY' in process.env) {
    var TwitterStrategy = require('passport-twitter').Strategy;

    passport.use(new TwitterStrategy({
      consumerKey: process.env.TWITTERCONSUMERKEY,
      consumerSecret: process.env.TWITTERCONSUMERSECRET,
      callbackURL: "http://mhd.vxk.cz/auth/twitter/callback"
    }, function(accessToken, refreshToken, profile, done) {
      email = profile.username + '@twitter.com';
      usermanip.find(email, function(err, user) {
        if (!user) {
          user = usermanip.create({email: email, name: profile.displayName});
        }
        usermanip.save(user, function(err, user) {
          return done(null, user);
        })
      });
    }));

    var session = require('express-session')
    api.use(session({
      secret: 'keyboard cat', saveUninitialized: true, resave: true
    }));

    api.get('/twitter', passport.authenticate('twitter'));

    api.get('/twitter/callback',
      passport.authenticate('twitter', {session: false}),
      function(req, res) {
        _embedToken(req.user);
        res.cookie('mysetuser', JSON.stringify(req.user), { maxAge: 9000 });
        res.redirect('/login');
      });
  }

  // var GithubStrategy = require('passport-github').Strategy;

  if ('GOOGLECLIENTID' in process.env) {

    var GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;

    passport.use(new GoogleStrategy({
      clientID: process.env.GOOGLECLIENTID,
      clientSecret: process.env.GOOGLECLIENTSECRET,
      callbackURL: "http://mhd.vxk.cz/auth/google/callback"
    },
    function(accessToken, refreshToken, profile, done) {
      usermanip.find(profile.email, function(err, user) {
        if (!user) {
          user = usermanip.create({email: email, name: profile.displayName});
        }
        usermanip.save(user, function(err, user) {
          return done(null, user);
        })
      });
    }));

    api.get('/google', passport.authenticate('google', {
      scope: 'https://www.googleapis.com/auth/userinfo.profile'
    }));

    api.get('/google/callback',
      passport.authenticate('google', {session: false}),
      function(req, res) {
        _embedToken(req.user);
        res.cookie('mysetuser', JSON.stringify(req.user), { maxAge: 9000 });
        res.redirect('/login');
      });
  }

  // ---------------------------------------------------------------------------

  LocalStrategy = require('passport-local').Strategy;

  var _verifyUser = function(username, password, done) {
    usermanip.find(username, function(err, user) {
      if (err) {
        return done(err);
      }
      if (!user) {
        return done(null, false, { message: 'Incorrect username.' });
      }
      if (!usermanip.validPassword(user, password)) {
        return done(null, false, { message: 'Incorrect password.' });
      }
      return done(null, user);
    });
  };

  passport.use(new LocalStrategy(_verifyUser));

  api.use(bodyParser.json());
  api.post('/login',
    passport.authenticate('local', {session: false}),
    function(req, res) {
      _embedToken(req.user);
      res.send(req.user);
    });

  // ---------------------------------------------------------------------------

  api.post('/check', function(req, res) {
    usermanip.find(req.body.email, function(err, user) {
      if(user) {
        return res.send([0]);
      } else {
        return res.send([]);
      }
    });
  });

  api.post('/register', function(req, res) {
    usermanip.find(username, function(err, user) {
      if(user) {
        return res.status(400).send('Already exists');
      }
      usermanip.create(req.body, function(err, user) {
        if(err) {
          return res.status(400).send(err);
        }
        usermanip.save(user, function(err, saved) {
          if(err) {
            return res.status(400).send(err);
          }
          return res.status(201).send(saved);
        });
      });
    });
  });

  return api;
};
