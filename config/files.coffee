###
Exports a function which returns an object that overrides the default &
plugin file patterns (used widely through the app configuration)

To see the default definitions for Lineman's file paths and globs, see:

- https://github.com/linemanjs/lineman/blob/master/config/files.coffee
###

module.exports = (lineman) ->

  # copy bootstrap icons
  lineman.config.application.copy.dist.files.push
    expand: true
    cwd: "vendor/bower/bootstrap/fonts"
    src: "**"
    dest: 'dist/fonts'
  lineman.config.application.copy.dev.files.push
    expand: true
    cwd: "vendor/bower/bootstrap/fonts"
    src: "**"
    dest: 'generated/fonts'

  # Override file patterns here
  js:
    vendor: [
      "vendor/bower/angular/angular.js",
      "vendor/bower/angular-resource/angular-resource.js",
      "vendor/bower/angular-cookies/angular-cookies.js",
      "vendor/bower/angular-route/angular-route.js",
      "vendor/bower/ng-table/ng-table.js",
      "vendor/bower/ngstorage/ngStorage.js",
      "vendor/bower/angular-bootstrap/ui-bootstrap-tpls.js"
    ],
    app: [
      "app/js/app.js",
      "app/js/**/*.js"
    ]

  css:
    vendor: [
      "vendor/bower/ng-table/ng-table.css"
    ]
