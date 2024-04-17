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
      });
      models.User.hasMany(models.UserRemoved, {
        foreignKey: 'user_client_side_uuid',
        sourceKey: 'client_side_uuid',
      });
    }
  }
  User.init({
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
    modelName: 'User',
  });
  return User;
};