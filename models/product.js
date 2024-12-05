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
      if (this.stock < 5) {
        status = "Stock is less than 5"
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
            msg: 'Mohon masukkan nama produk',
          },
        },
      },
      price: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
          notNull: {
            msg: 'Mohon masukkan harga produk',
          },
          isInt: {
            msg: 'Mohon masukkan harga produk sebagai angka',
          },
          min: {
            args: [0],
            msg: 'Harga produk tidak bisa negatif',
          },
        },
      },
      stock: {
        type: DataTypes.INTEGER,
      },
      description: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: {
            msg: 'Please provide a description for the product.',
          },
          notEmpty: {
            msg: 'Mohon masukkan deskripsi produk',
          },
        },
      },
      imageURL: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: {
            msg: 'Mohon masukkan link foto produk.',
          },
          notEmpty: {
            msg: 'Mohon masukkan link foto produk',
          },
          isUrl: {
            msg: 'Mohon pastikan link foto produk benar',
          },
        },
      },
      CategoryId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
          notNull: {
            msg: 'Mohon pilih kategori produk',
          },
          isInt: {
            msg: 'Mohon pilih kategori produk',
          },
        },
      },
    },
    {
      hooks: {
        beforeCreate: (product, options) => {
          // console.log(`hook trigger`);
          
          product.stock = 0;
        }
      },
      sequelize,
      modelName: 'Product',
    }
  );
  return Product;
};
