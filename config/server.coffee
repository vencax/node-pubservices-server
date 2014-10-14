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

_db = {}

addItem = (item) ->
  _db[item.mac] = item
  return item

genItems = (cnt) ->
  for idx in [1..cnt]
    item =
      name: "host#{idx}"
      ip: "192.168.1.#{idx+10}"
      mac: "aaaaaaaaaa#{idx+10}"
      desc: (idx % 4 == 1) && '' || "#{idx}th description"
      state: idx % 2
      res: idx % 4 != 1
    addItem(item)

genItems(20)


module.exports =
  drawRoutes: (app) ->

    app.post '/login', (req, res) ->
      res.json({ message: 'logging in!' })

    app.post '/logout', (req, res) ->
      res.json({ message: 'logging out!'})

    prefix = '/api'

    app.get "#{prefix}/dhcphosts", (req, res) ->
      rv = []
      for k, v of _db
        rv.push v
      res.json(rv)

    app.post "#{prefix}/dhcphosts", (req, res) ->
      req.body.res = true
      created = addItem(req.body)
      res.json(created)

    app.put "#{prefix}/dhcphosts/:dhcphost", (req, res) ->
      item = _db[req.params.dhcphost]
      for k, v of req.body
        item[k] = v
      res.json(item)

    app.delete "#{prefix}/dhcphosts/:dhcphost", (req, res) ->
      item = _db[req.params.dhcphost]
      item.res = false;
      res.json(item)

    app.get "#{prefix}/hoststate/:dhcphost", (req, res) ->
      item = _db[req.params.dhcphost]
      res.json(item.state)

    app.put "#{prefix}/hoststate/:dhcphost", (req, res) ->
      item = _db[req.params.dhcphost]
      item.state = req.body.state
      res.send 200
