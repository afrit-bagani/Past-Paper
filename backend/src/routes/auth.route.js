import { Router } from "express";
import { loginUser, registerUser } from "../controllers/auth.controller.js";

export const authRoute = Router();

authRoute.post("/register", registerUser);
authRoute.post("/login", loginUser);
