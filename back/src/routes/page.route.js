import express from "express"
import { CreatePage } from "../controllers/PageController.js"
import AuthMiddleware from "../middlewares/AuthMiddleware.js"
import upload from "../middlewares/upload.js";


const router = Router.express();

router.post("/:id/pages", upload.array(100), AuthMiddleware, CreatePage);


export default router