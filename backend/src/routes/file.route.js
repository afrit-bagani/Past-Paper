import { Router } from "express";
import { upload } from "../middlewares/multer.middleware.js";
import { authenticate, authorize } from "../middlewares/auth.middleware.js";
import {
  deleteFile,
  getAllFiles,
  uploadFile,
  renameFile,
} from "../controllers/file.controller.js";

export const fileRouter = Router();

fileRouter.get("/:folderId", getAllFiles);
fileRouter.post("/upload", upload.single("file"), uploadFile);
fileRouter.patch(
  "/rename/:fileId",
  authenticate,
  authorize("renameFile"),
  renameFile
);
fileRouter.delete(
  "/delete/:fileId",
  authenticate,
  authorize("deleteFile"),
  deleteFile
);
