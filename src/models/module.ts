import {
  Model,
  DataTypes,
  Association,
  InferAttributes,
  InferCreationAttributes,
  CreationOptional,
  NonAttribute,
  BelongsToManyCountAssociationsMixin,
  BelongsToManyGetAssociationsMixin
} from "sequelize";

import sequelize from "../db";
import Topic from "./topic";
import Resource from "./resources";
import User from "./user";
import { IModule } from "../interfaces/module.interfaces";
import { sanitizeSlug } from "../helpers/utils";

class Module
  extends Model<
    InferAttributes<Module, { omit: "users" | "resources" | "topics" }>,
    InferCreationAttributes<Module>
  >
  implements IModule {
  declare static associations: {
    topics: Association<Module, Topic>;
    resources: Association<Module, Resource>;
    users: Association<Module, User>;
  };
  declare id: CreationOptional<number>;
  declare span: CreationOptional<number>;
  declare slug: CreationOptional<string>;
  declare title: string;
  declare courseId: number;
  declare description: CreationOptional<string>;
  declare visibility: boolean;
  declare type: CreationOptional<"class" | "workshop" | "assignment">;

  declare readonly topics: NonAttribute<Topic[]>;
  declare readonly resources: NonAttribute<Resource[]>;
  declare readonly users: NonAttribute<User[]>;
  declare readonly createdAt: CreationOptional<Date>;
  declare readonly updatedAt: CreationOptional<Date>;

  declare countUsers: BelongsToManyCountAssociationsMixin;
  declare getUsers: BelongsToManyGetAssociationsMixin<User[]>;
}

Module.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    courseId: {
      type: DataTypes.INTEGER,
      allowNull: false
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
      type: DataTypes.STRING(128),
      unique: true
    },
    description: {
      type: new DataTypes.TEXT(),
      defaultValue: "Description"
    },
    type: {
      type: DataTypes.ENUM({
        values: ["class", "workshop", "assignment"]
      }),
      defaultValue: "workshop",
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
    tableName: "modules",
    sequelize
  }
);

Module.beforeCreate((module) => {
  const slugBase = module.slug ? module.slug : module.title;
  module.slug = sanitizeSlug(slugBase);
});

Module.beforeUpdate((module) => {
  const updateSlug = module.previous("title") !== module.title;
  if (updateSlug) module.setDataValue("slug", sanitizeSlug(module.title));
});

export default Module;
