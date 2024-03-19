import { DataTypes } from 'sequelize';
import Database from './Database.js';
import { PERMISSIONS } from './Permission.js';

export const ROLES = {
    ADMIN: {
        name: 'Super Administrator',
        description: 'Super Administrator has full access to all system permissions.',
        permissions: ['*']
    },
    USER_ADMIN: {
        name: 'User Administrator',
        description: 'User Administrator has access to user management permissions.',
        permissions: [
            PERMISSIONS.AUTH.SHOW.name,
            PERMISSIONS.AUTH.UPDATE.name,
            PERMISSIONS.AUTH.DELETE.name,
            PERMISSIONS.USERS.SHOW.name,
            PERMISSIONS.USERS.SHOW_PERMISSIONS.name,
            PERMISSIONS.USERS.INDEX.name,
            PERMISSIONS.USERS.CREATE.name,
            PERMISSIONS.USERS.UPDATE.name,
            PERMISSIONS.USERS.DELETE.name,
            PERMISSIONS.ROLES.SHOW.name,
            PERMISSIONS.ROLES.SHOW_PERMISSIONS.name,
            PERMISSIONS.ROLES.INDEX.name,
            PERMISSIONS.ROLES.CREATE.name,
            PERMISSIONS.ROLES.UPDATE.name,
            PERMISSIONS.ROLES.DELETE.name,
            PERMISSIONS.PERMISSIONS.SHOW.name,
            PERMISSIONS.PERMISSIONS.INDEX.name,
            PERMISSIONS.PERMISSIONS.CREATE.name,
            PERMISSIONS.PERMISSIONS.UPDATE.name,
            PERMISSIONS.PERMISSIONS.DELETE.name,
            PERMISSIONS.ADMIN_CLIENT.ACCESS.name,
        ]
    },
    PRODUCT_MANAGER: {
        name: 'Product Manager',
        description: 'Product Manager has access to product management permissions.',
        permissions: [
            PERMISSIONS.AUTH.SHOW.name,
            PERMISSIONS.AUTH.UPDATE.name,
            PERMISSIONS.AUTH.DELETE.name,
            PERMISSIONS.PRODUCTS.SHOW.name,
            PERMISSIONS.PRODUCTS.INDEX.name,
            PERMISSIONS.PRODUCTS.CREATE.name,
            PERMISSIONS.PRODUCTS.UPDATE.name,
            PERMISSIONS.PRODUCTS.DELETE.name,
            PERMISSIONS.PRODUCT_ENTITY.SHOW.name,
            PERMISSIONS.PRODUCT_ENTITY.INDEX.name,
            PERMISSIONS.PRODUCT_ENTITY.CREATE.name,
            PERMISSIONS.PRODUCT_ENTITY.UPDATE.name,
            PERMISSIONS.PRODUCT_ENTITY.DELETE.name,
            PERMISSIONS.PRODUCT_ENTITY.SHIP.name,
            PERMISSIONS.PRODUCT_ENTITY.DISCARD.name,
            PERMISSIONS.PRODUCT_ENTITY.RETURN.name,
            PERMISSIONS.PRODUCT_ENTITY_STATE.SHOW.name,
            PERMISSIONS.PRODUCT_ENTITY_STATE.INDEX.name,
            PERMISSIONS.ADMIN_CLIENT.ACCESS.name,
        ]
    },
    PRODUCT_EMPLOYEE: {
        name: 'Product Employee',
        description: 'Product Employee has access to product entity management permissions.',
        permissions: [
            PERMISSIONS.AUTH.SHOW.name,
            PERMISSIONS.AUTH.UPDATE.name,
            PERMISSIONS.AUTH.DELETE.name,
            PERMISSIONS.PRODUCTS.SHOW.name,
            PERMISSIONS.PRODUCTS.INDEX.name,
            PERMISSIONS.PRODUCT_ENTITY.SHOW.name,
            PERMISSIONS.PRODUCT_ENTITY.INDEX.name,
            PERMISSIONS.PRODUCT_ENTITY.SHIP.name,
            PERMISSIONS.PRODUCT_ENTITY.DISCARD.name,
            PERMISSIONS.PRODUCT_ENTITY.RETURN.name,
            PERMISSIONS.PRODUCT_ENTITY_STATE.SHOW.name,
            PERMISSIONS.PRODUCT_ENTITY_STATE.INDEX.name,
            PERMISSIONS.PRODUCT_ENTITY_STATE.SHOW.name,
            PERMISSIONS.PRODUCT_ENTITY_STATE.INDEX.name,
            PERMISSIONS.ADMIN_CLIENT.ACCESS.name,
        ]
    },
    MEMBER: {
        name: 'Customer',
        description: 'Everyone can become a customer by signing up. They have access to public authenticated resources.',
        permissions: [
            PERMISSIONS.AUTH.SHOW.name,
            PERMISSIONS.AUTH.UPDATE.name,
            PERMISSIONS.AUTH.DELETE.name,
        ]
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

export default Role;
