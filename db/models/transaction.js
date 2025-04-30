'use strict';
const { DataTypes } = require('sequelize');
const sequelize = require('../../config/database');

module.exports = (sequelize, DataTypes) => {
  const transaction = sequelize.define('transaction', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER
      },
      userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'user',
          key: 'id'
        }
      },
      salesDate: {
        type: DataTypes.DATEONLY,
        allowNull: false
      },
      buyerName: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: {
            msg: 'Buyer name cannot be null'
          },
          notEmpty: {
            msg: 'Buyer name cannot be empty'
          }
        }
      },
      buyerPhoneNumber: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: {
            msg: 'Buyer phone number cannot be null'
          },
          notEmpty: {
            msg: 'Buyer phone number cannot be empty'
          }
        }
      },
      buyerAddress: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: {
            msg: 'Buyer address cannot be null'
          },
          notEmpty: {
            msg: 'Buyer address cannot be empty'
          }
        }
      },
      totalPrice: {
        type: DataTypes.DECIMAL,
        allowNull: false,
        validate: {
          notNull: {
            msg: 'Total price cannot be null'
          },
          notEmpty: {
            msg: 'Total price cannot be empty'
          }
        }
      },
      totalProfit: {
        type: DataTypes.DECIMAL,
        allowNull: false,
        validate: {
          notNull: {
            msg: 'Total profit cannot be null'
          },
          notEmpty: {
            msg: 'Total profit cannot be empty'
          }
        }
      },
      paymentMethod: {
        type: DataTypes.ENUM('cash', 'e-wallet', 'transfer'),
        allowNull: false,
        validate: {
          notNull: {
            msg: 'Payment method cannot be null'
          },
          notEmpty: {
            msg: 'Payment method cannot be empty'
          }
        }
      },
      transactionStatus: {
        type: DataTypes.ENUM('canceled', 'completed', 'pending'),
        allowNull: false,
        validate: {
          notNull: {
            msg: 'Transaction status cannot be null'
          },
          notEmpty: {
            msg: 'Transaction status cannot be empty'
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
      modelName: 'transaction',
      underscored: true
    }
  );

  transaction.associate = (models) => {
    transaction.hasMany(models.transactionItem, { 
      foreignKey: 'transactionId',
      as: 'items' 
    });
  };
  
  return transaction;
};