import express from "express";
import authRouter from "./Auth.route.js"
import MangaRouter from "./manga.route.js";
import traductionRouter from "./traduction.route.js";

const router = express.Router();

router.use('/auth', authRouter);
router.use('/api/manga', MangaRouter);
router.use("/translations", traductionRouter);


export default router;