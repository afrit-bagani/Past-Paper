import { Router } from "express";
import {
  approveUser,
  disapproveUser,
  getAllUsers,
} from "../controllers/user.controller.js";
import { authenticate, authorize } from "../middlewares/auth.middleware.js";

export const userRouter = Router();

userRouter.get("/", authenticate, authorize("manageModerator"), getAllUsers);
userRouter.patch(
  "/approve/:userId",
  authenticate,
  authorize("manageModerator"),
  approveUser
);
userRouter.patch(
  "/disapprove/:userId",
  authenticate,
  authorize("manageModerator"),
  disapproveUser
);
