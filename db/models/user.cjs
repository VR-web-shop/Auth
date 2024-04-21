'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      models.User.hasMany(models.UserDescription, {
        foreignKey: 'user_client_side_uuid',
        sourceKey: 'client_side_uuid',
        unique: false,
      });
      models.User.hasMany(models.UserRemoved, {
        foreignKey: 'user_client_side_uuid',
        sourceKey: 'client_side_uuid',
      });
      models.User.belongsToMany(models.Role, {
        through: models.UserDescription,
        foreignKey: 'user_client_side_uuid',
        otherKey: 'role_client_side_uuid',
        as: 'roles',
      });
    }
  }
  User.init({
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
    }
  }, {
    sequelize,
    modelName: 'User',
  });
  return User;
};