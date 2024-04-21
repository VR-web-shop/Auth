'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class RolePermission extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      models.RolePermission.belongsTo(models.Role, {
        foreignKey: 'role_client_side_uuid',
        targetKey: 'client_side_uuid',
      });
      models.RolePermission.belongsTo(models.Permission, {
        foreignKey: 'permission_name',
        targetKey: 'name',
      });
      models.RolePermission.hasMany(models.RolePermissionRemoved, {
        foreignKey: 'role_permission_client_side_uuid',
        targetKey: 'client_side_uuid',
      });
    }
  }
  RolePermission.init({
    client_side_uuid: {
      type: DataTypes.UUID,
      field: 'client_side_uuid',
      primaryKey: true
    },
    created_at: {
      allowNull: false,
      type: DataTypes.DATE,
      field: 'created_at',
    },
    updated_at: {
      allowNull: false,
      type: DataTypes.DATE,
      field: 'updated_at',
    },
    role_client_side_uuid: {
      type: DataTypes.UUID,
      allowNull: false,
      field: 'role_client_side_uuid',
    },
    permission_name: {
      type: DataTypes.STRING,
      allowNull: false,
      field: 'permission_name',
    }
  }, {
    sequelize,
    modelName: 'RolePermission',
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  });
  return RolePermission;
};