import sequelize from "../db";

import { IStudentProgression } from "../interfaces/studentProgression.interface";

import {
  Model,
  DataTypes,
  CreationOptional,
  InferAttributes,
  InferCreationAttributes
} from "sequelize";

class UserEntry
  extends Model<InferAttributes<UserEntry>, InferCreationAttributes<UserEntry>>
  implements IStudentProgression {
  declare id: CreationOptional<number>;
  declare UserId: number;
  declare ContentId: number;

  declare readonly updatedAt: CreationOptional<Date>;
  declare readonly createdAt: CreationOptional<Date>;
}

UserEntry.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    UserId: DataTypes.INTEGER,
    ContentId: DataTypes.INTEGER,
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE
  },
  {
    tableName: "user_entries",
    sequelize
  }
);

export default UserEntry;
