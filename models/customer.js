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
      Customer.belongsToMany(models.Product, {
        through: models.Order,
        foreignKey: 'CustomerId',
        otherKey: 'ProductId'
      })
      Customer.hasOne(models.User)
    }
  }
  Customer.init({
    name: DataTypes.STRING,
    gender: DataTypes.STRING,
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true,
        notEmpty: {
          msg: 'jangan Null dong!'
        }
      }
    },
    password: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Customer',
    hooks: {
      beforeCreate(instance, options){
        const salt = bcrypt.genSaltSync(10);
        const hash = bcrypt.hashSync(instance.password, salt);

        instance.password = hash
      }
    }
  });
  return Customer;
};