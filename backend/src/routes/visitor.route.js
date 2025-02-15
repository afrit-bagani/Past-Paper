import { Router } from "express";
import {
  createNewVisitor,
  trackSessionTime,
} from "../controllers/visitor.controller.js";

export const visitorRoute = Router();

visitorRoute.post("/new-visitor", createNewVisitor);
visitorRoute.post("/session-time", trackSessionTime);
