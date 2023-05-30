'use strict';

import {Model} from 'sequelize';

interface UserAttributes{
  awsCognitoId:string,
  name:string,
  role:string,
  email:string
}

export enum UserRoles{
    TRABAJADORES = 'TRABAJADOR',
    CREADOR = 'CREADOR',
    
}

module.exports = (sequelize:any, DataTypes:any) => {
  class User extends Model<UserAttributes> implements UserAttributes {
    awsCognitoId!:string;
    name!:string;
    role!:string;
    email!:string;
    static associate(models:any) {
      // define association here
    }
  }
  User.init({
    awsCognitoId:{
      type:DataTypes.STRING,
      allowNull:false,
      primaryKey:true
    },
    name:{
      type:DataTypes.STRING,
      allowNull:false      
    },
    role:{
      type:DataTypes.STRING,
      allowNull:false,
      defaultValue:UserRoles.CREADOR
    },
    email:{
      type:DataTypes.STRING,
      allowNull:false,
      unique:true
    }
  }, {
    sequelize,
    modelName: 'User',
  });
  return User;
};