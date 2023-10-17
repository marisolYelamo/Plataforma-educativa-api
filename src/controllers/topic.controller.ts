import { NextFunction, Request, Response } from "express";
import { ITopic } from "../interfaces/topic.interfaces";

import TopiService from "../services/topic.service";
import ModuleService from "../services/module.service";

import {
  ok,
  created,
  notFound,
  noContent,
  badRequest
} from "../helpers/responses";
import TopicServices from "../services/topic.service";

class TopicController {
  public static async createTopic(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<any> {
    const { moduleId, title }: ITopic = req.body;

    try {
      if (!moduleId || !title)
        return res.status(400).json(
          badRequest({
            message: "required parameters are missing or wrong type"
          })
        );

      const { exist, message } = await ModuleService.checkModule(moduleId);
      if (!exist) return res.status(404).json(notFound({ message }));

      const response = await TopiService.createTopic(req.body);
      res.status(201).json(created({ data: response }));
    } catch (err) {
      next(err);
    }
  }

  public static async getTopic(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<any> {
    const id = req.params.id;

    try {
      const { exist, message } = await TopiService.checkTopic({
        key: "id",
        value: Number(id)
      });

      if (!exist) return res.status(404).json(notFound({ message }));
      const response = await TopiService.getTopic(Number(id));

      res.status(200).json(ok({ data: response }));
    } catch (err) {
      next(err);
    }
  }

  public static async getModuleTopics(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<any> {
    const moduleId = req.params.id;

    try {
      const { exist, message } = await ModuleService.checkModule(
        Number(moduleId)
      );
      if (!exist) return res.status(404).json(notFound({ message }));

      const response = await TopiService.getTopicsModule(Number(moduleId));
      res.status(200).send(ok({ data: response }));
    } catch (err) {
      next(err);
    }
  }

  public static async updateTopic(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<any> {
    const id = req.params.id;

    try {
      const { exist, message } = await TopiService.checkTopic({
        key: "id",
        value: Number(id)
      });

      if (!exist) return res.status(404).json(notFound({ message }));
      const response = await TopiService.updateTopic(Number(id), req.body);
      res.status(200).json(ok({ data: response }));
    } catch (err) {
      next(err);
    }
  }

  public static async removeTopic(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<any> {
    const id = req.params.id;

    try {
      const { exist, message } = await TopiService.checkTopic({
        key: "id",
        value: Number(id)
      });

      if (!exist) return res.status(404).json(notFound({ message }));
      await TopiService.deleteTopic(Number(id));
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
    const { topics } = req.body;

    if (!topics.length) {
      return res
        .status(400)
        .json(badRequest({ message: "Information is missing" }));
    }

    try {
      const response = await TopicServices.updateSpan(topics);
      res.status(200).json(ok({ data: response }));
    } catch (err) {
      next(err);
    }
  }
}

export default TopicController;
