'use strict';
const { DataTypes } = require('sequelize');
const sequelize = require('../../config/database');

module.exports = (sequelize, DataTypes) => {
  const transactionitem = sequelize.define('transactionItem', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER
      },
      transactionId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'transaction',
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
      quantitySold: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
          notNull: {
            msg: 'Quantity cannot be null'
          },
          notEmpty: {
            msg: 'Quantity cannot be empty'
          }
        }
      },
      unitPrice: {
        type: DataTypes.DECIMAL,
        allowNull: false,
        validate: {
          notNull: {
            msg: 'Unit price cannot be null'
          },
          notEmpty: {
            msg: 'Unit price cannot be empty'
          }
        }
      },
      subtotal: {
        type: DataTypes.DECIMAL,
        allowNull: false,
        validate: {
          notNull: {
            msg: 'Subtotal cannot be null'
          },
          notEmpty: {
            msg: 'Subtotal cannot be empty'
          }
        }
      },
      unitProfit: {
        type: DataTypes.DECIMAL,
        allowNull: false,
        validate: {
          notNull: {
            msg: 'Profit cannot be null'
          },
          notEmpty: {
            msg: 'Profit cannot be empty'
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
      modelName: 'transactionItem',
      tableName: 'transaction_item',
      underscored: true
    }
  );

  transactionitem.associate = (models) => {
    transactionitem.belongsTo(models.transaction, { foreignKey: 'transactionId', as: 'transaction' });
    transactionitem.belongsTo(models.product, { foreignKey: 'productId' });
    transactionitem.belongsTo(models.supplier, { foreignKey: 'supplierId' });
  };
  
  return transactionitem;
};