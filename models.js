

module.exports = function(sequelize, Sequelize) {

  return {

    User: sequelize.define('User', {
      name: Sequelize.STRING,
      email: Sequelize.STRING,
      passwd: Sequelize.STRING,
      state: Sequelize.INTEGER
    }),

    Expirations: sequelize.define('Expirations', {
      expires: Sequelize.DATE,
      transaction: Sequelize.INTEGER,
      uid: Sequelize.INTEGER,
      desc: Sequelize.STRING
    })

  };

};
