import express from "express";
import authRouter from "./Auth.route.js"
import MangaRouter from "./manga.route.js";

const router = express.Router();

router.use('/auth', authRouter);
router.use('/api/manga', MangaRouter);

export default router;