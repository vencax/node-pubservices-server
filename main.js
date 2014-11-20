
var port = process.env.PORT || 8080;
var sendMail = null;

if(process.env.EMAIL_HOST) {
  var nodemailer = require('nodemailer');
  var smtpTransport = require('nodemailer-smtp-transport');

  var transporter = nodemailer.createTransport(smtpTransport({
    host: process.env.EMAIL_HOST,
    port: 25,
    ignoreTLS: true
  }));

  sendMail = function(data, cb) {
    transporter.sendMail(data, cb);
  };
} else {
  var sendgrid  = require('sendgrid')(process.env.SENDGRID_USERNAME, process.env.SENDGRID_PASSWORD);
  sendMail = function(data, cb) {
    sendgrid.send(data, cb);
  };
}

var modelModules = [
  require('subscriber-credit').models,
  require('./models')
];

require('./db').init(modelModules, function(err, sequelize) {
  require('./app')(sequelize, sendMail).listen(port, function() {
    console.log('gandalf do magic on ' + port);
  });
});
