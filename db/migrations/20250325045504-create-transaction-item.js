'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('transaction_item', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      transaction_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'transaction',
          key: 'id'
        }
      },
      product_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'product',
          key: 'id'
        }
      },
      supplier_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'supplier',
          key: 'id'
        }
      },
      quantity_sold: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      unit_price: {
        type: Sequelize.DECIMAL,
        allowNull: false
      },
      subtotal: {
        type: Sequelize.DECIMAL,
        allowNull: false
      },
      unit_profit: {
        type: Sequelize.DECIMAL,
        allowNull: false
      },
      created_at: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updated_at: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('transaction_item');
  }
};