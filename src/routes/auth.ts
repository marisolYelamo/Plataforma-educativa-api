import express from "express";
import acl from "../acl";
import UserController from "../controllers/user.controller";
import MiddlewaresController from "../middlewares";

const {
  validUser,
  validAccount,
  isStaff,
  authMiddleware
} = MiddlewaresController;

const {
  login,
  resetPassword,
  changePassword,
  activateAccount,
  changeUserPasswordFromAdmin,
  changeMyPassword,
  generateActivateToken
} = UserController;

const router = express.Router();

router.post("/login", login);

router.post("/activate", activateAccount);

router.post("/forgot", resetPassword);
router.post("/reset_password/:token", changePassword);

router.use(authMiddleware);
router.use(acl.authorize);

router.post(
  "/activate/token",
  validUser,
  validAccount,
  isStaff,
  generateActivateToken
);

router.patch(
  "/:id/password",
  validUser,
  validAccount,
  isStaff,
  changeUserPasswordFromAdmin
);

router.patch("/myPassword", validUser, validAccount, changeMyPassword);

export default router;
