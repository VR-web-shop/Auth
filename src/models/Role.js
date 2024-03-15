import { DataTypes } from 'sequelize';
import Database from './Database.js';

export const ROLES = {
    ADMIN: 'admin',
    MEMBER: 'member'
};

export const DEFAULT_ROLE = ROLES.MEMBER;

const Role = Database.define("Role", {
    name: {
        type: DataTypes.STRING,
        allowNull: false, 
        primaryKey: true
    },
});

export default Role;
