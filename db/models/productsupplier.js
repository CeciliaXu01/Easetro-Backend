'use strict';
const { DataTypes } = require('sequelize');
const sequelize = require('../../config/database');

module.exports = (sequelize, DataTypes) => {
  const productsupplier = sequelize.define('productSupplier', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER
      },
      sellerId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'user',
          key: 'id'
        }
      },
      productId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'product',
          key: 'id'
        }
      },
      supplierId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'supplier',
          key: 'id'
        }
      },
      capitalCost: {
        type: DataTypes.DECIMAL,
        allowNull: false,
        validate: {
          notNull: {
            msg: 'Capital cost cannot be null'
          },
          notEmpty: {
            msg: 'Capital cost cannot be empty'
          }
        }
      },
      stock: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
          notNull: {
            msg: 'Stock cannot be null'
          },
          notEmpty: {
            msg: 'Stock cannot be empty'
          }
        }
      },
      createdAt: {
        allowNull: false,
        type: DataTypes.DATE
      },
      updatedAt: {
        allowNull: false,
        type: DataTypes.DATE
      }
    },
    {
      freezeTableName: true,
      modelName: 'productSupplier',
      tableName: 'product_supplier',
      underscored: true
    }
  );

  productsupplier.associate = (models) => {
    productsupplier.belongsTo(models.product, { foreignKey: 'productId', as: 'product' });
    productsupplier.belongsTo(models.supplier, { foreignKey: 'supplierId' });
  };
  return productsupplier;
};