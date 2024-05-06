import sequelize from "../db";

import Permission from "./permission";
import { RoleInterface } from "../interfaces/role.interfaces";

import {
  Model,
  DataTypes,
  Association,
  NonAttribute,
  CreationOptional,
  InferAttributes,
  InferCreationAttributes,
  HasManyAddAssociationMixin,
  HasManyHasAssociationMixin,
  HasManyGetAssociationsMixin,
  HasManyCreateAssociationMixin,
  HasManyCountAssociationsMixin,
  HasManyRemoveAssociationMixin
} from "sequelize";

class Role
  extends Model<
    InferAttributes<Role, { omit: "permissions" }>,
    InferCreationAttributes<Role>
  >
  implements RoleInterface {
  public static associations: {
    permissions: Association<Role, Permission>;
  };
  declare id: CreationOptional<number>;
  declare name: string;
  declare color: string;
  declare accessLevel: number;

  declare permissions: NonAttribute<Permission[]>;

  declare readonly createdAt: CreationOptional<Date>;
  declare readonly updatedAt: CreationOptional<Date>;

  declare countPermissions: HasManyCountAssociationsMixin;
  declare getPermissions: HasManyGetAssociationsMixin<Permission>;
  declare createPermission: HasManyCreateAssociationMixin<Permission>;
  declare addPermission: HasManyAddAssociationMixin<Permission, number>;
  declare hasPermission: HasManyHasAssociationMixin<Permission, number>;
  declare removePermission: HasManyRemoveAssociationMixin<Permission, number>;
}

Role.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    name: {
      type: DataTypes.STRING(128)
    },
    color: {
      type: DataTypes.STRING(128)
    },
    accessLevel: {
      type: DataTypes.INTEGER
    },
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE
  },
  {
    tableName: "rolespledu",
    sequelize
  }
);

export default Role;
