// models/PharmacyBranch.js
const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  class PharmacyBranch extends Model {}

  PharmacyBranch.init({
    pharmacy_branch_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    branch_name: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    address_1: DataTypes.STRING(50),
    address_2: DataTypes.STRING(50),
    postal_code: DataTypes.STRING(10),
    status: DataTypes.STRING(20),
    updated_user_id: DataTypes.INTEGER,
    longitude: DataTypes.DECIMAL(10,8),
    latitude: DataTypes.DECIMAL(10,8),
  }, {
    sequelize,
    modelName: 'PharmacyBranch',
    tableName: 'tbl_pharmacy_branch',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  });

  return PharmacyBranch;
};
