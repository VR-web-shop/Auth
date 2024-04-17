'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class PermissionRemoved extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      models.PermissionRemoved.belongsTo(models.Permission, {
        foreignKey: 'permission_name',
        targetKey: 'name'
      });
    }
  }
  PermissionRemoved.init({
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER
    },
    deletedAt: {
      allowNull: false,
      type: DataTypes.DATE,
      field: 'deleted_at',
    },
    createdAt: {
      allowNull: false,
      type: DataTypes.DATE,
      field: 'created_at',
    },
    updatedAt: {
      allowNull: false,
      type: DataTypes.DATE,
      field: 'updated_at',
    },
    permissionName: {
      type: DataTypes.STRING,
      allowNull: false,
      field: 'permission_name',
    }
  }, {
    sequelize,
    modelName: 'PermissionRemoved',
  });
  return PermissionRemoved;
};