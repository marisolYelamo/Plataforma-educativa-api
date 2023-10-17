import { NextFunction, Response } from "express";
import { badRequest, noContent, notFound } from "../helpers/responses";
import { IContent } from "../interfaces/content.interface";
import { IGetUserAuthInfoRequest } from "../interfaces/user.interfaces";
import { User } from "../models";
import CourseServices from "../services/course.service";
import ProgressionService from "../services/progression.service";
import UserService from "../services/user.service";

class ProgressionController {
  public static async getUserCompletions(
    req: any,
    res: Response,
    next: NextFunction
  ): Promise<any> {
    const id = Number(req.params.id);
    const { type } = req.query;

    if (!id || !type)
      return res
        .status(400)
        .send(badRequest({ message: "Parámetros faltantes" }));
    try {
      const user = await UserService.getUser(id);
      if (!user) return res.status(404).send("Usuario no encontrado");

      const progressions = await ProgressionService.getUserCompletions(
        user,
        type
      );

      res.status(200).send(progressions);
    } catch (err) {
      if (err.message === "Falta el tipo de progreso")
        return res
          .status(400)
          .send(badRequest({ message: "Falta el tipo de progreso" }));

      next(err);
    }
  }

  public static async generateUserProgression(
    req: any,
    res: Response,
    next: NextFunction
  ): Promise<any> {
    const id = Number(req.userData?.id);
    const progressionId = Number(req.params.progressionId);
    const { type } = req.query;

    if (!id || !progressionId || !type)
      return res
        .status(400)
        .send(badRequest({ message: "Parámetros faltantes" }));
    try {
      const [user, progression] = await Promise.all([
        UserService.getUser(id),
        ProgressionService.checkIfProgressionExists(progressionId, type)
      ]);

      if (!user || !progression)
        return res
          .status(404)
          .send(
            notFound({ message: "Usuario o progreso a generar no encontrado" })
          );

      const completedProgression = await ProgressionService.getOneUserCompletion(
        user,
        type,
        progressionId
      );

      let completion;

      if (!completedProgression) {
        completion = await ProgressionService.generateProgression(
          user,
          progressionId,
          type,
          progression.topicId,
          progression.moduleId
        );
      } else {
        return res.status(204).send(noContent());
      }
      return res.status(200).send(completion);
    } catch (err) {
      if (err.message === "Falta el tipo de progreso")
        return res
          .status(400)
          .send(badRequest({ message: "Falta el tipo de progreso" }));

      next(err);
    }
  }

  public static async getProgressionUsers(
    req: any,
    res: Response,
    next: NextFunction
  ): Promise<any> {
    const id = Number(req.params.progressionId);
    const { type } = req.query;

    if (!id || !type)
      return res
        .status(400)
        .send(badRequest({ message: "Parámetros faltantes" }));

    try {
      const progression = await ProgressionService.checkIfProgressionExists(
        id,
        type
      );

      if (!progression)
        return res
          .status(404)
          .send(notFound({ message: "Progresion no encontrada" }));

      const users = await ProgressionService.getProgressionUsers(progression);

      res.status(200).send(users);
    } catch (err) {
      if (err.message === "Falta el tipo de progreso")
        return res
          .status(400)
          .send(badRequest({ message: "Falta el tipo de progreso" }));

      next(err);
    }
  }

  public static async removeUserProgression(
    req: any,
    res: Response,
    next: NextFunction
  ): Promise<any> {
    const id = Number(req.userData?.id);
    const progressionId = Number(req.params.progressionId);
    const { type } = req.query;

    if (!id || !progressionId || !type)
      return res
        .status(400)
        .send(badRequest({ message: "Parámetros faltantes" }));
    try {
      const [user, progression] = await Promise.all([
        UserService.getUser(id),
        ProgressionService.checkIfProgressionExists(progressionId, type)
      ]);

      if (!user || !progression)
        return res
          .status(404)
          .send(
            notFound({ message: "Usuario o progreso a generar no encontrado" })
          );

      await ProgressionService.removeUserProgression(
        user,
        progression.id,
        type
      );

      res.status(204).send(noContent());
    } catch (err) {
      if (err.message === "Falta el tipo de progreso")
        return res
          .status(400)
          .send(badRequest({ message: "Falta el tipo de progreso" }));

      next(err);
    }
  }

  public static async getCourseCompletions(
    req: any,
    res: Response,
    next: NextFunction
  ): Promise<any> {
    const id = Number(req.userData?.id);
    const courseId = Number(req.params.courseId);
    const { type } = req.query;

    if (!id || !courseId || !type)
      return res
        .status(400)
        .send(badRequest({ message: "Parámetros faltantes" }));

    try {
      const [user, course] = await Promise.all([
        UserService.getUser(id),
        CourseServices.getCourse(courseId)
      ]);
      if (!course || !user)
        return res.status(404).send("Usuario no encontrado");

      const completeModules = await ProgressionService.getUserCompletions(
        user,
        type,
        courseId
      );

      res.status(200).send(completeModules);
    } catch (err) {
      if (err.message === "Falta el tipo de progreso")
        return res
          .status(400)
          .send(badRequest({ message: "Falta el tipo de progreso" }));

      next(err);
    }
  }

  public static async getInactiveUsers(
    _req: IGetUserAuthInfoRequest,
    res: Response,
    next: NextFunction
  ): Promise<any> {
    try {
      const users = await UserService.findAllUsers();

      const whichActiveContents: IContent[][] =
        users.length &&
        (await Promise.all(
          users.map((user: User) =>
            ProgressionService.getInactiveContents(user)
          )
        ));

      const inactiveUsers = users.filter(
        (_inactiveContent: IContent, index: number) =>
          whichActiveContents[index].length === 0
      );

      res.status(200).send(inactiveUsers);
    } catch (err) {
      next(err);
    }
  }
}

export default ProgressionController;
