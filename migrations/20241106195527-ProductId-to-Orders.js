'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.addColumn('Orders', 'ProductId', {
     type: Sequelize.INTEGER,
     references: {
      model: 'Products',
      key: 'id'
     },
     onUpdate: 'CASCADE',
     onDelete: 'CASCADE'
    });
    /**
     * Add altering commands here.
    *
    * Example:
    * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
    */
  },
  
  async down (queryInterface, Sequelize) {
    await queryInterface.removeColumn('Orders', 'ProductId');
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
  }
};
