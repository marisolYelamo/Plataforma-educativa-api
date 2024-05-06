import { Role, User } from "../models";
import { WhereOptions } from "sequelize";

import { getTopAccessLevel } from "../helpers/utils";
import { RoleInterface, RoleKeys } from "../interfaces/role.interfaces";
import ServiceError from "./utils/serviceErrors";

class RoleService {
  public static async getAll(
    options?: WhereOptions<RoleInterface> | undefined
  ) {
    return await Role.findAll()/* {
      where: options,
      order: [
        ["accessLevel", "ASC"],
        ["createdAt", "ASC"]
      ]
    } */
  }

  public static async getRole(field: RoleKeys, value: RoleInterface[RoleKeys]) {
    const role = await Role.findOne({
      where: { [field]: value },
      attributes: ["id", "name", "accessLevel"],
      include: [
        {
          association: Role.associations.permissions,
          attributes: ["id", "title", "type"]
        }
      ]
    });

    if (!role) throw new ServiceError("not_found", "Role not found");

    return role;
  }

  public static async createRole(body: RoleInterface) {
    return Role.create(body);
  }

  public static async addOrRemovePermission(
    roleId: number,
    permissionId: number,
    operation: "add" | "remove"
  ): Promise<{
    message: string;
    success: boolean;
  }> {
    try {
      const role = await Role.findByPk(roleId);

      if (!role)
        return {
          success: false,
          message: "role not found"
        };

      if (operation === "add") await role.addPermission(permissionId);
      else await role.removePermission(permissionId);

      return {
        success: true,
        message: `Permission ${
          operation === "add" ? "agregado" : "removido"
        } correctamente`
      };
    } catch (err) {
      throw {
        success: false,
        message: `No se pudo ${
          operation === "add" ? "agregar" : "remover"
        } el permission.`
      };
    }
  }

  public static async isValidRole(id: number): Promise<boolean> {
    const role = await Role.findByPk(id);
    return !role ? false : true;
  }

  public static async updateRole(id: number, body: RoleInterface) {
    const response = await Role.update(body, {
      where: { id },
      returning: true
    });

    return response;
  }

  public static async deleteRole(id: number) {
    await Role.destroy({ where: { id } });
    return { message: "role deleted successfully." };
  }

  public static async getBiggestAccessLevel(userId: number) {
    const userRoles = await this.findUserRoles(userId);

    if (!userRoles.length)
      return {
        biggestAccessLevel: null,
        message: "User doesn't have roles"
      };

    const greatestAccessLevel = getTopAccessLevel(userRoles);

    return {
      biggestAccessLevel: greatestAccessLevel,
      message: ""
    };
  }

  public static async checkSingleRoleAccess(
    biggestAccessLevel: number,
    roleId: number
  ) {
    const role = await RoleService.getRole("id", roleId);

    if (role.accessLevel < biggestAccessLevel || biggestAccessLevel > 2)
      return {
        access: false,
        message: "dont have access to this role"
      };

    return {
      access: true,
      message: ""
    };
  }

  public static async findUserRoles(id: number): Promise<any> {
    const user = await User.findByPk(id);

    if (!user) throw new Error("User not found");

    return user.getRoles({
      attributes: ["id", "name", "color", "accessLevel"]
    });
  }
}

export default RoleService;
