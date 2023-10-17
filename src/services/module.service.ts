import { Module, Topic } from "../models";
import { IModule, IUpdateModule } from "../interfaces/module.interfaces";

class ModuleServices {
  public static createModule(body: IModule) {
    return Module.create(body);
  }

  public static async checkModule(input: number | string) {
    const module = await Module.findOne({
      where: { [typeof input === "string" ? "slug" : "id"]: input }
    });
    if (!module)
      return {
        exist: false,
        message: "module not found"
      };

    return {
      exist: true,
      message: "successfully found"
    };
  }

  public static getModule(input: number | string) {
    return Module.findOne({
      where: { [typeof input === "string" ? "slug" : "id"]: input },
      include: [
        {
          association: Module.associations.topics,
          order: [["span", "ASC"]],
          separate: true,
          attributes: ["id", "span", "title", "slug", "visibility"],
          include: [
            {
              association: Topic.associations.contents,
              separate: true,
              order: [["span", "ASC"]],
              attributes: ["id", "span", "title", "slug", "visibility"]
            }
          ]
        },
        { association: Module.associations.resources }
      ]
    });
  }

  public static async getCourseModules(courseId: number) {
    return Module.findAll({
      where: {
        courseId
      }
    });
  }

  public static async updateModule(id: number, data: IUpdateModule) {
    await Module.update(data, { where: { id }, individualHooks: true });

    return this.getModule(id);
  }

  public static async deleteModule(id: number) {
    await Module.destroy({ where: { id } });

    return {
      message: "module removed successfully."
    };
  }

  public static async updateSpan(modules: { id: number; span: number }[]) {
    const updatePromises = modules.map(({ id, span }) =>
      Module.update({ span }, { where: { id } })
    );

    await Promise.all(updatePromises);

    return {
      message: "Modules span updated successfully."
    };
  }
}

export default ModuleServices;
