const { getSequelize, sync } = require('./models');

async function generateDemoData() {
  const sequelize = getSequelize();
  await sync(sequelize, { force: true });
}

module.exports = { generateDemoData };
