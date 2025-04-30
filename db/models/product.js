'use strict';
const { DataTypes } = require('sequelize');
const sequelize = require('../../config/database');

module.exports = (sequelize, DataTypes) => {
  const product = sequelize.define('product', {
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
      productImage: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: {
            msg: 'Product image cannot be null'
          },
          notEmpty: {
            msg: 'Product image cannot be empty'
          }
        }
      },
      productName: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: {
            msg: 'Product name cannot be null'
          },
          notEmpty: {
            msg: 'Product name cannot be empty'
          }
        }
      },
      productCategoryId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'category',
          key: 'id'
        }
      },
      brandId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'brand',
          key: 'id'
        }
      },
      modelTypeId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'modelType',
          key: 'id'
        }
      },
      minProfit: {
        type: DataTypes.DECIMAL,
        allowNull: false,
        validate: {
          notNull: {
            msg: 'Min profit cannot be null'
          },
          notEmpty: {
            msg: 'Min profit cannot be empty'
          }
        }
      },
      maxProfit: {
        type: DataTypes.DECIMAL,
        allowNull: false,
        validate: {
          notNull: {
            msg: 'Max profit cannot be null'
          },
          notEmpty: {
            msg: 'Max profit cannot be empty'
          }
        }
      },
      specification: {
        type: DataTypes.TEXT,
        allowNull: true
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: true
      },
      createdAt: {
        allowNull: false,
        type: DataTypes.DATE
      },
      updatedAt: {
        allowNull: false,
        type: DataTypes.DATE
      },
      deletedAt: {
        type: DataTypes.DATE,
        allowNull: true
      }
    },
    {
      paranoid: true, 
      freezeTableName: true,
      modelName: 'product',
      underscored: true
    }
  );

  product.associate = (models) => {
    product.belongsTo(models.brand, { foreignKey: 'brandId' });
    product.belongsTo(models.category, { foreignKey: 'productCategoryId' });
    product.belongsTo(models.modelType, { foreignKey: 'modelTypeId' });
    product.belongsTo(models.user, { foreignKey: 'sellerId' });
    product.hasMany(models.productSupplier, { foreignKey: 'productId', as: 'stocks' });
    product.hasMany(models.transactionItem, { foreignKey: 'productId' });
  };

  return product;
};