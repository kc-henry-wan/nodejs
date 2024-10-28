// models/AdminUser.js
const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  class AdminUser extends Model {}

  AdminUser.init({
    admin_user_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    username: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    password: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    first_name: DataTypes.STRING(50),
    last_name: DataTypes.STRING(50),
    email: DataTypes.STRING(100),
    mobile: DataTypes.STRING(20),
    status: DataTypes.STRING(20),
    updated_user_id: DataTypes.INTEGER,
  }, {
    sequelize,
    modelName: 'AdminUser',
    tableName: 'tbl_admin_user',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  });

  return AdminUser;
};
