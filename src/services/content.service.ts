import { Content, Topic, User } from "../models";
import { IContent } from "../interfaces/content.interface";
import ServiceError from "./utils/serviceErrors";
import UserFeedback from "../models/userFeedback";

class ContentServices {
  public static createContent(body: IContent) {
    return Content.create(body);
  }

  public static async checkContent(input: string | number) {
    const content = await Content.findOne({
      where: { [typeof input === "string" ? "slug" : "id"]: input }
    });

    if (!content)
      return {
        exist: false,
        message: "content not found"
      };

    return {
      exist: true,
      message: "Content found successfully"
    };
  }

  public static async getEntriesUsers(id: number | string) {
    const contentWithEntries = await Content.findByPk(id, {
      include: {
        association: Content.associations.userEntries,
        as: "contentEntries"
      }
    });
    return contentWithEntries;
  }

  public static async getContent(input: number | string) {
    const content = await Content.findOne({
      where: { [typeof input === "string" ? "slug" : "id"]: input },
      attributes: [
        "id",
        "span",
        "title",
        "topicId",
        "visibility",
        "contentHtml",
        "contentMarkdown",
        "estimateTime",
        "trackTime"
      ]
    });

    return content;
  }

  public static async updateContent(id: number, body: IContent) {
    const [, res] = await Content.update(body, {
      where: { id },
      returning: true,
      individualHooks: true
    });

    return res[0];
  }

  public static async deleteContent(id: number) {
    await Content.destroy({ where: { id } });
    return { message: "content deleted successfully." };
  }

  public static async getContentsTopic(
    topicId: number | string,
    userId?: number | string
  ) {
    const whereCondition = userId
      ? {
          UserId: userId
        }
      : {};
    const topic = await Topic.findByPk(topicId, {
      attributes: ["id", "span", "title", "moduleId", "slug"],
      include: [
        {
          association: Topic.associations.contents,
          attributes: [
            "id",
            "span",
            "slug",
            "title",
            "topicId",
            "contentHtml",
            "contentMarkdown",
            "estimateTime",
            "trackTime"
          ],
          include: [
            {
              association: Content.associations.userFeedbacks,
              as: "userFeedbacks",
              through: {
                attributes: ["ranking"],
                as: "feedback",
                where: whereCondition
              },
              attributes: ["id"]
            }
          ]
        }
      ]
    });

    return topic;
  }

  public static async getUserContentRank(infoRanking: {
    userId: number | string;
    contentId: number | string;
  }) {
    const { contentId: ContentId, userId: UserId } = infoRanking;
    const rank = await UserFeedback.findOne({ where: { ContentId, UserId } });
    return rank;
  }

  public static async rankContent(infoRanking: {
    userId: number | string;
    contentId: number | string;
    ranking: number;
  }) {
    const { userId, contentId, ranking } = infoRanking;

    const [user, content] = await Promise.all([
      User.findByPk(userId),
      Content.findByPk(contentId)
    ]);

    if (!user || !content)
      throw new ServiceError("not_found", "User or content does not exist");

    await user?.addContentFeedback(content, { through: { ranking } });
  }

  public static async updateSpan(contents: { id: number; span: number }[]) {
    const updatePromises = contents.map(({ id, span }) =>
      Content.update({ span }, { where: { id } })
    );

    await Promise.all(updatePromises);

    return {
      message: "Contents span updated successfully."
    };
  }
}

export default ContentServices;
