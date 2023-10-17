import { Topic, User, Content, Module } from "../models";
import TopicServices from "./topic.service";
import ContentServices from "./content.service";
import ModuleServices from "./module.service";
import { IModule } from "../interfaces/module.interfaces";
import { switchProgression } from "./utils/switchProgression";
import { IContent } from "../interfaces/content.interface";
import { ITopic } from "../interfaces/topic.interfaces";
import { IStudentProgression } from "../interfaces/studentProgression.interface";

class ProgressionService {
  public static async getUserCompletions(
    user: User,
    type: "modules" | "contents" | "topics",
    courseId?: number
  ) {
    const topicfn = () => user.getTopics();
    const contentfn = async () => {
      if (courseId) {
        const contents: IContent[] = await user.getContents({
          include: [
            {
              model: Topic,
              as: "topic",
              include: [{ association: Topic.associations.module }]
            }
          ],
          where: {
            "$topic.module.courseId$": courseId
          }
        });

        return contents.sort((a, b) => {
          const firstDate = new Date(a.UserContent.updatedAt).getTime();
          const secondDate = new Date(b.UserContent.updatedAt).getTime();
          return secondDate - firstDate;
        });
      } else {
        return user.getContents();
      }
    };

    const modulefn = () => {
      if (courseId) {
        return user.getModules({
          where: { courseId },
          include: [
            {
              association: Module.associations.topics,
              include: [{ association: Topic.associations.contents }]
            }
          ]
        });
      } else {
        return user.getModules({
          include: [
            {
              association: Module.associations.topics,
              include: [{ association: Topic.associations.contents }]
            }
          ]
        });
      }
    };

    return switchProgression(type, topicfn, contentfn, modulefn);
  }

  public static async getOneUserCompletion(
    user: User,
    type: "modules" | "contents" | "topics",
    progressionId: number
  ): Promise<IStudentProgression> {
    const topicfn = async () => {
      const topic: ITopic[] = await user.getTopics({
        where: { id: progressionId }
      });
      return topic.length ? topic[0].UserTopic : null;
    };
    const contentfn = async () => {
      const content: IContent[] = await user.getContents({
        where: { id: progressionId }
      });

      return content.length ? content[0].UserContent : null;
    };
    const modulefn = async () => {
      const module: IModule[] = await user.getModules({
        where: { id: progressionId }
      });

      return module.length ? module[0].UserModule : null;
    };

    return switchProgression(type, topicfn, contentfn, modulefn);
  }

  public static async generateProgression(
    user: User,
    progressionId: number,
    type: "modules" | "contents" | "topics",
    topicId?: number,
    moduleId?: number
  ) {
    const topicfn = async () => {
      if (moduleId) {
        const [completion, module] = await Promise.all([
          user.addTopic(progressionId),
          ModuleServices.getModule(moduleId)
        ]);
        const hasCompletedModule =
          module &&
          (await ProgressionService.checkIfUserHasProgression(
            user,
            "topics",
            module.topics
          ));

        if (hasCompletedModule && module) {
          const moduleCompletation = await ProgressionService.generateProgression(
            user,
            module.id,
            "modules"
          );
          return moduleCompletation;
        } else {
          return completion;
        }
      }
    };

    const contentfn = async () => {
      if (topicId) {
        const [completion, topic] = await Promise.all([
          user.addContent(progressionId),
          TopicServices.getTopic(topicId)
        ]);

        const hasCompletedTopic =
          topic &&
          (await ProgressionService.checkIfUserHasProgression(
            user,
            "contents",
            topic.contents
          ));
        if (hasCompletedTopic && topic) {
          const topicCompletation = await ProgressionService.generateProgression(
            user,
            topic.id,
            "topics",
            topic.id,
            topic.moduleId
          );
          return topicCompletation;
        } else {
          return completion;
        }
      }
    };
    const modulefn = async () => {
      const moduleCompletation = await user.addModule(progressionId);
      return { module: moduleCompletation, hasCompletedModule: true };
    };
    return await switchProgression(type, topicfn, contentfn, modulefn);
  }

  public static async checkIfProgressionExists(
    progressionId: number,
    type: "modules" | "contents" | "topics"
  ) {
    const topicfn = () => TopicServices.getTopic(progressionId);
    const contentfn = () => ContentServices.getContent(progressionId);
    const modulefn = () => ModuleServices.getModule(progressionId);

    return switchProgression(type, topicfn, contentfn, modulefn);
  }

  public static async getProgressionUsers(
    progression: Topic | Content | Module
  ) {
    return progression.getUsers();
  }

  public static async removeUserProgression(
    user: User,
    progressionId: number,
    type: "modules" | "contents" | "topics"
  ) {
    const topicfn = () => user.removeTopic(progressionId);
    const contentfn = () => user.removeContent(progressionId);
    const modulefn = () => user.removeModule(progressionId);

    return switchProgression(type, topicfn, contentfn, modulefn);
  }

  public static async checkIfUserHasProgression(
    user: User,
    type: "modules" | "contents" | "topics",
    progression: any
  ) {
    const topicfn = () => user.hasTopic(progression);
    const contentfn = () => user.hasContents(progression);
    const modulefn = () => user.hasModules(progression);

    return switchProgression(type, topicfn, contentfn, modulefn);
  }

  public static async getInactiveContents(user: User) {
    const thirtyDaysDiff = new Date();
    thirtyDaysDiff.setDate(thirtyDaysDiff.getDate() - 30);

    const contents = await user.getContents();

    const whichActiveContents = contents.filter(
      (content: IContent) =>
        content.UserContent.updatedAt.getTime() - thirtyDaysDiff.getTime() > 0
    );

    return whichActiveContents;
  }
}

export default ProgressionService;
