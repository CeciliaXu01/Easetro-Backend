'use strict';
const { DataTypes } = require('sequelize');
const bcrypt = require('bcrypt');
const sequelize = require('../../config/database');
const AppError = require('../../utils/appError');
const product = require('./product');

module.exports = (sequelize, DataTypes) => {
  const user = sequelize.define('user', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER
      },
      image: {
        type: DataTypes.STRING,
        allowNull: true
      },
      userRole: {
        type: DataTypes.ENUM('admin', 'store'),
        allowNull: false,
        validate: {
          notNull: {
            msg: 'User role cannot be null'
          },
          notEmpty: {
            msg: 'User role cannot be empty'
          }
        }
      },
      userName: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: {
            msg: 'Username cannot be null'
          },
          notEmpty: {
            msg: 'Username cannot be empty'
          }
        }
      },
      storeName: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: {
            msg: 'Store name cannot be null'
          },
          notEmpty: {
            msg: 'Store name cannot be empty'
          }
        }
      },
      city: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: {
            msg: 'City cannot be null'
          },
          notEmpty: {
            msg: 'City cannot be empty'
          }
        }
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: {
          msg: 'This email is already registered. Please input a different email'
        },
        validate: {
          notNull: {
            msg: 'Email cannot be null'
          },
          notEmpty: {
            msg: 'Email cannot be empty'
          },
          isEmail: {
            msg: 'Invalid email address'
          }
        }
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: {
            msg: 'Password cannot be null'
          },
          notEmpty: {
            msg: 'Password cannot be empty'
          }
        }
      },
      confirmPassword: {
        type: DataTypes.VIRTUAL,
        set(value) {
          if(this.password.length < 8) {
            throw new AppError(
              'Password must be at least 8 characters',
              400
            );
          }
          if(value === this.password) {
            const hashPassword = bcrypt.hashSync(value, 10);
            this.setDataValue('password', hashPassword);
          } else {
            throw new AppError('Password and confirm password must be the same', 400);
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
      },
      passwordChangedAt: {
        type: DataTypes.DATE,
        allowNull: true
      },
      deletedAt: {
        type: DataTypes.DATE,
        allowNull: true
      }
    }, 
    {
      paranoid: true, 
      freezeTableName: true,
      modelName: 'user',
      underscored: true
    }
  );

  user.associate = (models) => {
    user.hasMany(models.product, { foreignKey: 'sellerId' });
  };
  
  return user;
};