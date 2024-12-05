'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Product extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Product.belongsTo(models.Category, {
        foreignKey: 'CategoryId',
        as: 'category',
      });

      Product.belongsToMany(models.Customer, {
        through: models.Order,
        foreignKey: 'ProductId',
        otherKey: 'CustomerId',
        as: 'customers',
      });

      Product.hasMany(models.Order, {
        foreignKey: 'ProductId',
        as: 'orders',
      });
    }
    showStatus() {
      let status = ""
      if (this.stock <= 5) {
        status = "Almost Sold Out"
      } else {
        status = "Ready"
      }
      return status
    }
  }
  Product.init(
    {
      name: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: {
            msg: 'Please provide the product name.',
          },
          notEmpty: {
            msg: 'Product name cannot be empty. Please input a valid name.',
          },
        },
      },
      price: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
          notNull: {
            msg: 'Please provide the price of the product.',
          },
          isInt: {
            msg: 'Price must be a whole number. Please input a valid price.',
          },
          min: {
            args: [0],
            msg: 'Price cannot be negative. Please input a valid price.',
          },
        },
      },
      stock: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
          notNull: {
            msg: 'Please specify the stock quantity.',
          },
          isInt: {
            msg: 'Stock must be a whole number. Please input a valid stock quantity.',
          },
          min: {
            args: [0],
            msg: 'Stock cannot be negative. Please input a valid stock quantity.',
          },
        },
      },
      description: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: {
            msg: 'Please provide a description for the product.',
          },
          notEmpty: {
            msg: 'Description cannot be empty. Please input a valid description.',
          },
        },
      },
      imageURL: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: {
            msg: 'Please provide a URL for the product image.',
          },
          notEmpty: {
            msg: 'Image URL cannot be empty. Please input a valid URL.',
          },
          isUrl: {
            msg: 'Image URL must be a valid URL. Please provide a correct URL.',
          },
        },
      },
      CategoryId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
          notNull: {
            msg: 'Please select a category for the product.',
          },
          isInt: {
            msg: 'CategoryId must be a whole number. Please provide a valid category.',
          },
        },
      },
    },
    {
      hooks: {
        beforeCreate: (product, options) => {
          product.stock = 0;
        }
      },
      sequelize,
      modelName: 'Product',
    }
  );
  return Product;
};
