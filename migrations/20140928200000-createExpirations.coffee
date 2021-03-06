
module.exports =
  up: (migration, DataTypes, done) ->
    migration.createTable "Expirations",
      id:
        allowNull: false
        autoIncrement: true
        primaryKey: true
        type: DataTypes.INTEGER
      expires: DataTypes.DATE
      transid: DataTypes.INTEGER
      buyer: DataTypes.INTEGER
      uid: DataTypes.INTEGER
      desc: DataTypes.STRING
      createdAt:
        allowNull: false
        type: DataTypes.DATE
      updatedAt:
        allowNull: false
        type: DataTypes.DATE
    .then(done)

  down: (migration, DataTypes, done) ->
    migration.dropTable("Expirations").then(done)
