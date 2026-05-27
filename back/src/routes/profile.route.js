import UserController from "../controllers/UserController.js";
import AuthMiddleware from "../middlewares/AuthMiddleware.js";
import express from "express";

const profileRouter = express.Router();

profileRouter.get("/:id", UserController.getUserById);

profileRouter.put("/:id", UserController.updateUser);


export default profileRouter;