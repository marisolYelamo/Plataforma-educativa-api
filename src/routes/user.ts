import express from "express";
import UserController from "../controllers/user.controller";
import MiddlewaresController from "../middlewares";

const { isStaff } = MiddlewaresController;

const {
  me,
  addRole,
  getUser,
  removeRole,
  updateUser,
  getAllUsers,
  deleteUsers,
  findUsersByRole,
  updateUserByEmail,
  addUser,
  getOrCreateUsers,
  getUsersByIds,
  updateUserRoles,
  getContentEntries,
  addUserEntries,
  submitChallenge,
  getChallenge
} = UserController;

const router = express.Router();

router
  .route("/")
  .get(getAllUsers)
  .post(addUser); //is staff?

router.get("/me", me);
router.post("/search", isStaff, getUsersByIds);
router.post("/populate", isStaff, getOrCreateUsers);
router.post("/bulkDelete", isStaff, deleteUsers);
router
  .route("/:id")
  .get(getUser)
  .put(updateUser);

router.put("/:userId/roles", updateUserRoles);

router.post("/:userId/challenge", submitChallenge);
router.get("/:userId/challenge/:challengeId", getChallenge);

router.get("/:id/entries", getContentEntries);

router.post("/:id/contents/:contentId", addUserEntries);

router.route("/:email/discord").patch(updateUserByEmail);

router
  .route("/roles/:roleId")
  .post(/* isStaff, */ addRole)
  .put(isStaff, removeRole)
  .get(isStaff, findUsersByRole);

export default router;
