import { NextFunction, Request, Response } from "express";

import {
  ok,
  created,
  notFound,
  noContent,
  badRequest
} from "../helpers/responses";

import CourseServices from "../services/course.service";
import PermissionService from "../services/permission.service";

class PermissionController {
  public static async getAllPermission(
    _req: Request,
    res: Response,
    next: NextFunction
  ): Promise<any> {
    try {
      const permissions = await PermissionService.getAllPermissions();
      res.status(200).json(ok({ data: permissions }));
    } catch (err) {
      next(err);
    }
  }

  public static async getPermission(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<any> {
    const id = req.params.id;

    try {
      if (!id)
        return res.status(400).json(
          badRequest({
            message: "required parameter is missing or wrong type"
          })
        );

      const exist = await PermissionService.isValidPermission(parseInt(id));
      if (!exist)
        return res
          .status(404)
          .json(notFound({ message: "permission not found" }));

      const permission = await PermissionService.getPermission(parseInt(id));
      res.status(200).json(ok({ data: permission }));
    } catch (err) {
      next(err);
    }
  }

  public static async addPermission(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<any> {
    try {
      const permission = await PermissionService.addPermission(req.body);
      res.status(201).json(created({ data: permission }));
    } catch (err) {
      next(err);
    }
  }

  public static async updatePermission(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<any> {
    const id = req.params.id;

    try {
      if (!id)
        return res.status(400).json(
          badRequest({
            message: "required parameter is missing or wrong type"
          })
        );

      const exist = await PermissionService.isValidPermission(parseInt(id));
      if (!exist)
        return res
          .status(404)
          .json(notFound({ message: "permission not found" }));

      const response = await PermissionService.updatePermission(
        Number(id),
        req.body
      );
      res.status(200).json(ok({ data: response }));
    } catch (err) {
      next(err);
    }
  }

  public static async addCourseToPermission(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<any> {
    const permissionId = req.params.id;
    const courseId = req.params.courseId;

    try {
      if (courseId && permissionId) {
        const course = await CourseServices.isValidCourse(parseInt(courseId));
        const permission = await PermissionService.isValidPermission(
          parseInt(permissionId)
        );

        if (!permission)
          return res
            .status(404)
            .json(notFound({ message: "Permission not found" }));

        if (!course)
          return res
            .status(404)
            .json(notFound({ message: "Course not found" }));

        const { message, success } = await PermissionService.addOrRemovecourse(
          Number(permissionId),
          Number(courseId),
          "add"
        );

        if (!success) return res.status(400).json(badRequest({ message }));
        res.status(201).json(created({ message }));
      } else {
        res.status(400).send();
      }
    } catch (err) {
      next(err);
    }
  }

  public static async removeCourseToPermission(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<any> {
    const permissionId = req.params.id;
    const courseId = req.params.courseId;

    try {
      if (permissionId && courseId) {
        const course = await CourseServices.isValidCourse(parseInt(courseId));
        const permission = await PermissionService.isValidPermission(
          parseInt(permissionId)
        );

        if (!permission)
          return res
            .status(404)
            .json(notFound({ message: "Permission not found" }));

        if (!course)
          return res
            .status(404)
            .json(notFound({ message: "Course not found" }));

        const { message, success } = await PermissionService.addOrRemovecourse(
          parseInt(permissionId),
          parseInt(courseId),
          "remove"
        );

        if (!success) return res.status(400).json(badRequest({ message }));
        res.status(200).json(ok({ message }));
      } else {
        res.status(400).send();
      }
    } catch (err) {
      next(err);
    }
  }

  public static async removePermission(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<any> {
    const id = req.params.id;

    try {
      if (!id) return res.status(400).json(badRequest({}));

      const exist = await PermissionService.isValidPermission(parseInt(id));
      if (!exist)
        return res
          .status(404)
          .json(notFound({ message: "permission not found" }));

      await PermissionService.deletePermission(parseInt(id));
      res.status(204).json(noContent());
    } catch (err) {
      next(err);
    }
  }
}

export default PermissionController;
