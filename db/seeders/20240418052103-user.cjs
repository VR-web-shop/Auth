'use strict';
const bcrypt = require('bcrypt');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    const adminEmail = process.env.ADMIN_EMAIL
    const adminPassword = process.env.ADMIN_PASSWORD
    const adminFirstName = process.env.ADMIN_FIRST_NAME
    const adminLastName = process.env.ADMIN_LAST_NAME

    const password = await bcrypt.hash(adminPassword, 10);
    
    await queryInterface.bulkInsert('Users', [
      { client_side_uuid: 'aa1b1b1b-1b1b-1b1b-1b1b-1b1b1b1b1b1b' },
      { client_side_uuid: 'aa2b1b1b-1b1b-1b1b-1b1b-1b1b1b1b1b1b' },
      { client_side_uuid: 'aa3b1b1b-1b1b-1b1b-1b1b-1b1b1b1b1b1b' },
      { client_side_uuid: 'aa4b1b1b-1b1b-1b1b-1b1b-1b1b1b1b1b1b' }
    ]);
    await queryInterface.bulkInsert('UserDescriptions', [
      { 
        id: 1,
        email: adminEmail,
        active_email: adminEmail,
        password,
        first_name: adminFirstName,
        last_name: adminLastName,
        user_client_side_uuid: 'aa1b1b1b-1b1b-1b1b-1b1b-1b1b1b1b1b1b', 
        role_client_side_uuid: 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa'
      },
      { 
        id: 2,
        email: 'member@example.com',
        active_email: 'member@example.com', 
        password, 
        first_name: 'Jane',
        last_name: 'Doe',
        user_client_side_uuid: 'aa2b1b1b-1b1b-1b1b-1b1b-1b1b1b1b1b1b',
        role_client_side_uuid: 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb'
      },
      { 
        id: 3,
        email: 'productManager@example.com', 
        active_email: 'productManager@example.com', 
        password, 
        first_name: 'John',
        last_name: 'Doe',
        user_client_side_uuid: 'aa3b1b1b-1b1b-1b1b-1b1b-1b1b1b1b1b1b',
        role_client_side_uuid: 'cccccccc-cccc-cccc-cccc-cccccccccccc'
      },
      { 
        id: 4,
        email: 'productMember@example.com',
        active_email: 'productMember@example.com',  
        password, 
        first_name: 'Jane',
        last_name: 'Doe',
        user_client_side_uuid: 'aa4b1b1b-1b1b-1b1b-1b1b-1b1b1b1b1b1b',
        role_client_side_uuid: 'dddddddd-dddd-dddd-dddd-dddddddddddd'
      }
    ]);
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('UserDescriptions', null, {});
    await queryInterface.bulkDelete('Users', null, {});
  }
};
