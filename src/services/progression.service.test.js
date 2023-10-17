const { default: ProgressionService } = require("./progression.service");
const { default: TopicServices } = require("./topic.service");
const { default: UserService } = require("./user.service");

jest.spyOn(ProgressionService, "checkIfUserHasProgression");

jest.mock("./topic.service");
jest.mock("./user.service");

describe("Progression service", () => {
  describe("Generate progression", () => {
    it("Generates topic progression if all contents are complete", async () => {
      const userMock = UserService.getUser.mockImplementationOnce(() => ({
        name: "Santi",
        addTopic: jest.fn(),
        addContent: jest.fn(),
      }));

      const user = await UserService.getUser(5);
      const hasProgress = ProgressionService.checkIfUserHasProgression.mockImplementationOnce(
        () => true
      );
      const topic = TopicServices.getTopic.mockImplementationOnce(() => ({
        title: "Sometitle",
      }));

      const result = await ProgressionService.generateProgression(
        user,
        5,
        "contents",
        8
      );

      expect(user.addTopic).toHaveBeenCalledTimes(1);
      expect(user.addContent).toHaveBeenCalledTimes(1);
    });

    it("Does not generate topic progression if not all contents are complete", async () => {
      const userMock = UserService.getUser.mockImplementationOnce(() => ({
        name: "Santi",
        addTopic: jest.fn(),
        addContent: jest.fn(),
      }));

      const user = await UserService.getUser(5);
      const hasProgress = ProgressionService.checkIfUserHasProgression.mockImplementationOnce(
        () => false
      );
      const topic = TopicServices.getTopic.mockImplementationOnce(() => ({
        title: "Sometitle",
      }));

      const result = await ProgressionService.generateProgression(
        user,
        5,
        "contents",
        8
      );

      expect(user.addContent).toHaveBeenCalledTimes(1);
      expect(user.addTopic).not.toHaveBeenCalled();
    });
  });

  describe("Get inactive users", () => {
    it("Returns only contents that have less than thirty days", async () => {
      const contents = [
        { UserContent: { updatedAt: new Date(new Date().toISOString()) } },
        {
          UserContent: {
            updatedAt: new Date(new Date(2020, 10, 12).toISOString()),
          },
        },
        {
          UserContent: {
            updatedAt: new Date(new Date(2021, 1, 12).toISOString()),
          },
        },
        { UserContent: { updatedAt: new Date(new Date().toISOString()) } },
        {
          UserContent: {
            updatedAt: new Date(new Date(2020, 5, 12).toISOString()),
          },
        },
      ];
      const userMock = UserService.getUser.mockImplementationOnce(() => ({
        name: "Santi",
        getContents: jest.fn().mockImplementationOnce(() => contents),
      }));

      const user = await UserService.getUser(5);

      const result = await ProgressionService.getInactiveContents(user);

      expect(result).toHaveLength(2);
      expect(result[0]).toEqual(contents[0]);
      expect(result[1]).toEqual(contents[3]);
    });

    it("Returns an empty array if user has no active contents", async () => {
      const contents = [
        {
          UserContent: {
            updatedAt: new Date(new Date(2020, 10, 12).toISOString()),
          },
        },
        {
          UserContent: {
            updatedAt: new Date(new Date(2021, 1, 12).toISOString()),
          },
        },
        {
          UserContent: {
            updatedAt: new Date(new Date(2020, 5, 12).toISOString()),
          },
        },
      ];
      const userMock = UserService.getUser.mockImplementationOnce(() => ({
        name: "Santi",
        getContents: jest.fn().mockImplementationOnce(() => contents),
      }));

      const user = await UserService.getUser(5);

      const result = await ProgressionService.getInactiveContents(user);

      expect(result).toHaveLength(0);
    });
  });
});
