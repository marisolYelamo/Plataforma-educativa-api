import {
  Model,
  DataTypes,
  CreationOptional,
  InferAttributes,
  InferCreationAttributes
} from "sequelize";

import { IStudentProgression } from "../interfaces/studentProgression.interface";
import sequelize from "../db";

class UserTopic
  extends Model<InferAttributes<UserTopic>, InferCreationAttributes<UserTopic>>
  implements IStudentProgression {
  declare id: CreationOptional<number>;

  declare readonly updatedAt: CreationOptional<Date>;
  declare readonly createdAt: CreationOptional<Date>;
}

UserTopic.init(
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
    tableName: "user_topic",
    sequelize
  }
);

export default UserTopic;
