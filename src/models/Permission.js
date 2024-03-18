import { DataTypes } from 'sequelize';
import Database from './Database.js';

export const PERMISSIONS = {
    AUTH: {
        SHOW: { name: 'auth:users:show', description: 'Show the authenticated user' },
        UPDATE: { name: 'auth:users:update', description: 'Update the authenticated user' },
        DELETE: { name: 'auth:users:delete', description: 'Delete the authenticated user' },
    },
    USERS: {
        SHOW: { name: 'users:show', description: 'Show a user' },
        INDEX: { name: 'users:index', description: 'List all users' },
        CREATE: { name: 'users:create', description: 'Create a user' },
        UPDATE: { name: 'users:update', description: 'Update a user' },
        DELETE: { name: 'users:delete', description: 'Delete a user' },
    },
    ROLES: {
        SHOW: { name: 'roles:show', description: 'Show a role' },
        INDEX: { name: 'roles:index', description: 'List all roles' },
        CREATE: { name: 'roles:create', description: 'Create a role' },
        UPDATE: { name: 'roles:update', description: 'Update a role' },
        DELETE: { name: 'roles:delete', description: 'Delete a role' },
    },
    PERMISSIONS: {
        SHOW: { name: 'permissions:show', description: 'Show a permission' },
        INDEX: { name: 'permissions:index', description: 'List all permissions' },
        CREATE: { name: 'permissions:create', description: 'Create a permission' },
        UPDATE: { name: 'permissions:update', description: 'Update a permission' },
        DELETE: { name: 'permissions:delete', description: 'Delete a permission' },
    },
};

const Permission = Database.define("Permission", {
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

export default Permission;
