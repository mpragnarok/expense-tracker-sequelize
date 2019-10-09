'use strict';
module.exports = (sequelize, DataTypes) => {
  const Record = sequelize.define('Record', {
    name: DataTypes.STRING,
    category: DataTypes.STRING,
    subCategory: DataTypes.STRING,
    amount: DataTypes.FLOAT,
    date: DataTypes.DATE,
    month: DataTypes.STRING,
    year: DataTypes.STRING,
    day: DataTypes.STRING,
    sign: DataTypes.STRING,
    icon: DataTypes.STRING,
    merchant: DataTypes.STRING,
    subCategoryNum: DataTypes.STRING,
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