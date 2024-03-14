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
    hooks: {
        beforeCreate: hashPassword,
        beforeUpdate: hashPassword
    }
});

User.belongsTo(Role, { 
    foreignKey: { 
        name: 'title',
        allowNull: false 
    }
});
Role.hasMany(User);

Database.sync().then(() => {
    console.log('User table created successfully!');
}).catch((error) => {
    console.error('Unable to create table : ', error);
});

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
 */
export async function verifyPassword(password, user) {
    return await bcrypt.compare(password, user.password);
}

export default User;
