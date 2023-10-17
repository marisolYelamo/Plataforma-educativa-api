import express from "express";

import MiddlewaresController from "../middlewares";
import TopicController from "../controllers/topic.controller";
import ModuleController from "../controllers/module.controller";

const router = express.Router();
const {
  getModule,
  updateSpan,
  createModule,
  updateModule,
  removeModule
} = ModuleController;

const { isStaff } = MiddlewaresController;

const { getModuleTopics } = TopicController;

router.post("/", isStaff, createModule);
router.put("/span", isStaff, updateSpan);
router.get("/:id/topics", getModuleTopics);

router
  .route("/:id")
  .get(getModule)
  .put(isStaff, updateModule)
  .delete(isStaff, removeModule);

export default router;
