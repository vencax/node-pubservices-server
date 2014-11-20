
module.exports =
  up: (migration, DataTypes, done) ->
    migration.createTable "Users",
      id:
        allowNull: false
        autoIncrement: true
        primaryKey: true
        type: DataTypes.INTEGER

      name: DataTypes.STRING
      email: DataTypes.STRING
      passwd: DataTypes.STRING
      createdAt:
        allowNull: false
        type: DataTypes.DATE

      updatedAt:
        allowNull: false
        type: DataTypes.DATE

    .done(done)

    migration.createTable "Expirations",
      id:
        allowNull: false
        autoIncrement: true
        primaryKey: true
        type: DataTypes.INTEGER
      expires: DataTypes.DATE
      transaction: DataTypes.INTEGER
      uid: DataTypes.INTEGER
      desc: DataTypes.STRING
      createdAt:
        allowNull: false
        type: DataTypes.DATE
      updatedAt:
        allowNull: false
        type: DataTypes.DATE
    .done(done)

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
    .done(done)

  down: (migration, DataTypes, done) ->
    migration.dropTable("Users").done(done)
    migration.dropTable("Expirations").done(done)
    migration.dropTable("CreditChanges").done(done)
