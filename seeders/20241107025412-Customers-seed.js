'use strict';

const { hashSync } = require('bcryptjs');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
      let data = require("../data/customers.json").map((e) => {
        delete e.id;
        e.password = hashSync(e.password, 10);
        e.createdAt = e.updatedAt = new Date();
        return e;
      });
      // console.log(data);
      await queryInterface.bulkInsert("Customers", data, {});
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
    */
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete("Customers", null, {});
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
  }
};
