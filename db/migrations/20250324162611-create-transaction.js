'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('transaction', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      user_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'user',
          key: 'id'
        }
      },
      sales_date: {
        type: Sequelize.DATEONLY,
        allowNull: false
      },
      buyer_name: {
        type: Sequelize.STRING,
        allowNull: false
      },
      buyer_phone_number: {
        type: Sequelize.STRING,
        allowNull: false
      },
      buyer_address: {
        type: Sequelize.STRING,
        allowNull: false
      },
      total_price: {
        type: Sequelize.DECIMAL,
        allowNull: false
      },
      total_profit: {
        type: Sequelize.DECIMAL,
        allowNull: false
      },
      payment_method: {
        type: Sequelize.ENUM('cash', 'e-wallet', 'transfer'),
        allowNull: false
      },
      transaction_status: {
        type: Sequelize.ENUM('canceled', 'completed', 'pending'),
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
    await queryInterface.dropTable('transaction');
  }
};