const { getSequelize, sync } = require('./sequelize');

const sequelize = getSequelize();
sync(sequelize, { force: false }).catch((err) => {});

module.exports = sequelize;
