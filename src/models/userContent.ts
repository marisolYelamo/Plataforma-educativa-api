import sequelize from "../db";

import { IStudentProgression } from "../interfaces/studentProgression.interface";

import {
  Model,
  DataTypes,
  CreationOptional,
  InferAttributes,
  InferCreationAttributes
} from "sequelize";

class UserContent
  extends Model<
    InferAttributes<UserContent>,
    InferCreationAttributes<UserContent>
  >
  implements IStudentProgression {
  declare id: CreationOptional<number>;

  declare readonly updatedAt: CreationOptional<Date>;
  declare readonly createdAt: CreationOptional<Date>;
}

UserContent.init(
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
    tableName: "user_content",
    sequelize
  }
);

export default UserContent;
