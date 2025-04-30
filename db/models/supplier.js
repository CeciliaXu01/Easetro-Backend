'use strict';
const { DataTypes } = require('sequelize');
const sequelize = require('../../config/database');

module.exports = (sequelize, DataTypes) => {
  const supplier = sequelize.define('supplier', {
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
      supplierName: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: {
          msg: 'Supplier already exists'
        },
        validate: {
          notNull: {
            msg: 'Supplier name cannot be null'
          },
          notEmpty: {
            msg: 'Supplier name cannot be empty'
          }
        }
      },
      pic: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: {
            msg: 'PIC cannot be null'
          },
          notEmpty: {
            msg: 'PIC cannot be empty'
          }
        }
      },
      phoneNumber: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: {
            msg: 'Phone number cannot be null'
          },
          notEmpty: {
            msg: 'Phone number cannot be empty'
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
      modelName: 'supplier',
      underscored: true
    }
  );

  supplier.associate = (models) => {
    supplier.hasMany(models.productSupplier, { foreignKey: 'supplierId' });
    supplier.hasMany(models.transactionItem, { foreignKey: 'supplierId' });
  };

  return supplier;
};