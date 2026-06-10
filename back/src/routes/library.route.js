import express from 'express';
import { getLibrary, addOrUpdateEntry, deleteEntry } from '../controllers/LibraryController.js';
import AuthMiddleware from "../middlewares/AuthMiddleware.js";

const router = express.Router();

router.get("/manga/:id", AuthMiddleware, getLibrary);
router.post("/manga/:id", AuthMiddleware, addOrUpdateEntry);
router.delete("/manga/:id", AuthMiddleware, deleteEntry);

export default router;

