import express from "express";
import TopicController from "../controllers/topic.controller";
import ContentControlelr from "../controllers/content.controller";
import MiddlewaresController from "../middlewares";

const router = express.Router();

const { getContentsTopicById, getContentsTopicBySlug } = ContentControlelr;
const {
  getTopic,
  updateSpan,
  createTopic,
  removeTopic,
  updateTopic
} = TopicController;
const { isStaff } = MiddlewaresController;

router.post("/", isStaff, createTopic);
router.put("/span", isStaff, updateSpan);
router.get("/slug/:slug", getContentsTopicBySlug);
router.get("/:id/contents", getContentsTopicById);
router
  .route("/:id")
  .get(getTopic)
  .put(isStaff, updateTopic)
  .delete(isStaff, removeTopic);

export default router;
