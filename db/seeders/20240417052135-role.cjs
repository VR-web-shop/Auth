'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    const uuid = require('uuid');
    const permissionData = require('../../data/permissions.json');
    const roleData = require('../../data/roles.json');
    const roles = []
    const roleDescriptions = []
    const rolePermissions = []

    roleData.forEach(async role => {        
      const { client_side_uuid, name, description, permissions } = role;
      
      permissions.forEach(permission => {
        const prefix = permission.split('.')[0];        
        
        permissionData.forEach(p => {
          const otherPrefix = p.name.split('.')[0];
          if (prefix === otherPrefix || prefix === '*') {
            rolePermissions.push({
              client_side_uuid: uuid.v4(),
              role_client_side_uuid: client_side_uuid,
              permission_name: p.name
            });
          }
        });
      });

      roles.push({ client_side_uuid });
      roleDescriptions.push({ role_client_side_uuid: client_side_uuid, name, description });      
    });

    await queryInterface.bulkInsert('Roles', roles);
    await queryInterface.bulkInsert('RoleDescriptions', roleDescriptions);
    await queryInterface.bulkInsert('RolePermissions', rolePermissions);
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('RolePermissions', null, {});
    await queryInterface.bulkDelete('RoleDescriptions', null, {});
    await queryInterface.bulkDelete('Roles', null, {});
  }
};
