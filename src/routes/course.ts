import express from "express";
import ModuleController from "../controllers/module.controller";
import CourseController from "../controllers/course.controller";
import MiddlewaresController from "../middlewares";

const router = express.Router();

const {
  addCourse,
  getCourse,
  updateSpan,
  updateCourse,
  deleteCourse,
  getAllCourses,
  getCourseBySlug
} = CourseController;

const { getCourseModules } = ModuleController;

const { isStaff, isValidCourse, checkAccessToCourse } = MiddlewaresController;

router
  .route("/")
  .get(getAllCourses)
  .post(isStaff, addCourse);

router.get(
  "/search/:slug",
  getCourseBySlug,
  isValidCourse,
  checkAccessToCourse,
  getCourse
);

router
  .route("/:id")
  .get(isValidCourse, checkAccessToCourse, getCourse)
  .put(isStaff, isValidCourse, checkAccessToCourse, updateCourse)
  .delete(isStaff, isValidCourse, checkAccessToCourse, deleteCourse);

router.get(
  "/:id/modules",
  isValidCourse,
  checkAccessToCourse,
  getCourseModules
);

router.patch(
  "/:id/span",
  isStaff,
  isValidCourse,
  checkAccessToCourse,
  updateSpan
);

export default router;
