import express from 'express';
import { addOrUpdateEntry, deleteEntry, getUserLibrary } from '../controllers/LibraryController.js';
import AuthMiddleware from "../middlewares/AuthMiddleware.js";

const router = express.Router();

router.get("/", AuthMiddleware, getUserLibrary);
router.post("/", AuthMiddleware, addOrUpdateEntry);
router.delete("/:mangadex_id", AuthMiddleware, deleteEntry);


export default router;

