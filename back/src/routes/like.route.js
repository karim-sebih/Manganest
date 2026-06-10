import express from "express";
import { getLikesByChapter, addLike, removeLike } from "../controllers/LikeController.js";

const router = express.Router();

router.get("/chapter/:id", getLikesByChapter);
router.post("/chapter/:id", addLike);
router.delete("/chapter/:id", removeLike);

export default router;