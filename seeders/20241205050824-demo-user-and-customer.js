const bcrypt = require('bcryptjs');
const users = require('../data/users.json');
const customers = require('../data/customers.json');

module.exports = {
  async up(queryInterface, Sequelize) {
    // Hash passwords before inserting into Users
    const hashedUsers = users.map(user => ({
      ...user,
      password: bcrypt.hashSync(user.password, 10),
      createdAt: new Date(),
      updatedAt: new Date(),
    }));

    // Insert users
    await queryInterface.bulkInsert('Users', hashedUsers, {});

    // Add createdAt and updatedAt to customers
    const customerData = customers.map(customer => ({
      ...customer,
      createdAt: new Date(),
      updatedAt: new Date(),
    }));

    // Insert customers
    await queryInterface.bulkInsert('Customers', customerData, {});
  },

  async down(queryInterface, Sequelize) {
    // Remove all customers and users
    await queryInterface.bulkDelete('Customers', null, {});
    await queryInterface.bulkDelete('Users', null, {});
  },
};
