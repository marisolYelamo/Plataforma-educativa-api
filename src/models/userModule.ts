import sequelize from "../db";

import { IStudentProgression } from "../interfaces/studentProgression.interface";

import {
  Model,
  DataTypes,
  CreationOptional,
  InferAttributes,
  InferCreationAttributes
} from "sequelize";

class UserModule
  extends Model<
    InferAttributes<UserModule>,
    InferCreationAttributes<UserModule>
  >
  implements IStudentProgression {
  declare id: CreationOptional<number>;

  declare readonly createdAt: CreationOptional<Date>;
  declare readonly updatedAt: CreationOptional<Date>;
}

UserModule.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE
  },
  {
    tableName: "user_module",
    sequelize
  }
);

export default UserModule;
