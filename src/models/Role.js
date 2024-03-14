import { DataTypes } from 'sequelize';
import Database from './Database.js';

const ROLES = {
    ADMIN: 'admin',
    MEMBER: 'member',
    GUEST: 'guest'
};

const Role = Database.define("Role", {
    title: {
        type: DataTypes.STRING,
        allowNull: false, 
        primaryKey: true
    },
});

Database.sync().then(() => {
    console.log('Role table created successfully!');
    Object.keys(ROLES).forEach((role) => {
        Role.findOrCreate({ where: { title: ROLES[role] } });
    });
}).catch((error) => {
    console.error('Unable to create table : ', error);
});

/**
 * @function findDefault
 * @description Find the default role
 * @returns {Promise<Role>}
 */
export const defaultRole = async () => {
    return await Role.findOne({ where: { title: ROLES.MEMBER } });
}

export default Role;
