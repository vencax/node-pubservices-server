
moment = require("moment")
tickets = require("./tickets")

validateBuy = (service, body, res) ->
  if service.cat == 2 and not body.uid
    res.status(400).send('uid required')
    return false
  return true

module.exports = (models, Credit) ->

  tickets: (req, res, next) ->
    t = []
    for key of tickets
      e = id: key
      for k of tickets[key]
        e[k] = tickets[key][k]
      t.push e
    res.status(200).send t


  buy: (req, res, next) ->
    ticket = tickets[req.params.id]
    return if not validateBuy ticket, req.body, res
    change =
      desc: ticket.desc
      amount: -ticket.amount
      createdAt: new Date()
      uid: req.user.id

    Credit.update models, change, (err, change) ->
      return res.status(400).send(err) if err

      expiration =
        expires: moment().add(ticket.valid, "m")
        uid: req.body.uid
        buyer: req.user.id
        transid: change.id
        desc: ticket.desc + " (#{req.body.uid})"

      models.Expirations.create(expiration).on "success", (expiration) ->
        res.status(200).send change


  getValids: (req, res, next) ->
    models.Expirations.findAll(where:
      buyer: req.user.id
      expires:
        gte: new Date()
    ).success (found) ->
      res.status(200).send found


  isValid: (req, res, next) ->
    models.Expirations.find(where:
      uid: req.body.uid
      transid: req.body.id
      expires:
        gte: new Date()
    ).success (found) ->
      res.status(200).send found
