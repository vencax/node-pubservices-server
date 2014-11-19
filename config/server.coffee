###
Define custom server-side HTTP routes for lineman's development server
These might be as simple as stubbing a little JSON to
facilitate development of code that interacts with an HTTP service
(presumably, mirroring one that will be reachable in a live environment).

It's important to remember that any custom endpoints defined here
will only be available in development, as lineman only builds
static assets, it can't run server-side code.

This file can be very useful for rapid prototyping or even organically
defining a spec based on the needs of the client code that emerge.
###

_gandalf =
  id: 111
  first_name: 'Gandalf'
  last_name: 'The Gray'
  role: 0
  uname: 'gandalf'
  email: 'g@nda.lf'
  token: "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpZCI6Mywi"

urlBase = 'http://www.comettplus.cz/img/'

_products =
  0: {id: 0, desc: "4 min, zlevněná", amount: 5, valid: 4, url: urlBase + 'listek5z.jpg'}
  1: {id: 1, desc: "4 min, plnocenná", amount: 10, valid: 4, url: urlBase + 'listek10p.jpg'}

  2: {id: 2, desc: "8 min, zlevněná", amount: 6, valid: 8, url: urlBase + 'listek6z.jpg'}
  3: {id: 3, desc: "8 min, plnocenná", amount: 12, valid: 8, url: urlBase + 'listek12p.jpg'}

  4: {id: 4, desc: "18 min, zlevněná", amount: 7, valid: 18, url: urlBase + 'listek7z.jpg'}
  5: {id: 5, desc: "18 min, plnocenná", amount: 14, valid: 18, url: urlBase + 'listek14p.jpg'}

  6: {id: 6, desc: "60 min, zlevněná", amount: 8, valid: 60, url: urlBase + 'listek8z.jpg'}
  7: {id: 7, desc: "60 min, plnocenná", amount: 16, valid: 60, url: urlBase + 'listek16p.jpg'}

  8: {id: 8, desc: "24 hod, zlevněná", amount: 25, valid: 24 * 60, url: urlBase + 'listek25z.jpg'}
  9: {id: 9, desc: "24 hod, plnocenná", amount: 50, valid: 24 * 60, url: urlBase + 'listek50p.jpg'}

  10: {id: 10, desc: "7 dnů, zlevněná", amount: 75, valid: 7 * 24 * 60, url: urlBase + 'listek75z.jpg'}
  11: {id: 11, desc: "7 dnů, plnocenná", amount: 150, valid: 7 * 24 * 60, url: urlBase + 'listek150p.jpg'}

_users = {}
_buyed = {
  1: {id: 1, uid: 111, desc: "predplaceno 70", amount: 70, createdAt: new Date(2014, 9, 27)},
  2: {id: 2, uid: 111, desc: "listek za 10", amount: -10, createdAt: new Date(2014, 9, 28)},
  3: {id: 3, uid: 111, desc: "listek za 14", amount: -14, createdAt: new Date(2014, 9, 30)},
  4: {id: 4, uid: 111, desc: "listek za 16", amount: -16, createdAt: new Date(2014, 10, 11)},
}
_crediAccounts = {
  111: {uid: 111, state: 30}
}
_next_buyed = 5
_expirations = {}

_isValid = (ticketID) ->
  return false if ticketID not of _expirations
  return _expirations[ticketID].expires > new Date()


module.exports =
  drawRoutes: (app) ->

    app.use(require('cors')({maxAge: 86400}));

    app.post "/auth/login", (req, res) ->
      if req.body.username == _gandalf.uname and req.body.password == _gandalf.passwd
        res.json(_gandalf)
      else
        res.status(404).send('WRONG_CREDENTIALS')

    app.post "/auth/logout", (req, res) ->
      res.json({ message: 'logging out!'})

    app.get "/auth/facebook", (req, res) ->
      res.redirect('https://www.facebook.com/login.php');

    app.get "/auth/google", (req, res) ->
      res.redirect('https://accounts.google.com/ServiceLogin');

    app.post "/auth/check", (req, res) ->
      errs = []
      errs.push 0 if req.body.email of _users
      return res.status(200).send(errs)

    app.post "/auth/register", (req, res) ->
      return res.status(404).send("already exists") if req.body.email in _users
      _users[req.body.email] = req.body
      console.log(_users)
      res.json(_users[req.body.email])

    app.post "/auth/setpasswd", (req, res) ->
      res.json('OK')

    app.post "/auth/requestforgotten", (req, res) ->
      if req.body.email == _gandalf.email
        res.json('OK')
      else
        res.status(404).json('USER_NOT_FOUND')

    # -------------- API ---------------

    prefix = '/api'

    app.get "#{prefix}/tickets", (req, res) ->
      res.json(v for k, v of _products)

    app.post "#{prefix}/buy/:id", (req, res) ->
      curr = _crediAccounts[_gandalf.id]
      product = _products[req.params.id]
      if curr.state >= product.amount
        curr.state -= product.amount
        change =
          id: _next_buyed
          desc: "Buy of #{product.desc}"
          amount: -product.amount
          createdAt: new Date()
          uid: 111

        _buyed[_next_buyed] = change
        validInMilis = (product.valid * 60 * 1000)
        _expirations[_next_buyed] =
          expires: new Date(change.createdAt.getTime() + validInMilis)
          product: product
        rv =
          expires: _expirations[_next_buyed].expires
          id: _next_buyed
          url: product.url
        res.status(201).json(rv)
        _next_buyed += 1
      else
        res.status(400).json('NOT_ENOUGH_MONEY')

    app.get "#{prefix}/valid/:id", (req, res) ->
      res.json({ valid: true})

    app.get "#{prefix}/valid", (req, res) ->
      rv = []
      for k, e of _expirations
        if e.expires > new Date()
          v =
            expires: e.expires
            id: k
            desc: e.product.desc
          rv.push(v)
      res.json(rv)

    # ------------------ credit --------------------

    app.post "#{prefix}/credit/increase", (req, res) ->
      return res.status(400).send('USER_NOT_FOUND') if req.body.uid != 111
      _crediAccounts[_gandalf.id].state += req.body.amount
      res.json({amount: req.body.amount})

    app.get "#{prefix}/credit/history", (req, res) ->
      rv = (v for k, v of _buyed)
      res.json(rv)

    app.get "#{prefix}/credit/current/:id", (req, res) ->
      res.json(_crediAccounts[req.params.id].state)
