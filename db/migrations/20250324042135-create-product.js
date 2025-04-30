'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('product', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      seller_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'user',
          key: 'id'
        }
      },
      product_image: {
        type: Sequelize.STRING,
        allowNull: false
      },
      product_name: {
        type: Sequelize.STRING,
        allowNull: false
      },
      product_category_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'category',
          key: 'id'
        }
      },
      brand_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'brand',
          key: 'id'
        }
      },
      model_type_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'model_type',
          key: 'id'
        }
      },
      min_profit: {
        type: Sequelize.DECIMAL,
        allowNull: false
      },
      max_profit: {
        type: Sequelize.DECIMAL,
        allowNull: false
      },
      specification: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      description: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      created_at: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updated_at: {
        allowNull: false,
        type: Sequelize.DATE
      },
      deleted_at: {
        type: Sequelize.DATE,
        allowNull: true
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('product');
  }
};