import express from "express";
import UserController from "../controllers/UserController.js";
import AuthMiddleware from "../controllers/AuthController.js";

const userRouter = express.Router();


//userRouter.use((req, res, next) => AuthMiddleware(req, res, next, ["ADMIN"])); (Je sais pas pk elle marche pas, à revoir plus tard)

userRouter.get("/", UserController.getUsers);
userRouter.get("/roles", UserController.getRoles);
userRouter.get("/:id", UserController.getUserById);
userRouter.post("/", UserController.createUser);
userRouter.delete("/:id", UserController.deleteUser);
userRouter.put("/:id", UserController.updateUser);

export default userRouter;
