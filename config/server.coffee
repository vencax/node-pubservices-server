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

_users = {}


module.exports =
  drawRoutes: (app) ->

    prefix = '/api'

    app.post "#{prefix}/login", (req, res) ->
      res.json({
        first_name: 'Gandalf', last_name: 'The Gray',
        role: 0, uname: 'gandalf',
        token: "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpZCI6Mywi"
      })

    app.post "#{prefix}/logout", (req, res) ->
      res.json({ message: 'logging out!'})

    app.get "#{prefix}/auth/facebook/", (req, res) ->
      res.redirect('https://www.facebook.com/login.php');

    app.get "#{prefix}/auth/google/", (req, res) ->
      res.redirect('https://accounts.google.com/ServiceLogin');

    app.post "#{prefix}/auth/check/", (req, res) ->
      errs = []
      errs.push 0 if req.body.email of _users
      return res.status(200).send(errs)

    app.post "#{prefix}/auth/register", (req, res) ->
      return res.status(404).send("already exists") if req.body.email in _users
      _users[req.body.email] = req.body
      console.log(_users)
      res.json(_users[req.body.email])
