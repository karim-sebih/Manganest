import express from "express";
import authRouter from "./Auth.route.js"
import MangaRouter from "./manga.route.js";
import traductionRouter from "./traduction.route.js";
import userRouter from "./user.route.js";
import profileRouter from "./profile.route.js";
import commentRouter from "./comment.route.js";
import likeRouter from "./like.route.js";

const router = express.Router();

router.use('/auth', authRouter);
router.use('/api/manga', MangaRouter);
router.use("/translations", traductionRouter);
router.use('/user', userRouter)
router.use('/profile', profileRouter);
router.use('/comments', commentRouter);
router.use('/likes', likeRouter);


export default router;