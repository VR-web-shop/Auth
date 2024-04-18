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
    }
  }
  Permission.init({
    name: {
      type: DataTypes.STRING,
      primaryKey: true,
      allowNull: false,
    },
    createdAt: {
      type: DataTypes.DATE,
      field: 'created_at',
    },
    updatedAt: {
      type: DataTypes.DATE,
      field: 'updated_at',
    },
    definedBySystem: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      field: 'defined_by_system'
    }
  }, {
    sequelize,
    modelName: 'Permission',
  });
  return Permission;
};