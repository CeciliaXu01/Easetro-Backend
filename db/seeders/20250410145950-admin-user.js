'use strict';
const bcrypt = require('bcrypt');

module.exports = {
  up: (queryInterface, Sequelize) => {
    let password = process.env.ADMIN_PASSWORD;
    const hashPassword = bcrypt.hashSync(password, 10);
    return queryInterface.bulkInsert('user', [
      {
        user_role: 'admin',
        user_name: 'Anonym',
        store_name: '-',
        city: '-',
        email: process.env.ADMIN_EMAIL,
        password: hashPassword,
        phone_number: '-',
        created_at: new Date(),
        updated_at: new Date(),
      },
    ]);
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('user', { user_role: 'admin' }, {});
  }
};