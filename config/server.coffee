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
  token: "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpZCI6Mywi"

_products =
  1: {id: 1, desc: "za 10", amount: 10, valid: 4, url: 'http://www.comettplus.cz/img/listek10p.jpg'}
  2: {id: 2, desc: "za 12", amount: 12, valid: 8, url: 'http://www.comettplus.cz/img/listek12p.jpg'}
  3: {id: 3, desc: "za 14", amount: 14, valid: 18, url: 'http://www.comettplus.cz/img/listek14p.jpg'}
  4: {id: 4, desc: "za 16", amount: 16, valid: 60, url: 'http://www.comettplus.cz/img/listek16p.jpg'}

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

module.exports =
  drawRoutes: (app) ->

    app.post "/auth/login", (req, res) ->
      res.json(_gandalf)

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

    # -------------- API ---------------

    prefix = '/api'

    app.get "#{prefix}/tickets", (req, res) ->
      res.json(v for k, v of _products)

    app.post "#{prefix}/buy/:id", (req, res) ->
      if _gandalf.credit >= _products[req.params.id].amount
        _gandalf.credit -= _products[req.params.id].amount
        _next_buyed += 1
        _buyed[_next_buyed] =
          id: _next_buyed
          prod: req.params.id
          when: new Date()
        res.status(201).json(_buyed[_next_buyed])
      else
        res.status(400).json()

    app.get "#{prefix}/valid/:id", (req, res) ->
      res.json({ valid: true})

    app.get "#{prefix}/valid", (req, res) ->
      res.json(v for k, v of _buyed)

    # ------------------ credit --------------------

    app.get "#{prefix}/credit/history", (req, res) ->
      rv = (v for k, v of _buyed)
      res.json(rv)

    app.get "#{prefix}/credit/:id", (req, res) ->
      res.json(_crediAccounts[req.params.id])
