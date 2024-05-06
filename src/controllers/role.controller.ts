
import { NextFunction, Request, Response } from "express";

import RoleService from "../services/role.service";
import { RoleInterface } from "../interfaces/role.interfaces";
import PermissionService from "../services/permission.service";

import {
  ok,
  created,
  notFound,
  noContent,
  badRequest,
  unauthorized
} from "../helpers/responses";
import { IGetUserAuthInfoRequest } from "../interfaces/user.interfaces";

class RoleController {
  public static async getAllRoles(
    req: IGetUserAuthInfoRequest,
    res: Response,
    next: NextFunction
  ): Promise<any> {
    const biggestAccessLevel = req.userData?.biggestAccessLevel;

    if (!biggestAccessLevel)
      return res
        .status(401)
        .json(unauthorized({ message: "You don't have access level" }));

    try {
      const roles = await RoleService.getAll();
console.log(roles)
      res.status(200).json(ok({ data: roles }));
    } catch (err) {
      next(err);
    }
  }

  public static async getRole(req: Request, res: Response, next: NextFunction) {
    const id = Number(req.params.id);

    try {
      const role = await RoleService.getRole("id", id);
      res.status(200).json(ok({ data: role }));
    } catch (err) {
      next(err);
    }
  }

  public static async getRoleByTag(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    const tag = req.params.tag;

    try {
      const role = await RoleService.getRole("name", tag);
      res.status(200).json(ok({ data: role }));
    } catch (err) {
      next(err);
    }
  }

  public static async createRole(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<any> {
    const { name, accessLevel, color }: RoleInterface = req.body;

    try {
      if (!name || !accessLevel || !color)
        return res.status(400).json(
          badRequest({
            message: "required parameter is missing or wrong type"
          })
        );

      const role = await RoleService.createRole(req.body);
      res.status(201).json(created({ data: role }));
    } catch (err) {
      next(err);
    }
  }

  public static async addPermissionToRole(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<any> {
    const id = req.params.id;
    const permissionId = req.params.permissionId;

    try {
      const permission = await PermissionService.isValidPermission(
        Number(permissionId)
      );

      if (!permission)
        return res
          .status(404)
          .json(notFound({ message: "Permission not found" }));

      const { message, success } = await RoleService.addOrRemovePermission(
        Number(id),
        Number(permissionId),
        "add"
      );

      if (!success) return res.status(400).json(badRequest({ message }));
      res.status(201).json(created({ message }));
    } catch (err) {
      next(err);
    }
  }

  public static async removePermissionToRole(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<any> {
    const id = req.params.id;
    const permissionId = req.params.permissionId;

    try {
      const permission = await PermissionService.isValidPermission(
        Number(permissionId)
      );

      if (!permission)
        return res
          .status(404)
          .json(notFound({ message: "Permission not found" }));

      const { message, success } = await RoleService.addOrRemovePermission(
        Number(id),
        Number(permissionId),
        "remove"
      );

      if (!success) return res.status(400).json(badRequest({ message }));
      res.status(200).json(ok({ message }));
    } catch (err) {
      next(err);
    }
  }

  public static async updateRole(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<any> {
    const id = req.params.id;

    try {
      const response = await RoleService.updateRole(Number(id), req.body);
      res.status(200).json(ok({ data: response }));
    } catch (err) {
      next(err);
    }
  }

  public static async deleteRole(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<any> {
    const id = req.params.id;

    try {
      await RoleService.deleteRole(Number(id));
      res.status(204).json(noContent());
    } catch (err) {
      next(err);
    }
  }

  public static async findUserRoles(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<any> {
    const userId = Number(req.params.userId);

    try {
      const roles = await RoleService.findUserRoles(userId);
      res.status(200).json(ok({ data: roles }));
    } catch (err) {
      next(err);
    }
  }
}

export default RoleController;
