import sequelize from "../db";

import {
  Model,
  DataTypes,
  CreationOptional,
  InferAttributes,
  InferCreationAttributes
} from "sequelize";
import { IResource } from "../interfaces/resource.interface";

class Resource
  extends Model<InferAttributes<Resource>, InferCreationAttributes<Resource>>
  implements IResource {
  declare id: CreationOptional<number>;
  declare link: string;
  declare title: string;
  declare moduleId: number;

  declare readonly createdAt: CreationOptional<Date>;
  declare readonly updatedAt: CreationOptional<Date>;
}

Resource.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    title: {
      type: new DataTypes.STRING(128),
      allowNull: false
    },
    link: {
      type: new DataTypes.STRING(256),
      allowNull: false
    },
    moduleId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE
  },
  {
    tableName: "resources",
    sequelize
  }
);

export default Resource;
