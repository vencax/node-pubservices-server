
module.exports =
  up: (migration, DataTypes, done) ->
    migration.addColumn "Users", "state",
      type: DataTypes.INTEGER
      allowNull: false
      defaultValue: 1
    .then(done)
    .catch (err)->
      console.log(err)
      done()

  down: (migration, DataTypes, done) ->
    migration.removeColumn "Users", "state"
    .then(done)
