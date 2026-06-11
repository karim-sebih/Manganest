import express from "express";
import { getProgress, saveProgress, getAllProgress } from "../controllers/ProgressController.js";
import AuthMiddleware from "../middlewares/AuthMiddleware.js";

const route = express.Router();

route.get("/", AuthMiddleware, getAllProgress);
route.get("/:mangadex_id", AuthMiddleware, getProgress);
route.post("/", AuthMiddleware, saveProgress);

export default route;