'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Product extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Product.belongsToMany(models.User, {
        through: models.Order,
        foreignKey: 'ProductId',
        otherKey: 'CustomerId'
      });
      Product.belongsTo(models.Category)
    }

    get formatPrice() {
      return new Intl.NumberFormat("id-ID", {
        style: "currency", currency: "IDR"
      }).format(price);
    }
  }
  Product.init({
    name: {
     type: DataTypes.STRING,
     allowNull: false,
     validate: {
      notEmpty: {
        msg: 'Name cannot be empty!'
      }
     }
    }, 
    price: {
     type: DataTypes.INTEGER,
     allowNull: false,
     validate: {
      notEmpty: {
        msg: 'price cannot be empty!'
      },
      min: {
        args: [1],
        msg: 'Price must be greater than 0'
    }
     },
    }, 
    stock: {
     type: DataTypes.INTEGER,
     allowNull: false,
     validate: {
      notEmpty: {
        msg: 'Stock cannot be empty!'
      },
    //   len: {
    //     args: [5, 500],
    //     msg: 'Stock must be between 5 and 500 characters'
    // }
     },
    }, 
    description: {
     type: DataTypes.STRING,
     allowNull: false,
     validate: {
      notEmpty: {
        msg: 'Description cannot be empty!'
      }
     }

    }, 
    imgUrl: {
     type: DataTypes.STRING,
     allowNull: false,
     validate: {
      notEmpty: {
        msg: 'imgUrl cannot be empty!'
      }
     }
    }, 
    CategoryId: {
     type: DataTypes.INTEGER,
     allowNull: false,
     validate: {
      notEmpty: {
        msg: 'CategoryId cannot be empty!'
      }
     }
    }, 
  }, {
    sequelize,
    modelName: 'Product',
  });
  return Product;
};