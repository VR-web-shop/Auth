import { DataTypes } from 'sequelize';
import Database from './Database.js';
import Role from './Role.js';
import bcrypt from 'bcrypt';

// Define the model
const User = Database.define("User", {
    username: DataTypes.STRING,
    password: DataTypes.STRING,
});

// Define relationships
User.belongsTo(Role);
Role.hasMany(User);

// Sync the table
Database.sync().then(() => {
    console.log('Role table created successfully!');
}).catch((error) => {
    console.error('Unable to create table : ', error);
});

/**
 * @function verifyPassword
 * @description Verify the password of a user
 * @param {string} password
 * @param {User} user
 * @returns {Promise<boolean>}
 */
export const verifyPassword = async (password, user) => {
    return await bcrypt.compare(password, user.password);
}

export default User;
