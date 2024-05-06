import morgan from "morgan";
import express from "express";

import acl from "../acl";
import authRoutes from "./auth";
import userRoutes from "./user";
import roleRoutes from "./role";
import topicRoutes from "./topic";
import moduleRoutes from "./module";
import courseRoutes from "./course";
import contentRoutes from "./content";
import permissionRoutes from "./permission";
import progressionRoutes from "./progression";

import MiddlewaresController from "../middlewares";

const router = express.Router();
const { validAccount, validUser, authMiddleware } = MiddlewaresController;

router.use("/ping", (_req, res) => res.send("ok"));

// log after health check
router.use(morgan("dev"));

router.use("/auth", authRoutes);

router.use(authMiddleware);
/* router.use(acl.authorize); */
router.use("/users",/*  validUser, validAccount, */ userRoutes);
router.use("/roles", /* validUser, validAccount, */ roleRoutes);
router.use("/topics", /* validUser, validAccount, */ topicRoutes);
router.use("/modules", /* validUser, validAccount, */ moduleRoutes);
router.use("/courses", /* validUser, validAccount, */ courseRoutes);
router.use("/contents",/*  validUser, validAccount, */ contentRoutes);
router.use("/permissions", /* validUser, validAccount, */ permissionRoutes);
router.use("/progression", /* validUser, validAccount, */ progressionRoutes);

export default router;
