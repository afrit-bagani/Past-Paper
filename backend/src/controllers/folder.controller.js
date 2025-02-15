import mongoose from "mongoose";
import { Folder } from "../models/folder.model.js";

// getting a folder by its id
export const getFolderById = async (req, res) => {
  const { folderId } = req.params;
  const validFolderId =
    folderId && mongoose.Types.ObjectId.isValid(folderId) ? folderId : null;
  try {
    const folder = await Folder.findById(validFolderId);
    if (!folder) {
      return res.status(404).json({
        success: false,
        status: 404,
        message: "Folder not found",
        error: "Invalid folder id",
      });
    }
    return res.status(200).json({
      success: true,
      status: 200,
      message: `${folder.folderName} found successfully`,
      folder,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      status: 500,
      message: "Error while fetching folder",
      error: error.message,
    });
  }
};

// retrive all child folder whose parentId == folderId
export const getAllFolders = async (req, res) => {
  const { parentId } = req.query;
  const validFolderId =
    parentId && mongoose.Types.ObjectId.isValid(parentId) ? parentId : null;
  try {
    const folders = await Folder.find({ parentId: validFolderId });
    if (!folders) {
      return res.status(404).json({
        success: false,
        status: 404,
        message: "Folders not found",
        error: "Invalid parentId",
      });
    }
    return res.status(200).json({
      success: true,
      status: 200,
      message: "Folders fetch successfully",
      folders,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      status: 500,
      message: "Error while fetching folders",
      error: error.message,
    });
  }
};

// creating a folder
export const createFolder = async (req, res) => {
  const { folderName, parentId, path } = req.body;

  if (!(folderName && path)) {
    return res.status(400).json({
      success: false,
      status: 400,
      message: "Folder not created",
      error: "Folder name and path are required",
    });
  }
  const normalizedFolderName = folderName
    .trim()
    .replace(/\s+/g, " ")
    .toLowerCase();

  try {
    const duplicates = await Folder.aggregate([
      {
        // Match only the folders under the same parent (or null for root folders)
        $match: {
          parentId: parentId || null,
        },
      },
      {
        // Add a field "normalizedName" computed from folderName
        $addFields: {
          normalizedName: {
            $toLower: {
              $trim: { input: "$folderName" },
            },
          },
        },
      },
      {
        // Match documents whose normalized name equals the incoming normalized folder name
        $match: {
          normalizedName: normalizedFolderName,
        },
      },
    ]);

    if (duplicates.length > 0) {
      return res.status(400).json({
        success: false,
        status: 400,
        message: "Duplicate folder name",
        error: `A folder with the name "${folderName}" already exists in this directory.`,
      });
    }

    const folder = await Folder.create({
      folderName: folderName.trim().replace(/\s+/g, " "),
      parentId,
      path,
      createdBy: req.user._id,
    });

    res.status(201).json({
      success: true,
      status: 201,
      message: `${folder.folderName} folder created successfully`,
      data: folder,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      status: 500,
      message: "Error while creating folder",
      error: error.message,
    });
  }
};

// renaming a folder
export const renameFolder = async (req, res) => {
  const { folderId } = req.params;
  const { newFolderName } = req.body;
  if (!newFolderName) {
    return res.status(404).json({
      success: false,
      status: 404,
      message: "Folder not created",
      error: "Folder name is required",
    });
  }
  const validFolderId =
    folderId && mongoose.Types.ObjectId.isValid(folderId) ? folderId : null;
  try {
    const folder = await Folder.findById(validFolderId);
    if (!folder) {
      return res.status(404).json({
        success: false,
        status: 404,
        message: "Folder not found ",
        error: "Invalid folder id",
      });
    }
    folder.folderName = newFolderName;
    await folder.save();
    return res.status(200).json({
      success: true,
      status: 200,
      message: `Folder rename to ${folder.folderName}`,
      folder,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      status: 500,
      message: "Error while renaming folder name",
      error: error.message,
    });
  }
};

// Deleting a folder
export const deleteFolder = async (req, res) => {
  const { folderId } = req.params;
  if (!folderId) {
    return res.status(400).json({
      success: false,
      status: 400,
      message: "Folder not deleted",
      error: "Folder id not received",
    });
  }
  const validFolderId =
    folderId && mongoose.Types.ObjectId.isValid(folderId) ? folderId : null;
  try {
    const folder = await Folder.findByIdAndDelete(validFolderId);
    if (!folder) {
      return res.status(400).json({
        success: false,
        status: 400,
        message: "Folder not deleted",
        error: "Invalid folder id",
      });
    }
    return res.status(200).json({
      success: true,
      status: 200,
      message: `Folder ${folder.folderName} deleted successfully`,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      status: 500,
      message: "Error while deleting folder",
      error: error.message,
    });
  }
};
