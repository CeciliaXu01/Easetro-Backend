'use strict';
const { DataTypes } = require('sequelize');
const sequelize = require('../../config/database');

module.exports = (sequelize, DataTypes) => {
  const category = sequelize.define('category', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER
      },
      categoryName: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: {
          msg: 'Category already exists'
        },
        validate: {
          notNull: {
            msg: 'Category cannot be null'
          },
          notEmpty: {
            msg: 'Category cannot be empty'
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
      modelName: 'category',
      underscored: true
    }
  );

  category.associate = (models) => {
    category.hasMany(models.product, { foreignKey: 'productCategoryId' });
  };
  
  return category;
};