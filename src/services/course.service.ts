import { Op, InferAttributes, FindOptions } from "sequelize";

import { Course, Module, Role, Topic } from "../models";
import { getIdToModels, filterOnlyValidFields } from "../helpers/utils";
import { IPermissionsLevels } from "../interfaces/permission.interfaces";

import { ICourse, IUpdateCourse } from "../interfaces/course.interfaces";
import RoleService from "./role.service";

class CourseServices {
  public static addCourse(body: ICourse) {
    return Course.create(body);
  }

  public static async isValidCourse(id: number): Promise<boolean> {
    const course = await Course.findByPk(id);
    return !course ? false : true;
  }

  public static getCourse(
    id: number | string,
    visibility: "true" | "false" | "all" = "all"
  ) {
    const where = {
      visibility:
        visibility === "all"
          ? { [Op.or]: [true, false] }
          : { [Op.is]: visibility === "true" }
    };

    return Course.findByPk(id, {
      attributes: [
        "id",
        "span",
        "description",
        "duration",
        "image",
        "title",
        "slug"
      ],
      include: [
        {
          separate: true,
          where,
          order: [["span", "ASC"]],
          association: Course.associations.modules,
          attributes: [
            "id",
            "span",
            "type",
            "title",
            "description",
            "slug",
            "visibility"
          ],
          include: [
            {
              association: Module.associations.topics,
              where,
              order: [["span", "ASC"]],
              separate: true,
              attributes: ["id", "span", "title", "slug", "visibility"],
              include: [
                {
                  association: Topic.associations.contents,
                  where,
                  separate: true,
                  order: [["span", "ASC"]],
                  attributes: ["id", "span", "title", "slug", "visibility"]
                }
              ]
            },
            { association: Module.associations.resources }
          ]
        }
      ]
    });
  }

  public static getAllCourses({
    options
  }: {
    options: FindOptions<InferAttributes<Course>>;
  }) {
    return Course.findAll(options);
  }

  public static async updateCourse(id: number, course: IUpdateCourse) {
    const [, res] = await Course.update(course, {
      where: { id },
      returning: true
    });

    return res[0];
  }

  public static async updateSpan(id: number, span: number) {
    const courses = await Course.findAll({
      where: {
        id: { [Op.notIn]: [id] },
        span: { [Op.gte]: span }
      }
    });

    await Promise.all(
      courses.map(async (course) => {
        course.span += 1;
        await course.save();
      })
    );

    const [, res] = await Course.update(
      { span },
      { where: { id }, returning: true }
    );

    return res[0];
  }

  public static async deleteCourse(id: number) {
    return Course.destroy({ where: { id } });
  }

  public static async hasCourseAccess(userId: number, courseId: number) {
    const userRoles = await RoleService.findUserRoles(userId);
    const permissionsLevels: IPermissionsLevels = {
      isAllowed: false,
      accessLevels: []
    };

    await Promise.all(
      userRoles.map(async (role: Role) => {
        const permisos = await role.getPermissions();

        await Promise.all(
          permisos.map(async (permiso) => {
            const isValid = await permiso.hasCourse(courseId);
            if (isValid) {
              permissionsLevels.isAllowed = true;
              if (!permissionsLevels.accessLevels.includes(permiso.type))
                permissionsLevels.accessLevels.push(permiso.type);
            }
          })
        );
      })
    );

    return permissionsLevels;
  }

  public static async hasCourses(userId: number) {
    const options = { attributes: ["id"] };
    const courses = await this.getAllCourses({ options });

    const ids = getIdToModels(courses);
    const response = await this.hasCoursesHelper(userId, ids);
    const filteredCourses = filterOnlyValidFields(response);

    const parsedCourses = await Promise.all(
      filteredCourses.map(async ({ id }) => {
        const course = await this.getCourse(id);
        return course;
      })
    );

    return parsedCourses;
  }

  public static async checkContentRole(userId: number) {
    const adminOptions = {
      names: ["superadmin", "admin"],
      accessLevels: [1, 2]
    };

    const userRoles = await RoleService.findUserRoles(userId);

    const adminRoles = userRoles.filter(
      (role: Role) =>
        adminOptions.names.includes(role.name) &&
        adminOptions.accessLevels.includes(role.accessLevel)
    );

    return !!adminRoles.length;
  }

  public static async hasCoursesHelper(userId: number, courses: number[]) {
    return Promise.all(
      courses.map(async (courseId) => {
        const access = await this.hasCourseAccess(userId, courseId);
        return { id: courseId, ...access };
      })
    );
  }

  public static async getCourseId({
    key,
    value
  }: {
    key: string;
    value: string | number;
  }) {
    const course = await Course.findOne({
      where: {
        [key]: value
      }
    });

    if (!course)
      return {
        id: null,
        exist: false
      };

    return {
      exist: true,
      id: course.id
    };
  }
}

export default CourseServices;
