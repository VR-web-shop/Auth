import { DataTypes } from 'sequelize';
import Database from './Database.js';

// Define the model
const Role = Database.define("Role", {
    title: DataTypes.STRING,
});

// Sync the table
Database.sync().then(() => {
    console.log('Role table created successfully!');
}).catch((error) => {
    console.error('Unable to create table : ', error);
});

/**
 * @function findDefault
 * @description Find the default role
 * @returns {Promise<Role>}
 */
export const defaultRole = async () => {
    return await Role.findOne({ where: { title: 'member' } });
}

export default Role;
