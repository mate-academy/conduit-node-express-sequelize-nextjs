#!/usr/bin/env node
const { getSequelize, sync } = require('../models');

async function main() {
  const sequelize = getSequelize();
  await sync(sequelize, { force: true });
  // console.log('Database synced successfully'); 
  await sequelize.close();
}

main().catch((err) => {
  // console.error(err);
  process.exit(1);
});
