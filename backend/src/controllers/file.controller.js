import mongoose from "mongoose";
import mime from "mime";
import { File } from "../models/file.model.js";
import {
  uploadOnCloudinary,
  deleteFromCloudinary,
} from "../utils/cloudinary.js";

// Get all files according to folderId
export const getAllFiles = async (req, res) => {
  const { folderId } = req.params;
  const validFileId =
    folderId && mongoose.Types.ObjectId.isValid(folderId) ? folderId : null;
  try {
    const files = await File.find({ folderId: validFileId });
    if (!files) {
      return res.status(404).json({
        success: false,
        status: 404,
        message: "Files not found",
        error: "Invalid file id",
      });
    }
    return res.status(200).json({
      success: true,
      status: 200,
      message: "File fetched successfully",
      files,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      status: 500,
      message: "Can not retrive files",
      error: error.message,
    });
  }
};

// uploading file
export const uploadFile = async (req, res) => {
  const { fileName, folderId, path, visitorId } = req.body;
  const { size } = req.file;
  if (!(fileName && path)) {
    return res.status(400).json({
      success: false,
      status: 400,
      message: "File not upload",
      error: "File name and path both are required",
    });
  }
  if (!size) {
    return res.status(400).json({
      success: false,
      status: 400,
      message: "No file recieved",
      error: "File size is null",
    });
  }
  const validFileId =
    folderId && mongoose.Types.ObjectId.isValid(folderId) ? folderId : null;
  const fileType = mime.getType(req.file.path);
  try {
    const cloudinary = await uploadOnCloudinary(req.file.path);
    const file = await File.create({
      fileName,
      folderId: validFileId,
      path,
      uploadedBy: visitorId,
      public_id: cloudinary.public_id,
      url: cloudinary.secure_url,
      fileType,
      size,
    });
    res.status(201).json({
      success: true,
      status: 201,
      message: `${file.fileName} file uploaded successfully`,
      file,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      status: 500,
      message: "File upload failed",
      error: error.message,
    });
  }
};

// Renaming file
export const renameFile = async (req, res) => {
  const { fileId } = req.params;
  const { newFileName } = req.body;
  if (!(fileId && newFileName)) {
    return res.status(400).json({
      success: false,
      status: 400,
      message: "File can't be rename",
      error: "File id and file name both is require to update file name",
    });
  }
  if (!mongoose.Types.ObjectId.isValid(fileId)) {
    return res.status(400).json({
      success: false,
      status: 400,
      message: "File can't be rename",
      error: "Invalid file id, not a mongo db object id",
    });
  }
  try {
    const file = await File.findById(fileId);
    if (!file) {
      return res.status(404).json({
        success: false,
        status: 404,
        message: "File not found",
        error: "Invalid file id",
      });
    }
    file.fileName = newFileName;
    await file.save();
    return res.status(200).json({
      success: true,
      status: 200,
      message: `File name change to -> ${newFileName}`,
      file,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      status: 500,
      message: "File can't be rename",
      error: error.mesaage,
    });
  }
};

// Delete file
export const deleteFile = async (req, res) => {
  const { fileId } = req.params;
  if (!fileId) {
    return res.status(400).json({
      success: false,
      status: 400,
      mesaage: "Failed to delete file",
      error: "file id is required",
    });
  }
  if (!mongoose.Types.ObjectId.isValid(fileId)) {
    return res.status(400).json({
      success: false,
      status: 400,
      message: "Faild to delete file",
      error: "Invaild file id, not a mongo db object id",
    });
  }

  try {
    const file = await File.findById(fileId);
    if (!file) {
      return res.status(404).json({
        success: false,
        status: 404,
        message: "File not found",
        error: "Invalid file id",
      });
    }
    if (!file.public_id) {
      return res.status(500).json({
        success: false,
        status: 500,
        message: "File has no public id",
        error: "Failed to create public id on clodinary",
      });
    }
    const deleteResult = await deleteFromCloudinary(file.public_id);
    await File.findByIdAndDelete(fileId);
    res.status(200).json({
      success: true,
      status: 200,
      message: `File ${file.fileName} deleted successfully`,
      deleteResult,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      status: 500,
      message: "Error while delteing the file",
      error: error.message,
    });
  }
};
