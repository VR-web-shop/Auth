'use strict';
const bcrypt = require('bcrypt');
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class UserDescription extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      models.UserDescription.belongsTo(models.User, {
        foreignKey: 'user_client_side_uuid',
        targetKey: 'client_side_uuid'
      });
      models.UserDescription.belongsTo(models.Role, {
        foreignKey: 'role_client_side_uuid',
        targetKey: 'client_side_uuid'
      });
    }
  }
  UserDescription.init({
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER
    },
    first_name: {
      type: DataTypes.STRING,
      allowNull: false,
      field: 'first_name'
    },
    last_name: {
      type: DataTypes.STRING,
      allowNull: false,
      field: 'last_name'
    },
    active_email: {
      type: DataTypes.STRING,
      allowNull: true,
      unique: true,
      field: 'active_email'
    },
    email: {
      type: DataTypes.STRING,
      allowNull: true
    },
    password: {
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
    user_client_side_uuid: {
      type: DataTypes.UUID,
      allowNull: false,
      unique: false
    },
    role_client_side_uuid: {
      type: DataTypes.UUID,
      allowNull: false,
      unique: false,
    },
  }, {
    sequelize,
    modelName: 'UserDescription',
    hooks: {
      beforeCreate: async (userDescription) => {
        userDescription.password = await bcrypt.hash(userDescription.password, 10);
      },
      beforeUpdate: async (userDescription) => {
        if (userDescription.changed('password')) {
          userDescription.password = await bcrypt.hash(userDescription.password, 10);
        }
      }
    },
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  });

  UserDescription.verifyPassword = async (user, password) => {
    if (!password) throw new Error('Password is required');    
    if (!user) throw new Error('User is required');
    if (!user.password) throw new Error('User.password is missing');
    return await bcrypt.compare(password, user.password);
  }

  return UserDescription;
};
