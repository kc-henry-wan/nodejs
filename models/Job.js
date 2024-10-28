// models/Job.js
const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  class Job extends Model {}

  Job.init({
    job_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    job_ref: {
      type: DataTypes.STRING(50),
      unique: true,
    },
    description: DataTypes.TEXT,
    job_date: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    job_start_time: {
      type: DataTypes.TIME,
      allowNull: false,
    },
    job_end_time: {
      type: DataTypes.TIME,
      allowNull: false,
    },
    hourly_rate: DataTypes.DECIMAL(10, 2),
    total_work_hour: DataTypes.DECIMAL(5, 2),
    total_paid: DataTypes.DECIMAL(10, 2),
    lunch_arrangement: DataTypes.STRING(255),
    parking_option: DataTypes.STRING(255),
    rate_per_mile: DataTypes.DECIMAL(5, 2),
    status_code: DataTypes.STRING(1),
    status: DataTypes.STRING(20),
    deleted: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    updated_user_id: DataTypes.INTEGER,
  }, {
    sequelize,
    modelName: 'Job',
    tableName: 'tbl_jobs',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  });

  return Job;
};
