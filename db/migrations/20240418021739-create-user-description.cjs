'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('UserDescriptions', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      firstName: {
        type: Sequelize.STRING,
        allowNull: false,
        field: 'first_name'
      },
      lastName: {
        type: Sequelize.STRING,
        allowNull: false,
        field: 'last_name'
      },
      active_email: {
        type: Sequelize.STRING,
        allowNull: true,
        unique: true,
        field: 'active_email'
      },
      email: {
        type: Sequelize.STRING,
        allowNull: true
      },
      password: {
        type: Sequelize.STRING,
        allowNull: false
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
      userClientSideUUID: {
        type: Sequelize.UUID,
        allowNull: false,
        unique: false,
        field: 'user_client_side_uuid',
        references: {
          model: 'Users',
          key: 'client_side_uuid'
        },
      },
      roleClientSideUUID: {
        type: Sequelize.UUID,
        allowNull: false,
        unique: false,
        field: 'role_client_side_uuid',
        references: {
          model: 'Roles',
          key: 'client_side_uuid'
        },
      },
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('UserDescriptions');
  }
};
