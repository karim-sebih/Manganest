import express from "express";
import { CreateChapter, GetChaptersByManga, UpdateChapter, DeleteChapter } from "../controllers/ChapterController.js";
import AuthMiddleware from "../middlewares/AuthMiddleware.js";

const router = express.Router()

router.post("/", AuthMiddleware, CreateChapter);
router.get("/:id", GetChaptersByManga);
router.put("/:id", AuthMiddleware, UpdateChapter);
router.delete("/:id", AuthMiddleware, DeleteChapter);


export default router
