import express from "express"
import { CreateManga } from "../controllers/SelfMangaController.js";
import AuthMiddleware from "../middlewares/AuthMiddleware.js";

const router = express.Router();

router.post("/", AuthMiddleware, CreateManga);


export default router;