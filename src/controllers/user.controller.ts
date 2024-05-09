import { Request, Response, NextFunction } from "express";
import {
  Api400Error,
  Api401Error,
  Api404Error
} from "./utils/errorHandlers/httpErrors";
import { ok, created, notFound, noContent } from "../helpers/responses";

import RoleService from "../services/role.service";
import UserService from "../services/user.service";

import { getPagination, getPagingData } from "./utils/user";
import {
  IGetUserAuthInfoRequest,
  IUserResponse
} from "../interfaces/user.interfaces";
import { checkAndHandleErrors } from "./utils/errorHandlers/checkAndHandleErrors";
import {
  checkMissingParameters,
  checkTypeOf
} from "../helpers/checkParameters";
import httpStatusCodes from "./utils/errorHandlers/httpCodes";
import { courses } from "../helpers/coursesTag";

class UserController {
  public static async getUser(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<any> {
    const id = req.params.id;

    try {
      const response = await UserService.getUser(Number(id));
      res.status(200).json(ok({ data: response }));
    } catch (err) {
      checkAndHandleErrors(err, next);
    }
  }
  public static async getUserByEmail(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<any> {
    const email = req.params.email;
    try {
      const user = await UserService.getUserByEmail(email);
      if (!user) {
        throw new Api404Error("user email not found");
      }
      return res.status(200).json(ok({ data: user }));
    } catch (err) {
      checkAndHandleErrors(err, next);
    }
  }

  public static async addUser(req: Request, res: Response, next: NextFunction) {
    const requiredParameters = ["email", "firstName", "lastName"];
    checkMissingParameters(req.body, requiredParameters);

    const { email, firstName, lastName, roles, password } = req.body;
    const secretKey = "2c4d81aab2c04a86ba9f7b199bfac054";
    try {
      if (roles?.length && !roles.every((id: number) => id === +id))
        throw new Api400Error("The roles ids passed by body must be numbers");

      const student = await UserService.addUser({
        firstName,
        lastName,
        email,
        password,
        secretKey,
        roles
      });
      res.status(201).json(created({ data: student }));
    } catch (err) {
      checkAndHandleErrors(err, next);
    }
  }

  public static async getOrCreateUsers(
    req: Request<
      Record<string, unknown>,
      void,
      { idsOrEmails: (string | number)[] }
    >,
    res: Response,
    next: NextFunction
  ) {
    const requiredParameters = ["idsOrEmails"];
    checkMissingParameters(req.body, requiredParameters);

    const { idsOrEmails } = req.body;

    try {
      const createdAndFoundUsers = await UserService.getOrCreateUsers({
        idsOrEmails
      });

      res.status(201).json(created({ data: createdAndFoundUsers }));
    } catch (err) {
      checkAndHandleErrors(err, next);
    }
  }

  public static async getUsersByIds(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      checkMissingParameters(req.body, ["users"]);

      const { page, size, discordId, active } = req.query;
      const { limit, offset } = getPagination(page, size);
      const search = req.query?.search as string;
      const usersId: number[] = req.body.users;

      if (discordId && typeof discordId !== "string")
        throw new Api400Error("The discord id passed by query must be string");

      if (active && typeof active !== "string")
        throw new Api400Error("The active passed by query must be string");

      if (!usersId.every((id) => id === +id))
        throw new Api400Error("The ids passed by parameters must be numbers");

      const users = await UserService.getUsersById(
        usersId,
        search,
        discordId,
        active,
        limit,
        offset
      );
      const response = getPagingData({ data: users, limit, page });
      res.status(httpStatusCodes.OK).send(
        ok({
          data: response,
          message: "users found successfully"
        })
      );
    } catch (err) {
      checkAndHandleErrors(err, next);
    }
  }

  public static async getAllUsers(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<any> {
    try {
      const {
        page,
        size,
        search,
        discordId,
        active,
        exact,
        ignorePagination
      } = req.query;
      const { limit, offset } = getPagination(page, size, !!ignorePagination);

      if (discordId && typeof discordId !== "string")
        return res.status(400).send("discordId parameter must be a string");
      if (active && typeof active !== "string")
        return res.status(400).send("active parameter must be a string");

      const data = await UserService.getAllUsers({
        limit,
        offset,
        search: decodeURIComponent(search as string),
        discordId,
        active,
        exact: !!exact
      });
      const response = getPagingData({ data, limit, page });

      res.status(200).json(ok({ data: response }));
    } catch (err) {
      checkAndHandleErrors(err, next);
    }
  }

  public static async updateUser(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<any> {
    const id = req.params.id;

    try {
      const response = await UserService.updateUser("id", Number(id), req.body);
      res.status(200).json(ok({ data: response }));
    } catch (err) {
      checkAndHandleErrors(err, next);
    }
  }

  public static async updateUserByEmail(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<any> {
    const email = req.params.email;

    try {
      const response = await UserService.updateUser(
        "email",
        email.toLowerCase(),
        req.body
      );
      res.status(200).json(ok({ data: response }));
    } catch (err) {
      checkAndHandleErrors(err, next);
    }
  }

  public static async deleteUser(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<any> {
    const id = req.params.id;

    try {
      await UserService.deleteUser(Number(id));
      res.status(204).json(noContent());
    } catch (err) {
      checkAndHandleErrors(err, next);
    }
  }

  public static async login(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<any> {
    const { password, email } = req.body;

    try {
      // tslint:disable-next-line: no-shadowed-variable
      const userEmail = email.toLowerCase();
      const {
        message,
        token,
        resetPassword,
        isActive
      } = await UserService.login(password, userEmail);

      if (resetPassword) return res.sendStatus(205);

      res
        .status(200)
        .cookie("token", token, { httpOnly: true })
        .json(ok({ data: { token, email: userEmail, isActive }, message }));
    } catch (err) {
      checkAndHandleErrors(err, next);
    }
  }

  public static async me(
    req: IGetUserAuthInfoRequest,
    res: Response,
    next: NextFunction
  ): Promise<any> {
    try {
      if (!req.userData || !req.userData.id)
        throw new Api401Error("You are not logged in");
      const user = await UserService.getUser(req.userData.id);
      res.status(200).json(ok({ data: user }));
    } catch (err) {
      checkAndHandleErrors(err, next);
    }
  }

  public static async activateAccount(
    req: IGetUserAuthInfoRequest,
    res: Response,
    next: NextFunction
  ): Promise<any> {
    try {
      const requiredParameters = [
        "token",
        "firstName",
        "lastName",
        "email",
        "phone",
        "country",
        "password",
        "birthdate",
        "sex"
      ];

      checkMissingParameters(req.body, requiredParameters);

      const { token } = req.body;

      const { email, foundUser } = await UserService.validToken(token);
      if (!email) throw new Api404Error("Email no encontrado en el sistema");
      if (foundUser.active)
        throw new Api400Error("Esta cuenta ya fue activada anteriormente");

      const result = await UserService.activateAccount({
        ...req.body,
        foundUser,
        email
      });

      res.status(200).json(ok({ data: result }));
    } catch (err) {
      checkAndHandleErrors(err, next);
    }
  }

  public static async changePassword(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<any> {
    const { email } = req.params;
    const { password, confirmPassword } = req.body;

    try {
      if (!password || !confirmPassword){
        throw new Api400Error(`Fields are missing, password: ${password}, confirmPassword: ${confirmPassword}, email: ${email}`);
      }
      if (password !== confirmPassword){
        throw new Api400Error("Passwords don't match");
      }
      const user = await UserService.changePassword(email, password);

      res.status(200).json(ok({ data: user }));
    } catch (err) {
      checkAndHandleErrors(err, next);
    }
  }

  public static async resetPassword(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<any> {
    const { emails } = req.body;
    try {
      const promises = emails.map(UserService.resetPassword);
      const result = await Promise.all(promises);
      res.send({ success: true, data: result });
    } catch (err) {
      checkAndHandleErrors(err, next);
    }
  }

  public static async addRole(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<any> {
    const users: number[] = req.body.users;
    const roleIdOrTag = req.params.roleId;
    const tag = req.query.tag;
    let roleId;

    if (tag) {
      const tagToSearch = courses[roleIdOrTag];
      roleId = (await RoleService.getRole("name", tagToSearch)).id;
    } else roleId = roleIdOrTag;

    try {
      if (!users || !users.length) throw new Api400Error("Missing parameters");

      const role = await RoleService.isValidRole(Number(roleId));
      if (!role) throw new Api404Error("Role not found"); // after role refactor, this error should be thrown by role service

      const totalErrors: IUserResponse[] = [];

      const { validUsers, invalidUsers } = await UserService.validateUsers(
        users
      );

      totalErrors.push(...invalidUsers);

      if (!validUsers.length) throw new Api404Error("Users not found");

      const {
        usersWithRole,
        usersWithoutRole
      } = await UserService.validateUsersRole(validUsers, Number(roleId));

      totalErrors.push(...usersWithRole);

      const usersToAddRole = usersWithoutRole.map(
        (user: IUserResponse) => user.userId
      );

      if (!usersToAddRole.length) return res.status(204).json(noContent());

      const { successes, errors } = await UserService.addRoleToUsers(
        usersToAddRole,
        Number(roleId)
      );

      totalErrors.push(...errors);

      res.status(201).json(
        created({
          data: successes,
          errors: totalErrors
        })
      );
    } catch (err) {
      checkAndHandleErrors(err, next);
    }
  }

  public static async removeRole(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<any> {
    const users: number[] = req.body.users;
    const roleIdOrTag = req.params.roleId;
    const tag = req.query.tag;
    let roleId;

    if (tag) {
      const tagToSearch = courses[roleIdOrTag];
      roleId = (await RoleService.getRole("name", tagToSearch)).id;
    } else roleId = roleIdOrTag;

    try {
      if (!users || !users.length) throw new Api400Error("Missing parameters");

      const role = await RoleService.isValidRole(Number(roleId));
      if (!role) throw new Api404Error("Role not found"); // after role refactor, this error should be thrown by role service

      const totalErrors: IUserResponse[] = [];

      const { validUsers, invalidUsers } = await UserService.validateUsers(
        users
      );

      totalErrors.push(...invalidUsers);

      if (!validUsers.length) throw new Api404Error("Users not found");

      const {
        usersWithRole,
        usersWithoutRole
      } = await UserService.validateUsersRole(validUsers, Number(roleId));

      totalErrors.push(...usersWithoutRole);

      const usersToRemoveRole = usersWithRole.map(
        (user: IUserResponse) => user.userId
      );

      if (!usersToRemoveRole.length) return res.status(204).json(noContent());
      const { successes, errors } = await UserService.removeRoleFromeUsers(
        usersToRemoveRole,
        Number(roleId)
      );

      totalErrors.push(...errors);

      res.status(200).json(
        created({
          data: successes,
          errors: totalErrors
        })
      );
    } catch (err) {
      checkAndHandleErrors(err, next);
    }
  }

  public static async findUsersByRole(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<any> {
    const roleId = Number(req.params.roleId);
    const { page, size } = req.query;
    const { limit, offset } = getPagination(page, size);

    try {
      const role = await RoleService.isValidRole(roleId);
      if (!role)
        return res.status(404).json(notFound({ message: "Role not found" })); //Cant refactor until roles controller is refactored too

      const data = await UserService.getAllUsers({
        offset,
        limit,
        roleId,
        exact: false
      });

      const response = getPagingData({ data, limit, page });

      return res.status(200).json(ok({ data: response }));
    } catch (error) {
      next(error);
    }
  }

  public static async deleteUsers(
    req: IGetUserAuthInfoRequest,
    res: Response,
    next: NextFunction
  ): Promise<any> {
    try {
      if (req.userData?.id) {
        const user = await UserService.getUser(req.userData?.id);
        if (user && req.body.users?.includes(user.email)) {
          throw new Api400Error("No podes eliminarte a vos mismo");
        } else {
          const response = await UserService.deleteUsers(req.body.users);
          res.status(200).json(ok({ data: response }));
        }
      }
    } catch (err) {
      checkAndHandleErrors(err, next);
    }
  }

  public static async changeUserPasswordFromAdmin(
    req: IGetUserAuthInfoRequest,
    res: Response,
    next: NextFunction
  ): Promise<any> {
    const userId = req.params.id;
    const { newPassword } = req.body;

    try {
      if (isNaN(Number(userId)))
        throw new Api400Error("El id debe ser un número");
      if (!newPassword) throw new Api400Error("Parámetros faltantes");
      const user = await UserService.changePassword(userId, newPassword);
      res
        .status(200)
        .json(
          ok({ data: user, message: "Contraseña modificada exitosamente" })
        );
    } catch (err) {
      checkAndHandleErrors(err, next);
    }
  }

  public static async changeMyPassword(
    req: IGetUserAuthInfoRequest,
    res: Response,
    next: NextFunction
  ): Promise<any> {
    const { newPassword, actualPassword } = req.body;

    if (!req.userData?.id || !newPassword || !actualPassword)
      throw new Api400Error("Parámetros faltantes");

    const { id } = req.userData;

    try {
      const user = await UserService.getUserById(Number(id));
      if (!user) throw new Api404Error("Usuario no encontrado");

      if (!user.validatePassword(actualPassword))
        throw new Api400Error("Contraseña incorrecta");

      const result = await UserService.changePassword(
        id.toString(),
        newPassword
      );

      res
        .status(200)
        .json(
          ok({ data: result, message: "Contraseña cambiada exitosamente" })
        );
    } catch (err) {
      checkAndHandleErrors(err, next);
    }
  }

  public static async generateActivateToken(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<any> {
    try {
      const id = Number(req.body.userId);

      const user = await UserService.getUser(id);
      if (!user) throw new Api404Error("User Not Found");

      const { email } = user;

      const token = await UserService.generateActivateToken({ id, email });

      res.status(httpStatusCodes.OK).json(
        ok({
          data: token,
          message: "Activate token generated successfully."
        })
      );
    } catch (err) {
      checkAndHandleErrors(err, next);
    }
  }

  public static async updateUserRoles(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      checkMissingParameters(req.body, ["rolesId"]);
      checkMissingParameters(req.params, ["userId"]);
      checkTypeOf(req.body, "rolesId", "array");

      const { rolesId } = req.body;
      const { userId } = req.params;

      const userToUpdateId = Number(userId);

      if (Number.isNaN(userToUpdateId))
        throw new Api400Error("The user id passed by params must be number");

      if (!rolesId.every((id: number) => id === +id))
        throw new Api400Error("The roles ids passed by body must be numbers");

      const updatedUser = await UserService.updateUserRoles(
        userToUpdateId,
        rolesId
      );

      res.status(httpStatusCodes.OK).json(
        ok({
          data: updatedUser,
          message: "User roles updated successfully."
        })
      );
    } catch (err) {
      checkAndHandleErrors(err, next);
    }
  }
}

export default UserController;
