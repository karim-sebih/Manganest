import express from "express";
import authRouter from "./Auth.route.js"

const router = express.Router();

router.use('/auth', authRouter)

export default router;