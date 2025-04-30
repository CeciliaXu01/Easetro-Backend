'use strict';
module.exports = (sequelize, DataTypes) => {
  const brand = sequelize.define('brand', {
      id: {
          allowNull: false,
          autoIncrement: true,
          primaryKey: true,
          type: DataTypes.INTEGER
      },
      brandName: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: {
          msg: 'Brand already exists'
        },
        validate: {
          notNull: {
            msg: 'Brand name cannot be null'
          },
          notEmpty: {
            msg: 'Brand name cannot be empty'
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
        modelName: 'brand',
        underscored: true
    }
  );

  brand.associate = (models) => {
    brand.hasMany(models.product, { foreignKey: 'brandId' });
  };

  return brand;
};
