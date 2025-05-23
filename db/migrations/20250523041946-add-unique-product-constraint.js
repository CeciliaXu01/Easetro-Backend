'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.addConstraint('product', {
      fields: [ 'seller_id', 'product_name', 'product_category_id', 'brand_id', 'model_type_id'],
      type: 'unique',
      name: 'unique_product'
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.removeConstraint('product', 'unique_product');
  }
};
