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
    }
  }
  Order.init({
    orderDate: DataTypes.DATE,
    paymentStatus: DataTypes.STRING,
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