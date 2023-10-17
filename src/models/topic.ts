import {
  Model,
  DataTypes,
  Association,
  InferAttributes,
  InferCreationAttributes,
  NonAttribute,
  CreationOptional,
  BelongsToManyCountAssociationsMixin,
  BelongsToManyGetAssociationsMixin
} from "sequelize";

import Content from "./content";
import Module from "./module";
import User from "./user";
import sequelize from "../db";
import { ITopic } from "../interfaces/topic.interfaces";
import { codeGenerator, sanitizeSlug } from "../helpers/utils";

class Topic
  extends Model<
    InferAttributes<Topic, { omit: "contents" | "users" | "module" }>,
    InferCreationAttributes<Topic>
  >
  implements ITopic {
  declare static associations: {
    contents: Association<Topic, Content>;
    users: Association<Topic, User>;
    module: Association<Topic, Module>;
  };
  declare id: CreationOptional<number>;
  declare span: CreationOptional<number>;
  declare slug: CreationOptional<string>;
  declare title: string;
  declare moduleId: number;
  declare visibility: CreationOptional<boolean>;

  declare readonly contents: NonAttribute<Content[]>;
  declare readonly users: NonAttribute<User[]>;
  declare readonly module: NonAttribute<Module>;

  declare readonly createdAt: CreationOptional<Date>;
  declare readonly updatedAt: CreationOptional<Date>;

  declare countUsers: BelongsToManyCountAssociationsMixin;
  declare getUsers: BelongsToManyGetAssociationsMixin<User>;
}

Topic.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    span: {
      type: DataTypes.INTEGER,
      validate: { isInt: true, isNumeric: true },
      defaultValue: 0
    },
    title: {
      type: new DataTypes.STRING(128),
      allowNull: false,
      validate: {
        notEmpty: true
      }
    },
    slug: {
      type: DataTypes.STRING,
      unique: true
    },
    moduleId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    visibility: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE
  },
  {
    tableName: "topics",
    sequelize
  }
);

Topic.beforeCreate((topic) => {
  const slugBase = topic.slug ? topic.slug : topic.title;
  const code = codeGenerator();
  topic.slug = sanitizeSlug(`${slugBase}-${code}`);
});

Topic.beforeUpdate((topic) => {
  const updateSlug = topic.previous("title") !== topic.title;
  if (updateSlug) {
    const code = codeGenerator();
    topic.setDataValue("slug", sanitizeSlug(`${topic.title}-${code}`));
  }
});

export default Topic;
