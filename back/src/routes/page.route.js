import express from "express"
import { CreatePage, GetPageByChapter, UpdatePage, DeletePage } from "../controllers/PageController.js"
import AuthMiddleware from "../middlewares/AuthMiddleware.js"
import upload from "../middlewares/upload.js";


const router = express.Router();

router.post("/:id/pages", AuthMiddleware, upload.array("pages", 100), CreatePage);
router.get("/chapter/:chapter_id", GetPageByChapter);
router.put("/:id", AuthMiddleware, UpdatePage);
router.delete("/:id", AuthMiddleware, DeletePage)

export default router