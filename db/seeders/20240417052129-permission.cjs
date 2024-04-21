'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    const data = require('../../data/permissions.json');
    const permissions = []
    const permissionDescriptions = []

    data.forEach(async permission => {        
      const { name, description } = permission;
      permissions.push({ name, defined_by_system: true});
      permissionDescriptions.push({ permission_name: name, description });
    });

    await queryInterface.bulkInsert('Permissions', permissions);
    await queryInterface.bulkInsert('PermissionDescriptions', permissionDescriptions);
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('PermissionDescriptions', null, {});
    await queryInterface.bulkDelete('Permissions', null, {});
  }
};
