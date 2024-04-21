import _db from '../db/models/index.cjs';
import _data from './db_data.js';

export default async function(db=_db, data=_data) {
    const queryInterface = db.sequelize.getQueryInterface();
  
    const permissionModel = db.Permission
    await permissionModel.sync({ force: true });
    await permissionModel.bulkCreate(data.permissions);
  
    const permissionDescriptionModel = db.PermissionDescription
    await permissionDescriptionModel.sync({ force: true });
    // This is a workaround to remove the default unique constraints on the foreign keys
    await queryInterface.changeColumn("permissiondescriptions", "permission_name", { type: db.Sequelize.DataTypes.STRING, allowNull: false, unique: false });
    await permissionDescriptionModel.bulkCreate(data.permissionDescriptions);

    const permissionRemovedModel = db.PermissionRemoved
    await permissionRemovedModel.sync({ force: true });
    await permissionRemovedModel.bulkCreate(data.permissionRemoved);
  
    const roleModel = db.Role
    await roleModel.sync({ force: true });
    await roleModel.bulkCreate(data.roles);
  
    const roleDescriptionModel = db.RoleDescription
    await roleDescriptionModel.sync({ force: true });
    // This is a workaround to remove the default unique constraints on the foreign keys
    await queryInterface.changeColumn("roledescriptions", "role_client_side_uuid", { type: db.Sequelize.DataTypes.STRING, allowNull: false, unique: false });
    await roleDescriptionModel.bulkCreate(data.roleDescriptions);

    const roleRemovedModel = db.RoleRemoved
    await roleRemovedModel.sync({ force: true });
    await roleRemovedModel.bulkCreate(data.roleRemoved);
  
    const rolePermissionModel = db.RolePermission
    await rolePermissionModel.sync({ force: true });
    // This is a workaround to remove the default unique constraints on the foreign keys
    await queryInterface.changeColumn("rolepermissions", "role_client_side_uuid", { type: db.Sequelize.DataTypes.STRING, allowNull: false, unique: false });
    await queryInterface.changeColumn("rolepermissions", "permission_name", { type: db.Sequelize.DataTypes.STRING, allowNull: false, unique: false });
    await rolePermissionModel.bulkCreate(data.rolePermissions);

    const rolePermissionRemovedModel = db.RolePermissionRemoved
    await rolePermissionRemovedModel.sync({ force: true });
    await rolePermissionRemovedModel.bulkCreate(data.rolePermissionRemoved);
  
    const userModel = db.User
    await userModel.sync({ force: true });
    await userModel.bulkCreate(data.users);
  
    const userDescriptionModel = db.UserDescription
    await userDescriptionModel.sync({ force: true });
    // This is a workaround to remove the default unique constraints on the foreign keys
    await queryInterface.changeColumn("userdescriptions", "user_client_side_uuid", { type: db.Sequelize.DataTypes.STRING, allowNull: false, unique: false });
    await queryInterface.changeColumn("userdescriptions", "role_client_side_uuid", { type: db.Sequelize.DataTypes.STRING, allowNull: false, unique: false });
    await userDescriptionModel.bulkCreate(data.userDescriptions);
  
    const userRemovedModel = db.UserRemoved
    await userRemovedModel.sync({ force: true });
    await userRemovedModel.bulkCreate(data.userRemoved);

    return {
        db,
        data
    }
}
