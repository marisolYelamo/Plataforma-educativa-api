import sequelize from "../db";

import { IUserRanking } from "../interfaces/ranking.interface";

import {
  Model,
  DataTypes,
  CreationOptional,
  InferAttributes,
  InferCreationAttributes
} from "sequelize";

class UserFeedback
  extends Model<
    InferAttributes<UserFeedback>,
    InferCreationAttributes<UserFeedback>
  >
  implements IUserRanking {
  declare id: CreationOptional<number>;
  declare ranking: number;
  declare ContentId: number;
  declare UserId: number;

  declare readonly updatedAt: CreationOptional<Date>;
  declare readonly createdAt: CreationOptional<Date>;
}

UserFeedback.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    ranking: {
      type: DataTypes.INTEGER,
      validate: {
        isIn: [[1, 2, 3]]
      }
    },
    ContentId: {
      type: DataTypes.INTEGER
    },
    UserId: {
      type: DataTypes.INTEGER
    },
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE
  },
  {
    tableName: "user_feedback",
    indexes: [
      {
        unique: true,
        fields: ["UserId", "ContentId"]
      }
    ],
    sequelize
  }
);

export default UserFeedback;
