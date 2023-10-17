import express from "express";
import RoleController from "../controllers/role.controller";
import MiddlewaresController from "../middlewares";

const { isStaff, checkSingleRoleAccess, isValidRole } = MiddlewaresController;
const {
  getRole,
  getRoleByTag,
  createRole,
  deleteRole,
  updateRole,
  getAllRoles,
  findUserRoles,
  addPermissionToRole,
  removePermissionToRole
} = RoleController;

const router = express.Router();

router
  .route("/")
  .get(getAllRoles)
  .post(isStaff, createRole);

router.route("/tags/:tag").get(isStaff, getRoleByTag);

router
  .route("/:id")
  .get(isValidRole, checkSingleRoleAccess, getRole)
  .put(isStaff, isValidRole, checkSingleRoleAccess, updateRole)
  .delete(isStaff, isValidRole, checkSingleRoleAccess, deleteRole);

router
  .route("/:id/permissions/:permissionId")
  .post(isStaff, isValidRole, checkSingleRoleAccess, addPermissionToRole)
  .delete(isStaff, isValidRole, checkSingleRoleAccess, removePermissionToRole);

router.get("/users/:userId", isStaff, findUserRoles);

export default router;
