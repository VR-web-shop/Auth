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
        DELETE: { name: 'products:delete', description: 'Delete a product' },
        PUT: { name: 'products:put', description: 'Put a product' },
    },
    PRODUCT_ENTITY: {
        SHOW: { name: 'product-entities:show', description: 'Show a product entity' },
        INDEX: { name: 'product-entities:index', description: 'List all product entities' },
        DELETE: { name: 'product-entities:delete', description: 'Delete a product entity' },
        PUT: { name: 'product-entities:put', description: 'Put a product entity' },
        SHIP: { name: 'product-entities:ship', description: 'Ship a product entity' },
        DISCARD: { name: 'product-entities:discard', description: 'Discard a product entity' },
        RETURN: { name: 'product-entities:return', description: 'Return a product entity' },
    },
    PRODUCT_ENTITY_STATE: {
        SHOW: { name: 'product-entity-states:show', description: 'Show a product entity state' },
        INDEX: { name: 'product-entity-states:index', description: 'List all product entity states' },
        CREATE: { name: 'product-entity-states:create', description: 'Create a product entity state' },
    },
    PRODUCT_ORDER: {
        SHOW: { name: 'product-orders:show', description: 'Show a product order' },
        INDEX: { name: 'product-orders:index', description: 'List all product orders' },
        DELETE: { name: 'product-orders:delete', description: 'Delete a product order' },
        PUT: { name: 'product-orders:put', description: 'Put a product order' },
        SHIP: { name: 'product-orders:ship', description: 'Ship a product order' },
        CANCEL: { name: 'product-orders:cancel', description: 'Cancel a product order' },
        RETURN: { name: 'product-orders:return', description: 'Return a product order' },
    },
    PRODUCT_ORDER_ENTITY: {
        SHOW: { name: 'product-order-entities:show', description: 'Show a product order entity' },
        INDEX: { name: 'product-order-entities:index', description: 'List all product order entities' },
        DELETE: { name: 'product-order-entities:delete', description: 'Delete a product order entity' },
        PUT: { name: 'product-order-entities:put', description: 'Put a product order entity' },
    },
    PRODUCT_ORDER_STATE: {
        SHOW: { name: 'product-order-states:show', description: 'Show a product order state' },
        INDEX: { name: 'product-order-states:index', description: 'List all product order states' },
        CREATE: { name: 'product-order-states:create', description: 'Create a product order state' },
    },
    DELIVER_OPTION: {
        SHOW: { name: 'deliver-options:show', description: 'Show a deliver option' },
        INDEX: { name: 'deliver-options:index', description: 'List all deliver options' },
        DELETE: { name: 'deliver-options:delete', description: 'Delete a deliver option' },
        PUT: { name: 'deliver-options:put', description: 'Put a deliver option' },
    },
    PAYMENT_OPTION: {
        SHOW: { name: 'payment-options:show', description: 'Show a payment option' },
        INDEX: { name: 'payment-options:index', description: 'List all payment options' },
        DELETE: { name: 'payment-options:delete', description: 'Delete a payment option' },
        PUT: { name: 'payment-options:put', description: 'Put a payment option' },
    },
    VALUTA_SETTING: {
        SHOW: { name: 'valuta-settings:show', description: 'Show valuta settings' },
        INDEX: { name: 'valuta-settings:index', description: 'List all valuta settings' },
        DELETE: { name: 'valuta-settings:delete', description: 'Delete valuta settings' },
        PUT: { name: 'valuta-settings:put', description: 'Put valuta settings' },
    },
    CARTS: {
        INDEX: { name: 'shopping-cart:carts:index', description: 'List all carts in shopping cart system' },
        DELETE: { name: 'shopping-cart:carts:delete', description: 'Delete a cart in shopping cart system' },
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
