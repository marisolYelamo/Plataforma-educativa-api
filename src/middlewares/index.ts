import { Response, NextFunction, Request } from "express";

import { IGetUserAuthInfoRequest } from "../interfaces/user.interfaces";
import CourseServices from "../services/course.service";
import RoleService from "../services/role.service";
import UserService from "../services/user.service";
import ServiceError from "../services/utils/serviceErrors";
import handleServiceErrors from "../controllers/utils/errorHandlers/handleServiceErrors";

import {
  Api400Error,
  Api401Error,
  Api403Error,
  Api404Error
} from "../controllers/utils/errorHandlers/httpErrors";

import { decodeJWT, validateAPIToken } from "../helpers/jwt";

class MiddlewaresController {
  public static async isStaff(
    req: IGetUserAuthInfoRequest,
    _res: Response,
    next: NextFunction
  ): Promise<any> {
    try {
      const biggestAccessLevel = req.userData?.biggestAccessLevel;

      if (!biggestAccessLevel || biggestAccessLevel > 2)
        throw new Api403Error("No tienes permisos para realizar esta acción.");
      else next();
    } catch (error) {
      next(error);
    }
  }

  public static async validUser(
    req: IGetUserAuthInfoRequest,
    _res: Response,
    next: NextFunction
  ): Promise<any> {
    try {
      if (!req.role) throw new Api401Error("Authorization header missing");

      if (req.role !== "user") return next();

      const token =
        req.headers.authorization && req.headers.authorization.split(" ")[1];

      if (!token || token.length < 3)
        throw new Api401Error("Authorization token missing");

      const { id } = await UserService.validToken(token);
      if (!id) throw new Api401Error("Token inválido");

      const { biggestAccessLevel } = await RoleService.getBiggestAccessLevel(
        id
      );

      req.userData = { id: Number(id), biggestAccessLevel };

      next();
    } catch (err) {
      if (err instanceof ServiceError) handleServiceErrors(err);
      next(err);
    }
  }

  public static async validAccount(
    req: IGetUserAuthInfoRequest,
    _res: Response,
    next: NextFunction
  ): Promise<any> {
    try {
      if (req.role && req.role !== "user") return next();
      if (!req.userData || !req.userData.id)
        throw new Api401Error("Unauthorized");

      const valid = await UserService.validAccount(req.userData.id);
      if (!valid) throw new Api401Error("Unauthorized");
      next();
    } catch (err) {
      next(err);
    }
  }
  public static async checkSingleRoleAccess(
    req: IGetUserAuthInfoRequest,
    _res: Response,
    next: NextFunction
  ): Promise<any> {
    const roleId = Number(req.params.id);
    const biggestAccessLevel = req.userData?.biggestAccessLevel;

    if (!biggestAccessLevel) throw new Api401Error("No tienes roles asignados");

    try {
      const { access, message } = await RoleService.checkSingleRoleAccess(
        biggestAccessLevel,
        roleId
      );

      if (!access) throw new Api401Error(message);

      next();
    } catch (error) {
      next(error);
    }
  }

  public static async isValidRole(
    req: Request,
    _res: Response,
    next: NextFunction
  ): Promise<any> {
    const roleId = req.params.id;

    if (!roleId) throw new Api400Error("incorrect type for roleId");

    try {
      const exist = await RoleService.isValidRole(Number(roleId));

      if (!exist) throw new Api404Error("role not found");

      next();
    } catch (err) {
      next(err);
    }
  }

  public static async checkAccessToCourse(
    req: any,
    _res: Response,
    next: NextFunction
  ): Promise<any> {
    try {
      const userId = req.userData.id;
      const courseId = parseInt(req.params.id);

      const { isAllowed, accessLevels } = await CourseServices.hasCourseAccess(
        userId,
        courseId
      );

      if (!isAllowed)
        throw new Api403Error("you dont have access to this course");

      req.accessLevels = accessLevels;
      next();
    } catch (err) {
      next(err);
    }
  }

  public static async isValidCourse(
    req: Request,
    _res: Response,
    next: NextFunction
  ): Promise<any> {
    const courseId = req.params.id;

    if (!courseId) throw new Api400Error("incorrect type for courseId");

    try {
      const exist = await CourseServices.isValidCourse(parseInt(courseId));
      if (!exist) throw new Api404Error("course not found");

      next();
    } catch (err) {
      next(err);
    }
  }

  public static async authMiddleware(
    req: IGetUserAuthInfoRequest,
    _res: Response,
    next: NextFunction
  ): Promise<any> {
    try {
      if (!req.headers.authorization)
        throw new Api401Error("Authorization header missing");

      const token = req.headers.authorization.split(" ")[1];

      if (!token || token.length < 3)
        throw new Api401Error("Authorization token missing");

      const decodedToken = decodeJWT(token);

      if (!decodedToken.user && !decodedToken.service)
        throw new Api403Error("Not allowed to access resource");

      validateAPIToken(token);

      if (decodedToken.service) {
        switch (decodedToken.service) {
          case "discord-bot":
            req.role = "bot";
            break;
          case "backoffice-bff":
            req.role = "backoffice";
            req.userData = {
              biggestAccessLevel: decodedToken.biggestAccessLevel
            };
            break;
          case "landing-bff":
            req.role = "landing";
            req.userData = {
              biggestAccessLevel: decodedToken.biggestAccessLevel
            };
            break;
          case "pledu-bff":
            req.role = "pledu";
            req.userData = {
              biggestAccessLevel: decodedToken.biggestAccessLevel
            };
            break;
        }
      } else {
        req.role = "user";
      }

      next();
    } catch (err) {
      next(err);
    }
  }
}

export default MiddlewaresController;
