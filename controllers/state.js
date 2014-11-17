
var urlBase = 'http://www.comettplus.cz/img/';

var tickets = {
  0: {desc: "4 min, zlevněná", amount: 5, valid: 4, url: urlBase + 'listek5z.jpg'},
  1: {desc: "4 min, plnocenná", amount: 10, valid: 4, url: urlBase + 'listek10p.jpg'},

  2: {desc: "8 min, zlevněná", amount: 6, valid: 8, url: urlBase + 'listek6z.jpg'},
  3: {desc: "8 min, plnocenná", amount: 12, valid: 8, url: urlBase + 'listek12p.jpg'},

  4: {desc: "18 min, zlevněná", amount: 7, valid: 18, url: urlBase + 'listek7z.jpg'},
  5: {desc: "18 min, plnocenná", amount: 14, valid: 18, url: urlBase + 'listek14p.jpg'},

  6: {desc: "60 min, zlevněná", amount: 8, valid: 60, url: urlBase + 'listek8z.jpg'},
  7: {desc: "60 min, plnocenná", amount: 16, valid: 60, url: urlBase + 'listek16p.jpg'},

  8: {desc: "24 hod, zlevněná", amount: 25, valid: 24 * 60, url: urlBase + 'listek25z.jpg'},
  9: {desc: "24 hod, plnocenná", amount: 50, valid: 24 * 60, url: urlBase + 'listek50p.jpg'},

  10: {desc: "7 dnů, zlevněná", amount: 75, valid: 7 * 24 * 60, url: urlBase + 'listek75z.jpg'},
  11: {desc: "7 dnů, plnocenná", amount: 150, valid: 7 * 24 * 60, url: urlBase + 'listek150p.jpg'},
};

var moment = require('moment');

module.exports = function(models, Credit) {

  return {

    tickets: function(req, res, next) {
      t = [];
      for (var key in tickets) {
        e = {id: key};
        for (var k in tickets[key]) {
          e[k] = tickets[key][k];
        }
        t.push(e);
      }
      res.status(200).send(t);
    },

    buy: function(req, res, next) {
      var ticket = tickets[req.params.id];
      var change = Credit.update(models, {
        desc: ticket.desc, amount: -ticket.amount,
        createdAt: new Date(), uid: req.user.id
      }, function(err, change) {
        if(err) {
          return res.status(400).send(err);
        }
        models.Expirations
          .create({
            expires: moment().add(ticket.valid, 'm'),
            uid: req.user.id,
            transaction: change.id,
            desc: ticket.desc
          })
          .on('success', function(expiration){
            res.status(200).send(change);
          });
      });
    },

    getValids: function(req, res, next) {
      models.Expirations
        .findAll({where: {
          uid: req.user.id,
          expires: {gte: new Date()}
        }})
        .success(function(found) {
          res.status(200).send(found);
        });
    },

    isValid: function(req, res, next) {
      models.Expirations
        .find({where: {
          uid: req.body.uid,
          transaction: req.body.id,
          expires: {gte: new Date()}
        }})
        .success(function(found) {
          res.status(200).send(found);
        });
    }

  };
};
