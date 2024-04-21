'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class RoleDescription extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      models.RoleDescription.belongsTo(models.Role, {
        foreignKey: 'role_client_side_uuid',
        targetKey: 'client_side_uuid',
      });
    }
  }
  RoleDescription.init({
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false
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
    role_client_side_uuid: {
      type: DataTypes.UUID,
      allowNull: false,
      field: 'role_client_side_uuid',
    }
  }, {
    sequelize,
    modelName: 'RoleDescription',
  });
  return RoleDescription;
};