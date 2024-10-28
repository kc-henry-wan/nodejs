const { Sequelize } = require('sequelize');
const config = require('../config/config.json');

const sequelize = new Sequelize(config.database);

const db = {
  sequelize,
  Sequelize
};

db.AdminUser = require('./AdminUser')(sequelize);
db.Pharmacist = require('./Pharmacist')(sequelize);
db.PharmacyGroup = require('./PharmacyGroup')(sequelize);
db.PharmacyBranch = require('./PharmacyBranch')(sequelize);
db.Job = require('./Job')(sequelize);

// Define associations
db.Job.belongsTo(db.Pharmacist, { foreignKey: 'pharmacist_id' });
db.Job.belongsTo(db.PharmacyGroup, { foreignKey: 'pharmacy_group_id' });
db.Job.belongsTo(db.PharmacyBranch, { foreignKey: 'pharmacy_branch_id' });
db.Job.belongsTo(db.AdminUser, { foreignKey: 'updated_user_id' });

db.Pharmacist.belongsTo(db.AdminUser, { foreignKey: 'updated_user_id' });
db.PharmacyGroup.belongsTo(db.AdminUser, { foreignKey: 'updated_user_id' });
db.PharmacyBranch.belongsTo(db.AdminUser, { foreignKey: 'updated_user_id' });

module.exports = db;
