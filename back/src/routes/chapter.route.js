import express from "express";
import { CreateChapter } from "../controllers/ChapterController.js";
import AuthMiddleware from "../middlewares/AuthMiddleware.js";

const router = express.Router()

router.post("/", AuthMiddleware, CreateChapter)


export default router
