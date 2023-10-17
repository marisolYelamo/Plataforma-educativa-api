import sequelize from "../db";

import Course from "./course";
import { IPermissions } from "../interfaces/permission.interfaces";

import {
  Model,
  DataTypes,
  Association,
  NonAttribute,
  InferAttributes,
  CreationOptional,
  InferCreationAttributes,
  HasManyAddAssociationMixin,
  HasManyHasAssociationMixin,
  HasManyGetAssociationsMixin,
  HasManyCreateAssociationMixin,
  HasManyCountAssociationsMixin,
  HasManyRemoveAssociationMixin
} from "sequelize";

class Permission
  extends Model<
    InferAttributes<Permission, { omit: "courses" }>,
    InferCreationAttributes<Permission>
  >
  implements IPermissions {
  declare static associations: {
    courses: Association<Permission, Course>;
  };
  declare id: CreationOptional<number>;
  declare title: string;
  declare type: "read" | "create" | "delete" | "edit";

  declare readonly courses?: NonAttribute<Course[]>;

  declare readonly createdAt: CreationOptional<Date>;
  declare readonly updatedAt: CreationOptional<Date>;

  declare countCourses: HasManyCountAssociationsMixin;
  declare getCourses: HasManyGetAssociationsMixin<Course>;
  declare createCourse: HasManyCreateAssociationMixin<Course>;
  declare addCourse: HasManyAddAssociationMixin<Course, number>;
  declare hasCourse: HasManyHasAssociationMixin<Course, number>;
  declare removeCourse: HasManyRemoveAssociationMixin<Course, number>;
}

Permission.init(
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
    type: {
      type: DataTypes.ENUM({ values: ["read", "create", "delete", "edit"] }),
      defaultValue: "read"
    },
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE
  },
  {
    tableName: "permissions",
    sequelize
  }
);

export default Permission;
