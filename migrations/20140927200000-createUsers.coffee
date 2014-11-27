
module.exports =
  up: (migration, DataTypes, done) ->
    migration.createTable "Users",
      id:
        allowNull: false
        autoIncrement: true
        primaryKey: true
        type: DataTypes.INTEGER

      name: DataTypes.STRING
      email:
        type: DataTypes.STRING
        allowNull: false

      passwd: DataTypes.STRING
      createdAt:
        allowNull: false
        type: DataTypes.DATE

      updatedAt:
        allowNull: false
        type: DataTypes.DATE

      state:
        type: DataTypes.INTEGER
        allowNull: false
        defaultValue: 0
    .then(done)

  down: (migration, DataTypes, done) ->
    migration.dropTable("Users").then(done)
