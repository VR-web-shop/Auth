import ModelArgumentError from './errors/ModelArgumentError.js';
import { DataTypes } from 'sequelize';
import Database from './Database.js';
import Role from './Role.js';
import bcrypt from 'bcrypt';

const User = Database.define("User", {
    uuid: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false, 
        unique: true
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false
    },
}, {
    underscored: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    hooks: {
        beforeCreate: hashPassword,
        beforeUpdate: hashPassword
    }
});

User.belongsTo(Role, { foreignKey: 'role_name', targetKey: 'name' });
Role.hasMany(User);

/**
 * @function hashPassword
 * @description Hash the password
 * @param {User} user
 * @returns {Promise<void>}
 */
async function hashPassword(user) {
    user.password = await bcrypt.hash(user.password, 10);
}

/**
 * @function verifyPassword
 * @description Verify the password
 * @param {string} password
 * @param {User} user
 * @returns {Promise<boolean>}
 * @throws {ModelArgumentError}
 */
export async function verifyPassword(password, user) {
    if (!password) {
        throw new ModelArgumentError('Password is required');
    }

    if (!user) {
        throw new ModelArgumentError('User is required');
    }

    if (!user.password) {
        throw new ModelArgumentError('User.password is missing');
    }

    return await bcrypt.compare(password, user.password);
}

export default User;
