import express from "express";
import { imageController } from "../controllers/imageController.js";
import { middleware } from "../middlewares/middleware.js";

const imageRouter = express.Router();

imageRouter.get("/", imageController.getList);
imageRouter.get("/search", imageController.search);
imageRouter.get("/:imageId", imageController.getImageInfo);

imageRouter.get("/comment/:imageId", imageController.getComment);
imageRouter.post("/comment", middleware.protect, middleware.checkCommentRequest, imageController.createComment);

imageRouter.get("/save/:imageId", middleware.protect, imageController.getSave);
imageRouter.get("/save-and-unsave/:imageId", middleware.protect, imageController.saveAndUnSave);

imageRouter.delete("/:imageId", middleware.protect, imageController.deleteImage);

export default imageRouter;
