'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Role extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      models.Role.hasMany(models.RoleDescription, {
        foreignKey: 'role_client_side_uuid',
        sourceKey: 'client_side_uuid',
      });
      models.Role.hasMany(models.RoleRemoved, {
        foreignKey: 'role_client_side_uuid',
        sourceKey: 'client_side_uuid',
      });
      models.Role.hasMany(models.UserDescription, {
        foreignKey: 'role_client_side_uuid',
        sourceKey: 'client_side_uuid',
      });
      models.Role.hasMany(models.RolePermission, {
        foreignKey: 'role_client_side_uuid',
        sourceKey: 'client_side_uuid',
      });
      models.Role.belongsToMany(models.User, {
        through: models.UserDescription,
        foreignKey: 'role_client_side_uuid',
        otherKey: 'user_client_side_uuid',
        as: 'users',
      });
      models.Role.belongsToMany(models.Permission, {
        through: models.RolePermission,
        foreignKey: 'role_client_side_uuid',
        otherKey: 'permission_name',
        as: 'permissions',
      });
    }
  }
  Role.init({
    client_side_uuid: {
      type: DataTypes.STRING,
      field: 'client_side_uuid',
      primaryKey: true,
    },
    created_at: {
      type: DataTypes.DATE,
      field: 'created_at',
    },
    updated_at: {
      type: DataTypes.DATE,
      field: 'updated_at',
    },
    defined_by_system: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
      field: 'defined_by_system'
    }
  }, {
    sequelize,
    modelName: 'Role',
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  });
  return Role;
};