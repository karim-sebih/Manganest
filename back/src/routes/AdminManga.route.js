import express from "express";
import AuthMiddleware from "../middlewares/AuthMiddleware.js";
import { GetPendingManga, ApproveManga, RejectManga } from "../controllers/Admin/AdminMangaController.js";

const router = express.Router();


router.get("/mangas/pending", AuthMiddleware, GetPendingManga);
router.put("/mangas/:id/approve", AuthMiddleware, ApproveManga);
router.put("/mangas/:id/reject", AuthMiddleware, RejectManga);

export default router;
