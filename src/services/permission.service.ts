import { Permission } from "../models";
import { IPermissions } from "../interfaces/permission.interfaces";

class PermissionService {
  public static addPermission(body: IPermissions) {
    return Permission.create(body);
  }

  public static async isValidPermission(id: number): Promise<boolean> {
    const permission = await Permission.findByPk(id);
    return !permission ? false : true;
  }

  public static async addOrRemovecourse(
    permissionId: number,
    courseId: number,
    operation: "add" | "remove"
  ): Promise<{
    message: string;
    success: boolean;
  }> {
    try {
      const permission = await Permission.findByPk(permissionId);

      if (!permission)
        return {
          success: false,
          message: "permission not found"
        };

      if (operation === "add") await permission.addCourse(courseId);
      else await permission.removeCourse(courseId);

      return {
        success: true,
        message: `Course ${
          operation === "add" ? "agregado" : "removido"
        } correctamente`
      };
    } catch (err) {
      throw {
        success: false,
        message: `No se pudo ${
          operation === "add" ? "agregar" : "remover"
        } el curso.`
      };
    }
  }

  public static async getPermission(permissionId: number) {
    try {
      const permission = await Permission.findByPk(permissionId, {
        attributes: ["id", "title", "type"],
        include: [
          {
            attributes: ["span", "id", "title"],
            association: Permission.associations.courses
          }
        ]
      });

      return permission;
    } catch (err) {
      throw new Error(err);
    }
  }

  public static getAllPermissions() {
    return Permission.findAll();
  }

  public static async updatePermission(id: number, body: IPermissions) {
    const [, res] = await Permission.update(body, {
      where: { id },
      returning: true
    });

    return res[0];
  }

  public static async deletePermission(id: number) {
    await Permission.destroy({ where: { id } });
    return { message: "permission removed successfully." };
  }
}

export default PermissionService;
