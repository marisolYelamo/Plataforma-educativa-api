import ProgressionController from "./progression.controller";
import ProgressionService from "../services/progression.service";
import UserService from "../services/user.service";
import CourseServices from "../services/course.service";

jest.mock("../services/progression.service");
jest.mock("../services/user.service");
jest.mock("../services/course.service");

let sendMock;
let statusMock;
let res;
let next;

describe("Progression controller", () => {
  beforeEach(async () => {
    sendMock = jest.fn();
    statusMock = jest.fn();
    res = { status: statusMock, send: sendMock };
    next = (err) => {
      return { status: 500, message: err };
    };
    statusMock.mockImplementation(() => res);
  });

  describe("Get User Completions method", () => {
    const mock = ProgressionService.getUserCompletions.mockImplementation(
      () => {}
    );

    it("Should return 400 if type is missing", async () => {
      const req = { params: { id: 5 }, query: {} };
      await ProgressionController.getUserCompletions(req, res, next);
      expect(mock).toHaveBeenCalledTimes(0);
      expect(statusMock).toHaveBeenLastCalledWith(400);
    });

    it("Should return 400 if id is missing", async () => {
      const req = { params: {}, query: { type: "topics" } };
      await ProgressionController.getUserCompletions(req, res, next);
      expect(mock).toHaveBeenCalledTimes(0);
      expect(statusMock).toHaveBeenLastCalledWith(400);
    });

    it("Should return 404 if user is not found", async () => {
      const userMock = UserService.getUser.mockImplementationOnce(() => null);
      const req = { params: { id: 5 }, query: { type: "topics" } };
      await ProgressionController.getUserCompletions(req, res, next);
      expect(mock).toHaveBeenCalledTimes(0);
      expect(statusMock).toHaveBeenLastCalledWith(404);
    });

    it("Returns status code 200 if no problems are found", async () => {
      const userMock = UserService.getUser.mockImplementationOnce(() => ({
        name: "Santi",
        lastName: "Santucho",
      }));
      const req = { params: { id: 1234 }, query: { type: "topics" } };
      await ProgressionController.getUserCompletions(req, res, next);
      expect(mock).toHaveBeenCalledTimes(1);
      expect(statusMock).toHaveBeenLastCalledWith(200);
    });

    it("Should return 400 if type is wrong", async () => {
      try {
        const failedService = ProgressionService.getUserCompletions.mockImplementationOnce(
          () => {
            throw Error("Falta el tipo de progreso");
          }
        );
        const userMock = UserService.getUser.mockImplementationOnce(() => ({
          name: "Santi",
          lastName: "Santucho",
        }));
        const req = { params: { id: 1234 }, query: { type: "anytype!" } };
        const prueba = await ProgressionController.getUserCompletions(
          req,
          res,
          next
        );

        throw Error("forced error");
      } catch (error) {
        expect(statusMock).toHaveBeenLastCalledWith(400);
      }
    });
  });

  describe("Generate User Progression method", () => {
    const mock = ProgressionService.generateProgression.mockImplementation(
      () => {}
    );

    const addCountMock = ProgressionService.addCountToProgression.mockImplementation(
      () => {}
    );
    it("Should return 400 if type is missing", async () => {
      const req = {
        userData: { id: 1234 },
        params: { progressionId: 5 },
        query: {},
      };
      await ProgressionController.generateUserProgression(req, res, next);
      expect(mock).toHaveBeenCalledTimes(0);
      expect(statusMock).toHaveBeenLastCalledWith(400);
    });

    it("Should return 400 if id is missing", async () => {
      const req = {
        userData: {},
        params: { progressionId: 4321 },
        query: { type: "topics" },
      };
      await ProgressionController.generateUserProgression(req, res, next);
      expect(mock).toHaveBeenCalledTimes(0);
      expect(statusMock).toHaveBeenLastCalledWith(400);
    });

    it("Should return 400 if progressionId is missing", async () => {
      const req = {
        userData: { id: 1234 },
        params: {},
        query: { type: "topics" },
      };
      await ProgressionController.generateUserProgression(req, res, next);
      expect(mock).toHaveBeenCalledTimes(0);
      expect(statusMock).toHaveBeenLastCalledWith(400);
    });

    it("Should return 404 if user is not found", async () => {
      const userMock = UserService.getUser.mockImplementationOnce(() => null);
      const progressionMock = ProgressionService.checkIfProgressionExists.mockImplementationOnce(
        () => ({ title: "sometitle" })
      );
      const req = {
        userData: { id: 5 },
        params: { progressionId: 4321 },
        query: { type: "topics" },
      };
      await ProgressionController.generateUserProgression(req, res, next);
      expect(mock).toHaveBeenCalledTimes(0);
      expect(statusMock).toHaveBeenLastCalledWith(404);
    });

    it("Should return 404 if progression is not found", async () => {
      const userMock = UserService.getUser.mockImplementationOnce(() => ({
        name: "Santi",
      }));
      const progressionMock = ProgressionService.checkIfProgressionExists.mockImplementationOnce(
        () => null
      );
      const req = {
        userData: { id: 1234 },
        params: { progressionId: 5 },
        query: { type: "topics" },
      };
      await ProgressionController.generateUserProgression(req, res, next);
      expect(mock).toHaveBeenCalledTimes(0);
      expect(statusMock).toHaveBeenLastCalledWith(404);
    });

    it("Should return 400 if type is wrong", async () => {
      try {
        const userMock = UserService.getUser.mockImplementationOnce(() => ({
          name: "Santi",
          lastName: "Santucho",
        }));

        const progressionMock = ProgressionService.checkIfProgressionExists.mockImplementationOnce(
          () => ({ title: "sometitle" })
        );

        const failedService = ProgressionService.generateProgression.mockImplementationOnce(
          () => {
            throw Error("Falta el tipo de progreso");
          }
        );

        const oneCompletion = ProgressionService.getOneUserCompletion.mockImplementationOnce(
          () => ({
            count: 0,
          })
        );

        const req = {
          userData: { id: 1234 },
          params: { progressionId: 4321 },
          query: { type: "anytype!" },
        };
        await ProgressionController.generateUserProgression(req, res, next);
        throw Error("forced error");
      } catch (error) {
        expect(statusMock).toHaveBeenLastCalledWith(400);
      }
    });

    it("Should return 200 if no problems are found", async () => {
      const userMock = UserService.getUser.mockImplementationOnce(() => ({
        name: "Santi",
      }));
      const progressionMock = ProgressionService.checkIfProgressionExists.mockImplementationOnce(
        () => ({ title: "sometitle" })
      );

      const oneCompletion = ProgressionService.getOneUserCompletion.mockImplementationOnce(
        () => ({
          count: 0,
        })
      );
      const req = {
        userData: { id: 1234 },
        params: { progressionId: 4321 },
        query: { type: "topics" },
      };
      const progerssion = await ProgressionController.generateUserProgression(
        req,
        res,
        next
      );
      expect(statusMock).toHaveBeenLastCalledWith(200);
      expect(mock).toHaveBeenCalledTimes(2);
    });

    it("Should return 200 if no problems are found (even when it adds count)", async () => {
      const userMock = UserService.getUser.mockImplementationOnce(() => ({
        name: "Santi",
      }));
      const progressionMock = ProgressionService.checkIfProgressionExists.mockImplementationOnce(
        () => ({ title: "sometitle" })
      );

      const oneCompletion = ProgressionService.getOneUserCompletion.mockImplementationOnce(
        () => ({
          count: 1,
        })
      );
      const req = {
        userData: { id: 1234 },
        params: { progressionId: 4321 },
        query: { type: "topics" },
      };
      await ProgressionController.generateUserProgression(req, res, next);
      expect(statusMock).toHaveBeenLastCalledWith(200);
      expect(addCountMock).toHaveBeenCalledTimes(1);
    });
  });

  describe("Get progressions´ users", () => {
    const mock = ProgressionService.getProgressionUsers.mockImplementation(
      () => {}
    );

    it("Should return 400 if type is missing", async () => {
      const req = { params: { progressionId: 5 }, query: {} };
      await ProgressionController.getProgressionUsers(req, res, next);
      expect(mock).toHaveBeenCalledTimes(0);
      expect(statusMock).toHaveBeenLastCalledWith(400);
    });

    it("Should return 400 if progressionId is missing", async () => {
      const req = { params: {}, query: { type: "topics" } };
      await ProgressionController.getProgressionUsers(req, res, next);
      expect(mock).toHaveBeenCalledTimes(0);
      expect(statusMock).toHaveBeenLastCalledWith(400);
    });

    it("Should return 404 if progression is not found", async () => {
      const progressionMock = ProgressionService.checkIfProgressionExists.mockImplementationOnce(
        () => null
      );
      const req = { params: { progressionId: 5 }, query: { type: "topics" } };
      await ProgressionController.getProgressionUsers(req, res, next);
      expect(mock).toHaveBeenCalledTimes(0);
      expect(statusMock).toHaveBeenLastCalledWith(404);
    });

    it("Returns status code 200 if no problems are found", async () => {
      const progressionMock = ProgressionService.checkIfProgressionExists.mockImplementationOnce(
        () => ({
          title: "sometitle",
        })
      );
      const req = {
        params: { progressionId: 1234 },
        query: { type: "topics" },
      };
      await ProgressionController.getProgressionUsers(req, res, next);
      expect(mock).toHaveBeenCalledTimes(1);
      expect(statusMock).toHaveBeenLastCalledWith(200);
    });

    it("Should return 400 if type is wrong", async () => {
      try {
        const failedService = ProgressionService.getProgressionUsers.mockImplementationOnce(
          () => {
            throw Error("Falta el tipo de progreso");
          }
        );
        const progressionMock = ProgressionService.checkIfProgressionExists.mockImplementationOnce(
          () => ({
            title: "sometitle",
          })
        );
        const req = {
          params: { progressionId: 1234 },
          query: { type: "anytype!" },
        };
        const prueba = await ProgressionController.getProgressionUsers(
          req,
          res,
          next
        );

        throw Error("forced error");
      } catch (error) {
        expect(statusMock).toHaveBeenLastCalledWith(400);
      }
    });
  });

  describe("Remove User Progression method", () => {
    const mock = ProgressionService.removeUserProgression.mockImplementation(
      () => {}
    );

    it("Should return 400 if type is missing", async () => {
      const req = {
        userData: { id: 1234 },
        params: { progressionId: 5 },
        query: {},
      };
      await ProgressionController.removeUserProgression(req, res, next);
      expect(mock).toHaveBeenCalledTimes(0);
      expect(statusMock).toHaveBeenLastCalledWith(400);
    });

    it("Should return 400 if id is missing", async () => {
      const req = {
        userData: {},
        params: { progressionId: 4321 },
        query: { type: "topics" },
      };
      await ProgressionController.removeUserProgression(req, res, next);
      expect(mock).toHaveBeenCalledTimes(0);
      expect(statusMock).toHaveBeenLastCalledWith(400);
    });

    it("Should return 400 if progressionId is missing", async () => {
      const req = {
        userData: { id: 1234 },
        params: {},
        query: { type: "topics" },
      };
      await ProgressionController.removeUserProgression(req, res, next);
      expect(mock).toHaveBeenCalledTimes(0);
      expect(statusMock).toHaveBeenLastCalledWith(400);
    });

    it("Should return 404 if user is not found", async () => {
      const userMock = UserService.getUser.mockImplementationOnce(() => null);
      const progressionMock = ProgressionService.checkIfProgressionExists.mockImplementationOnce(
        () => ({ title: "sometitle" })
      );
      const req = {
        userData: { id: 5 },
        params: { progressionId: 4321 },
        query: { type: "topics" },
      };
      await ProgressionController.removeUserProgression(req, res, next);
      expect(mock).toHaveBeenCalledTimes(0);
      expect(statusMock).toHaveBeenLastCalledWith(404);
    });

    it("Should return 404 if progression is not found", async () => {
      const userMock = UserService.getUser.mockImplementationOnce(() => ({
        name: "Santi",
      }));
      const progressionMock = ProgressionService.checkIfProgressionExists.mockImplementationOnce(
        () => null
      );
      const req = {
        userData: { id: 1234 },
        params: { progressionId: 5 },
        query: { type: "topics" },
      };
      await ProgressionController.removeUserProgression(req, res, next);
      expect(mock).toHaveBeenCalledTimes(0);
      expect(statusMock).toHaveBeenLastCalledWith(404);
    });

    it("Should return 400 if type is wrong", async () => {
      try {
        const userMock = UserService.getUser.mockImplementationOnce(() => ({
          name: "Santi",
          lastName: "Santucho",
        }));

        const progressionMock = ProgressionService.checkIfProgressionExists.mockImplementationOnce(
          () => ({ title: "sometitle" })
        );

        const failedService = ProgressionService.removeUserProgression.mockImplementationOnce(
          () => {
            throw Error("Falta el tipo de progreso");
          }
        );

        const req = {
          userData: { id: 1234 },
          params: { progressionId: 4321 },
          query: { type: "anytype!" },
        };
        await ProgressionController.removeUserProgression(req, res, next);
        throw Error("forced error");
      } catch (error) {
        expect(statusMock).toHaveBeenLastCalledWith(400);
      }
    });

    it("Should return 204 if no problems are found", async () => {
      const userMock = UserService.getUser.mockImplementationOnce(() => ({
        name: "Santi",
      }));
      const progressionMock = ProgressionService.checkIfProgressionExists.mockImplementationOnce(
        () => ({ title: "sometitle" })
      );

      const req = {
        userData: { id: 1234 },
        params: { progressionId: 4321 },
        query: { type: "topics" },
      };
      const progerssion = await ProgressionController.removeUserProgression(
        req,
        res,
        next
      );
      expect(statusMock).toHaveBeenLastCalledWith(204);
      expect(mock).toHaveBeenCalledTimes(2);
    });
  });

  describe("Get course completion method", () => {
    beforeAll(() => {
      ProgressionService.getUserCompletions.mockClear();
    });
    const mock = ProgressionService.getUserCompletions.mockImplementation(
      () => {}
    );

    it("Should return 400 if type is missing", async () => {
      const req = {
        userData: { id: 1234 },
        params: { courseId: 5 },
        query: {},
      };
      await ProgressionController.getCourseCompletions(req, res, next);
      expect(mock).toHaveBeenCalledTimes(0);
      expect(statusMock).toHaveBeenLastCalledWith(400);
    });

    it("Should return 400 if id is missing", async () => {
      const req = {
        userData: {},
        params: { courseId: 4321 },
        query: { type: "topics" },
      };
      await ProgressionController.getCourseCompletions(req, res, next);
      expect(mock).toHaveBeenCalledTimes(0);
      expect(statusMock).toHaveBeenLastCalledWith(400);
    });

    it("Should return 400 if courseId is missing", async () => {
      const req = {
        userData: { id: 1234 },
        params: {},
        query: { type: "topics" },
      };
      await ProgressionController.getCourseCompletions(req, res, next);
      expect(mock).toHaveBeenCalledTimes(0);
      expect(statusMock).toHaveBeenLastCalledWith(400);
    });

    it("Should return 404 if user is not found", async () => {
      const userMock = UserService.getUser.mockImplementationOnce(() => null);
      const courseMock = CourseServices.getCourse.mockImplementationOnce(
        () => ({ title: "sometitle" })
      );
      const req = {
        userData: { id: 5 },
        params: { courseId: 4321 },
        query: { type: "topics" },
      };
      await ProgressionController.getCourseCompletions(req, res, next);
      expect(mock).toHaveBeenCalledTimes(0);
      expect(statusMock).toHaveBeenLastCalledWith(404);
    });

    it("Should return 404 if course is not found", async () => {
      const userMock = UserService.getUser.mockImplementationOnce(() => ({
        name: "Santi",
      }));
      const courseMock = CourseServices.getCourse.mockImplementationOnce(
        () => null
      );
      const req = {
        userData: { id: 1234 },
        params: { courseId: 5 },
        query: { type: "topics" },
      };
      await ProgressionController.getCourseCompletions(req, res, next);
      expect(mock).toHaveBeenCalledTimes(0);
      expect(statusMock).toHaveBeenLastCalledWith(404);
    });

    it("Should return 400 if type is wrong", async () => {
      try {
        const userMock = UserService.getUser.mockImplementationOnce(() => ({
          name: "Santi",
          lastName: "Santucho",
        }));

        const courseMock = CourseServices.getCourse.mockImplementationOnce(
          () => ({ title: "sometitle" })
        );

        const failedService = ProgressionService.getUserCompletions.mockImplementationOnce(
          () => {
            throw Error("Falta el tipo de progreso");
          }
        );

        const req = {
          userData: { id: 1234 },
          params: { courseId: 4321 },
          query: { type: "anytype!" },
        };
        await ProgressionController.getCourseCompletions(req, res, next);
        throw Error("forced error");
      } catch (error) {
        expect(statusMock).toHaveBeenLastCalledWith(400);
      }
    });

    it("Should return 200 if no problems are found", async () => {
      const userMock = UserService.getUser.mockImplementationOnce(() => ({
        name: "Santi",
      }));
      const courseMock = CourseServices.getCourse.mockImplementationOnce(
        () => ({ title: "sometitle" })
      );

      const req = {
        userData: { id: 1234 },
        params: { courseId: 4321 },
        query: { type: "topics" },
      };
      const progerssion = await ProgressionController.getCourseCompletions(
        req,
        res,
        next
      );
      expect(statusMock).toHaveBeenLastCalledWith(200);
      expect(mock).toHaveBeenCalledTimes(2);
    });
  });
});
