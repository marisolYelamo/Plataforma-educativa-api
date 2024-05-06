import express from "express";
import ContentController from "../controllers/content.controller";
import MiddlewaresController from "../middlewares";

const { isStaff } = MiddlewaresController;

const router = express.Router();

const {
  getContent,
  updateSpan,
  createContent,
  deleteContent,
  updateContent,
  rankContent
} = ContentController;

router.post("/", isStaff, createContent);
router.put("/span", isStaff, updateSpan);
router.get("/:slug", getContent);
router
  .route("/:id")
  .put(isStaff, updateContent)
  .delete(isStaff, deleteContent);

router.route("/:id/rank").post(rankContent);
export default router;
