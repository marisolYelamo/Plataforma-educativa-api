import {
  Model,
  DataTypes,
  Association,
  CreationOptional,
  InferAttributes,
  NonAttribute,
  InferCreationAttributes
} from "sequelize";

import sequelize from "../db";
import Module from "./module";
import { ICourse } from "../interfaces/course.interfaces";
import { sanitizeSlug } from "../helpers/utils";

class Course
  extends Model<
    InferAttributes<Course, { omit: "modules" }>,
    InferCreationAttributes<Course>
  >
  implements ICourse {
  declare static associations: {
    modules: Association<Course, Module>;
  };
  declare id: CreationOptional<number>;
  declare span: number;
  declare slug: string;
  declare image: CreationOptional<string>;
  declare title: string;
  declare duration: CreationOptional<string>;
  declare description: string;

  declare readonly modules: NonAttribute<Module[]>;

  declare readonly createdAt: CreationOptional<Date>;
  declare readonly updatedAt: CreationOptional<Date>;
}

Course.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },

    span: {
      type: DataTypes.INTEGER,
      validate: { isInt: true, isNumeric: true }
    },

    title: {
      type: DataTypes.STRING(128),
      allowNull: false,
      unique: true
    },

    slug: {
      type: DataTypes.STRING(128),
      unique: true
    },

    description: {
      type: DataTypes.TEXT()
    },

    duration: {
      type: DataTypes.STRING(128)
    },

    image: {
      type: DataTypes.STRING(128)
    },
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE
  },
  {
    tableName: "pleducourses",
    sequelize
  }
);

Course.beforeCreate((course) => {
  const slugBase = course.slug ? course.slug : course.title;
  course.slug = sanitizeSlug(slugBase);
});

Course.beforeCreate(async (course) => {
  const lastField = await Course.findAll({
    limit: 1,
    order: [["span", "DESC"]]
  });

  course.span = lastField[0] ? lastField[0].span + 1 : 0;
});

export default Course;
