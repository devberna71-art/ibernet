'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('Subsidios', 'percentagem', {
      type: Sequelize.DECIMAL(5, 2),
      allowNull: true,
      defaultValue: 0.00,
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('Subsidios', 'percentagem');
  }
};