const { getSequelize } = require('./models');

async function connect() {
  const sequelize = getSequelize();
  await sequelize.authenticate();
  return sequelize;
}

module.exports = { connect };
