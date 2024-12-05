'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
     await queryInterface.addColumn('Orders', 'CustomerId', {
       type: Sequelize.INTEGER,
          references: {
            model: 'Customers',
            key: 'id'
          },
          onUpdate: 'CASCADE',
          onDelete: 'CASCADE'
        }
      )
  },
  
  async down (queryInterface, Sequelize) {
    await queryInterface.removeColumn('Orders', 'CustomerId');
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
  }
};
