import mongoose from "mongoose";
import { User } from "../models/user.model.js";

// Retrive all users
export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({ role: { $ne: "Admin" } }).select(
      "-password -refreshToken"
    );
    return res
      .status(200)
      .json({ success: true, message: "All users fetched", users });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error while fetching users",
      error: error.message,
    });
  }
};

// Approve moderator
export const approveUser = async (req, res) => {
  const { userId } = req.params;
  if (!mongoose.Types.ObjectId.isValid(userId)) {
    return res.status(402).json({
      success: false,
      status: 402,
      message: "User promote to moderator failed",
      error: "Invalid user id, user id is not a monogo db object",
    });
  }
  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.json(403).json({
        success: false,
        status: 403,
        message: "User not found",
        data: "Invalid user Id",
      });
    }
    user.role = "Moderator";
    await user.save();
    return res.status(200).json({
      success: true,
      status: 200,
      message: "User has been approve to moderator",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      status: 500,
      message: "Error while approving user to moderator",
      error: error.message,
    });
  }
};

// disapprove user
export const disapproveUser = async (req, res) => {
  const { userId } = req.params;
  if (!mongoose.Types.ObjectId.isValid(userId)) {
    return res.status(400).json({
      success: false,
      status: 400,
      message: "Moderator demote to userb request failed",
      error: "Invaild user id, user id is not a monogo db object",
    });
  }
  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        status: 404,
        message: "User not found",
        error: "Invalid user id",
      });
    }
    user.role = "User";
    await user.save();
    return res.status(200).json({
      success: true,
      status: 200,
      message: "Moderator disapprove to user",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error while disapproving moderator to user",
      error: error.message,
    });
  }
};
