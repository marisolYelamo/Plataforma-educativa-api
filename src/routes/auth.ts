import express from "express";

import UserController from "../controllers/user.controller";

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
router.post("/reset_password/:email", changePassword);

/* router.use(authMiddleware);
router.use(acl.authorize); */

router.post("/activate/token", generateActivateToken);

router.patch("/:id/password", changeUserPasswordFromAdmin);

router.patch("/myPassword", changeMyPassword);

export default router;
