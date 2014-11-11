

module.exports = function(sequelize, Sequelize) {

  return {

    User: sequelize.define('User', {
      name: Sequelize.STRING,
      email: Sequelize.STRING,
      passwd: Sequelize.STRING
    }),

    Expirations: sequelize.define('Expirations', {
      expires: Sequelize.DATE,
      transaction: Sequelize.INTEGER,
      uid: Sequelize.INTEGER,
      desc: Sequelize.STRING
    })

  };

};
