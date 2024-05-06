import {
  Model,
  DataTypes,
  Association,
  InferAttributes,
  InferCreationAttributes,
  CreationOptional,
  NonAttribute,
  HasManyAddAssociationMixin,
  HasManyHasAssociationMixin,
  HasManyGetAssociationsMixin,
  HasManyCountAssociationsMixin,
  HasManyCreateAssociationMixin,
  HasManyRemoveAssociationMixin,
  BelongsToManyAddAssociationMixin,
  BelongsToManyCountAssociationsMixin,
  BelongsToManyGetAssociationsMixin,
  BelongsToManyHasAssociationMixin,
  BelongsToManySetAssociationsMixin,
  HasManySetAssociationsMixin
} from "sequelize";
import crypto from "crypto";

import sequelize from "../db";

import RoleModel from "./role";
import TopicModel from "./topic";
import ModuleModel from "./module";
import ContentModel from "./content";

import { IUser } from "../interfaces/user.interfaces";

import { genSalt } from "./utils/bcrypt";
import { createAPIToken } from "../helpers/jwt";

class User
  extends Model<
    InferAttributes<
      User,
      {
        omit: "contents" | "topics" | "roles" | "modules" | "contentFeedbacks";
      }
    >,
    InferCreationAttributes<User>
  >
  implements IUser {
  declare static associations: {
    roles: Association<User, RoleModel>;
    topics: Association<User, TopicModel>;
    contents: Association<User, ContentModel>;
    modules: Association<User, ModuleModel>;
    contentFeedbacks: Association<User, ContentModel>;
    contentEntries: Association<User, ContentModel>;
  };
  declare id: CreationOptional<number>;
  declare firstName: CreationOptional<string>;
  declare lastName: CreationOptional<string>;
  declare email: string;
  declare password: CreationOptional<string>;
  declare active: CreationOptional<boolean>;
  declare discordId: CreationOptional<string>;
  declare github: CreationOptional<string>;
  declare discordTag: CreationOptional<string>;
  declare knowledge: CreationOptional<string | null>;
  declare salt: CreationOptional<string>;
  declare activeToken: CreationOptional<string>;
  declare resetToken: CreationOptional<string>;

  declare readonly roles: NonAttribute<RoleModel[]>;
  declare readonly topics: NonAttribute<TopicModel[]>;
  declare readonly contents: NonAttribute<ContentModel[]>;
  declare readonly modules: NonAttribute<ModuleModel[]>;
  declare readonly contentFeedbacks: NonAttribute<ContentModel[]>;
  declare readonly contentEntries: NonAttribute<ContentModel[]>;

  declare readonly createdAt: CreationOptional<Date>;
  declare readonly updatedAt: CreationOptional<Date>;

  declare countRoles: HasManyCountAssociationsMixin;
  declare getRoles: HasManyGetAssociationsMixin<RoleModel>;
  declare createRole: HasManyCreateAssociationMixin<RoleModel>;
  declare addRole: HasManyAddAssociationMixin<RoleModel, number>;
  declare setRoles: HasManySetAssociationsMixin<RoleModel, number>;
  declare hasRole: HasManyHasAssociationMixin<RoleModel, number>;
  declare removeRole: HasManyRemoveAssociationMixin<RoleModel, number>;

  // Magic methods: Student progression

  // Topics:
  declare addTopic: BelongsToManyAddAssociationMixin<TopicModel, number>;
  declare setTopic: BelongsToManySetAssociationsMixin<TopicModel, number>;
  declare countTopics: BelongsToManyCountAssociationsMixin;
  declare getTopics: BelongsToManyGetAssociationsMixin<TopicModel>;
  declare hasTopic: BelongsToManyHasAssociationMixin<TopicModel, number>;
  declare removeTopic: HasManyRemoveAssociationMixin<TopicModel, number>;

  // Modules
  declare addModule: BelongsToManyAddAssociationMixin<ModuleModel, number>;
  declare countModules: BelongsToManyCountAssociationsMixin;
  declare getModules: BelongsToManyGetAssociationsMixin<ModuleModel>;
  declare hasModules: BelongsToManyHasAssociationMixin<ModuleModel, number>;
  declare removeModule: HasManyRemoveAssociationMixin<ModuleModel, number>;

  // Contents
  declare addContent: BelongsToManyAddAssociationMixin<ContentModel, number>;
  declare countContents: BelongsToManyCountAssociationsMixin;
  declare getContents: BelongsToManyGetAssociationsMixin<ContentModel>;
  declare hasContents: BelongsToManyHasAssociationMixin<ContentModel, number>;
  declare removeContent: HasManyRemoveAssociationMixin<ContentModel, number>;

  // Feedbacks
  declare getContentFeedback: BelongsToManyGetAssociationsMixin<ContentModel>;
  declare addContentFeedback: BelongsToManyAddAssociationMixin<
    ContentModel,
    number
  >;

  //contentEntrys
  declare getContentEntries: BelongsToManyGetAssociationsMixin<ContentModel>;
  declare addContentEntry: BelongsToManyAddAssociationMixin<
    ContentModel,
    number
  >;

  /**
   * Instance Methods
   */

  public hashFunction(salt: string, password: string) {
    return crypto
      .createHmac("sha1", salt)
      .update(salt + password)
      .digest("hex");
  }

  public createResetToken() {
    const hash = crypto.randomBytes(48).toString("hex");
    return this.update({ resetToken: hash });
  }

  public changePassword(password: string) {
    // generates new salt to invalid old tokens
    const salt = genSalt();

    return this.update({
      salt,
      password: this.hashFunction(salt, password),
      resetToken: ""
    });
  }

  public validatePassword(password: string) {
    const passwordToValidate = this.hashFunction(this.salt, password);
    return this.password === passwordToValidate;
  }
}

User.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    firstName: {
      type: DataTypes.STRING(128),
      allowNull: true
    },
    lastName: {
      type: DataTypes.STRING(128),
      allowNull: true
    },
    email: {
      unique: true,
      allowNull: false,
      type: DataTypes.STRING(128),
      validate: {
        isEmail: true
      },
      set(value: string) {
        this.setDataValue("email", value.toLowerCase());
      }
    },
    password: {
      type: DataTypes.STRING(128),
      allowNull: true
    },
    active: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    discordId: {
      type: DataTypes.STRING(128),
      defaultValue: ""
    },
    github: {
      type: DataTypes.STRING(128),
      defaultValue: ""
    },
    discordTag: {
      type: DataTypes.STRING(128),
      defaultValue: ""
    },
    knowledge: {
      type: DataTypes.STRING(128),
      defaultValue: ""
    },
    salt: {
      type: DataTypes.STRING(128)
    },
    activeToken: {
      type: DataTypes.STRING(256),
      defaultValue: ""
    },
    resetToken: {
      type: DataTypes.STRING(256),
      defaultValue: ""
    },
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE
  },
  {
    tableName: "users",
    sequelize
  }
);

User.afterCreate(async (user) => {
  user.salt = genSalt();

  user.activeToken = createAPIToken({ email: user.email, id: user.id });

  await user.save();
});

export default User;
