'use strict';
const { DataTypes } = require('sequelize');
const sequelize = require('../../config/database');

module.exports = (sequelize, DataTypes) => {
  const modelType = sequelize.define('modelType', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER
      },
      modelTypeName: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: {
          msg: 'Model/type already exists'
        },
        validate: {
          notNull: {
            msg: 'Model/type cannot be null'
          },
          notEmpty: {
            msg: 'Model/type cannot be empty'
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
      modelName: 'modelType',
      tableName: 'model_type',
      underscored: true
    }
  );

  modelType.associate = (models) => {
    modelType.hasMany(models.product, { foreignKey: 'modelTypeId' });
  };
  
  return modelType;
};