// TODO: 1. DELETE sign, icon, subCategoryNum
// TODO: DELETE month, day, year

'use strict';
module.exports = (sequelize, DataTypes) => {
  const Record = sequelize.define('Record', {
    name: DataTypes.STRING,
    category: DataTypes.STRING,
    subCategory: DataTypes.STRING,
    amount: DataTypes.FLOAT,
    date: DataTypes.DATE,
    merchant: DataTypes.STRING,
    UserId: DataTypes.INTEGER
  }, {});
  Record.associate = function(models) {
    // associations can be defined here
    Record.belongsTo(models.User, {
      foreignKey: 'UserId'
    });

  };
  return Record;
};