import sequelize from "../db";
import { IUserChallenge } from "../interfaces/challenge.interface";

import {
  Model,
  DataTypes,
  CreationOptional,
  InferAttributes,
  InferCreationAttributes
} from "sequelize";

class UserChallenge
  extends Model<
    InferAttributes<UserChallenge>,
    InferCreationAttributes<UserChallenge>
  >
  implements IUserChallenge {
  declare id: CreationOptional<number>;
  declare score: number;
  declare ContentId: number;
  declare UserId: number;
  declare ChallengeId: string;
  declare tryNumber: CreationOptional<number>;

  declare readonly updatedAt: CreationOptional<Date>;
  declare readonly createdAt: CreationOptional<Date>;

  declare isApproved: CreationOptional<boolean>;
}

UserChallenge.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    score: {
      type: DataTypes.INTEGER
    },
    ContentId: {
      type: DataTypes.INTEGER
    },
    UserId: {
      type: DataTypes.INTEGER
    },
    ChallengeId: {
      type: DataTypes.STRING
    },
    isApproved: {
      type: DataTypes.VIRTUAL,
      get() {
        return this.get("score") >= 75;
      }
    },
    tryNumber: {
      type: DataTypes.INTEGER,
      defaultValue: 1
    },
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE
  },
  {
    tableName: "user_challenge",
    sequelize
  }
);

export default UserChallenge;
