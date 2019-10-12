'use strict';
module.exports = (sequelize, DataTypes) => {
  const DateRecord = sequelize.define('DateRecord', {
    date: DataTypes.DATE,
    month: DataTypes.STRING,
    year: DataTypes.STRING,
    day: DataTypes.STRING,
    UserId: DataTypes.INTEGER
  }, {});
  DateRecord.associate = function(models) {
    // associations can be defined here
    DateRecord.belongsTo(models.User, {
      foreignKey: 'UserId'
    });
    DateRecord.belongsTo(models.Record)
  };
  return DateRecord;
};