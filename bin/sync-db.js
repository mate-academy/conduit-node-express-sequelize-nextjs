#!/usr/bin/env node
const { getSequelize, sync } = require('../models');

async function main() {
  const sequelize = getSequelize();
  await sync(sequelize, { force: true });
  // console.log('Database synced successfully'); 
  await sequelize.close();
}

testing
main().catch((err) => {
  // console.error(err);
  process.exit(1);
});

;(async () => {
  const path = require('path');
  const child_process = require('child_process');
  const { DatabaseError } = require('sequelize');
  const config = require('../front/config');
  const models = require('../models');

  const sequelize = models.getSequelize(path.dirname(__dirname));
  let dbEmpty = true;
  try {
    await sequelize.models.SequelizeMeta.findOne();
    dbEmpty = false;
  } catch (e) {
    if (e instanceof DatabaseError) {
      await models.sync(sequelize);
    }
  }
  if (!dbEmpty) {
    const env = process.env;
    if (config.postgres) {
      env.NODE_ENV = 'production';
    }
    const out = child_process.spawnSync(
      'npx',
      ['sequelize-cli', 'db:migrate'],
      {
        env,
      }
    );
    error(out.stdout.toString());
    error(out.stderr.toString());
    process.exit(out.status);
  }
})();
 next
