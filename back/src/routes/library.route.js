import express from 'express';
import { getLibrary, addOrUpdateEntry, deleteEntry, getLibraryLatestChapters } from '../controllers/LibraryController.js';
import AuthMiddleware from "../middlewares/AuthMiddleware.js";

const router = express.Router();

router.get("/", AuthMiddleware, getLibrary);
router.get("/latest-chapters", AuthMiddleware, getLibraryLatestChapters);
router.post("/", AuthMiddleware, addOrUpdateEntry);
router.delete("/:mangadex_id", AuthMiddleware, deleteEntry);


export default router;

