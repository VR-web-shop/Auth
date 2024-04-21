'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class PermissionDescription extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      models.PermissionDescription.belongsTo(models.Permission, {
        foreignKey: 'permission_name',
        targetKey: 'name',
      });
    }
  }
  PermissionDescription.init({
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER
    },
    description: {
      type: DataTypes.STRING,
      allowNull: false
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
    modelName: 'PermissionDescription',
  });
  return PermissionDescription;
};