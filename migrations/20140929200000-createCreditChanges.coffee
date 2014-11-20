
module.exports =
  up: (migration, DataTypes, done) ->

    migration.createTable "CreditChanges",
      id:
        allowNull: false
        autoIncrement: true
        primaryKey: true
        type: DataTypes.INTEGER
      uid: DataTypes.INTEGER
      desc: DataTypes.STRING
      amount: DataTypes.FLOAT
      createdAt: DataTypes.DATE
    .then(done)

  down: (migration, DataTypes, done) ->
    migration.dropTable("CreditChanges").then(done)
