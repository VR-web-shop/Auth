import { DataTypes } from 'sequelize';
import Database from './Database.js';
import Permission from './Permission.js';
import Role from './Role.js';

const RolePermission = Database.define("RolePermission", {
    uuid: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
    },
}, {
    underscored: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
});

RolePermission.belongsTo(Role, { foreignKey: 'role_name', targetKey: 'name' });
RolePermission.belongsTo(Permission, { foreignKey: 'permission_name', targetKey: 'name' });

Role.hasMany(RolePermission);
Permission.hasMany(RolePermission);

export default RolePermission;
