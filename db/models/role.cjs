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
    }
  }
  Role.init({
    client_side_uuid: {
      type: DataTypes.STRING,
      field: 'client_side_uuid',
      primaryKey: true,
    },
    createdAt: {
      type: DataTypes.DATE,
      field: 'created_at',
    },
    updatedAt: {
      type: DataTypes.DATE,
      field: 'updated_at',
    }
  }, {
    sequelize,
    modelName: 'Role',
  });
  return Role;
};