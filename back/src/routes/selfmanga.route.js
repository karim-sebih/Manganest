import express from "express"
import { CreateManga, GetUsersSelfManga, UpdateSelfManga, DeleteSelfManga, GetSelfMangaById } from "../controllers/SelfMangaController.js";
import AuthMiddleware from "../middlewares/AuthMiddleware.js";

const router = express.Router();

router.post("/", AuthMiddleware, CreateManga);
router.get("/", AuthMiddleware, GetUsersSelfManga);
router.get("/:id", GetSelfMangaById);
router.put("/:id", AuthMiddleware, UpdateSelfManga);
router.delete("/:id", AuthMiddleware, DeleteSelfManga);


export default router;