'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Permission extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      models.Permission.hasMany(models.PermissionDescription, {
        foreignKey: 'permission_name',
        sourceKey: 'name',
      });
      models.Permission.hasMany(models.PermissionRemoved, {
        foreignKey: 'permission_name',
        sourceKey: 'name',
      });
      models.Permission.belongsToMany(models.Role, {
        through: models.RolePermission,
        foreignKey: 'permission_name',
        otherKey: 'role_client_side_uuid',
        as: 'roles',
      });
    }
  }
  Permission.init({
    name: {
      type: DataTypes.STRING,
      primaryKey: true,
      allowNull: false,
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
    modelName: 'Permission',
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  });
  return Permission;
};