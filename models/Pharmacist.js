// models/Pharmacist.js
const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  class Pharmacist extends Model {}

  Pharmacist.init({
    pharmacist_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    password: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    email: DataTypes.STRING(100),
    first_name: DataTypes.STRING(50),
    last_name: DataTypes.STRING(50),
    mobile: DataTypes.STRING(20),
    address_1: DataTypes.STRING(50),
    address_2: DataTypes.STRING(50),
    postal_code: DataTypes.STRING(10),
    status: DataTypes.STRING(20),
    updated_user_id: DataTypes.INTEGER,
    longitude: DataTypes.DECIMAL(10,8),
    latitude: DataTypes.DECIMAL(10,8),
  }, {
    sequelize,
    modelName: 'Pharmacist',
    tableName: 'tbl_pharmacist',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  });

  return Pharmacist;
};
