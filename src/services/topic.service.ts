import { Topic } from "../models";
import { ITopic } from "../interfaces/topic.interfaces";

class TopicServices {
  public static createTopic(body: ITopic) {
    return Topic.create(body);
  }

  public static async checkTopic({
    key,
    value
  }: {
    key: string;
    value: number | string;
  }) {
    const topic = await Topic.findOne({
      where: {
        [key]: value
      }
    });

    if (!topic)
      return {
        exist: false,
        message: "topic not found"
      };

    return {
      exist: true,
      message: "successfully found"
    };
  }

  public static async getTopic(id: number) {
    const topic = await Topic.findByPk(id, {
      attributes: ["id", "span", "title", "moduleId", "slug", "visibility"],
      include: {
        association: Topic.associations.contents,
        separate: true,
        order: [["span", "ASC"]],
        attributes: ["id", "span", "title", "slug", "visibility"]
      }
    });

    return topic;
  }

  public static async getTopicsModule(moduleId: number) {
    return Topic.findAll({
      where: { moduleId },
      attributes: ["id", "span", "title", "moduleId", "slug"],
      include: {
        association: Topic.associations.contents,
        attributes: ["id", "span", "title", "contentHtml", "contentMarkdown"]
      }
    });
  }

  public static async updateTopic(id: number, body: ITopic) {
    await Topic.update(body, { where: { id }, individualHooks: true });

    return this.getTopic(id);
  }

  public static async deleteTopic(id: number) {
    await Topic.destroy({ where: { id } });
    return { message: "topic removed successfully." };
  }

  public static async updateSpan(topics: { id: number; span: number }[]) {
    const updatePromises = topics.map(({ id, span }) =>
      Topic.update({ span }, { where: { id } })
    );

    await Promise.all(updatePromises);

    return {
      message: "Topics span updated successfully."
    };
  }

  public static async getTopicId(slug: string) {
    const topic = await Topic.findOne({
      where: {
        slug
      }
    });

    if (!topic) throw new Error("not found");

    return topic.id;
  }
}

export default TopicServices;
