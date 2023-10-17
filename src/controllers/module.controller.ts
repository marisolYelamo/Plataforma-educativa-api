import { NextFunction, Request, Response } from "express";

import ModuleService from "../services/module.service";
import CourseServices from "../services/course.service";
import { IUpdateModule } from "../interfaces/module.interfaces";

import {
  ok,
  created,
  notFound,
  noContent,
  badRequest
} from "../helpers/responses";

class ModuleController {
  public static async createModule(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<any> {
    const { courseId, title }: IUpdateModule = req.body;

    try {
      if (!courseId || !title)
        return res.status(400).json(
          badRequest({
            message: "required parameters are missing or wrong type"
          })
        );

      const exist = await CourseServices.isValidCourse(courseId);
      if (!exist)
        return res.status(404).json(notFound({ message: "course not found" }));

      const module = await ModuleService.createModule(req.body);
      res.status(201).json(created({ data: module }));
    } catch (err) {
      next(err);
    }
  }

  public static async getModule(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<any> {
    const { id } = req.params;
    const { searchBy } = req.query;

    try {
      if (!id)
        return res.status(400).json(
          badRequest({
            message: "required parameter is missing or wrong type"
          })
        );
      const input = searchBy === "slug" ? id : Number(id);

      const { exist, message } = await ModuleService.checkModule(input);
      if (!exist) return res.status(404).json(notFound({ message }));

      const response = await ModuleService.getModule(input);
      res.status(200).json(ok({ data: response }));
    } catch (err) {
      next(err);
    }
  }

  public static async getCourseModules(
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

      const exist = await CourseServices.isValidCourse(parseInt(id));
      if (!exist)
        return res.status(404).json(notFound({ message: "course not found" }));

      const response = await ModuleService.getCourseModules(parseInt(id));
      res.status(200).send(ok({ data: response }));
    } catch (err) {
      next(err);
    }
  }

  public static async updateModule(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<any> {
    const { id } = req.params;

    try {
      if (!id)
        return res.status(400).json(
          badRequest({
            message: "required parameter is missing or wrong type"
          })
        );

      const { exist, message } = await ModuleService.checkModule(Number(id));
      if (!exist) return res.status(404).json(notFound({ message }));

      const response = await ModuleService.updateModule(Number(id), req.body);
      res.status(200).json(ok({ data: response }));
    } catch (err) {
      next(err);
    }
  }

  public static async removeModule(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<any> {
    const { id } = req.params;

    try {
      if (!id)
        return res.status(400).json(
          badRequest({
            message: "required parameter is missing or wrong type"
          })
        );

      const { exist, message } = await ModuleService.checkModule(Number(id));
      if (!exist) return res.status(404).json(notFound({ message }));

      await ModuleService.deleteModule(Number(id));
      res.status(204).json(noContent());
    } catch (err) {
      next(err);
    }
  }

  public static async updateSpan(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<any> {
    const { modules } = req.body;

    if (!modules.length) {
      return res
        .status(400)
        .json(badRequest({ message: "Information is missing" }));
    }

    try {
      const response = await ModuleService.updateSpan(modules);
      res.status(200).json(ok({ data: response }));
    } catch (err) {
      next(err);
    }
  }
}

export default ModuleController;
