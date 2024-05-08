import { Op, WhereOptions } from "sequelize";

import { Role, User } from "../models";
import {
  createJWT,
  decodeJWT,
  createAPIToken,
  validateAPIToken
} from "../helpers/jwt";

import { IGetAllUsers } from "./interfaces/user";
import {
  AllowUserKeysToUpdate,
  IUser,
  IUserResponse
} from "../interfaces/user.interfaces";
import { RoleInterface } from "../interfaces/role.interfaces";
import RoleService from "./role.service";
import ServiceError from "./utils/serviceErrors";

class UserService {
  public static async addUser(body: {
    email: string;
    firstName?: string;
    lastName?: string;
    password?: string;
    secretKey: string;
    roles?: number[];
  }) {
    const { roles, ...userFields } = body;
    const user = await User.create(userFields);

    if (roles?.length) {
      await user.setRoles(roles);
    }

    return user;
  }

  public static async getOrCreateUsers({
    idsOrEmails
  }: {
    idsOrEmails: (string | number)[];
  }) {
    const [emailUsers, idUsers] = await Promise.all([
      User.findAll({
        where: {
          email: idsOrEmails.filter(
            (idOrEmail) => typeof idOrEmail === "string"
          )
        }
      }),
      User.findAll({
        where: {
          id: idsOrEmails.filter((idOrEmail) => typeof idOrEmail === "number")
        }
      })
    ]);

    const foundUsers = [...emailUsers, ...idUsers];

    const usersToCreate: { email: string }[] = [];

    for (const idOrEmail of idsOrEmails) {
      if (typeof idOrEmail !== "string") continue;

      const email = idOrEmail;

      if (!foundUsers.find((user) => user.email === email)) {
        usersToCreate.push({ email });
      }
    }

    foundUsers.push(
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore TODO: Fix typing of user model in Sequelize
      ...(await User.bulkCreate(usersToCreate, {
        hooks: true,
        individualHooks: true,
        validate: true
      }))
    );

    return foundUsers;
  }

  public static async getUsersById(
    usersId: number[],
    search?: string,
    discordId?: string,
    active?: string,
    limit?: number,
    offset?: number
  ) {
    const searchFields = ["email", "firstName", "lastName"];

    const searchConditions: WhereOptions = search
      ? searchFields.map((field) => ({
          [field]: { [Op.iLike]: `%${search}%` }
        }))
      : [];

    const filtersConditions = [
      {
        name: "discordId",
        condition:
          discordId &&
          (String(discordId) === "true" ? { [Op.not]: "" } : { [Op.eq]: "" })
      },
      {
        name: "active",
        condition:
          active &&
          (String(active) === "true" ? { [Op.is]: true } : { [Op.is]: false })
      }
    ];

    const condition: any = { [Op.and]: [{ id: { [Op.in]: usersId } }] };

    if (search) {
      condition[Op.and] = [...condition[Op.and], { [Op.or]: searchConditions }];
    }

    if (discordId || active) {
      condition[Op.and] = [
        ...condition[Op.and],
        ...filtersConditions
          .filter(({ condition }) => condition)
          .map(({ name, condition }) => ({
            [name]: condition
          }))
      ];
    }

    return User.findAndCountAll({
      distinct: true,
      limit,
      offset,
      where: condition,
      attributes: [
        "firstName",
        "lastName",
        "email",
        "resetToken",
        "activeToken",
        "active",
      ]
    });
  }
        /* "phone",
        "age",
        "discordId",
        "discordTag",
        "birthdate",
        "id",
        "country",
        "city",
        "knowledge" */

  public static async checkForgotToken(
    resetToken: string
  ): Promise<{ success: boolean; userId: string }> {
    const user = await User.findOne({
      where: { resetToken }
    });

    if (!user) {
      throw new ServiceError(
        "invalid_token",
        "Token inválido. Vuelva a iniciar el proceso para reiniciar la contraseña."
      );
    }

    return {
      success: true,
      userId: "" + user?.id
    };
  }

  public static getUser(id: number, search?: string) {
    const whereClause: any = { id };

    if (search) {
      const searchFields = ["firstName", "lastName", "email"];
      whereClause[Op.or] = {};
      for (const field of searchFields) {
        whereClause[Op.or][field] = {
          [Op.iLike]: `%${search}%`
        };
      }
    }
    return User.findOne({
      where: whereClause,
      attributes: [
        "firstName",
        "lastName",
        "email",
        "resetToken",
        "activeToken",
        "active",
        "knowledge",
        "createdAt"
      ],
      include: ["paidCourses", "roles"]
    });
  }

  public static async getUserByEmail(email: string) {
    return User.findOne({
      where: {
        email
      }
    });
  }

  public static async activateAccount(userActivationInfo: {
    foundUser: User;
    password: string;
    email: string;
    firstName: string;
    lastName: string;
  }) {
    const {
      foundUser,
      password,
      email,
      ...userInfoToUpdate
    } = userActivationInfo;

    const emailAddress = email.trim().toLowerCase();

    const newPassword = foundUser.hashFunction(foundUser.salt, password);

    const updatedUser = await UserService.updateUser("email", emailAddress, {
      ...userInfoToUpdate,
      active: true,
      activeToken: "",
      password: newPassword
    });

    return updatedUser;
  }

  public static async getAllUsers({
    offset,
    limit,
    search,
    roleId,
    discordId,
    active,
    exact
  }: IGetAllUsers) {
    const searchFields = ["email", "firstName", "lastName"];

    const searchConditions: WhereOptions = search
      ? searchFields.map((field) => ({
          [field]: {
            [exact ? Op.eq : Op.iLike]: exact ? search : `%${search}%`
          }
        }))
      : [];

    const filtersConditions = [
      {
        name: "discordId",
        condition:
          discordId &&
          (String(discordId) === "true" ? { [Op.not]: "" } : { [Op.eq]: "" })
      },
      {
        name: "active",
        condition:
          active &&
          (String(active) === "true" ? { [Op.is]: true } : { [Op.is]: false })
      }
    ];

    const condition: any = {};

    if (search || discordId || active) {
      condition[Op.and] = [];
    }

    if (search) {
      condition[Op.and] = [{ [Op.or]: searchConditions }];
    }

    if (discordId || active) {
      condition[Op.and] = [
        ...condition[Op.and],
        ...filtersConditions
          .filter(({ condition }) => condition)
          .map(({ name, condition }) => ({
            [name]: condition
          }))
      ];
    }

    const details =
      roleId !== undefined
        ? [
            {
              association: User.associations.roles,
              required: true,
              where: {
                id: roleId
              }
            }
          ]
        : [
            {
              association: User.associations.roles
            }
          ];

    const users = await User.findAndCountAll({
      distinct: true,
      limit,
      offset,
      where: condition,
      attributes: [
        "id",
        "firstName",
        "lastName",
        "email",
        "discordId",
        "active"
      ],
      order: [["email", "ASC"]],
      include: details
    });

    return users;
  }

  public static async updateUser(
    field: AllowUserKeysToUpdate,
    value: IUser[AllowUserKeysToUpdate],
    body: Partial<IUser>
  ) {
    const user = await User.findOne({ where: { [field]: value } });
    if (!user)
      throw new ServiceError(
        "not_found",
        `User with ${field} ${value} doesn't exist.`
      );

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore-next-line
    await user.update(body);
    await user.save();

    return this.getUser(user.id);
  }

  public static deleteUser(id: number) {
    return User.destroy({ where: { id } });
  }

  public static async login(
    password: string,
    email: string
  ): Promise<{
    token?: string | null;
    message?: string;
    notFound?: boolean;
    resetPassword?: boolean;
    isActive?: boolean;
  }> {
    const user = await User.findOne({ where: { email } });

    if (!user)
      throw new ServiceError(
        "not_found",
        "El email ingresado no existe en el sistema"
      );

    if (user.password === "emptyPassword") {
      await UserService.resetPassword(email);

      return {
        token: null,
        resetPassword: true,
        message: "Debe restaurar la contraseña"
      };
    }

    const valid = user.validatePassword(password);
    if (!valid)
      throw new ServiceError(
        "invalid_credentials",
        "Email y/o contraseña incorrectos"
      );

    const token = createJWT(user);
    return { token, message: "success", isActive: user.active };
  }

  public static async validToken(token: string) {
    const decodedToken = decodeJWT(token);

    if (!decodedToken || !decodedToken.user)
      throw new ServiceError("invalid_token", "Tóken inválido");

    const foundUser = await this.getUserByEmail(decodedToken.user.email);

    if (!foundUser) throw new ServiceError("invalid_token", "Tóken inválido");

    const id = foundUser.id;

    validateAPIToken(token);

    return {
      email: decodedToken.user.email,
      id,
      foundUser
    };
  }

  public static async validAccount(id: number): Promise<boolean> {
    try {
      const user = await User.findByPk(id);
      return user?.active ? true : false;
    } catch (error) {
      return false;
    }
  }

  public static async changePassword(
    id: string,
    password: string
  ): Promise<User> {
    const user = await User.findByPk(id);
    if (!user) throw new ServiceError("not_found", "Usuario no encontrado");
    return user.changePassword(password);
  }

  public static async isValidUser(id: number): Promise<boolean> {
    const user = await User.findByPk(id);
    return !!user;
  }

  public static async addRole(userId: number, roleId: number) {
    const user = await User.findByPk(userId);

    if (!user) throw new ServiceError("not_found", "User not found");

    return user.addRole(roleId);
  }

  public static async removeRole(userId: number, roleId: number) {
    const user = await User.findByPk(userId);

    if (!user) throw new ServiceError("not_found", "User not found");

    return user.removeRole(roleId);
  }

  public static async validateUsers(users: number[]) {
    const invalidUsers: IUserResponse[] = [];

    const usersValidationPromises = users.map((userId: number) => {
      return this.isValidUser(userId);
    });

    const usersValidationResolved = await Promise.all(usersValidationPromises);

    const validUsers = users.filter((userId, index) => {
      const exist = usersValidationResolved[index];
      if (!exist) invalidUsers.push({ userId, message: "User not found" });
      return exist;
    });

    return {
      validUsers,
      invalidUsers
    };
  }

  public static async addRoleToUsers(
    users: number[],
    roleId: number
  ): Promise<any> {
    const errors: IUserResponse[] = [];
    const successes: IUserResponse[] = [];

    const addRolePromises = users.map(async (userId) =>
      this.addRole(userId, roleId).then(
        () => ({ userId, success: true, message: "Role added correctly" }),
        () => ({ userId, success: false, message: "Role failed to be added" })
      )
    );

    const addRoleResolved = await Promise.all(addRolePromises);

    addRoleResolved.forEach((result) => {
      if (result.success) successes.push(result);
      else errors.push(result);
    });

    return {
      successes,
      errors
    };
  }

  public static async removeRoleFromeUsers(
    users: number[],
    roleId: number
  ): Promise<any> {
    const errors: IUserResponse[] = [];
    const successes: IUserResponse[] = [];

    const removeRolePromises = users.map(async (userId) =>
      this.removeRole(userId, roleId).then(
        () => ({ userId, success: true, message: "Role removed correctly" }),
        () => ({ userId, success: false, message: "Role failed to be removed" })
      )
    );

    const removeRoleResolved = await Promise.all(removeRolePromises);

    removeRoleResolved.forEach((result) => {
      if (result.success) successes.push(result);
      else errors.push(result);
    });

    return {
      successes,
      errors
    };
  }

  public static async validateUserRole(
    user: number,
    roleId: number
  ): Promise<any> {
    const roles = await RoleService.findUserRoles(user);

    return roles.find((role: RoleInterface) => role.id === roleId);
  }

  public static async validateUsersRole(
    users: number[],
    roleId: number
  ): Promise<any> {
    const usersWithRole: IUserResponse[] = [];
    const usersWithoutRole: IUserResponse[] = [];

    const validationRolesPromises = users.map((userId) =>
      this.validateUserRole(userId, roleId)
    );

    const validatedRoles = await Promise.all(validationRolesPromises);

    validatedRoles.forEach((exist, index) => {
      if (!exist)
        usersWithoutRole.push({
          userId: Number(users[index]),
          message: "User doesn't have the selected role"
        });
      else
        usersWithRole.push({
          userId: Number(users[index]),
          message: "User has the selected role"
        });
    });

    return {
      usersWithRole,
      usersWithoutRole
    };
  }

  public static deleteUsers(users: string[]) {
    return User.destroy({ where: { email: users } });
  }

  public static async resetPassword(email: string): Promise<any> {
    email = email.trim().toLowerCase();
    const user = await UserService.getUserByEmail(email);

    if (!user)
      throw new ServiceError(
        "not_found",
        `El email ${email} no está registrado en nuestra base de datos.`
      );

    const userWithToken = await user.createResetToken();

    return userWithToken;
  }

  public static async getUserById(id: number): Promise<any> {
    return User.findByPk(id);
  }

  public static async findAllUsers(): Promise<any> {
    return User.findAll();
  }

  public static async generateActivateToken(user: {
    id: number;
    email: string;
  }) {
    const token = createAPIToken(user);

    await UserService.updateUser("id", user.id, { activeToken: token });

    return token;
  }

  public static async updateUserRoles(userId: number, rolesId: number[]) {
    const userToUpdate = await User.findByPk(userId);
    if (!userToUpdate)
      throw new ServiceError(
        "not_found",
        `El usuario con id ${userId} no está registrado en nuestra base de datos.`
      );

    await userToUpdate.setRoles(rolesId);
    const updatedUser = await User.findOne({
      where: { id: userId },
      include: { model: Role, as: "roles" }
    });
    return updatedUser;
  }
}

export default UserService;
