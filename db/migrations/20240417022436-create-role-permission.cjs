'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('RolePermissions', {
      clientSideUUID: {
        type: Sequelize.UUID,
        field: 'client_side_uuid',
        primaryKey: true
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        field: 'created_at',
        defaultValue: Sequelize.fn('now')
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        field: 'updated_at',
        defaultValue: Sequelize.fn('now')
      },
      roleClientSideUUID: {
        type: Sequelize.UUID,
        allowNull: false,
        field: 'role_client_side_uuid',
        references: {
          model: 'Roles',
          key: 'client_side_uuid'
        },
      },
      permissionName: {
        type: Sequelize.STRING,
        allowNull: false,
        field: 'permission_name',
        references: {
          model: 'Permissions',
          key: 'name'
        },
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('RolePermissions');
  }
};