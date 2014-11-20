
module.exports =
  up: (migration, DataTypes, done) ->
    migration.addColumn "Users", "state",
      type: DataTypes.INTEGER
      allowNull: false
      defaultValue: 1

  down: (migration, DataTypes, done) ->
    migration.removeColumn "Users", "state"
