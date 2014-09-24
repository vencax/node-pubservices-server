###
Exports a function which returns an object that overrides the default &
plugin file patterns (used widely through the app configuration)

To see the default definitions for Lineman's file paths and globs, see:

- https://github.com/linemanjs/lineman/blob/master/config/files.coffee
###

module.exports = (lineman) ->
  # Override file patterns here
  js:
    vendor: [
      "vendor/bower/angular/angular.js",
      "vendor/bower/angular-resource/angular-resource.js",
      "vendor/bower/angular-route/angular-route.js"
    ],
    app: [
      "app/js/app.js",
      "app/js/**/*.js"
    ]
