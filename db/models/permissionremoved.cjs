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
        targetKey: 'name',
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
    deleted_at: {
      allowNull: false,
      type: DataTypes.DATE,
      field: 'deleted_at',
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
    permission_name: {
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