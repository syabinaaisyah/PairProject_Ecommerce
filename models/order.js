'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Order extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Order.belongsTo(models.Customer, {
        foreignKey: 'CustomerId',
        as: 'customer',
      });

      Order.belongsTo(models.Product, {
        foreignKey: 'ProductId',
        as: 'product',
      });
    }
  }
  Order.init({
    CustomerId: {
     type: DataTypes.INTEGER,
      references: {
        model: 'Customers',
        key: 'id'
      }
    }, 
    ProductId: {
      type: DataTypes.INTEGER,
      references: {
        model: 'Products',
        key: 'id'
      }
    } 
  }, {
    sequelize,
    modelName: 'Order',
  });
  return Order;
};