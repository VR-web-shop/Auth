import { DataTypes } from 'sequelize';
import Database from './Database.js';

export const ROLES = {
    ADMIN: {
        name: 'admin',
        description: 'Administrator has full access to all resources.'
    },
    MEMBER: {
        name: 'member',
        description: 'Everyone can become a member by signing up. They have access to public authenticated resources.'
    }
};

export const DEFAULT_ROLE = ROLES.MEMBER.name;

const Role = Database.define("Role", {
    name: {
        type: DataTypes.STRING,
        allowNull: false, 
        primaryKey: true
    },
    description: {
        type: DataTypes.STRING,
        allowNull: false
    }
}, {
    underscored: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
});

export default Role;
