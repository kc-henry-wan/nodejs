// models/PharmacyGroup.js
const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  class PharmacyGroup extends Model {}

  PharmacyGroup.init({
    pharmacy_group_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    group_name: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    group_code: DataTypes.STRING(3),
    status: DataTypes.STRING(20),
    updated_user_id: DataTypes.INTEGER,
  }, {
    sequelize,
    modelName: 'PharmacyGroup',
    tableName: 'tbl_pharmacy_group',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  });

  return PharmacyGroup;
};
