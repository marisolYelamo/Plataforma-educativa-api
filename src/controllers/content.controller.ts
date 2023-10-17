import { NextFunction, Request, Response } from "express";
import { IContent } from "../interfaces/content.interface";
import { IGetUserAuthInfoRequest } from "../interfaces/user.interfaces";

import { checkMissingParameters } from "../helpers/checkParameters";
import { checkAndHandleErrors } from "./utils/errorHandlers/checkAndHandleErrors";

import { Api400Error } from "./utils/errorHandlers/httpErrors";

import TopicServices from "../services/topic.service";
import ContentServices from "../services/content.service";

import {
  ok,
  created,
  notFound,
  noContent,
  badRequest
} from "../helpers/responses";

class ContentController {
  public static async createContent(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<any> {
    const { title, topicId }: IContent = req.body;

    try {
      if (!topicId || !title)
        return res.status(400).json(
          badRequest({
            message: "required parameters are missing or wrong type"
          })
        );

      const { exist, message } = await TopicServices.checkTopic({
        key: "id",
        value: topicId
      });
      if (!exist) return res.status(404).json(notFound({ message }));

      const response = await ContentServices.createContent(req.body);
      res.status(201).json(created({ data: response }));
    } catch (err) {
      next(err);
    }
  }

  public static async rankContent(
    req: IGetUserAuthInfoRequest,
    res: Response,
    next: NextFunction
  ): Promise<any> {
    const requiredParams = ["id"];
    const requiredParamsBody = ["ranking"];

    checkMissingParameters(req.params, requiredParams);
    checkMissingParameters(req.body, requiredParamsBody);

    const { id: contentId } = req.params;
    const { ranking } = req.body;
    const userId = req?.userData?.id;

    if (!userId) throw new Api400Error("No user provided");

    try {
      const prevRank = await ContentServices.getUserContentRank({
        userId,
        contentId
      });
      if (prevRank)
        throw new Api400Error("The user already has a rating of this content");

      await ContentServices.rankContent({ contentId, userId, ranking });

      res.sendStatus(201);
    } catch (err) {
      checkAndHandleErrors(err, next);
    }
  }

  public static async getContent(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<any> {
    const slug: string = req.params.slug?.toString() || "";

    try {
      if (!slug) return res.status(400).json(badRequest({}));

      const { exist, message } = await ContentServices.checkContent(slug);
      if (!exist) return res.status(404).json(notFound({ message }));

      const response = await ContentServices.getContent(slug);
      res.status(200).json(ok({ data: response }));
    } catch (err) {
      next(err);
    }
  }

  public static async getUserEntries(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<any> {
    const { id } = req.params;
    try {
      const { exist, message } = await ContentServices.checkContent(Number(id));
      if (!exist) res.status(404).json(notFound({ message }));
      else {
        const response = await ContentServices.getEntriesUsers(id);
        res.status(200).send(ok({ data: response }));
      }
    } catch (error) {
      next(error);
    }
  }

  public static async getContentsTopicById(
    req: IGetUserAuthInfoRequest,
    res: Response,
    next: NextFunction
  ): Promise<any> {
    const { id } = req.params;
    const userId = req?.userData?.id;

    if (!userId) throw new Api400Error("No user provided");

    try {
      if (id) {
        const { exist, message } = await TopicServices.checkTopic({
          key: "id",
          value: id?.toString()
        });
        if (!exist) res.status(404).json(notFound({ message }));
        else {
          const response = await ContentServices.getContentsTopic(id, userId);
          res.status(200).send(ok({ data: response }));
        }
      }
    } catch (err) {
      next(err);
    }
  }

  public static async getContentsTopicBySlug(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    const { slug } = req.params;

    try {
      if (slug) {
        const { exist, message } = await TopicServices.checkTopic({
          key: "slug",
          value: slug
        });

        if (!exist) res.status(404).json(notFound({ message }));
        else {
          const topicId = await TopicServices.getTopicId(slug);
          const response = await ContentServices.getContentsTopic(topicId);

          res.status(200).send(ok({ data: response }));
        }
      }
    } catch (err) {
      next(err);
    }
  }

  public static async updateContent(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<any> {
    const id = req.params.id;

    try {
      if (!id) return res.status(400).json(badRequest({}));

      const { exist, message } = await ContentServices.checkContent(Number(id));
      if (!exist) return res.status(404).json(notFound({ message }));

      const response = await ContentServices.updateContent(
        Number(id),
        req.body
      );
      res.status(200).json(ok({ data: response }));
    } catch (err) {
      next(err);
    }
  }

  public static async deleteContent(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<any> {
    const id = req.params.id;

    try {
      if (!id) return res.status(400).json(badRequest({}));

      const { exist, message } = await ContentServices.checkContent(
        parseInt(id)
      );
      if (!exist) return res.status(404).json(notFound({ message }));

      await ContentServices.deleteContent(parseInt(id));
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
    const { contents } = req.body;

    if (!contents.length) {
      return res
        .status(400)
        .json(badRequest({ message: "Information is missing" }));
    }

    try {
      const response = await ContentServices.updateSpan(contents);
      res.status(200).json(ok({ data: response }));
    } catch (err) {
      next(err);
    }
  }
}

export default ContentController;
