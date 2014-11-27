

module.exports = (sequelize, Sequelize) ->

  Expirations: sequelize.define 'Expirations',
    expires: Sequelize.DATE
    transid: Sequelize.INTEGER
    buyer: Sequelize.INTEGER  # id of user who has buyed item that expires
    uid: Sequelize.INTEGER    # expiration can be validated on this(car id, ...)
    desc: Sequelize.STRING
