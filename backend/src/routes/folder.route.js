import { Router } from "express";
import { authenticate, authorize } from "../middlewares/auth.middleware.js";
import {
  createFolder,
  deleteFolder,
  getAllFolders,
  getFolderById,
  renameFolder,
} from "../controllers/folder.controller.js";

export const folderRouter = Router();

folderRouter.get("/:folderId", getFolderById);
folderRouter.get("/", getAllFolders);
folderRouter.post(
  "/create",
  authenticate,
  authorize("createFolder"),
  createFolder
);
folderRouter.patch(
  "/rename/:folderId",
  authenticate,
  authorize("renameFolder"),
  renameFolder
);
folderRouter.delete(
  "/delete/:folderId",
  authenticate,
  authorize("deleteFolder"),
  deleteFolder
);
