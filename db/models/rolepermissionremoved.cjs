'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class RolePermissionRemoved extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      models.RolePermissionRemoved.belongsTo(models.RolePermission, {
        foreignKey: 'role_permission_client_side_uuid',
        targetKey: 'clientSideUUID'
      });
    }
  }
  RolePermissionRemoved.init({
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
    role_permission_client_side_uuid: {
      type: DataTypes.UUID,
      allowNull: false,
      field: 'role_permission_client_side_uuid',
    }
  }, {
    sequelize,
    modelName: 'RolePermissionRemoved',
  });
  return RolePermissionRemoved;
};