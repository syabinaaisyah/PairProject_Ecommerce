'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Customer extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Customer.belongsTo(models.User, {
        foreignKey: 'UserId',
        as: 'user',
      });

      Customer.hasMany(models.Order, {
        foreignKey: 'CustomerId',
        as: 'orders',
      });

      Customer.belongsToMany(models.Product, {
        through: models.Order,
        foreignKey: 'CustomerId',
        otherKey: 'ProductId',
        as: 'products',
      });
    }
  }
  Customer.init({
    name: DataTypes.STRING,
    address: DataTypes.STRING,
    phoneNumber: DataTypes.STRING,
    balance: DataTypes.INTEGER,
    gender: DataTypes.STRING,
    UserId: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Customer',
  });
  return Customer;
};