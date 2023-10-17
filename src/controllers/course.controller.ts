import { NextFunction, Request, Response } from "express";

import {
  ok,
  created,
  notFound,
  noContent,
  badRequest
} from "../helpers/responses";

import CourseServices from "../services/course.service";
import { IUpdateCourse } from "../interfaces/course.interfaces";

class CourseController {
  public static async getAllCourses(
    req: any,
    res: Response,
    next: NextFunction
  ): Promise<any> {
    try {
      const userId: number = req.userData.id;

      const courses = await CourseServices.hasCourses(userId);
      res.status(200).json(ok({ data: courses }));
    } catch (err) {
      next(err);
    }
  }

  public static async getCourse(
    req: any,
    res: Response,
    next: NextFunction
  ): Promise<any> {
    const { visibility } = req.query;

    try {
      const courseId = parseInt(req.params.id);
      const response = await CourseServices.getCourse(courseId, visibility);

      res
        .status(200)
        .send(
          ok({ data: { course: response, accessLevels: req.accessLevels } })
        );
    } catch (err) {
      next(err);
    }
  }

  public static async getCourseBySlug(
    req: any,
    res: Response,
    next: NextFunction
  ): Promise<any> {
    try {
      const courseSlug = req.params.slug;
      const { exist, id } = await CourseServices.getCourseId({
        key: "slug",
        value: courseSlug
      });

      if (!exist)
        return res.status(404).json(notFound({ message: "course not found" }));

      req.params.id = id;

      next();
    } catch (err) {
      next(err);
    }
  }

  public static async addCourse(
    req: any,
    res: Response,
    next: NextFunction
  ): Promise<any> {
    const { description, title, duration, image }: IUpdateCourse = req.body;

    try {
      if (!description || !title || !duration || !image) {
        return res.status(400).json(
          badRequest({
            message: "required parameters are missing or wrong type"
          })
        );
      }

      const response = await CourseServices.addCourse(req.body);
      res.status(201).json(created({ data: response }));
    } catch (err) {
      next(err);
    }
  }

  public static async updateCourse(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<any> {
    const id = Number(req.params.id);

    try {
      if (id) {
        const response = await CourseServices.updateCourse(id, req.body);
        res.status(200).json(ok({ data: response }));
      } else {
        res.status(400).send();
      }
    } catch (err) {
      next(err);
    }
  }

  public static async updateSpan(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<any> {
    const id = req.params.id;
    const span = req.body.span;

    try {
      if (id && span) {
        const response = await CourseServices.updateSpan(parseInt(id), span);
        res.status(200).json(ok({ data: response }));
      } else {
        res.status(400).send();
      }
    } catch (err) {
      next(err);
    }
  }

  public static async deleteCourse(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<any> {
    const id = req.params.id;

    try {
      if (id) {
        await CourseServices.deleteCourse(parseInt(id));
        res.status(204).json(noContent());
      } else {
        res.status(400).send();
      }
    } catch (err) {
      next(err);
    }
  }
}

export default CourseController;
