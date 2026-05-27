import express from "express";
import authRouter from "./Auth.route.js"
import MangaRouter from "./manga.route.js";
import userRouter from "./user.route.js";
import profileRouter from "./profile.route.js";

const router = express.Router();

router.use('/auth', authRouter);
router.use('/api/manga', MangaRouter);
router.use('/user', userRouter)
router.use('/profile', profileRouter);


export default router;