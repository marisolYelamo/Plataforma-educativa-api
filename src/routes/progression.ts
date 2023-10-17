import express from "express";
import ProgressionController from "../controllers/progression.controller";
import MiddlewaresController from "../middlewares";

const router = express.Router();

const { isStaff } = MiddlewaresController;
const {
  getUserCompletions,
  generateUserProgression,
  getProgressionUsers,
  removeUserProgression,
  getCourseCompletions,
  getInactiveUsers
} = ProgressionController;

router
  .route("/:progressionId")
  .get(getProgressionUsers)
  .post(generateUserProgression)
  .delete(removeUserProgression);

router.get("/course/:courseId", getCourseCompletions);

router.get("/users/inactive", isStaff, getInactiveUsers);
router.get("/users/:id", getUserCompletions);

export default router;
