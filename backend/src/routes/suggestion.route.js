import { Router } from "express";
import {
  addLike,
  createSuggestion,
  getSuggestions,
  removeLike,
} from "../controllers/suggestion.controller.js";

export const suggestionRoute = Router();

suggestionRoute.route("/").get(getSuggestions).post(createSuggestion);
suggestionRoute.post("/add-like", addLike);
suggestionRoute.delete("/remove-like", removeLike);
