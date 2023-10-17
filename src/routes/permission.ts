import express from "express";
import PermissionController from "../controllers/permission.controller";
import MiddlewaresController from "../middlewares";

const router = express.Router();
const {
  addPermission,
  getPermission,
  updatePermission,
  getAllPermission,
  removePermission,
  addCourseToPermission,
  removeCourseToPermission
} = PermissionController;
const { isStaff } = MiddlewaresController;

router
  .route("/")
  .get(getAllPermission)
  .post(isStaff, addPermission);

router
  .route("/:id")
  .get(getPermission)
  .put(isStaff, updatePermission)
  .delete(isStaff, removePermission);

router
  .route("/:id/courses/:courseId")
  .post(isStaff, addCourseToPermission)
  .delete(isStaff, removeCourseToPermission);

export default router;
