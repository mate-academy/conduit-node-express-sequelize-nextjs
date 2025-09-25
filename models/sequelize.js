// models/sequelize.js
const fs = require('fs');
const path = require('path');
const { Sequelize, DataTypes, DatabaseError } = require('sequelize');
const config = require('../front/config'); // upewnij się, że masz ten plik

function getSequelize(toplevelDir, toplevelBasename) {
  const sequelizeParams = {
    logging: config.verbose ? 
    (msg) => process.stdout.write(msg + '\n') : 
    false,
    define: {
      freezeTableName: true,
    },
  };

  let sequelize;

  if (config.isProduction || config.postgres) {
    // konfiguracja dla produkcji / Postgres
    sequelizeParams.dialect = config.production.dialect;
    sequelizeParams.dialectOptions = config.production.dialectOptions;
    sequelize = new Sequelize(config.production.url, sequelizeParams);
  } else {
    // konfiguracja dla development / test
    sequelizeParams.dialect = config.development.dialect;
    let storage;

    if (process.env.NODE_ENV 
        === 'test' 
        || !toplevelDir) {
      storage = ':memory:'; // pamięć dla testów
    } else {
      if (!toplevelBasename) {
        toplevelBasename = config.development.storage;
      }
      storage = path.join(toplevelDir, toplevelBasename);
    }

    sequelizeParams.storage = storage;
    sequelize = new Sequelize(sequelizeParams);
  }

  // Import modeli
  const Article = require('./article')(sequelize);
  const Comment = require('./comment')(sequelize);
  const Tag = require('./tag')(sequelize);
  const User = require('./user')(sequelize);
  require('./sequelize_meta')(sequelize);

  // Tutaj możesz dodać wszystkie powiązania / relacje między modelami
  // np. Article.hasMany(Comment), User.hasMany(Article), itp.

  return sequelize;
}

async function sync(sequelize, opts = {}) {
  let dbExists = false;

  try {
    await sequelize.models.SequelizeMeta.findOne();
    dbExists = true;
  } catch (e) {
    if (e instanceof DatabaseError) {
      dbExists = false;
    }
  }

  await sequelize.sync(opts);

  if (!dbExists || opts.force) {
    const migrationsDir = path.join(__dirname, '../migrations');
    if (fs.existsSync(migrationsDir)) {
      const files = fs.readdirSync(migrationsDir);
      await sequelize.models.SequelizeMeta.bulkCreate(
        files.map((basename) => ({ name: basename }))
      );
    }
  }

  return dbExists;
}

module.exports = { getSequelize, sync };
