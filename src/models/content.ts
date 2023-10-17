import sequelize from "../db";

import {
  Model,
  DataTypes,
  Association,
  NonAttribute,
  InferAttributes,
  CreationOptional,
  InferCreationAttributes,
  BelongsToManyCountAssociationsMixin,
  BelongsToManyGetAssociationsMixin,
  BelongsToManyAddAssociationMixin
} from "sequelize";
import { IContent } from "../interfaces/content.interface";
import { codeGenerator, sanitizeSlug } from "../helpers/utils";
import User from "./user";
import Topic from "./topic";

class Content
  extends Model<
    InferAttributes<Content, { omit: "users" | "topic" | "userFeedbacks" }>,
    InferCreationAttributes<Content>
  >
  implements IContent {
  declare static associations: {
    users: Association<Content, User>;
    topic: Association<Content, Topic>;
    userFeedbacks: Association<Content, User>;
    userEntries: Association<Content, User>;
  };
  declare id: CreationOptional<number>;
  declare title: CreationOptional<string>;
  declare slug: CreationOptional<string>;
  declare span: CreationOptional<number>;
  declare topicId: number;
  declare contentHtml: CreationOptional<string>;
  declare contentMarkdown: CreationOptional<string>;
  declare visibility: boolean;
  declare estimateTime: number;
  declare trackTime: number;

  declare users: NonAttribute<User[]>;
  declare topic: NonAttribute<Topic>;
  declare userFeedbacks: NonAttribute<User[]>;

  declare readonly createdAt: CreationOptional<Date>;
  declare readonly updatedAt: CreationOptional<Date>;

  declare countUsers: BelongsToManyCountAssociationsMixin;
  declare getUsers: BelongsToManyGetAssociationsMixin<User>;

  declare addFeedback: BelongsToManyAddAssociationMixin<User, number>;
  declare getFeedback: BelongsToManyGetAssociationsMixin<User>;

  declare getUserEntries: BelongsToManyGetAssociationsMixin<User>;
  declare addUserEntries: BelongsToManyAddAssociationMixin<User, number>;
}

Content.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
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
    span: {
      type: DataTypes.INTEGER,
      validate: { isInt: true, isNumeric: true },
      defaultValue: 0
    },
    contentHtml: {
      type: DataTypes.TEXT
    },
    contentMarkdown: {
      type: DataTypes.TEXT
    },
    topicId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    visibility: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    estimateTime: {
      type: DataTypes.NUMBER,
      defaultValue: 60
    },
    trackTime: {
      type: DataTypes.NUMBER,
      defaultValue: 30
    },
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE
  },
  {
    tableName: "contents",
    sequelize
  }
);

Content.beforeCreate((content) => {
  const slugBase = content.slug ? content.slug : content.title;
  const code = codeGenerator();
  content.slug = sanitizeSlug(`${slugBase}-${code}`);
});

Content.beforeUpdate((content) => {
  const updateSlug = content.previous("title") !== content.title;
  if (updateSlug) {
    const code = codeGenerator();
    content.setDataValue("slug", sanitizeSlug(`${content.title}-${code}`));
  }
});

export default Content;
