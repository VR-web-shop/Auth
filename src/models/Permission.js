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
        SHOW_PERMISSIONS: { name: 'users:show:permissions', description: 'Show a user\'s permissions' },
        INDEX: { name: 'users:index', description: 'List all users' },
        CREATE: { name: 'users:create', description: 'Create a user' },
        UPDATE: { name: 'users:update', description: 'Update a user' },
        DELETE: { name: 'users:delete', description: 'Delete a user' },
    },
    ROLES: {
        SHOW: { name: 'roles:show', description: 'Show a role' },
        SHOW_PERMISSIONS: { name: 'roles:show:permissions', description: 'Show a role\'s permissions' },
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
    PRODUCTS: {
        SHOW: { name: 'products:show', description: 'Show a product' },
        INDEX: { name: 'products:index', description: 'List all products' },
        CREATE: { name: 'products:create', description: 'Create a product' },
        UPDATE: { name: 'products:update', description: 'Update a product' },
        DELETE: { name: 'products:delete', description: 'Delete a product' },
    },
    PRODUCT_ENTITY: {
        SHOW: { name: 'product-entities:show', description: 'Show a product entity' },
        INDEX: { name: 'product-entities:index', description: 'List all product entities' },
        CREATE: { name: 'product-entities:create', description: 'Create a product entity' },
        UPDATE: { name: 'product-entities:update', description: 'Update a product entity' },
        DELETE: { name: 'product-entities:delete', description: 'Delete a product entity' },
        SHIP: { name: 'product-entities:ship', description: 'Ship a product entity' },
        DISCARD: { name: 'product-entities:discard', description: 'Discard a product entity' },
        RETURN: { name: 'product-entities:return', description: 'Return a product entity' },
    },
    PRODUCT_ENTITY_STATE: {
        SHOW: { name: 'product-entity-states:show', description: 'Show a product entity state' },
        INDEX: { name: 'product-entity-states:index', description: 'List all product entity states' },
    },
    ADMIN_CLIENT: {
        ACCESS: { name: 'admin:client:access', description: 'Access the admin client' },
    },
    SCENES_EDITOR_CLIENT: {
        ACCESS: { name: 'scenes-editor:client:access', description: 'Access the scenes editor client' },
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
    },
    is_user_defined: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true
    }
}, {
    underscored: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
});

export default Permission;
